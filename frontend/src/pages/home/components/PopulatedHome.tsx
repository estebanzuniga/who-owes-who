import { useNavigate } from "react-router-dom";
import { type CoupleAccount } from "../../../types/coupleAccount";
import { useAuthStore } from "../../../store/authStore";

export default function PopulatedHome({ accounts }: { accounts: CoupleAccount[] }) {
  return (
    <div className="flex-1 flex flex-col gap-3 px-4 pb-28">
      {accounts.map((account) => (
        <AccountCard key={account.id} account={account} />
      ))}
    </div>
  );
}

function AccountCard({ account }: { account: CoupleAccount }) {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const partner =
    account.creatorId === user?.id ? account.invited : account.creator;

  return (
    <button
      onClick={() => navigate(`/account/${account.id}`)}
      className="w-full text-left bg-white rounded-2xl p-5 flex items-center justify-between gap-4 active:scale-[0.98] transition-transform"
    >
      <div className="flex flex-col gap-1">
        <span className="text-base font-bold text-ink">{account.name}</span>
        <span className="text-sm text-ink-soft">
          {partner ? `with ${partner.name}` : "No partner yet"}
        </span>
      </div>
      <div className="flex flex-col items-end gap-1">
        <span className="text-xs font-medium text-ink-soft">{account.currency}</span>
        <span className="text-xs text-ink/40">
          {partner ? "Active" : "Pending invite"}
        </span>
      </div>
    </button>
  );
}
