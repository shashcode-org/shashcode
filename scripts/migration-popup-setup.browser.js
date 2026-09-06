/**
 * Copy-paste into Chrome Console on
 * https://release-v2-dev-test.netlify.app/dsa  (logged in).
 * Do not run with node.
 *
 * PART 1 — arm popup without wiping real DSA ids, then reloads.
 * PART 2 — after Continue + /dsa loads, paste the second function call block.
 */

/* ===== PART 1: paste this whole IIFE ===== */
(function setupMigrationPopupTest() {
  const dsaKey = Object.keys(localStorage).find((k) =>
    /^questionProgress_[0-9a-f-]{36}_DSA$/.test(k)
  );
  if (!dsaKey) {
    console.error("No questionProgress_<userId>_DSA key. Stay logged in on /dsa.");
    return;
  }

  const userId = dsaKey.slice("questionProgress_".length, -"_DSA".length);
  const subKey = `subtopicProgress_${userId}_DSA`;
  const questions = JSON.parse(localStorage.getItem(dsaKey) || "{}");
  const subtopics = JSON.parse(localStorage.getItem(subKey) || "{}");

  localStorage.setItem("__migration_test_backup_q", JSON.stringify(questions));
  localStorage.setItem("__migration_test_backup_s", JSON.stringify(subtopics));

  localStorage.setItem(
    "questionProgress",
    JSON.stringify({
      ...questions,
      __migration_probe: { value: true, updatedAt: Date.now() },
    })
  );
  localStorage.setItem("subtopicProgress", JSON.stringify(subtopics));
  localStorage.removeItem("migration_done");
  sessionStorage.removeItem("pending_post_migration_sync");
  if (!localStorage.getItem("onboarding_done")) {
    localStorage.setItem("onboarding_done", "true");
  }

  console.log("Armed. Solved ids backed up:", Object.keys(questions).length);
  location.reload();
})();

/* ===== PART 2: after Continue, on /dsa, paste this IIFE ===== */
(function verifyMigrationPopup() {
  const dsaKey = Object.keys(localStorage).find((k) =>
    /^questionProgress_[0-9a-f-]{36}_DSA$/.test(k)
  );
  const backup = JSON.parse(localStorage.getItem("__migration_test_backup_q") || "{}");
  const current = JSON.parse(localStorage.getItem(dsaKey) || "{}");
  const backupIds = Object.keys(backup).filter(
    (id) => backup[id] === true || backup[id]?.value === true
  );
  const missing = backupIds.filter(
    (id) => !(current[id] === true || current[id]?.value === true)
  );

  console.log("migration_done", localStorage.getItem("migration_done"));
  console.log(
    "pending_post_migration_sync",
    sessionStorage.getItem("pending_post_migration_sync")
  );
  console.log("legacy questionProgress", localStorage.getItem("questionProgress"));
  console.log("missing vs backup (empty = no wipe)", missing);

  const ok =
    localStorage.getItem("migration_done") === "true" &&
    !sessionStorage.getItem("pending_post_migration_sync") &&
    missing.length === 0;

  console.log(ok ? "PASS storage" : "FAIL storage");
  console.log("Then F5, wait 3s, no clicks: Network must have 0 syncProgress.");
})();
