import { useRef, useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const Testimonials = () => {
  const scrollRef = useRef(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const testimonials = [
    {
      quote: "Shashcode played a huge role in my journey to secure both a placement and an internship. The way complex DSA problems were explained in simple terms, especially in Java, made learning so much easier.",
      name: "Ayush Raj",
      role: "SDE @ Amazon"
    },
    {
      quote: "By regularly following your video I am feeling confident enough to atleast make a try of any problem given to me. It significantly boosted my logical thinking. Learned so many new concept.",
      name: "Shubham Agrawal",
      role: "Intern @ Microsoft"
    },
    {
      quote: "Really helped in maintaining consistency and made super easy for me to understand non linear and complex DSA problems and concepts.",
      name: "Anant Aggarwal",
      role: "Placed @ Cognizant"
    },
    {
      quote: "I got my Microsoft SWE internship, and doing quite good in CP, I code in C++ but I really like the explanation so i watch your daily challenge videos....keep doing the good work 😉👍.",
      name: "Anshdeep Bansal",
      role: "Engineer @ NPCI"
    },
    {
      quote: "Shashcode helped me in staying consistent thought my placement season right from June 2024 With that , I got an on campus placement opportunity, which I can only disclose after my joining in January.",
      name: "Yash Matlani",
      role: "Mentee @ ShashCode"
    }
  ];

  const checkScroll = () => {
    const container = scrollRef.current;
    if (!container) return;
    setAtStart(container.scrollLeft === 0);
    setAtEnd(container.scrollLeft + container.clientWidth >= container.scrollWidth - 5);
  };

  const scrollLeft = () => {
    const container = scrollRef.current;
    if (container) {
      container.scrollBy({
        left: -container.clientWidth,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    const container = scrollRef.current;
    if (container) {
      container.scrollBy({
        left: container.clientWidth,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    const container = scrollRef.current;
    checkScroll();
    if (container) {
      container.addEventListener('scroll', checkScroll);
      return () => container.removeEventListener('scroll', checkScroll);
    }
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4">
      <section className="py-14 px-4 rounded-2xl">
        <h2 className="text-3xl font-bold text-center text-signature_yellow mb-10">
          What Learners Say
        </h2>

        <div className="flex items-center lg:w-[80%] mx-auto">
          {/* Left Arrow */}
          <button
            onClick={scrollLeft}
            disabled={atStart}
            className={`p-2 rounded-full transition ${atStart
                ? 'bg-gray-600 opacity-30 cursor-not-allowed'
                : 'bg-gray-700 hover:bg-gray-600 text-white'
              }`}
          >
            <ArrowLeft size={20} />
          </button>

          {/* Scrollable Container */}
          <div
            ref={scrollRef}
            className="overflow-x-auto flex snap-x snap-mandatory scroll-smooth scrollbar-hide space-x-6 mx-6"
          >
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="snap-center shrink-0 w-full p-6 rounded-2xl shadow-md bg-slate-800/40 border border-white/10"
              >
                <p className="italic text-gray-300">"{testimonial.quote}"</p>
                <p className="mt-4 font-semibold text-yellow-400">– {testimonial.name}</p>
              </div>
            ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={scrollRight}
            disabled={atEnd}
            className={`p-2 rounded-full transition ${atEnd
                ? 'bg-gray-600 opacity-30 cursor-not-allowed'
                : 'bg-gray-700 hover:bg-gray-600 text-white'
              }`}
          >
            <ArrowRight size={20} />
          </button>
        </div>
      </section>
    </div>
  );
};

export default Testimonials;

 // py-16 px-4 text-center bg-slate-800 rounded-2xl mx-4 sm:mx-8 lg:mx-32 shadow-lg