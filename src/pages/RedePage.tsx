import { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Users,
  CalendarCheck,
  Handshake,
  Lock,
  Target,
  UserCheck,
  AlertTriangle,
  DollarSign,
  Calendar,
} from "lucide-react";
import { DashboardLayout } from "../components/DashboardLayout";
import { StatCard } from "../components/dashboard/StatCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { useChartTheme } from "../hooks/use-chart-theme";
import {
  useRedeMetrics,
  PERIODOS,
  type CorretorLinha,
  type Situacao,
} from "../hooks/use-rede-metrics";

const ROTULO: Record<Situacao, string> = {
  ativo: "Ativo",
  esfriando: "Esfriando",
  parado: "Parado",
  nunca_produziu: "Nunca produziu",
};
const CLASSE: Record<Situacao, string> = {
  ativo: "rede-ativo",
  esfriando: "rede-esfriando",
  parado: "rede-parado",
  nunca_produziu: "rede-nunca",
};
const ORDEM: Record<Situacao, number> = {
  ativo: 0,
  esfriando: 1,
  parado: 2,
  nunca_produziu: 3,
};

const nf = (v: number | null | undefined) => (v ?? 0).toLocaleString("pt-BR");
const pct = (v: number | null | undefined) =>
  v == null ? "—" : `${v.toLocaleString("pt-BR")}%`;
const brl = (v: number | null | undefined) => {
  if (v == null) return "—";
  if (v >= 1_000_000) return `${(v / 1_000_000).toLocaleString("pt-BR", { maximumFractionDigits: 1 })}M`;
  return v.toLocaleString("pt-BR", { maximumFractionDigits: 0 });
};
const dataHora = (s: string) =>
  new Date(s).toLocaleString("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
const horasAte = (s: string) => Math.round((new Date(s).getTime() - Date.now()) / 36e5);

function Chip({ situacao }: { situacao: Situacao }) {
  return (
    <span className={`rede-chip ${CLASSE[situacao]}`}>
      <i />
      {ROTULO[situacao]}
    </span>
  );
}

function CardAcao({
  titulo,
  itens,
  vazio,
  tom,
}: {
  titulo: string;
  itens: Array<{ esq: string; dir: string }>;
  vazio: string;
  tom?: "critico" | "atencao";
}) {
  const cor =
    tom === "critico"
      ? "hsl(var(--rede-parado))"
      : tom === "atencao"
        ? "hsl(var(--rede-esfriando))"
        : "hsl(var(--muted-foreground))";
  return (
    <div className="chart-card p-0 overflow-hidden flex flex-col">
      <div className="flex items-baseline justify-between gap-3 px-4 py-2.5 border-b border-border bg-secondary/40">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {titulo}
        </span>
        <span className="text-lg font-bold tabular-nums" style={{ color: itens.length ? cor : undefined }}>
          {itens.length}
        </span>
      </div>
      {itens.length === 0 ? (
        <p className="px-4 py-3.5 text-[13px] italic text-muted-foreground">{vazio}</p>
      ) : (
        <ul className="flex-1 py-1">
          {itens.map(({ esq, dir }, i) => (
            <li
              key={i}
              className="flex items-baseline justify-between gap-3 px-4 py-2 text-[13px] border-b border-border/50 last:border-0"
            >
              <span className="text-foreground truncate">{esq}</span>
              <span className="shrink-0 tabular-nums text-xs text-muted-foreground">{dir}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function RedePage() {
  const [dias, setDias] = useState(30);
  const { data, isLoading, error } = useRedeMetrics(dias);
  const chart = useChartTheme();

  const r = data?.resumo;
  const corretores: CorretorLinha[] = [...(data?.corretores ?? [])].sort(
    (a, b) => ORDEM[a.situacao] - ORDEM[b.situacao] || b.acoes - a.acoes,
  );
  const parados = corretores.filter(
    (c) => c.situacao === "parado" || c.situacao === "nunca_produziu",
  );

  const pulso = (data?.pulso ?? []).map((p) => ({
    ...p,
    rotulo: new Date(`${p.dia}T12:00:00`).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
    }),
  }));

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 sm:mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Rede de Parceiros</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Atividade dos corretores parceiros no canal da incorporadora
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
          <Select value={String(dias)} onValueChange={(v) => setDias(Number(v))}>
            <SelectTrigger className="w-[120px] h-8 sm:h-9 text-xs sm:text-sm border-border text-muted-foreground">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PERIODOS.map((p) => (
                <SelectItem key={p.valor} value={String(p.valor)}>
                  {p.rotulo}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {error && (
        <div className="chart-card mb-6 border-destructive/40">
          <h3 className="text-sm font-semibold text-foreground mb-1">
            Não consegui ler os dados da rede
          </h3>
          <p className="text-[13px] text-muted-foreground">
            {(error as Error).message}. Confirme que os arquivos{" "}
            <code className="text-xs">pipa-piloto-schema.sql</code>,{" "}
            <code className="text-xs">pipa-painel-estrutura.sql</code> e{" "}
            <code className="text-xs">pipa-painel-v2.sql</code> rodaram neste projeto do Supabase.
          </p>
        </div>
      )}

      {/* Big numbers */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-3 sm:mb-4">
        <StatCard
          title="Corretores ativos"
          value={isLoading ? "—" : `${nf(r?.ativos)} / ${nf(r?.rede_total)}`}
          change={0}
          icon={Users}
          delay={0}
          loading={isLoading}
        />
        <StatCard
          title="Leads abertos"
          value={isLoading ? "—" : nf(r?.leads_abertos)}
          change={0}
          icon={Handshake}
          delay={0.05}
          loading={isLoading}
        />
        <StatCard
          title="Visitas agendadas"
          value={isLoading ? "—" : nf(r?.visitas_agendadas)}
          change={0}
          icon={CalendarCheck}
          delay={0.1}
          loading={isLoading}
        />
        <StatCard
          title="Reservas ativas"
          value={isLoading ? "—" : nf(r?.reservas_ativas)}
          change={0}
          icon={Lock}
          delay={0.15}
          loading={isLoading}
        />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <StatCard
          title="Taxa de comparecimento"
          value={isLoading ? "—" : pct(r?.taxa_comparecimento)}
          change={0}
          icon={UserCheck}
          delay={0.2}
          loading={isLoading}
        />
        <StatCard
          title="Taxa de conversão"
          value={isLoading ? "—" : pct(r?.taxa_conversao)}
          change={0}
          icon={Target}
          delay={0.25}
          loading={isLoading}
        />
        <StatCard
          title="Exceções pendentes"
          value={isLoading ? "—" : nf(r?.excecoes_pendentes)}
          change={0}
          icon={AlertTriangle}
          delay={0.3}
          loading={isLoading}
        />
        <StatCard
          title="VGV da rede"
          value={isLoading ? "—" : brl(r?.vgv)}
          change={0}
          icon={DollarSign}
          prefix="R$ "
          delay={0.35}
          loading={isLoading}
        />
      </div>

      {/* Ações de hoje */}
      <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
        Precisa de uma ligação hoje
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <CardAcao
          titulo="Exceção com SLA estourado"
          tom="critico"
          vazio="nenhuma pendente"
          itens={(data?.excecoes ?? [])
            .filter((x) => new Date(x.sla_ate) < new Date())
            .map((x) => ({
              esq: `${x.corretor?.nome ?? "—"} · ${x.percentual_pedido ?? "?"}% no ${x.unidade?.identificador ?? "?"}`,
              dir: `há ${Math.abs(horasAte(x.solicitada_em))}h`,
            }))}
        />
        <CardAcao
          titulo="Vendendo com tabela velha"
          tom="atencao"
          vazio="rede toda na versão vigente"
          itens={(data?.defasada ?? []).map((t) => ({
            esq: t.nome ?? "—",
            dir: `${t.versao_em_maos ?? "?"} → ${t.versao_vigente ?? "?"}`,
          }))}
        />
        <CardAcao
          titulo="Parou de produzir"
          tom="atencao"
          vazio="ninguém parado"
          itens={parados.map((c) => ({
            esq: `${c.nome ?? "—"}${c.imobiliaria ? ` · ${c.imobiliaria}` : ""}`,
            dir: c.dias_parado == null ? "nunca" : `${c.dias_parado}d`,
          }))}
        />
        <CardAcao
          titulo="Reserva a vencer"
          vazio="nenhuma nas próximas 48h"
          itens={(data?.reservas ?? []).map((v) => ({
            esq: `${v.unidade?.identificador ?? "?"}${v.unidade?.bloco ? ` bl. ${v.unidade.bloco}` : ""} · ${v.corretor?.nome ?? "—"}`,
            dir: `${horasAte(v.expira_em)}h`,
          }))}
        />
      </div>

      {/* Pulso diário */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="chart-card mb-6"
      >
        <h3 className="text-sm font-semibold text-foreground mb-1 uppercase tracking-wider">
          Pulso da rede
        </h3>
        <p className="text-xs text-muted-foreground mb-4">
          Ações registradas por dia no período selecionado
        </p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={pulso} margin={{ top: 4, right: 8, left: -18, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={chart.gridColor} vertical={false} />
            <XAxis
              dataKey="rotulo"
              stroke={chart.tickColor}
              fontSize={11}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
              minTickGap={24}
            />
            <YAxis stroke={chart.tickColor} fontSize={11} tickLine={false} axisLine={false} />
            <Tooltip
              cursor={{ fill: "hsl(var(--muted) / 0.4)" }}
              contentStyle={chart.tooltipStyle}
              formatter={(v: number, n: string) => [
                nf(v),
                n === "acoes" ? "ações" : n === "corretores" ? "corretores" : "visitas",
              ]}
            />
            <Bar dataKey="acoes" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} maxBarSize={26} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Tabela de corretores */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.28 }}
        className="chart-card p-0 overflow-hidden mb-6"
      >
        <div className="px-5 py-4 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
            Corretores
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Ordenado por situação, depois por atividade no período
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] border-collapse">
            <thead>
              <tr className="bg-secondary/40">
                {[
                  ["Corretor", "left"],
                  ["Situação", "left"],
                  ["Parado", "right"],
                  ["Ações", "right"],
                  ["Leads", "right"],
                  ["Visitas ag.", "right"],
                  ["Realizadas", "right"],
                  ["Comparecim.", "right"],
                  ["Conversão", "right"],
                  ["Reservas", "right"],
                  ["Vendas", "right"],
                ].map(([t, al]) => (
                  <th
                    key={t}
                    className={`px-3 py-2.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground whitespace-nowrap ${
                      al === "left" ? "text-left" : "text-right"
                    }`}
                  >
                    {t}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {corretores.length === 0 && !isLoading && (
                <tr>
                  <td colSpan={11} className="px-5 py-8 text-center text-sm text-muted-foreground">
                    Nenhum corretor credenciado ainda.
                  </td>
                </tr>
              )}
              {corretores.map((c) => (
                <tr key={c.corretor_id} className="border-b border-border/50 last:border-0 hover:bg-secondary/30">
                  <td className="px-3 py-2.5">
                    <span className="block text-[13px] font-semibold text-foreground">
                      {c.nome ?? "—"}
                    </span>
                    <span className="block text-[11px] text-muted-foreground">
                      {c.imobiliaria ?? ""}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <Chip situacao={c.situacao} />
                  </td>
                  <td
                    className={`px-3 py-2.5 text-right text-[13px] tabular-nums ${
                      (c.dias_parado ?? 0) > 14 ? "font-semibold" : "text-muted-foreground"
                    }`}
                    style={(c.dias_parado ?? 0) > 14 ? { color: "hsl(var(--rede-parado))" } : undefined}
                  >
                    {c.dias_parado == null ? "—" : `${c.dias_parado}d`}
                  </td>
                  {[c.acoes, c.leads_abertos, c.visitas_agendadas, c.visitas_realizadas].map((v, i) => (
                    <td
                      key={i}
                      className={`px-3 py-2.5 text-right text-[13px] tabular-nums ${
                        Number(v) === 0 ? "text-muted-foreground/50" : "text-foreground"
                      }`}
                    >
                      {nf(Number(v))}
                    </td>
                  ))}
                  <td className="px-3 py-2.5 text-right text-[13px] tabular-nums text-foreground">
                    {pct(c.taxa_comparecimento)}
                  </td>
                  <td className="px-3 py-2.5 text-right text-[13px] tabular-nums text-foreground">
                    {pct(c.taxa_conversao)}
                  </td>
                  {[c.reservas_ativas, c.vendas].map((v, i) => (
                    <td
                      key={i}
                      className={`px-3 py-2.5 text-right text-[13px] tabular-nums ${
                        Number(v) === 0 ? "text-muted-foreground/50" : "text-foreground"
                      }`}
                    >
                      {nf(Number(v))}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Agenda do plantão */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.34 }}
        className="chart-card p-0 overflow-hidden"
      >
        <div className="px-5 py-4 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
            Agenda do plantão
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">Próximos 7 dias</p>
        </div>
        {(data?.agenda ?? []).length === 0 ? (
          <p className="px-5 py-6 text-[13px] italic text-muted-foreground">
            Nenhuma visita agendada para os próximos 7 dias.
          </p>
        ) : (
          <ul>
            {(data?.agenda ?? []).map((a) => (
              <li
                key={a.oportunidade_id}
                className="flex flex-wrap items-baseline justify-between gap-2 px-5 py-3 border-b border-border/50 last:border-0"
              >
                <span className="text-[13px] text-muted-foreground">
                  <strong className="text-foreground font-semibold">{a.cliente ?? "sem nome"}</strong>
                  {` · ${a.corretor ?? "—"}`}
                  {a.unidade_reservada ? ` · un. ${a.unidade_reservada}` : ""}
                </span>
                <span className="text-xs tabular-nums text-muted-foreground">
                  {dataHora(a.visita_agendada_para)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </motion.div>
    </DashboardLayout>
  );
}
