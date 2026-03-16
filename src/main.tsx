import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import * as Sentry from "@sentry/react";
import App from "./App";
import "./index.css";

Sentry.init({
  dsn: "https://5dc1a3b13315dc9a0bb39f5a122d5170@o4511055127052288.ingest.us.sentry.io/4511055137800192",
  release: "shashcode@1.0.0",
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],

  tracesSampleRate: 0.2, // performance monitoring
  replaysSessionSampleRate: 0.1, // session replay
  replaysOnErrorSampleRate: 1.0, // replay when error happens
});

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
    <App />
  </HelmetProvider>
);
