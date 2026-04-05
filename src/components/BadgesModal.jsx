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
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-card w-full max-w-md rounded-2xl p-6 shadow-2xl relative"
            >
                {/* Close */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:scale-110"
                >
                    <X />
                </button>

                {/* HEADER */}
                <div className="text-center mb-5">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Your Achievements
                    </h2>

                    <p className="text-xs text-gray-500 mt-1">
                        {earnedCount}/{ALL_BADGES.length} unlocked
                    </p>
                </div>

                {/* GRID */}
                <div className="grid grid-cols-2 gap-4">
                    {ALL_BADGES.map((badge) => {
                        const earned = earnedKeys.has(badge.key);

                        return (
                            <div
                                key={badge.key}
                                className={`p-4 rounded-xl text-center transition-all
                ${earned
                                        ? "bg-white dark:bg-card shadow-md hover:shadow-lg"
                                        : "bg-gray-100 dark:bg-muted/40 opacity-60"
                                    }`}
                            >
                                <div className="h-14 flex items-center justify-center mb-2">
                                    <img
                                        src={`/badges/${badge.key}.png`}
                                        alt={badge.name}
                                        className={`h-full object-contain ${earned ? "" : "grayscale"
                                            }`}
                                    />
                                </div>

                                <div className="text-xs font-semibold text-gray-800 dark:text-white">
                                    {badge.name}
                                </div>

                                {earned && (
                                    <div className="text-[10px] text-purple-600 mt-1">
                                        {LEVEL_MAP[badge.key]}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* CTA */}
                <button
                    onClick={handleShareAll}
                    className="mt-6 w-full py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-medium"
                >
                    {copied ? "Copied" : "Share Progress"}
                </button>
            </div>
        </div>
    );
};

export default BadgesModal;