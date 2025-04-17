
import React, { useRef, useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import AnimatedElement from './AnimatedElement';
import Card, { CardContent } from './Card';

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
      quote: "Really helped in maintaining consistency and made super easy for me to understand non linear and complex DSA concepts and problems.",
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
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <AnimatedElement animation="fadeIn">
          <h2 className="text-3xl font-bold text-center text-gradient mb-10">
            What Learners Say
          </h2>
        </AnimatedElement>

        <div className="flex items-center max-w-4xl mx-auto">
          {/* Left Arrow */}
          <button
            onClick={scrollLeft}
            disabled={atStart}
            className={`p-2 rounded-full transition shrink-0 ${
              atStart
                ? 'bg-muted opacity-30 cursor-not-allowed'
                : 'bg-background hover:bg-accent text-foreground'
            }`}
            aria-label="Previous testimonial"
          >
            <ArrowLeft size={20} />
          </button>

          {/* Scrollable Container */}
          <div
            ref={scrollRef}
            className="overflow-x-auto flex snap-x snap-mandatory scroll-smooth scrollbar-none space-x-6 mx-6 gap-4 p-4 items-center"
          >
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="snap-center shrink-0 w-full"
              >
                <AnimatedElement animation="fadeIn" delay="100">
                  <Card glass className="h-full">
                    <CardContent className="p-6">
                      <p className="italic text-gray-600 mb-6">"{testimonial.quote}"</p>
                      <div className="mt-4">
                        <p className="font-semibold text-primary">{testimonial.name}</p>
                        <p className="text-sm text-gray-500">{testimonial.role}</p>
                      </div>
                    </CardContent>
                  </Card>
                </AnimatedElement>
              </div>
            ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={scrollRight}
            disabled={atEnd}
            className={`p-2 rounded-full transition shrink-0 ${
              atEnd
                ? 'bg-muted opacity-30 cursor-not-allowed'
                : 'bg-background hover:bg-accent text-foreground'
            }`}
            aria-label="Next testimonial"
          >
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
