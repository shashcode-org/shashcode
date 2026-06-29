import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import DSA from "./pages/DSA";
import JavaDSA from "./pages/JavaDSA";
// import LastMinuteDSA from "./pages/LastMinuteDSA";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import ContactUs from "./pages/Contact";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import ScrollToTop from "./components/ScrollToTop";
import * as Sentry from "@sentry/react";
import "./App.css";
import Login from "@/pages/Login";
import { useAuth } from "@/context/AuthContext";
import UsernameOnboarding from "@/pages/UsernameOnboarding";
import OnboardingGuard from "@/components/OnboardingGuard";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient"; // 👈 ensure this import
const queryClient = new QueryClient();



const App = () => {
  const { loading, user } = useAuth();
  const [showMigrationPopup, setShowMigrationPopup] = useState(false);
  const [showLoginNudge, setShowLoginNudge] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem("login_nudge_seen");

    if (!user && !seen) {
      setShowLoginNudge(true);
      localStorage.setItem("login_nudge_seen", "true");
    }
  }, [user]);



  useEffect(() => {
    // if (!user) return;

    const legacyQ = localStorage.getItem("questionProgress");
    const legacyS = localStorage.getItem("subtopicProgress");

    const alreadyMigrated = localStorage.getItem("migration_done");
    const onboardingDone = localStorage.getItem("onboarding_done");
    if (
      user &&
      onboardingDone &&
      (legacyQ || legacyS) &&
      !alreadyMigrated
    ) {
      setShowMigrationPopup(true);
    }
  }, [user]);

  const handleMigration = async (type) => {
    const legacyQ = localStorage.getItem("questionProgress");
    const legacyS = localStorage.getItem("subtopicProgress");

    if (!legacyQ && !legacyS) return;

    const q = JSON.parse(legacyQ ?? "{}");
    const s = JSON.parse(legacyS ?? "{}");

    if (type === "DSA") {
      localStorage.setItem("questionProgress_guest_DSA", legacyQ ?? "{}");
      localStorage.setItem("subtopicProgress_guest_DSA", legacyS ?? "{}");
    }

    if (type === "JAVA_DSA") {
      localStorage.setItem("questionProgress_guest_JAVA_DSA", legacyQ ?? "{}");
      localStorage.setItem("subtopicProgress_guest_JAVA_DSA", legacyS ?? "{}");
    }

    localStorage.setItem("migration_done", "true");

    // 🔥 DELETE OLD LEGACY KEYS
    localStorage.removeItem("questionProgress");
    localStorage.removeItem("subtopicProgress");

    // 🔥🔥🔥 STEP 2: SYNC TO DB (IMPORTANT)
    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;

      const res = await fetch("/.netlify/functions/syncProgress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          sheet: type, // DSA or JAVA_DSA
          questions: q,
          subtopics: s,
          completedPercent: null, // backend handles
          bucketCompletion: null,
          completedMainTopics: [],
        }),
      });
      // console.log("SYNC STATUS", res.status);

      const body = await res.text();

      // console.log("SYNC BODY", body);
      if (!res.ok) {
        throw new Error(await res.text());
      }

      // console.log("Migration sync done");
    } catch (err) {
      // console.error("Migration sync failed", err);
    }

    setShowMigrationPopup(false);
    window.dispatchEvent(new Event("migrationCompleted"));

    if (type === "DSA") {
      window.location.href = "/dsa";
    }

    if (type === "JAVA_DSA") {
      window.location.href = "/java-dsa";
    }
  };
  // 🔒 GLOBAL AUTH LOADING GATE
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm opacity-70">Loading...</p>
      </div>
    );
  }
  return (
    <>
      {
        showLoginNudge && !user && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-card p-6 rounded-xl max-w-sm w-full text-center">

              <h3 className="text-lg font-semibold mb-2">
                Track your progress 🚀
              </h3>

              <p className="text-sm mb-4 text-muted-foreground">
                Login to save progress, unlock levels & badges.
              </p>

              <button
                onClick={() => window.location.href = "/login"}
                className="w-full py-2 bg-primary text-white rounded-md"
              >
                Login with Google
              </button>

              <button
                onClick={() => setShowLoginNudge(false)}
                className="mt-3 text-xs text-muted-foreground"
              >
                Maybe later
              </button>

            </div>
          </div>
        )
      }
      <Sentry.ErrorBoundary
        fallback={
          <div style={{ padding: 40, textAlign: "center" }}>
            <h2>Something went wrong</h2>
            <p>Please refresh the page.</p>
          </div>
        }
      >
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              {showMigrationPopup && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                  <div className="bg-card p-6 rounded-xl w-[90%] max-w-md text-center border border-border shadow-xl">

                    <div className="text-3xl mb-2">🚀</div>

                    <h2 className="text-lg font-semibold mb-2">
                      We found your progress 👀
                    </h2>

                    <p className="text-sm text-muted-foreground mb-5">
                      We found your progress 👀
                      Let’s restore it in the right place 🚀
                    </p>

                    <div className="flex flex-col gap-3">
                      <button
                        onClick={() => handleMigration("DSA")}
                        className="py-2 rounded-md border border-border hover:bg-accent/20"
                      >
                        Continue my journey with DSA
                      </button>

                      <button
                        onClick={() => handleMigration("JAVA_DSA")}
                        className="py-2 rounded-md border border-border hover:bg-accent/20"
                      >
                        Continue my journey with Java DSA
                      </button>


                    </div>
                  </div>
                </div>
              )}
              <ScrollToTop />
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/onboarding/username" element={<UsernameOnboarding />} />
                {/* PROTECTED + ONBOARDED AREA */}
                <Route
                  path="/*"
                  element={
                    <OnboardingGuard>
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/dsa" element={<DSA />} />
                        <Route path="/java-dsa" element={<JavaDSA />} />
                        {/* <Route path="/last-minute-dsa" element={<LastMinuteDSA />} /> */}
                        <Route path="/privacy" element={<Privacy />} />
                        <Route path="/terms" element={<Terms />} />
                        <Route path="/contact-us" element={<ContactUs />} />
                        <Route path="/about" element={<About />} />

                        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </OnboardingGuard>
                  }
                />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </QueryClientProvider>
      </Sentry.ErrorBoundary>
    </>
  )
};

export default App;
