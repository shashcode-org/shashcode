import React from 'react';
import { Link } from 'react-router-dom'; // ✅ Import Link

const Footer = () => {
  return (
    <footer className="bg-black text-white py-8 mt-16">
      <div className="w-[90%] md:w-3/4 mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-center md:text-left">
          <h2 className="text-xl font-bold text-signature_yellow">ShashCode</h2>
          <p className="text-sm text-gray-400">Your go-to platform for mastering coding, DSA, and career growth.</p>
          <p className="text-sm text-gray-400">Learn, practice, and excel in tech with expert guidance.</p>
        </div>

        <div className="flex gap-6 text-gray-300 text-sm">
          {/* Internal navigation using React Router */}
          <Link to="/dsa" className="hover:text-signature_yellow">Java DSA Sheet</Link>
        </div>
      </div>

      {/* Contact & Social Links */}
      <div className="w-[90%] md:w-3/4 mx-auto mt-8 text-sm text-center text-gray-300 space-y-2">
        <p>
          Email: <a href="mailto:collaboratewithshashwat@gmail.com" className="hover:text-signature_yellow">collaboratewithshashwat@gmail.com</a>
        </p>
        <div className="flex justify-center flex-wrap gap-4">
          <a href="https://www.instagram.com/shashwat_tiwari_st/" target="_blank" rel="noopener noreferrer" className="hover:text-signature_yellow">Instagram</a>
          <a href="https://www.linkedin.com/in/shashwattiwari1999/" target="_blank" rel="noopener noreferrer" className="hover:text-signature_yellow">LinkedIn</a>
          <a href="https://www.youtube.com/@shashwat_tiwari_st" target="_blank" rel="noopener noreferrer" className="hover:text-signature_yellow">YouTube</a>
          <a href="https://x.com/shashCode/" target="_blank" rel="noopener noreferrer" className="hover:text-signature_yellow">Twitter</a>
        </div>
      </div>

      {/* Copyright + Legal Links */}
      <div className="text-center text-gray-500 text-xs mt-6">
        &copy; {new Date().getFullYear()} ShashCode. All rights reserved.
        <div className="mt-2">
          {/* Internal legal links */}
          <Link to="/terms" className="hover:text-signature_yellow mx-2">Terms & Conditions</Link>|
          <Link to="/privacy" className="hover:text-signature_yellow mx-2">Privacy Policy</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
