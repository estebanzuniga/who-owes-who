import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setPasswordMismatch(true);
      return;
    }
    setPasswordMismatch(false);

    setLoading(true);
    try {
      await api.post("/auth/register", { name, email, password });
      navigate("/login");
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
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M12.5 15L7.5 10L12.5 5"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <h1 className="text-3xl font-extrabold text-ink mb-1">
        Create an account
      </h1>
      <p className="text-sm text-ink-soft mb-8">
        Just your name, email, and a password.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Name"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3.5 rounded-xl bg-white border border-sage-50 text-ink placeholder:text-ink-mute text-sm outline-none focus:border-sage-400 transition-colors"
        />
        <input
          type="email"
          placeholder="Email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3.5 rounded-xl bg-white border border-sage-50 text-ink placeholder:text-ink-mute text-sm outline-none focus:border-sage-400 transition-colors"
        />
        <input
          type="password"
          placeholder="Password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setPasswordMismatch(e.target.value !== confirmPassword);
          }}
          className="w-full px-4 py-3.5 rounded-xl bg-white border border-sage-50 text-ink placeholder:text-ink-mute text-sm outline-none focus:border-sage-400 transition-colors"
        />
        <input
          type="password"
          placeholder="Confirm password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            setPasswordMismatch(e.target.value !== '' && password !== '' && password !== e.target.value);
          }}
          className={`w-full px-4 py-3.5 rounded-xl bg-white border text-ink placeholder:text-ink-mute text-sm outline-none transition-colors ${
            passwordMismatch
              ? "border-danger focus:border-danger"
              : "border-sage-50 focus:border-sage-400"
          }`}
        />

        {passwordMismatch && (
          <p className="text-sm text-danger -mt-1">Passwords don't match.</p>
        )}

        {error && (
          <p className="text-sm text-danger mt-1">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading || !name || !email || !password || !confirmPassword || passwordMismatch}
          className="w-full py-4 rounded-xl bg-sage-700 text-white font-semibold text-base mt-3 disabled:opacity-60 transition-opacity"
        >
          {loading ? "Creating account…" : "Continue"}
        </button>
      </form>

      <p className="text-sm text-ink-soft text-center mt-6">
        Have an account?{" "}
        <button
          onClick={() => navigate("/login")}
          className="text-sage-700 font-semibold"
        >
          Log in
        </button>
      </p>
    </div>
  );
}
