import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { X } from "lucide-react";
import { useLeetCodeDailyCta } from "@/hooks/useLeetCodeDailyCta";
import { LCD_STICKY_HEIGHT_PX } from "@/config/leetcodeDailyChallenge";
import { trackEvent } from "@/utils/analytics";

const HIDDEN_PATHS = ["/login", "/onboarding/username"];

const LeetCodeDailyStickyBar = () => {
  const location = useLocation();
  const { visible, day, totalDays, joinUrl, dismiss } = useLeetCodeDailyCta();

  const hideOnRoute = HIDDEN_PATHS.some(
    (p) => location.pathname === p || location.pathname.startsWith(`${p}/`)
  );
  const show = visible && !hideOnRoute;

  useEffect(() => {
    const root = document.documentElement;
    if (show) {
      root.style.setProperty("--lcd-cta-h", `${LCD_STICKY_HEIGHT_PX}px`);
    } else {
      root.style.setProperty("--lcd-cta-h", "0px");
    }
    return () => {
      root.style.setProperty("--lcd-cta-h", "0px");
    };
  }, [show]);

  if (!show) return null;

  const handleJoin = () => {
    trackEvent("lcd_membership_cta_click", { placement: "sticky" });
  };

  const handleDismiss = () => {
    trackEvent("lcd_membership_cta_dismiss", { placement: "sticky" });
    dismiss();
  };

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[60] bg-primary text-primary-foreground"
      style={{ minHeight: LCD_STICKY_HEIGHT_PX }}
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-full min-h-[44px] flex items-center justify-between gap-2 sm:gap-4">
        <p className="text-xs sm:text-sm font-medium truncate flex-1 min-w-0">
          <span className="font-semibold">Day {day}/{totalDays}</span>
          <span className="hidden sm:inline">
            {" "}
            · Don&apos;t miss today&apos;s LeetCode challenge
          </span>
          <span className="sm:hidden"> · LeetCode Daily</span>
        </p>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <a
            href={joinUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleJoin}
            className="inline-flex items-center px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-md bg-white text-primary hover:bg-white/90 transition"
          >
            Join membership
          </a>
          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Dismiss challenge banner"
            className="p-1.5 rounded-md hover:bg-white/15 transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeetCodeDailyStickyBar;
