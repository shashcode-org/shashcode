import React from "react";
import CSV_TABLE_UI from "../components/CSV_TABLE_UI";
import AnimatedElement from "@/components/AnimatedElement";
import Section from "@/components/Section";
import PageHero from "@/components/PageHero";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { csvData } from "../data/csv-data-dsa-release-v3";
import { Helmet } from "react-helmet-async";

const DSA = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>DSA Sheet – ShashCode</title>
        <meta
          name="description"
          content="Structured DSA sheet covering arrays, strings, recursion, trees, graphs, and dynamic programming for interview preparation."
        />
      </Helmet>

      <Navbar />

      <PageHero
        title="DSA Sheet"
        subtitle="Master data structures and algorithms with a structured, interview-focused learning path"
      />

      <div className="pt-12 flex-grow">
        <AnimatedElement animation="fadeIn">
          <Section contentClassName="mt-8">
            {/* CONTENT BLOCK */}
            <div className="max-w-4xl mx-auto space-y-8 mb-10">

              {/* INTRO CARD */}
              <div className="bg-white/60 backdrop-blur-md rounded-xl p-6 sm:p-8 shadow-sm border">
                <p className="text-gray-700 leading-relaxed">
                  This DSA Sheet is designed to help students and working professionals build
                  strong problem-solving skills required for technical interviews.
                </p>

                <p className="mt-4 text-gray-700 leading-relaxed">
                  Instead of randomly solving problems across platforms, this sheet follows a
                  <strong> structured roadmap</strong> covering all core data structures and
                  algorithms frequently asked in interviews.
                </p>

                {/* JUMP CTA */}
                <div className="mt-6 flex justify-center">
                  <button
                    onClick={() => {
                      const el = document.getElementById("dsa-sheet");
                      if (!el) return;

                      const yOffset = -120; // navbar height + spacing
                      const y =
                        el.getBoundingClientRect().top + window.pageYOffset + yOffset;

                      window.scrollTo({ top: y, behavior: "smooth" });
                    }}
                    className="text-primary font-medium hover:underline"
                  >
                    Jump directly to the DSA Sheet ↓
                  </button>

                </div>
              </div>

              {/* WHAT YOU WILL LEARN */}
              <div className="bg-white/60 backdrop-blur-md rounded-xl p-6 sm:p-8 shadow-sm border">
                <h3 className="text-xl font-semibold mb-3">
                  What this DSA Sheet covers
                </h3>

                <p className="text-gray-700 leading-relaxed">
                  The learning path begins with foundational topics such as{" "}
                  <strong>Arrays, Strings, and Recursion</strong>, and gradually progresses
                  towards advanced concepts including{" "}
                  <strong>
                    Trees, Graphs, Dynamic Programming, and Greedy Algorithms
                  </strong>.
                </p>

                <p className="mt-3 text-gray-700 leading-relaxed">
                  Each topic contains carefully selected problems that reflect real interview
                  patterns seen in product-based companies.
                </p>
              </div>

              {/* HOW TO USE */}
              <div className="bg-gradient-to-br from-primary/5 via-accent/10 to-secondary/5 rounded-xl p-6 sm:p-8 border">
                <h3 className="text-xl font-semibold mb-4">
                  How to use this sheet effectively
                </h3>

                <p className="text-gray-700 leading-relaxed mb-4">
                  Start by understanding the core concept of a topic before jumping into
                  problem-solving. Solve problems in the given order and avoid directly
                  looking at solutions.
                </p>

                <div className="space-y-4">
                  {[
                    "Follow topics sequentially instead of skipping randomly",
                    "Focus on patterns and problem-solving techniques",
                    "Analyze time and space complexity for every solution",
                    "Revise previously solved problems regularly",
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

              {/* CONSISTENCY MESSAGE */}
              <div className="bg-white/60 backdrop-blur-md rounded-xl p-6 sm:p-8 shadow-sm border">
                <p className="text-gray-700 leading-relaxed">
                  This sheet is not meant for quick browsing.{" "}
                  <span className="font-semibold">
                    Consistency matters more than speed.
                  </span>{" "}
                  Solving even 3–4 problems daily with proper analysis will build strong
                  confidence over time and significantly improve your performance in coding
                  rounds.
                </p>

                <p className="mt-4 text-gray-700 leading-relaxed">
                  If you are preparing for placements, internships, or planning a job switch,
                  this DSA Sheet can act as your daily practice companion. Follow it sincerely,
                  revise regularly, and combine it with contests and mock interviews for best
                  results.
                </p>
              </div>
            </div>

            <div className="flex justify-center my-16">
              <div className="w-24 h-1 rounded-full bg-primary/20" />
            </div>


            {/* SHEET (ANCHOR TARGET) */}
            {/* ANCHOR OFFSET (DO NOT STYLE CONTENT HERE) */}
            <div id="dsa-sheet" className="h-0 scroll-mt-32" />

            {/* VISUAL SPACING */}
            <AnimatedElement animation="fadeIn" delay="100" className="mt-8">
              <div className="pt-8 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 shadow-lg">
                <CSV_TABLE_UI csvData={csvData} />
              </div>
            </AnimatedElement>
          </Section>
        </AnimatedElement>
      </div>

      <Footer />
    </div>
  );
};

export default DSA;
