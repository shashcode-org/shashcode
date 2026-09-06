#!/usr/bin/env node
/**
 * DEV-only concurrency probe for POST /.netlify/functions/syncProgress
 *
 * Does NOT change app code. Talks only to the origin you pass in.
 * Writes ONLY sheet CONCURRENCY_TEST for the JWT's user (not DSA / JAVA_DSA).
 *
 * Required env:
 *   DEV_SITE_ORIGIN          e.g. https://your-dev-site.netlify.app
 *                            or http://localhost:8888 for `netlify dev`
 *   TEST_USER_ACCESS_TOKEN   access_token of a dedicated TEST account
 *                            (Application → Local Storage / Network on the DEV site)
 *
 * Run (PowerShell):
 *   $env:DEV_SITE_ORIGIN="https://YOUR-DEV.netlify.app"
 *   $env:TEST_USER_ACCESS_TOKEN="eyJ..."
 *   node scripts/sync-progress-concurrency-test.mjs --mode=current
 *   node scripts/sync-progress-concurrency-test.mjs --mode=coalesced
 *
 * --mode=current    today's client: overlapping POSTs, no mutex
 * --mode=coalesced  proposed client: one in-flight POST, queue latest snapshot
 *
 * Exit 0 = all assertions for that mode passed
 * Exit 1 = mismatch / blocked URL / missing env / HTTP error
 */

function userIdFromAccessToken(token) {
  const payload = token.split(".")[1];
  if (!payload) return null;
  const json = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
  return json.sub || null;
}

const SHEET = "CONCURRENCY_TEST";
const BLOCKED_HOSTS = new Set(["shashcode.com", "www.shashcode.com"]);
const PROBE_ID = "__sync_probe";

function arg(name, fallback) {
  const prefix = `--${name}=`;
  const hit = process.argv.find((a) => a.startsWith(prefix));
  return hit ? hit.slice(prefix.length) : fallback;
}

const MODE = arg("mode", "current");
if (MODE !== "current" && MODE !== "coalesced") {
  console.error("Use --mode=current or --mode=coalesced");
  process.exit(1);
}

function assertDevOrigin(origin) {
  let url;
  try {
    url = new URL(origin);
  } catch {
    throw new Error(`DEV_SITE_ORIGIN is not a URL: ${origin}`);
  }
  const host = url.hostname.toLowerCase();
  if (BLOCKED_HOSTS.has(host)) {
    throw new Error("Refusing production host shashcode.com");
  }
  const allow = process.env.ALLOW_NON_PROD_HOST === "yes";
  const ok =
    host === "localhost" ||
    host === "127.0.0.1" ||
    host.endsWith(".netlify.app") ||
    allow;
  if (!ok) {
    throw new Error(
      `Refusing origin ${origin}. Use a *.netlify.app DEV site, localhost, or ALLOW_NON_PROD_HOST=yes`
    );
  }
  return url.origin.replace(/\/$/, "");
}

function snapshot(version, extra = {}) {
  return {
    sheet: SHEET,
    subtopics: {},
    questions: {
      [PROBE_ID]: { value: true, updatedAt: version },
      [`__sync_only_${version}`]: { value: true, updatedAt: version },
    },
    completedPercent: extra.completedPercent ?? 0,
    bucketCompletion: extra.bucketCompletion ?? { __test: 0 },
    completedMainTopics: [],
  };
}

function emptySnapshot() {
  return {
    sheet: SHEET,
    subtopics: {},
    questions: {},
    completedPercent: 0,
    bucketCompletion: { __test: 0 },
    completedMainTopics: [],
  };
}

function probeVersion(questions) {
  return questions?.[PROBE_ID]?.updatedAt ?? null;
}

async function postSync(origin, token, body) {
  const t0 = Date.now();
  const res = await fetch(`${origin}/.netlify/functions/syncProgress`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {
    json = { raw: text };
  }
  return {
    status: res.status,
    ms: Date.now() - t0,
    json,
    version: body.questions?.[PROBE_ID]?.updatedAt ?? null,
    completedPercent: body.completedPercent,
  };
}

async function getProgress(origin, token) {
  const res = await fetch(
    `${origin}/.netlify/functions/getProgress?sheet=${encodeURIComponent(SHEET)}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const json = await res.json();
  if (!res.ok) {
    throw new Error(`getProgress ${res.status}: ${JSON.stringify(json)}`);
  }
  return json;
}

async function getBadges(origin, token) {
  const res = await fetch(`${origin}/.netlify/functions/getBadges`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(`getBadges ${res.status}: ${JSON.stringify(json)}`);
  }
  return Array.isArray(json) ? json : [];
}

/** Proposed client: one in-flight request; later calls replace the queued snapshot. */
function createCoalescingPoster(origin, token) {
  let inFlight = false;
  let pending = null;
  const waiters = [];

  return async function enqueue(body) {
    pending = body;
    if (inFlight) {
      return new Promise((resolve, reject) => waiters.push({ resolve, reject }));
    }
    inFlight = true;
    let last = null;
    try {
      while (pending) {
        const next = pending;
        pending = null;
        last = await postSync(origin, token, next);
      }
      for (const w of waiters) w.resolve(last);
      waiters.length = 0;
      return last;
    } catch (err) {
      for (const w of waiters) w.reject(err);
      waiters.length = 0;
      throw err;
    } finally {
      inFlight = false;
    }
  };
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function line(ok, name, detail) {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}`);
  if (detail) console.log(`      ${detail}`);
  return ok;
}

async function main() {
  const origin = assertDevOrigin(process.env.DEV_SITE_ORIGIN || "");
  const token = process.env.TEST_USER_ACCESS_TOKEN;
  if (!token) throw new Error("Set TEST_USER_ACCESS_TOKEN");

  const userId = userIdFromAccessToken(token);
  if (!userId) throw new Error("Token has no sub (not a Supabase access_token)");

  console.log("origin     ", origin);
  console.log("mode       ", MODE);
  console.log("user_id    ", userId);
  console.log("sheet      ", SHEET);
  console.log("");

  let failed = 0;
  const send =
    MODE === "coalesced"
      ? createCoalescingPoster(origin, token)
      : (body) => postSync(origin, token, body);

  const reset = await postSync(origin, token, emptySnapshot());
  if (reset.status !== 200) {
    throw new Error(`Reset sync failed ${reset.status}: ${JSON.stringify(reset.json)}`);
  }

  // --- A: newer HTTP 200, then older POST (server last-write-wins) ---
  // Always RAW. Client coalesce cannot help once both requests are sent in order.
  const V_OLD = 1_000;
  const V_NEW = 9_000;
  const newerFirst = await postSync(origin, token, snapshot(V_NEW));
  const olderSecond = await postSync(origin, token, snapshot(V_OLD));
  const afterStale = await getProgress(origin, token);
  const staleGot = probeVersion(afterStale.questions);
  const serverProtectsNewest = staleGot === V_NEW;
  if (newerFirst.status !== 200 || olderSecond.status !== 200) {
    if (!line(false, "A  sequential newer-then-older HTTP", `new=${newerFirst.status} old=${olderSecond.status}`)) {
      failed++;
    }
  } else {
    console.log("INFO  A  sequential newer-then-older (not in --mode pass/fail)");
    console.log(
      `      newer ${newerFirst.ms}ms then older ${olderSecond.ms}ms; DB probe=${staleGot} newest=${V_NEW} SERVER_KEEPS_NEWEST=${serverProtectsNewest}`
    );
    console.log(
      "      false means the older upsert replaced the newer snapshot. The coalesced client does not fix this if both POSTs go out."
    );
  }

  await postSync(origin, token, emptySnapshot());

  // --- B: overlapping POSTs; older started first, newer started shortly after ---
  const versions = [100, 200, 300, 400, 500];
  const newest = versions[versions.length - 1];
  let responses;
  if (MODE === "current") {
    const started = [];
    started.push(postSync(origin, token, snapshot(versions[0])));
    await sleep(30);
    started.push(postSync(origin, token, snapshot(versions[1])));
    started.push(postSync(origin, token, snapshot(versions[2])));
    started.push(postSync(origin, token, snapshot(versions[3])));
    await sleep(30);
    started.push(postSync(origin, token, snapshot(newest)));
    responses = await Promise.all(started);
  } else {
    const queued = versions.map((v) => send(snapshot(v)));
    responses = await Promise.all(queued);
  }

  const afterRace = await getProgress(origin, token);
  const raceGot = probeVersion(afterRace.questions);
  const httpOk = responses.filter(Boolean).every((r) => !r || r.status === 200);
  const raceMatchesNewest = raceGot === newest;
  const racePass = httpOk && raceMatchesNewest;

  if (MODE === "current") {
    // Current client SHOULD be allowed to fail this; we still exit 1 so CI
    // treats the bug as visible. Print the observed winner.
    if (
      !line(
        racePass,
        "B  overlapping snapshots (current client = concurrent POSTs)",
        `HTTP all 200=${httpOk} timings=${responses.map((r) => `${r.version}:${r.ms}ms`).join(" ")} DB probe=${raceGot} expected=${newest}`
      )
    ) {
      failed++;
      console.log(
        "      Interpretation: FAIL here is the production race (last upsert wins, not newest)."
      );
    }
  } else if (
    !line(
      racePass,
      "B  overlapping snapshots (coalesced client = single-flight + latest)",
      `DB probe=${raceGot} expected=${newest} (only the latest queued body should be stored)`
    )
  ) {
    failed++;
  }

  await postSync(origin, token, emptySnapshot());

  // --- C: badge path — two concurrent 10% syncs; no 500; at most one code_cadet ---
  const badgesBefore = await getBadges(origin, token);
  const cadetBefore = badgesBefore.filter((b) => b.badge_key === "code_cadet").length;
  const badgeBody = snapshot(42, { completedPercent: 10, bucketCompletion: { __test: 0 } });
  const badgePosts =
    MODE === "current"
      ? await Promise.all([
          postSync(origin, token, badgeBody),
          postSync(origin, token, badgeBody),
        ])
      : await Promise.all([send(badgeBody), send({ ...badgeBody, questions: { ...badgeBody.questions } })]);

  const badgeHttpOk = badgePosts.every((r) => r && r.status === 200);
  const badgesAfter = await getBadges(origin, token);
  const cadetAfter = badgesAfter.filter((b) => b.badge_key === "code_cadet").length;
  const cadetDelta = cadetAfter - cadetBefore;
  const noDup = cadetAfter <= 1 && cadetDelta <= 1;
  const badgePass = badgeHttpOk && noDup;

  if (
    !line(
      badgePass,
      "C  concurrent 10% sync (badge insert / 23505)",
      `HTTP=${badgePosts.map((r) => r.status).join(",")} new_badges=${JSON.stringify(badgePosts.map((r) => r.json?.new_badges))} code_cadet before=${cadetBefore} after=${cadetAfter} delta=${cadetDelta}`
    )
  ) {
    failed++;
  }
  console.log(
    "      23505 is swallowed in awardBadgeIfNotExists; success = no HTTP 500 and not two code_cadet rows."
  );

  const cleanup = await postSync(origin, token, emptySnapshot());
  const afterCleanup = await getProgress(origin, token);
  const cleaned =
    cleanup.status === 200 &&
    Object.keys(afterCleanup.questions || {}).length === 0;
  if (!line(cleaned, "D  cleanup CONCURRENCY_TEST questions to {}", "")) {
    failed++;
  }
  console.log(
    "      Badges are lifetime; code_cadet is NOT removed. Use a dedicated test user."
  );

  console.log("");
  console.log(
    serverProtectsNewest
      ? "SERVER: kept newest on sequential stale write (unexpected if upsert is last-write-wins)."
      : "SERVER: sequential older POST overwrote newer snapshot (last-write-wins). Client coalesce does not prevent this if both POSTs are sent."
  );
  console.log(
    MODE === "current"
      ? "MODE current: overlapping POSTs are what the browser does today."
      : "MODE coalesced: models the proposed single-flight client; B should match newest."
  );

  if (failed) {
    console.log(`\nRESULT  FAIL  (${failed} check(s))`);
    process.exit(1);
  }
  console.log("\nRESULT  PASS");
}

main().catch((err) => {
  console.error("RESULT  FAIL");
  console.error(err.message || err);
  process.exit(1);
});
