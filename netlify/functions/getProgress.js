import { createClient } from "@supabase/supabase-js";
import { getUserIdFromRequest } from "./_auth";

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function handler(event) {
    console.log("📥 getProgress HIT", {
        method: event.httpMethod,
        query: event.queryStringParameters,
    });
    try {
        if (event.httpMethod !== "GET") {
            return { statusCode: 405, body: "Method Not Allowed" };
        }

        // 🔐 AUTH (single source)
        const user_id = getUserIdFromRequest(event);
        console.log("STEP 1 - user_id", user_id);


        const sheet = event.queryStringParameters?.sheet;
        console.log("STEP 2 - sheet", sheet);

        if (!sheet) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "sheet is required" }),
            };
        }

        console.log("STEP 3 - Querying DB");


        const { data, error } = await supabase
            .from("user_progress")
            .select("progress_json, highest_level, updated_at")
            .eq("user_id", user_id)
            .eq("sheet", sheet)
            .single();

            console.log("STEP 4 - Query result", {
                data,
                error,
            });

        // 🆕 First-time user
        if (error && error.code === "PGRST116") {
            console.log("STEP 5 - No progress found");

            return {
                statusCode: 200,
                body: JSON.stringify({
                    subtopics: {},
                    questions: {},
                    highest_level: 0,
                }),
            };
        }

        if (error) {
            console.error("STEP 5 - DB ERROR", error);
            throw error;
        }

        const payload = {
            subtopics: data.progress_json?.subtopics ?? {},
            questions: data.progress_json?.questions ?? {},
            highest_level: data?.highest_level ?? 0,
            updated_at: data?.updated_at ?? null,
        };

        console.log("STEP 6 - Returning", {
            questionCount: Object.keys(payload.questions).length,
            subtopicCount: Object.keys(payload.subtopics).length,
            highest_level: payload.highest_level,
            updated_at: payload.updated_at,
        });

        return {
            statusCode: 200,
            body: JSON.stringify(payload),
        };
    } catch (err) {
        console.error("getProgress error:", err);
        console.error(err.stack);


        return {
            statusCode: err.statusCode || 401,
            body: JSON.stringify({
                error: err.message || "Unauthorized",
            }),
        };
    }
}


