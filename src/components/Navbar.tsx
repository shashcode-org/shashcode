import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Sun, Moon } from "lucide-react";
import AnimatedElement from "./AnimatedElement";
import { trackEvent } from "@/utils/analytics";
import { useAuth } from "@/context/AuthContext";
import { useUserMeta } from "@/hooks/useUserMeta";
import { useNavigate } from "react-router-dom";

function getSheetFromPath(pathname: string) {
  if (pathname.startsWith("/java-dsa")) return "JAVA_DSA";
  if (pathname.startsWith("/dsa")) return "DSA";
  return "DSA";
}

const Navbar = () => {
  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains("dark")
  );
  const [showBell, setShowBell] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const { user, logout } = useAuth();
  const { username } = useUserMeta();
  const navigate = useNavigate();
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        accountRef.current &&
        !accountRef.current.contains(event.target as Node)
      ) {
        setAccountOpen(false);
      }
    };

    if (accountOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [accountOpen]);



  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when navigating
  useEffect(() => {
    setIsOpen(false);
    setAccountOpen(false); // 👈 ADD THIS
  }, [location.pathname]);

  useEffect(() => {
    const checkBell = () => {
      try {
        const hasQuestionProgress =
          Object.keys(JSON.parse(localStorage.getItem("questionProgress_guest_DSA") || "{}")).length > 0;

        const hasSubtopicProgress =
          Object.keys(JSON.parse(localStorage.getItem("subtopicProgress_guest_DSA") || "{}")).length > 0;

        if (!user && (hasQuestionProgress || hasSubtopicProgress)) {
          setShowBell(true);
        }
      } catch (e) {
        console.log("bell check failed");
      }
    };

    checkBell();

    window.addEventListener("progressUpdated", checkBell);

    return () => window.removeEventListener("progressUpdated", checkBell);


  }, [user]);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "DSA", path: "/dsa" },
    { name: "Java + DSA", path: "/java-dsa" },
    { name: "About", path: "/about" },
  ];

  const toggleTheme = () => {
    const root = document.documentElement;
    const nextIsDark = !root.classList.contains("dark");

    root.classList.toggle("dark");
    localStorage.setItem("theme", nextIsDark ? "dark" : "light");
    setIsDark(nextIsDark);
    // 🔹 GA4: track explicit dark mode usage (once per user)
    if (
      nextIsDark &&
      !localStorage.getItem("g4_dark_mode_used")
    ) {
      trackEvent("dark_mode_enabled", {
        source: "user_toggle",
      });
      localStorage.setItem("g4_dark_mode_used", "true");
    }
  };

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? "bg-background/80 backdrop-blur-sm shadow-md py-3" : "bg-transparent py-5"
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <AnimatedElement animation="fadeIn" className="opacity-100">
              <Link
                to="/"
                className="flex items-center space-x-3"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                <img
                  src={
                    isDark
                      ? "/bl-logo.webp"
                      : "/logo.webp"
                  }
                  alt="ShashCode Logo"
                  className="h-8 md:h-14 w-auto"
                />

              </Link>
            </AnimatedElement>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link, index) => (
                <AnimatedElement
                  key={link.name}
                  animation="fadeIn"
                  delay={`${(index + 1) * 100}` as any}
                  className="opacity-100 flex items-center"
                >
                  <Link
                    to={link.path}
                    className={`navbar-link ${location.pathname === link.path ? "text-primary after:scale-x-100" : ""
                      }`}
                  >
                    {link.name}
                  </Link>
                </AnimatedElement>
              ))}
              <button
                onClick={toggleTheme}
                className="
    flex items-center justify-center
    h-10 w-10
    rounded-full
    hover:bg-accent/20
    transition
  "
                aria-label="Toggle theme"
              >
                {isDark ? (
                  <Sun size={20} className="text-yellow-400" />
                ) : (
                  <Moon size={20} className="text-slate-700" />
                )}
              </button>
              {!user && showBell && (
                <div
                  className="relative cursor-pointer"
                  onClick={() => setShowPopup(true)}
                  title="You have 1 unclaimed reward"
                >
                  🔔
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1 rounded-full">
                    1
                  </span>
                </div>
              )}
              {user && (
                <div className="flex items-center gap-4">
                  <div className="relative" ref={accountRef}>
                    <button
                      onClick={() => setAccountOpen((v) => !v)}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-accent/20 transition"
                    >
                      <span className="text-sm font-medium">
                        {username && `@${username}`}
                      </span>
                      <span
                        className={`text-xs transition-transform ${accountOpen ? "rotate-180" : ""
                          }`}
                      >
                        ▾
                      </span>
                    </button>

                    {accountOpen && (
                      <div
                        className="
        absolute right-0 mt-2 w-36
        bg-card border border-border
        rounded-xl shadow-lg
        overflow-hidden
        z-50
      "
                      >
                        <button
                          onClick={async () => {
                            const sheet = getSheetFromPath(location.pathname);
                            await logout(sheet);
                            // await logout();
                            navigate("/login", { replace: true });
                          }}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-accent/20"
                        >
                          Logout
                        </button>
                      </div>
                    )}
                  </div>


                </div>
              )}

              {!user && (
                <Link
                  to="/login"
                  className={`navbar-link ${location.pathname === "/login"
                    ? "text-primary after:scale-x-100"
                    : ""
                    }`}
                >
                  Login
                </Link>
              )}




            </div>

            {/* Mobile Navigation Toggle */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-foreground hover:text-primary focus:outline-none"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isOpen && (
            <div className="md:hidden bg-card p-4 mt-3 rounded-lg shadow-lg border border-border animate-fadeIn">
              <div className="flex flex-col space-y-4">
                {user && (
                  <>
                    <div className="px-3 py-2 text-sm font-medium border-b border-border">
                      {username && `@${username}`}
                    </div>
                  </>
                )}

                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`block py-2 px-3 rounded-md transition-colors ${location.pathname === link.path
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-foreground hover:bg-accent/20"
                      }`}
                  >
                    {link.name}
                  </Link>
                ))}
                <button
                  onClick={toggleTheme}
                  className="
    w-full
    flex items-center gap-3
    py-2 px-3
    rounded-md
    transition-colors
    text-left
    hover:bg-accent/20
    text-foreground
  "
                >
                  {isDark ? (
                    <>
                      <Sun size={18} className="text-yellow-400" />
                      <span>Light Mode</span>
                    </>
                  ) : (
                    <>
                      <Moon size={18} className="text-slate-700" />
                      <span>Dark Mode</span>
                    </>
                  )}
                </button>
                {user && (
                  <button
                    onClick={async () => {
                      const sheet = getSheetFromPath(location.pathname);
                      await logout(sheet);
                      // await logout();
                      navigate("/login", { replace: true });
                    }}
                    className="py-2 px-3 text-left text-red-500 hover:bg-accent/20 rounded-md"
                  >
                    Logout
                  </button>
                )}
                {!user && (
                  <Link
                    to="/login"
                    className={`block py-2 px-3 rounded-md transition-colors ${location.pathname === "/login"
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-foreground hover:bg-accent/20"
                      }`}
                  >
                    Login
                  </Link>
                )}

              </div>
            </div>
          )}
        </div>
      </nav>
      {!user && showPopup && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-xl p-6 w-[90%] max-w-sm shadow-xl text-center">

            <div className="text-3xl mb-2">🏆</div>

            <h3 className="text-lg font-semibold mb-2">
              You’ve unlocked something!
            </h3>

            <p className="text-sm text-muted-foreground mb-4">
              You’re making great progress 😏 <br />
              Login to claim your level & badges.
            </p>

            <button
              onClick={() => navigate("/login")}
              className="w-full py-2 rounded-md bg-primary text-white font-semibold hover:opacity-90 transition"
            >
              Claim My Progress 🚀
            </button>

            <button
              onClick={() => setShowPopup(false)}
              className="mt-3 text-xs text-muted-foreground hover:underline"
            >
              Maybe later
            </button>

          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
