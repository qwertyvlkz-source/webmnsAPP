import { Bell } from "lucide-react";
import { motion } from "framer-motion";

const TopAppBar = () => {
  return (
    <header className="flex items-center justify-between px-4 py-1.5">
      <span className="text-base font-bold tracking-tight text-foreground">
        WebMNS
      </span>
      <motion.button whileTap={{ scale: 0.9 }} className="relative flex h-8 w-8 items-center justify-center rounded-full bg-secondary">
        <Bell size={16} className="text-muted-foreground" />
        <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-destructive" />
      </motion.button>
    </header>
  );
};

export default TopAppBar;
