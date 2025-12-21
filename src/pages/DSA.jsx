import React from "react";
import CSV_TABLE_UI from "../components/CSV_TABLE_UI";
import AnimatedElement from "@/components/AnimatedElement";
import Section from "@/components/Section";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { csvData } from "../data/csv-data-dsa-release-v2";
import { Helmet } from "react-helmet-async";
const DSA = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>DSA Sheet – ShashCode</title>
        <meta
          name="description"
          content="Structured DSA sheet covering arrays, recursion, trees, graphs, DP and more."
        />
      </Helmet>

      <Navbar />

      <div className="pt-24 flex-grow">
        <AnimatedElement animation="fadeIn">
          <Section
            title="DSA Sheet"
            subtitle="Master data structures and algorithms with our comprehensive learning path"
            contentClassName="mt-8"
            gradient
          >
            <AnimatedElement animation="fadeIn" delay="100">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 shadow-lg">
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
