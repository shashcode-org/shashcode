import { useEffect, useState, useCallback, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";

export const useBadges = (user) => {
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  const isFetchingRef = useRef(false); // 🔥 add this above (inside hook)

  const loadBadges = useCallback(async () => {
    // 🔥 prevent duplicate calls
    if (!user || isFetchingRef.current) {
      if (!user) {
        setBadges([]);
        setLoading(false);
      }
      return;
    }

    isFetchingRef.current = true;

    try {
      setLoading(true);

      const sessionRes = await supabase.auth.getSession();
      const token = sessionRes?.data?.session?.access_token;

      // 🔥 Retry until session is ready (KEEPING YOUR LOGIC)
      if (!token) {
        console.warn("⛔ No session yet, retrying badge fetch...");
        isFetchingRef.current = false; // ⚠️ IMPORTANT (else lock ho jayega)
        setTimeout(loadBadges, 500);
        return;
      }

      console.log("TOKEN:", token);

      const res = await fetch("/.netlify/functions/getBadges", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("STATUS:", res.status);

      const json = await res.json();
      console.log("BADGES API RESPONSE:", json);

      if (!res.ok) {
        console.error("❌ Badge API failed:", json);
        setBadges([]);
        return;
      }

      setBadges(Array.isArray(json) ? json : []);
    } catch (err) {
      console.error("❌ Failed to load badges:", err);
      setBadges([]);
    } finally {
      setLoading(false);
      isFetchingRef.current = false; // 🔥 MOST IMPORTANT LINE
    }
  }, [user]);

  // 🔹 Initial load
  useEffect(() => {
    loadBadges();
  }, [loadBadges]);

  // 🔹 Optional: real-time refresh trigger
  useEffect(() => {
    const handler = () => {
      console.log("🔄 badgesUpdated event received");

      if (!isFetchingRef.current) {
        loadBadges();
      }
    };

    window.addEventListener("badgesUpdated", handler);
    return () => window.removeEventListener("badgesUpdated", handler);
  }, [loadBadges]);

  return { badges, loading };
};