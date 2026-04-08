import React, { useEffect, useState, useRef } from "react";
import { X } from "lucide-react";
import { toPng } from "html-to-image";

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

const BadgesModal = ({ isOpen, onClose, badges = [], user }) => {
    const username =
        user?.user_metadata?.name ||
        user?.email?.split("@")[0] ||
        "user";
    const badgeRefs = useRef({});

    const earnedKeys = new Set(badges.map((b) => b.badge_key));
    const earnedCount = earnedKeys.size;
    const total = ALL_BADGES.length;

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

    const buildShareUrl = (badge) => {
        const baseUrl = window.location.origin;
        const user_id = user?.id; // Get user ID from the user prop
        
        // ✅ This URL points to share-badge endpoint which returns HTML with OG meta tags
        // og:image retrieves the pre-generated badge image from Supabase
        // LinkedIn crawler fetches this and displays the badge image in preview
        let shareUrl = `${baseUrl}/.netlify/functions/share-badge?id=${encodeURIComponent(
            badge.name
        )}&username=${encodeURIComponent(username)}&score=${encodeURIComponent(
            `${earnedCount}/${total}`
        )}`;
        
        // Add user_id if available (to retrieve stored OG image)
        if (user_id) {
            shareUrl += `&user_id=${encodeURIComponent(user_id)}`;
        }
        
        return shareUrl;
    };

    const shareTwitter = (badge) => {
        const shareUrl = buildShareUrl(badge);

        const text = `I just unlocked "${badge.name}" on ShashCode 🚀🔥

Sharpening my DSA skills daily 💪`;

        window.open(
            `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                text
            )}&url=${encodeURIComponent(shareUrl)}`,
            "_blank",
            "width=600,height=500"
        );
        
        // Optional: Track share in analytics
        if (window.gtag) {
            window.gtag('event', 'badge_shared', {
                badge_name: badge.name,
                platform: 'twitter'
            });
        }
    };

    const shareLinkedIn = (badge) => {
        const shareUrl = buildShareUrl(badge);

        // ✅ Opens LinkedIn sharing with OG preview
        // The share-badge endpoint returns HTML with og:image pointing to cached badge
        const linkedInShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
            shareUrl
        )}`;
        
        window.open(linkedInShareUrl, "_blank", "width=600,height=500");
        
        // Optional: Track share in analytics
        if (window.gtag) {
            window.gtag('event', 'badge_shared', {
                badge_name: badge.name,
                platform: 'linkedin'
            });
        }
    };

    const handleDownload = async (key) => {
        const node = badgeRefs.current[key];
        if (!node) return;

        try {
            await new Promise((res) => setTimeout(res, 100));
            const dataUrl = await toPng(node);

            const link = document.createElement("a");
            link.download = `${key}-badge.png`;
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error("Image generation failed", err);
        }


    };



    return (
        <div
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-start md:items-center justify-center p-4 overflow-y-auto"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-2xl min-h-[300px] md:min-h-[350px] max-h-[85vh] rounded-3xl bg-card border border-border shadow-2xl flex flex-col overflow-hidden"
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
                                        ref={(el) => (badgeRefs.current[badge.key] = el)}
                                        key={badge.key}
                                        className={`
                    group relative rounded-2xl p-4 sm:p-5 text-center transition-all
                    ${earned
                                                ? "card-glass hover:shadow-lg hover:-translate-y-1"
                                                : "bg-muted/30 border border-border opacity-50 grayscale pointer-events-none"
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
                                        <div className={`text-xs mt-1 font-medium ${earned ? "text-primary" : "text-muted-foreground"}`}>
                                            {earned ? LEVEL_MAP[badge.key] : "🔒 Locked"}
                                        </div>
                                        {earned && (
                                            <div className="flex items-center justify-center gap-3 mt-3 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition">

                                                <button
                                                    onClick={() => shareTwitter(badge)}
                                                    className="px-2 py-1 rounded-md bg-primary/20 hover:bg-primary/30 text-xs"
                                                >
                                                    🐦
                                                </button>

                                                <button
                                                    onClick={() => shareLinkedIn(badge)}
                                                    className="px-2 py-1 rounded-md bg-primary/20 hover:bg-primary/30 text-xs"
                                                >
                                                    💼
                                                </button>

                                                <button
                                                    onClick={() => handleDownload(badge.key)}
                                                    className="px-2 py-1 rounded-md bg-primary/20 hover:bg-primary/30 text-xs"
                                                >
                                                    🖼
                                                </button>

                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default BadgesModal;