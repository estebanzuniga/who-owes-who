import { useNavigate } from "react-router-dom";

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-cream px-6 py-10">
      <header>
        <span className="text-xs font-semibold tracking-widest uppercase text-ink">
          WhoOwesWho
        </span>
      </header>

      <main className="flex-1 flex flex-col justify-end pb-6">
        <h1 className="text-5xl font-extrabold leading-tight text-ink mb-4">
          Keep the{" "}
          <span className="text-sage-700">shared tab</span>
          {" "}tidy.
        </h1>
        <p className="text-sm text-ink-soft leading-relaxed">
          For couples and roommates. Add expenses, set splits, see who owes who.
        </p>
      </main>

      <footer className="flex flex-col gap-3">
        <button
          onClick={() => navigate("/register")}
          className="w-full py-4 rounded-xl bg-sage-700 text-white font-semibold text-base"
        >
          Get started
        </button>
        <button
          onClick={() => navigate("/login")}
          className="w-full py-4 rounded-xl bg-paper border border-sage-50 text-ink font-semibold text-base"
        >
          I have an account
        </button>
      </footer>
    </div>
  );
}
