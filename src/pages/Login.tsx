import { supabase } from "@/lib/supabaseClient";
import { Link } from "react-router-dom";

const Login = () => {
  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="w-full max-w-md bg-card p-6 rounded-xl shadow-lg border border-border text-center">
        <h1 className="text-2xl font-bold mb-6 text-foreground">
          Welcome to ShashCode
        </h1>
        <p className="text-sm text-muted-foreground mb-6"> Sign in to sync your learning progress, badges, and achievements across devices. </p>
        <button
          onClick={handleGoogleLogin}
          className="
      w-full py-3
      flex items-center justify-center gap-3
      rounded-md font-semibold
      border border-border
      bg-background text-foreground
      hover:bg-accent/20
      transition
    "
        >
          <img src="/google.svg" alt="Google" className="h-5 w-5" />
          Continue with Google
        </button>
        <p className="mt-5 text-xs text-muted-foreground leading-5">
          By continuing, you agree to our{" "}
          <Link
            to="/terms"
            className="underline hover:text-foreground transition-colors"
          >
            Terms & Conditions
          </Link>{" "}
          and{" "}
          <Link
            to="/privacy"
            className="underline hover:text-foreground transition-colors"
          >
            Privacy Policy
          </Link>.
        </p>
      </div>

    </div>
  );
};

export default Login;
