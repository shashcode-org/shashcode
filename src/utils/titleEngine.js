// src/utils/titleEngine.js
import { trackEvent } from "@/utils/analytics";
const BADGES_KEY = "shashcode_badges";


export const TITLES = [
    "Novice",
    "Coder",
    "Problem Solver",
    "Algorithmist",
    "DSA Specialist",
];

export function getLevelFromQualifies(qualifies) {
  if (qualifies["DSA Specialist"]) return "DSA Specialist";
  if (qualifies["Algorithmist"]) return "Algorithmist";
  if (qualifies["Problem Solver"]) return "Problem Solver";
  if (qualifies["Coder"]) return "Coder";
  return "Novice";
}

// -------- BUCKET DEFINITIONS --------

const BUCKETS = {
    A: [
        "Java Basics",
        "Object Oriented Programming",
        "Exception Handling",
        "Pattern Printing",
        "Time & Space Complexity",
    ],
    B: [
        "Collections Framework",
        "Maths in DSA",
        "Bit Manipulation",
        "Searching Algorithms",
        "Sorting Algorithms",
    ],
    C: [
        "Matrix",
        "Hashing",
        "Sliding Window",
        "Two Pointers",
        "Recursion",
    ],
    D: [
        "Backtracking",
        "Divide and Conquer",
        "Dynamic Programming",
        "Greedy Algorithms",
    ],
    E: [
        "Stack",
        "Queue",
        "String Manipulation",
        "String Pattern Matching",
        "Linked List",
        "Trees",
        "Heap & Priority Queue",
        "Graphs",
        "Tries",
    ],
};

// -------- HELPERS --------

const readBadges = () => {
    try {
        const raw = localStorage.getItem(BADGES_KEY);
        return raw ? JSON.parse(raw) : {};
    } catch {
        return {};
    }
};


const readEarnedSubtopics = () => {
    try {
        const raw = localStorage.getItem("shashcode_earned_subtopics");
        return raw ? JSON.parse(raw) : {};
    } catch {
        return {};
    }
};




// -------- CORE CHECK --------

export function evaluateTitles({
    csvData,
    completedSubtopics,
    totalSubtopics,
}) {
    if (completedSubtopics === 0) {
        return {
            currentLevel: "Novice",
        };
    }
    const earnedSubtopics = readEarnedSubtopics();
    const earnedCount = Object.keys(earnedSubtopics).length;

    const earnedPercent = totalSubtopics
        ? Math.round((earnedCount / totalSubtopics) * 100)
        : 0;


    // Collect completed main topics
    const completedMainTopics = new Set();

    csvData.forEach((topic) => {
        const anySubtopicDone = topic.Subtopics.some((sub) => {
            return sub.__completed === true;
        });

        if (anySubtopicDone) {
            completedMainTopics.add(topic["Main Topic"]);
        }


    });

    // -------- TITLE CHECKS --------

    const qualifies = {
        Novice:
            true,

        Coder: (() => {
            let bucketCount = 0;
            ["A", "B", "E"].forEach((key) => {
                if (
                    BUCKETS[key].some((t) => completedMainTopics.has(t))
                ) {
                    bucketCount++;
                }
            });
            return bucketCount >= 2;
        })(),

        "Problem Solver":
            earnedPercent >= 40 &&
            BUCKETS.C.some((t) => completedMainTopics.has(t)),

        Algorithmist:
            earnedPercent >= 60 &&
            BUCKETS.D.some((t) => completedMainTopics.has(t)),

        "DSA Specialist":
            earnedPercent >= 85 &&
            Object.values(BUCKETS).every((bucket) =>
                bucket.some((t) => completedMainTopics.has(t))
            ),

    };

    let currentLevel = "Novice";

    if (qualifies["DSA Specialist"]) {
        currentLevel = "DSA Specialist";
    } else if (qualifies["Algorithmist"]) {
        currentLevel = "Algorithmist";
    } else if (qualifies["Problem Solver"]) {
        currentLevel = "Problem Solver";
    } else if (qualifies["Coder"]) {
        currentLevel = "Coder";
    }

    const badges = readBadges();

    if (currentLevel !== "Novice" && !badges[currentLevel]) {
        badges[currentLevel] = true;
        localStorage.setItem(BADGES_KEY, JSON.stringify(badges));

        trackEvent("badge_earned", {
            badge: currentLevel,
            sheet: "DSA",
        });
    }


    return {
        currentLevel,
    };


}
