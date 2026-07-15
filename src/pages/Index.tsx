import { lazy, Suspense, useState, type ComponentType } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import AppShell from "@/components/AppShell";
import TopAppBar from "@/components/TopAppBar";
import BottomTabBar from "@/components/BottomTabBar";

const HomeScreen = lazy(() => import("@/screens/HomeScreen"));
const PortfolioScreen = lazy(() => import("@/screens/PortfolioScreen"));
const OrderScreen = lazy(() => import("@/screens/OrderScreen"));
const ProfileScreen = lazy(() => import("@/screens/ProfileScreen"));
const PartnerScreen = lazy(() => import("@/screens/PartnerScreen"));

interface ScreenProps {
  onOpenPartner?: () => void;
  onTabChange?: (tab: number) => void;
  onRequireAuth?: () => void;
  onSelectService?: (serviceId: number) => void;
  initialServiceId?: number | null;
}

const screens: ComponentType<ScreenProps>[] = [HomeScreen, PortfolioScreen, OrderScreen, ProfileScreen];

const ScreenLoader = () => (
  <div className="flex flex-1 items-center justify-center">
    <Loader2 size={24} className="animate-spin text-primary" />
  </div>
);

const Index = () => {
  const [tab, setTab] = useState(0);
  const [showPartner, setShowPartner] = useState(false);
  const [initialServiceId, setInitialServiceId] = useState<number | null>(null);

  const openTab = (nextTab: number) => {
    setShowPartner(false);
    if (nextTab === 2) setInitialServiceId(null);
    setTab(nextTab);
  };

  if (showPartner) {
    return (
      <AppShell>
        <TopAppBar />
        <Suspense fallback={<ScreenLoader />}>
          <PartnerScreen
            onBack={() => setShowPartner(false)}
            onRequireAuth={() => { setShowPartner(false); setTab(3); }}
          />
        </Suspense>
        <BottomTabBar active={tab} onTabChange={openTab} />
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
          <Suspense fallback={<ScreenLoader />}>
            {tab === 0 ? (
              <Screen
                onOpenPartner={() => setShowPartner(true)}
                onTabChange={setTab}
                onSelectService={(serviceId) => {
                  setInitialServiceId(serviceId);
                  setTab(2);
                }}
              />
            ) : tab === 1 ? (
              <Screen onTabChange={setTab} />
            ) : tab === 2 ? (
              <Screen onRequireAuth={() => setTab(3)} initialServiceId={initialServiceId} />
            ) : (
              <Screen />
            )}
          </Suspense>
        </motion.div>
      </AnimatePresence>
      <BottomTabBar active={tab} onTabChange={openTab} />
    </AppShell>
  );
};

export default Index;
