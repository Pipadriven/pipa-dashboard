import { useCallback, useState } from "react";
import { Menu, Search } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { NotificationsMenu } from "./NotificationsMenu";
import { UserMenu } from "./UserMenu";
import { GlobalSearch, useAtalhoBusca } from "./GlobalSearch";

interface TopBarProps {
  onMenuToggle?: () => void;
  isMobile?: boolean;
}

export function TopBar({ onMenuToggle, isMobile }: TopBarProps) {
  const [buscaAberta, setBuscaAberta] = useState(false);
  const abrirBusca = useCallback(() => setBuscaAberta(true), []);
  useAtalhoBusca(abrirBusca);

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 items-center gap-2 border-b border-border bg-card px-3 sm:px-6">
        {isMobile && onMenuToggle && (
          <button
            type="button"
            onClick={onMenuToggle}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary"
            aria-label="Abrir menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}

        {/* Gatilho da busca. É um <button>, não um <input>: quem digita é o
            campo do diálogo. Um input que não busca nada era o problema
            anterior — parecia funcional e não era. */}
        <button
          type="button"
          onClick={abrirBusca}
          className="flex h-10 flex-1 items-center gap-2.5 rounded-lg border border-border bg-background px-3 text-left transition-colors hover:border-input sm:max-w-md"
        >
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
          <span className="truncate text-sm text-muted-foreground">
            {isMobile ? "Buscar…" : "Buscar corretor, visita ou página…"}
          </span>
          {!isMobile && (
            <kbd className="ml-auto shrink-0 rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] font-medium text-muted-foreground">
              ⌘K
            </kbd>
          )}
        </button>

        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <ThemeToggle />
          <NotificationsMenu />
          <div className="mx-1 hidden h-8 w-px bg-border sm:block" />
          <UserMenu />
        </div>
      </header>

      <GlobalSearch open={buscaAberta} onOpenChange={setBuscaAberta} />
    </>
  );
}
