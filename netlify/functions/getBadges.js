import { createClient } from "@supabase/supabase-js";
import { getUserIdFromRequest } from "./_auth";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function handler(event) {
  try {
    if (event.httpMethod !== "GET") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }

    const user_id = getUserIdFromRequest(event);

    const { data, error } = await supabase
      .from("user_badges")
      .select("badge_key, badge_name, sheet, earned_at")
      .eq("user_id", user_id)
      .order("earned_at", { ascending: true });

    if (error) throw error;

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (err) {
    console.error("getBadges error:", err);

    return {
      statusCode: err.statusCode || 401,
      body: JSON.stringify({ error: err.message || "Unauthorized" }),
    };
  }
}
