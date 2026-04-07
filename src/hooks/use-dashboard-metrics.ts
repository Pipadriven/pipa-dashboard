import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";

export type PeriodType = "mensal" | "semanal" | "diario";

const periodDbMap: Record<PeriodType, string> = {
  diario: "daily",
  semanal: "weekly",
  mensal: "monthly",
};

export interface DashboardMetrics {
  id: string;
  client_id: string;
  period_type: PeriodType;
  reference_date: string;
  contatos_totais: number;
  vendas_realizadas: number;
  receita_total: number;
  taxa_conversao: number;
  created_at: string;
  updated_at: string;
}

export interface DashboardMetricsWithVariation {
  current: DashboardMetrics | null;
  previous: DashboardMetrics | null;
  variation: {
    contatos_totais: number | null;
    vendas_realizadas: number | null;
    receita_total: number | null;
    taxa_conversao: number | null;
  };
}

interface UseDashboardMetricsOptions {
  periodType: PeriodType;
  referenceDate: string; // YYYY-MM-DD
}

function getPreviousDate(dateStr: string, periodType: PeriodType): string {
  const date = new Date(dateStr + "T00:00:00");
  switch (periodType) {
    case "diario":
      date.setDate(date.getDate() - 1);
      break;
    case "semanal":
      date.setDate(date.getDate() - 7);
      break;
    case "mensal":
      date.setMonth(date.getMonth() - 1);
      break;
  }
  return date.toISOString().slice(0, 10);
}

function calcVariation(current: number | undefined, previous: number | undefined): number | null {
  if (previous == null || current == null || previous === 0) return null;
  return parseFloat((((current - previous) / previous) * 100).toFixed(1));
}

export function useDashboardMetrics({ periodType, referenceDate }: UseDashboardMetricsOptions) {
  const { clientId } = useAuth();

  return useQuery<DashboardMetricsWithVariation>({
    queryKey: ["dashboard_metrics", clientId, periodType, referenceDate],
    enabled: !!clientId,
    queryFn: async () => {
      const dateOnly = referenceDate.slice(0, 10);
      const dbPeriod = periodDbMap[periodType];
      const prevDate = getPreviousDate(dateOnly, periodType);

      console.log("[dashboard_metrics] query inputs:", {
        client_id: clientId,
        period_type: dbPeriod,
        reference_date: dateOnly,
        previous_date: prevDate,
      });

      const [currentRes, previousRes] = await Promise.all([
        supabase
          .from("dashboard_metrics")
          .select("*")
          .eq("client_id", clientId!)
          .eq("period_type", dbPeriod)
          .eq("reference_date", dateOnly)
          .maybeSingle(),
        supabase
          .from("dashboard_metrics")
          .select("*")
          .eq("client_id", clientId!)
          .eq("period_type", dbPeriod)
          .eq("reference_date", prevDate)
          .maybeSingle(),
      ]);

      if (currentRes.error) throw currentRes.error;
      if (previousRes.error) throw previousRes.error;

      const current = currentRes.data;
      const previous = previousRes.data;

      console.log("[dashboard_metrics] current:", current);
      console.log("[dashboard_metrics] previous:", previous);

      return {
        current,
        previous,
        variation: {
          contatos_totais: calcVariation(current?.contatos_totais, previous?.contatos_totais),
          vendas_realizadas: calcVariation(current?.vendas_realizadas, previous?.vendas_realizadas),
          receita_total: calcVariation(current?.receita_total, previous?.receita_total),
          taxa_conversao: calcVariation(current?.taxa_conversao, previous?.taxa_conversao),
        },
      };
    },
    staleTime: 5 * 60 * 1000,
  });
}
