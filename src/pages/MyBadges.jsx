import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const ALL_BADGES = [
    { key: "code_cadet", name: "Code Cadet" },
    { key: "algo_assassin", name: "Algo Assassin" },
    { key: "pattern_hunter", name: "Pattern Hunter" },
    { key: "dsa_dhurandhar", name: "DSA Dhurandhar" },
];

const MyBadges = () => {
    const [badges, setBadges] = useState([]);
    const [userId, setUserId] = useState(null);

    // 🔐 get user
    useEffect(() => {
        const load = async () => {
            const { data } = await supabase.auth.getSession();
            setUserId(data.session?.user?.id ?? null);
        };
        load();
    }, []);

    // 📡 fetch badges
    useEffect(() => {
        const loadBadges = async () => {
            if (!userId) return;

            const { data } = await supabase.auth.getSession();
            const token = data.session?.access_token;

            const res = await fetch("/.netlify/functions/getBadges", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const json = await res.json();
            setBadges(Array.isArray(json) ? json : []); // 🔥 FIX 2 also here
        };

        loadBadges();
    }, [userId]);

    const earnedKeys = new Set(Array.isArray(badges) &&
        badges.map((b) => b.badge_key));

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">🏅 My Badges</h1>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                {ALL_BADGES.map((badge) => {
                    const earned = earnedKeys.has(badge.key);
                    const earnedData = badges.find((b) => b.badge_key === badge.key);

                    return (
                        <div
                            key={badge.key}
                            className={`p-4 rounded-xl border text-center transition
                ${earned ? "bg-card" : "bg-muted opacity-60"}
              `}
                        >
                            <img
                                src={`/badges/${badge.key}.png`}
                                alt={badge.name}
                                className={`h-20 mx-auto mb-3 ${earned ? "" : "grayscale"
                                    }`}
                            />

                            <div className="font-semibold">{badge.name}</div>

                            {earned ? (
                                <div className="text-xs text-muted-foreground mt-1">
                                    Earned:{" "}
                                    {new Date(earnedData.earned_at).toDateString()}
                                </div>
                            ) : (
                                <div className="text-xs text-muted-foreground mt-1">
                                    🔒 Locked
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default MyBadges;