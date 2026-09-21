import { useState } from "react";
import { DashboardLayout } from "../components/DashboardLayout";
import { StatCard } from "../components/dashboard/StatCard";
import { SalesOverviewChart } from "../components/dashboard/SalesOverviewChart";
import { TotalSubscriberChart } from "../components/dashboard/TotalSubscriberChart";
import { FunnelOverview } from "../components/dashboard/FunnelOverview";
import { SalesByChannel } from "../components/dashboard/SalesByChannel";
import { VGVProgress } from "../components/dashboard/VGVProgress";
import { BudgetComparison } from "../components/dashboard/BudgetComparison";
import { useDashboardMetrics, PERIODOS } from "../hooks/use-dashboard-metrics";
import { baixarCSV, carimboDeData } from "../lib/exportar-csv";
import { Users, ShoppingCart, DollarSign, Target, Calendar, Download,
         TrendingUp, Banknote, Eye, PiggyBank } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

function formatNumber(n: number): string {
  return n.toLocaleString("pt-BR");
}

function formatCurrency(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toLocaleString("pt-BR", { maximumFractionDigits: 1 })}M`;
  if (n >= 1_000) return formatNumber(n);
  return n.toLocaleString("pt-BR");
}

const Index = () => {
  const [dias, setDias] = useState(30);
  const { data: m, isLoading } = useDashboardMetrics(dias);

  // Unit economics saem de divisões sobre o que fn_visao_geral já devolve.
  // Sem investimento no período não há custo a calcular: mostra "—" em vez
  // de zero, que leria como "custo zero".
  const ue = (() => {
    const vazio = { cac: "—", cpl: "—", custoVisita: "—", roi: "—", midiaReceita: "—" };
    if (!m) return vazio;
    const inv = m.investimento ?? 0;
    const vendas = m.vendas ?? 0;
    const leads = m.leads ?? 0;
    const visitas = m.visitas_realizadas ?? 0;
    const receita = m.receita ?? 0;
    const brl = (v: number) =>
      `R$ ${v.toLocaleString("pt-BR", { maximumFractionDigits: 0 })}`;
    return {
      cac: inv > 0 && vendas > 0 ? brl(inv / vendas) : "—",
      cpl: inv > 0 && leads > 0 ? brl(inv / leads) : "—",
      custoVisita: inv > 0 && visitas > 0 ? brl(inv / visitas) : "—",
      roi:
        inv > 0 && receita > 0
          ? `${(receita / inv).toLocaleString("pt-BR", { maximumFractionDigits: 1 })}×`
          : "—",
      midiaReceita:
        inv > 0 && receita > 0
          ? `${((inv / receita) * 100).toLocaleString("pt-BR", { maximumFractionDigits: 1 })}%`
          : "—",
    };
  })();

  // Exporta só o que vem do banco. Os widgets marcados como exemplo ficam
  // de fora de propósito: número inventado não entra em planilha, que é
  // justamente onde ele deixa de parecer inventado.
  const exportar = () => {
    if (!m) return;
    const rotulo = PERIODOS.find((p) => p.valor === dias)?.rotulo ?? `${dias} dias`;
    baixarCSV(`pipadriven-visao-geral-${carimboDeData()}.csv`, [
      ["PIPADriven — Visão Geral"],
      ["Período", rotulo],
      ["Gerado em", new Date().toLocaleString("pt-BR")],
      [],
      ["Métrica", "Valor", "Variação vs. período anterior (%)"],
      ["Leads recebidos", m.leads, m.var_leads ?? ""],
      ["Vendas realizadas", m.vendas, m.var_vendas ?? ""],
      ["Receita total (R$)", m.receita ?? "", m.var_receita ?? ""],
      ["Investimento (R$)", m.investimento ?? "", ""],
      ["Visitas agendadas", m.visitas_agendadas, ""],
      ["Visitas realizadas", m.visitas_realizadas, ""],
      ["Conversão lead → venda (%)", m.conversao_contato_venda ?? "", ""],
      ["Conversão visita → venda (%)", m.conversao_visita_venda ?? "", ""],
      [],
      ["Origem", "Leads", "Receita (R$)"],
      ["Mídia paga", m.leads_midia, m.receita_midia ?? ""],
      ["Rede de parceiros", m.leads_rede, m.receita_rede ?? ""],
    ]);
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">Visão Geral</h1>
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
          <Select value={String(dias)} onValueChange={(v) => setDias(Number(v))}>
            <SelectTrigger className="w-[110px] h-8 sm:h-9 text-xs sm:text-sm border-border text-muted-foreground">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PERIODOS.map((p) => (
                <SelectItem key={p.valor} value={String(p.valor)}>{p.rotulo}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <button
            type="button"
            onClick={exportar}
            disabled={isLoading || !m}
            title="Baixar as métricas do período em CSV"
            className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg border border-border hover:bg-secondary transition-colors text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Exportar</span>
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <StatCard
          title="Leads Recebidos"
          value={isLoading ? "—" : formatNumber(m?.leads ?? 0)}
          change={m?.var_leads ?? 0}
          icon={Users}
          delay={0}
          loading={isLoading}
        />
        <StatCard
          title="Vendas Realizadas"
          value={isLoading ? "—" : formatNumber(m?.vendas ?? 0)}
          change={m?.var_vendas ?? 0}
          icon={ShoppingCart}
          delay={0.05}
          loading={isLoading}
        />
        <StatCard
          title="Receita Total"
          value={isLoading ? "—" : formatCurrency(m?.receita ?? 0)}
          change={m?.var_receita ?? 0}
          icon={DollarSign}
          prefix="R$ "
          delay={0.1}
          loading={isLoading}
        />
        {/* o denominador entra no rótulo: em Vendas e na Rede
            "conversão" quer dizer outra conta */}
        <StatCard
          title="Conversão Lead→Venda"
          value={isLoading ? "—" : m?.conversao_contato_venda != null
            ? `${m.conversao_contato_venda.toLocaleString("pt-BR")}%` : "—"}
          change={0}
          icon={Target}
          delay={0.15}
          loading={isLoading}
        />
      </div>

      {/* de onde vieram os leads: as duas entradas do mesmo funil */}
      {!isLoading && (m?.leads ?? 0) > 0 && (
        <div className="chart-card mb-4 sm:mb-6">
          <div className="flex items-baseline justify-between gap-3 mb-3">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
              Origem dos leads
            </h3>
            <span className="text-xs text-muted-foreground">
              mídia paga vs. rede de parceiros
            </span>
          </div>
          <div className="flex h-3 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-primary"
              style={{ width: `${((m?.leads_midia ?? 0) / (m?.leads || 1)) * 100}%` }}
            />
            <div
              className="h-full"
              style={{
                width: `${((m?.leads_rede ?? 0) / (m?.leads || 1)) * 100}%`,
                background: "hsl(var(--rede-ativo))",
              }}
            />
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-1 mt-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <i className="h-2 w-2 rounded-full bg-primary" />
              Mídia paga · {formatNumber(m?.leads_midia ?? 0)}
            </span>
            <span className="inline-flex items-center gap-2">
              <i className="h-2 w-2 rounded-full" style={{ background: "hsl(var(--rede-ativo))" }} />
              Rede de parceiros · {formatNumber(m?.leads_rede ?? 0)}
            </span>
          </div>
        </div>
      )}

      {/* Funnel + Sales by Channel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <FunnelOverview dias={dias} />
        <SalesByChannel dias={dias} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <SalesOverviewChart dias={dias} />
        <TotalSubscriberChart dias={dias} />
      </div>

      {/* Unit Economics */}
      <div className="mb-2">
        <h2 className="flex items-baseline gap-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 sm:mb-4">
          Unit Economics
          <span className="metric-label !text-[10px] normal-case tracking-normal">
            derivado de investimento, leads, visitas e receita do período
          </span>
        </h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <StatCard
          title="CAC"
          value={isLoading ? "—" : ue.cac}
          change={0}
          icon={Banknote}
          delay={0.4}
          loading={isLoading}
        />
        <StatCard
          title="CPL"
          value={isLoading ? "—" : ue.cpl}
          change={0}
          icon={Target}
          delay={0.45}
          loading={isLoading}
        />
        <StatCard
          title="Custo por visita"
          value={isLoading ? "—" : ue.custoVisita}
          change={0}
          icon={Eye}
          delay={0.5}
          loading={isLoading}
        />
        <StatCard
          title="ROI da mídia"
          value={isLoading ? "—" : ue.roi}
          change={0}
          icon={TrendingUp}
          delay={0.55}
          loading={isLoading}
        />
        <StatCard
          title="Mídia / receita"
          value={isLoading ? "—" : ue.midiaReceita}
          change={0}
          icon={PiggyBank}
          delay={0.6}
          loading={isLoading}
        />
      </div>

      {/* VGV + Orçado vs Realizado */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <VGVProgress />
        <BudgetComparison />
      </div>
    </DashboardLayout>
  );
};

export default Index;
