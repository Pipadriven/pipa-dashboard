import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";

/** Janelas do filtro de período. O padrão é 30 dias. */
export const PERIODOS = [
  { valor: 1, rotulo: "Hoje" },
  { valor: 7, rotulo: "7 dias" },
  { valor: 30, rotulo: "30 dias" },
  { valor: 90, rotulo: "90 dias" },
] as const;

export type Situacao = "ativo" | "esfriando" | "parado" | "nunca_produziu";

export interface CorretorLinha {
  corretor_id: string;
  nome: string | null;
  imobiliaria: string | null;
  telefone_e164: string | null;
  situacao: Situacao;
  dias_parado: number | null;
  acoes: number;
  leads_abertos: number;
  leads_novos: number;
  visitas_agendadas: number;
  visitas_realizadas: number;
  taxa_comparecimento: number | null;
  taxa_conversao: number | null;
  reservas_ativas: number;
  vendas: number;
  vgv: number | null;
}

export interface RedeResumo {
  rede_total: number;
  ativos: number;
  esfriando: number;
  parados: number;
  nunca_produziram: number;
  leads_abertos: number;
  leads_novos: number;
  visitas_agendadas: number;
  visitas_realizadas: number;
  taxa_comparecimento: number | null;
  taxa_conversao: number | null;
  reservas_ativas: number;
  vendas: number;
  vgv: number | null;
  excecoes_pendentes: number;
  excecoes_sla_estourado: number;
}

export interface PulsoDia {
  dia: string;
  acoes: number;
  corretores: number;
  visitas: number;
}

export interface RedeData {
  resumo: RedeResumo | null;
  corretores: CorretorLinha[];
  pulso: PulsoDia[];
  agenda: Array<{
    oportunidade_id: string;
    visita_agendada_para: string;
    cliente: string | null;
    corretor: string | null;
    imobiliaria: string | null;
    unidade_reservada: string | null;
  }>;
  defasada: Array<{
    corretor_id: string;
    nome: string | null;
    empreendimento: string | null;
    versao_em_maos: string | null;
    versao_vigente: string | null;
  }>;
  excecoes: Array<{
    percentual_pedido: number | null;
    solicitada_em: string;
    sla_ate: string;
    corretor: { nome: string | null } | null;
    unidade: { identificador: string; bloco: string | null } | null;
  }>;
  reservas: Array<{
    expira_em: string;
    unidade: { identificador: string; bloco: string | null } | null;
    corretor: { nome: string | null } | null;
  }>;
}

/** Nada de `any`: o rpc devolve linhas tipadas pelas interfaces acima. */
export function useRedeMetrics(dias: number) {
  const { clientId } = useAuth();

  return useQuery<RedeData>({
    queryKey: ["rede", clientId, dias],
    queryFn: async () => {
      const emAte48h = new Date(Date.now() + 48 * 36e5).toISOString();

      const [resumo, corretores, pulso, agenda, defasada, excecoes, reservas] =
        await Promise.all([
          supabase.rpc("fn_painel_resumo", { p_dias: dias }),
          supabase.rpc("fn_painel_corretor", { p_dias: dias }),
          supabase.rpc("fn_painel_pulso", { p_dias: dias }),
          supabase.from("vw_painel_agenda").select("*").order("visita_agendada_para"),
          supabase.from("vw_tabela_defasada").select("*"),
          supabase
            .from("excecao")
            .select(
              "percentual_pedido,solicitada_em,sla_ate,corretor:solicitada_por(nome),unidade(identificador,bloco)",
            )
            .eq("status", "pendente")
            .order("sla_ate"),
          supabase
            .from("reserva")
            .select("expira_em,unidade(identificador,bloco),corretor(nome)")
            .eq("status", "ativa")
            .lte("expira_em", emAte48h)
            .order("expira_em"),
        ]);

      const primeiroErro = [resumo, corretores, pulso].find((r) => r.error);
      if (primeiroErro?.error) throw primeiroErro.error;

      return {
        resumo: (resumo.data as RedeResumo[] | null)?.[0] ?? null,
        corretores: (corretores.data as CorretorLinha[] | null) ?? [],
        pulso: (pulso.data as PulsoDia[] | null) ?? [],
        agenda: (agenda.data as RedeData["agenda"] | null) ?? [],
        defasada: (defasada.data as RedeData["defasada"] | null) ?? [],
        excecoes: (excecoes.data as RedeData["excecoes"] | null) ?? [],
        reservas: (reservas.data as RedeData["reservas"] | null) ?? [],
      };
    },
    // o painel é operacional: revalida ao voltar para a aba
    staleTime: 60 * 1000,
    refetchOnWindowFocus: true,
    refetchInterval: 60 * 1000,
  });
}
