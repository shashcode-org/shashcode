import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { Session, User } from "@supabase/supabase-js";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  logout: (sheet?: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 🔁 Restore session on page refresh
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    // 🔔 Listen to auth state changes (login/logout)
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const logout = async (sheet?: string) => {

    if (user && sheet) {

      const userKeys = {
        q: `questionProgress_${user.id}_${sheet}`,
        s: `subtopicProgress_${user.id}_${sheet}`
      };

      const guestKeys = {
        q: `questionProgress_guest_${sheet}`,
        s: `subtopicProgress_guest_${sheet}`
      };

      const q = localStorage.getItem(userKeys.q);
      const s = localStorage.getItem(userKeys.s);

      if (q) localStorage.setItem(guestKeys.q, q);
      if (s) localStorage.setItem(guestKeys.s, s);

      // console.log("🔁 Copied user progress → guest before logout");
    }

    await supabase.auth.signOut({ scope: "local" })

    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
};
