import { useState } from "react";
import { AppSidebar } from "./AppSidebar";
import { TopBar } from "./TopBar";
import { useIsMobile } from "../hooks/use-mobile";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const isMobile = useIsMobile();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-background pipa-dot-bg">
      {/* Desktop sidebar */}
      {!isMobile && <AppSidebar />}

      {/* Mobile drawer overlay */}
      {isMobile && (
        <AnimatePresence>
          {drawerOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-40 bg-black/60"
                onClick={() => setDrawerOpen(false)}
              />
              <motion.div
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="fixed inset-y-0 left-0 z-50 w-[260px]"
              >
                <AppSidebar onNavigate={() => setDrawerOpen(false)} />
              </motion.div>
            </>
          )}
        </AnimatePresence>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <TopBar
          onMenuToggle={isMobile ? () => setDrawerOpen(true) : undefined}
          isMobile={isMobile}
        />
        <main className="flex-1 p-3 sm:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
