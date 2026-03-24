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
import { toast } from "sonner";
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


}

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
  const lastSyncedRef = useRef(null);
  const hasHydratedFromLocalRef = useRef(false);
  const hasUserInteractedRef = useRef(false);
  const hydratedUserRef = useRef(null);
  const isHydratingRef = useRef(false);

  const questionProgressRef = useRef(questionProgress);
  const subtopicProgressRef = useRef(subtopicProgress);

  useEffect(() => {
    const handler = () => {
      console.log("🔁 Migration done → rehydrating");
      hydratedUserRef.current = null; // reset
      setUserId((prev) => prev); // force re-run
    };

    window.addEventListener("migrationCompleted", handler);

    return () => {
      window.removeEventListener("migrationCompleted", handler);
    };
  }, []);

  useEffect(() => {
    questionProgressRef.current = questionProgress;
    subtopicProgressRef.current = subtopicProgress;
  }, [questionProgress, subtopicProgress]);

  const previousUserRef = useRef(null);


  const isJavaDSASheet = useMemo(() => {
    return csvData.some(
      t => t["Main Topic"] === "Java Basics"
    );
  }, [csvData]);

  const [userId, setUserId] = useState(undefined);

  useEffect(() => {
    console.log("🔥 QUESTION COUNT:", Object.keys(questionProgress).length);
    console.log("🔥 SUBTOPIC COUNT:", Object.keys(subtopicProgress).length);
  }, [questionProgress, subtopicProgress]);

  useEffect(() => {

    const load = async () => {
      const { data } = await supabase.auth.getSession();
      const id = data.session?.user?.id ?? null;

      setUserId((prev) => {
        previousUserRef.current = prev;
        return id;
      });
    };

    load();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {

        const id = session?.user?.id ?? null;

        setUserId((prev) => {
          previousUserRef.current = prev;
          return id;
        });

      }
    );

    return () => listener.subscription.unsubscribe();

  }, []);


  const sheet = isJavaDSASheet ? "JAVA_DSA" : "DSA";

  useEffect(() => {

    if (userId !== null) return;

    const prevUser = previousUserRef.current;
    if (!prevUser) return;

    const guestKeys = getStorageKeys(null, sheet);

    let copied = false;

    if (Object.keys(questionProgress).length) {
      localStorage.setItem(
        guestKeys.USER_QUESTION_STORAGE_KEY,
        JSON.stringify(questionProgress)
      );
      copied = true;
    }

    if (Object.keys(subtopicProgress).length) {
      localStorage.setItem(
        guestKeys.USER_SUBTOPIC_STORAGE_KEY,
        JSON.stringify(subtopicProgress)
      );
      copied = true;
    }

    if (copied) {
      console.log("🔁 Copied user progress → guest on logout");
    }

  }, [userId, sheet]);

  function migrateLegacyToGuest(sheet) {
    const legacyQuestions = localStorage.getItem(QUESTION_STORAGE_KEY);
    const legacySubtopics = localStorage.getItem(SUBTOPIC_STORAGE_KEY);


    const guestKeys = getStorageKeys(null, sheet);

    const guestQuestions = localStorage.getItem(
      guestKeys.USER_QUESTION_STORAGE_KEY
    );

    const guestSubtopics = localStorage.getItem(
      guestKeys.USER_SUBTOPIC_STORAGE_KEY
    );

    if (legacyQuestions && !guestQuestions) {
      localStorage.setItem(
        guestKeys.USER_QUESTION_STORAGE_KEY,
        legacyQuestions
      );

      console.log("✅ Migrated legacy questionProgress → guest key");
    }

    if (legacySubtopics && !guestSubtopics) {
      localStorage.setItem(
        guestKeys.USER_SUBTOPIC_STORAGE_KEY,
        legacySubtopics
      );

      console.log("✅ Migrated legacy subtopicProgress → guest key");
    }
  }

  const { USER_QUESTION_STORAGE_KEY, USER_SUBTOPIC_STORAGE_KEY } =
    getStorageKeys(userId, sheet);





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
    hasUserInteractedRef.current = true;
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
    hasUserInteractedRef.current = true;
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


  useEffect(() => {

    if (userId === undefined) return;

    const hydrationKey = `${userId}_${sheet}`;

    if (hydratedUserRef.current === hydrationKey) {
      console.log("⛔ Skipping hydration for same user");
      return;
    }

    hydratedUserRef.current = hydrationKey;




    (async () => {
      isHydratingRef.current = true;
      try {
        const alreadyMigrated = localStorage.getItem("migration_done");
        const userQ = JSON.parse(
          localStorage.getItem(`questionProgress_${userId}_${sheet}`) || "{}"
        );
        const userS = JSON.parse(
          localStorage.getItem(`subtopicProgress_${userId}_${sheet}`) || "{}"
        );

        const guestQ = JSON.parse(localStorage.getItem(`questionProgress_guest_${sheet}`) || "{}");
        const guestS = JSON.parse(localStorage.getItem(`subtopicProgress_guest_${sheet}`) || "{}");

        const hasGuestData =
          Object.keys(guestQ).length > 0 ||
          Object.keys(guestS).length > 0;

        const hasUserData = Object.keys(userQ).length > 0 || Object.keys(userS).length > 0;

        if (!alreadyMigrated && userId && !hasUserData && hasGuestData) {
          console.log("⛔ Waiting for migration (user)");

          console.log("📦 Using guest fallback");
          setQuestionProgress(guestQ);
          setSubtopicProgress(guestS);


          isHydratingRef.current = false;
          return;
        }
        console.log("🚀 Starting hydration");




        // --------------------------------------------------
        // STEP 1: MIGRATE OLD GLOBAL + GUEST KEYS → USER KEYS
        // --------------------------------------------------

        if (userId) {

          // 🔹 1. Merge guest keys → user keys (ALWAYS MERGE)
          const guestKeys = getStorageKeys(null, sheet);

          const guestQuestions =
            localStorage.getItem(guestKeys.USER_QUESTION_STORAGE_KEY);

          const guestSubtopics =
            localStorage.getItem(guestKeys.USER_SUBTOPIC_STORAGE_KEY);

          if (guestQuestions) {
            const parsedGuest = JSON.parse(guestQuestions);
            const existingUser = JSON.parse(
              localStorage.getItem(USER_QUESTION_STORAGE_KEY) || "{}"
            );

            localStorage.setItem(
              USER_QUESTION_STORAGE_KEY,
              JSON.stringify({
                ...parsedGuest,
                ...existingUser,
              })
            );

            console.log("🔥 Guest questions merged into user");
          }

          if (guestSubtopics) {
            const parsedGuest = JSON.parse(guestSubtopics);
            const existingUser = JSON.parse(
              localStorage.getItem(USER_SUBTOPIC_STORAGE_KEY) || "{}"
            );

            localStorage.setItem(
              USER_SUBTOPIC_STORAGE_KEY,
              JSON.stringify({
                ...parsedGuest,
                ...existingUser,
              })
            );

            console.log("🔥 Guest subtopics merged into user");


          }
          if (guestQuestions || guestSubtopics) {
            localStorage.removeItem(guestKeys.USER_QUESTION_STORAGE_KEY);
            localStorage.removeItem(guestKeys.USER_SUBTOPIC_STORAGE_KEY);
            console.log("🧹 Guest keys cleaned after merge");
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

        let dbData = null;

        if (userId) {
          dbData = await hydrateProgressFromDB(sheet);
        }

        console.log("📥 DB data:", dbData);


        let finalQuestions = {};
        let finalSubtopics = {};
        let finalUpdatedAt = null;


        // --------------------------------------------------
        // CASE A: DB EXISTS
        // --------------------------------------------------

        if (userId) {

          const dbQuestions = dbData?.questions || {};
          const dbSubtopics = dbData?.subtopics || {};

          // 🔥 ALWAYS MERGE (UNION)
          finalQuestions = {
            ...dbQuestions,
            ...localQuestions
          };

          finalSubtopics = {
            ...dbSubtopics,
            ...localSubtopics
          };

          console.log("🔀 Merging DB + Local (union)");

          const merged =
            JSON.stringify(finalQuestions) !== JSON.stringify(dbQuestions) ||
            JSON.stringify(finalSubtopics) !== JSON.stringify(dbSubtopics);

          if (merged) {
            // 🔥 Always sync merged back to DB
            await syncProgressToServer({
              sheet,
              subtopics: finalSubtopics,
              questions: finalQuestions,
              completedPercent: 0,
              bucketCompletion: {},
              completedMainTopics: [],
            });

            // use fresh timestamp
            finalUpdatedAt = new Date().toISOString();
          }


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
        // STEP 7: CLEAN OLD KEYS
        // --------------------------------------------------

        if (userId) {

          localStorage.removeItem(QUESTION_STORAGE_KEY);
          localStorage.removeItem(SUBTOPIC_STORAGE_KEY);

          console.log("🧹 Old keys cleaned");

        }


        hasHydratedFromLocalRef.current = true;
        hasUserInteractedRef.current = false;
        console.log("✅ Hydration complete");

      } catch (err) {
        console.error("Hydration error:", err);
        const localQuestions = readQuestionProgress();
        const localSubtopics = readSubtopicProgress();

        setQuestionProgress(localQuestions);
        setSubtopicProgress(localSubtopics);
      } finally {
        isHydratingRef.current = false;
      }



    })();

  }, [userId, sheet]);



  useEffect(() => {
    console.log("🧠 Storage keys:", {
      USER_QUESTION_STORAGE_KEY,
      USER_SUBTOPIC_STORAGE_KEY,
    });

    // ❌ don't sync before localStorage hydration
    if (!hasHydratedFromLocalRef.current) return;

    // 🔥 DO NOT SYNC UNLESS USER ACTUALLY CHANGED SOMETHING
    if (!hasUserInteractedRef.current) return;
    if (isHydratingRef.current) return;   // 🔥 CRITICAL

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
      lastSyncedRef.current = JSON.stringify({
        questions: questionProgress,
        subtopics: subtopicProgress,
      });
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



      // optional debug
      console.log("✅ Debounced sync to DB");
    }, 800); // ⏱️ 800ms debounce

    // cleanup (important)
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [subtopicProgress, questionProgress, progressPercent, bucketCompletion, sheet]);

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
          console.log("🔄 Realtime progress update");

          const progress = payload.new?.progress_json || {};

          const dbQuestions = progress.questions || {};
          const dbSubtopics = progress.subtopics || {};

          const incoming = JSON.stringify({
            questions: dbQuestions,
            subtopics: dbSubtopics,
          });

          if (incoming === lastSyncedRef.current) {
            console.log("⏭ Ignoring own realtime update");
            return;
          }

          // Only update if actually different
          if (
            JSON.stringify(dbQuestions) === JSON.stringify(questionProgressRef.current) &&
            JSON.stringify(dbSubtopics) === JSON.stringify(subtopicProgressRef.current)
          ) {
            console.log("⏭ No real change from realtime");
            return;
          }

          console.log("📥 Applying DB state");

          setQuestionProgress(dbQuestions);
          setSubtopicProgress(dbSubtopics);

          lastSyncedRef.current = JSON.stringify({
            questions: dbQuestions,
            subtopics: dbSubtopics,
          });

          localStorage.setItem(
            USER_QUESTION_STORAGE_KEY,
            JSON.stringify(dbQuestions)
          );

          localStorage.setItem(
            USER_SUBTOPIC_STORAGE_KEY,
            JSON.stringify(dbSubtopics)
          );

          setHighestLevel(
            getLevelFromRank(Number(payload.new.highest_level))
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

        {!userId && (
          <div className="mt-3 text-sm text-accent font-medium">
            {progressPercent < 20 && "Start earning levels as you progress 🚀"}
            {progressPercent >= 20 && progressPercent < 40 && "You’re close to unlocking your first level 👀"}
            {progressPercent >= 40 && "You’re already ahead… unlock your level now 🔥"}
          </div>
        )}

        {/* CURRENT LEVEL (BASED ON LIFETIME LEARNING) */}
        {userId ? (
          <div className="mt-2 text-sm font-medium text-primary">
            Level: <span className="font-semibold">{highestLevel}</span>
          </div>
        ) : (
          <div className="mt-3 flex items-center">
            <div className="text-sm font-medium text-primary">
              🔒 <button
                onClick={() => window.location.href = "/login"}
                className="px-4 py-1.5 text-sm font-semibold rounded-md bg-primary text-white hover:opacity-90 transition"
              >
                Unlock
              </button> your level & badges 🚀
            </div>
          </div>
        )}

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
        {!userId && (
          <div className="mt-2 text-xs text-muted-foreground">
            ⚠️ Your progress is only saved on this device.
          </div>
        )}
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
                                // 🔒 BLOCK GUEST
                                if (!userId) {
                                  toast("🔒 Login to save progress & unlock levels 🚀");
                                  return;
                                }

                                if (totalQuestions === 0) {
                                  const updated = toggleSubtopicProgress(subtopicId);
                                  setSubtopicProgress(updated);
                                  window.dispatchEvent(new Event("progressUpdated"));
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
                                  window.dispatchEvent(new Event("progressUpdated"));
                                  hasUserInteractedRef.current = true;
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
                                          // 🔒 BLOCK GUEST
                                          if (!userId) {
                                            toast("🔒 Login to save progress & unlock levels 🚀");
                                            return;
                                          }

                                          const updated = toggleQuestionProgress(questionId);
                                          setQuestionProgress(updated);
                                          window.dispatchEvent(new Event("progressUpdated"));
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
