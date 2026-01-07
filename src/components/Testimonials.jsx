import React, { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import AnimatedElement from "./AnimatedElement";
import Card, { CardContent } from "./Card";
import { createPortal } from "react-dom";

const SHOULD_CLAMP_LENGTH = 300;

// Helper: Truncate text to character limit
const truncateText = (text, limit) => {
  if (text.length <= limit) return text;
  return text.substring(0, limit).trim() + "...";
};

// Modal Component for Full Testimonial
const TestimonialModal = ({ testimonial, isOpen, onClose }) => {
  if (!isOpen || !testimonial) return null;

//   useEffect(() => {
//   document.body.style.overflow = "hidden";
//   return () => {
//     document.body.style.overflow = "";
//   };
// }, []);


  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-md z-[1000]"
        onClick={onClose}
      />

      {/* Modal container */}
      <div className="fixed inset-0 z-[1001] flex items-center justify-center px-4">
        <div
          className="
          w-full max-w-md
          bg-white dark:bg-slate-900
          rounded-xl shadow-xl
          max-h-[75vh] sm:max-h-[80vh] flex flex-col
        "
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div
            className="
     sticky top-0 z-10
    bg-white dark:bg-slate-900
    flex items-center justify-between
    px-4 py-3
    border-b border-gray-200 dark:border-slate-700
    rounded-t-xl
  "
          >   <span className="font-semibold text-gray-900 dark:text-white">
              Testimonial
            </span>
            <button
              onClick={onClose}
              className="
    p-1 rounded
    text-gray-500
    hover:text-primary
    hover:bg-primary/10
    transition
  "
            >
              <X size={18} />
            </button>

          </div>

          {/* Content */}
          <div className="px-4 py-4 overflow-y-auto flex-1">
            <p className="italic text-gray-700 dark:text-gray-300 mb-6 leading-relaxed text-sm sm:text-base">
              "{testimonial.quote}"
            </p>

            <p className="font-semibold text-primary">
              {testimonial.name}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {testimonial.role}
            </p>
          </div>
        </div>
      </div>
    </>,
    document.getElementById("modal-root")
  );
};


const Testimonials = () => {
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchEndX, setTouchEndX] = useState(null);
  const [index, setIndex] = useState(0);
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);

  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  setTouchEndX(null);
  };

  const handleTouchMove = (e) => {
    setTouchEndX(e.touches[0].clientX);
  };

const handleTouchEnd = () => {
  if (touchStartX === null) return;

  const endX = touchEndX ?? touchStartX;
  const diff = touchStartX - endX;

    // swipe threshold
    if (diff > 50) {
      next(); // swipe left → next
    } else if (diff < -50) {
      prev(); // swipe right → prev
    }

    setTouchStartX(null);
    setTouchEndX(null);
  };


  const testimonials = [
    {
      quote:
        "Hey Shashwat, thanks for the videos man. Learnt a lot, got multiple offers. You may not know me but i have been on your channel since you have been teaching on white board with yellow wall, then started watching your channel again when i decided to do dsa in java around 1.6 years ago. Moved from devops role at Sprinklr, to Java backend engineer at Target, and now working at Microsoft.",
      name: "Aditya Mazumdar",
      role: "SDE @ Microsoft",
    },
    {
      quote:
        "I am writing to express my deepest gratitude for the incredible content you share on your YouTube channel shashCode. I have been following your Java DSA playlists closely, and I must say that your structural approach and clear explanations made even the most complex topics easy to grasp. The topic-wise problem sets were particularly relevant and played a major role in my preparation.I am thrilled to share that, thanks to the solid foundation I built through your videos, I have secured an SDE Internship at Amazon, starting January 12th.I saw your request for testimonials on YouTube and would be honored to share my experience. Your content is a great service to the student community, and I hope my story can inspire others who are learning from your channel.I have attached a screenshot of my offer mail.Thank you once again for your guidance and for being such a helpful mentor to all of us.",
      name: "Amit Ranjan Das",
      role: "SDE Intern @ Amazon",
    },
    {
      quote:
        "Shashcode played a huge role in my journey to secure both a placement and an internship. The way complex DSA problems were explained in simple terms, especially in Java, made learning so much easier.",
      name: "Ayush Raj",
      role: "SDE @ Amazon",
    },
    {
      quote:
        "By regularly following your video I am feeling confident enough to atleast make a try of any problem given to me. It significantly boosted my logical thinking. Learned so many new concept.",
      name: "Shubham Agrawal",
      role: "Intern @ Microsoft",
    },

    {
      quote:
        "Really helped in maintaining consistency and made super easy for me to understand non linear and complex DSA concepts and problems.",
      name: "Anant Aggarwal",
      role: "Placed @ Cognizant",
    },
    {
      quote:
        "I got my Microsoft SWE internship, and doing quite good in CP, I code in C++ but I really like the explanation so i watch your daily challenge videos....keep doing the good work 😉👍.",
      name: "Anshdeep Bansal",
      role: "Engineer @ NPCI",
    },
    {
      quote:
        "Shashcode helped me in staying consistent thought my placement season right from June 2024 With that , I got an on campus placement opportunity, which I can only disclose after my joining in January.",
      name: "Yash Matlani",
      role: "Mentee @ ShashCode",
    },
  ];

  const total = testimonials.length;

  const prev = () => {
    setIndex(i => Math.max(i - 1, 0));
  };

  const next = () => {
    setIndex(i => Math.min(i + 1, total - 1));
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <AnimatedElement animation="fadeIn">
          <h2 className="text-3xl font-bold text-center text-gradient mb-10">
            What Learners Say
          </h2>
        </AnimatedElement>

        <div className="flex items-center max-w-4xl mx-auto mt-6">
          {/* Left Arrow */}
          <button
            onClick={prev}
            disabled={index === 0}
            className={`p-2 rounded-full shrink-0 ${index === 0
              ? "opacity-30 cursor-not-allowed"
              : "hover:bg-accent"
              }`}
          >
            <ArrowLeft size={20} />
          </button>

          {/* Slider */}
          <div className="overflow-hidden w-full mx-6"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}>
            <div
              className="flex transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]"
              style={{ transform: `translateX(-${index * 100}%)` }}
            >
              {testimonials.map((t, i) => (
                <div key={i} className="w-full shrink-0 flex justify-center">
                  <AnimatedElement animation="fadeIn">
                    <Card
                      glass
                      className="w-full max-w-4xl h-[260px] sm:h-[240px] overflow-hidden"
                    >
                      <CardContent className="p-6 h-full flex flex-col justify-between">
                        <div>
                          <p className="italic text-gray-600 mb-3">
                            "{truncateText(t.quote, SHOULD_CLAMP_LENGTH)}"
                          </p>

                          {t.quote.length > SHOULD_CLAMP_LENGTH && (
                            <button
                              onClick={() => setSelectedTestimonial(t)}
                              className="text-sm text-primary font-medium hover:underline"
                            >
                              See more
                            </button>
                          )}
                        </div>

                        <div>
                          <p className="font-semibold text-primary">
                            {t.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {t.role}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </AnimatedElement>
                </div>
              ))}
            </div>
          </div>

          {/* Right Arrow */}
          <button
            onClick={next}
            disabled={index === total - 1}
            className={`p-2 rounded-full shrink-0 ${index === total - 1
              ? "opacity-30 cursor-not-allowed"
              : "hover:bg-accent"
              }`}
          >
            <ArrowRight size={20} />
          </button>
        </div>

        {/* Modal */}
        <TestimonialModal
          testimonial={selectedTestimonial}
          isOpen={!!selectedTestimonial}
          onClose={() => setSelectedTestimonial(null)}
        />
      </div>
    </section>
  );
};

export default Testimonials;