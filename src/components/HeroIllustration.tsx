import { motion } from "framer-motion";
import { Cog, Settings, ImageIcon } from "lucide-react";

const bars = [55, 80, 45, 95, 65];

/**
 * Animated hero illustration inspired by webmns.com:
 * a monitor with code + a live bar chart, two rotating gears, an orbit ring
 * and floating tech badges (JS / </> / HTML).
 */
const HeroIllustration = () => {
  const float = (delay: number) => ({
    animate: { y: [0, -7, 0] },
    transition: { duration: 3, repeat: Infinity, ease: "easeInOut" as const, delay },
  });

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[230px]">
      {/* Soft glow */}
      <div className="absolute inset-4 rounded-full bg-gradient-to-br from-primary/25 to-accent/20 blur-2xl" />

      {/* Orbit rings */}
      <motion.div
        aria-hidden
        animate={{ rotate: 360 }}
        transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
        className="absolute inset-2 rounded-full border border-dashed border-primary/30"
      />
      <motion.div
        aria-hidden
        animate={{ rotate: -360 }}
        transition={{ duration: 70, repeat: Infinity, ease: "linear" }}
        className="absolute inset-7 rounded-full border border-primary/10"
      />

      {/* Monitor */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-1/2 top-[46%] w-[62%] -translate-x-1/2 -translate-y-1/2"
      >
        <div className="rounded-xl bg-white p-1.5 shadow-2xl shadow-primary/20 ring-1 ring-black/5">
          <div className="overflow-hidden rounded-lg bg-gradient-to-br from-blue-50 to-sky-50 p-2">
            {/* Code lines */}
            <div className="space-y-1">
              <div className="h-1.5 w-3/4 rounded-full bg-blue-500" />
              <div className="h-1.5 w-1/2 rounded-full bg-sky-400" />
              <div className="h-1.5 w-2/3 rounded-full bg-blue-300" />
            </div>
            {/* Live bar chart */}
            <div className="mt-2 flex h-8 items-end gap-1">
              {bars.map((h, i) => (
                <motion.div
                  key={i}
                  animate={{ height: [`${h * 0.55}%`, `${h}%`, `${h * 0.55}%`] }}
                  transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
                  className="w-1.5 flex-1 rounded-sm bg-gradient-to-t from-blue-600 to-sky-400"
                />
              ))}
            </div>
            {/* Image placeholder */}
            <div className="mt-1.5 flex h-5 items-center justify-center rounded bg-blue-100">
              <ImageIcon size={12} className="text-blue-400" />
            </div>
          </div>
        </div>
        {/* Stand */}
        <div className="mx-auto mt-1 h-2.5 w-5 rounded-b-md bg-gradient-to-b from-blue-600 to-blue-700" />
        <div className="mx-auto h-1 w-10 rounded-full bg-blue-500/70" />
      </motion.div>

      {/* Gears */}
      <motion.div
        aria-hidden
        animate={{ rotate: 360 }}
        transition={{ duration: 13, repeat: Infinity, ease: "linear" }}
        className="absolute right-1 top-5 text-slate-700"
      >
        <Cog size={38} strokeWidth={1.6} />
      </motion.div>
      <motion.div
        aria-hidden
        animate={{ rotate: -360 }}
        transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-7 left-0 text-slate-600"
      >
        <Settings size={26} strokeWidth={1.6} />
      </motion.div>

      {/* Floating tech badges */}
      <motion.div
        {...float(0)}
        className="absolute left-1 top-12 rounded-lg bg-blue-600 px-2 py-1 font-mono text-[10px] font-bold text-white shadow-lg shadow-blue-600/30"
      >
        JS
      </motion.div>
      <motion.div
        {...float(0.7)}
        className="absolute right-0 top-1 rounded-lg bg-sky-500 px-2 py-1 font-mono text-[10px] font-bold text-white shadow-lg shadow-sky-500/30"
      >
        {"</>"}
      </motion.div>
      <motion.div
        {...float(1.3)}
        className="absolute bottom-3 left-8 rounded-lg bg-white px-2 py-1 font-mono text-[10px] font-bold text-blue-600 shadow-lg ring-1 ring-blue-100"
      >
        HTML
      </motion.div>
    </div>
  );
};

export default HeroIllustration;
