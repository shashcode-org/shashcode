import { useMemo, useState, useEffect, useRef } from "react";
import { SiLeetcode, SiGeeksforgeeks } from "react-icons/si";
import { Youtube } from "lucide-react";

const STORAGE_KEY = "dsa_restart_progress";

const readProgress = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
};

const saveProgress = (ids) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
};

const DSA_RESTART_TABLE = ({ data = [] }) => {
  const [activeWeek, setActiveWeek] = useState(null);
  const [completed, setCompleted] = useState([]);
  const weekRefs = useRef({});


  useEffect(() => {
    setCompleted(readProgress());
  }, []);

  const weeks = useMemo(() => {
    return [...new Set(data.map(q => q.week))]
      .filter(Boolean)
      .sort((a, b) => {
        const na = parseInt(a.replace("Week", "").trim(), 10);
        const nb = parseInt(b.replace("Week", "").trim(), 10);
        return na - nb;
      });
  }, [data]);

  useEffect(() => {
    if (!weeks.length || !completed.length) return;

    // find first incomplete week
    for (const week of weeks) {
      const weekQuestions = data.filter(q => q.week === week);
      const doneCount = weekQuestions.filter(q =>
        completed.includes(q.id)
      ).length;

      if (doneCount < weekQuestions.length) {
        setActiveWeek(week);
        return;
      }
    }

    // if all weeks are complete, stay on last week
    setActiveWeek(weeks[weeks.length - 1]);
  }, [weeks, completed, data]);

  // FALLBACK (FIRST VISIT SAFETY NET) ✅ THIS ONE
  useEffect(() => {
    if (!activeWeek && weeks.length) {
      setActiveWeek(weeks[0]);
    }
  }, [activeWeek, weeks]);

  // 🔥 AUTO-SCROLL ACTIVE WEEK INTO VIEW (ADD THIS)
  useEffect(() => {
    if (!activeWeek) return;

    const el = weekRefs.current[activeWeek];
    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [activeWeek]);

  const weekData = useMemo(() => {
    return data.filter((q) => q.week === activeWeek);
  }, [data, activeWeek]);

  const toggleCompleted = (id) => {
    setCompleted((prev) => {
      const updated = prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id];
      saveProgress(updated);
      return updated;
    });
  };

  const weekCompleted = useMemo(() => {
    return completed.filter((id) => weekData.some((q) => q.id === id)).length;
  }, [completed, weekData]);

  const progressPercent =
    weekData.length === 0
      ? 0
      : Math.round((weekCompleted / weekData.length) * 100);

  return (
    <div className="p-4 sm:p-6 md:p-8">
      {/* WEEK SELECTOR */}
      <div className="sticky top-16 z-10 bg-background/80 backdrop-blur py-2 mb-6">
        <div className="relative">
          <div className="flex gap-2 overflow-x-auto scrollbar-none pr-6">
            {weeks.map((w) => (
              <button
                ref={el => (weekRefs.current[w] = el)}
                key={w}
                onClick={() => setActiveWeek(w)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all border border-border whitespace-nowrap
                ${w === activeWeek
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-muted/60 hover:bg-accent hover:text-accent-foreground"}`}
              >
                {w}
              </button>
            ))}
          </div>
          {/* right fade */}
          <div className="pointer-events-none absolute top-0 right-0 h-full w-8 bg-gradient-to-l from-background to-transparent" />
        </div>
      </div>

      {/* WEEK SUMMARY */}
      <div className="mb-6 rounded-xl border border-border bg-card p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">
            {activeWeek} Progress: {weekCompleted} / {weekData.length}
          </span>
          <span className="text-sm font-semibold">{progressPercent}%</span>
        </div>
        <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
          <div
            className="h-full bg-accent"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* PROBLEM LIST */}
      <div className="space-y-3">
        {weekData.map((q, index) => {
          const isDone = completed.includes(q.id);
          const diff = q.difficulty?.toLowerCase();
          return (
            <div
              key={q.id}
              className={`group flex items-start gap-3 p-4 rounded-xl border border-border bg-card
                ${isDone ? "bg-green-500/10 border-green-500/30 opacity-90" : ""}
                ${q.optional ? "opacity-80" : ""}
                hover:-translate-y-[2px] hover:shadow-lg`}
            >
              <span className="text-sm font-semibold text-muted-foreground min-w-[36px]">
                #{index + 1}
              </span>

              <div className="flex flex-col flex-1 gap-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`font-medium ${isDone ? "line-through text-muted-foreground" : ""}`}
                  >
                    {q.title}
                  </span>

                  {q.optional && (
                    <span className="text-xs italic text-muted-foreground">Optional</span>
                  )}
                </div>

                <div className="text-xs text-muted-foreground">
                  {q.restartTag} • {q.topic}
                </div>

                <span
                  className={`text-xs font-medium
                    ${diff === "easy" && "text-green-600"}
                    ${diff === "medium" && "text-amber-600"}
                    ${diff === "hard" && "text-red-600"}`}
                >
                  {q.difficulty}
                </span>
              </div>

              <div className="flex items-center gap-3 ml-auto">
                {q.links?.leetcode && (
                  <a href={q.links.leetcode} target="_blank" rel="noreferrer">
                    <SiLeetcode size={18} color="#FFA116" />
                  </a>
                )}
                {q.links?.youtube && (
                  <a href={q.links.youtube} target="_blank" rel="noreferrer">
                    <Youtube size={18} className="text-red-500" />
                  </a>
                )}
                {q.links?.gfg && (
                  <a href={q.links.gfg} target="_blank" rel="noreferrer">
                    <SiGeeksforgeeks size={18} color="#2F8D46" />
                  </a>
                )}
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleCompleted(q.id);
                  }}
                  title="Mark as solved"
                  className={`
    h-5 w-5 rounded-md border
    flex items-center justify-center
    cursor-pointer
    transition-all duration-200
    ${isDone
                      ? "bg-success-strong border-success-strong"
                      : "border-border hover:border-success"}
  `}
                >
                  {isDone && (
                    <svg
                      className="h-3 w-3 text-white"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>

              </div>
            </div>
          );
        })}

        {weekData.length === 0 && (
          <div className="text-center text-muted-foreground py-10">
            No problems found for this week.
          </div>
        )}
      </div>
    </div>
  );
};

export default DSA_RESTART_TABLE;