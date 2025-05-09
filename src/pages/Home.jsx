import React from 'react';
import instructorImg from '../assets/shash-instructor.png';
import samsungLogo from '../assets/samsung.png';
import npciLogo from '../assets/npci.png';
import cognizantLogo from '../assets/cognizant.png';
import microsoftLearnLogo from '../assets/microsoftLearn.png';
import hpLogo from '../assets/hp.png';
import Testimonials from '../components/Testimonials';
import { useNavigate } from 'react-router-dom';

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
    <div className="mt-10">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center py-16 bg-gray-900 px-4 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-signature_yellow mb-4">
          Welcome to ShashCode
        </h1>
        <p className="text-lg sm:text-xl text-gray-300 max-w-2xl">
          Crack the code, rule the road!
        </p>
      </section>

      {/* Explore DSA Sheet */}
      <section className="py-16 px-4 text-center bg-slate-800 rounded-2xl mx-4 sm:mx-8 lg:mx-32 shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-signature_yellow">Explore our Java DSA Sheet</h2>
        <p className="text-gray-300 max-w-xl mx-auto mb-8">
          Structured roadmap to crack top tech companies — from Arrays to Dynamic Programming.
        </p>
        <button
          onClick={() => navigate('/dsa')}
          className="bg-signature_yellow text-black font-semibold px-6 py-3 rounded-2xl hover:bg-yellow-400 transition duration-300"
        >
          View Sheet
        </button>
      </section>

      {/* Testimonials */}
      <Testimonials />

      {/* About Section */}
      <section className="bg-slate-800 text-gray-300 py-16 px-6 rounded-2xl mx-4 sm:mx-8 lg:mx-32 shadow-lg">
        <h2 className="text-3xl font-bold text-center text-signature_yellow mb-10">About ShashCode</h2>
        <div className="max-w-4xl mx-auto space-y-6 text-[17px] leading-relaxed">
          <p className="text-center text-lg">
            Welcome to <span className="font-semibold text-yellow-400">ShashCode</span>!
          </p>
          <p>
            ShashCode is a platform dedicated to making coding and technology education accessible to everyone. It helps students and professionals master Coding & Data Structures and Algorithms (DSA) in Java for placements.
          </p>
          <p>
            Founded by <span className="font-semibold text-yellow-400">Shashwat Tiwari</span>, a software engineer and content creator, ShashCode simplifies complex topics through structured learning paths, coding sheets, and video tutorials.
          </p>
          <h3 className="text-xl font-semibold text-signature_yellow pt-4">What We Offer</h3>
          <ul className="list-disc list-inside space-y-1 pl-4">
            <li><span className="font-medium text-white">Java + DSA Sheet</span> – A well-structured sheet covering essential problems for coding interviews.</li>
            <li><span className="font-medium text-white">Last Minute DSA</span> – A quick revision guide to ace technical interviews.</li>
            <li><span className="font-medium text-white">YouTube Tutorials</span> – Step-by-step explanations of DSA concepts and problems.</li>
            <li><span className="font-medium text-white">Tech Insights</span> – Guidance on software engineering, placements, and career growth.</li>
          </ul>
          <h3 className="text-xl font-semibold text-signature_yellow pt-6">Our Mission</h3>
          <p>
            At ShashCode, we believe in learning by doing. Our goal is to provide free, high-quality coding resources to help aspiring developers crack top tech company interviews and build strong problem-solving skills.
          </p>
          <h3 className="text-xl font-semibold text-signature_yellow pt-6">Join Us!</h3>
          <p>
            Be part of our growing community and accelerate your coding journey. Subscribe to ShashCode on YouTube and explore our Java + DSA Sheet today!
          </p>
        </div>
      </section>

      {/* Instructor Section */}
      <section className="bg-gray-900 py-16 px-6">
        <h2 className="text-3xl font-bold text-center text-signature_yellow mb-10">Meet the Instructor</h2>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row-reverse items-center gap-10">
          
          {/* Instructor Image */}
          <div className="flex flex-col items-center w-full sm:w-[30%]">
            <img
              src={instructorImg}
              alt="Shashwat Tiwari"
              className="rounded-full w-40 sm:w-full object-cover shadow-xl aspect-square"
            />
            <h3 className="text-xl font-bold text-signature_yellow mt-4 text-center">Shashwat Tiwari</h3>
            <p className="text-gray-400 text-sm text-center">Engineer | Educator | Creator</p>
          </div>

          {/* Instructor Info */}
          <div className="text-gray-300 text-[17px] leading-relaxed space-y-5 sm:w-[70%] text-center md:text-left">
            <p>
              Shashwat is a <strong>Senior Engineer at Samsung R&D</strong>, where he specializes in backend systems, microservices, and performance optimization. He’s also a passionate educator with a thriving tech channel <strong>ShashCode</strong> that reaches 1.4L+ learners monthly.
            </p>
            <p>
              He has previously worked at <strong>NPCI, Cognizant</strong>, and interned at <strong>HPCL</strong>. He’s been a <strong>Microsoft Learn Student Ambassador</strong> and has earned several certifications in software development and analytics.
            </p>
            <p>
              As the creator of the <strong>Java + DSA Sheet</strong>, Shashwat helps students master coding interviews with well-structured prep material, system design insights, and career mentorship.
            </p>
            <p>
              <strong className="uppercase text-sm">Skills:</strong>{' '}
              {skillsData.map((skill, index) => (
                <span
                  key={index}
                  className="inline-block text-xs bg-slate-700 py-1 px-2 mx-1 my-1 rounded-md whitespace-nowrap"
                >
                  {skill}
                </span>
              ))}
            </p>

            {/* Logos */}
            <div className="mt-4">
              <h4 className="text-lg font-semibold text-signature_yellow">Professional Experience</h4>
              <div className="flex gap-6 flex-wrap items-center mt-2 justify-center md:justify-start">
                <img src={samsungLogo} alt="Samsung" className="h-16 sm:h-20 object-contain" />
                <img src={npciLogo} alt="NPCI" className="h-10 object-contain" />
                <img src={cognizantLogo} alt="Cognizant" className="h-10 object-contain" />
                <img src={hpLogo} alt="HPCL" className="h-10 object-contain" />
                <img src={microsoftLearnLogo} alt="Microsoft Learn" className="h-10 object-contain" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
