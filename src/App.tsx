import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import DSA from "./pages/DSA";
import JavaDSA from "./pages/JavaDSA";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import ContactUs from "./pages/Contact";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import ScrollToTop from "./components/ScrollToTop";
import "./App.css";
import PreLaunchGame from "./pages/PreLaunchGame";
const queryClient = new QueryClient();
const PRELAUNCH_MODE = false;

const App = () => {
  const hasAccess =
    localStorage.getItem("shashcode_access") === "true";

  const showGame = PRELAUNCH_MODE && !hasAccess;
  return (
  
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={showGame  ? <PreLaunchGame /> :<Home />} />
          <Route path="/dsa" element={showGame ? <PreLaunchGame /> :<DSA />} />
          <Route path="/java-dsa" element={showGame ? <PreLaunchGame /> :<JavaDSA />} />
          <Route path="/privacy" element={showGame ? <PreLaunchGame /> :<Privacy />} />
          <Route path="/terms" element={showGame ? <PreLaunchGame /> :<Terms />} />
          <Route path="/contact-us" element={showGame ? <PreLaunchGame /> :<ContactUs />} />
          <Route path="/about" element={showGame ? <PreLaunchGame /> :<About />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
)};

export default App;
