import React from 'react';
import instructorImg from '../assets/instructor.jpg';
import samsungLogo from '../assets/samsung.png';
import npciLogo from '../assets/npci.png';
import cognizantLogo from '../assets/cognizant.png';
import microsoftLearnLogo from '../assets/microsoftLearn.png';
import hpLogo from '../assets/hp.png';
import Testimonials from '../components/Testimonials';


const Home = () => {
  return (
    <div className='mt-10'>
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center py-16 bg-gray-900">
        <h1 className="text-4xl sm:text-5xl font-bold text-signature_yellow mb-4">Welcome to ShashCode</h1>
        <p className="text-lg sm:text-xl text-gray-300 text-center max-w-2xl">
        Crack the code, rule the road!
        </p>
      </section>

      {/* Explore DSA Sheet - Call to Action */}
      <section className="py-16 px-4 text-center bg-black">
        <h2 className="text-3xl font-bold mb-6 text-signature_yellow">Explore our Java DSA Sheet</h2>
        <p className="text-gray-300 max-w-xl mx-auto mb-8">
          Structured roadmap to crack top tech companies — from Arrays to Dynamic Programming.
        </p>
        <button className="bg-signature_yellow text-black font-semibold px-6 py-3 rounded-2xl hover:bg-yellow-400 transition duration-300">
          View Sheet
        </button>
      </section>

{/* Testimonials Section */}

<Testimonials />

<section className="bg-black text-gray-300 py-16 px-6">
  <h2 className="text-3xl font-bold text-center text-signature_yellow mb-10">About ShashCode</h2>

  <div className="max-w-4xl mx-auto space-y-6 text-[17px] leading-relaxed">
    <p className="text-center text-lg">Welcome to <span className="font-semibold text-yellow-400">ShashCode</span>!</p>

    <p>
      ShashCode is a platform dedicated to making coding and technology education accessible to everyone.
      It helps students and professionals master Coding & Data Structures and Algorithms (DSA) in Java for placements.
    </p>

    <p>
      Founded by <span className="font-semibold text-yellow-400">Shashwat Tiwari</span>, a software engineer and content creator,
      ShashCode simplifies complex topics through structured learning paths, coding sheets, and video tutorials.
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



{/* Know Your Instructor */}
<section className="bg-gray-900 py-16 px-6">
  <h2 className="text-3xl font-bold text-center text-signature_yellow mb-10">Meet the Instructor</h2>

  <div className="max-w-6xl mx-auto flex flex-col md:flex-row-reverse items-center gap-10">
    {/* Right Side - Image + Name */}

<div className="flex flex-col items-center">
  <img
    src={instructorImg}
    alt="Instructor"
    className="rounded-2xl w-80 h-80 object-cover shadow-xl" // Increased size
  />
  <h3 className="text-xl font-bold text-signature_yellow mt-4 text-center">
    Shashwat Tiwari
  </h3>
  <p className="text-gray-400 text-sm text-center">Engineer | Educator | Creator</p>
</div>


    {/* Left Side - Bio */}
    <div className="text-gray-300 text-[16px] leading-relaxed space-y-5">
      <p>
        Shashwat is a <strong>Senior Engineer at Samsung R&D</strong>, where he specializes in backend systems, microservices, and performance optimization.
        He’s also a passionate educator with a thriving tech channel <strong>ShashCode</strong> that reaches 1.4L+ learners monthly.
      </p>
      <p>
        He has previously worked at <strong>NPCI, Cognizant</strong>, and interned at <strong>HPCL</strong>. He’s been a <strong>Microsoft Learn Student Ambassador</strong> and has earned several certifications in software development and analytics.
      </p>
      <p>
        As the creator of the <strong>Java + DSA Sheet</strong>, Shashwat helps students master coding interviews with well-structured prep material, system design insights, and career mentorship.
      </p>
      <p>
        <strong>Skills:</strong> GoLang, Java, Python, JavaScript, AWS, REST APIs, WebSockets, Microservices, CI/CD, System Design, Performance Testing.
      </p>

      {/* Logos */}
      <div>
        <h4 className="text-lg font-semibold text-signature_yellow mt-2">Companies I've Worked With:</h4>
        <div className="flex gap-6 flex-wrap items-center mt-3">
          <img src={samsungLogo} alt="Samsung" className="h-20" />
          <img src={npciLogo} alt="Npci" className="h-10" />
          <img src={cognizantLogo} alt="Cognizant" className="h-10" />
          <img src={hpLogo} alt="Hp" className="h-10" />
          <img src={microsoftLearnLogo} alt="MicrosoftLearn" className="h-10" />
        </div>
      </div>
    </div>
  </div>
</section>



    </div>
  );
};

export default Home;
