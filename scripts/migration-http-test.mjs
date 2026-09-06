/**
 * Browser only. Open scripts/migration-popup-setup.browser.js and copy PART 1 / PART 2.
 * Logged in on https://release-v2-dev-test.netlify.app/dsa
 *
 * Node HTTP check (no popup):
 *   $env:DEV_SITE_ORIGIN="https://release-v2-dev-test.netlify.app"
 *   $env:TEST_USER_ACCESS_TOKEN="eyJ..."
 *   node scripts/migration-http-test.mjs
 */

const SHEET = "DSA";
const BLOCKED = new Set(["shashcode.com", "www.shashcode.com"]);

function userIdFromAccessToken(token) {
  const payload = token.split(".")[1];
  const json = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
  return json.sub || null;
}

function assertDev(origin) {
  const url = new URL(origin);
  const host = url.hostname.toLowerCase();
  if (BLOCKED.has(host)) throw new Error("Refusing production host");
  const ok =
    host === "localhost" ||
    host === "127.0.0.1" ||
    host.endsWith(".netlify.app") ||
    process.env.ALLOW_NON_PROD_HOST === "yes";
  if (!ok) throw new Error(`Refusing origin ${origin}`);
  return url.origin.replace(/\/$/, "");
}

async function getProgress(origin, token) {
  const res = await fetch(
    `${origin}/.netlify/functions/getProgress?sheet=${SHEET}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const json = await res.json();
  if (!res.ok) throw new Error(`getProgress ${res.status} ${JSON.stringify(json)}`);
  return json;
}

async function postSync(origin, token, body) {
  const res = await fetch(`${origin}/.netlify/functions/syncProgress`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({}));
  return { status: res.status, json };
}

function solvedIds(questions) {
  return Object.entries(questions || {})
    .filter(([, v]) => v === true || v?.value === true)
    .map(([id]) => id);
}

async function main() {
  const origin = assertDev(process.env.DEV_SITE_ORIGIN || "");
  const token = process.env.TEST_USER_ACCESS_TOKEN;
  if (!token) throw new Error("Set TEST_USER_ACCESS_TOKEN");
  const userId = userIdFromAccessToken(token);
  console.log("origin", origin);
  console.log("user_id", userId);
  console.log("sheet", SHEET);

  const before = await getProgress(origin, token);
  const beforeIds = solvedIds(before.questions);
  console.log("backup solved count", beforeIds.length);

  const mergedQuestions = {
    ...(before.questions || {}),
    __migration_probe: { value: true, updatedAt: Date.now() },
  };

  const migrateShape = {
    sheet: SHEET,
    questions: mergedQuestions,
    subtopics: before.subtopics || {},
    completedPercent: null,
    bucketCompletion: null,
    completedMainTopics: [],
  };

  const first = await postSync(origin, token, migrateShape);
  if (first.status !== 200) {
    throw new Error(`Migration-shaped POST failed ${first.status}`);
  }
  console.log("POST 1 (App handleMigration shape) 200");

  const afterFirst = await getProgress(origin, token);
  const missingAfterFirst = beforeIds.filter(
    (id) => !solvedIds(afterFirst.questions).includes(id)
  );
  if (missingAfterFirst.length) {
    console.error("FAIL  existing DSA ids missing after migration POST", missingAfterFirst);
    process.exitCode = 1;
  } else {
    console.log("PASS  existing DSA ids still present after migration-shaped POST");
  }

  const hydrationShape = {
    sheet: SHEET,
    questions: afterFirst.questions || {},
    subtopics: afterFirst.subtopics || {},
    completedPercent: typeof before.highest_level === "number" ? 10 : 0,
    bucketCompletion: { __test: 0 },
    completedMainTopics: [],
  };
  // Keep percent low-impact: use 0 so we do not award extra badges.
  hydrationShape.completedPercent = 0;

  const second = await postSync(origin, token, hydrationShape);
  if (second.status !== 200) {
    throw new Error(`Hydration-shaped POST failed ${second.status}`);
  }
  console.log("POST 2 (post-hydration shape) 200");

  const restore = await postSync(origin, token, {
    sheet: SHEET,
    questions: before.questions || {},
    subtopics: before.subtopics || {},
    completedPercent: 0,
    bucketCompletion: { __test: 0 },
    completedMainTopics: [],
  });
  if (restore.status !== 200) {
    throw new Error("Restore backup failed");
  }
  const afterRestore = await getProgress(origin, token);
  const missingRestore = beforeIds.filter(
    (id) => !solvedIds(afterRestore.questions).includes(id)
  );
  if (missingRestore.length) {
    console.error("FAIL  restore did not put backup ids back", missingRestore);
    process.exitCode = 1;
  } else {
    console.log("PASS  restored pre-test DSA snapshot (probe removed if it was only in merge)");
  }

  console.log("");
  console.log("This script does NOT test the popup, sessionStorage, or overlay.");
  console.log("It tests the two POSTs Continue triggers, without deleting your DSA row.");
  if (process.exitCode === 1) {
    console.log("RESULT  FAIL");
    process.exit(1);
  }
  console.log("RESULT  PASS");
}

main().catch((err) => {
  console.error("RESULT  FAIL");
  console.error(err.message || err);
  process.exit(1);
});
