import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";

export type PeriodType = "mensal" | "semanal" | "diario";

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
      const { data, error } = await supabase
        .from("dashboard_metrics")
        .select("*")
        .eq("client_id", clientId!)
        .eq("period_type", periodType)
        .eq("reference_date", referenceDate)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
}
