import { useEffect } from "react";
import BottomNav from "../../components/BottomNav";
import Header from "../../components/Header";
import EmptyHome from "./components/EmptyHome";
import PopulatedHome from "./components/PopulatedHome";
import { useCoupleAccountStore } from "../../store/coupleAccountStore";

export default function Home() {
  const { accounts, fetchAccounts } = useCoupleAccountStore();

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  return (
    <div className="flex flex-col min-h-screen bg-cream">
      <Header />
      {accounts.length > 0 ? <PopulatedHome accounts={accounts} /> : <EmptyHome />}
      <BottomNav />
    </div>
  );
}
