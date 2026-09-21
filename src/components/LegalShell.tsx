import { Link } from "react-router-dom";
import { BrandMark } from "./BrandMark";
import { ArrowLeft } from "lucide-react";
import { CNPJ, ENDERECO, RAZAO_SOCIAL, VIGENCIA_DOCUMENTOS } from "../config/contato";

/**
 * Moldura das páginas legais.
 *
 * Fica FORA do DashboardLayout de propósito: Termos e Privacidade precisam
 * abrir sem sessão, porque são linkados da tela de entrada.
 */
export function LegalShell({
  titulo,
  resumo,
  children,
}: {
  titulo: string;
  resumo: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex h-16 w-full max-w-3xl items-center justify-between gap-4 px-6">
          <BrandMark size={30} tone="black" />
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Link>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-6 py-12">
        <div className="flex flex-col gap-3">
          <span className="metric-label">Documento</span>
          <h1 className="m-0 font-display text-[36px] font-bold leading-tight text-foreground">
            {titulo}
          </h1>
          <p className="m-0 text-base leading-relaxed text-muted-foreground">{resumo}</p>
          <p className="m-0 font-mono text-xs text-muted-foreground">
            Vigente desde {VIGENCIA_DOCUMENTOS}
          </p>
        </div>

        <div className="flex flex-col gap-8">{children}</div>

        <footer className="flex flex-col gap-1 border-t border-border pt-6 text-xs leading-relaxed text-muted-foreground">
          <span>{RAZAO_SOCIAL}</span>
          <span>CNPJ {CNPJ}</span>
          {ENDERECO && <span>{ENDERECO}</span>}
        </footer>
      </main>
    </div>
  );
}

export function Secao({ n, titulo, children }: { n: string; titulo: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="m-0 flex items-baseline gap-3 font-display text-xl font-semibold text-foreground">
        <span className="font-mono text-sm text-muted-foreground">{n}</span>
        {titulo}
      </h2>
      <div className="flex flex-col gap-3 text-[15px] leading-relaxed text-muted-foreground">
        {children}
      </div>
    </section>
  );
}

/**
 * Marca um trecho que depende de decisão jurídica.
 *
 * Aparece na tela de propósito: um placeholder visível obriga a revisão
 * antes da publicação. Um texto jurídico inventado que parecesse pronto
 * seria pior — passaria despercebido e viraria compromisso legal falso.
 */
export function AjustarJuridico({ children }: { children: React.ReactNode }) {
  return (
    <p className="m-0 rounded-lg border border-dashed border-primary/50 bg-primary/5 px-4 py-3 text-sm text-foreground">
      <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-pipa-orange-dark">
        revisar com o jurídico ·{" "}
      </span>
      {children}
    </p>
  );
}
