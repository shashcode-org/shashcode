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
    <div className="relative z-[51] w-full">
      <div className="relative">
        <div
          className="
            absolute -inset-2 rounded-xl blur-2xl
            bg-gradient-to-r from-primary to-secondary
            opacity-20 dark:opacity-15
            pointer-events-none
          "
        />
        <div className="card-glass relative p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
            <div className="min-w-0 flex-1">
              <p className="text-[10px] sm:text-xs font-semibold tracking-wide text-primary uppercase">
                Live · Day {day}/{totalDays}
              </p>
              <p className="mt-1.5 text-base sm:text-lg lg:text-xl font-semibold text-foreground leading-snug font-heading">
                Don&apos;t miss today&apos;s{" "}
                <span className="text-primary">LeetCode Daily Challenge</span>
              </p>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Join membership so you never miss a day through Day {totalDays}.
              </p>
            </div>

            <a
              href={joinUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleJoin}
              className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto shrink-0"
            >
              <Youtube size={18} />
              Join membership
              <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeetCodeDailyBanner;
