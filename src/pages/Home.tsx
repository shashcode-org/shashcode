
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Testimonials from '@/components/Testimonials';
import Section from '@/components/Section';
import AnimatedElement from '@/components/AnimatedElement';
import Card, { CardContent, CardTitle } from '@/components/Card';
import { ArrowRight, Code, Award, BookOpen, YoutubeIcon } from 'lucide-react';

// Import images
import instructorImg from '../assets/shash-instructor-1.webp';
import samsungLogo from '../assets/samsung.webp';
import npciLogo from '../assets/npci.webp';
import cognizantLogo from '../assets/cognizant.webp';
import microsoftLearnLogo from '../assets/microsoftLearn.webp';
import hpLogo from '../assets/hpcl.webp';

const Home = () => {
  const navigate = useNavigate();

  const skillsData = [
    "GoLang",
    "Java",
    "Python", 
    "JavaScript",
    "AWS",
    "REST APIs",
    "WebSockets",
    "Microservices",
    "CI / CD",
    "System Design",
    "Performance Testing"
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 hero-gradient">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <AnimatedElement animation="fadeIn">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                  Welcome to <span className="text-gradient">ShashCode</span>
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
                    onClick={() => navigate('/dsa')}
                    className="btn-primary flex items-center justify-center gap-2"
                  >
                    Explore DSA Sheet <ArrowRight size={18} />
                  </button>
                  <a 
                    href="https://www.youtube.com/@shashwat_tiwari_st" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn-outline flex items-center justify-center gap-2"
                  >
                    <YoutubeIcon size={20} className="px-[2px] text-slate-200 bg-red-700 rounded-[4px]" />
                    Subscribe
                  </a>
                </div>
              </AnimatedElement>
            </div>
            
            <div className="lg:w-1/2">
              <AnimatedElement animation="fadeIn" delay="200">
                <div className="relative">
                  <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-primary to-secondary opacity-30 blur-xl"></div>
                  <div className="card-glass p-8 relative">
                    <div className="bg-gray-800 rounded-lg overflow-hidden">
                      <pre className="p-4 text-white font-mono text-xs sm:text-sm overflow-x-auto">
                        <code>{`public class ShashCode {
  public boolean isSuccess(boolean hardWork, boolean luck) {
    if (hardWork || luck) {
      System.out.println("You succeeded 🎯");
    } else {
      System.out.println("You still succeeded 💪");
    }

    return true; // Because success is a mindset.
  }
}
`}</code>
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
        contentClassName="text-center"
      >
        <AnimatedElement animation="fadeIn">
          <Card className="p-8 bg-primary/5">
            <CardContent>
              <CardTitle className="text-3xl font-bold mb-6 text-gradient">Explore our Java DSA Sheet</CardTitle>
              <p className="text-gray-600 max-w-xl mx-auto mb-8">
                Structured roadmap to crack top tech companies — from Arrays to Dynamic Programming.
              </p>
              <button
                onClick={() => navigate('/dsa')}
                className="bg-primary text-white font-semibold px-8 py-3 rounded-xl hover:bg-primary/90 transition duration-300"
              >
                View Sheet
              </button>
            </CardContent>
          </Card>
        </AnimatedElement>
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
            description: "Follow our carefully designed curriculum that takes you from Java basics to advanced DSA concepts."
          },
          {
            icon: <Code className="h-10 w-10 text-primary" />,
            title: "Comprehensive DSA Sheet",
            description: "Practice with our curated collection of coding problems organized by topic and difficulty."
          },
          {
            icon: <Award className="h-10 w-10 text-primary" />,
            title: "Interview Preparation",
            description: "Master the patterns and techniques that top companies look for in technical interviews."
          }
        ].map((feature, index) => (
          <AnimatedElement key={index} animation="fadeIn" delay={`${(index + 1) * 100}`as any}>
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
      
      {/* About Section */}
      <Section 
        id="about"
        title="About ShashCode"
        contentClassName="max-w-4xl mx-auto space-y-6 text-[17px] leading-relaxed"
      >
        <AnimatedElement animation="fadeIn">
          <Card glass className="p-8">
            <CardContent className="space-y-6">
              <p>
              <span className="font-semibold text-primary">ShashCode</span> is a platform dedicated to making coding and technology education accessible to everyone. It helps students and professionals master Coding & Data Structures and Algorithms (DSA) in Java for placements.
              </p>
              <p>
                Founded by <span className="font-semibold text-primary">Shashwat Tiwari</span>, a software engineer and content creator, ShashCode simplifies complex topics through structured learning paths, coding sheets, and video tutorials.
              </p>
              <h3 className="text-xl font-semibold text-primary pt-4">What We Offer</h3>
              <ul className="list-disc list-inside space-y-1 pl-4">
                <li><span className="font-medium">Java + DSA Sheet</span> – A well-structured sheet covering essential problems for coding interviews.</li>
                <li><span className="font-medium">Last Minute DSA</span> – A quick revision guide to ace technical interviews.</li>
                <li><span className="font-medium">YouTube Tutorials</span> – Step-by-step explanations of DSA concepts and problems.</li>
                <li><span className="font-medium">Tech Insights</span> – Guidance on software engineering, placements, and career growth.</li>
              </ul>
              <h3 className="text-xl font-semibold text-primary pt-6">Our Mission</h3>
              <p>
                At ShashCode, we believe in learning by doing. Our goal is to provide free, high-quality coding resources to help aspiring developers crack top tech company interviews and build strong problem-solving skills.
              </p>
              <h3 className="text-xl font-semibold text-primary pt-6">Join Us!</h3>
              <p>
                Be part of our growing community and accelerate your coding journey. Subscribe to ShashCode on YouTube and explore our Java + DSA Sheet today!
              </p>
            </CardContent>
          </Card>
        </AnimatedElement>
      </Section>
      
      {/* Instructor Section */}
      <Section 
        title="Meet the Instructor"
        subtitle="Learn from experienced developers and educators"
        gradient
        contentClassName="max-w-6xl mx-auto"
      >
        <AnimatedElement animation="fadeIn">
          <Card className="p-8">
            <CardContent>
              <div className="flex flex-col md:flex-row-reverse items-center gap-10">
                {/* Instructor Image */}
                <div className="flex flex-col items-center w-full md:w-[30%]">
                  <div className="relative">
                    <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary to-secondary opacity-30 blur-xl"></div>
                    <img
                      src={instructorImg}
                      alt="Shashwat Tiwari"
                      className="rounded-full relative border-4 border-white shadow-xl w-32 md:w-48 max-w-[200px] object-cover aspect-square"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-primary mt-4 text-center">Shashwat Tiwari</h3>
                  <p className="text-gray-500 text-sm text-center">Engineer | Educator | Creator</p>
                </div>

                {/* Instructor Info */}
                <div className="text-gray-600 text-[17px] leading-relaxed space-y-5 md:w-[70%] text-center md:text-left">
                  <p>
                    Shashwat is a <strong>Senior Engineer at Samsung R&D</strong>, where he specializes in backend systems, microservices, and performance optimization. He's also a passionate educator with a thriving tech channel <strong>ShashCode</strong> that reaches 1.4L+ learners monthly.
                  </p>
                  <p>
                    He has previously worked at <strong>NPCI, Cognizant</strong>, and interned at <strong>HPCL</strong>. He's been a <strong>Microsoft Learn Student Ambassador</strong> and has earned several certifications in software development and analytics.
                  </p>
                  <p>
                    As the creator of the <strong>Java + DSA Sheet</strong>, Shashwat helps students master coding interviews with well-structured prep material, system design insights, and career mentorship.
                  </p>
                  <p>
                    <strong className="uppercase text-sm">Skills:</strong>{' '}
                    <div className="flex flex-wrap gap-2 mt-2">
                      {skillsData.map((skill, index) => (
                        <span
                          key={index}
                          className="inline-block text-xs bg-accent py-1 px-2 rounded-md whitespace-nowrap"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </p>

                  {/* Logos */}
                  <div className="mt-4">
                    <h4 className="text-lg font-semibold text-primary">Professional Experience</h4>
                    <div className="flex gap-4 flex-wrap items-center mt-2 justify-center md:justify-start">
                      <img src={samsungLogo} alt="Samsung" className="h-8 sm:h-10 object-contain" />
                      <img src={npciLogo} alt="NPCI" className="h-6 sm:h-8 object-contain" />
                      <img src={cognizantLogo} alt="Cognizant" className="h-6 sm:h-8 object-contain" />
                      <img src={hpLogo} alt="HPCL" className="h-6 sm:h-8 object-contain" />
                      <img src={microsoftLearnLogo} alt="Microsoft Learn" className="h-6 sm:h-8 object-contain" />
                    </div>
                  </div>
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

export default Home;
