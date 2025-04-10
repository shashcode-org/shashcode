
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Section from '@/components/Section';
import AnimatedElement from '@/components/AnimatedElement';
import Card, { CardContent, CardTitle } from '@/components/Card';
import { ArrowRight, BookOpen, Code, Award, Users, Youtube } from 'lucide-react';

const Index = () => {
  // Placeholder testimonials data
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Frontend Developer",
      content: "This DSA course transformed my approach to technical interviews. The structured curriculum and practice sheets helped me secure my dream job at a top tech company."
    },
    {
      name: "Michael Chen",
      role: "Software Engineer",
      content: "The best DSA resource I've found online. The explanations are crystal clear and the practice problems are perfectly categorized by difficulty."
    },
    {
      name: "Priya Patel",
      role: "CS Student",
      content: "As a student, this platform has been invaluable for my learning. The comprehensive DSA sheet helped me understand complex algorithms with ease."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 hero-gradient">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col-reverse lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <AnimatedElement animation="fadeIn">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                  Master <span className="text-gradient">Data Structures</span> &
                  <span className="text-gradient"> Algorithms</span> with ShashCode
                </h1>
              </AnimatedElement>
              
              <AnimatedElement animation="fadeIn" delay="100">
                <p className="text-lg text-gray-700 mb-8">
                  Learn the most important computer science concepts through interactive lessons,
                  structured practice, and comprehensive sheets designed for interview success.
                </p>
              </AnimatedElement>
              
              <AnimatedElement animation="fadeIn" delay="200">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/dsa" className="btn-primary flex items-center justify-center gap-2">
                    Get Started <ArrowRight size={18} />
                  </Link>
                  <a 
                    href="https://www.youtube.com/@shashwat_tiwari_st" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn-outline flex items-center justify-center gap-2"
                  >
                    <Youtube size={18} className="text-red-500" />
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
                      <pre className="p-4 text-white font-mono text-sm overflow-x-auto">
                        <code>{`function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  
  return -1;
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
      
      {/* Features Section */}
      <Section 
        title="Why Choose ShashCode?"
        subtitle="Comprehensive learning resources for every level of programmer"
        contentClassName="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8"
      >
        {[
          {
            icon: <BookOpen className="h-10 w-10 text-primary" />,
            title: "Structured Learning Path",
            description: "Follow our carefully designed curriculum that takes you from basics to advanced DSA concepts."
          },
          {
            icon: <Code className="h-10 w-10 text-primary" />,
            title: "Comprehensive DSA Sheet",
            description: "Practice with our curated collection of 450+ coding problems organized by topic and difficulty."
          },
          {
            icon: <Award className="h-10 w-10 text-primary" />,
            title: "Interview Preparation",
            description: "Master the patterns and techniques that top companies look for in technical interviews."
          }
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
      
      {/* YouTube Subscribe Button */}
      <Section 
        className="bg-gradient-to-r from-primary to-secondary text-white"
        contentClassName="text-center"
      >
        <AnimatedElement animation="fadeIn">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Join Our YouTube Community</h2>
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
            Subscribe to ShashCode on YouTube for free tutorials, coding tips, and interview preparation.
          </p>
          <a 
            href="https://www.youtube.com/@shashwat_tiwari_st" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center gap-2 bg-white text-primary px-8 py-4 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
          >
            <Youtube size={24} className="text-red-500" />
            Subscribe Now
          </a>
        </AnimatedElement>
      </Section>
      
      {/* Testimonials */}
      <Section 
        id="testimonials"
        title="Success Stories"
        subtitle="Hear from programmers who transformed their skills with ShashCode"
        gradient
        contentClassName="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8"
      >
        {testimonials.map((testimonial, index) => (
          <AnimatedElement key={index} animation="fadeIn" delay={`${(index + 1) * 100}` as any}>
            <Card glass className="h-full">
              <CardContent>
                <div className="mb-4">
                  <h4 className="font-semibold text-lg">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
                <p className="text-gray-700 italic">"{testimonial.content}"</p>
              </CardContent>
            </Card>
          </AnimatedElement>
        ))}
      </Section>
      
      {/* About Section */}
      <Section 
        id="about"
        contentClassName="flex flex-col md:flex-row gap-12 items-center"
      >
        <div className="md:w-1/2">
          <AnimatedElement animation="fadeIn">
            <div className="relative">
              <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-accent to-secondary opacity-20 blur-xl"></div>
              <img 
                src="https://images.unsplash.com/photo-1515378960530-7c0da6231fb1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                alt="About ShashCode" 
                className="rounded-xl relative shadow-lg object-cover h-[400px] w-full"
              />
            </div>
          </AnimatedElement>
        </div>
        
        <div className="md:w-1/2">
          <AnimatedElement animation="fadeIn" delay="100">
            <h2 className="text-3xl font-bold mb-6">About ShashCode</h2>
            <p className="text-gray-700 mb-4">
              We created ShashCode with a simple mission: to make learning Data Structures and Algorithms accessible, 
              structured, and effective for programmers at all levels.
            </p>
            <p className="text-gray-700 mb-4">
              Our comprehensive DSA sheets are carefully curated to cover every important concept and problem pattern you'll 
              encounter in coding interviews and real-world applications.
            </p>
            <p className="text-gray-700 mb-6">
              Whether you're a student, a job seeker, or a professional looking to strengthen your fundamentals, our 
              resources are designed to help you master these crucial skills.
            </p>
            <div className="flex items-center space-x-4">
              <span className="text-xl font-semibold">10k+</span>
              <span className="text-gray-600">Active Users</span>
              <span className="text-xl font-semibold">450+</span>
              <span className="text-gray-600">Problems</span>
              <span className="text-xl font-semibold">25+</span>
              <span className="text-gray-600">Topics</span>
            </div>
          </AnimatedElement>
        </div>
      </Section>
      
      {/* Instructor Section */}
      <Section 
        title="Meet the Instructor"
        subtitle="Learn from experienced developers and educators"
        gradient
        contentClassName="flex flex-col md:flex-row gap-12 items-center"
      >
        <div className="md:w-1/3">
          <AnimatedElement animation="fadeIn">
            <div className="relative">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary to-secondary opacity-30 blur-xl"></div>
              <img 
                src="https://randomuser.me/api/portraits/men/42.jpg" 
                alt="Instructor" 
                className="rounded-full relative border-4 border-white shadow-xl w-64 h-64 object-cover mx-auto"
              />
            </div>
          </AnimatedElement>
        </div>
        
        <div className="md:w-2/3">
          <AnimatedElement animation="fadeIn" delay="100">
            <h3 className="text-2xl font-bold mb-2">Shashwat Tiwari</h3>
            <p className="text-primary font-medium mb-4">Founder, ShashCode & Software Engineer</p>
            <p className="text-gray-700 mb-4">
              With a rich background in software engineering and a passion for teaching, 
              Shashwat has helped thousands of students master DSA concepts and secure positions at top tech companies.
            </p>
            <p className="text-gray-700 mb-6">
              His structured approach to teaching complex algorithms has made difficult concepts accessible to learners
              at all skill levels.
            </p>
            
            <h4 className="text-lg font-semibold mb-3">Professional Experience:</h4>
            <div className="flex flex-wrap gap-4 mb-6">
              <img src="/path/to/samsung-logo.png" alt="Samsung" className="h-10 object-contain" />
              <img src="/path/to/cognizant-logo.png" alt="Cognizant" className="h-10 object-contain" />
              <img src="/path/to/npci-logo.png" alt="NPCI" className="h-10 object-contain" />
              <img src="/path/to/hpcl-logo.png" alt="HPCL" className="h-10 object-contain" />
              <img src="/path/to/microsoft-learn-logo.png" alt="Microsoft Learn" className="h-10 object-contain" />
            </div>
            
            <div className="flex space-x-4">
              <a href="https://www.youtube.com/@shashwat_tiwari_st" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
                <Youtube size={24} className="text-red-500" /> YouTube
              </a>
              <a href="#" className="text-primary hover:text-primary/80 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
            </div>
          </AnimatedElement>
        </div>
      </Section>
      
      <Footer />
    </div>
  );
};

export default Index;
