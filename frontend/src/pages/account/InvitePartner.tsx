import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import {
  ChevronLeftIcon,
  CopyIcon,
  ShareIcon,
  CheckIcon,
} from "../../components/Icons";

interface InviteState {
  invitationLink: string;
  label?: string;
}

export default function InvitePartner() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as InviteState | null;

  const [copied, setCopied] = useState(false);

  // Reached without a generated link (e.g. a refresh) — start over.
  if (!state?.invitationLink) {
    return <Navigate to="/account/new" replace />;
  }

  const { invitationLink, label = "Shared" } = state;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(invitationLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  async function share() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Join my "${label}" tab`,
          text: `Let's split expenses on WhoOwesWho.`,
          url: invitationLink,
        });
        return;
      } catch {
        // user cancelled or unsupported — fall through to copy
      }
    }
    copyLink();
  }

  return (
    <div className="flex flex-col min-h-screen bg-cream px-6 pt-12 pb-10">
      <div className="relative flex items-center justify-center mb-10">
        <button
          onClick={() => navigate(-1)}
          className="absolute left-0 w-8 h-8 flex items-center justify-center -ml-1 text-ink"
          aria-label="Go back"
        >
          <ChevronLeftIcon size={16} />
        </button>
        <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-ink">
          Invite partner
        </span>
      </div>

      <h1 className="text-3xl font-extrabold text-ink mb-1">Send an invite</h1>
      <p className="text-sm text-ink-soft leading-relaxed mb-4">
        Share this link. They'll join your "{label}" tab.
      </p>

      <div className="bg-white rounded-2xl p-6 flex flex-col items-center gap-4">
        <QRCodeSVG
          value={invitationLink}
          size={148}
          bgColor="#FFFFFF"
          fgColor="#435334"
          level="M"
        />
        <p className="text-sm font-mono font-semibold text-ink break-all text-center">
          {stripScheme(invitationLink)}
        </p>
      </div>

      <div className="flex gap-3 mt-5">
        <button
          onClick={copyLink}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl border border-ink/20 bg-paper text-ink font-semibold text-sm"
        >
          {copied ? <CheckIcon size={16} /> : <CopyIcon size={16} />}
          {copied ? "Copied" : "Copy link"}
        </button>
        <button
          onClick={share}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl border border-ink/20 bg-paper text-ink font-semibold text-sm"
        >
          <ShareIcon size={16} />
          Share
        </button>
      </div>

      <div className="flex-1" />

      <button
        onClick={() => navigate("/home", { replace: true })}
        className="w-full py-4 rounded-xl bg-sage-700 text-white font-semibold text-sm tracking-widest uppercase mt-6"
      >
        Done
      </button>
    </div>
  );
}

function stripScheme(link: string): string {
  return link.replace(/^https?:\/\//, "");
}
