import { motion } from "framer-motion";
import { useDashboardMetrics } from "../../hooks/use-dashboard-metrics";

/**
 * Receita por origem — de fn_visao_geral.
 *
 * O widget antigo listava cinco canais (Site, Orgânico, Indicação…) com
 * números fixos. A função só separa duas origens, mídia paga e rede de
 * parceiros, então é isso que a tela mostra. Inventar os outros três
 * canais seria repetir o problema que estamos corrigindo.
 */
function moeda(v: number): string {
  if (v >= 1_000_000) return `R$ ${(v / 1_000_000).toLocaleString("pt-BR", { maximumFractionDigits: 1 })}M`;
  if (v >= 1_000) return `R$ ${(v / 1_000).toLocaleString("pt-BR", { maximumFractionDigits: 0 })}k`;
  return `R$ ${v.toLocaleString("pt-BR")}`;
}

export function SalesByChannel({ dias }: { dias: number }) {
  const { data: m, isLoading } = useDashboardMetrics(dias);

  const midia = m?.receita_midia ?? 0;
  const rede = m?.receita_rede ?? 0;
  const total = midia + rede;

  const origens = [
    {
      nome: "Mídia paga",
      receita: midia,
      leads: m?.leads_midia ?? 0,
      cor: "hsl(var(--foreground))",
    },
    {
      nome: "Rede de parceiros",
      receita: rede,
      leads: m?.leads_rede ?? 0,
      cor: "hsl(var(--primary))",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="chart-card flex flex-col"
    >
      <div className="flex items-baseline justify-between mb-5 gap-3">
        <span className="text-sm font-semibold text-foreground">Receita por origem</span>
        <span className="metric-label">no período</span>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-4">
          <div className="h-16 rounded-md bg-muted animate-pulse" />
          <div className="h-16 rounded-md bg-muted animate-pulse" />
        </div>
      ) : total === 0 ? (
        <p className="text-sm text-muted-foreground py-8 text-center">
          Sem receita registrada neste período.
        </p>
      ) : (
        <div className="flex flex-col gap-5">
          {origens.map((o, i) => {
            const pct = (o.receita / total) * 100;
            return (
              <div key={o.nome} className="flex flex-col gap-2">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="inline-flex items-center gap-2 text-sm text-foreground">
                    <span className="h-2.5 w-2.5 rounded-sm" style={{ background: o.cor }} />
                    {o.nome}
                  </span>
                  <span className="font-mono text-sm font-semibold text-foreground">
                    {moeda(o.receita)}
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: o.cor }}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.7, delay: 0.1 * i, ease: "easeOut" }}
                  />
                </div>
                <div className="flex justify-between font-mono text-[11px] text-muted-foreground">
                  <span>{o.leads.toLocaleString("pt-BR")} leads</span>
                  <span>{pct.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}% da receita</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-auto pt-4 border-t border-border flex items-center justify-between gap-3">
        <span className="text-xs text-muted-foreground">Receita total</span>
        <span className="font-mono text-sm font-semibold text-foreground">
          {isLoading ? "—" : moeda(m?.receita ?? total)}
        </span>
      </div>
    </motion.div>
  );
}
