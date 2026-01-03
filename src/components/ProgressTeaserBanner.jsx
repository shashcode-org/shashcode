import React from "react";
import { Bell, ArrowRight } from "lucide-react";

const ProgressTeaserBanner = ({ onNotifyClick }) => {
  return (
    <div
      className="
        relative rounded-2xl border border-gray-200
        bg-gradient-to-r from-white via-primary/5 to-white
        shadow-sm
      "
    >
      <div className="p-6 sm:p-8 flex flex-col gap-4">

        {/* LABEL */}
        <span className="text-xs font-semibold tracking-wide text-primary uppercase">
          New Feature
        </span>

        {/* CONTENT + RIGHT SIDE */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">

          {/* LEFT TEXT */}
          <div className="flex-1 pr-6">
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 leading-tight">
              Track what you solve.{" "}
              <span className="text-primary">Build real consistency.</span>
            </h3>

            <p className="mt-2 text-sm text-gray-600">
              Progress tracking is coming to ShashCode.
              No login. No cloud. Saved directly in your browser.
            </p>
          </div>

          {/* RIGHT ACTION */}
          <div className="flex flex-col items-start sm:items-end gap-1 sm:ml-auto">
            <button
              onClick={onNotifyClick}
              className="
                inline-flex items-center gap-2
                px-4 py-2
                text-sm font-medium
                rounded-full
                bg-primary text-white
                hover:bg-primary/90 transition
              "
            >
              <Bell className="h-4 w-4" />
              Notify me
              <ArrowRight className="h-4 w-4 opacity-80" />
            </button>

            <span className="text-xs text-gray-500">
              Get notified on launch
            </span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProgressTeaserBanner;
