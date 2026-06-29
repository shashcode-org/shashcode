// netlify/functions/_badges.js
import { generateAndUploadBadgeImage } from "./generate-badge-image.js";

export const LEVEL_BADGES = {
  1: {
    key: "code_cadet",
    name: "Code Cadet",
  },
  2: {
    key: "algo_assassin",
    name: "Algo Assassin",
  },
  3: {
    key: "pattern_hunter",
    name: "Pattern Hunter",
  },
  4: {
    key: "dsa_dhurandhar",
    name: "DSA Dhurandhar",
  },
};

export const SPECIAL_BADGES = {
  JAVA_PRO: {
    key: "java_pro",
    name: "Java Pro",
    description: "Completed Java Core topics",
  },
};

export async function awardBadgeIfNotExists({
  supabase,
  user_id,
  badge_key,
  badge_name,
  sheet,
  username = "user",
  earned_count = 0,
  total_badges = 4,
  metadata = {},
}) {
  // console.log("➡️ awardBadgeIfNotExists", {
  //   user_id,
  //   badge_key,
  //   sheet,
  //   username,
  // });

  // Generate and upload badge image
  // let og_image_url = null;
  // try {
  //   og_image_url = await generateAndUploadBadgeImage({
  //     user_id,
  //     badge_key,
  //     username,
  //     earned_count,
  //     total_badges,
  //   });
  //   console.log(`✅ Generated OG image: ${og_image_url}`);
  // } catch (error) {
  //   console.warn(`⚠️  Failed to generate badge image: ${error.message}`);
  //   // Don't fail badge awarding if image generation fails
  // }

  const { error } = await supabase.from("user_badges").insert({
    user_id,
    badge_key,
    badge_name,
    sheet,
    metadata,
  });

  // unique violation → already earned
  if (error?.code === "23505") {
    // console.log("Badge already exists:", badge_key);
    return false;
  }

  if (error) {
    // console.error("BADGE INSERT ERROR:", error);
    throw error;
  }

  // 🔥 NOW generate image AFTER successful insert
  let og_image_url = null;

  try {
    // console.log("🚀 Generating badge image AFTER insert:", badge_key);

    og_image_url = await generateAndUploadBadgeImage({
      user_id,
      badge_key,
      username,
      earned_count,
      total_badges,
    });

    // console.log("🖼️ Generated URL:", og_image_url);

    // ✅ Update DB with image URL
    if (og_image_url) {
      await supabase
        .from("user_badges")
        .update({ og_image_url })
        .eq("user_id", user_id)
        .eq("badge_key", badge_key);

      console.log("✅ DB updated with og_image_url");
    }
  } catch (err) {
    console.warn("⚠️ Image generation failed:", err.message);
  }

  console.log("BADGE AWARDED:", badge_key);
  return true;
}
