import { useRef, useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const Testimonials = () => {
  const scrollRef = useRef(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const testimonials = [
    {
      quote: "Shashcode played a huge role in my journey to secure both a placement and an internship. The way complex DSA problems were explained in simple terms, especially in Java, made learning so much easier. The daily LeetCode challenges helped me stay consistent and sharpen my problem-solving skills. What I loved most was how practical and clear the content was—it gave me the confidence to tackle coding rounds and interviews. Honestly, it wasn’t just about learning; it felt like having a mentor guide me through every step. Shashcode made a big difference for me, and I’m really grateful for it! ",
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
      quote: "I got my Microsoft SWE internship, and doing quite good in CP, I code in C++ but I really like the explanation so i watch your daily challenge videos....keep doing the good work 😉👍",
      name: "Anshdeep Bansal",
      role: "Engineer @ NPCI"
    },
    {
      quote: "Shashcode helped me in staying consistent thought my placement season right from June 2024 With that , I got an on campus placement opportunity, which I can only disclose after my joining in January. As per college placement policy. I also want to mention that I regularly follow shashwat sir and comment on yt on every question that I solve without any hint",
      name: "Yash Matlani",
      role: "Mentee @ ShashCode"
    }
  ];

  const checkScroll = () => {
    const container = scrollRef.current;
    if (!container) return;

    setAtStart(container.scrollLeft === 0);
    setAtEnd(
      container.scrollLeft + container.clientWidth >= container.scrollWidth - 5
    );
  };

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
  };

  useEffect(() => {
    const container = scrollRef.current;
    checkScroll(); // initial check

    if (container) {
      container.addEventListener('scroll', checkScroll);
      return () => container.removeEventListener('scroll', checkScroll);
    }
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4">
    <section className="bg-gray-900 py-14 px-4 relative rounded-2xl">
    {/* <section className="bg-gray-900 py-14 px-4 relative"> */}
      <h2 className="text-3xl font-bold text-center text-signature_yellow mb-10">What Learners Say</h2>

      {/* Scroll Arrows */}
      <button
        onClick={scrollLeft}
        disabled={atStart}
        className={`absolute left-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full z-10 transition ${
          atStart
            ? 'bg-gray-600 opacity-30 cursor-not-allowed'
            : 'bg-gray-700 hover:bg-gray-600 text-white'
        }`}
      >
        <ArrowLeft size={20} />
      </button>

      <button
        onClick={scrollRight}
        disabled={atEnd}
        className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full z-10 transition ${
          atEnd
            ? 'bg-gray-600 opacity-30 cursor-not-allowed'
            : 'bg-gray-700 hover:bg-gray-600 text-white'
        }`}
      >
        <ArrowRight size={20} />
      </button>

      <div
        ref={scrollRef}
        className="overflow-x-auto flex gap-6 px-6 snap-x snap-mandatory scroll-smooth scrollbar-hide"
      >
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="snap-center shrink-0 w-[90%] sm:w-[80%] md:w-[50%] lg:w-[40%] bg-gray-800 p-6 rounded-2xl shadow-md mx-auto"
          >
            <p className="italic text-gray-300">"{testimonial.quote}"</p>
            <p className="mt-4 font-semibold text-yellow-400">
              – {testimonial.name}
              {/* – {testimonial.name}, {testimonial.role} */}
            </p>
          </div>
        ))}
      </div>
    </section>
    </div>
  );
};

export default Testimonials;
