import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

const ALL_BADGES = [
    { key: "code_cadet", name: "Code Cadet" },
    { key: "algo_assassin", name: "Algo Assassin" },
    { key: "pattern_hunter", name: "Pattern Hunter" },
    { key: "dsa_dhurandhar", name: "DSA Dhurandhar" },
];

const LEVEL_MAP = {
    code_cadet: "Level 1",
    algo_assassin: "Level 2",
    pattern_hunter: "Level 3",
    dsa_dhurandhar: "Level 4",
};

const BadgesModal = ({ isOpen, onClose, badges = [] }) => {
    const [copied, setCopied] = useState(false);

    const earnedKeys = new Set(badges.map((b) => b.badge_key));
    const earnedCount = earnedKeys.size;

    useEffect(() => {
        if (!isOpen) return;

        document.body.style.overflow = "hidden";
        const handleEsc = (e) => e.key === "Escape" && onClose();

        window.addEventListener("keydown", handleEsc);
        return () => {
            document.body.style.overflow = "";
            window.removeEventListener("keydown", handleEsc);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleShareAll = () => {
        navigator.clipboard.writeText("I’m leveling up on ShashCode 🚀");
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    return (
        <div
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-2xl shadow-2xl relative overflow-hidden border border-gray-200 dark:border-slate-700"
            >
                {/* Decorative top accent */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500" />

                {/* Close */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-all"
                >
                    <X size={20} />
                </button>

                {/* HEADER */}
                <div className="text-center pt-6 px-6 pb-4">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
                        Your Achievements
                    </h2>

                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 font-medium">
                        {earnedCount}/{ALL_BADGES.length} unlocked
                    </p>
                </div>

                {/* GRID */}
                <div className="px-6 pb-6">
                    <div className="grid grid-cols-2 gap-3">
                        {ALL_BADGES.map((badge) => {
                            const earned = earnedKeys.has(badge.key);

                            return (
                                <div
                                    key={badge.key}
                                    className={`
                    p-4 rounded-xl text-center transition-all duration-200 relative
                    ${earned
                                            ? "bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-850 shadow-lg hover:shadow-xl dark:shadow-lg hover:scale-105 border border-gray-100 dark:border-slate-700"
                                            : "bg-gray-50 dark:bg-slate-800/50 opacity-50 border border-gray-200 dark:border-slate-700/50"
                                        }`}
                                >
                                    {/* Inner glow for earned badges */}
                                    {earned && (
                                        <div className="absolute inset-0 rounded-xl opacity-0 hover:opacity-10 bg-gradient-to-br from-purple-400 to-indigo-400 transition-opacity pointer-events-none" />
                                    )}

                                    {/* Badge Icon */}
                                    <div className="h-20 flex items-center justify-center mb-3 relative z-10">
                                        <img
                                            src={`/badges/${badge.key}.png`}
                                            alt={badge.name}
                                            className={`h-full object-contain transition-all ${earned ? "drop-shadow-md" : "grayscale opacity-70"
                                                }`}
                                        />
                                    </div>

                                    {/* Badge Name */}
                                    <div className="text-sm font-bold text-gray-900 dark:text-white leading-tight relative z-10">
                                        {badge.name}
                                    </div>

                                    {/* Level Label */}
                                    {earned && (
                                        <div className="text-xs font-semibold text-purple-600 dark:text-purple-400 mt-1.5 relative z-10">
                                            {LEVEL_MAP[badge.key]}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-slate-700 to-transparent mx-6" />

                {/* CTA */}
                <div className="px-6 py-4">
                    <button
                        onClick={handleShareAll}
                        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95"
                    >
                        {copied ? "✓ Copied" : "Share Progress"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BadgesModal;