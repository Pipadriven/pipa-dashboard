import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { BrandMark } from "../components/BrandMark";
import { AlertCircle, ArrowRight, Check, Eye, EyeOff, Loader2 } from "lucide-react";

/**
 * Definir nova senha.
 *
 * Fecha o fluxo de recuperação: o e-mail do Supabase leva para cá com uma
 * sessão de recuperação já estabelecida, e aqui a senha é gravada. Sem
 * esta tela o link do e-mail cairia na raiz do app sem nada para fazer —
 * e o "Esqueci minha senha" seria um botão que só parece funcionar.
 */
export default function NovaSenhaPage() {
  const [senha, setSenha] = useState("");
  const [confirmacao, setConfirmacao] = useState("");
  const [mostrar, setMostrar] = useState(false);
  const [erro, setErro] = useState("");
  const [pronto, setPronto] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [sessaoValida, setSessaoValida] = useState<boolean | null>(null);
  const navigate = useNavigate();

  // O link do e-mail cria uma sessão de recuperação. Sem ela, não há o que fazer.
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSessaoValida(!!data.session));
  }, []);

  const salvar = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");

    if (senha.length < 6) {
      setErro("A senha precisa de pelo menos 6 caracteres.");
      return;
    }
    if (senha !== confirmacao) {
      setErro("As duas senhas não são iguais.");
      return;
    }

    setSalvando(true);
    const { error } = await supabase.auth.updateUser({ password: senha });
    setSalvando(false);

    if (error) {
      setErro(
        error.message.toLowerCase().includes("same")
          ? "A nova senha precisa ser diferente da anterior."
          : "Não foi possível salvar a nova senha. Peça um novo link de recuperação.",
      );
      return;
    }

    setPronto(true);
    setTimeout(() => navigate("/", { replace: true }), 1800);
  };

  const campo =
    "h-[52px] w-full rounded-lg border border-input bg-card px-4 text-base text-foreground " +
    "placeholder:text-muted-foreground/70 focus-visible:outline-none focus-visible:ring-2 " +
    "focus-visible:ring-primary focus-visible:border-primary transition-colors";

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-8 bg-background p-6">
      <BrandMark size={44} tone="black" />

      <main className="flex w-full max-w-[420px] flex-col gap-8">
        {pronto ? (
          <div className="flex flex-col items-center gap-4 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/15">
              <Check className="h-6 w-6 text-pipa-orange-dark" />
            </span>
            <h1 className="m-0 font-display text-[28px] font-bold text-foreground">
              Senha alterada
            </h1>
            <p className="m-0 text-base text-muted-foreground">Levando você para o painel…</p>
          </div>
        ) : sessaoValida === false ? (
          <div className="flex flex-col gap-4 text-center">
            <h1 className="m-0 font-display text-[28px] font-bold text-foreground">
              Link expirado
            </h1>
            <p className="m-0 text-base leading-relaxed text-muted-foreground">
              Este link de recuperação não vale mais. Peça um novo na tela de entrada.
            </p>
            <button
              type="button"
              onClick={() => navigate("/login", { replace: true })}
              className="mx-auto inline-flex h-12 items-center gap-2 rounded-lg bg-primary px-6 font-display text-base font-semibold text-primary-foreground transition-colors hover:bg-pipa-orange-dark"
            >
              Voltar para a entrada
              <ArrowRight className="h-[18px] w-[18px]" />
            </button>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-2.5 text-center">
              <h1 className="m-0 font-display text-[32px] font-bold leading-tight text-foreground">
                Definir nova senha
              </h1>
              <p className="m-0 text-base text-muted-foreground">
                Escolha uma senha que você ainda não use em outro lugar.
              </p>
            </div>

            <div aria-live="polite">
              {erro && (
                <div
                  role="alert"
                  className="flex items-start gap-3 rounded-lg border border-destructive/25 bg-destructive/10 p-4"
                >
                  <AlertCircle className="mt-0.5 h-[18px] w-[18px] shrink-0 text-destructive" />
                  <span className="text-sm leading-relaxed text-destructive">{erro}</span>
                </div>
              )}
            </div>

            <form onSubmit={salvar} className="flex flex-col gap-5" noValidate>
              <div className="flex flex-col gap-2">
                <label htmlFor="nova" className="text-sm font-semibold text-foreground">
                  Nova senha
                </label>
                <div className="relative flex items-center">
                  <input
                    id="nova"
                    type={mostrar ? "text" : "password"}
                    autoComplete="new-password"
                    autoFocus
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    placeholder="Mínimo de 6 caracteres"
                    className={`${campo} pr-[52px]`}
                  />
                  <button
                    type="button"
                    onClick={() => setMostrar((v) => !v)}
                    aria-label={mostrar ? "Ocultar senha" : "Mostrar senha"}
                    aria-pressed={mostrar}
                    className="absolute right-1.5 flex h-11 w-11 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {mostrar ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="confirmar" className="text-sm font-semibold text-foreground">
                  Repetir a nova senha
                </label>
                <input
                  id="confirmar"
                  type={mostrar ? "text" : "password"}
                  autoComplete="new-password"
                  value={confirmacao}
                  onChange={(e) => setConfirmacao(e.target.value)}
                  placeholder="Digite de novo"
                  className={campo}
                />
              </div>

              <button
                type="submit"
                disabled={salvando}
                className="flex h-[52px] items-center justify-center gap-2.5 rounded-lg bg-primary font-display text-base font-semibold text-primary-foreground transition-colors hover:bg-pipa-orange-dark disabled:cursor-not-allowed disabled:opacity-60"
              >
                {salvando ? (
                  <>
                    <Loader2 className="h-[18px] w-[18px] animate-spin" />
                    Salvando…
                  </>
                ) : (
                  "Salvar nova senha"
                )}
              </button>
            </form>
          </>
        )}
      </main>
    </div>
  );
}
