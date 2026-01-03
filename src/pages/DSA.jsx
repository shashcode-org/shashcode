import React, { useState } from "react";
import CSV_TABLE_UI from "../components/CSV_TABLE_UI";
import AnimatedElement from "@/components/AnimatedElement";
import Section from "@/components/Section";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProgressTeaserBanner from "@/components/ProgressTeaserBanner";
import NotifyModal from "@/components/NotifyModal";
import { csvData } from "../data/csv-data-dsa-release-v2";
import { Helmet } from "react-helmet-async";
const DSA = () => {
  const [openNotify, setOpenNotify] = useState(false);

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
      <NotifyModal
        open={openNotify}
        onClose={() => setOpenNotify(false)}
      />
      <div className="pt-24 flex-grow">
        <AnimatedElement animation="fadeIn">
          <Section
            title="DSA Sheet"
            subtitle="Master data structures and algorithms with our comprehensive learning path"
            contentClassName="mt-8"
            gradient
          >
            <div className="max-w-6xl mx-auto mt-12 mb-8 px-4 sm:px-0">
              <ProgressTeaserBanner
                onNotifyClick={() => setOpenNotify(true)}
              />
            </div>
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
