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
            "I’m leveling up on ShashCode 🚀 Join me!"
        );
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    const handleShareBadge = (badgeName) => {
        navigator.clipboard.writeText(
            `🏆 I unlocked "${badgeName}" on ShashCode 🚀`
        );
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    return (
        <div
            onClick={onClose}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/60 backdrop-blur-sm animate-fadeIn"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-card w-[95%] max-w-3xl rounded-2xl p-6 relative shadow-2xl transition-all"
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
                    <h2 className="text-2xl font-bold">
                        🏆 Your Achievements
                    </h2>

                    <p className="text-sm text-muted-foreground mt-1">
                        You’re crushing it 🚀 ({earnedCount}/{ALL_BADGES.length})
                    </p>

                    {/* Progress */}
                    <div className="w-full bg-muted h-2 rounded-full mt-3 overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-500"
                            style={{
                                width: `${(earnedCount / ALL_BADGES.length) * 100}%`,
                            }}
                        />
                    </div>
                </div>

                {/* GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
                    {ALL_BADGES.map((badge) => {
                        const earned = earnedKeys.has(badge.key);
                        const earnedData = badges.find(
                            (b) => b.badge_key === badge.key
                        );

                        return (
                            <div
                                key={badge.key}
                                className={`relative group p-4 rounded-xl border text-center transition-all duration-300
                ${earned
                                        ? "bg-card border-border shadow-md hover:shadow-xl hover:-translate-y-1"
                                        : "bg-muted/40 border-border opacity-60"
                                    }`}
                            >
                                {/* Glow */}
                                {earned && (
                                    <div className="absolute inset-0 rounded-xl border-2 border-yellow-400 animate-pulse pointer-events-none" />
                                )}

                                <div className="h-28 w-full flex items-center justify-center mb-3 overflow-hidden">
                                    <img
                                        src={`/badges/${badge.key}.png`}
                                        alt={badge.name}
                                        className={`h-full w-auto object-contain scale-90 ${earned ? "" : "grayscale"
                                            }`}
                                    />
                                </div>

                                <div className="text-base font-semibold">
                                    {badge.name}
                                </div>

                                {/* Level */}
                                {earned && (
                                    <div className="text-xs font-medium text-yellow-500 mt-1">
                                        {LEVEL_MAP[badge.key]}
                                    </div>
                                )}

                                {/* Date */}
                                {earned && earnedData?.earned_at && (
                                    <div className="text-xs text-muted-foreground">
                                        {new Date(
                                            earnedData.earned_at
                                        ).toLocaleDateString()}
                                    </div>
                                )}

                                {/* Locked */}
                                {!earned && (
                                    <div className="text-xs text-muted-foreground mt-1">
                                        🔒 Locked
                                    </div>
                                )}

                                {/* Share CTA (visible always) */}
                                {earned && (
                                    <button
                                        onClick={() => handleShareBadge(badge.name)}
                                        className="mt-2 text-xs text-primary hover:underline"
                                    >
                                        Share 🔥
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
                        className="px-5 py-2 rounded-lg bg-primary text-white font-semibold hover:opacity-90 transition"
                    >
                        {copied ? "Copied ✅" : "Share My Progress 🚀"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BadgesModal;