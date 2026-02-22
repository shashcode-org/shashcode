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
import "./App.css";
import Login from "@/pages/Login";
import { useAuth } from "@/context/AuthContext";
import UsernameOnboarding from "@/pages/UsernameOnboarding";
import OnboardingGuard from "@/components/OnboardingGuard";
const queryClient = new QueryClient();

const App = () => {
  const { loading } = useAuth();

  // 🔒 GLOBAL AUTH LOADING GATE
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm opacity-70">Loading...</p>
      </div>
    );
  }
  return (

    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
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
  )
};

export default App;
