import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App";
import "./index.css";
import { AuthProvider } from "@/context/AuthContext";
// ---- THEME INITIALIZATION ----
const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
  document.documentElement.classList.add("dark");
} else if (savedTheme === "light") {
  document.documentElement.classList.remove("dark");
} else {
  const prefersDark = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;

  if (prefersDark) {
    document.documentElement.classList.add("dark");
  }
}

// ---- SYSTEM THEME CHANGE LISTENER (OPTIONAL, PREMIUM) ----
window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", (e) => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) return; // user choice > system

    document.documentElement.classList.toggle("dark", e.matches);
  });

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
     <AuthProvider>
    <App />
    </AuthProvider>
  </HelmetProvider>
);
