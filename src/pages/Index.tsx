import { DashboardLayout } from "../components/DashboardLayout";
import { StatCard } from "../components/dashboard/StatCard";
import { SalesOverviewChart } from "../components/dashboard/SalesOverviewChart";
import { TotalSubscriberChart } from "../components/dashboard/TotalSubscriberChart";
import { FunnelOverview } from "../components/dashboard/FunnelOverview";
import { SalesByChannel } from "../components/dashboard/SalesByChannel";
import { VGVProgress } from "../components/dashboard/VGVProgress";
import { BudgetComparison } from "../components/dashboard/BudgetComparison";
import { Users, ShoppingCart, DollarSign, Target, Calendar, Filter, Download, ChevronDown, TrendingUp, Banknote, Eye, Building2, PiggyBank } from "lucide-react";

const Index = () => {
  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">Visão Geral</h1>
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          <button className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg border border-border hover:bg-secondary transition-colors text-muted-foreground">
            <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">18 Out - 18 Nov</span>
            <span className="sm:hidden">Período</span>
          </button>
          <button className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg border border-border hover:bg-secondary transition-colors text-muted-foreground">
            Mensal <ChevronDown className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
          </button>
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
        <StatCard title="Contatos Totais" value="1.248" change={12.5} icon={Users} delay={0} />
        <StatCard title="Vendas Realizadas" value="34" change={8.3} icon={ShoppingCart} delay={0.05} />
        <StatCard title="Receita Total" value="4.520.000" change={15.8} icon={DollarSign} prefix="R$ " delay={0.1} />
        <StatCard title="Taxa de Conversão" value="2,7%" change={-3.2} icon={Target} delay={0.15} />
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
