import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Section from "@/components/Section";
import AnimatedElement from "@/components/AnimatedElement";
import Card, { CardContent, CardTitle } from "@/components/Card";
import { CheckCircle, Youtube, Users, BookOpen } from "lucide-react";
import { Helmet } from "react-helmet-async";
// Import images
import instructorImg from "../assets/shash-instructor-1.webp";
import samsungLogo from "../assets/samsung.webp";
import npciLogo from "../assets/npci.webp";
import cognizantLogo from "../assets/cognizant.webp";
import microsoftLearnLogo from "../assets/microsoftLearn.webp";
import hpLogo from "../assets/hpcl.webp";

const About = () => {
  const offerings = [
    {
      title: "Java + DSA Sheet",
      description: "A well-structured sheet covering essential problems for coding interviews.",
    },
    {
      title: "Last Minute DSA",
      description: "A quick revision guide to ace technical interviews.",
      comingSoon: true,
    },
    {
      title: "YouTube Tutorials",
      description: "Step-by-step explanations of DSA concepts and problems.",
    },
    {
      title: "Tech Insights",
      description: "Guidance on software engineering, placements, and career growth.",
    },
  ];

  const certifications = ["Software Complexity Professional", "Software Complexity Advanced"];

  const communityEngagement = [
    "ShashCode YouTube Channel",
    "1.4L+ monthly views",
    "Creator of the Java + DSA Sheet, helping thousands prepare for placements & coding interviews",
    "Producer of 100+ YouTube tutorials and tech career guides",
  ];

  const mentorshipPoints = [
    "Guides aspiring developers & professionals through workshops and personalized mentorship",
    "Industry experience in product-based companies shared to empower growth",
  ];

  const programmingLanguages = [
    "GoLang",
    "Java",
    "Python",
    "JavaScript",
    "React",
    "Node",
    "Android",
  ];

  const backendDevelopment = [
    "Microservices",
    "REST APIs",
    "AWS",
    "Web Socket",
    "Database Management",
    "Performance Optimization",
  ];

  const performanceTesting = ["Load testing", "stress testing, system benchmarks"];

  const dataAnalytics = ["Python, Pandas, SciKit-Learn, Tableau, Descriptive Analytics"];

  const trailContent = ["Last Minute DSA: coding interviews; and career growth"];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>About ShashCode</title>
        <meta
          name="description"
          content="Learn about ShashCode, our mission to make DSA simple and placement-focused."
        />
      </Helmet>

      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 hero-gradient">
        <div className="max-w-7xl mx-auto text-center"></div>
      </section>

      {/* About ShashCode Section */}
      <Section contentClassName="max-w-6xl mx-auto">
        <AnimatedElement animation="fadeIn">
          <Card className="p-8">
            <CardContent>
              <div className="flex flex-col md:flex-row items-start gap-8">
                <div className="w-full md:w-1/3 flex justify-center">
                  <img src="/logo.webp" alt="ShashCode Logo" className="w-48 h-48 object-contain" />
                </div>
                <div className="w-full md:w-2/3 space-y-4">
                  <h2 className="text-3xl font-bold text-primary mb-4">About ShashCode</h2>
                  <p className="text-gray-600 leading-relaxed">Welcome to ShashCode!</p>
                  <p className="text-gray-600 leading-relaxed">
                    ShashCode is a platform dedicated to making coding and technology education
                    accessible to everyone. It helps students and professionals master{" "}
                    <strong>Coding & Data Structures and Algorithms (DSA) in Java</strong> for
                    placements.
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    Founded by <strong className="text-primary">Shashwat Tiwari</strong>, a software
                    engineer and content creator, ShashCode simplifies complex topics through
                    structured learning paths, coding sheets, and video tutorials.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </AnimatedElement>
      </Section>

      {/* What We Offer */}
      <Section
        title="What We Offer"
        gradient
        contentClassName="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto"
      >
        {offerings.map((offer, index) => {
          const delays: Array<"100" | "200" | "300" | "400"> = ["100", "200", "300", "400"];
          return (
            <AnimatedElement key={index} animation="fadeIn" delay={delays[index]}>
              <Card hover className="h-full">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      {/* <h3 className="font-bold text-lg mb-2">{offer.title}</h3> */}
                      <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                        {offer.title}
                        {offer.comingSoon && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                            Coming Soon
                          </span>
                        )}
                      </h3>
                      <p className="text-gray-600">{offer.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AnimatedElement>
          );
        })}
      </Section>

      {/* Our Mission */}
      <Section contentClassName="max-w-4xl mx-auto">
        <AnimatedElement animation="fadeIn">
          <Card className="p-8 bg-primary/5">
            <CardContent className="text-center space-y-6">
              <h2 className="text-3xl font-bold text-primary">Our Mission</h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                At ShashCode, we believe in <strong>learning by doing</strong>. Our goal is to
                provide <strong>free, high-quality coding resources</strong> to help aspiring
                developers crack top tech company interviews and build strong problem-solving
                skills.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Be part of our growing community and accelerate your coding journey. Subscribe to
                ShashCode on YouTube and explore our <strong>Java + DSA Sheet today!</strong>
              </p>
              <a
                href="https://www.youtube.com/channel/UCegtbaD_t6PYm3eaAf_bvGQ?sub_confirmation=1"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary mt-4 inline-block"
              >
                Join Us!!
              </a>
            </CardContent>
          </Card>
        </AnimatedElement>
      </Section>

      {/* Meet the Instructor */}
      <Section title="Meet the Instructor" gradient contentClassName="max-w-6xl mx-auto">
        <AnimatedElement animation="fadeIn">
          <Card className="p-8">
            <CardContent>
              <div className="flex flex-col md:flex-row items-start gap-8">
                {/* Instructor Image and Title */}
                <div className="w-full md:w-1/3 flex flex-col items-center">
                  <div className="relative mb-4">
                    <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary to-secondary opacity-30 blur-xl"></div>
                    <img
                      src={instructorImg}
                      alt="Shashwat Tiwari"
                      className="rounded-full relative border-4 border-white shadow-xl w-48 h-48 object-cover"
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-primary text-center">Shashwat Tiwari</h3>
                  <p className="text-gray-600 font-semibold text-center">
                    Senior Engineer | Educator |
                  </p>
                  <p className="text-gray-600 font-semibold text-center">Content Creator</p>
                </div>

                {/* Instructor Description */}
                <div className="w-full md:w-2/3 space-y-4">
                  <p className="text-gray-600 leading-relaxed">
                    <strong>Shashwat Tiwari</strong> is a{" "}
                    <strong>Senior Engineer at Samsung Research</strong>, where he specializes in
                    backend systems, microservices, and performance optimization. He is also a
                    passionate educator with a rapidly growing tech channel,{" "}
                    <strong>ShashCode</strong>, where he simplifies{" "}
                    <strong>Data Structures & Algorithms (DSA)</strong>, coding interviews, and
                    software engineering placements.
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    He brings thought-provoking <strong>YouTube channel, ShashCode</strong>, where
                    he amplifies learning for thousands through structured{" "}
                    <strong>Java + DSA sheets</strong>, coding interviews, and career guidance. His
                    approach emphasizes clarity and real-world application, helping learners build
                    industry-relevant skills.
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    Shashwat's blend of industry experience and teaching expertise make him a
                    valuable mentor for aspiring engineers, data analysts, and software developers.
                    His commitment to empowering others through clear, step-by-step technical
                    content and strong knowledge has helped thousands tackle complex concepts and
                    advance in their coding journey.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </AnimatedElement>
      </Section>

      {/* Professional Experience */}
      <Section contentClassName="max-w-5xl mx-auto">
        <AnimatedElement animation="fadeIn">
          <Card className="p-8">
            <CardContent className="space-y-6">
              <h2 className="text-2xl font-bold text-primary text-center">
                Professional Experience
              </h2>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <img
                    src={samsungLogo}
                    alt="Samsung"
                    className="h-12 object-contain flex-shrink-0"
                  />
                  <div>
                    <h3 className="font-semibold">
                      Samsung Research and Development Institute India (SRI-B) – Senior Engineer
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Backend development, system design, and performance optimization.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <img src={npciLogo} alt="NPCI" className="h-10 object-contain flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold">
                      National Payments Corporation of India (NPCI) – Engineer
                    </h3>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <img
                    src={cognizantLogo}
                    alt="Cognizant"
                    className="h-10 object-contain flex-shrink-0"
                  />
                  <div>
                    <h3 className="font-semibold">
                      Cognizant Technology Solutions – Programmer Analyst
                    </h3>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <img src={hpLogo} alt="HPCL" className="h-10 object-contain flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold">
                      Hindustan Petroleum Corporation Limited (HPCL) – Data Analyst Intern
                    </h3>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <img
                    src={microsoftLearnLogo}
                    alt="Microsoft Learn"
                    className="h-10 object-contain flex-shrink-0"
                  />
                  <div>
                    <h3 className="font-semibold">Microsoft Learn Student Ambassador</h3>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </AnimatedElement>
      </Section>

      {/* Certifications */}
      <Section gradient contentClassName="max-w-4xl mx-auto">
        <AnimatedElement animation="fadeIn">
          <Card className="p-8">
            <CardContent>
              <h2 className="text-2xl font-bold text-primary mb-6 text-center">Certifications</h2>
              <ul className="space-y-3">
                {certifications.map((cert, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">{cert}</span>
                  </li>
                ))}
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">
                    Microsoft Technology Associate (JavaScript) -{" "}
                    <a
                      href="https://www.credly.com/badges/75f0920f-f3e8-4d89-a43f-dc10f47fc92b/linked_in_profile"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      View Credential
                    </a>
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </AnimatedElement>
      </Section>

      {/* Content Creation & Community Engagement */}
      <Section contentClassName="max-w-5xl mx-auto">
        <AnimatedElement animation="fadeIn">
          <Card className="p-8 bg-primary/5">
            <CardContent className="space-y-6">
              <h2 className="text-2xl font-bold text-primary text-center">
                Content Creation & Community Engagement
              </h2>

              <div className="space-y-4">
                {communityEngagement.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    {index === 0 ? (
                      <Youtube className="h-6 w-6 text-red-500 flex-shrink-0 mt-0.5" />
                    ) : (
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    )}
                    <p className="text-gray-600">{item}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </AnimatedElement>
      </Section>

      {/* Mentorship & Teaching */}
      <Section gradient contentClassName="max-w-4xl mx-auto">
        <AnimatedElement animation="fadeIn">
          <Card className="p-8">
            <CardContent>
              <h2 className="text-2xl font-bold text-primary mb-6 text-center">
                Mentorship & Teaching
              </h2>
              <ul className="space-y-3">
                {mentorshipPoints.map((point, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">{point}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </AnimatedElement>
      </Section>

      {/* Skills & Expertise */}
      <Section contentClassName="max-w-6xl mx-auto">
        <AnimatedElement animation="fadeIn">
          <Card className="p-8">
            <CardContent>
              <h2 className="text-2xl font-bold text-primary mb-8 text-center">
                Skills & Expertise
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Programming Languages */}
                <div>
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    Programming Languages
                  </h3>
                  <p className="text-gray-600">{programmingLanguages.join(", ")}</p>
                </div>

                {/* Backend Development */}
                <div>
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    Backend Development
                  </h3>
                  <p className="text-gray-600">{backendDevelopment.join(", ")}</p>
                </div>

                {/* Performance & Testing */}
                <div>
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    Performance & Testing
                  </h3>
                  <p className="text-gray-600">{performanceTesting.join(", ")}</p>
                </div>

                {/* Data Analysis & Visualization */}
                <div>
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    Data Analysis & Visualization
                  </h3>
                  <p className="text-gray-600">{dataAnalytics.join(", ")}</p>
                </div>

                {/* Trail Content */}
                <div className="md:col-span-2">
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    Trail Content
                  </h3>
                  <p className="text-gray-600">
                    Last Minute DSA: coding interviews, and career growth
                  </p>
                  <p className="text-gray-600 mt-2">
                    Shashwat's blend of industry experience and teaching expertise makes him a
                    valuable mentor for aspiring engineers, data analysts, and software developers.
                    His commitment to empowering others through clear, structured learning material,
                    tech insights, and strong knowledge has helped thousands in their careers and
                    shared knowledge has helped thousands tackle complex DSA concepts and
                    placements, and advance in their coding journey.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </AnimatedElement>
      </Section>

      <Footer />
    </div>
  );
};

export default About;
