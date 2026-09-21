import React from "react";
import { ArrowRight, Youtube } from "lucide-react";
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
    <div className="px-4 sm:px-6 lg:px-8 -mt-4 mb-4 sm:mb-8">
      <div
        className="
          relative max-w-7xl mx-auto rounded-2xl border border-border
          bg-gradient-to-r from-background via-primary/5 to-background
          shadow-sm dark:via-primary/10
        "
      >
        <div className="p-6 sm:p-8 flex flex-col gap-4">
          <div className="flex items-start justify-between gap-3">
            <span className="text-xs font-semibold tracking-wide text-primary uppercase">
              Live now · 100-Day Challenge
            </span>
            <button
              type="button"
              onClick={handleDismiss}
              className="text-xs text-muted-foreground hover:text-foreground transition shrink-0"
              aria-label="Dismiss challenge banner"
            >
              Dismiss
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="flex-1 sm:pr-6">
              <h3 className="text-xl sm:text-2xl font-semibold text-foreground leading-tight font-heading">
                Don&apos;t miss Day {day} of the{" "}
                <span className="text-primary">LeetCode Daily Challenge</span>
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Live daily on YouTube through Day {totalDays}. Join membership so
                you never miss a problem.
              </p>
            </div>

            <div className="flex flex-col items-start sm:items-end gap-1 sm:ml-auto shrink-0">
              <a
                href={joinUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleJoin}
                className="
                  inline-flex items-center gap-2
                  px-4 py-2
                  text-sm font-medium
                  rounded-full
                  bg-primary text-primary-foreground
                  hover:bg-primary/90 transition
                "
              >
                <Youtube className="h-4 w-4" />
                Join membership
                <ArrowRight className="h-4 w-4 opacity-80" />
              </a>
              <span className="text-xs text-muted-foreground">
                Day {day} of {totalDays} · Don&apos;t fall behind
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeetCodeDailyBanner;
