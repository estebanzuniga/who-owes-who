import { useNavigate } from "react-router-dom";
import { PlusIcon } from "../../../components/Icons";

export default function EmptyHome() {
  const navigate = useNavigate();

  return (
    <>
      <div className="flex-1 flex flex-col items-center justify-center px-8 pb-10">
        <div className="relative w-40 h-40">
          <div className="absolute inset-0 rounded-full bg-sage-100 opacity-80" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full border-2 border-sage-300 bg-cream" />
          <div className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-clay-500 flex items-center justify-center shadow-md">
            <PlusIcon size={20} />
          </div>
        </div>
        <h2 className="text-xl font-bold text-ink mt-8 mb-2 text-center">
          No shared accounts yet
        </h2>
        <p className="text-sm text-ink-soft text-center leading-relaxed">
          Start a tab with your partner, roommate,{"\n"}or anyone you split things with.
        </p>
      </div>

      <div className="px-5 pb-32">
        <button
          onClick={() => navigate("/account/new")}
          className="w-full py-4 rounded-xl bg-sage-700 text-white font-semibold text-sm tracking-widest uppercase"
        >
          Create shared account
        </button>
      </div>
    </>
  );
}
