import { useEffect, useMemo, useState } from "react";
import type { ComponentType } from "react";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNowStrict, isToday } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useRedeMetrics } from "../hooks/use-rede-metrics";
import { AlertTriangle, Bell, CalendarClock, Clock, FileWarning, PauseCircle } from "lucide-react";

type Nivel = "urgente" | "atencao" | "info";

interface Alerta {
  id: string;
  nivel: Nivel;
  icon: ComponentType<{ className?: string }>;
  titulo: string;
  detalhe: string;
  url: string;
}

const CORES: Record<Nivel, string> = {
  urgente: "var(--rede-parado)",
  atencao: "var(--rede-esfriando)",
  info: "var(--muted-foreground)",
};

function unidadeLabel(u: { identificador: string; bloco: string | null } | null) {
  if (!u) return "unidade não informada";
  return u.bloco ? `${u.bloco} · ${u.identificador}` : u.identificador;
}

function daqui(iso: string) {
  return formatDistanceToNowStrict(new Date(iso), { locale: ptBR, addSuffix: true });
}

/**
 * Central de notificações.
 *
 * Tudo aqui sai de `useRedeMetrics(30)` — a mesma queryKey da página da
 * Rede, então o sino não cria requisição própria e já revalida a cada
 * 60s junto com o resto do painel. Nada é inventado: exceção, reserva,
 * corretor parado, tabela defasada e visita do dia são registros reais.
 *
 * O contador do sino conta só o que é acionável (urgente + atenção).
 * Corretor parado e visita do dia entram na lista como contexto, mas não
 * inflam o número — senão o badge nunca zera e vira ruído.
 */
export function NotificationsMenu() {
  const navigate = useNavigate();
  const { data, isLoading } = useRedeMetrics(30);

  const alertas = useMemo<Alerta[]>(() => {
    if (!data) return [];
    const agora = Date.now();
    const lista: Alerta[] = [];

    for (const e of data.excecoes) {
      const estourou = new Date(e.sla_ate).getTime() < agora;
      lista.push({
        id: `exc-${e.solicitada_em}-${e.unidade?.identificador ?? "?"}`,
        nivel: estourou ? "urgente" : "atencao",
        icon: estourou ? AlertTriangle : Clock,
        titulo: estourou
          ? `SLA estourado · desconto de ${e.percentual_pedido ?? "?"}%`
          : `Exceção pendente · ${e.percentual_pedido ?? "?"}%`,
        detalhe: `${unidadeLabel(e.unidade)} — ${e.corretor?.nome ?? "corretor não informado"} · vence ${daqui(e.sla_ate)}`,
        url: "/rede",
      });
    }

    for (const r of data.reservas) {
      lista.push({
        id: `res-${r.expira_em}-${r.unidade?.identificador ?? "?"}`,
        nivel: "atencao",
        icon: Clock,
        titulo: "Reserva expirando",
        detalhe: `${unidadeLabel(r.unidade)} — ${r.corretor?.nome ?? "sem corretor"} · expira ${daqui(r.expira_em)}`,
        url: "/rede",
      });
    }

    const parados = data.corretores.filter((c) => c.situacao === "parado");
    if (parados.length > 0) {
      const maisParado = parados.reduce((a, b) =>
        (b.dias_parado ?? 0) > (a.dias_parado ?? 0) ? b : a,
      );
      lista.push({
        id: "parados",
        nivel: "info",
        icon: PauseCircle,
        titulo: `${parados.length} ${parados.length === 1 ? "corretor parado" : "corretores parados"}`,
        detalhe: `Mais tempo sem ação: ${maisParado.nome ?? "sem nome"} · ${maisParado.dias_parado ?? 0} dias`,
        url: "/rede",
      });
    }

    if (data.defasada.length > 0) {
      lista.push({
        id: "defasada",
        nivel: "info",
        icon: FileWarning,
        titulo: `${data.defasada.length} com tabela desatualizada`,
        detalhe: "Corretores vendendo com versão antiga da tabela de preços",
        url: "/rede",
      });
    }

    const visitasHoje = data.agenda.filter((v) => isToday(new Date(v.visita_agendada_para)));
    if (visitasHoje.length > 0) {
      lista.push({
        id: "visitas-hoje",
        nivel: "info",
        icon: CalendarClock,
        titulo: `${visitasHoje.length} ${visitasHoje.length === 1 ? "visita hoje" : "visitas hoje"}`,
        detalhe: visitasHoje
          .slice(0, 2)
          .map((v) => v.cliente ?? "cliente sem nome")
          .join(", "),
        url: "/rede",
      });
    }

    const peso: Record<Nivel, number> = { urgente: 0, atencao: 1, info: 2 };
    return lista.sort((a, b) => peso[a.nivel] - peso[b.nivel]);
  }, [data]);

  const acionaveis = alertas.filter((a) => a.nivel !== "info").length;

  // Alertas acionáveis já vistos ficam no localStorage. O badge conta só o
  // que ainda não foi aberto: abrir o sino zera o número, mas um alerta NOVO
  // (id que não estava na lista de vistos) reacende — que é o certo para uma
  // notificação. Se o storage falhar (aba anônima), degrada para "tudo novo".
  const CHAVE = "pipa:notif:vistos";
  const [vistos, setVistos] = useState<Set<string>>(() => {
    try {
      return new Set(JSON.parse(localStorage.getItem(CHAVE) ?? "[]"));
    } catch {
      return new Set();
    }
  });
  const [aberto, setAberto] = useState(false);

  const idsAcionaveis = useMemo(
    () => alertas.filter((a) => a.nivel !== "info").map((a) => a.id),
    [alertas],
  );
  const naoVistos = idsAcionaveis.filter((id) => !vistos.has(id)).length;

  // Ao abrir, marca os acionáveis atuais como vistos e persiste. Guarda só
  // os que ainda existem, para o storage não crescer sem limite.
  useEffect(() => {
    if (!aberto || idsAcionaveis.length === 0) return;
    setVistos((prev) => {
      const proximo = new Set(idsAcionaveis);
      prev.forEach((id) => idsAcionaveis.includes(id) && proximo.add(id));
      try {
        localStorage.setItem(CHAVE, JSON.stringify([...proximo]));
      } catch {
        /* aba anônima: sem persistência, tudo bem */
      }
      return proximo;
    });
  }, [aberto, idsAcionaveis]);

  return (
    <DropdownMenu open={aberto} onOpenChange={setAberto}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={
            naoVistos > 0
              ? `Notificações: ${naoVistos} ${naoVistos === 1 ? "novo item" : "novos itens"}`
              : "Notificações"
          }
          className="relative flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <Bell className="h-5 w-5" />
          {naoVistos > 0 && (
            <span
              className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1 font-mono text-[10px] font-semibold text-primary-foreground"
              style={{ background: "hsl(var(--primary))" }}
            >
              {naoVistos > 9 ? "9+" : naoVistos}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-[380px] p-0">
        <div className="flex items-baseline justify-between border-b border-border px-4 py-3">
          <span className="font-display text-sm font-semibold text-foreground">Notificações</span>
          <span className="metric-label">
            {acionaveis > 0 ? `${acionaveis} pedem ação` : "nada pendente"}
          </span>
        </div>

        <div className="max-h-[400px] overflow-y-auto">
          {isLoading && (
            <p className="px-4 py-8 text-center text-sm text-muted-foreground">
              Carregando…
            </p>
          )}

          {!isLoading && alertas.length === 0 && (
            <p className="px-4 py-8 text-center text-sm text-muted-foreground">
              Nenhum alerta. A operação está em dia.
            </p>
          )}

          {alertas.map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => navigate(a.url)}
              className="flex w-full items-start gap-3 border-b border-border px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-secondary/60"
            >
              <a.icon
                className="mt-0.5 h-[18px] w-[18px] shrink-0"
                style={{ color: `hsl(${CORES[a.nivel]})` }}
              />
              <span className="flex min-w-0 flex-col gap-0.5">
                <span className="text-sm font-semibold leading-snug text-foreground">
                  {a.titulo}
                </span>
                <span className="text-xs leading-snug text-muted-foreground">{a.detalhe}</span>
              </span>
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => navigate("/rede")}
          className="w-full border-t border-border px-4 py-3 text-center text-sm font-semibold text-foreground transition-colors hover:bg-secondary/60"
        >
          Abrir a Rede de Parceiros
        </button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
