import { ChevronDownIcon } from "../../../components/Icons";

const recentTransactions = [
  { icon: "🛒", title: "Groceries", meta: "You paid · 60/40", amount: "$24.500" },
  { icon: "💡", title: "Electricity", meta: "Maria paid · 50/50", amount: "$43.000" },
  { icon: "🍷", title: "Date night", meta: "You paid · 50/50", amount: "$38.000" },
  { icon: "🔧", title: "Plumber", meta: "You paid · 70/30", amount: "$65.500" },
];

export default function PopulatedHome() {
  return (
    <div className="flex-1 flex flex-col gap-4 px-4 pb-28">
      <AccountSelector />
      <BalanceCard />
      <PaidBreakdown />
      <RecentTransactions />
    </div>
  );
}

function AccountSelector() {
  return (
    <button className="self-start flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-ink/20 bg-white/50 text-sm font-medium text-ink">
      <span>🏠</span>
      <span>Apartment</span>
      <ChevronDownIcon size={14} />
    </button>
  );
}

function BalanceCard() {
  return (
    <div className="bg-sage-700 rounded-2xl p-5 text-white">
      <p className="text-sm font-medium opacity-80 mb-1">Maria owes you</p>
      <p className="text-5xl font-extrabold tracking-tight leading-none">$42.500</p>
      <p className="text-xs opacity-60 mt-1 mb-4">CLP · settled 3 days ago</p>

      <div className="flex gap-3">
        <button className="flex-1 py-2.5 rounded-xl bg-sage-600 text-white text-sm font-semibold">
          Settle up
        </button>
        <button className="flex-1 py-2.5 rounded-xl border border-white/40 text-white text-sm font-semibold">
          Remind
        </button>
      </div>
    </div>
  );
}

function PaidBreakdown() {
  return (
    <div className="flex gap-3">
      <div className="flex-1 bg-white rounded-2xl p-4">
        <div className="flex items-center gap-1.5 mb-1">
          <span className="w-2 h-2 rounded-full bg-sage-500" />
          <span className="text-xs text-ink-soft">You paid</span>
        </div>
        <p className="text-lg font-bold text-ink">$128.000</p>
      </div>
      <div className="flex-1 bg-white rounded-2xl p-4">
        <div className="flex items-center gap-1.5 mb-1">
          <span className="w-2 h-2 rounded-full bg-ink/20" />
          <span className="text-xs text-ink-soft">Maria paid</span>
        </div>
        <p className="text-lg font-bold text-ink">$43.000</p>
      </div>
    </div>
  );
}

function RecentTransactions() {
  return (
    <div className="bg-white rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-bold text-ink">Recent</span>
        <button className="text-xs font-semibold text-clay-500">See all</button>
      </div>
      <div className="flex flex-col divide-y divide-ink/5">
        {recentTransactions.map((tx) => (
          <div key={tx.title} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
            <div className="w-10 h-10 rounded-xl bg-cream flex items-center justify-center text-lg flex-shrink-0">
              {tx.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-ink">{tx.title}</p>
              <p className="text-xs text-ink-soft">{tx.meta}</p>
            </div>
            <p className="text-sm font-bold text-ink">{tx.amount}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
