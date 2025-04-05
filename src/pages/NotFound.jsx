import React from 'react';
import { Link } from 'react-router-dom';
import { MoveLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-[60vh] flex flex-col justify-center items-center text-center text-white">
      <h1 className="text-6xl font-bold text-signature_yellow mb-4">404</h1>
      <p className="text-xl text-black mb-6">Oops! The page you're looking for doesn't exist.</p>
      <Link to="/" className="flex items-center gap-2 bg-signature_yellow text-black px-4 py-2 rounded-full hover:scale-105 transition duration-200">
        <MoveLeft size={18} />
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;
