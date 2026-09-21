import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "../components/DashboardLayout";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../hooks/use-theme";
import { CONTATO_SUPORTE, mailto } from "../config/contato";
import { Check, LogOut, Monitor, Moon, Sun } from "lucide-react";

/**
 * Configurações.
 *
 * Só entra aqui o que a plataforma de fato controla hoje: identificação da
 * sessão, aparência e encerramento. Nada de interruptor desligado à espera
 * de backend — um controle que não faz nada é pior que a ausência dele.
 */
export default function SettingsPage() {
  const { user, clientId, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const isDark = theme === "dark";

  const sair = async () => {
    await signOut();
    navigate("/login", { replace: true });
  };

  return (
    <DashboardLayout>
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 py-2">
        <div className="flex flex-col gap-2">
          <span className="metric-label">Conta</span>
          <h1 className="m-0 font-display text-[32px] font-bold leading-tight text-foreground">
            Configurações
          </h1>
        </div>

        {/* Identificação */}
        <section className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6">
          <h2 className="m-0 font-display text-lg font-semibold text-foreground">Sua conta</h2>

          <dl className="m-0 flex flex-col divide-y divide-border">
            <div className="flex items-baseline justify-between gap-4 py-3 first:pt-0">
              <dt className="text-sm text-muted-foreground">E-mail</dt>
              <dd className="m-0 truncate text-sm font-semibold text-foreground">
                {user?.email ?? "—"}
              </dd>
            </div>
            <div className="flex items-baseline justify-between gap-4 py-3">
              <dt className="text-sm text-muted-foreground">Identificador do cliente</dt>
              <dd className="m-0 truncate font-mono text-sm text-foreground">
                {clientId ?? "não vinculado"}
              </dd>
            </div>
            <div className="flex items-baseline justify-between gap-4 py-3 last:pb-0">
              <dt className="text-sm text-muted-foreground">Acesso desde</dt>
              <dd className="m-0 text-sm text-foreground">
                {user?.created_at
                  ? new Date(user.created_at).toLocaleDateString("pt-BR")
                  : "—"}
              </dd>
            </div>
          </dl>

          <p className="m-0 text-sm leading-relaxed text-muted-foreground">
            Nome, cargo e permissões são definidos pelo administrador da sua
            incorporadora. Para alterar,{" "}
            <a
              href={mailto(CONTATO_SUPORTE, "Alteração de cadastro na PIPADriven")}
              className="font-semibold text-foreground underline decoration-primary decoration-2 underline-offset-4"
            >
              fale com o suporte
            </a>
            .
          </p>
        </section>

        {/* Aparência */}
        <section className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6">
          <div className="flex flex-col gap-1">
            <h2 className="m-0 font-display text-lg font-semibold text-foreground">Aparência</h2>
            <p className="m-0 text-sm text-muted-foreground">
              A escolha fica salva neste navegador.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={() => isDark && toggleTheme()}
              aria-pressed={!isDark}
              className={`flex flex-1 items-center gap-3 rounded-lg border p-4 text-left transition-colors ${
                !isDark ? "border-primary bg-primary/5" : "border-border hover:border-input"
              }`}
            >
              <Sun className="h-5 w-5 shrink-0 text-muted-foreground" />
              <span className="flex flex-col">
                <span className="text-sm font-semibold text-foreground">Claro</span>
                <span className="text-xs text-muted-foreground">Padrão da marca</span>
              </span>
              {!isDark && <Check className="ml-auto h-4 w-4 shrink-0 text-pipa-orange-dark" />}
            </button>

            <button
              type="button"
              onClick={() => !isDark && toggleTheme()}
              aria-pressed={isDark}
              className={`flex flex-1 items-center gap-3 rounded-lg border p-4 text-left transition-colors ${
                isDark ? "border-primary bg-primary/5" : "border-border hover:border-input"
              }`}
            >
              <Moon className="h-5 w-5 shrink-0 text-muted-foreground" />
              <span className="flex flex-col">
                <span className="text-sm font-semibold text-foreground">Escuro</span>
                <span className="text-xs text-muted-foreground">Para telas em plantão</span>
              </span>
              {isDark && <Check className="ml-auto h-4 w-4 shrink-0 text-pipa-orange-dark" />}
            </button>
          </div>
        </section>

        {/* Sessão */}
        <section className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6">
          <div className="flex flex-col gap-1">
            <h2 className="m-0 font-display text-lg font-semibold text-foreground">Sessão</h2>
            <p className="m-0 text-sm text-muted-foreground">
              Encerra o acesso apenas neste dispositivo.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={sair}
              className="inline-flex h-11 items-center gap-2 rounded-lg border border-destructive/30 px-4 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/10"
            >
              <LogOut className="h-4 w-4" />
              Sair da conta
            </button>
            <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <Monitor className="h-3.5 w-3.5" />
              Conexão segura por sessão autenticada
            </span>
          </div>
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
