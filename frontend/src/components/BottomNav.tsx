import { useNavigate, useLocation } from "react-router-dom";
import { HomeIcon, LedgerIcon, StatsIcon, PersonIcon, PlusIcon } from "./Icons";
import type { IconComponent } from "./Icons";
import NavItem from "./NavItem";

type Tab = "home" | "ledger" | "stats" | "you";

const tabs: { id: Tab; label: string; icon: IconComponent; path: string }[] = [
  { id: "home", label: "Home", icon: HomeIcon, path: "/home" },
  { id: "ledger", label: "Ledger", icon: LedgerIcon, path: "/ledger" },
  { id: "stats", label: "Stats", icon: StatsIcon, path: "/stats" },
  { id: "you", label: "You", icon: PersonIcon, path: "/you" },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const active = tabs.find((t) => t.path === pathname)?.id ?? "home";

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="relative flex justify-center">
        <button
          onClick={() => {}}
          className="absolute -top-6 w-14 h-14 rounded-full bg-clay-500 flex items-center justify-center shadow-lg z-10 text-white"
          aria-label="Add expense"
        >
          <PlusIcon size={24} />
        </button>
      </div>

      <nav className="bg-sage-700 flex items-end pb-safe pt-3">
        {tabs.slice(0, 2).map((tab) => (
          <NavItem
            key={tab.id}
            label={tab.label}
            icon={tab.icon}
            active={active === tab.id}
            onClick={() => navigate(tab.path)}
          />
        ))}

        <div className="flex-1" />

        {tabs.slice(2).map((tab) => (
          <NavItem
            key={tab.id}
            label={tab.label}
            icon={tab.icon}
            active={active === tab.id}
            onClick={() => navigate(tab.path)}
          />
        ))}
      </nav>
    </div>
  );
}