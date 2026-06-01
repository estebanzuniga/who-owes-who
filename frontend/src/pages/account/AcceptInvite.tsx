import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../../api/axios";
import { useAuthStore } from "../../store/authStore";

export default function AcceptInvite() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const token = params.get("token");

  const user = useAuthStore((s) => s.user);
  const fetchMe = useAuthStore((s) => s.fetchMe);

  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [creatorInitial, setCreatorInitial] = useState<string | null>(null);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  useEffect(() => {
    if (!token) return;
    api
      .get<{ creatorName: string }>(`/account/invite/?token=${token}`)
      .then((res) => setCreatorInitial(res.data.creatorName?.[0]?.toUpperCase() ?? "?"))
      .catch(() => setCreatorInitial("?"));
  }, [token]);

  async function accept() {
    if (!token) return;
    setError(null);
    setAccepting(true);
    try {
      await api.post("/account/join", { token });
      navigate("/home", { replace: true });
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Couldn't accept the invite. Please try again.";
      setError(message);
    } finally {
      setAccepting(false);
    }
  }

  const youInitial = (user?.name?.[0] ?? "Y").toUpperCase();

  if (!token) {
    return (
      <div className="flex flex-col min-h-screen bg-cream px-6 py-10 items-center justify-center text-center">
        <h1 className="text-2xl font-extrabold text-ink mb-2">
          Invalid invite
        </h1>
        <p className="text-sm text-ink-soft mb-8">
          This invitation link is missing or broken.
        </p>
        <button
          onClick={() => navigate("/home", { replace: true })}
          className="px-6 py-3 rounded-xl bg-sage-700 text-white font-semibold text-sm"
        >
          Go home
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-cream px-6 pt-12 pb-10">
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div className="flex items-center justify-center mb-7">
          <div className="w-16 h-16 rounded-full bg-sage-300 flex items-center justify-center text-sage-900 text-xl font-bold -mr-3 z-10 ring-4 ring-cream">
            {creatorInitial ?? "?"}
          </div>
          <span className="text-ink-soft text-lg mx-1">+</span>
          <div className="w-16 h-16 rounded-full bg-clay-100 flex items-center justify-center text-clay-700 text-xl font-bold -ml-3 ring-4 ring-cream">
            {youInitial}
          </div>
        </div>

        <h1 className="text-3xl font-extrabold text-ink mb-2">
          You've been invited
        </h1>
        <p className="text-sm text-ink-soft leading-relaxed max-w-[18rem]">
          Join the shared tab to start splitting expenses together.
        </p>

        <div className="w-full flex items-center justify-between rounded-card bg-white px-4 py-3.5 mt-8">
          <p className="text-[11px] text-ink-soft">Currency</p>
          <p className="text-sm font-bold text-ink">CLP $</p>
        </div>

        {error && <p className="text-sm text-danger mt-4">{error}</p>}
      </div>

      <div className="flex flex-col gap-3 mt-6">
        <button
          onClick={accept}
          disabled={accepting}
          className="w-full py-4 rounded-xl bg-sage-700 text-white font-semibold text-sm tracking-widest uppercase disabled:opacity-60 transition-opacity"
        >
          {accepting ? "Joining…" : "Accept invite"}
        </button>
        <button
          onClick={() => navigate("/home", { replace: true })}
          className="w-full py-4 rounded-xl bg-paper border border-ink/15 text-ink font-semibold text-sm tracking-widest uppercase"
        >
          Decline
        </button>
      </div>
    </div>
  );
}
