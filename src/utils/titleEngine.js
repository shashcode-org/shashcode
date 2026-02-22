// src/utils/titleEngine.js

// --------------------------------------------------
// 🔒 CANONICAL LEVEL DEFINITIONS (DISPLAY ONLY)
// --------------------------------------------------

export const LEVELS = [
    "Novice",
    "Coder",
    "Problem Solver",
    "Algorithmist",
    "DSA Specialist",
];

// --------------------------------------------------
// 🎯 Rank → Title mapper (PURE FUNCTION)
// --------------------------------------------------

export function getLevelFromRank(rank) {
    const n = Number(rank);
    if (!Number.isInteger(n)) return "Novice";
    return LEVELS[n] ?? "Novice";
}

// --------------------------------------------------
// 📦 BUCKET DEFINITIONS (READ-ONLY METADATA)
// --------------------------------------------------
// Used ONLY by frontend to compute bucketCompletion
// NEVER used to decide level here
// --------------------------------------------------

export const BUCKETS = {
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

// --------------------------------------------------
// 🚫 INTENTIONALLY NO LOGIC BELOW
// --------------------------------------------------
// ❌ No evaluateTitles
// ❌ No badge logic
// ❌ No analytics
// ❌ No localStorage
//
// This file is DISPLAY + METADATA ONLY
// Backend is the single authority for levels
// --------------------------------------------------
