import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/context/AuthContext";
let cachedUsername: string | null = null;
export const useUserMeta = () => {
  const { user } = useAuth();
  const [username, setUsername] = useState<string | null>(cachedUsername);
  const [loading, setLoading] = useState(!cachedUsername);

  useEffect(() => {
    if (!user || cachedUsername) {
      setLoading(false);
      return;
    }

    const fetchUsername = async () => {
      const { data, error } = await supabase
        .from("user_meta")
        .select("meta_json")
        .eq("user_id", user.id)
        .single();

      if (!error) {
        cachedUsername = data?.meta_json?.username ?? null;
        setUsername(cachedUsername);
      }

      setLoading(false);
    };

    fetchUsername();
  }, [user]);

  return { username, loading };
};
