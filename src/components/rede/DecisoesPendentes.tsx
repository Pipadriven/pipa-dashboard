import { useState } from "react";
import { formatDistanceToNowStrict } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import { Button } from "../ui/button";
import {
  useDecidirExcecao,
  useExcecoesAbertas,
  type ExcecaoAberta,
  type RespostaDecisao,
} from "../../hooks/use-excecoes-abertas";

const TIPO: Record<ExcecaoAberta["tipo"], string> = {
  desconto: "Desconto",
  condicao_pagamento: "Condição de pagamento",
  permuta: "Permuta",
  prazo_reserva: "Prazo de reserva",
  outro: "Outra exceção",
};

const pct = (v: number | null | undefined) =>
  v == null ? "—" : `${Number(v).toLocaleString("pt-BR", { maximumFractionDigits: 2 })}%`;

const brl = (v: number | null | undefined) =>
  v == null
    ? null
    : `R$ ${Number(v).toLocaleString("pt-BR", { maximumFractionDigits: 0 })}`;

function prazo(iso: string, estourado: boolean) {
  const d = formatDistanceToNowStrict(new Date(iso), { locale: ptBR, addSuffix: true });
  return estourado ? `SLA estourou ${d}` : `Vence ${d}`;
}

/** Texto do aviso depois que o banco responde. As recusas de regra não são erro. */
function avisar(r: RespostaDecisao) {
  const nome = r.corretor ?? "O corretor";
  switch (r.resultado) {
    case "decidido":
      if (r.status === "negada") {
        toast.success(`Exceção recusada. ${nome} é avisado pelo WhatsApp em alguns minutos.`);
      } else if (r.status === "aprovada_parcial") {
        toast.success(
          `Aprovada com ${pct(r.concedido)}. ${nome} é avisado pelo WhatsApp em alguns minutos.`,
        );
      } else {
        toast.success(`Exceção aprovada. ${nome} é avisado pelo WhatsApp em alguns minutos.`);
      }
      return;
    case "ja_decidida":
      toast.message("Essa exceção já foi decidida (talvez pelo WhatsApp). A lista foi atualizada.");
      return;
    case "sem_permissao":
      toast.error("Seu acesso não permite decidir exceções.");
      return;
    case "sem_alcada":
      toast.error(`Acima da sua alçada: você pode conceder até ${pct(r.seu_limite)}.`);
      return;
    case "fora_do_escopo":
      toast.error("Essa exceção é de um empreendimento fora do seu acesso.");
      return;
    case "percentual_invalido":
      toast.error("Informe um percentual válido.");
      return;
    default:
      toast.error("Não foi possível registrar a decisão. Entre de novo e tente outra vez.");
  }
}

type Passo =
  | { id: string; modo: "parcial"; valor: string }
  | { id: string; modo: "confirmar"; acao: "aprovar" | "negar"; percentual: number | null };

function Cartao({
  x,
  passo,
  setPasso,
  ocupado,
  decidir,
}: {
  x: ExcecaoAberta;
  passo: Passo | null;
  setPasso: (p: Passo | null) => void;
  ocupado: boolean;
  decidir: (acao: "aprovar" | "negar", percentual: number | null) => void;
}) {
  const meu = passo && passo.id === x.excecao_id ? passo : null;
  const ehDesconto = x.tipo === "desconto" && x.percentual_pedido != null;
  const acimaDoLimite =
    ehDesconto && x.limite_empreendimento != null && x.percentual_pedido! > x.limite_empreendimento;
  const nome = x.corretor ?? "o corretor";

  const titulo = ehDesconto
    ? `${pct(x.percentual_pedido)} de desconto`
    : `${TIPO[x.tipo]}${brl(x.valor_pedido) ? ` · ${brl(x.valor_pedido)}` : ""}`;

  const valorParcial = meu && meu.modo === "parcial" ? Number(meu.valor.replace(",", ".")) : NaN;
  const parcialValido =
    ehDesconto && valorParcial > 0 && valorParcial < (x.percentual_pedido as number);

  return (
    <li className="px-5 py-4 border-b border-border/60 last:border-0">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <span className="text-[13px] font-semibold text-foreground">
          {x.corretor ?? "Corretor não informado"}
          {x.imobiliaria && (
            <span className="font-normal text-muted-foreground"> · {x.imobiliaria}</span>
          )}
        </span>
        <span
          className="text-xs tabular-nums"
          style={{
            color: x.estourado ? "hsl(var(--rede-parado))" : "hsl(var(--muted-foreground))",
            fontWeight: x.estourado ? 600 : 400,
          }}
        >
          {prazo(x.sla_ate, x.estourado)}
        </span>
      </div>

      <p className="mt-1 text-sm text-foreground">
        <strong className="font-semibold">{titulo}</strong>
        <span className="text-muted-foreground">
          {x.unidade ? ` · un. ${x.unidade}` : ""}
          {x.empreendimento ? ` · ${x.empreendimento}` : ""}
        </span>
      </p>

      {ehDesconto && x.limite_empreendimento != null && (
        <p
          className="mt-0.5 text-xs"
          style={{
            color: acimaDoLimite ? "hsl(var(--rede-esfriando))" : "hsl(var(--muted-foreground))",
          }}
        >
          {acimaDoLimite
            ? `Acima do limite do empreendimento (${pct(x.limite_empreendimento)})`
            : `Dentro do limite do empreendimento (${pct(x.limite_empreendimento)})`}
        </p>
      )}

      {x.justificativa && (
        <p className="mt-1.5 text-[13px] italic text-muted-foreground">“{x.justificativa}”</p>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {!meu && (
          <>
            <Button
              size="sm"
              disabled={ocupado}
              onClick={() =>
                setPasso({ id: x.excecao_id, modo: "confirmar", acao: "aprovar", percentual: null })
              }
            >
              Aprovar
            </Button>
            {ehDesconto && (
              <Button
                size="sm"
                variant="outline"
                disabled={ocupado}
                onClick={() =>
                  setPasso({
                    id: x.excecao_id,
                    modo: "parcial",
                    valor:
                      x.limite_empreendimento != null &&
                      x.limite_empreendimento < (x.percentual_pedido as number)
                        ? String(x.limite_empreendimento)
                        : "",
                  })
                }
              >
                Aprovar outro valor
              </Button>
            )}
            <Button
              size="sm"
              variant="ghost"
              disabled={ocupado}
              onClick={() =>
                setPasso({ id: x.excecao_id, modo: "confirmar", acao: "negar", percentual: null })
              }
            >
              Recusar
            </Button>
          </>
        )}

        {meu && meu.modo === "parcial" && (
          <>
            <label className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
              Conceder
              <input
                type="number"
                inputMode="decimal"
                min={0}
                step={0.5}
                max={x.percentual_pedido ?? undefined}
                value={meu.valor}
                onChange={(e) => setPasso({ id: x.excecao_id, modo: "parcial", valor: e.target.value })}
                className="h-9 w-20 rounded-md border border-input bg-background px-2 text-sm tabular-nums text-foreground"
                aria-label="Percentual a conceder"
              />
              %
            </label>
            <Button
              size="sm"
              disabled={!parcialValido || ocupado}
              onClick={() =>
                setPasso({
                  id: x.excecao_id,
                  modo: "confirmar",
                  acao: "aprovar",
                  percentual: valorParcial,
                })
              }
            >
              Continuar
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setPasso(null)}>
              Voltar
            </Button>
            {meu.valor !== "" && !parcialValido && (
              <span className="text-xs text-muted-foreground">
                Use um valor entre 0 e {pct(x.percentual_pedido)}.
              </span>
            )}
          </>
        )}

        {meu && meu.modo === "confirmar" && (
          <>
            <span className="text-[13px] text-foreground">
              {meu.acao === "negar"
                ? `Recusar o pedido de ${nome}?`
                : meu.percentual != null
                  ? `Aprovar ${pct(meu.percentual)} para ${nome}?`
                  : `Aprovar o pedido de ${nome}?`}
            </span>
            <Button
              size="sm"
              variant={meu.acao === "negar" ? "destructive" : "default"}
              disabled={ocupado}
              onClick={() => decidir(meu.acao, meu.percentual)}
            >
              {ocupado ? "Registrando…" : "Confirmar"}
            </Button>
            <Button size="sm" variant="ghost" disabled={ocupado} onClick={() => setPasso(null)}>
              Voltar
            </Button>
          </>
        )}
      </div>
    </li>
  );
}

export function DecisoesPendentes() {
  const { data, isLoading, error } = useExcecoesAbertas();
  const decidir = useDecidirExcecao();
  const [passo, setPasso] = useState<Passo | null>(null);
  const lista = data ?? [];

  return (
    <div className="chart-card p-0 overflow-hidden flex flex-col">
      <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-border">
        <div>
          <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
            Decisões pendentes
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Pedidos de exceção dos corretores. O que você decidir aqui avisa o corretor pelo
            WhatsApp.
          </p>
        </div>
        <span
          className="text-2xl font-bold tabular-nums"
          style={{ color: lista.length ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))" }}
        >
          {isLoading ? "—" : lista.length}
        </span>
      </div>

      {error && (
        <p className="px-5 py-4 text-[13px] text-muted-foreground">
          Não consegui ler as exceções. Confirme que o arquivo{" "}
          <code className="text-xs">pipa-painel-aovivo.sql</code> rodou neste projeto do Supabase.
        </p>
      )}

      {!error && isLoading && (
        <div className="px-5 py-4">
          <div className="h-4 w-2/3 rounded bg-muted animate-pulse" />
        </div>
      )}

      {!error && !isLoading && lista.length === 0 && (
        <p className="px-5 py-6 text-[13px] italic text-muted-foreground">
          Nenhuma exceção esperando decisão. Quando um corretor pedir, aparece aqui e no seu
          WhatsApp.
        </p>
      )}

      {lista.length > 0 && (
        <ul>
          {lista.map((x) => (
            <Cartao
              key={x.excecao_id}
              x={x}
              passo={passo}
              setPasso={setPasso}
              ocupado={decidir.isPending}
              decidir={(acao, percentual) =>
                decidir.mutate(
                  { excecaoId: x.excecao_id, acao, percentual },
                  {
                    onSuccess: (r) => {
                      avisar(r);
                      setPasso(null);
                    },
                    onError: () => {
                      toast.error("Sem conexão com o servidor. Tente de novo em instantes.");
                    },
                  },
                )
              }
            />
          ))}
        </ul>
      )}
    </div>
  );
}
