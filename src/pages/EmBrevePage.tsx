import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { DashboardLayout } from "../components/DashboardLayout";
import { CONTATO_COMERCIAL, mailto } from "../config/contato";
import symbolOrange from "../assets/pipa-symbol.png";
import {
  ArrowRight,
  Banknote,
  Bot,
  CalendarCheck,
  Check,
  Filter,
  Gauge,
  HandCoins,
  Layers,
  Megaphone,
  Repeat2,
  Sparkles,
  Timer,
  Users,
} from "lucide-react";
import type { ComponentType } from "react";

interface Recurso {
  icon: ComponentType<{ className?: string }>;
  titulo: string;
  texto: string;
}

interface Modulo {
  titulo: string;
  icon: ComponentType<{ className?: string }>;
  promessa: string;
  descricao: string;
  recursos: Recurso[];
  /** O que a plataforma JÁ faz hoje e sustenta este módulo. */
  jaNoAr: string;
}

/**
 * Páginas dos módulos que ainda não entraram no ar.
 *
 * As três telas — Marketing, Vendas e PIPA — pertencem ao MESMO fluxo: o
 * canal de aquisição DIRETO da incorporadora (a mídia própria dela, o time
 * próprio dela, o SDR de IA que atende esse lead). É diferente da Rede de
 * Parceiros, que já está no ar. A tese do canal direto é pincelada em cada
 * tela pelo "eixo" no topo do hero.
 *
 * O conteúdo espelha as métricas que existiam nessas abas na v0, para que a
 * apresentação prometa exatamente o que o módulo vai medir.
 *
 * ⚠ PIPA não é "perguntar ao painel" — isso é a Rede/Gestor. PIPA é o agente
 * SDR que recebe o lead do canal direto e faz o primeiro atendimento.
 */
const EIXO = "Canal de aquisição direto da incorporadora";

const MODULOS: Record<string, Modulo> = {
  "/marketing": {
    titulo: "Marketing",
    icon: Megaphone,
    promessa: "Do investimento em mídia ao lead qualificado, campanha por campanha.",
    descricao:
      "Antes da rede de parceiros existe o canal próprio da incorporadora: a mídia paga que ela roda em nome do empreendimento. Este módulo mostra quanto cada campanha custa, de onde vem cada lead e onde ele qualifica — ou trava.",
    recursos: [
      {
        icon: Banknote,
        titulo: "Custo por lead e investimento",
        texto:
          "CPL médio, investimento em mídia e campanhas ativas lado a lado — para ver qual campanha traz lead barato e qual só queima verba.",
      },
      {
        icon: Filter,
        titulo: "Qualificação do funil",
        texto:
          "Taxa de qualificação e volume de leads qualificados etapa a etapa — MQL, SQL, visita — para achar onde o lead esfria.",
      },
      {
        icon: Timer,
        titulo: "Origem e lead time",
        texto:
          "Leads por canal de origem e o tempo médio entre cada etapa, de quando o lead entra até quando avança.",
      },
    ],
    jaNoAr:
      "A Visão Geral já separa os leads por origem — mídia paga e rede — com dado real do banco.",
  },
  "/vendas": {
    titulo: "Vendas",
    icon: HandCoins,
    promessa: "O que o time próprio fecha, do primeiro contato à escritura.",
    descricao:
      "O outro lado do canal direto: as vendas que o time da própria incorporadora fecha com os leads da mídia dela. Ticket, ciclo e giro das unidades sem depender de planilha.",
    recursos: [
      {
        icon: Gauge,
        titulo: "Ticket e ciclo de venda",
        texto:
          "Ticket médio, ciclo médio até o fechamento e taxa de conversão — o retrato de quão rápido e quão caro o time converte.",
      },
      {
        icon: Layers,
        titulo: "Giro de estoque",
        texto:
          "Giro das unidades e vendas por empreendimento, para saber qual produto sai e qual está encalhando.",
      },
      {
        icon: Users,
        titulo: "Desempenho do time",
        texto:
          "Top vendedores, novos clientes e negócios ativos — quem está puxando o resultado e quanto ainda está em aberto.",
      },
    ],
    jaNoAr:
      "Receita, vendas e conversão do período já estão na Visão Geral, vindas do banco.",
  },
  "/ia": {
    titulo: "PIPA",
    icon: Bot,
    promessa: "O SDR que atende cada lead do canal direto em segundos.",
    descricao:
      "Quando um lead entra pela mídia da incorporadora, a PIPA responde na hora, qualifica, agenda a visita e reativa quem esfriou — antes de qualquer pessoa do time tocar no lead. É o agente de pré-venda do canal direto, não um painel para consultar.",
    recursos: [
      {
        icon: Timer,
        titulo: "Primeiro atendimento em segundos",
        texto:
          "A PIPA responde o lead assim que ele entra. Responder em 5 minutos converte 4× mais que em 1 hora — e ela não dorme.",
      },
      {
        icon: CalendarCheck,
        titulo: "Qualifica e agenda sozinha",
        texto:
          "Faz as perguntas de qualificação, mede o engajamento e agenda a visita direto na agenda do time, sem intervenção.",
      },
      {
        icon: Repeat2,
        titulo: "Reativa o lead frio",
        texto:
          "Régua de follow-up para quem parou de responder, com as objeções mapeadas e as conversões que a reativação trouxe de volta.",
      },
    ],
    jaNoAr:
      "As visitas e o tempo de resposta que a PIPA otimiza já são medidos na Rede de Parceiros hoje.",
  },
};

export default function EmBrevePage() {
  const { pathname } = useLocation();
  const m = MODULOS[pathname];

  if (!m) return null;

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mx-auto flex w-full max-w-4xl flex-col gap-8 py-2"
      >
        {/* Hero — sempre escuro nos dois temas.
            Usa surface-invert (não inverte no dark) + borda hairline que
            desenha a peça quando o fundo da página também é escuro. */}
        <section
          className="relative overflow-hidden rounded-2xl p-8 sm:p-12"
          style={{
            background: "hsl(var(--surface-invert))",
            border: "1px solid hsl(var(--surface-invert-border) / 0.1)",
          }}
        >
          {/* Malha da marca cortada pela borda (manual, p. 14): escala grande,
              atrás do conteúdo, em laranja sobre fundo escuro. */}
          <img
            src={symbolOrange}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-16 -right-16 w-[420px] max-w-none opacity-[0.07]"
          />

          <div className="relative flex flex-col gap-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-primary px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-primary-foreground">
                <Sparkles className="h-3.5 w-3.5" />
                Próximo módulo
              </span>
              <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-white/40">
                {EIXO}
              </span>
            </div>

            <div className="flex flex-col gap-4">
              <h1 className="m-0 font-display text-[34px] font-bold leading-[1.1] text-white sm:text-[44px]">
                {m.promessa}
              </h1>
              <p className="m-0 max-w-[620px] text-[17px] leading-relaxed text-white/60">
                {m.descricao}
              </p>
            </div>

            <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center">
              <a
                href={mailto(
                  CONTATO_COMERCIAL,
                  `Tenho interesse no módulo ${m.titulo}`,
                  `Olá! Gostaria de saber mais sobre o módulo ${m.titulo} da PIPADriven e como ativá-lo na nossa operação.`,
                )}
                className="inline-flex h-12 items-center justify-center gap-2.5 rounded-lg bg-primary px-6 font-display text-base font-semibold text-primary-foreground transition-colors hover:bg-pipa-orange-dark"
              >
                Quero conhecer o módulo
                <ArrowRight className="h-[18px] w-[18px]" />
              </a>
              <span className="text-sm text-white/50">
                Falamos com você sobre prazo e ativação.
              </span>
            </div>
          </div>
        </section>

        {/* O que o módulo entrega */}
        <section className="flex flex-col gap-4">
          <h2 className="metric-label m-0">O que ele entrega</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {m.recursos.map((r) => (
              <div
                key={r.titulo}
                className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <r.icon className="h-5 w-5 text-pipa-orange-dark" />
                </span>
                <h3 className="m-0 font-display text-base font-semibold text-foreground">
                  {r.titulo}
                </h3>
                <p className="m-0 text-sm leading-relaxed text-muted-foreground">{r.texto}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Âncora de credibilidade: o que já funciona */}
        <section className="flex items-start gap-3 rounded-xl border border-border bg-card p-5">
          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15">
            <Check className="h-3.5 w-3.5 text-pipa-orange-dark" />
          </span>
          <p className="m-0 text-sm leading-relaxed text-muted-foreground">
            <span className="font-semibold text-foreground">Já no ar:</span> {m.jaNoAr}{" "}
            Este módulo soma ao que a plataforma entrega hoje — nada do que está
            funcionando muda quando ele chegar.
          </p>
        </section>
      </motion.div>
    </DashboardLayout>
  );
}
