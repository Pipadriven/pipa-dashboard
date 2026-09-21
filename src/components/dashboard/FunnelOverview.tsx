import { motion } from "framer-motion";
import { useDashboardMetrics } from "../../hooks/use-dashboard-metrics";

/**
 * Funil comercial — agora lendo de fn_visao_geral.
 *
 * As etapas são as quatro que a função de fato devolve. O funil antigo
 * mostrava "Contatos → Qualificados → Visitas → Propostas → Vendas" com
 * números fixos; "Qualificados" e "Propostas" não existem no banco hoje,
 * então saíram em vez de virar estimativa.
 */
export function FunnelOverview({ dias }: { dias: number }) {
  const { data: m, isLoading } = useDashboardMetrics(dias);

  const etapas = [
    { label: "Leads recebidos", valor: m?.leads ?? 0 },
    { label: "Visitas agendadas", valor: m?.visitas_agendadas ?? 0 },
    { label: "Visitas realizadas", valor: m?.visitas_realizadas ?? 0 },
    { label: "Vendas", valor: m?.vendas ?? 0 },
  ];

  const topo = etapas[0].valor || 1;
  const conversaoGeral = m?.conversao_contato_venda;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="chart-card col-span-2"
    >
      <div className="flex items-baseline justify-between mb-4 gap-3">
        <span className="text-sm font-semibold text-foreground">Funil comercial</span>
        <span className="metric-label">no período</span>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {etapas.map((_, i) => (
            <div key={i} className="h-10 rounded-md bg-muted animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {etapas.map((etapa, i) => {
            const anterior = i > 0 ? etapas[i - 1].valor : null;
            const taxa = anterior && anterior > 0 ? (etapa.valor / anterior) * 100 : null;
            const largura = `${Math.max((etapa.valor / topo) * 100, etapa.valor > 0 ? 2 : 0)}%`;
            const ultima = i === etapas.length - 1;

            return (
              <div key={etapa.label}>
                <div className="flex items-center justify-between mb-1 gap-3">
                  <span className="text-xs font-medium text-muted-foreground">{etapa.label}</span>
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-sm font-semibold text-foreground">
                      {etapa.valor.toLocaleString("pt-BR")}
                    </span>
                    {taxa !== null && (
                      <span className="font-mono text-[10px] text-muted-foreground">
                        {taxa.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}%
                      </span>
                    )}
                  </div>
                </div>
                <div className="h-6 w-full rounded-md bg-muted overflow-hidden">
                  <motion.div
                    className="h-full rounded-md"
                    style={{
                      background: ultima
                        ? "hsl(var(--primary))"
                        : `hsl(var(--foreground) / ${1 - i * 0.22})`,
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: largura }}
                    transition={{ duration: 0.7, delay: 0.1 * i, ease: "easeOut" }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-4 pt-3 border-t border-border flex items-center justify-between gap-3">
        <span className="text-xs text-muted-foreground">Conversão lead → venda</span>
        <span className="font-mono text-sm font-semibold text-foreground">
          {conversaoGeral != null
            ? `${conversaoGeral.toLocaleString("pt-BR", { maximumFractionDigits: 2 })}%`
            : "—"}
        </span>
      </div>
    </motion.div>
  );
}
