import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { format, isToday, isTomorrow } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "./ui/command";
import { RedeIcon } from "./RedeIcon";
import { useRedeMetrics } from "../hooks/use-rede-metrics";
import {
  Bot,
  CalendarClock,
  HandCoins,
  LayoutDashboard,
  Megaphone,
  Settings,
  User,
} from "lucide-react";

const PAGINAS = [
  { titulo: "Visão Geral", url: "/", icon: LayoutDashboard },
  { titulo: "Rede de Parceiros", url: "/rede", icon: RedeIcon },
  { titulo: "Marketing", url: "/marketing", icon: Megaphone, emBreve: true },
  { titulo: "Vendas", url: "/vendas", icon: HandCoins, emBreve: true },
  { titulo: "PIPA", url: "/ia", icon: Bot, emBreve: true },
  { titulo: "Configurações", url: "/settings", icon: Settings },
];

const ROTULO_SITUACAO: Record<string, string> = {
  ativo: "Ativo",
  esfriando: "Esfriando",
  parado: "Parado",
  nunca_produziu: "Nunca produziu",
};

function quando(iso: string): string {
  const d = new Date(iso);
  if (isToday(d)) return `hoje, ${format(d, "HH:mm")}`;
  if (isTomorrow(d)) return `amanhã, ${format(d, "HH:mm")}`;
  return format(d, "d 'de' MMM, HH:mm", { locale: ptBR });
}

interface GlobalSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Busca global (⌘K).
 *
 * Procura no que a operação de fato tem: corretores da rede e visitas
 * agendadas. Reaproveita o cache de `useRedeMetrics(30)` — a mesma
 * queryKey que a página da Rede usa — então abrir a busca não dispara
 * requisição nova.
 *
 * A filtragem é do cmdk (fuzzy, ignora acento). Limitamos a 6 por grupo
 * para a lista não virar um paredão.
 */
export function GlobalSearch({ open, onOpenChange }: GlobalSearchProps) {
  const navigate = useNavigate();
  const { data, isLoading } = useRedeMetrics(30);

  const corretores = useMemo(
    () =>
      (data?.corretores ?? [])
        .filter((c) => c.nome)
        .sort((a, b) => (b.vendas ?? 0) - (a.vendas ?? 0)),
    [data],
  );

  const agenda = useMemo(() => data?.agenda ?? [], [data]);

  const ir = (url: string) => {
    onOpenChange(false);
    navigate(url);
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Buscar corretor, visita ou página…" />
      <CommandList>
        <CommandEmpty>
          {isLoading ? "Carregando a rede…" : "Nada encontrado para esse termo."}
        </CommandEmpty>

        <CommandGroup heading="Ir para">
          {PAGINAS.map((p) => (
            <CommandItem
              key={p.url}
              value={`${p.titulo} pagina`}
              onSelect={() => ir(p.url)}
            >
              <p.icon className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>{p.titulo}</span>
              {p.emBreve && (
                <span className="ml-auto font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  em breve
                </span>
              )}
            </CommandItem>
          ))}
        </CommandGroup>

        {corretores.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Corretores">
              {corretores.slice(0, 60).map((c) => (
                <CommandItem
                  key={c.corretor_id}
                  value={`${c.nome} ${c.imobiliaria ?? ""} corretor`}
                  onSelect={() => ir("/rede")}
                >
                  <User className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="truncate">{c.nome}</span>
                  {c.imobiliaria && (
                    <span className="ml-2 truncate text-xs text-muted-foreground">
                      {c.imobiliaria}
                    </span>
                  )}
                  <span
                    className={`rede-chip ml-auto rede-${
                      c.situacao === "nunca_produziu" ? "nunca" : c.situacao
                    }`}
                  >
                    <i />
                    {ROTULO_SITUACAO[c.situacao] ?? c.situacao}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        {agenda.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Visitas agendadas">
              {agenda.slice(0, 60).map((v) => (
                <CommandItem
                  key={v.oportunidade_id}
                  value={`${v.cliente ?? ""} ${v.corretor ?? ""} ${
                    v.unidade_reservada ?? ""
                  } visita`}
                  onSelect={() => ir("/rede")}
                >
                  <CalendarClock className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="truncate">{v.cliente ?? "Cliente sem nome"}</span>
                  {v.corretor && (
                    <span className="ml-2 truncate text-xs text-muted-foreground">
                      com {v.corretor}
                    </span>
                  )}
                  <span className="ml-auto shrink-0 font-mono text-xs text-muted-foreground">
                    {quando(v.visita_agendada_para)}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
}

/** Atalho global ⌘K / Ctrl+K. Fica fora do componente para o listener
 *  existir uma vez só, montado pela TopBar. */
export function useAtalhoBusca(abrir: () => void) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        abrir();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [abrir]);
}
