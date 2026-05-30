import BottomNav from "../../components/BottomNav";
import Header from "../../components/Header";
import EmptyHome from "./components/EmptyHome";
import PopulatedHome from "./components/PopulatedHome";

// Set to true to preview the populated state during development
const DEMO_HAS_ACCOUNTS = false;

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-cream">
      <Header />
      {DEMO_HAS_ACCOUNTS ? <PopulatedHome /> : <EmptyHome />}
      <BottomNav />
    </div>
  );
}
