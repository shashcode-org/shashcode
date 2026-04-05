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

  // 🔥 Lock scroll + ESC close
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn"
    >
      {/* Modal */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-card w-[95%] max-w-2xl rounded-2xl p-6 relative shadow-2xl transform transition-all duration-300 scale-100"
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 hover:scale-110 transition"
        >
          <X />
        </button>

        {/* 🏆 HEADER */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold">🏆 Your Achievements</h2>

          <p className="text-sm text-muted-foreground mt-1">
            {earnedCount} / {ALL_BADGES.length} Badges Unlocked
          </p>

          {/* 🔥 Progress Bar */}
          <div className="w-full bg-muted h-2 rounded-full mt-3 overflow-hidden">
            <div
              className="h-full bg-yellow-400 transition-all duration-500"
              style={{
                width: `${(earnedCount / ALL_BADGES.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* 🟡 BADGE GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {ALL_BADGES.map((badge) => {
            const earned = earnedKeys.has(badge.key);
            const earnedData = badges.find(
              (b) => b.badge_key === badge.key
            );

            return (
              <div
                key={badge.key}
                className={`relative group p-3 rounded-xl border text-center transition-all duration-300
                ${
                  earned
                    ? "bg-card shadow-lg hover:scale-105"
                    : "bg-muted opacity-60"
                }
              `}
              >
                {/* Glow */}
                {earned && (
                  <div className="absolute inset-0 rounded-xl border-2 border-yellow-400 animate-pulse pointer-events-none" />
                )}

                <img
                  src={`/badges/${badge.key}.png`}
                  alt={badge.name}
                  className={`h-16 mx-auto mb-2 transition ${
                    earned ? "scale-100" : "grayscale"
                  }`}
                />

                <div className="text-sm font-semibold">
                  {badge.name}
                </div>

                {/* Level tag */}
                {earned && (
                  <div className="text-[10px] text-muted-foreground mt-1">
                    {LEVEL_MAP[badge.key]}
                  </div>
                )}

                {/* Earned date */}
                {earned && earnedData?.earned_at && (
                  <div className="text-[10px] text-muted-foreground">
                    {new Date(
                      earnedData.earned_at
                    ).toLocaleDateString()}
                  </div>
                )}

                {/* Locked */}
                {!earned && (
                  <div className="text-[10px] text-muted-foreground mt-1">
                    🔒 Locked
                  </div>
                )}

                {/* Hover overlay */}
                {earned && (
                  <div
                    onClick={() => handleShareBadge(badge.name)}
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-black/70 rounded-xl flex items-center justify-center text-xs text-white cursor-pointer"
                  >
                    Share 🔥
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 🚀 CTA */}
        <div className="text-center">
          <button
            onClick={handleShareAll}
            className="px-4 py-2 rounded-lg bg-primary text-white font-semibold hover:opacity-90 transition"
          >
            {copied ? "Copied ✅" : "Share My Progress 🚀"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BadgesModal;