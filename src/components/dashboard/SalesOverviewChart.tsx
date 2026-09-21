import { motion } from "framer-motion";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { format, parseISO } from "date-fns";
import { useRedeMetrics } from "../../hooks/use-rede-metrics";
import { useChartTheme } from "../../hooks/use-chart-theme";

/**
 * Pulso da operação — de fn_painel_pulso.
 *
 * Antes era "Visão de Vendas", uma série mensal fixa no código. Não existe
 * série temporal de vendas no banco hoje; o que existe é o pulso diário
 * (ações da rede e visitas). O widget passou a mostrar o que é real, com
 * o nome do que realmente é.
 */
export function SalesOverviewChart({ dias }: { dias: number }) {
  const { data, isLoading } = useRedeMetrics(dias);
  const { gridColor, tickColor, tooltipBg, tooltipBorder, tooltipColor } = useChartTheme();

  const serie = (data?.pulso ?? []).map((p) => ({
    dia: p.dia,
    rotulo: format(parseISO(p.dia), "dd/MM"),
    acoes: p.acoes,
    visitas: p.visitas,
  }));

  const totalAcoes = serie.reduce((s, p) => s + p.acoes, 0);
  const totalVisitas = serie.reduce((s, p) => s + p.visitas, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="chart-card col-span-2"
    >
      <div className="flex items-baseline justify-between mb-4 gap-3">
        <div className="flex flex-col gap-1">
          <span className="text-sm font-semibold text-foreground">Pulso da operação</span>
          <span className="text-xs text-muted-foreground">
            Ações da rede e visitas, dia a dia
          </span>
        </div>
        <div className="flex gap-4">
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="h-2.5 w-2.5 rounded-sm" style={{ background: "hsl(var(--primary))" }} />
            {totalAcoes.toLocaleString("pt-BR")} ações
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="h-2.5 w-2.5 rounded-sm" style={{ background: "hsl(var(--foreground))" }} />
            {totalVisitas.toLocaleString("pt-BR")} visitas
          </span>
        </div>
      </div>

      {isLoading ? (
        <div className="h-[220px] rounded-md bg-muted animate-pulse" />
      ) : serie.length === 0 ? (
        <p className="py-16 text-center text-sm text-muted-foreground">
          Sem atividade registrada neste período.
        </p>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={serie} margin={{ top: 4, right: 4, left: -18, bottom: 0 }}>
            <defs>
              <linearGradient id="gradAcoes" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.28} />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis
              dataKey="rotulo"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: tickColor }}
              minTickGap={24}
            />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: tickColor }} />
            <Tooltip
              contentStyle={{
                background: tooltipBg,
                border: `1px solid ${tooltipBorder}`,
                borderRadius: "8px",
                fontSize: "12px",
                color: tooltipColor,
              }}
              labelStyle={{ color: tooltipColor }}
              formatter={(v: number, n: string) => [
                v.toLocaleString("pt-BR"),
                n === "acoes" ? "Ações" : "Visitas",
              ]}
            />
            <Area
              type="monotone"
              dataKey="acoes"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              fill="url(#gradAcoes)"
            />
            <Area
              type="monotone"
              dataKey="visitas"
              stroke="hsl(var(--foreground))"
              strokeWidth={2}
              fill="none"
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </motion.div>
  );
}
