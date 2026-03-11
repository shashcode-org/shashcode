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

        // 🔐 AUTH (single source)
        const user_id = getUserIdFromRequest(event);

        const sheet = event.queryStringParameters?.sheet;
        if (!sheet) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "sheet is required" }),
            };
        }

        const { data, error } = await supabase
            .from("user_progress")
            .select("progress_json, highest_level, updated_at")
            .eq("user_id", user_id)
            .eq("sheet", sheet)
            .single();

        // 🆕 First-time user
        if (error && error.code === "PGRST116") {
            return {
                statusCode: 200,
                body: JSON.stringify({
                    subtopics: {},
                    questions: {},
                    highest_level: 0,
                }),
            };
        }

        if (error) throw error;

        return {
            statusCode: 200,
            body: JSON.stringify({
                subtopics: data.progress_json?.subtopics ?? {},
                questions: data.progress_json?.questions ?? {},
                highest_level: data?.highest_level ?? 0,
                updated_at: data?.updated_at ?? null,
            }),
        };
    } catch (err) {
        console.error("getProgress error:", err);

        return {
            statusCode: err.statusCode || 401,
            body: JSON.stringify({
                error: err.message || "Unauthorized",
            }),
        };
    }
}


