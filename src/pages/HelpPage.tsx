import { useState } from "react";
import { DashboardLayout } from "../components/DashboardLayout";
import { CONTATO_SUPORTE, CONTATO_COMERCIAL, mailto } from "../config/contato";
import { ChevronDown, LifeBuoy, Mail, Sparkles } from "lucide-react";

interface Pergunta {
  p: string;
  r: string;
}

/**
 * Ajuda.
 *
 * As respostas descrevem o comportamento real do painel — de onde vem cada
 * número, com que frequência atualiza, o que o selo de módulo significa.
 * Nada de FAQ genérico de template.
 */
const PERGUNTAS: Pergunta[] = [
  {
    p: "De onde vêm os números da Visão Geral?",
    r: "Direto do banco da sua operação, pela função fn_visao_geral. O período selecionado no topo da página define a janela, e a comparação percentual é sempre contra a janela anterior de mesmo tamanho.",
  },
  {
    p: "Com que frequência os dados atualizam?",
    r: "A Rede de Parceiros e as notificações revalidam a cada 60 segundos e sempre que você volta para a aba. A Visão Geral usa cache de 5 minutos, porque as métricas consolidadas mudam mais devagar.",
  },
  {
    p: "O que significa cada situação do corretor?",
    r: "Ativo: registrou ação no período. Esfriando: vinha produzindo e reduziu o ritmo. Parado: está há dias sem nenhuma ação — o número de dias aparece ao lado. Nunca produziu: está cadastrado na rede mas nunca registrou ação.",
  },
  {
    p: "O sino conta o quê?",
    r: "Só o que pede decisão: exceções de desconto pendentes ou com SLA estourado e reservas prestes a expirar. Corretor parado, tabela desatualizada e visitas do dia aparecem na lista como contexto, mas não entram no contador — senão ele nunca zeraria.",
  },
  {
    p: "Como funciona a busca?",
    r: "Atalho ⌘K no Mac ou Ctrl+K no Windows. Procura corretores pelo nome ou imobiliária, visitas agendadas pelo cliente, e também navega entre as páginas. Ignora acentuação.",
  },
  {
    p: "Por que alguns módulos do menu têm selo?",
    r: "São módulos da PIPA que ainda não foram ativados na sua conta. A página de cada um descreve o que ele entrega. Nada do que já está no ar depende deles para funcionar.",
  },
  {
    p: "Posso exportar os dados?",
    r: "Sim. O botão Exportar na Visão Geral baixa um CSV com as métricas do período selecionado, pronto para abrir no Excel ou no Google Planilhas.",
  },
  {
    p: "Esqueci minha senha. E agora?",
    r: "Use o link 'Esqueci minha senha' na tela de entrada. Se o e-mail de recuperação não chegar em alguns minutos, fale com o administrador da sua conta ou com o suporte.",
  },
];

function Item({ q, aberta, onToggle }: { q: Pergunta; aberta: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-border last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={aberta}
        className="flex w-full items-center justify-between gap-4 py-4 text-left"
      >
        <span className="text-[15px] font-semibold text-foreground">{q.p}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${
            aberta ? "rotate-180" : ""
          }`}
        />
      </button>
      {aberta && (
        <p className="m-0 pb-4 pr-8 text-sm leading-relaxed text-muted-foreground">{q.r}</p>
      )}
    </div>
  );
}

export default function HelpPage() {
  const [aberta, setAberta] = useState<number | null>(0);

  return (
    <DashboardLayout>
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 py-2">
        <div className="flex flex-col gap-2">
          <span className="metric-label">Suporte</span>
          <h1 className="m-0 font-display text-[32px] font-bold leading-tight text-foreground">
            Ajuda
          </h1>
          <p className="m-0 text-base text-muted-foreground">
            Como o painel funciona e para quem falar quando algo não bate.
          </p>
        </div>

        <section className="rounded-xl border border-border bg-card px-6">
          {PERGUNTAS.map((q, i) => (
            <Item
              key={q.p}
              q={q}
              aberta={aberta === i}
              onToggle={() => setAberta(aberta === i ? null : i)}
            />
          ))}
        </section>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <a
            href={mailto(
              CONTATO_SUPORTE,
              "Suporte PIPADriven",
              "Descreva o que aconteceu, em qual tela, e o horário aproximado.",
            )}
            className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5 transition-colors hover:border-input"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <LifeBuoy className="h-5 w-5 text-pipa-orange-dark" />
            </span>
            <span className="font-display text-base font-semibold text-foreground">
              Algo não está certo
            </span>
            <span className="text-sm leading-relaxed text-muted-foreground">
              Número que não bate, tela que não carrega, acesso que não funciona.
            </span>
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground">
              <Mail className="h-4 w-4" />
              {CONTATO_SUPORTE}
            </span>
          </a>

          <a
            href={mailto(CONTATO_COMERCIAL, "Módulos da PIPADriven")}
            className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5 transition-colors hover:border-input"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Sparkles className="h-5 w-5 text-pipa-orange-dark" />
            </span>
            <span className="font-display text-base font-semibold text-foreground">
              Quero ativar um módulo
            </span>
            <span className="text-sm leading-relaxed text-muted-foreground">
              Marketing, Vendas ou PIPA — prazo, escopo e ativação na sua operação.
            </span>
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground">
              <Mail className="h-4 w-4" />
              {CONTATO_COMERCIAL}
            </span>
          </a>
        </section>

        <p className="m-0 text-center text-sm text-muted-foreground">
          <a href="/termos" className="underline decoration-border underline-offset-4 hover:text-foreground">
            Termos de uso
          </a>
          {" · "}
          <a href="/privacidade" className="underline decoration-border underline-offset-4 hover:text-foreground">
            Política de privacidade
          </a>
        </p>
      </div>
    </DashboardLayout>
  );
}
