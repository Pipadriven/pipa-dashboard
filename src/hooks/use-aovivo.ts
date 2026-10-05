import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";

export interface EventoAoVivo {
  id: number;
  ocorrida_em: string;
  tipo: string;
  autor: string;
  corretor: string | null;
  imobiliaria: string | null;
  unidade: string | null;
  empreendimento: string | null;
  payload: Record<string, unknown> | null;
}

/**
 * O que está acontecendo na rede agora.
 *
 * Lê de `fn_painel_aovivo` (Backend/pipa-painel-aovivo.sql) e assina INSERT em
 * `atividade` pelo realtime do Supabase: cada evento novo refaz a leitura.
 * Se o canal cair, o intervalo de 60s cobre — o painel nunca fica parado.
 */
export function useAoVivo(limite = 20) {
  const { clientId } = useAuth();
  const queryClient = useQueryClient();
  const [conectado, setConectado] = useState(false);
  const espera = useRef<ReturnType<typeof setTimeout> | null>(null);

  const query = useQuery<EventoAoVivo[]>({
    queryKey: ["aovivo", clientId, limite],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("fn_painel_aovivo", { p_limite: limite });
      if (error) throw error;
      return (data as EventoAoVivo[] | null) ?? [];
    },
    enabled: !!clientId,
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    if (!clientId) return;

    const canal = supabase
      .channel(`aovivo-${clientId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "atividade",
          filter: `incorporadora_id=eq.${clientId}`,
        },
        () => {
          // uma rajada de eventos (ex.: difusão) vira UMA leitura
          if (espera.current) clearTimeout(espera.current);
          espera.current = setTimeout(() => {
            queryClient.invalidateQueries({ queryKey: ["aovivo", clientId] });
          }, 600);
        },
      )
      .subscribe((status) => setConectado(status === "SUBSCRIBED"));

    return () => {
      if (espera.current) clearTimeout(espera.current);
      setConectado(false);
      supabase.removeChannel(canal);
    };
  }, [clientId, queryClient]);

  return { ...query, conectado };
}
