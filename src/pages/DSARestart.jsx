import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Section from "@/components/Section";
import DSA_RESTART_TABLE from "../components/DSARestart";
import PageHero from "@/components/PageHero";
import { dsaRestart } from "../data/dsa-restart-162";
import { Helmet } from "react-helmet-async";

const DSARestartPage = () => {


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

      <PageHero
        title="DSA Restart"
        subtitle="A structured 7-week program to regain problem-solving confidence"
      />

      <div className="pt-12 flex-grow">
        <Section
          title="DSA Restart – 7 Week Challenge"
          subtitle="Structured restart • Confidence-first • Interview-oriented problem solving"
          contentClassName="mt-8"
        >

          {/* INTRO */}
          <div className="max-w-4xl mx-auto space-y-8 mb-10">
            <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
              <h3 className="text-base font-semibold text-foreground mb-3">
                Built for developers restarting DSA
              </h3>

              <ul className="space-y-2 text-foreground">
                <li>• You have studied DSA before but feel out of practice</li>
                <li>• You want a structured, week-by-week restart</li>
                <li>• You are preparing for interviews again</li>
              </ul>

              <p className="mt-4 text-sm text-muted-foreground">
                New to DSA?{" "}
                <a
                  href="/dsa"
                  className="text-primary font-medium hover:underline"
                >
                  Start with the DSA Sheet →
                </a>
              </p>
            </div>

            <div className="bg-card/60 backdrop-blur-md rounded-xl p-6 sm:p-8 shadow-sm border border-border">
              <p className="text-foreground leading-relaxed">
                DSA Restart is a structured program for people who have already studied
                data structures and algorithms but feel out of touch, stuck, or low on confidence.
              </p>

              <p className="mt-4 text-foreground leading-relaxed">
                This is not a beginner sheet and not a last-minute cram list.
                It is designed to help you regain problem-solving flow through
                a guided, week-by-week restart.
              </p>
            </div>

            {/* HOW TO USE */}
            <div className="bg-gradient-to-br from-primary/5 via-accent/10 to-secondary/5 rounded-xl p-6 sm:p-8 border border-border">
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
                    <p className="text-foreground leading-relaxed">{text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* INTENT */}
            <div className="bg-card/60 backdrop-blur-md rounded-xl p-6 sm:p-8 shadow-sm border border-border">
              <p className="text-foreground leading-relaxed">
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

          <div className="mt-8 pt-8 bg-card/5 backdrop-blur-sm rounded-xl border border-border shadow-lg">
            <DSA_RESTART_TABLE data={dsaRestart} />
          </div>
        </Section>
      </div>

      <Footer />
    </div>
  );
};

export default DSARestartPage;
