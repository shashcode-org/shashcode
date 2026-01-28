import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Section from "@/components/Section";
import DSA_RESTART from "../components/DSARestart";
import { dsaRestart } from "../data/dsa-restart-162";
import { Helmet } from "react-helmet-async";

const DSARestartPage = () => {
    const AudienceToggle = () => {
  const [open, setOpen] = useState(null);

  return (
    <div className="bg-white/60 backdrop-blur-md rounded-xl p-6 sm:p-8 shadow-sm border">
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setOpen(open === "for" ? null : "for")}
          className={`px-4 py-2 rounded-full text-sm font-medium border
            ${open === "for"
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-muted/60 hover:bg-accent"}`}
        >
          Who this is for
        </button>

        <button
          onClick={() => setOpen(open === "notfor" ? null : "notfor")}
          className={`px-4 py-2 rounded-full text-sm font-medium border
            ${open === "notfor"
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-muted/60 hover:bg-accent"}`}
        >
          Who this is NOT for
        </button>
      </div>

      {open === "for" && (
        <ul className="list-disc ml-6 text-gray-700 space-y-2">
          <li>You have studied DSA before but feel out of practice</li>
          <li>You are restarting after a break</li>
          <li>You know basics but lack confidence</li>
          <li>You want structured revision, not random problems</li>
          <li>You are preparing for interviews again</li>
        </ul>
      )}

      {open === "notfor" && (
        <ul className="list-disc ml-6 text-gray-700 space-y-2">
          <li>You are learning DSA for the first time</li>
          <li>You don’t know arrays, recursion, or basic patterns</li>
          <li>You want full theory explanations</li>
          <li>You are looking for a beginner roadmap</li>
        </ul>
      )}
    </div>
  );
};

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>DSA Restart – ShashCode</title>
        <meta
          name="description"
          content="DSA Restart is a structured 7-week problem-solving program designed to rebuild confidence and interview readiness."
        />
      </Helmet>

      <Navbar />

      <div className="pt-24 flex-grow">
        <Section
          title="DSA Restart – 7 Week Challenge"
          subtitle="Structured restart • Confidence-first • Interview-oriented problem solving"
          contentClassName="mt-8"
          gradient
        >
          {/* INTRO */}
          <div className="max-w-4xl mx-auto space-y-8 mb-10">
             {/* WHO THIS IS FOR / NOT FOR */}
            <AudienceToggle />
            <div className="bg-white/60 backdrop-blur-md rounded-xl p-6 sm:p-8 shadow-sm border">
              <p className="text-gray-700 leading-relaxed">
                DSA Restart is a structured program for people who have already studied
                data structures and algorithms but feel out of touch, stuck, or low on confidence.
              </p>

              <p className="mt-4 text-gray-700 leading-relaxed">
                This is not a beginner sheet and not a last-minute cram list.
                It is designed to help you regain problem-solving flow through
                a guided, week-by-week restart.
              </p>
            </div>

            {/* HOW TO USE */}
            <div className="bg-gradient-to-br from-primary/5 via-accent/10 to-secondary/5 rounded-xl p-6 sm:p-8 border">
              <h3 className="text-xl font-semibold mb-4">
                How to use DSA Restart effectively
              </h3>

              <div className="space-y-4">
                {[
                  "Follow the sheet week by week — do not jump ahead",
                  "Focus on understanding patterns, not just solving",
                  "Skip optional problems if you feel overloaded",
                  "Track weekly progress instead of total count",
                  "Note weak areas and revise separately",
                ].map((text, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold flex items-center justify-center">
                      {index + 1}
                    </div>
                    <p className="text-gray-700 leading-relaxed">{text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* INTENT */}
            <div className="bg-white/60 backdrop-blur-md rounded-xl p-6 sm:p-8 shadow-sm border">
              <p className="text-gray-700 leading-relaxed">
                This restart program is intentionally challenging.
                If you are still learning core DSA concepts, start with the DSA or Java + DSA sheets first.
                This page is meant for rebuilding confidence, not concept learning.
              </p>
            </div>
          </div>

          <div className="flex justify-center my-16">
            <div className="w-24 h-1 rounded-full bg-primary/20" />
          </div>

          {/* SHEET */}
          <div id="dsa-restart-sheet" className="h-0 scroll-mt-32" />

          <div className="mt-8 pt-8 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 shadow-lg">
            <DSA_RESTART data={dsaRestart} />
          </div>
        </Section>
      </div>

      <Footer />
    </div>
  );
};

export default DSARestartPage;
