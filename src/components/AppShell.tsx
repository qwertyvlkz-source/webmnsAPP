import { ReactNode } from "react";

/**
 * Simple full-screen shell for the app.
 * No phone frame simulation — just a clean app experience.
 */
const AppShell = ({ children }: { children: ReactNode }) => {
  return (
    <div className="app-surface relative mx-auto flex min-h-[100dvh] w-full max-w-md flex-col overflow-hidden shadow-[0_0_80px_rgba(64,45,145,0.12)]">
      {children}
    </div>
  );
};

export default AppShell;
