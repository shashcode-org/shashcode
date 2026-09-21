import React from "react";
import { ArrowRight, Youtube, X } from "lucide-react";
import { useLeetCodeDailyCta } from "@/hooks/useLeetCodeDailyCta";
import { trackEvent } from "@/utils/analytics";

const LeetCodeDailyBanner = () => {
  const { visible, day, totalDays, joinUrl, dismiss } = useLeetCodeDailyCta();

  if (!visible) return null;

  const handleJoin = () => {
    trackEvent("lcd_membership_cta_click", { placement: "home_banner" });
  };

  const handleDismiss = () => {
    trackEvent("lcd_membership_cta_dismiss", { placement: "home_banner" });
    dismiss();
  };

  return (
    <div className="relative z-[51] mt-6 w-full max-w-md rounded-xl border border-border bg-background/80 dark:bg-card/60 backdrop-blur-sm p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold tracking-wide text-primary uppercase">
            Live · Day {day}/{totalDays}
          </p>
          <p className="mt-1 text-sm font-semibold text-foreground leading-snug">
            Don&apos;t miss today&apos;s{" "}
            <span className="text-primary">LeetCode Daily Challenge</span>
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Join membership so you never miss a day.
          </p>
        </div>
        <button
          type="button"
          onClick={handleDismiss}
          className="shrink-0 p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition"
          aria-label="Dismiss challenge banner"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      <a
        href={joinUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleJoin}
        className="
          mt-3 inline-flex items-center gap-2
          px-3.5 py-2
          text-sm font-medium
          rounded-lg
          bg-primary text-primary-foreground
          hover:bg-primary/90 transition
        "
      >
        <Youtube className="h-4 w-4" />
        Join membership
        <ArrowRight className="h-4 w-4 opacity-80" />
      </a>
    </div>
  );
};

export default LeetCodeDailyBanner;
