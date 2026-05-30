import type { IconComponent } from "./Icons";

export default function NavItem({
  label,
  icon: Icon,
  active,
  onClick,
}: {
  label: string;
  icon: IconComponent;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex flex-col items-center gap-1 py-2 transition-colors ${
        active ? "text-white" : "text-sage-400 opacity-60"
      }`}
      aria-label={label}
    >
      <Icon size={22} />
      <span className="text-[10px] font-medium tracking-wide">{label}</span>
      {active && <span className="absolute bottom-0 w-1 h-1 rounded-full bg-white" />}
    </button>
  );
}
