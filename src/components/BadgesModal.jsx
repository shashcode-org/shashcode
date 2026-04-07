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
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-start md:items-center justify-center p-4 overflow-y-auto"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-2xl h-full max-h-[100dvh] md:max-h-[90vh] min-h-0 rounded-3xl bg-card border border-border shadow-2xl flex flex-col overflow-hidden"
                style={{ borderRadius: "24px" }}
            >
                {/* Top Gradient Bar */}
                <div className="h-1 bg-gradient-to-r from-primary via-secondary to-accent" />

                {/* HEADER */}
                <div className="px-6 pt-8 pb-5 border-b border-border bg-card/80 backdrop-blur-sm">
                    <div className="flex items-center justify-between">

                        {/* LEFT SPACER (for perfect centering) */}
                        <div className="w-6" />

                        {/* TITLE CENTER */}
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-foreground">
                                Your Achievements
                            </h2>
                            <p className="text-sm text-muted-foreground mt-1">
                                {earnedCount}/{ALL_BADGES.length} unlocked
                            </p>
                        </div>

                        {/* CLOSE BUTTON */}
                        <button
                            onClick={onClose}
                            className="p-1 rounded-md hover:bg-accent/20 transition"
                        >
                            <X size={20} />
                        </button>

                    </div>
                </div>
                {/* CONTENT */}
                <div className="flex-1 overflow-y-auto scroll-touch px-6 py-6 min-h-0 overscroll-contain">
                    <div className="w-full">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 auto-rows-max">
                            {ALL_BADGES.map((badge) => {
                                const earned = earnedKeys.has(badge.key);

                                return (
                                    <div
                                        key={badge.key}
                                        className={`
                    group relative rounded-2xl p-4 sm:p-5 text-center transition-all
                    ${earned
                                                ? "card-glass hover:shadow-lg hover:-translate-y-1"
                                                : "bg-muted/40 opacity-60 border border-border"
                                            }
                  `}
                                    >
                                        {/* Glow effect */}
                                        {earned && (
                                            <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-20 bg-gradient-to-br from-primary to-secondary transition" />
                                        )}

                                        {/* Badge */}
                                        <div className="w-full flex items-center justify-center mb-3 relative z-10">
                                            <img
                                                src={`/badges/${badge.key}.webp`}
                                                alt={badge.name}
                                                loading="lazy"
                                                className={`
      w-[100px] h-[100px]
      object-contain
      block
      ${earned ? "drop-shadow-md" : "grayscale opacity-70"}
    `}
                                            />
                                        </div>

                                        {/* Name */}
                                        <div className="text-sm font-semibold text-foreground">
                                            {badge.name}
                                        </div>

                                        {/* Level */}
                                        {earned && (
                                            <div className="text-xs mt-1 text-primary font-medium">
                                                {LEVEL_MAP[badge.key]}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* FOOTER */}
                <div className="border-t border-border px-6 py-4">
                    <button
                        onClick={handleShareAll}
                        className="
              w-full py-3 rounded-xl
              bg-gradient-to-r from-primary to-secondary
              text-white font-semibold
              shadow-md hover:shadow-lg
              transition active:scale-95
            "
                    >
                        {copied ? "✓ Copied" : "Share Progress"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BadgesModal;