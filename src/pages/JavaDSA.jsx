import React from "react";
import CSV_TABLE_UI from "../components/CSV_TABLE_UI";
import AnimatedElement from "@/components/AnimatedElement";
import Section from "@/components/Section";
import PageHero from "@/components/PageHero";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { csvData } from "../data/csv-data-java-dsa-release-v3";
import { Helmet } from "react-helmet-async";

const JavaDSA = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Java + DSA Sheet – ShashCode</title>
        <meta
          name="description"
          content="Complete Java + DSA sheet covering Java fundamentals, OOPs, and data structures and algorithms for placement preparation."
        />
      </Helmet>

      <Navbar />

      <PageHero
        title="Java + DSA Sheet"
        subtitle="Learn Java programming and master DSA with a single structured roadmap"
      />

      <div className="pt-12 flex-grow">
        <AnimatedElement animation="fadeIn">
          <Section contentClassName="mt-8">
            {/* ================= CONTENT BLOCK ================= */}
            <div className="max-w-4xl mx-auto space-y-8 mb-10">

              {/* INTRO CARD */}
              <div className="bg-card/60 backdrop-blur-md rounded-xl p-6 sm:p-8 shadow-sm border border-border">
                <p className="text-foreground leading-relaxed">
                  This Java + DSA Sheet is designed for beginners as well as intermediate
                  learners who want to prepare for coding interviews using{" "}
                  <strong>Java as their primary programming language</strong>.
                </p>

                <p className="mt-4 text-foreground leading-relaxed">
                  Instead of juggling between Java basics and DSA from different sources,
                  this sheet provides a{" "}
                  <strong>single, structured learning path</strong> that starts from Java
                  fundamentals and gradually moves towards advanced data structures and
                  algorithms.
                </p>

                {/* JUMP CTA */}
                <div className="mt-6 flex justify-center">
                  <span
                    onClick={() => {
                      const el = document.getElementById("dsa-sheet");
                      if (!el) return;

                      const yOffset = -120; // navbar height + spacing
                      const y =
                        el.getBoundingClientRect().top + window.pageYOffset + yOffset;

                      window.scrollTo({ top: y, behavior: "smooth" });
                    }}
                    style={{
                      color: "hsl(262 83% 68%)",
                      cursor: "pointer",
                      textShadow: "0 0 6px rgba(168,85,247,0.35)",
                    }}
                    className="font-semibold hover:underline transition"
                  >
                    Jump to the Java + DSA Sheet ↓
                  </span>


                </div>
              </div>

              {/* WHAT YOU WILL LEARN */}
              <div className="bg-card/60 backdrop-blur-md rounded-xl p-6 sm:p-8 shadow-sm border border-border">
                <h3 className="text-xl font-semibold mb-3">
                  What this Java + DSA Sheet covers
                </h3>

                <p className="text-foreground leading-relaxed">
                  The journey begins with core Java concepts such as{" "}
                  <strong>
                    variables, data types, loops, functions, arrays, strings, and OOPs
                  </strong>{" "}
                  to build a strong programming foundation.
                </p>

                <p className="mt-3 text-foreground leading-relaxed">
                  Once the Java basics are clear, the sheet transitions smoothly into{" "}
                  <strong>
                    Data Structures and Algorithms including recursion, linked lists,
                    stacks, queues, trees, graphs, dynamic programming, and greedy
                    algorithms
                  </strong>.
                </p>

                <p className="mt-3 text-foreground leading-relaxed">
                  All problems are carefully curated to match real interview expectations
                  from service-based and product-based companies.
                </p>
              </div>

              {/* HOW TO USE */}
              <div className="bg-gradient-to-br from-primary/5 via-accent/10 to-secondary/5 rounded-xl p-6 sm:p-8 border border-border">
                <h3 className="text-xl font-semibold mb-4">
                  How to use this sheet effectively
                </h3>

                <p className="text-foreground leading-relaxed mb-4">
                  Follow the sheet in the given order. Avoid jumping directly to advanced
                  DSA topics without completing the Java fundamentals section, as Java
                  concepts are heavily used while implementing data structures.
                </p>

                <div className="space-y-4">
                  {[
                    "Complete Java basics before moving to DSA topics",
                    "Implement every problem yourself before watching solutions",
                    "Write clean Java code and analyze time & space complexity",
                    "Revise core Java and DSA concepts regularly",
                  ].map((text, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold flex items-center justify-center">
                        {index + 1}
                      </div>
                      <p className="text-foreground leading-relaxed">{text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* CONSISTENCY MESSAGE */}
              <div className="bg-card/60 backdrop-blur-md rounded-xl p-6 sm:p-8 shadow-sm border border-border">
                <p className="text-foreground leading-relaxed">
                  This sheet is not meant for rushed completion.{" "}
                  <span className="font-semibold">
                    Strong Java fundamentals + consistent DSA practice
                  </span>{" "}
                  is the combination that clears interviews.
                </p>

                <p className="mt-4 text-foreground leading-relaxed">
                  If you are a beginner, take your time with Java concepts. If you already
                  know Java, use the initial sections as a quick revision before diving
                  deep into DSA problem-solving.
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
              <div className="bg-card/5 backdrop-blur-sm rounded-xl border border-border shadow-lg">
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

export default JavaDSA;
