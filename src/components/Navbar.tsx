
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import AnimatedElement from './AnimatedElement';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Close mobile menu when navigating
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);
  
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'DSA', path: '/dsa' },
    { name: 'Terms & Conditions', path: '/terms' },
    { name: 'Privacy Policy', path: '/privacy' },
  ];
  
  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-white/95 backdrop-blur-sm shadow-md py-3' 
        : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <AnimatedElement animation="fadeIn" className="opacity-100">
            <Link to="/" className="flex items-center space-x-3">
              <img 
                src="/logo.webp" 
                alt="ShashCode Logo" 
                className="h-8 md:h-14 w-auto"
              />
            </Link>
          </AnimatedElement>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {navLinks.map((link, index) => (
              <AnimatedElement 
                key={link.name}
                animation="fadeIn" 
                delay={`${(index + 1) * 100}` as any} 
                className="opacity-100"
              >
                <Link 
                  to={link.path}
                  className={`navbar-link ${
                    location.pathname === link.path ? 'text-primary after:scale-x-100' : ''
                  }`}
                >
                  {link.name}
                </Link>
              </AnimatedElement>
            ))}
          </div>
          
          {/* Mobile Navigation Toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-primary focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation Menu */}
        {isOpen && (
          <div className="md:hidden bg-white p-4 mt-3 rounded-lg shadow-lg border border-gray-100 animate-fadeIn">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link 
                  key={link.name}
                  to={link.path}
                  className={`block py-2 px-3 rounded-md transition-colors ${
                    location.pathname === link.path 
                      ? 'bg-primary/10 text-primary font-medium' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
