import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuthStore } from "../store/authStore";
import { ChevronLeftIcon } from "../components/SVGIcons";

export default function Login() {
  const navigate = useNavigate();
  const fetchMe = useAuthStore((s) => s.fetchMe);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/login", { email, password });
      await fetchMe();
      navigate("/");
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Something went wrong. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-cream px-6 py-10">
      <button
        onClick={() => navigate(-1)}
        className="w-8 h-8 flex items-center justify-center -ml-1 mb-8 text-ink"
        aria-label="Go back"
      >
        <ChevronLeftIcon size={16} />
      </button>

      <h1 className="text-4xl leading-tight text-ink mb-2">
        <span className="font-serif italic">Welcome</span>
        <br />
        <span className="font-extrabold">back, friend.</span>
      </h1>
      <p className="text-sm text-ink-soft mb-10">Pick up where you left off.</p>

      <form id="login-form" onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold tracking-widest uppercase text-ink-soft">
            Email
          </label>
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full py-2 bg-transparent border-b border-ink text-ink text-base outline-none focus:border-sage-700 transition-colors"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold tracking-widest uppercase text-ink-soft">
            Password
          </label>
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full py-2 bg-transparent border-b border-ink text-ink text-base outline-none focus:border-sage-700 transition-colors"
          />
        </div>

        <button
          type="button"
          className="self-start text-sm font-semibold text-clay-500"
        >
          Forgot password?
        </button>

        {error && <p className="text-sm text-danger">{error}</p>}
      </form>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Continue button */}
      <button
        type="submit"
        form="login-form"
        disabled={loading}
        className="w-full py-4 rounded-xl bg-sage-700 text-white font-semibold text-sm tracking-widest uppercase mt-6 disabled:opacity-60 transition-opacity"
      >
        {loading ? "Logging in…" : "Continue"}
      </button>
    </div>
  );
}
