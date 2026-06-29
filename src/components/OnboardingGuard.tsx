import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

const OnboardingGuard = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      setChecking(false);
      return;
    }

    const check = async () => {
      const { data, error } = await supabase
        .from("user_meta")
        .select("user_id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        // console.error("Onboarding check failed:", error);
        setChecking(false);
        return;
      }

      if (!data) {
        navigate("/onboarding/username", { replace: true });
      }
      if (data) {
        localStorage.setItem("onboarding_done", "true");
      }
      setChecking(false);
    };

    check();
  }, [user, loading, navigate]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm opacity-70">Preparing your account…</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default OnboardingGuard;
