import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Testimonials from "@/components/Testimonials";
import Section from "@/components/Section";
import AnimatedElement from "@/components/AnimatedElement";
import Card, { CardContent, CardTitle } from "@/components/Card";
import { ArrowRight, Code, Award, BookOpen, YoutubeIcon } from "lucide-react";
import { Helmet } from "react-helmet-async";
import Snowfall from "@/components/snowfall/snowfall";
const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col">
      <Snowfall />
      <Helmet>
        <title>ShashCode – Java & DSA for Placements</title>
        <meta
          name="description"
          content="Learn Data Structures and Algorithms in Java with structured sheets and video explanations."
        />
      </Helmet>
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 hero-gradient">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <AnimatedElement animation="fadeIn">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                  Welcome to{" "}
                  <span className="relative text-[#1E1B4B]">
                    ShashCode

                  </span>
                </h1>
              </AnimatedElement>

              <AnimatedElement animation="fadeIn" delay="100">
                <p className="text-lg text-black-300 mb-8">
                  Crack the code, rule the road! Master Java & DSA with structured learning paths
                  designed for interview success.
                </p>
              </AnimatedElement>

              <AnimatedElement animation="fadeIn" delay="200">
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => navigate("/java-dsa")}
                    className="btn-primary flex items-center justify-center gap-2"
                  >
                    Explore Java + DSA Sheet <ArrowRight size={18} />
                  </button>
                </div>
              </AnimatedElement>
            </div>

            <div className="w-full lg:w-1/2 sm:px-4">
              <AnimatedElement animation="fadeIn" delay="200">
                <div className="relative">
                  <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-primary to-secondary opacity-30 blur-xl"></div>
                  <div className="card-glass p-2 sm:p-4 lg:p-8 relative">
                    <div className="bg-gray-800 rounded-lg overflow-hidden">
                      <pre className="px-4 py-4 sm:p-6 text-white font-heading text-xs sm:text-sm overflow-x-auto whitespace-pre max-w-full text-[9px]">
                        <code>{`public class ShashCode {
  boolean isSuccess(boolean hardWork, boolean luck) {
    if (hardWork || luck) {
      System.out.println("You succeeded 🎯");
    } else {
      System.out.println("You still succeeded 💪");
    }

    return true; // Because success is a mindset.
  }
}`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </AnimatedElement>
            </div>
          </div>
        </div>
      </section>

      {/* Explore DSA Sheet */}
      <Section
        title="Explore our DSA Sheets"
        subtitle="Structured roadmaps to crack top tech companies — from Arrays to Dynamic Programming, with Java focus"
        contentClassName="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8"
        gradient
      >
        {[
          {
            icon: <BookOpen className="h-10 w-10 text-primary" />,
            title: "DSA Sheet",
            description: "Focus on core data structures and algorithms for interview prep.",
            buttonText: "Explore DSA Sheet",
            buttonClass: "bg-primary text-white hover:bg-primary/90",
            onClick: () => navigate("/dsa"),
          },
          {
            icon: <Code className="h-10 w-10 text-primary" />,
            title: "Java + DSA Sheet",
            description: "Comprehensive guide from Java basics to advanced DSA concepts.",
            buttonText: "Explore Java + DSA Sheet",
            buttonClass: "bg-primary text-white hover:bg-primary/90",
            onClick: () => navigate("/java-dsa"),
          },
        ].map((sheet, index) => (
          <AnimatedElement key={index} animation="fadeIn" delay={`${(index + 1) * 100}` as any}>
            <Card hover className="h-full">
              <CardContent className="text-center py-8">
                <div className="mb-4 flex justify-center">{sheet.icon}</div>
                <CardTitle className="mb-4">{sheet.title}</CardTitle>
                <p className="text-gray-600 mb-6">{sheet.description}</p>
                <button
                  onClick={sheet.onClick}
                  className={`${sheet.buttonClass} font-semibold px-6 py-3 rounded-xl transition duration-300`}
                >
                  {sheet.buttonText}
                </button>
              </CardContent>
            </Card>
          </AnimatedElement>
        ))}
      </Section>

      {/* Features Section */}
      <Section
        title="Why Choose ShashCode?"
        subtitle="Comprehensive learning resources for every level of programmer"
        contentClassName="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8"
        gradient
      >
        {[
          {
            icon: <BookOpen className="h-10 w-10 text-primary" />,
            title: "Structured Learning Path",
            description:
              "Follow our carefully designed curriculum that takes you from Java basics to advanced DSA concepts.",
          },
          {
            icon: <Code className="h-10 w-10 text-primary" />,
            title: "Comprehensive DSA Sheet",
            description:
              "Practice with our curated collection of coding problems organized by topic and difficulty.",
          },
          {
            icon: <Award className="h-10 w-10 text-primary" />,
            title: "Interview Preparation",
            description:
              "Master the patterns and techniques that top companies look for in technical interviews.",
          },
        ].map((feature, index) => (
          <AnimatedElement key={index} animation="fadeIn" delay={`${(index + 1) * 100}` as any}>
            <Card hover className="h-full">
              <CardContent>
                <div className="mb-4">{feature.icon}</div>
                <CardTitle className="mb-2">{feature.title}</CardTitle>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          </AnimatedElement>
        ))}
      </Section>

      {/* Testimonials */}
      <Testimonials />

      {/* Stats Section */}
      <Section
        title="Growing Community"
        subtitle="Join thousands of developers learning with ShashCode"
        gradient
        contentClassName="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8"
      >
        {[
          {
            number: "1.4L+",
            label: "Monthly YouTube Views",
            icon: <YoutubeIcon className="h-12 w-12 text-red-500" />,
          },
          {
            number: "3M+",
            label: "Total Views Across YouTube",
            icon: <Award className="h-12 w-12 text-primary" />,
          },
          {
            number: "2K+",
            label: "Instagram Community",
            icon: <Code className="h-12 w-12 text-primary" />,
          },
        ].map((stat, index) => (
          <AnimatedElement key={index} animation="fadeIn" delay={`${(index + 1) * 100}` as any}>
            <Card hover className="h-full">
              <CardContent className="text-center py-8">
                <div className="mb-4 flex justify-center">{stat.icon}</div>
                <div className="text-4xl font-bold text-gradient mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </CardContent>
            </Card>
          </AnimatedElement>
        ))}
        <div className="col-span-1 md:col-span-3 mt-8 flex justify-center">
          <a
            href="https://www.youtube.com/channel/UCegtbaD_t6PYm3eaAf_bvGQ?sub_confirmation=1"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[rgb(205,32,31)] text-white font-semibold px-12 py-4 rounded-xl 
             hover:bg-[rgb(180,28,27)] transition duration-300 
             flex items-center justify-center gap-3 min-w-[140px]"
          >
            View ShashCode on Youtube
            <YoutubeIcon size={20} className="opacity-95 stroke-[2.2]" />
          </a>
        </div>
      </Section>

      <Footer />
    </div>
  );
};

export default Home;
