import { useMemo, useState, useEffect } from "react";
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
  const [activeWeek, setActiveWeek] = useState("Week 1");
  const [completed, setCompleted] = useState([]);

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
      <div className="sticky top-16 z-10 bg-background/80 backdrop-blur py-3 mb-6">
        <div className="flex gap-2 overflow-x-auto">
          {weeks.map((w) => (
            <button
              key={w}
              onClick={() => setActiveWeek(w)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all border whitespace-nowrap
                ${w === activeWeek
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-muted/60 hover:bg-accent hover:text-accent-foreground"}`}
            >
              {w}
            </button>
          ))}
        </div>
      </div>

      {/* WEEK SUMMARY */}
      <div className="mb-6 rounded-xl border bg-white p-4">
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
              className={`group flex items-start gap-3 p-4 rounded-xl border bg-white
                ${isDone ? "bg-green-50 border-green-300 opacity-90" : ""}
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
                    <span className="text-xs italic text-gray-400">Optional</span>
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
                <input
                  type="checkbox"
                  checked={isDone}
                  onChange={() => toggleCompleted(q.id)}
                  className="h-5 w-5 cursor-pointer accent-green-600"
                />
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