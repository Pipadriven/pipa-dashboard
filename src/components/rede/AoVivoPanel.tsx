import { useEffect, useState } from "react";
import { formatDistanceToNowStrict } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useAoVivo, type EventoAoVivo } from "../../hooks/use-aovivo";

type Tom = "sinal" | "alerta" | "neutro";

interface Linha {
  rotulo: string;
  tom: Tom;
  texto: string;
}

/** Quem fez: o nome do corretor; sem ele, a PIPA (IA) ou o sistema. */
function quem(e: EventoAoVivo) {
  if (e.corretor) return e.corretor;
  return e.autor === "ia" ? "A PIPA" : "A rede";
}

function onde(e: EventoAoVivo) {
  const partes = [e.unidade ? `un. ${e.unidade}` : null, e.empreendimento].filter(Boolean);
  return partes.length ? ` · ${partes.join(" · ")}` : "";
}

/**
 * Cada tipo de evento do núcleo vira uma frase que o gerente lê em meio
 * segundo. O texto sai só de campos do banco (nome, unidade, empreendimento);
 * nada aqui é estimado ou inventado.
 */
function descrever(e: EventoAoVivo): Linha {
  const q = quem(e);
  switch (e.tipo) {
    case "unidade.reservada":
      return { rotulo: "Reserva", tom: "sinal", texto: `${q} reservou${onde(e)}` };
    case "reserva.expirada":
      return { rotulo: "Reserva", tom: "alerta", texto: `Reserva expirou${onde(e)}` };
    case "venda.confirmada":
      return { rotulo: "Venda", tom: "sinal", texto: `${q} confirmou uma venda${onde(e)}` };
    case "proposta.registrada":
      return { rotulo: "Proposta", tom: "sinal", texto: `${q} registrou uma proposta${onde(e)}` };
    case "perda.registrada":
      return { rotulo: "Perda", tom: "alerta", texto: `${q} registrou uma perda${onde(e)}` };
    case "visita.agendada":
      return { rotulo: "Visita", tom: "neutro", texto: `${q} agendou uma visita${onde(e)}` };
    case "visita.realizada":
      return { rotulo: "Visita", tom: "sinal", texto: `${q} realizou uma visita${onde(e)}` };
    case "excecao.solicitada":
      return { rotulo: "Exceção", tom: "alerta", texto: `${q} pediu uma exceção${onde(e)}` };
    case "excecao.decidida":
      return { rotulo: "Exceção", tom: "neutro", texto: `Exceção decidida para ${q}${onde(e)}` };
    case "simulacao.solicitada":
      return { rotulo: "Simulação", tom: "neutro", texto: `${q} simulou uma condição${onde(e)}` };
    case "tabela.consultada":
      return { rotulo: "Consulta", tom: "neutro", texto: `${q} consultou a tabela${onde(e)}` };
    case "disponibilidade.consultada":
      return { rotulo: "Consulta", tom: "neutro", texto: `${q} consultou a disponibilidade${onde(e)}` };
    case "material.solicitado":
      return { rotulo: "Material", tom: "neutro", texto: `${q} pediu material${onde(e)}` };
    case "objecao.registrada":
      return { rotulo: "Objeção", tom: "neutro", texto: `${q} registrou uma objeção${onde(e)}` };
    case "oportunidade.criada":
    case "lead.recebido":
      return { rotulo: "Lead", tom: "neutro", texto: `Lead novo${e.corretor ? ` com ${e.corretor}` : ""}${onde(e)}` };
    case "lead.qualificado":
      return { rotulo: "Lead", tom: "neutro", texto: `Lead qualificado${onde(e)}` };
    case "lead.roteado":
    case "lead.aceito":
      return { rotulo: "Lead", tom: "neutro", texto: `${q} recebeu um lead${onde(e)}` };
    case "lead.recusado":
      return { rotulo: "Lead", tom: "alerta", texto: `${q} recusou um lead${onde(e)}` };
    case "followup.enviado":
      return { rotulo: "Follow-up", tom: "neutro", texto: `Follow-up enviado${onde(e)}` };
    case "followup.respondido":
      return { rotulo: "Follow-up", tom: "sinal", texto: `Cliente respondeu ao follow-up${onde(e)}` };
    case "corretor.credenciado":
      return { rotulo: "Rede", tom: "neutro", texto: `${q} teve o credenciamento atualizado` };
    case "corretor.inativo":
      return { rotulo: "Rede", tom: "alerta", texto: `${q} ficou inativo` };
    case "posse.conflito":
      return { rotulo: "Posse", tom: "alerta", texto: `Conflito de posse de cliente${onde(e)}` };
    case "posse.resolvida":
      return { rotulo: "Posse", tom: "neutro", texto: `Conflito de posse resolvido${onde(e)}` };
    default:
      return { rotulo: "Rede", tom: "neutro", texto: `${q} · ${e.tipo}` };
  }
}

const COR: Record<Tom, string> = {
  sinal: "hsl(var(--primary))",
  alerta: "hsl(var(--rede-parado))",
  neutro: "hsl(var(--muted-foreground))",
};

/** Re-renderiza a cada 30s só para os "há 2 min" não envelhecerem parados. */
function useAgora(ms = 30_000) {
  const [, setN] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setN((n) => n + 1), ms);
    return () => clearInterval(t);
  }, [ms]);
}

function quando(iso: string) {
  const seg = (Date.now() - new Date(iso).getTime()) / 1000;
  if (seg < 45) return "agora";
  return formatDistanceToNowStrict(new Date(iso), { locale: ptBR, addSuffix: true });
}

export function AoVivoPanel({ limite = 12 }: { limite?: number }) {
  const { data, isLoading, error, conectado } = useAoVivo(limite);
  useAgora();
  const eventos = data ?? [];

  return (
    <div className="chart-card p-0 overflow-hidden flex flex-col">
      <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-border">
        <div>
          <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
            Ao vivo
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            O que a rede está fazendo neste momento
          </p>
        </div>
        <span
          className="inline-flex items-center gap-1.5 metric-label"
          title={conectado ? "Recebendo eventos em tempo real" : "Atualiza a cada 1 minuto"}
        >
          <i
            className="h-1.5 w-1.5 rounded-full"
            style={{
              background: conectado ? "hsl(var(--rede-ativo))" : "hsl(var(--rede-nunca))",
              boxShadow: conectado ? "0 0 0 3px hsl(var(--rede-ativo) / 0.18)" : undefined,
            }}
          />
          {conectado ? "tempo real" : "1 min"}
        </span>
      </div>

      {error && (
        <p className="px-5 py-4 text-[13px] text-muted-foreground">
          Não consegui ler os eventos. Confirme que o arquivo{" "}
          <code className="text-xs">pipa-painel-aovivo.sql</code> rodou neste projeto do Supabase.
        </p>
      )}

      {!error && isLoading && (
        <ul className="py-1">
          {[0, 1, 2, 3].map((i) => (
            <li key={i} className="px-5 py-3 border-b border-border/50 last:border-0">
              <div className="h-3.5 w-3/4 rounded bg-muted animate-pulse" />
            </li>
          ))}
        </ul>
      )}

      {!error && !isLoading && eventos.length === 0 && (
        <p className="px-5 py-6 text-[13px] italic text-muted-foreground">
          Nenhuma atividade ainda. Quando um corretor consultar uma tabela, simular ou reservar,
          aparece aqui na hora.
        </p>
      )}

      {eventos.length > 0 && (
        <ul className="flex-1">
          {eventos.map((e) => {
            const l = descrever(e);
            return (
              <li
                key={e.id}
                className="grid grid-cols-[72px_minmax(0,1fr)_auto] items-baseline gap-3 px-5 py-2.5 border-b border-border/50 last:border-0"
              >
                <span
                  className="font-mono-data text-[10px] font-semibold uppercase"
                  style={{ color: COR[l.tom] }}
                >
                  {l.rotulo}
                </span>
                <span className="text-[13px] text-foreground truncate" title={l.texto}>
                  {l.texto}
                </span>
                <span className="shrink-0 tabular-nums text-xs text-muted-foreground">
                  {quando(e.ocorrida_em)}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
