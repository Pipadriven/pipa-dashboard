import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { DashboardLayout } from "../components/DashboardLayout";
import { CONTATO_COMERCIAL, mailto } from "../config/contato";
import {
  ArrowRight,
  Bot,
  CalendarCheck,
  Check,
  HandCoins,
  Megaphone,
  MessageSquare,
  Percent,
  Send,
  Sparkles,
  Timer,
  UserCheck,
  Users,
} from "lucide-react";
import type { ComponentType } from "react";

interface Recurso {
  icon: ComponentType<{ className?: string }>;
  titulo: string;
  texto: string;
}

interface Modulo {
  chapeu: string;
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
 * O conteúdo descreve produtos que existem de fato no roteiro da PIPA
 * (Difusão, Reativação, Gestor), não recursos genéricos inventados.
 *
 * Substituiu três telas que renderizavam dashboards completos com números
 * fabricados — 6.527 leads, R$ 42,30 de CPL — atrás de um selo pequeno de
 * "dados de demonstração". Em reunião com cliente aquilo é um risco real:
 * um print daquela tela é indistinguível de dado verdadeiro.
 */
const MODULOS: Record<string, Modulo> = {
  "/marketing": {
    chapeu: "Próximo módulo",
    titulo: "Marketing",
    icon: Megaphone,
    promessa: "A campanha chega na rede inteira sem lista de transmissão.",
    descricao:
      "A arte que o marketing fez hoje sai do canal para o recorte certo de corretores — em grupos, com intervalo entre eles, para não queimar o número. E o lead que esfriou volta a ser trabalhado sozinho.",
    recursos: [
      {
        icon: Send,
        titulo: "Difusão com recorte",
        texto:
          "Escolha o público por empreendimento, imobiliária ou situação. Envio em grupos com intervalo, trava de repetição e registro de quem recebeu.",
      },
      {
        icon: Timer,
        titulo: "Régua de reativação",
        texto:
          "Oito toques espaçados para cliente parado. Na primeira resposta a cadência para, o CRM é atualizado e um corretor recebe o lead com briefing.",
      },
      {
        icon: Users,
        titulo: "Origem por canal",
        texto:
          "Mídia paga e rede de parceiros no mesmo funil, com CAC por canal — para saber onde o investimento está comprando volume e onde está comprando ruído.",
      },
    ],
    jaNoAr:
      "A Visão Geral já mostra a origem dos leads e o CAC por canal com dado real.",
  },
  "/vendas": {
    chapeu: "Próximo módulo",
    titulo: "Vendas",
    icon: HandCoins,
    promessa: "O gerente comercial decide pelo WhatsApp, no mesmo número da rede.",
    descricao:
      "Sem painel novo para aprender e sem outro número para gerenciar. O gerente consulta a operação por conversa e é avisado no instante em que um corretor agenda visita ou reserva unidade.",
    recursos: [
      {
        icon: Percent,
        titulo: "Exceção de desconto",
        texto:
          "O pedido chega com unidade, corretor e percentual. Aprovar ou recusar é uma resposta — e o SLA corre visível até a decisão.",
      },
      {
        icon: CalendarCheck,
        titulo: "Aviso de visita e reserva",
        texto:
          "Notificação no momento em que acontece, não no relatório do dia seguinte. Reserva prestes a expirar também avisa.",
      },
      {
        icon: UserCheck,
        titulo: "Tabela sempre na versão certa",
        texto:
          "Mandar a tabela vigente para a rede em um comando, e ver quem ainda está vendendo com versão antiga.",
      },
    ],
    jaNoAr:
      "Exceções, reservas e agenda já alimentam as notificações do painel hoje.",
  },
  "/ia": {
    chapeu: "Próximo módulo",
    titulo: "PIPA",
    icon: Bot,
    promessa: "Perguntar à operação em vez de procurar o número no painel.",
    descricao:
      "A camada de conversa da plataforma. Em vez de abrir relatório e filtrar, o gestor pergunta — e a resposta vem com o dado que já está no banco, na mesma janela onde ele trabalha o dia inteiro.",
    recursos: [
      {
        icon: MessageSquare,
        titulo: "Painel por conversa",
        texto:
          "“Quantas visitas ficaram sem retorno esta semana?” devolve a lista, não um gráfico para interpretar.",
      },
      {
        icon: Sparkles,
        titulo: "Leitura, não só número",
        texto:
          "O que mudou desde a última consulta e por quê — a queda de etapa, o corretor que parou, o canal que passou a converter.",
      },
      {
        icon: Timer,
        titulo: "Resumo no seu horário",
        texto:
          "Um resumo da operação na hora em que você começa o dia, com o que pede decisão no topo.",
      },
    ],
    jaNoAr:
      "As leituras do funil e do VGV na Visão Geral já usam a mesma lógica de interpretação.",
  },
};

export default function EmBrevePage() {
  const { pathname } = useLocation();
  const m = MODULOS[pathname];

  if (!m) return null;

  const Icone = m.icon;

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mx-auto flex w-full max-w-4xl flex-col gap-8 py-2"
      >
        {/* Hero */}
        <section className="relative overflow-hidden rounded-2xl bg-foreground p-8 sm:p-12">
          <div className="relative flex flex-col gap-6">
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-primary px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-primary-foreground">
              <Sparkles className="h-3.5 w-3.5" />
              {m.chapeu}
            </span>

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

          <Icone className="pointer-events-none absolute -bottom-10 -right-8 h-56 w-56 text-white/[0.04]" />
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
