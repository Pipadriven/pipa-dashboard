import { motion } from "framer-motion";
import { useDashboardMetrics } from "../../hooks/use-dashboard-metrics";

/**
 * Comparecimento às visitas — de fn_visao_geral.
 *
 * Era "Total de Leads" com uma série semanal fixa. O banco devolve o total
 * de leads do período (já no KPI do topo) mas não a série. O que ele
 * devolve e ninguém estava mostrando é a relação entre visita agendada e
 * realizada — a etapa onde o funil mais perde.
 */
export function TotalSubscriberChart({ dias }: { dias: number }) {
  const { data: m, isLoading } = useDashboardMetrics(dias);

  const agendadas = m?.visitas_agendadas ?? 0;
  const realizadas = m?.visitas_realizadas ?? 0;
  const faltas = Math.max(agendadas - realizadas, 0);
  const taxa = agendadas > 0 ? (realizadas / agendadas) * 100 : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.35 }}
      className="chart-card flex flex-col"
    >
      <div className="flex items-baseline justify-between mb-4 gap-3">
        <span className="text-sm font-semibold text-foreground">Comparecimento</span>
        <span className="metric-label">no período</span>
      </div>

      {isLoading ? (
        <div className="h-[180px] rounded-md bg-muted animate-pulse" />
      ) : agendadas === 0 ? (
        <p className="py-12 text-center text-sm text-muted-foreground">
          Nenhuma visita agendada neste período.
        </p>
      ) : (
        <div className="flex flex-col gap-5">
          <div className="flex items-baseline gap-2">
            <span className="metric-value text-[38px]">
              {taxa!.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}%
            </span>
            <span className="text-sm text-muted-foreground">compareceram</span>
          </div>

          <div className="flex h-3 w-full overflow-hidden rounded-full bg-muted">
            <motion.div
              className="h-full"
              style={{ background: "hsl(var(--primary))" }}
              initial={{ width: 0 }}
              animate={{ width: `${taxa}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>

          <dl className="m-0 flex flex-col divide-y divide-border">
            <div className="flex items-baseline justify-between gap-3 py-2">
              <dt className="text-xs text-muted-foreground">Agendadas</dt>
              <dd className="m-0 font-mono text-sm font-semibold text-foreground">
                {agendadas.toLocaleString("pt-BR")}
              </dd>
            </div>
            <div className="flex items-baseline justify-between gap-3 py-2">
              <dt className="text-xs text-muted-foreground">Realizadas</dt>
              <dd className="m-0 font-mono text-sm font-semibold text-foreground">
                {realizadas.toLocaleString("pt-BR")}
              </dd>
            </div>
            <div className="flex items-baseline justify-between gap-3 py-2">
              <dt className="text-xs text-muted-foreground">Não compareceram</dt>
              <dd className="m-0 font-mono text-sm font-semibold text-foreground">
                {faltas.toLocaleString("pt-BR")}
              </dd>
            </div>
          </dl>
        </div>
      )}

      <div className="mt-auto pt-4 border-t border-border flex items-center justify-between gap-3">
        <span className="text-xs text-muted-foreground">Visita → venda</span>
        <span className="font-mono text-sm font-semibold text-foreground">
          {m?.conversao_visita_venda != null
            ? `${m.conversao_visita_venda.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}%`
            : "—"}
        </span>
      </div>
    </motion.div>
  );
}
