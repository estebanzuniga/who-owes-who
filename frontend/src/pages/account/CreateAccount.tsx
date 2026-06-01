import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { ChevronLeftIcon } from "../../components/Icons";

interface CreateAccountResponse {
  couple: { id: string; name: string; currency: string };
  invitationLink: string;
}

export default function CreateAccount() {
  const navigate = useNavigate();

  const [label, setLabel] = useState("");
  const [currency, setCurrency] = useState("CLP");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleCreate() {
    setError(null);
    const name = label.trim() || "Shared account";
    setLoading(true);
    try {
      const { data } = await api.post<CreateAccountResponse>("/account", { name, currency });
      navigate("/account/invite", {
        replace: true,
        state: {
          invitationLink: data.invitationLink,
          couple: data.couple,
          label: data.couple.name,
        },
      });
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Couldn't create the account. Please try again.";
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
        <span className="font-serif italic">Start a</span>
        <br />
        <span className="font-extrabold">shared tab.</span>
      </h1>
      <p className="text-sm text-ink-soft mb-10">
        Give it a name, then invite the person you split things with.
      </p>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold tracking-widest uppercase text-ink-soft">
          Tab name
        </label>
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Apartment"
          maxLength={40}
          className="w-full py-2 bg-transparent border-b border-ink text-ink text-base outline-none focus:border-sage-700 transition-colors placeholder:text-ink-mute"
        />
      </div>

      <div className="mt-8 flex items-center justify-between rounded-card bg-paper px-4 py-3">
        <span className="text-xs font-semibold tracking-widest uppercase text-ink-soft">
          Currency
        </span>
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="text-sm font-bold text-ink bg-transparent outline-none cursor-pointer"
        >
          <option value="CLP">CLP $</option>
          <option value="USD">USD $</option>
        </select>
      </div>

      {error && <p className="text-sm text-danger mt-4">{error}</p>}

      <div className="flex-1" />

      <button
        type="button"
        onClick={handleCreate}
        disabled={loading}
        className="w-full py-4 rounded-xl bg-sage-700 text-white font-semibold text-sm tracking-widest uppercase mt-6 disabled:opacity-60 transition-opacity"
      >
        {loading ? "Creating…" : "Create & invite"}
      </button>
    </div>
  );
}
