import { useLang } from "@/i18n/LanguageContext";

const TopAppBar = () => {
  const { t } = useLang();

  return (
    <div className="flex items-center justify-between px-4 pt-[max(env(safe-area-inset-top),8px)] pb-1">
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
          <span className="text-[10px] font-bold text-primary-foreground">W</span>
        </div>
        <span className="text-sm font-bold text-foreground tracking-tight">WebMNS</span>
      </div>
      <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
        <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
        <span>Online</span>
      </div>
    </div>
  );
};

export default TopAppBar;
