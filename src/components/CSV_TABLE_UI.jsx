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
import { trackEvent } from "@/utils/analytics";
import { BUCKETS } from "@/utils/titleEngine";
import { getLevelFromRank } from "@/utils/titleEngine";
import { supabase } from "@/lib/supabaseClient";
const QUESTION_STORAGE_KEY = "questionProgress";
const SUBTOPIC_STORAGE_KEY = "subtopicProgress";



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

async function syncProgressToServer({
  sheet,
  subtopics,
  questions,
  completedPercent,
  bucketCompletion,
  completedMainTopics,
}) {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    console.warn("No session, skipping sync");
    return null;
  }

  console.log("📤 Sync request:", {
    sheet,
    subtopicsCount: Object.keys(subtopics).length,
    questionsCount: Object.keys(questions).length,
  });


  const res = await fetch("/.netlify/functions/syncProgress", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({
      sheet,
      subtopics,
      questions,
      completedPercent,
      bucketCompletion,
      completedMainTopics,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("syncProgress failed:", text);
    return null;
  }
  const json = await res.json();

  console.log("📤 Sync response:", json);

  return json;


  // return await res.json();
}

// async function syncProgressToServer({
//   sheet,
//   subtopics,
//   questions,
//   completedPercent,
//   bucketCompletion,
//   completedMainTopics,
// }) {
//   const res = await fetch("/.netlify/functions/syncProgress", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({
//       sheet,
//       subtopics,
//       questions,
//       completedPercent,
//       bucketCompletion,
//       completedMainTopics,
//     }),
//   });
//   const data = await res.json();
//   return data;
// }

// async function hydrateProgressFromDB(sheet) {
//   const res = await fetch(
//     `/.netlify/functions/getProgress?sheet=${sheet}`
//   );

//   if (!res.ok) return null;

//   return await res.json();
// }

async function hydrateProgressFromDB(sheet) {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) return null;

  const res = await fetch(
    `/.netlify/functions/getProgress?sheet=${sheet}`,
    {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    }
  );

  if (!res.ok) return null;
  return await res.json();
}

function getStorageKeys(userId, sheet) {
  const suffix = userId ? `${userId}_${sheet}` : `guest_${sheet}`;

  return {
    USER_QUESTION_STORAGE_KEY: `questionProgress_${suffix}`,
    USER_SUBTOPIC_STORAGE_KEY: `subtopicProgress_${suffix}`,
  };
}


export const CSV_TABLE_UI = ({ csvData }) => {
  const [expandedTopicIndex, setExpandedTopicIndex] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const [questionProgress, setQuestionProgress] = useState({});
  const [subtopicProgress, setSubtopicProgress] = useState({});
  const [highestLevel, setHighestLevel] = useState("Novice");

  const debounceTimerRef = useRef(null);
  const hasHydratedFromLocalRef = useRef(false);

  const isJavaDSASheet = useMemo(() => {
    return csvData.some(
      t => t["Main Topic"] === "Java Basics"
    );
  }, [csvData]);

  const [userId, setUserId] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUserId(data.session?.user?.id || null);
      console.log("👤 Session userId:", data.session?.user?.id);
    });
  }, []);

  const sheet = isJavaDSASheet ? "JAVA_DSA" : "DSA";

  const { USER_QUESTION_STORAGE_KEY, USER_SUBTOPIC_STORAGE_KEY } =
    getStorageKeys(userId, sheet);
  const UPDATED_AT_KEY = `progressUpdatedAt_${userId}_${sheet}`;


  // Helper functions for question progress
  const readQuestionProgress = () => {
    try {
      const raw = localStorage.getItem(USER_QUESTION_STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  };

  const saveQuestionProgress = (progressMap) => {
    localStorage.setItem(USER_QUESTION_STORAGE_KEY, JSON.stringify(progressMap));
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
      const raw = localStorage.getItem(USER_SUBTOPIC_STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  };

  const saveSubtopicProgress = (progressMap) => {
    localStorage.setItem(USER_SUBTOPIC_STORAGE_KEY, JSON.stringify(progressMap));
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


  // --------------------------------------------------
  // ✅ DERIVE COMPLETED MAIN TOPICS (100% DONE)
  // --------------------------------------------------
  const completedMainTopics = useMemo(() => {
    const completed = [];

    csvData.forEach((topic) => {
      const allDone = topic.Subtopics.every((sub) => {
        const questions = sub.Details.filter(
          (d) => normalizeLinks(d.Links).length > 0
        );

        if (questions.length > 0) {
          const qIds = questions.map(d => d.id);
          const solved = qIds.filter(id => questionProgress[id]).length;
          return solved === qIds.length;
        } else {
          return subtopicProgress[sub.id];
        }
      });

      if (allDone) completed.push(topic["Main Topic"]);
    });

    return completed;
  }, [csvData, questionProgress, subtopicProgress]);





  // --------------------------------------------------
  // 🧠 BUCKET COMPLETION (FACTS ONLY, NO DECISIONS)
  // --------------------------------------------------


  const bucketCompletion = useMemo(() => {
    const bucketStats = {};

    Object.entries(BUCKETS).forEach(([key, topics]) => {
      let total = 0;
      let completed = 0;

      csvData.forEach((topic) => {
        if (!topics.includes(topic["Main Topic"])) return;

        topic.Subtopics.forEach((sub) => {
          total++;

          const questions = sub.Details.filter(
            (d) => normalizeLinks(d.Links).length > 0
          );

          if (questions.length > 0) {
            const qIds = questions.map((d) => d.id);
            const solved = qIds.filter((id) => questionProgress[id]).length;
            if (solved === qIds.length) completed++;
          } else if (subtopicProgress[sub.id]) {
            completed++;
          }
        });
      });

      bucketStats[key] =
        total === 0 ? 0 : Math.round((completed / total) * 100);
    });

    return bucketStats;
  }, [csvData, questionProgress, subtopicProgress]);

  // useEffect(() => {
  //   const sheet = isJavaDSASheet ? "JAVA_DSA" : "DSA";

  //   (async () => {
  //     // MIGRATE OLD STORAGE (one-time)
  //     const oldQuestions = localStorage.getItem(QUESTION_STORAGE_KEY);
  //     const oldSubtopics = localStorage.getItem(SUBTOPIC_STORAGE_KEY);

  //     const hasUserKey = localStorage.getItem(USER_QUESTION_STORAGE_KEY);
  //     const hasUpdatedAt = localStorage.getItem(`progressUpdatedAt_${userId}_${sheet}`);

  //     if (oldQuestions && !hasUserKey && !hasUpdatedAt) {
  //       localStorage.setItem(USER_QUESTION_STORAGE_KEY, oldQuestions);
  //     }

  //     if (oldSubtopics && !localStorage.getItem(USER_SUBTOPIC_STORAGE_KEY) && !hasUpdatedAt) {
  //       localStorage.setItem(USER_SUBTOPIC_STORAGE_KEY, oldSubtopics);
  //     }

  //     // if (oldQuestions && !localStorage.getItem(USER_QUESTION_STORAGE_KEY)) {
  //     //   localStorage.setItem(USER_QUESTION_STORAGE_KEY, oldQuestions);
  //     // }

  //     // if (oldSubtopics && !localStorage.getItem(USER_SUBTOPIC_STORAGE_KEY)) {
  //     //   localStorage.setItem(USER_SUBTOPIC_STORAGE_KEY, oldSubtopics);
  //     // }
  //     const dbData = await hydrateProgressFromDB(sheet);

  //     console.log("📥 Hydrate DB result:", dbData);

  //     // always read localStorage
  //     const localSubtopics = readSubtopicProgress();
  //     const localQuestions = readQuestionProgress();

  //     if (dbData) {
  //       const dbSubtopics = dbData.subtopics || {};
  //       const dbQuestions = dbData.questions || {};

  //       // ✅ MERGE STRATEGY (UNION)
  //       const localUpdatedAt = localStorage.getItem(UPDATED_AT_KEY);
  //       const dbUpdatedAt = dbData.updated_at;

  //       let finalSubtopics;
  //       let finalQuestions;

  //       // CASE 1: DB newer
  //       if (!localUpdatedAt || dbUpdatedAt > localUpdatedAt) {

  //         finalSubtopics = dbSubtopics;
  //         finalQuestions = dbQuestions;

  //         console.log("📥 Using DB progress (newer)");
  //       }

  //       // CASE 2: Local newer
  //       else if (localUpdatedAt > dbUpdatedAt) {

  //         finalSubtopics = localSubtopics;
  //         finalQuestions = localQuestions;

  //         console.log("📤 Using Local progress (newer)");
  //       }

  //       // CASE 3: Equal → merge union
  //       else {

  //         finalSubtopics = {
  //           ...dbSubtopics,
  //           ...localSubtopics,
  //         };

  //         finalQuestions = {
  //           ...dbQuestions,
  //           ...localQuestions,
  //         };

  //         console.log("🔀 Using merged progress");
  //       }


  //       // set merged state
  //       setSubtopicProgress(finalSubtopics);
  //       setQuestionProgress(finalQuestions);


  //       setHighestLevel(
  //         getLevelFromRank(Number(dbData.highest_level))
  //       );

  //       // update localStorage with merged version
  //       localStorage.setItem(
  //         USER_SUBTOPIC_STORAGE_KEY,
  //         JSON.stringify(finalSubtopics)
  //       );

  //       localStorage.setItem(
  //         USER_QUESTION_STORAGE_KEY,
  //         JSON.stringify(finalQuestions)
  //       );

  //       // IMPORTANT: sync merged back to DB
  //       await syncProgressToServer({
  //         sheet,
  //         subtopics: finalSubtopics,
  //         questions: finalQuestions,
  //         completedPercent: 0, // safe, server recalculates level
  //         bucketCompletion: {},
  //         completedMainTopics: [],
  //       });

  //       // ✅ STEP 5: CLEANUP OLD GLOBAL KEYS (MIGRATION COMPLETE)
  //       localStorage.removeItem(QUESTION_STORAGE_KEY);
  //       localStorage.removeItem(SUBTOPIC_STORAGE_KEY);

  //       console.log("🧹 Old global keys cleaned");

  //       console.log("✅ Hydrated + merged DB & localStorage");
  //     }
  //     else {
  //       // DB empty → use local
  //       setSubtopicProgress(localSubtopics);
  //       setQuestionProgress(localQuestions);

  //       console.log("✅ Using localStorage only");
  //     }

  //     hasHydratedFromLocalRef.current = true;

  //   })();

  // }, [userId, isJavaDSASheet]);

  useEffect(() => {

    if (userId === undefined) return;
    const sheet = isJavaDSASheet ? "JAVA_DSA" : "DSA";

    (async () => {

      console.log("🚀 Starting hydration");

      const oldQuestions =
        localStorage.getItem(QUESTION_STORAGE_KEY);

      const oldSubtopics =
        localStorage.getItem(SUBTOPIC_STORAGE_KEY);

      const hasUserQuestions =
        localStorage.getItem(USER_QUESTION_STORAGE_KEY);

      const hasUserSubtopics =
        localStorage.getItem(USER_SUBTOPIC_STORAGE_KEY);

      // const hasUpdatedAt =
      //   localStorage.getItem(UPDATED_AT_KEY);


      // --------------------------------------------------
      // STEP 1: MIGRATE OLD GLOBAL KEYS → USER KEYS
      // --------------------------------------------------

      if (userId) {

        if (oldQuestions && !hasUserQuestions) {

          localStorage.setItem(
            USER_QUESTION_STORAGE_KEY,
            oldQuestions
          );

          console.log("✅ Migrated old questions → user");
        }

        if (oldSubtopics && !hasUserSubtopics) {

          localStorage.setItem(
            USER_SUBTOPIC_STORAGE_KEY,
            oldSubtopics
          );

          console.log("✅ Migrated old subtopics → user");
        }

      }


      // --------------------------------------------------
      // STEP 2: READ LOCAL
      // --------------------------------------------------

      const localQuestions = readQuestionProgress();
      const localSubtopics = readSubtopicProgress();


      // --------------------------------------------------
      // STEP 3: READ DB
      // --------------------------------------------------

      const dbData = await hydrateProgressFromDB(sheet);

      console.log("📥 DB data:", dbData);


      let finalQuestions = {};
      let finalSubtopics = {};
      let finalUpdatedAt = null;


      // --------------------------------------------------
      // CASE A: DB EXISTS
      // --------------------------------------------------

      if (dbData) {

        const dbQuestions = dbData.questions || {};
        const dbSubtopics = dbData.subtopics || {};

        const dbUpdatedAt = dbData.updated_at;
        const localUpdatedAt =
          localStorage.getItem(UPDATED_AT_KEY);


        if (!localUpdatedAt) {

          // FIRST LOGIN → LOCAL IS SOURCE OF TRUTH

          if (
            Object.keys(localQuestions).length > 0 ||
            Object.keys(localSubtopics).length > 0
          ) {

            finalQuestions = localQuestions;
            finalSubtopics = localSubtopics;

            console.log("📤 Using local (first login)");

          } else {

            finalQuestions = dbQuestions;
            finalSubtopics = dbSubtopics;

            console.log("📥 Using DB");

          }

        }
        else if (dbUpdatedAt > localUpdatedAt) {

          finalQuestions = dbQuestions;
          finalSubtopics = dbSubtopics;

          console.log("📥 Using DB (newer)");

        }
        else if (localUpdatedAt > dbUpdatedAt) {

          finalQuestions = localQuestions;
          finalSubtopics = localSubtopics;

          console.log("📤 Using local (newer)");

        }
        else {

          finalQuestions = {
            ...dbQuestions,
            ...localQuestions
          };

          finalSubtopics = {
            ...dbSubtopics,
            ...localSubtopics
          };

          console.log("🔀 Using merged");

        }

        finalUpdatedAt = dbUpdatedAt;

      }


      // --------------------------------------------------
      // CASE B: DB EMPTY
      // --------------------------------------------------

      else {

        finalQuestions = localQuestions;
        finalSubtopics = localSubtopics;

        console.log("📦 Using local only");

      }



      // --------------------------------------------------
      // STEP 4: APPLY STATE
      // --------------------------------------------------

      setQuestionProgress(finalQuestions);
      setSubtopicProgress(finalSubtopics);



      // --------------------------------------------------
      // STEP 5: SAVE LOCAL
      // --------------------------------------------------

      localStorage.setItem(
        USER_QUESTION_STORAGE_KEY,
        JSON.stringify(finalQuestions)
      );

      localStorage.setItem(
        USER_SUBTOPIC_STORAGE_KEY,
        JSON.stringify(finalSubtopics)
      );

      // --------------------------------------------------
      // STEP 5.5: STORE UPDATED_AT (CRITICAL FIX)
      // --------------------------------------------------

      if (finalUpdatedAt) {

        localStorage.setItem(
          UPDATED_AT_KEY,
          finalUpdatedAt
        );

        console.log("🕒 Stored updated_at:", finalUpdatedAt);

      }



      // --------------------------------------------------
      // STEP 6: SYNC TO DB
      // --------------------------------------------------

      if (userId) {

        const result = await syncProgressToServer({
          sheet,
          questions: finalQuestions,
          subtopics: finalSubtopics,
          completedPercent: 0,
          bucketCompletion: {},
          completedMainTopics: [],
        });

        if (result?.updated_at) {

          localStorage.setItem(
            UPDATED_AT_KEY,
            result.updated_at
          );

        }

      }



      // --------------------------------------------------
      // STEP 7: CLEAN OLD KEYS
      // --------------------------------------------------

      if (userId) {

        localStorage.removeItem(QUESTION_STORAGE_KEY);
        localStorage.removeItem(SUBTOPIC_STORAGE_KEY);

        console.log("🧹 Old keys cleaned");

      }


      hasHydratedFromLocalRef.current = true;

      console.log("✅ Hydration complete");

    })();

  }, [userId, sheet]);



  useEffect(() => {
    console.log("🧠 Storage keys:", {
      USER_QUESTION_STORAGE_KEY,
      USER_SUBTOPIC_STORAGE_KEY,
    });

    // ❌ don't sync before localStorage hydration
    if (!hasHydratedFromLocalRef.current) return;

    // ❌ don't sync if nothing exists
    const hasAnyProgress =
      Object.keys(subtopicProgress).length > 0 ||
      Object.keys(questionProgress).length > 0;

    if (!hasAnyProgress) return;

    console.log("⏱ Debounced sync triggered", {
      progressPercent,
      questions: Object.keys(questionProgress).length,
    });


    // 🧠 debounce logic
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(async () => {
      const sheet = isJavaDSASheet ? "JAVA_DSA" : "DSA";

      const result = await syncProgressToServer({
        sheet,
        subtopics: subtopicProgress,
        questions: questionProgress,
        completedPercent: progressPercent,
        bucketCompletion,
        completedMainTopics,
      });

      if (result?.highest_level !== undefined) {
        setHighestLevel(
          getLevelFromRank(Number(result.highest_level))
        );
      }

      if (result?.updated_at) {
        localStorage.setItem(UPDATED_AT_KEY, result.updated_at);
      }

      // optional debug
      console.log("✅ Debounced sync to DB");
    }, 800); // ⏱️ 800ms debounce

    // cleanup (important)
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [subtopicProgress, questionProgress, progressPercent, bucketCompletion, isJavaDSASheet]);

  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel(`progress-${userId}-${sheet}`)
      .on(
        "postgres_changes",
        {
          event: "*", // ✅ INSERT + UPDATE
          schema: "public",
          table: "user_progress",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log("🔄 Realtime progress update:", payload);
          console.log("Old:", payload.old);
          console.log("New:", payload.new);

          const progress = payload.new.progress_json || {};

          const newSubtopics = progress.subtopics || {};
          const newQuestions = progress.questions || {};

          // ✅ prevent unnecessary overwrite
          setSubtopicProgress(prev =>
            JSON.stringify(prev) === JSON.stringify(newSubtopics)
              ? prev
              : newSubtopics
          );

          setQuestionProgress(prev =>
            JSON.stringify(prev) === JSON.stringify(newQuestions)
              ? prev
              : newQuestions
          );

          setHighestLevel(
            getLevelFromRank(Number(payload.new.highest_level))
          );

          localStorage.setItem(
            USER_SUBTOPIC_STORAGE_KEY,
            JSON.stringify(newSubtopics)
          );

          localStorage.setItem(
            USER_QUESTION_STORAGE_KEY,
            JSON.stringify(newQuestions)
          );
        }
      )
      .subscribe((status) => {
        console.log("📡 Realtime status:", status);
      });

    return () => {
      supabase.removeChannel(channel);
    };

  }, [userId, sheet]);




  const resetProgress = async () => {
    const ok = window.confirm(
      "This will reset your entire progress. Are you sure?"
    );

    if (!ok) return;

    trackEvent("progress_reset", {
      sheet: "DSA",
    });
    Object.keys(localStorage)
      .filter(k => k.startsWith("g4_"))
      .forEach(k => localStorage.removeItem(k));


    // delete user-specific keys
    localStorage.removeItem(USER_QUESTION_STORAGE_KEY);
    localStorage.removeItem(USER_SUBTOPIC_STORAGE_KEY);


    // delete legacy global keys (CRITICAL FIX)
    localStorage.removeItem(QUESTION_STORAGE_KEY);
    localStorage.removeItem(SUBTOPIC_STORAGE_KEY);

    // delete updated_at key
    localStorage.removeItem(`progressUpdatedAt_${userId}_${sheet}`);

    setQuestionProgress({});
    setSubtopicProgress({});
    // 🔥 IMPORTANT: sync empty progress to DB
    const sheet = isJavaDSASheet ? "JAVA_DSA" : "DSA";
    await syncProgressToServer({
      sheet,
      subtopics: {},
      questions: {},
      completedPercent: 0,
      bucketCompletion: {},
      completedMainTopics: [],
    });
    window.location.reload();
  };


  const lastIndexRef = useRef(null);
  const firstExpandedRef = useRef(null);

  const uniqueTopics = useMemo(
    () => ["All", ...new Set(csvData.map((t) => t["Main Topic"]))],
    [csvData]
  );
  // ================= SUBTOPIC-BASED OVERALL PROGRESS =================



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
          className="p-3 w-full rounded-xl
               bg-card text-foreground
               border border-border
               placeholder:text-muted-foreground
               focus:outline-none focus:ring-2 focus:ring-primary/40"
          placeholder="Search topics or questions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>


      {/* OVERALL SUBTOPIC PROGRESS (LIKE LAST_MINUTE_DSA) */}
      <div className="mb-6 rounded-xl border bg-card p-4">
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

        {/* CURRENT LEVEL (BASED ON LIFETIME LEARNING) */}
        <div className="mt-2 text-sm font-medium text-primary">
          Level: <span className="font-semibold">{highestLevel}</span>
        </div>


        {completedSubtopics === totalSubtopics && totalSubtopics > 0 ? (
          <div className="mt-3 text-sm font-medium text-success">
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
            className="text-xs font-medium text-destructive hover:text-destructive/90 hover:underline"
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
          <Card className="border border-border shadow-md dark:shadow-[0_0_0_1px_hsl(var(--border))]">
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
                      const subtopicTrackKey = `g4_subtopic_completed_${subtopicId}`;
                      sub.__completed = isSubtopicCompleted;
                      // ✅ EARNED SUBTOPICS (LIFETIME, NOT RESET)
                      // const earnedRaw = localStorage.getItem("shashcode_earned_subtopics");
                      // const earnedSubtopics = earnedRaw ? JSON.parse(earnedRaw) : {};

                      // if (isSubtopicCompleted && !earnedSubtopics[subtopicId]) {
                      //   earnedSubtopics[subtopicId] = true;
                      //   localStorage.setItem(
                      //     "shashcode_earned_subtopics",
                      //     JSON.stringify(earnedSubtopics)
                      //   );
                      // }


                      if (
                        isSubtopicCompleted &&
                        typeof window !== "undefined" &&
                        !localStorage.getItem(subtopicTrackKey)
                      ) {
                        trackEvent("subtopic_completed", {
                          sheet: "DSA",
                          main_topic: mainTopic["Main Topic"],
                          subtopic: sub.Subtopic,
                        });

                        localStorage.setItem(subtopicTrackKey, "true");
                      }

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
                                    onClick={() => {
                                      trackEvent("youtube_video_click", {
                                        sheet: "DSA",
                                        topic: mainTopic["Main Topic"],
                                        subtopic: sub.Subtopic,
                                      });
                                    }}
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
        ${isSolved ? "bg-success/20 border-success" : "hover:bg-accent/5"}
      `}>
                                    {/* LEFT (EXACT OLD UI — DO NOT TOUCH) */}
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 flex-1">
                                      <span className="flex items-center leading-snug">
                                        {d.Detail}
                                      </span>

                                      <div className="flex items-center gap-3">
                                        {d._links.map((link, idx) =>
                                          link.includes("leetcode") ? (
                                            <a key={idx} href={link} target="_blank" rel="noopener noreferrer" onClick={() => {
                                              trackEvent("outbound_problem_click", {
                                                platform: "leetcode",
                                                question_id: d.id,
                                                sheet: "DSA",
                                              });
                                            }}>
                                              <SiLeetcode size={18} style={{ color: "#FFA116" }} />
                                            </a>
                                          ) : link.includes("geeksforgeeks") ? (
                                            <a key={idx} href={link} target="_blank" rel="noopener noreferrer" onClick={() => {
                                              trackEvent("outbound_problem_click", {
                                                platform: "gfg",
                                                question_id: d.id,
                                                sheet: "DSA",
                                              });
                                            }}>
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
                                          <a href={d["Video Link"]} target="_blank" rel="noopener noreferrer" onClick={() => {
                                            trackEvent("youtube_video_click", {
                                              sheet: "DSA",
                                              topic: mainTopic["Main Topic"],
                                              subtopic: sub.Subtopic,
                                            });
                                          }}>
                                            <Youtube className="text-red-500" size={18} />
                                          </a>
                                        )}
                                      </div>
                                    </div>
                                    {/* RIGHT: checkbox */}

                                    <div>
                                      <div
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          const updated = toggleQuestionProgress(questionId);
                                          setQuestionProgress(updated);
                                          // GA4 tracking (question solved / unsolved)
                                          if (!isSolved) {
                                            trackEvent("question_marked_solved", {
                                              question_id: questionId,
                                              sheet: "DSA",
                                            });
                                          }

                                          // fire once: progress feature used
                                          if (!localStorage.getItem("g4_used_progress")) {
                                            trackEvent("progress_feature_used", {
                                              sheet: "DSA",
                                            });
                                            localStorage.setItem("g4_used_progress", "true");
                                          }
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
