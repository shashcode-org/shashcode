import React from "react";
import { ArrowRight, Youtube } from "lucide-react";
import { useLeetCodeDailyCta } from "@/hooks/useLeetCodeDailyCta";
import { trackEvent } from "@/utils/analytics";

const LeetCodeDailyBanner = () => {
  const { visible, day, totalDays, joinUrl } = useLeetCodeDailyCta();

  if (!visible) return null;

  const handleJoin = () => {
    trackEvent("lcd_membership_cta_click", { placement: "home_banner" });
  };

  return (
    <div className="relative z-[51] mt-5 sm:mt-6 w-full max-w-md rounded-xl border border-border bg-background/80 dark:bg-card/60 backdrop-blur-sm p-3.5 sm:p-4">
      <div className="flex flex-col gap-3 sm:gap-3.5">
        <div className="min-w-0">
          <p className="text-[10px] sm:text-[11px] font-semibold tracking-wide text-primary uppercase">
            Live · Day {day}/{totalDays}
          </p>
          <p className="mt-1 text-sm sm:text-[15px] font-semibold text-foreground leading-snug">
            Don&apos;t miss today&apos;s{" "}
            <span className="text-primary">LeetCode Daily Challenge</span>
          </p>
          <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
            Join membership so you never miss a day.
          </p>
        </div>

        <a
          href={joinUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleJoin}
          className="
            inline-flex items-center justify-center gap-2
            w-full sm:w-auto
            px-3.5 py-2.5 sm:py-2
            text-sm font-medium
            rounded-lg
            bg-primary text-primary-foreground
            hover:bg-primary/90 transition
          "
        >
          <Youtube className="h-4 w-4 shrink-0" />
          Join membership
          <ArrowRight className="h-4 w-4 opacity-80 shrink-0" />
        </a>
      </div>
    </div>
  );
};

export default LeetCodeDailyBanner;
