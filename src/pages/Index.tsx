import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import AppShell from "@/components/AppShell";
import TopAppBar from "@/components/TopAppBar";
import BottomTabBar from "@/components/BottomTabBar";
import HomeScreen from "@/screens/HomeScreen";
import PortfolioScreen from "@/screens/PortfolioScreen";
import OrderScreen from "@/screens/OrderScreen";
import ProfileScreen from "@/screens/ProfileScreen";
import PartnerScreen from "@/screens/PartnerScreen";

const screens = [HomeScreen, PortfolioScreen, OrderScreen, ProfileScreen];

const Index = () => {
  const [tab, setTab] = useState(0);
  const [showPartner, setShowPartner] = useState(false);

  if (showPartner) {
    return (
      <AppShell>
        <TopAppBar />
        <PartnerScreen onBack={() => setShowPartner(false)} />
      </AppShell>
    );
  }

  const Screen = screens[tab];

  return (
    <AppShell>
      <TopAppBar />
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="flex flex-1 flex-col overflow-hidden"
        >
          {tab === 0 ? (
            <Screen onOpenPartner={() => setShowPartner(true)} onTabChange={setTab} />
          ) : tab === 1 ? (
            <Screen onTabChange={setTab} />
          ) : tab === 3 ? (
            <Screen onOpenPartner={() => setShowPartner(true)} />
          ) : (
            <Screen />
          )}
        </motion.div>
      </AnimatePresence>
      <BottomTabBar active={tab} onTabChange={setTab} />
    </AppShell>
  );
};

export default Index;
