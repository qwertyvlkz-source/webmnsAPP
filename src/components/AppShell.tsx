import { ReactNode } from "react";

/**
 * Simple full-screen shell for the app.
 * No phone frame simulation — just a clean app experience.
 */
const AppShell = ({ children }: { children: ReactNode }) => {
  return (
    <div className="relative mx-auto flex min-h-[100dvh] w-full max-w-md flex-col overflow-hidden bg-background">
      {children}
    </div>
  );
};

export default AppShell;
