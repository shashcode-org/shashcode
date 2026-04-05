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

        const handleEsc = (e) => {
            if (e.key === "Escape") onClose();
        };

        window.addEventListener("keydown", handleEsc);

        return () => {
            document.body.style.overflow = "";
            window.removeEventListener("keydown", handleEsc);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleShareAll = () => {
        navigator.clipboard.writeText(
            "I’m leveling up on ShashCode  Join me!"
        );
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    const handleShareBadge = (badgeName) => {
        navigator.clipboard.writeText(
            `🏆 I unlocked "${badgeName}" on ShashCode `
        );
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    return (
        <div
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm overflow-y-auto p-4 cursor-pointer"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-card w-full max-w-2xl mx-auto mt-10 rounded-2xl p-6 relative shadow-2xl border border-gray-200 dark:border-border cursor-default"
            >
                {/* Close */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 hover:scale-110 transition"
                >
                    <X />
                </button>

                {/* HEADER */}
                <div className="text-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        Your Achievements
                    </h2>

                    <p className="text-sm text-gray-600 dark:text-muted-foreground mt-1">
                        You're making great progress ({earnedCount}/{ALL_BADGES.length})
                    </p>

                    {/* Progress */}
                    <div className="w-full bg-gray-200 dark:bg-muted h-2 rounded-full mt-3 overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-purple-600 to-indigo-600 transition-all duration-500"
                            style={{
                                width: `${(earnedCount / ALL_BADGES.length) * 100}%`,
                            }}
                        />
                    </div>
                </div>

                {/* GRID */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                    {ALL_BADGES.map((badge) => {
                        const earned = earnedKeys.has(badge.key);
                        const earnedData = badges.find(
                            (b) => b.badge_key === badge.key
                        );

                        return (
                            <div
                                key={badge.key}
                                className={`p-3 rounded-xl border text-center transition-all duration-300
                ${earned
                                        ? "bg-white dark:bg-card border-gray-200 dark:border-border shadow-sm hover:shadow-lg"
                                        : "bg-gray-100 dark:bg-muted/40 border-gray-200 dark:border-border opacity-60"
                                    }`}
                            >
                                <div className="h-16 flex items-center justify-center mb-2">
                                    <img
                                        src={`/badges/${badge.key}.png`}
                                        alt={badge.name}
                                        className={`h-full object-contain ${earned ? "" : "grayscale"
                                            }`}
                                    />
                                </div>

                                <div className="text-sm font-semibold text-gray-900 dark:text-white">
                                    {badge.name}
                                </div>

                                {earned && (
                                    <div className="text-xs text-purple-600 mt-1 font-medium">
                                        {LEVEL_MAP[badge.key]}
                                    </div>
                                )}

                                {earned && earnedData?.earned_at && (
                                    <div className="text-xs text-gray-500 dark:text-muted-foreground">
                                        {new Date(
                                            earnedData.earned_at
                                        ).toLocaleDateString()}
                                    </div>
                                )}

                                {!earned && (
                                    <div className="text-xs text-gray-500 dark:text-muted-foreground mt-1">
                                        Locked
                                    </div>
                                )}

                                {earned && (
                                    <button
                                        onClick={() => handleShareBadge(badge.name)}
                                        className="mt-2 text-xs px-3 py-1 rounded-md bg-purple-100 text-purple-700 hover:bg-purple-200 transition"
                                    >
                                        Share
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* CTA */}
                <div className="text-center">
                    <button
                        onClick={handleShareAll}
                        className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
                    >
                        {copied ? "Copied" : "Share My Progress"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BadgesModal;