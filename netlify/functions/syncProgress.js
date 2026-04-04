import { createClient } from "@supabase/supabase-js";
import { LEVEL_BADGES, awardBadgeIfNotExists } from "./_badges";
import { getUserIdFromRequest } from "./_auth";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// --------------------------------------------------
// 🔒 CANONICAL LEVEL EVALUATOR (SINGLE SOURCE OF TRUTH)
// --------------------------------------------------
function evaluateLevel({ completedPercent, bucketCompletion }) {
  const bucketValues = Object.values(bucketCompletion || {});
  const minBucket =
    bucketValues.length > 0 ? Math.min(...bucketValues) : 0;

  if (completedPercent >= 80 && minBucket >= 60) return 4; // DSA Specialist
  if (completedPercent >= 60 && minBucket >= 50) return 3; // Algorithmist
  if (completedPercent >= 40) return 2; // Problem Solver
  if (completedPercent >= 10) return 1; // Coder

  return 0; // Novice (NO BADGE)
}

export async function handler(event) {
  console.log("🔥 syncProgress HIT", {
    method: event.httpMethod,
    body: event.body,
  });

  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }

    const user_id = getUserIdFromRequest(event);

    const {
      sheet,
      subtopics,
      questions,
      completedPercent,
      bucketCompletion,
      completedMainTopics = [], // 👈 IMPORTANT ADDITION
    } = JSON.parse(event.body || "{}");

    if (
      !sheet ||
      !subtopics ||
      !questions ||
      typeof completedPercent !== "number" ||
      !bucketCompletion
    ) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid payload" }),
      };
    }

    // --------------------------------------------------
    // Fetch existing highest level (LIFETIME)
    // --------------------------------------------------
    const { data: existingRow, error: fetchError } = await supabase
      .from("user_progress")
      .select("highest_level")
      .eq("user_id", user_id)
      .eq("sheet", sheet)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      console.error("Fetch error:", fetchError);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Failed to fetch user progress" }),
      };
    }

    const storedLevel = Number(existingRow?.highest_level ?? 0);

    // --------------------------------------------------
    // Evaluate + enforce MONOTONIC
    // --------------------------------------------------
    const evaluatedLevel = evaluateLevel({
      completedPercent,
      bucketCompletion,
    });

    const finalLevel =
      evaluatedLevel > storedLevel ? evaluatedLevel : storedLevel;

    console.log("🧠 LEVEL STATE", {
      storedLevel,
      evaluatedLevel,
      finalLevel,
    });

    // --------------------------------------------------
    // 🏅 LEVEL BADGES (Coder → DSA Specialist)
    // --------------------------------------------------
    const newlyEarnedBadges = [];

    // 🔥 SINGLE LOOP (handles both backfill + new)
    for (let level = 1; level <= finalLevel; level++) {
      const badge = LEVEL_BADGES[level];
      if (!badge) continue;

      const isNewLevel = level > storedLevel;

      console.log("🏅 ATTEMPTING LEVEL BADGE", { level, badge: badge.key, isNewLevel });

      const awarded = await awardBadgeIfNotExists({
        supabase,
        user_id: user_id,
        badge_key: badge.key,
        badge_name: badge.name,
        sheet,
        metadata: {
          level,
          earned_via: isNewLevel ? "level_upgrade" : "backfill",
        },
      });

      // only show toast for NEW ones
      if (awarded && isNewLevel) {
        newlyEarnedBadges.push(badge.key);
      }
    }

    // --------------------------------------------------
    // 🏅 JAVA PRO BADGE (SIMPLE + CORRECT)
    // --------------------------------------------------
    if (sheet === "JAVA_DSA") {
      const JAVA_CORE_TOPICS = [
        "Java Basics",
        "Object Oriented Programming",
        "Exception Handling",
      ];

      const javaCoreCompleted = JAVA_CORE_TOPICS.every(topic =>
        completedMainTopics.includes(topic)
      );

      if (javaCoreCompleted) {
        console.log("🏅 JAVA PRO CONDITIONS MET");

        await awardBadgeIfNotExists({
          supabase,
          user_id: user_id,
          badge_key: "java_pro",
          badge_name: "Java Pro",
          sheet,
          metadata: {
            earned_via: "main_topic_completion",
            topics: JAVA_CORE_TOPICS,
          },
        });
      }
    }

    // --------------------------------------------------
    // Persist progress + level (UNCHANGED)
    // --------------------------------------------------
    const { error: upsertError } = await supabase
      .from("user_progress")
      .upsert(
        {
          user_id: user_id,
          sheet,
          progress_json: { subtopics, questions },
          highest_level: finalLevel,
          updated_at: new Date().toISOString(),
        },
        { onConflict: ["user_id", "sheet"] }
      );

    if (upsertError) {
      console.error("DB error:", upsertError);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: upsertError.message }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        ok: true,
        highest_level: finalLevel,
        new_badges: newlyEarnedBadges,
      }),
    };
  } catch (err) {
    console.error("Function crash:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server error" }),
    };
  }
}
