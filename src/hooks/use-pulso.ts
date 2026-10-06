import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";

/** Períodos da tela Imersões. */
export const PERIODOS_PULSO = [
  { valor: 7, rotulo: "7 dias" },
  { valor: 30, rotulo: "30 dias" },
  { valor: 90, rotulo: "90 dias" },
] as const;

export interface PulsoSessao {
  id: string;
  criada_em: string;
  atualizada_em: string;
  nome: string | null;
  incorporadora: string | null;
  empreendimento: string | null;
  papel: "diretor" | "gerente" | null;
  origem: string | null;
  /** 0 entrou · 1 corretor · 2 gerente · 3 valor */
  ato_max: number;
  sinais: string[];
  acoes: number;
  decidiu: boolean;
  resp_media_s: number | null;
  corretores: number | null;
  ticket: number | null;
  margem_pct: number | null;
  contato_whatsapp: string | null;
  contato_email: string | null;
  contato_pedido_em: string | null;
  contato_avisado_em: string | null;
  eventos: Array<{ t: string; e: string }>;
}

/**
 * Este login é da equipe da PIPA? (tabela `pulso_admin`)
 * As imersões são prospects da PIPA, não dados de cliente: um login de
 * incorporadora nunca as vê, mesmo estando no mesmo painel.
 */
export function usePulsoAdmin() {
  const { user } = useAuth();
  return useQuery<boolean>({
    queryKey: ["pulso-admin", user?.id ?? null],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("fn_pulso_sou_admin");
      // função ainda não instalada ou sem permissão: simplesmente não é admin
      if (error) return false;
      return data === true;
    },
    enabled: !!user,
    staleTime: 10 * 60 * 1000,
  });
}

export function usePulsoSessoes(dias: number, habilitado: boolean) {
  return useQuery<PulsoSessao[]>({
    queryKey: ["pulso-sessoes", dias],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("fn_pulso_sessoes", { p_dias: dias });
      if (error) throw error;
      return (data as PulsoSessao[] | null) ?? [];
    },
    enabled: habilitado,
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
    refetchOnWindowFocus: true,
  });
}
