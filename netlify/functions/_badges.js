// netlify/functions/_badges.js

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
    metadata = {},
  }) {
    console.log("➡️ awardBadgeIfNotExists", {
      user_id,
      badge_key,
      sheet,
    });
  
    const { error } = await supabase.from("user_badges").insert({
      user_id,
      badge_key,
      badge_name,
      sheet,
      metadata,
    });
  
    // unique violation → already earned
    if (error?.code === "23505") {
      console.log("Badge already exists:", badge_key);
      return false;
    }
  
    if (error) {
      console.error("BADGE INSERT ERROR:", error);
      throw error;
    }
  
    console.log("BADGE AWARDED:", badge_key);
    return true;
  }
  