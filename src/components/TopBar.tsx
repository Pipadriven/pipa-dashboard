import { Search, Calendar, Bell, PlusCircle, Menu } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

interface TopBarProps {
  onMenuToggle?: () => void;
  isMobile?: boolean;
}

export function TopBar({ onMenuToggle, isMobile }: TopBarProps) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-14 sm:h-16 px-3 sm:px-6 border-b border-border bg-card backdrop-blur-md">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        {isMobile && onMenuToggle && (
          <button
            onClick={onMenuToggle}
            className="p-2 -ml-1 rounded-lg hover:bg-secondary transition-colors text-muted-foreground"
            aria-label="Abrir menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}

        <div className="relative flex-1 max-w-xs sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar..."
            className="w-full h-9 sm:h-10 pl-10 pr-4 text-sm rounded-lg border border-border bg-secondary/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
          />
          {!isMobile && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5">
              <kbd className="text-[10px] font-medium text-muted-foreground bg-muted px-1.5 py-0.5 rounded">⌘</kbd>
              <kbd className="text-[10px] font-medium text-muted-foreground bg-muted px-1.5 py-0.5 rounded">F</kbd>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-3 ml-2">
        <ThemeToggle />
        {!isMobile && (
          <button className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground">
            <Calendar className="h-5 w-5" />
          </button>
        )}
        <button className="relative p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-primary rounded-full" />
        </button>
        {!isMobile && (
          <>
            <button className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground">
              <PlusCircle className="h-5 w-5" />
            </button>
            <div className="h-8 w-px bg-border mx-1" />
            <div className="flex items-center gap-3 cursor-pointer">
              <div className="h-9 w-9 rounded-lg bg-primary/20 flex items-center justify-center">
                <span className="text-sm font-semibold text-primary">PD</span>
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-semibold text-foreground leading-tight">PIPA Driven</p>
                <p className="text-xs text-muted-foreground">Negócios</p>
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
