import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";

export interface ExcecaoAberta {
  excecao_id: string;
  tipo: "desconto" | "condicao_pagamento" | "permuta" | "prazo_reserva" | "outro";
  percentual_pedido: number | null;
  valor_pedido: number | null;
  justificativa: string | null;
  solicitada_em: string;
  sla_ate: string;
  estourado: boolean;
  corretor: string | null;
  imobiliaria: string | null;
  unidade: string | null;
  empreendimento: string | null;
  limite_empreendimento: number | null;
}

export type ResultadoDecisao =
  | "decidido"
  | "ja_decidida"
  | "sem_permissao"
  | "sem_alcada"
  | "fora_do_escopo"
  | "percentual_invalido"
  | "acao_invalida"
  | "sem_login";

export interface RespostaDecisao {
  resultado: ResultadoDecisao;
  status?: "aprovada" | "aprovada_parcial" | "negada";
  corretor?: string | null;
  unidade?: string | null;
  pedido?: number | null;
  concedido?: number | null;
  seu_limite?: number | null;
}

/**
 * Exceções esperando decisão, com tudo que a tela precisa (id, limite do
 * empreendimento, SLA). Assina o realtime de `excecao`: se o gerente decidir
 * pelo WhatsApp, o cartão some daqui sem recarregar a página.
 */
export function useExcecoesAbertas() {
  const { clientId } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery<ExcecaoAberta[]>({
    queryKey: ["excecoes-abertas", clientId],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("fn_painel_excecoes_abertas");
      if (error) throw error;
      return (data as ExcecaoAberta[] | null) ?? [];
    },
    enabled: !!clientId,
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    if (!clientId) return;
    const canal = supabase
      .channel(`excecoes-${clientId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "excecao",
          filter: `incorporadora_id=eq.${clientId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["excecoes-abertas", clientId] });
          queryClient.invalidateQueries({ queryKey: ["rede", clientId] });
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(canal);
    };
  }, [clientId, queryClient]);

  return query;
}

interface Decisao {
  excecaoId: string;
  acao: "aprovar" | "negar";
  /** só para aprovação parcial; sem ele concede o que foi pedido */
  percentual?: number | null;
}

/**
 * Decide pela função do banco (a mesma regra do WhatsApp). O banco devolve o
 * resultado em texto, inclusive as recusas esperadas (sem alçada, já
 * decidida) — por isso o erro de rede e a recusa de regra são coisas
 * diferentes e a tela as trata separado.
 */
export function useDecidirExcecao() {
  const { clientId } = useAuth();
  const queryClient = useQueryClient();

  return useMutation<RespostaDecisao, Error, Decisao>({
    mutationFn: async ({ excecaoId, acao, percentual }) => {
      const { data, error } = await supabase.rpc("fn_painel_decidir_excecao", {
        p_excecao_id: excecaoId,
        p_acao: acao,
        p_percentual: percentual ?? null,
      });
      if (error) throw error;
      return data as RespostaDecisao;
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["excecoes-abertas", clientId] });
      queryClient.invalidateQueries({ queryKey: ["rede", clientId] });
      queryClient.invalidateQueries({ queryKey: ["aovivo", clientId] });
    },
  });
}
