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

interface UseDashboardMetricsOptions {
  periodType: PeriodType;
  referenceDate: string; // YYYY-MM-DD
}

export function useDashboardMetrics({ periodType, referenceDate }: UseDashboardMetricsOptions) {
  const { clientId } = useAuth();

  return useQuery<DashboardMetrics | null>({
    queryKey: ["dashboard_metrics", clientId, periodType, referenceDate],
    enabled: !!clientId,
    queryFn: async () => {
      // Ensure YYYY-MM-DD format (strip any time component)
      const dateOnly = referenceDate.slice(0, 10);
      const dbPeriod = periodDbMap[periodType];

      console.log("[dashboard_metrics] query inputs — client_id: " + String(clientId) + " | period_type: " + dbPeriod + " | reference_date: " + dateOnly);

      const { data, error } = await supabase
        .from("dashboard_metrics")
        .select("*")
        .eq("client_id", clientId!)
        .eq("period_type", dbPeriod)
        .eq("reference_date", dateOnly)
        .maybeSingle();

      if (error) {
        console.error("[dashboard_metrics] ERROR:", JSON.stringify(error, null, 2));
        throw error;
      }
      console.log("[dashboard_metrics] result:", JSON.stringify(data, null, 2));
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
}
