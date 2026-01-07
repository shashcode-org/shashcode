import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useLayoutEffect,
} from "react";
import { ChevronRight, Youtube } from "lucide-react";
import AnimatedElement from "@/components/AnimatedElement";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { motion, AnimatePresence } from "framer-motion";
import { SiLeetcode, SiGeeksforgeeks } from "react-icons/si";

const QUESTION_STORAGE_KEY = "questionProgress";
const SUBTOPIC_STORAGE_KEY = "subtopicProgress";

// Helper functions for question progress
const readQuestionProgress = () => {
  try {
    const raw = localStorage.getItem(QUESTION_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const saveQuestionProgress = (progressMap) => {
  localStorage.setItem(QUESTION_STORAGE_KEY, JSON.stringify(progressMap));
};

const toggleQuestionProgress = (questionId) => {
  const progress = readQuestionProgress();
  if (progress[questionId]) {
    delete progress[questionId];
  } else {
    progress[questionId] = true;
  }
  saveQuestionProgress(progress);
  return progress;
};



// Helper functions for subtopic progress
const readSubtopicProgress = () => {
  try {
    const raw = localStorage.getItem(SUBTOPIC_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const saveSubtopicProgress = (progressMap) => {
  localStorage.setItem(SUBTOPIC_STORAGE_KEY, JSON.stringify(progressMap));
};

const toggleSubtopicProgress = (subtopicId) => {
  const progress = readSubtopicProgress();
  if (progress[subtopicId]) {
    delete progress[subtopicId];
  } else {
    progress[subtopicId] = true;
  }
  saveSubtopicProgress(progress);
  return progress;
};

const normalizeLinks = (links) => {
  if (!links) return [];

  const INVALID = ["n/a", "na", "-", ""];

  if (Array.isArray(links)) {
    return links
      .map(l => l?.trim())
      .filter(l =>
        l &&
        !INVALID.includes(l.toLowerCase())
      );
  }

  if (typeof links === "string") {
    return links
      .split(",")
      .map(l => l.trim())
      .filter(l =>
        l &&
        !INVALID.includes(l.toLowerCase())
      );
  }

  return [];
};


export const CSV_TABLE_UI = ({ csvData }) => {
  const [expandedTopicIndex, setExpandedTopicIndex] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const [questionProgress, setQuestionProgress] = useState({});
  const [subtopicProgress, setSubtopicProgress] = useState({});

  useEffect(() => {
    setQuestionProgress(readQuestionProgress());
    setSubtopicProgress(readSubtopicProgress());
  }, []);

  const resetProgress = () => {
    const ok = window.confirm(
      "This will reset your entire progress. Are you sure?"
    );

    if (!ok) return;

    localStorage.removeItem(QUESTION_STORAGE_KEY);
    localStorage.removeItem(SUBTOPIC_STORAGE_KEY);

    setQuestionProgress({});
    setSubtopicProgress({});
  };


  const lastIndexRef = useRef(null);
  const firstExpandedRef = useRef(null);

  const uniqueTopics = useMemo(
    () => ["All", ...new Set(csvData.map((t) => t["Main Topic"]))],
    [csvData]
  );
  // ================= SUBTOPIC-BASED OVERALL PROGRESS =================

  // TOTAL SUBTOPICS
  const totalSubtopics = useMemo(() => {
    return csvData.reduce((count, topic) => {
      return count + topic.Subtopics.length;
    }, 0);
  }, [csvData]);

  // COMPLETED SUBTOPICS
  const completedSubtopics = useMemo(() => {
    let completed = 0;

    csvData.forEach((topic) => {
      topic.Subtopics.forEach((sub) => {
        const questions = sub.Details.filter(
          (d) => normalizeLinks(d.Links).length > 0
        );

        if (questions.length > 0) {
          // AUTO subtopic (all questions solved)
          const qIds = questions.map((d) =>
            d.id
          );

          const solved = qIds.filter((id) => questionProgress[id]).length;
          if (solved === qIds.length) completed++;
        } else {
          // MANUAL subtopic (theory-only)
          const subId = sub.id;
          if (subtopicProgress[subId]) completed++;
        }
      });
    });

    return completed;
  }, [csvData, questionProgress, subtopicProgress]);

  // PERCENT + WIDTH (same as LAST_MINUTE_DSA)
  const progressPercent =
    totalSubtopics === 0
      ? 0
      : Math.round((completedSubtopics / totalSubtopics) * 100);

  const progressWidth =
    progressPercent === 0
      ? "0%"
      : progressPercent < 1
        ? "8px"
        : `${progressPercent}%`;

  // FIRST INCOMPLETE SUBTOPIC (for "Continue from")
  const firstIncompleteSubtopic = useMemo(() => {
    for (const topic of csvData) {
      for (const sub of topic.Subtopics) {
        const questions = sub.Details.filter(
          (d) => normalizeLinks(d.Links).length > 0
        );

        if (questions.length > 0) {
          const qIds = questions.map((d) =>
            d.id
          );

          const solved = qIds.filter((id) => questionProgress[id]).length;
          if (solved < qIds.length) {
            return { topic: topic["Main Topic"], subtopic: sub.Subtopic };
          }
        } else {
          const subId = sub.id;
          if (!subtopicProgress[subId]) {
            return { topic: topic["Main Topic"], subtopic: sub.Subtopic };
          }
        }
      }
    }
    return null;
  }, [csvData, questionProgress, subtopicProgress]);


  /* ---------------- SEARCH + FILTER ---------------- */
  const filteredTopics = useMemo(() => {
    let topics =
      selectedTopic === "All"
        ? csvData
        : csvData.filter((t) => t["Main Topic"] === selectedTopic);

    if (!searchQuery.trim()) return topics;

    return topics
      .map((topic) => {
        const subtopics = topic.Subtopics.map((sub) => {
          const details = sub.Details.filter((d) =>
            d.Detail.toLowerCase().includes(searchQuery.toLowerCase())
          );
          return details.length ? { ...sub, Details: details } : null;
        }).filter(Boolean);

        return subtopics.length ? { ...topic, Subtopics: subtopics } : null;
      })
      .filter(Boolean);
  }, [csvData, selectedTopic, searchQuery]);

  const handleTopicToggle = (index) => {
    setExpandedTopicIndex((prev) => (prev === index ? null : index));
    lastIndexRef.current = index;
  };

  useLayoutEffect(() => {
    if (lastIndexRef.current !== null) {
      const el = document.getElementById(`topic-${lastIndexRef.current}`);
      if (el) {
        setTimeout(() => {
          const y = el.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top: y, behavior: "smooth" });
        }, 300);
      }
    }
  }, [expandedTopicIndex]);

  useEffect(() => {
    if (selectedTopic !== "All") {
      setExpandedTopicIndex(0);
      setTimeout(() => {
        const el = document.getElementById("topic-0");
        if (el) {
          const y = el.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      }, 400);
    } else {
      setExpandedTopicIndex(null);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [selectedTopic]);

  return (
    <div className="p-4 sm:p-6 md:p-8">
      {/* TAG FILTER */}
      <AnimatedElement animation="fadeIn">
        <div className="flex flex-wrap gap-2 mb-6">
          {uniqueTopics.map((tag) => (
            <button
              key={tag}
              onClick={() => {
                setSelectedTopic(tag);
                setExpandedTopicIndex(null);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all shadow-sm ${selectedTopic === tag
                ? "bg-primary text-primary-foreground shadow-md"
                : "bg-muted/60 text-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </AnimatedElement>

      {/* SEARCH */}
      <div className="relative mb-6">
        <input
          className="p-3 w-full rounded-xl border"
          placeholder="Search topics or questions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* OVERALL SUBTOPIC PROGRESS (LIKE LAST_MINUTE_DSA) */}
      <div className="mb-6 rounded-xl border bg-white p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">
            Progress: {completedSubtopics} / {totalSubtopics}
          </span>
          <span className="text-sm font-semibold">
            {progressPercent}%
          </span>
        </div>

        <div className="h-3 sm:h-2 w-full rounded-full bg-muted border border-border overflow-hidden">
          <div
            className="h-full bg-accent transition-all"
            style={{ width: progressWidth }}
          />
        </div>

        {completedSubtopics === totalSubtopics && totalSubtopics > 0 ? (
          <div className="mt-3 text-sm font-medium text-green-700">
            All subtopics completed. Legendary.
          </div>
        ) : (
          firstIncompleteSubtopic && (
            <div className="mt-3 text-sm text-muted-foreground">
              You have{" "}
              <span className="font-medium text-foreground">
                {totalSubtopics - completedSubtopics}
              </span>{" "}
              subtopics left. Continue from{" "}
              <span className="font-medium text-foreground">
                {firstIncompleteSubtopic.subtopic}
              </span>
              .
            </div>
          )
        )}

        <div className="flex justify-end mt-3">
          <button
            onClick={resetProgress}
            className="text-xs font-medium text-red-600 hover:text-red-700 hover:underline"
          >
            Reset progress
          </button>
        </div>
        <div className="mt-2 text-xs text-muted-foreground">
          Progress is saved locally on this browser & device.
        </div>


      </div>


      {/* MAIN TOPICS */}
      {filteredTopics.map((mainTopic, mainIndex) => (
        <div
          key={mainIndex}
          id={`topic-${mainIndex}`}
          ref={mainIndex === 0 ? firstExpandedRef : null}
          className="mb-6"
        >
          <Card>
            {/* HEADER */}
            {(() => {
              const allSubtopicsCompleted = mainTopic.Subtopics.every((sub) => {
                const questionsInSub = sub.Details.filter(d => normalizeLinks(d.Links).length > 0);
                const totalQ = questionsInSub.length;
                if (totalQ > 0) {
                  const qIds = questionsInSub.map(d => d.id);
                  const solved = qIds.filter(id => questionProgress[id]).length;
                  return solved === totalQ;
                } else {
                  const subId = sub.id;
                  return subtopicProgress[subId];
                }
              });
              return (
                <div
                  className="flex justify-between items-center p-4 cursor-pointer"
                  onClick={() => handleTopicToggle(mainIndex)}
                >
                  <div className="flex-1">
                    <span className="font-semibold">
                      {mainTopic["Main Topic"]}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {allSubtopicsCompleted && (
                      <div
                        className="h-5 w-5 rounded-full flex items-center justify-center bg-success-strong text-white"
                        title="Completed"
                      >
                        <svg
                          className="h-4 w-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                    )}


                    <ChevronRight
                      className={`transition-transform ${expandedTopicIndex === mainIndex ? "rotate-90" : ""}`}
                    />
                  </div>
                </div>
              );
            })()}

            <AnimatePresence>
              {expandedTopicIndex === mainIndex && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                >
                  <Separator />

                  <div className="p-4 space-y-6">
                    {mainTopic.Subtopics.map((sub, subIndex) => {
                      const allVideoLinks = (
                        csvData
                          .find(t => t["Main Topic"] === mainTopic["Main Topic"])
                          ?.Subtopics.find(s => s.Subtopic === sub.Subtopic)
                          ?.Details.map(d => d["Video Link"])
                          .filter(Boolean)
                      ) || [];
                      /* VIDEO LOGIC (UNCHANGED) */
                      const videoLinks = allVideoLinks;
                      const uniqueVideos = [...new Set(videoLinks)];
                      const hasSingleVideo = uniqueVideos.length === 1;
                      const hasMultipleVideos = uniqueVideos.length > 1;

                      /* NORMALIZE DETAILS */
                      const normalizedDetails = sub.Details.map((detail) => ({
                        ...detail,
                        _links: normalizeLinks(detail.Links),
                      }));

                      const concepts = normalizedDetails.filter(
                        (d) => d._links.length === 0
                      );

                      const questions = normalizedDetails.filter(
                        (d) => d._links.length > 0
                      );

                      const questionIds = questions.map((d) =>
                        d.id
                      );

                      const totalQuestions = questionIds.length;

                      const solvedCount = questionIds.filter(
                        (id) => questionProgress[id]
                      ).length;

                      const subtopicId = sub.id;

                      const isSubtopicManual = totalQuestions === 0;
                      const isSubtopicAutoCompleted = totalQuestions > 0 && solvedCount === totalQuestions;
                      const isSubtopicManualCompleted = isSubtopicManual && subtopicProgress[subtopicId];
                      const isSubtopicCompleted = isSubtopicAutoCompleted || isSubtopicManualCompleted;
                      return (
                        <div key={subIndex}>
                          {/* SUBTOPIC HEADER */}

                          <div className="flex justify-between items-start mb-3">
                            {/* LEFT: title + youtube inline */}
                            <div className="inline-flex items-start gap-2 flex-1 min-w-0">
                              <h3 className="font-semibold text-primary leading-snug break-words">
                                {sub.Subtopic}

                                {hasSingleVideo && (
                                  <a
                                    href={uniqueVideos[0]}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block ml-1 align-baseline"
                                  >
                                    <Youtube
                                      className="text-red-500 inline-block"
                                      size={18}
                                    />
                                  </a>
                                )}
                              </h3>

                            </div>

                            {/* RIGHT: checkbox (unchanged) */}
                            <div
                              onClick={(e) => {
                                e.stopPropagation();

                                if (totalQuestions === 0) {
                                  const updated = toggleSubtopicProgress(subtopicId);
                                  setSubtopicProgress(updated);
                                } else {
                                  const questionIds = questions.map(q => q.id);
                                  const currentProgress = { ...questionProgress };
                                  const allSolved = questionIds.every(id => currentProgress[id]);

                                  if (allSolved) {
                                    const confirm = window.confirm(
                                      "This will unmark all questions under this subtopic."
                                    );
                                    if (!confirm) return;
                                    questionIds.forEach(id => delete currentProgress[id]);
                                  } else {
                                    questionIds.forEach(id => {
                                      currentProgress[id] = true;
                                    });
                                  }

                                  saveQuestionProgress(currentProgress);
                                  setQuestionProgress(currentProgress);
                                }
                              }}
                              className={`
    h-5 w-5 rounded-full border
    flex items-center justify-center
    cursor-pointer transition-all
    ${isSubtopicCompleted
                                  ? "bg-success border-success"
                                  : "border-border hover:border-success"}
  `}
                              title="Toggle subtopic"
                            >
                              {isSubtopicCompleted && (
                                <svg
                                  className="h-3 w-3 text-white"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="3"
                                >
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                              )}
                            </div>

                          </div>





                          {/* THEORY (SOFT PANEL + BULLETS, NON-CLICKABLE) */}


                          {concepts.length > 0 && (
                            <div className="rounded-lg bg-muted/30 px-4 py-3 mb-3">
                              {/* LABEL */}
                              <div className="text-xs font-semibold uppercase text-muted-foreground mb-2 tracking-wide">
                                What you will learn
                              </div>

                              {concepts.map((d, i) => (
                                <div
                                  key={i}
                                  className="flex gap-2 text-sm text-muted-foreground"
                                >
                                  <span>•</span>
                                  <span>{d.Detail?.trim()}</span>
                                </div>
                              ))}
                            </div>
                          )}




                          {/* PRACTICE (NO HEADING, ICONS ONLY) */}
                          {questions.length > 0 && (
                            <div className="space-y-2">
                              {questions.map((d) => {
                                const questionId = d.id;
                                const isSolved = !!questionProgress[questionId];

                                return (
                                  <div
                                    key={questionId}
                                    className={`flex justify-between items-center gap-2 p-3 rounded-lg border
        ${isSolved ? "bg-green-50 border-green-300 opacity-90" : "hover:bg-accent/5"}
      `}>
                                    {/* LEFT (EXACT OLD UI — DO NOT TOUCH) */}
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 flex-1">
                                      <span className="flex items-center leading-snug">
                                        {d.Detail}
                                      </span>

                                      <div className="flex items-center gap-3">
                                        {d._links.map((link, idx) =>
                                          link.includes("leetcode") ? (
                                            <a key={idx} href={link} target="_blank">
                                              <SiLeetcode size={18} style={{ color: "#FFA116" }} />
                                            </a>
                                          ) : link.includes("geeksforgeeks") ? (
                                            <a key={idx} href={link} target="_blank">
                                              <SiGeeksforgeeks size={18} style={{ color: "#2F8D46" }} />
                                            </a>
                                          ) : link.includes("Video-only problem") ? (
                                            <span
                                              key={idx}
                                              className="text-xs px-2 py-1 rounded-md bg-red-50 text-red-600 border border-red-200 select-none"
                                            >
                                              Video-only
                                            </span>
                                          ) : null
                                        )}

                                        {hasMultipleVideos && d["Video Link"] && (
                                          <a href={d["Video Link"]} target="_blank">
                                            <Youtube className="text-red-500" size={18} />
                                          </a>
                                        )}
                                      </div>
                                    </div>
                                    {/* RIGHT: checkbox */}
                                    {/* <div>
                                      <input
                                        type="checkbox"
                                        checked={isSolved}
                                        onChange={() => {
                                          const updated = toggleQuestionProgress(questionId);
                                          setQuestionProgress(updated);
                                        }}
                                        className="h-5 w-5 cursor-pointer accent-green-600"
                                        title="Mark as solved"
                                      />
                                    </div> */}

                                    <div>
                                      <div
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          const updated = toggleQuestionProgress(questionId);
                                          setQuestionProgress(updated);
                                        }}
                                        title="Mark as solved"
                                        className={`
    h-5 w-5 rounded-md border
    flex items-center justify-center
    cursor-pointer
    transition-all duration-200
    ${isSolved
                                            ? "bg-success-strong border-success-strong"
                                            : "border-border hover:border-success"}
  `}
                                      >
                                        {isSolved && (
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
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </div>
      ))}
    </div>
  );
};

export default CSV_TABLE_UI;
