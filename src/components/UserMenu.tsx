import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { ChevronDown, HelpCircle, LogOut, Settings } from "lucide-react";

/** "matheus.bastos@pipa.com.br" → "MB"; "ana@x.com" → "AN". */
function iniciais(email: string): string {
  const local = email.split("@")[0] ?? "";
  const partes = local.split(/[._-]+/).filter(Boolean);
  if (partes.length >= 2) return (partes[0][0] + partes[1][0]).toUpperCase();
  return local.slice(0, 2).toUpperCase() || "??";
}

/** "matheus.bastos" → "Matheus Bastos" */
function nomeProvavel(email: string): string {
  const local = email.split("@")[0] ?? "";
  return (
    local
      .split(/[._-]+/)
      .filter(Boolean)
      .map((p) => p[0].toUpperCase() + p.slice(1))
      .join(" ") || email
  );
}

/**
 * Menu do usuário.
 *
 * Antes isto era texto fixo: "PD / PIPA Driven / Negócios", igual para
 * todo mundo que logasse. Agora mostra quem de fato está na sessão, e o
 * bloco virou um menu de verdade — clicar em algo tinha que fazer algo.
 *
 * O nome vem do e-mail porque `profiles` hoje só devolve `client_id`.
 * Quando a tabela tiver nome e cargo, é trocar as duas funções acima
 * pelo dado real.
 */
export function UserMenu() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const email = user?.email ?? "";
  const nome = email ? nomeProvavel(email) : "Sessão";
  const sigla = email ? iniciais(email) : "··";

  const sair = async () => {
    await signOut();
    navigate("/login", { replace: true });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-2.5 rounded-lg py-1 pl-1 pr-2 transition-colors hover:bg-secondary"
        >
          <span
            aria-hidden="true"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg font-display text-sm font-bold"
            style={{ background: "hsl(var(--primary) / 0.15)", color: "hsl(var(--pipa-orange-dark))" }}
          >
            {sigla}
          </span>
          <span className="hidden min-w-0 flex-col items-start md:flex">
            <span className="max-w-[160px] truncate text-sm font-semibold leading-tight text-foreground">
              {nome}
            </span>
            <span className="max-w-[160px] truncate text-xs leading-tight text-muted-foreground">
              {email || "não autenticado"}
            </span>
          </span>
          <ChevronDown className="hidden h-4 w-4 shrink-0 text-muted-foreground md:block" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-[260px]">
        <div className="flex flex-col gap-0.5 px-2 py-2">
          <span className="truncate text-sm font-semibold text-foreground">{nome}</span>
          <span className="truncate text-xs text-muted-foreground">{email}</span>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem onSelect={() => navigate("/settings")} className="gap-2">
          <Settings className="h-4 w-4" />
          Configurações
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => navigate("/help")} className="gap-2">
          <HelpCircle className="h-4 w-4" />
          Ajuda
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onSelect={sair} className="gap-2 text-destructive focus:text-destructive">
          <LogOut className="h-4 w-4" />
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
