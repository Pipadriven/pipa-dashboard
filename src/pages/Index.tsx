import { useState } from "react";
import { DashboardLayout } from "../components/DashboardLayout";
import { StatCard } from "../components/dashboard/StatCard";
import { SalesOverviewChart } from "../components/dashboard/SalesOverviewChart";
import { TotalSubscriberChart } from "../components/dashboard/TotalSubscriberChart";
import { FunnelOverview } from "../components/dashboard/FunnelOverview";
import { SalesByChannel } from "../components/dashboard/SalesByChannel";
import { VGVProgress } from "../components/dashboard/VGVProgress";
import { BudgetComparison } from "../components/dashboard/BudgetComparison";
import { useDashboardMetrics, PeriodType } from "../hooks/use-dashboard-metrics";
import { useAuth } from "../contexts/AuthContext";
import { Users, ShoppingCart, DollarSign, Target, Calendar, Filter, Download, ChevronDown, TrendingUp, Banknote, Eye, Building2, PiggyBank } from "lucide-react";
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

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

const Index = () => {
  const { clientId } = useAuth();
  const [periodType, setPeriodType] = useState<PeriodType>("mensal");
  const [referenceDate, setReferenceDate] = useState(todayISO());

  const { data: metrics, isLoading } = useDashboardMetrics({ periodType, referenceDate });

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">Visão Geral</h1>
        
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
            <input
              type="date"
              value={referenceDate}
              onChange={(e) => setReferenceDate(e.target.value)}
              className="px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg border border-border hover:bg-secondary transition-colors text-muted-foreground bg-transparent"
            />
          </div>
          <Select value={periodType} onValueChange={(v) => setPeriodType(v as PeriodType)}>
            <SelectTrigger className="w-[110px] h-8 sm:h-9 text-xs sm:text-sm border-border text-muted-foreground">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="diario">Diário</SelectItem>
              <SelectItem value="semanal">Semanal</SelectItem>
              <SelectItem value="mensal">Mensal</SelectItem>
            </SelectContent>
          </Select>
          <button className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg border border-border hover:bg-secondary transition-colors text-muted-foreground">
            <Filter className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Filtrar</span>
          </button>
          <button className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg border border-border hover:bg-secondary transition-colors text-muted-foreground">
            <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Exportar</span>
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <StatCard
          title="Contatos Totais"
          value={isLoading ? "—" : metrics ? formatNumber(metrics.contatos_totais) : "0"}
          change={0}
          icon={Users}
          delay={0}
          loading={isLoading}
        />
        <StatCard
          title="Vendas Realizadas"
          value={isLoading ? "—" : metrics ? formatNumber(metrics.vendas_realizadas) : "0"}
          change={0}
          icon={ShoppingCart}
          delay={0.05}
          loading={isLoading}
        />
        <StatCard
          title="Receita Total"
          value={isLoading ? "—" : metrics ? formatCurrency(metrics.receita_total) : "0"}
          change={0}
          icon={DollarSign}
          prefix="R$ "
          delay={0.1}
          loading={isLoading}
        />
        <StatCard
          title="Taxa de Conversão"
          value={isLoading ? "—" : metrics ? `${metrics.taxa_conversao.toLocaleString("pt-BR")}%` : "0%"}
          change={0}
          icon={Target}
          delay={0.15}
          loading={isLoading}
        />
      </div>

      {/* Funnel + Sales by Channel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <FunnelOverview />
        <SalesByChannel />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <SalesOverviewChart />
        <TotalSubscriberChart />
      </div>

      {/* Unit Economics */}
      <div className="mb-2">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 sm:mb-4">
          Unit Economics
        </h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <StatCard title="CAC" value="1.850" change={-12.3} icon={Banknote} prefix="R$ " delay={0.4} />
        <StatCard title="ROI PIPA" value="14,2x" change={22.5} icon={TrendingUp} delay={0.45} />
        <StatCard title="Custo por Visita" value="185" change={-8.7} icon={Eye} prefix="R$ " delay={0.5} />
        <StatCard title="VGV Total" value="103M" change={0} icon={Building2} prefix="R$ " delay={0.55} />
        <StatCard title="Mídia / Receita" value="8,4%" change={-5.1} icon={PiggyBank} delay={0.6} />
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
