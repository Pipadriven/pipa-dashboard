import { Fragment, useState } from "react";
import { formatDistanceToNowStrict } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, CheckCircle2, Phone, QrCode, Users } from "lucide-react";
import { DashboardLayout } from "../components/DashboardLayout";
import { StatCard } from "../components/dashboard/StatCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  PERIODOS_PULSO,
  usePulsoAdmin,
  usePulsoSessoes,
  type PulsoSessao,
} from "../hooks/use-pulso";

const ATOS = ["Entrou", "Corretor", "Gerente", "Valor"];

const EVENTO: Record<string, string> = {
  entrada: "Entrou na experiência",
  "tela.corretor": "Abriu o ato do corretor",
  "corretor.reservou": "Reservou a unidade no chat",
  "tela.gerente": "Abriu o painel do gerente",
  "sinal.visitas": "Leu o sinal: visitas que não acontecem",
  "sinal.rede": "Leu o sinal: corretores que nunca produziram",
  "sinal.reservas": "Leu o sinal: reservas vencendo",
  "acao.acao": "Executou uma ação de gerente",
  "acao.decisao": "Decidiu o pedido de exceção",
  "tela.valor": "Abriu a tela de valor",
  calculadora: "Ajustou a calculadora",
  contato: "Pediu contato",
};

const nf = (v: number | null | undefined) => (v ?? 0).toLocaleString("pt-BR");
const brl = (v: number | null | undefined) =>
  v == null ? "—" : `R$ ${Number(v).toLocaleString("pt-BR", { maximumFractionDigits: 0 })}`;

function quando(iso: string) {
  return formatDistanceToNowStrict(new Date(iso), { locale: ptBR, addSuffix: true });
}

function hora(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Telefone digitado com DDD vira link do WhatsApp (assume Brasil se vier sem o 55). */
function linkZap(d: string) {
  const dig = d.replace(/\D/g, "");
  return `https://wa.me/${dig.length <= 11 ? `55${dig}` : dig}`;
}

function Progresso({ ato }: { ato: number }) {
  return (
    <div className="flex items-center gap-1" title={`Chegou até: ${ATOS[ato] ?? "—"}`}>
      {[1, 2, 3].map((k) => (
        <span
          key={k}
          className="h-1.5 w-6 rounded-full"
          style={{
            background: ato >= k ? "hsl(var(--primary))" : "hsl(var(--muted))",
          }}
        />
      ))}
    </div>
  );
}

function Detalhe({ s }: { s: PulsoSessao }) {
  return (
    <div className="grid gap-5 px-5 py-4 bg-secondary/30 md:grid-cols-2">
      <div>
        <p className="metric-label mb-2">O que ele fez</p>
        <ul className="space-y-1.5">
          {s.eventos.map((ev, i) => (
            <li key={i} className="flex items-baseline justify-between gap-3 text-[13px]">
              <span className="text-foreground">{EVENTO[ev.e] ?? ev.e}</span>
              <span className="shrink-0 tabular-nums text-xs text-muted-foreground">
                {hora(ev.t)}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className="space-y-3 text-[13px]">
        <div>
          <p className="metric-label mb-1">Empreendimento que informou</p>
          <p className="text-foreground">{s.empreendimento ?? "—"}</p>
        </div>
        <div>
          <p className="metric-label mb-1">Calculadora (o que ele ajustou)</p>
          <p className="text-foreground">
            {s.corretores != null ? `${nf(s.corretores)} corretores` : "não mexeu"}
            {s.ticket != null ? ` · ticket ${brl(s.ticket)}` : ""}
            {s.margem_pct != null ? ` · margem ${nf(s.margem_pct)}%` : ""}
          </p>
        </div>
        <div>
          <p className="metric-label mb-1">Resposta média no chat</p>
          <p className="text-foreground">
            {s.resp_media_s != null ? `${Number(s.resp_media_s).toLocaleString("pt-BR")} s` : "—"}
          </p>
        </div>
        {(s.contato_whatsapp || s.contato_email) && (
          <div>
            <p className="metric-label mb-1">Contato</p>
            <p className="text-foreground">
              {s.contato_whatsapp && (
                <a
                  className="underline underline-offset-2"
                  href={linkZap(s.contato_whatsapp)}
                  target="_blank"
                  rel="noreferrer"
                >
                  {s.contato_whatsapp}
                </a>
              )}
              {s.contato_whatsapp && s.contato_email ? " · " : ""}
              {s.contato_email && (
                <a className="underline underline-offset-2" href={`mailto:${s.contato_email}`}>
                  {s.contato_email}
                </a>
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ImersoesPage() {
  const [dias, setDias] = useState(30);
  const [soContato, setSoContato] = useState(false);
  const [aberta, setAberta] = useState<string | null>(null);
  const admin = usePulsoAdmin();
  const { data, isLoading, error } = usePulsoSessoes(dias, admin.data === true);

  const todas = data ?? [];
  const lista = soContato ? todas.filter((s) => s.contato_pedido_em) : todas;
  const chegaramValor = todas.filter((s) => s.ato_max >= 3).length;
  const pediram = todas.filter((s) => s.contato_pedido_em).length;
  const mediaSinais = todas.length
    ? todas.reduce((a, s) => a + s.sinais.length, 0) / todas.length
    : 0;

  if (admin.isLoading) {
    return (
      <DashboardLayout>
        <div className="h-6 w-40 rounded bg-muted animate-pulse" />
      </DashboardLayout>
    );
  }

  if (!admin.data) {
    return (
      <DashboardLayout>
        <div className="chart-card max-w-xl">
          <h1 className="text-lg font-bold text-foreground">Imersões</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Esta tela é da equipe da PIPA. O seu acesso não inclui as imersões.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 sm:mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Imersões</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Quem entrou no PULSO, o que explorou e quem pediu contato
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
          <Select value={String(dias)} onValueChange={(v) => setDias(Number(v))}>
            <SelectTrigger className="w-[120px] h-8 sm:h-9 text-xs sm:text-sm border-border text-muted-foreground">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PERIODOS_PULSO.map((p) => (
                <SelectItem key={p.valor} value={String(p.valor)}>
                  {p.rotulo}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {error && (
        <div className="chart-card mb-6 border-destructive/40">
          <h3 className="text-sm font-semibold text-foreground mb-1">
            Não consegui ler as imersões
          </h3>
          <p className="text-[13px] text-muted-foreground">
            {(error as Error).message}. Confirme que o arquivo{" "}
            <code className="text-xs">pipa-pulso-sessoes.sql</code> rodou neste projeto do Supabase.
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <StatCard
          title="Sessões"
          value={isLoading ? "—" : nf(todas.length)}
          change={0}
          icon={QrCode}
          loading={isLoading}
        />
        <StatCard
          title="Chegaram ao valor"
          value={isLoading ? "—" : nf(chegaramValor)}
          change={0}
          icon={CheckCircle2}
          delay={0.05}
          loading={isLoading}
        />
        <StatCard
          title="Pediram contato"
          value={isLoading ? "—" : nf(pediram)}
          change={0}
          icon={Phone}
          delay={0.1}
          loading={isLoading}
        />
        <StatCard
          title="Sinais lidos (média)"
          value={isLoading ? "—" : `${mediaSinais.toLocaleString("pt-BR", { maximumFractionDigits: 1 })} / 3`}
          change={0}
          icon={Users}
          delay={0.15}
          loading={isLoading}
        />
      </div>

      <div className="chart-card p-0 overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-border">
          <div>
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
              Sessões
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Mais recentes primeiro. Toque numa linha para ver o passo a passo.
            </p>
          </div>
          <label className="flex items-center gap-2 text-[13px] text-muted-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={soContato}
              onChange={(e) => setSoContato(e.target.checked)}
            />
            Só quem pediu contato
          </label>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] border-collapse">
            <thead>
              <tr className="bg-secondary/40">
                {["Quando", "Quem", "Papel", "Origem", "Avanço", "Sinais", "Ações", "Contato"].map(
                  (t) => (
                    <th
                      key={t}
                      className="px-3 py-2.5 text-left text-[10px] font-bold uppercase tracking-wider text-muted-foreground whitespace-nowrap"
                    >
                      {t}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {lista.length === 0 && !isLoading && (
                <tr>
                  <td colSpan={8} className="px-5 py-8 text-center text-sm text-muted-foreground">
                    {soContato
                      ? "Ninguém pediu contato neste período."
                      : "Nenhuma imersão neste período. Compartilhe o link ou o QR do PULSO."}
                  </td>
                </tr>
              )}
              {lista.map((s) => (
                <Fragment key={s.id}>
                  <tr
                    className="border-b border-border/50 hover:bg-secondary/30 cursor-pointer"
                    onClick={() => setAberta(aberta === s.id ? null : s.id)}
                  >
                    <td className="px-3 py-2.5 text-xs tabular-nums text-muted-foreground whitespace-nowrap">
                      {quando(s.atualizada_em)}
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="block text-[13px] font-semibold text-foreground">
                        {s.nome ?? "Sem nome"}
                      </span>
                      <span className="block text-[11px] text-muted-foreground">
                        {s.incorporadora ?? ""}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-[13px] text-foreground capitalize">
                      {s.papel ?? "—"}
                    </td>
                    <td className="px-3 py-2.5 text-[13px] text-muted-foreground">
                      {s.origem ?? "direto"}
                    </td>
                    <td className="px-3 py-2.5">
                      <Progresso ato={s.ato_max} />
                    </td>
                    <td className="px-3 py-2.5 text-[13px] tabular-nums text-foreground">
                      {s.sinais.length}/3
                    </td>
                    <td className="px-3 py-2.5 text-[13px] tabular-nums text-foreground">
                      {s.acoes}
                    </td>
                    <td className="px-3 py-2.5 text-[13px]">
                      {s.contato_pedido_em ? (
                        <span
                          className="font-semibold"
                          style={{ color: "hsl(var(--primary))" }}
                          title={
                            s.contato_avisado_em
                              ? "Você já foi avisado no WhatsApp"
                              : "Aviso ainda não enviado"
                          }
                        >
                          Pediu{s.contato_avisado_em ? " ✓" : ""}
                        </span>
                      ) : (
                        <span className="text-muted-foreground/60">—</span>
                      )}
                    </td>
                  </tr>
                  {aberta === s.id && (
                    <tr className="border-b border-border/50">
                      <td colSpan={8} className="p-0">
                        <Detalhe s={s} />
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
