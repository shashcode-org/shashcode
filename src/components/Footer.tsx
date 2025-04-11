
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import AnimatedElement from './AnimatedElement';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const footerLinks = [
    {
      title: 'Resources',
      links: [
        { name: 'Java DSA Sheet', path: '/dsa' },
        // { name: 'Practice Problems', path: '/dsa' },
        // { name: 'Interview Prep', path: '/dsa' },
      ]
    },
    {
      title: 'Legal',
      links: [
        { name: 'Terms & Conditions', path: '/terms' },
        { name: 'Privacy Policy', path: '/privacy' },
      ]
    },
    {
      title: 'Connect',
      links: [
        { name: 'Youtube', path: 'https://www.youtube.com/@shashwat_tiwari_st' },
        { name: 'Twitter', path: 'https://x.com/shashCode/' },
        { name: 'LinkedIn', path: 'https://www.linkedin.com/in/shashwattiwari1999/' },
        { name: 'Instagram', path: 'https://www.instagram.com/shashwat_tiwari_st/' },
      ]
    }
  ];
  
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div className="col-span-1">
            <AnimatedElement animation="fadeIn">
              <Link to="/" className="inline-block">
                <div className="flex items-center space-x-3">
                  <img 
                    src="/bl-logo.webp" 
                    alt="ShashCode Logo" 
                    className="h-16 w-auto" 
                  />
                </div>
              </Link>
              <p className="mt-4 text-gray-400 text-sm">
                Empowering developers to master data structures and algorithms through structured learning paths.
              </p>
            </AnimatedElement>
          </div>
          
          {/* Links columns */}
          {footerLinks.map((column, idx) => (
            <div key={column.title} className="col-span-1">
              <AnimatedElement animation="fadeIn" delay={`${(idx + 1) * 100}` as any}>
                <h3 className="text-lg font-semibold mb-4">{column.title}</h3>
                <ul className="space-y-3">
                  {column.links.map(link => (
                    <li key={link.name}>
                      <Link 
                        to={link.path}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </AnimatedElement>
            </div>
          ))}
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8">
          <AnimatedElement animation="fadeIn">
            <p className="text-center text-gray-400 text-sm flex items-center justify-center">
              © {currentYear} ShashCode. Built with <Heart size={16} className="mx-1 text-red-500 animate-pulse" /> by you.
            </p>
          </AnimatedElement>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
