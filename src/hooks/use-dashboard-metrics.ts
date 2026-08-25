import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";

/**
 * Visão Geral. Lê de fn_visao_geral, que soma os dois fluxos de entrada
 * (mídia paga e rede de parceiros) a partir do resumo diário calculado pelo
 * núcleo — não mais de uma tabela preenchida à mão.
 */

export const PERIODOS = [
  { valor: 7, rotulo: "7 dias" },
  { valor: 30, rotulo: "30 dias" },
  { valor: 90, rotulo: "90 dias" },
] as const;

export interface VisaoGeral {
  leads: number;
  visitas_agendadas: number;
  visitas_realizadas: number;
  vendas: number;
  receita: number | null;
  investimento: number | null;
  /** vendas ÷ leads — o rótulo na tela diz o denominador, de propósito */
  conversao_contato_venda: number | null;
  conversao_visita_venda: number | null;
  /** o mesmo funil, separado por entrada */
  leads_midia: number;
  leads_rede: number;
  receita_midia: number | null;
  receita_rede: number | null;
  var_leads: number | null;
  var_vendas: number | null;
  var_receita: number | null;
}

export function useDashboardMetrics(dias: number) {
  const { clientId } = useAuth();

  return useQuery<VisaoGeral | null>({
    queryKey: ["visao_geral", clientId, dias],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("fn_visao_geral", { p_dias: dias });
      if (error) throw error;
      return ((data as VisaoGeral[] | null) ?? [])[0] ?? null;
    },
    staleTime: 5 * 60 * 1000,
  });
}
