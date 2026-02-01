import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function handler(event) {
    try {
        if (event.httpMethod !== "GET") {
            return { statusCode: 405, body: "Method Not Allowed" };
        }

        // DEV USER (same as sync)
        const DEV_USER_ID = "00000000-0000-0000-0000-000000000001";

        const sheet = event.queryStringParameters?.sheet;
        if (!sheet) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "sheet is required" }),
            };
        }

        const { data, error } = await supabase
            .from("user_progress")
            .select("progress_json, highest_level")
            .eq("user_id", DEV_USER_ID)
            .eq("sheet", sheet)
            .single();

        if (error && error.code !== "PGRST116") {
            throw error;
        }

        return {
            statusCode: 200,
            body: JSON.stringify({
                subtopics: data?.progress_json?.subtopics || {},
                questions: data?.progress_json?.questions || {},
                highestLevel: data?.highest_level || "Novice",
            })
        };
    } catch (err) {
        console.error("getProgress error:", err);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to load progress" }),
        };
    }
}
