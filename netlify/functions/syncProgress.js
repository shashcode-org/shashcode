import { createClient } from "@supabase/supabase-js";
import { TITLES, getLevelFromQualifies } from "@/utils/titleEngine";

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);




export async function handler(event) {
    try {
        if (event.httpMethod !== "POST") {
            return { statusCode: 405, body: "Method Not Allowed" };
        }

        // ⚠️ TEMP USER (DEV ONLY)
        // Later this will come from Netlify Identity JWT
        const DEV_USER_ID = "00000000-0000-0000-0000-000000000001";

        const body = JSON.parse(event.body || "{}");

        const { sheet, subtopics, questions } = body;

        const { data: existingRow } = await supabase
            .from("user_progress")
            .select("highest_level")
            .eq("user_id", DEV_USER_ID)
            .eq("sheet", sheet)
            .single();

        const completedCount = Object.keys(subtopics).length;

        // ⚠️ IMPORTANT: use SAME thresholds as frontend
        // Replace numbers below with your actual rules if different
        const qualifies = {
            Coder: completedCount >= 1,              // example
            "Problem Solver": completedCount >= 20,  // example
            Algorithmist: completedCount >= 40,      // example
            "DSA Specialist": completedCount >= 80,  // example
        };

        const derived = getLevelFromQualifies(qualifies);


        const storedLevel = existingRow?.highest_level || "Novice";

        const finalLevel =
            TITLES.indexOf(derived) > TITLES.indexOf(storedLevel)
                ? derived
                : storedLevel;



        if (!sheet || !subtopics || !questions) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Invalid payload" }),
            };
        }

        const progress_json = {
            subtopics,
            questions,
        };

        const { error } = await supabase
            .from("user_progress")
            .upsert(
                {
                    user_id: DEV_USER_ID,
                    sheet,
                    progress_json,
                    highest_level: finalLevel,
                    updated_at: new Date().toISOString(),
                },
                { onConflict: ["user_id", "sheet"] }
            );

        if (error) {
            console.error("DB error:", error);
            return {
                statusCode: 500,
                body: JSON.stringify({
                    error: error.message,
                    details: error.details,
                    hint: error.hint,
                }),
            };
        }


        return {
            statusCode: 200,
            body: JSON.stringify({ ok: true }),
        };
    } catch (err) {
        console.error("Function crash:", err);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Server error" }),
        };
    }
}
