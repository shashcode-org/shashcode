import { useState, useEffect, useRef } from "react";
import Wheel from "@/components/wheel/wheel";
import type { WheelHandle } from "@/components/wheel/wheel";


type Question = {
  q: string;
  options: string[];
  correct: string;
};

const QUESTIONS: Question[] = [
  {
    q: "Time complexity of Binary Search?",
    options: ["O(n)", "O(log n)", "O(n^2)"],
    correct: "O(log n)",
  },
  {
    q: "Which data structure uses FIFO?",
    options: ["Stack", "Queue", "Tree"],
    correct: "Queue",
  },
  {
    q: "Which traversal gives sorted order in BST?",
    options: ["Preorder", "Postorder", "Inorder"],
    correct: "Inorder",
  },
  {
    q: "Which keyword is used to inherit a class in Java?",
    options: ["this", "extends", "super"],
    correct: "extends",
  },
  {
    q: "Heap memory is used for?",
    options: ["Variables", "Objects", "Threads"],
    correct: "Objects",
  },
];

const PreLaunchGame = () => {
  const [question, setQuestion] = useState<Question | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [won, setWon] = useState(false);
  const [spinning, setSpinning] = useState(false);

  const wheelRef = useRef<WheelHandle>(null);

  useEffect(() => {
    const random =
      QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)];
    setQuestion(random);
  }, []);

  if (!question) return null;

  return (
    <div className="min-h-screen flex items-center justify-center hero-gradient px-4">
      <div className="card-glass max-w-xl w-full p-6 sm:p-8 text-center relative">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4">
            Pre-Launch Access Challenge
        </h1>

        <p className="text-gray-700 mb-6">
          You know the answer?
          <br />
          <span className="font-semibold">
            Now let the wheel decide.
          </span>
        </p>

        <div className="mb-6">
          <p className="font-semibold text-lg">{question.q}</p>
        </div>

        {/*  WHEEL */}
        <div className="mb-8 flex justify-center">
          <Wheel
            ref={wheelRef}
            items={question.options}
            onFinish={(picked) => {
              setResult(picked);
              setSpinning(false);

              if (picked === question.correct) {
                localStorage.setItem("shashcode_access", "true");
                setWon(true);
              }
            }}
          />
        </div>

        {/*  WRONG RESULT */}
        {result && !won && (
          <p className="mt-4 text-red-600 font-semibold">
            The wheel landed on: <b>{result}</b>
            <br />
            Reload to try again.
          </p>
        )}

        {/*  SPIN BUTTON */}
        {!result && (
          <button
            disabled={spinning}
            onClick={() => {
              setSpinning(true);
              wheelRef.current?.spin();
            }}
            className="btn-primary w-full mt-4 disabled:opacity-60"
          >
            {spinning ? "Spinning..." : "Spin the Wheel "}
          </button>
        )}

        {/*  WIN POPUP */}
        {won && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="card-glass p-6 sm:p-8 max-w-sm text-center">
              <h2 className="text-2xl font-bold mb-3">
                Early Access Unlocked!
              </h2>
              <p className="mb-4">
                <b>You cleared the pre-launch challenge.</b>
                <br />
                Welcome to ShashCode.
              </p>

              <button
                onClick={() => (window.location.href = "/")}
                className="btn-primary w-full"
              >
                    Go to Website
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PreLaunchGame;
