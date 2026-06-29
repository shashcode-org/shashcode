import { createClient } from "@supabase/supabase-js";
import { LEVEL_BADGES, awardBadgeIfNotExists } from "./_badges";
import { getUserIdFromRequest } from "./_auth";
import jwt from "jsonwebtoken";
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
  console.log("STEP 0 - Function entered");
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }

    let user_id;

    try {
      user_id = getUserIdFromRequest(event);
      console.log("STEP 1A - User from Authorization", user_id);
    } catch {
      const body = JSON.parse(event.body || "{}");
      const token = body.token;

      if (!token) throw new Error("Unauthorized");

      const decoded = jwt.decode(token);
      user_id = decoded.sub;
      console.log("STEP 1B - Falling back to token in body");
    }

    const {
      sheet,
      subtopics,
      questions,
      completedPercent,
      bucketCompletion,
      completedMainTopics = [], // 👈 IMPORTANT ADDITION
    } = JSON.parse(event.body || "{}");

    console.log("STEP 2 - Payload", {
      sheet,
      questionCount: Object.keys(questions || {}).length,
      subtopicCount: Object.keys(subtopics || {}).length,
      completedPercent,
      bucketCompletion,
    });
    if (!sheet || !subtopics || !questions) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid payload" }),
      };
    }

    const isMigration =
      typeof completedPercent !== "number" || !bucketCompletion;

    const safeCompletedPercent = isMigration ? 0 : completedPercent;
    const safeBucketCompletion = isMigration ? {} : bucketCompletion;
    // if (
    //   !sheet ||
    //   !subtopics ||
    //   !questions ||
    //   typeof completedPercent !== "number" ||
    //   !bucketCompletion
    // ) {
    //   return {
    //     statusCode: 400,
    //     body: JSON.stringify({ error: "Invalid payload" }),
    //   };
    // }

    // --------------------------------------------------
    // Fetch canonical ShashCode username
    // --------------------------------------------------
    const { data: userMetaRow } = await supabase
      .from("user_meta")
      .select("meta_json")
      .eq("user_id", user_id)
      .single();
    console.log("STEP 4 - user_meta", userMetaRow);
    const { data: authUserData } = await supabase.auth.admin.getUserById(user_id);
    const authUser = authUserData?.user;
    console.log("STEP 5 - auth user", authUser?.email);
    const username =
      userMetaRow?.meta_json?.username ||
      authUser?.email?.split("@")[0] ||
      "user";
    console.log("👤 User:", { user_id, username });

    // --------------------------------------------------
    // Fetch existing highest level (LIFETIME)
    // --------------------------------------------------
    const { data: existingRow, error: fetchError } = await supabase
      .from("user_progress")
      .select("highest_level")
      .eq("user_id", user_id)
      .eq("sheet", sheet)
      .single();

    console.log("STEP 6 - Existing progress", {
      existingRow,
      fetchError,
    });

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
      completedPercent: safeCompletedPercent,
      bucketCompletion: safeBucketCompletion,
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
    console.log("STEP 8 - Badge loop");
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
        username,
        earned_count: finalLevel,
        total_badges: 4,
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
    console.log("STEP 9 - Badge loop");
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

        const awarded = await awardBadgeIfNotExists({
          supabase,
          user_id: user_id,
          badge_key: "java_pro",
          badge_name: "Java Pro",
          sheet,
          username,
          earned_count: finalLevel,
          total_badges: 4,
          metadata: {
            earned_via: "main_topic_completion",
            topics: JAVA_CORE_TOPICS,
          },
        });

        if (awarded) {
          newlyEarnedBadges.push("java_pro");
        }
      }
    }

    // --------------------------------------------------
    // Persist progress + level (UNCHANGED)
    // --------------------------------------------------
    const now = new Date().toISOString();
    console.log("STEP 10 - UPSERT START", {
      user_id,
      sheet,
      highest_level: finalLevel,
    });
    const { error: upsertError } = await supabase
      .from("user_progress")
      .upsert(
        {
          user_id: user_id,
          sheet,
          progress_json: { subtopics, questions },
          highest_level: finalLevel,
          updated_at: now,
        },
        { onConflict: ["user_id", "sheet"] }
      );

    console.log("STEP 10 - UPSERT DONE", upsertError);

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
        updated_at: now, // ✅ ADD THIS
      }),
    };
  } catch (err) {
    console.error("Function crash:", err);
    console.error(err.stack);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server error" }),
    };
  }
}
