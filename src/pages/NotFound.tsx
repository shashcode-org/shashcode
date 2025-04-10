
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimatedElement from "@/components/AnimatedElement";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center bg-gradient-to-b from-transparent to-primary/5 py-20">
        <div className="text-center px-4 sm:px-6 lg:px-8 max-w-md mx-auto">
          <AnimatedElement animation="fadeIn">
            <h1 className="text-6xl font-bold mb-4 text-gradient">404</h1>
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
              <p className="text-xl text-gray-600 mb-8">
                Oops! The page you're looking for doesn't exist.
              </p>
              <Link
                to="/"
                className="btn-primary inline-flex items-center"
              >
                Return to Home
              </Link>
            </div>
          </AnimatedElement>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NotFound;
