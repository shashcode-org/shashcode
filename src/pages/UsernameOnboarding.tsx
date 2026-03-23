import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

const USERNAME_REGEX = /^[a-z0-9_]{3,20}$/;

const UsernameOnboarding = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!user) {
    navigate("/login", { replace: true });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const value = username.toLowerCase().trim();

    if (!USERNAME_REGEX.test(value)) {
      setError("Username must be 3–20 chars (a–z, 0–9, _)");
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("user_meta").insert({
      user_id: user.id,
      meta_json: {
        username: value,
        onboarded: true,
      },
    });

    setLoading(false);

    if (error) {
      // UNIQUE constraint will land here
      setError("Username already taken");
      return;
    }
    localStorage.setItem("onboarding_done", "true");
    window.location.href = "/";

  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-card p-6 rounded-xl shadow-lg border border-border"
      >
        <h1 className="text-2xl font-bold mb-4 text-center text-foreground">
          Choose your username
        </h1>

        {error && (
          <p className="mb-4 text-red-500 text-sm text-center">{error}</p>
        )}

        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="username"
          className="
          w-full mb-4 px-4 py-2 rounded
          border border-border
          bg-background
          text-foreground
          placeholder:text-muted-foreground
          focus:outline-none focus:ring-2 focus:ring-accentYellow
          "
          autoFocus
        />

        <button
          disabled={loading}
          className="
         w-full py-2
      bg-signature_yellow
      text-black
        rounded-md
        font-semibold
        hover:brightness-110
        transition
        disabled:opacity-50
          "
        >
          {loading ? "Saving..." : "Continue"}
        </button>
      </form>
    </div>
  );
};

export default UsernameOnboarding;