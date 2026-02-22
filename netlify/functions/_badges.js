// netlify/functions/_badges.js

export const LEVEL_BADGES = {
    1: { key: "coder", name: "Coder" },
    2: { key: "problem_solver", name: "Problem Solver" },
    3: { key: "algorithmist", name: "Algorithmist" },
    4: { key: "dsa_specialist", name: "DSA Specialist" },
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
      console.log("ℹ️ Badge already exists:", badge_key);
      return false;
    }
  
    if (error) {
      console.error("❌ BADGE INSERT ERROR:", error);
      throw error;
    }
  
    console.log("✅ BADGE AWARDED:", badge_key);
    return true;
  }
  