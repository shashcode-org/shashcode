import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export const useBadges = (user) => {
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBadges = async () => {
      if (!user) {
        setBadges([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const { data } = await supabase.auth.getSession();
        const token = data.session?.access_token;

        const res = await fetch("/.netlify/functions/getBadges", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const json = await res.json();
        setBadges(Array.isArray(json) ? json : []);
      } catch (err) {
        console.error("Failed to load badges:", err);
        setBadges([]);
      } finally {
        setLoading(false);
      }
    };

    loadBadges();
  }, [user]);

  return { badges, loading };
};