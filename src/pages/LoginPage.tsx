import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { BrandMark } from '../components/BrandMark';
import { AlertCircle, ArrowRight, Eye, EyeOff, Loader2, MailCheck, ShieldCheck } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { CONTATO_SUPORTE, mailto } from '../config/contato';

/**
 * As mensagens do Supabase chegam em inglês e genéricas
 * ("Invalid login credentials"). Quem entra aqui é diretoria comercial,
 * não suporte técnico: traduzimos para o que dá pra fazer a respeito.
 */
function mensagemDeErro(raw: string): string {
  const m = raw.toLowerCase();
  if (m.includes('invalid login credentials'))
    return 'E-mail ou senha incorretos. Confira os dados e tente de novo.';
  if (m.includes('email not confirmed'))
    return 'Este e-mail ainda não foi confirmado. Procure o convite na sua caixa de entrada.';
  if (m.includes('too many requests') || m.includes('rate limit'))
    return 'Tentativas demais em pouco tempo. Aguarde um minuto antes de tentar de novo.';
  if (m.includes('network') || m.includes('fetch'))
    return 'Não conseguimos falar com o servidor. Verifique sua conexão.';
  return 'Não foi possível entrar agora. Se continuar, fale com o administrador da sua conta.';
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [aviso, setAviso] = useState('');
  const [loading, setLoading] = useState(false);
  const [enviandoLink, setEnviandoLink] = useState(false);
  const { signIn, user } = useAuth();
  const navigate = useNavigate();

  // Redirect em efeito, não durante o render — antes isso disparava
  // navigate() no meio da renderização e avisava no console.
  useEffect(() => {
    if (user) navigate('/', { replace: true });
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      setError(mensagemDeErro(error.message));
      setLoading(false);
      return;
    }

    navigate('/', { replace: true });
    setLoading(false);
  };

  /** Dispara o e-mail de recuperação do Supabase. O link cai em /nova-senha. */
  const recuperarSenha = async () => {
    setError('');
    setAviso('');

    if (!email.trim()) {
      setError('Escreva seu e-mail no campo acima para receber o link de recuperação.');
      document.getElementById('email')?.focus();
      return;
    }

    setEnviandoLink(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/nova-senha`,
    });
    setEnviandoLink(false);

    // Resposta igual com e-mail existente ou não: dizer "este e-mail não existe"
    // entregaria a quem tem acesso à plataforma.
    if (error && error.message.toLowerCase().includes('rate')) {
      setError('Já pedimos um link há pouco. Aguarde um minuto antes de tentar de novo.');
      return;
    }
    setAviso(`Se houver conta para ${email.trim()}, o link de recuperação chega em instantes.`);
  };

  const campo =
    'h-[52px] w-full rounded-lg border border-input bg-card px-4 text-base text-foreground ' +
    'placeholder:text-muted-foreground/70 focus-visible:outline-none focus-visible:ring-2 ' +
    'focus-visible:ring-primary focus-visible:border-primary transition-colors';

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-between bg-background p-6 sm:p-10">
      <div className="flex w-full max-w-[420px] justify-end py-2">
        <a
          href={mailto(CONTATO_SUPORTE, 'Não consigo acessar a PIPADriven')}
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          Precisa de ajuda?
        </a>
      </div>

      <main className="flex w-full max-w-[420px] flex-col gap-8 py-8">
        {/* Assinatura em preto sobre o neutro claro. Símbolo e lettering na
            MESMA cor — o manual (p. 11) trata marca bicolor como uso incorreto. */}
        <BrandMark size={44} tone="black" className="self-center" />

        <div className="flex flex-col gap-2.5 text-center">
          <h1 className="m-0 font-display text-[32px] font-bold leading-tight text-foreground">
            Entrar na plataforma
          </h1>
          <p className="m-0 text-base text-muted-foreground">
            Use o e-mail corporativo cadastrado pela sua incorporadora.
          </p>
        </div>

        {/* aria-live: leitores de tela anunciam o erro sem o usuário
            ter que sair do campo e procurar. */}
        <div aria-live="polite" className="flex flex-col gap-3">
          {aviso && (
            <div className="flex items-start gap-3 rounded-lg border border-border bg-card p-4">
              <MailCheck className="mt-0.5 h-[18px] w-[18px] shrink-0 text-pipa-orange-dark" />
              <span className="text-sm leading-relaxed text-muted-foreground">{aviso}</span>
            </div>
          )}
          {error && (
            <div
              role="alert"
              className="flex items-start gap-3 rounded-lg border border-destructive/25 bg-destructive/10 p-4"
            >
              <AlertCircle className="mt-0.5 h-[18px] w-[18px] shrink-0 text-destructive" />
              <span className="text-sm leading-relaxed text-destructive">{error}</span>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-semibold text-foreground">
              E-mail corporativo
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              autoFocus
              required
              placeholder="nome@incorporadora.com.br"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={error ? true : undefined}
              className={campo}
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-baseline justify-between gap-3">
              <label htmlFor="senha" className="text-sm font-semibold text-foreground">
                Senha
              </label>
              <button
                type="button"
                onClick={recuperarSenha}
                disabled={enviandoLink}
                className="text-[13px] font-semibold text-muted-foreground transition-colors hover:text-foreground disabled:opacity-60"
              >
                {enviandoLink ? 'Enviando…' : 'Esqueci minha senha'}
              </button>
            </div>
            <div className="relative flex items-center">
              <input
                id="senha"
                name="senha"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                minLength={6}
                placeholder="Mínimo de 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={error ? true : undefined}
                className={`${campo} pr-[52px]`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                aria-pressed={showPassword}
                className="absolute right-1.5 flex h-11 w-11 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <input
              id="lembrar"
              name="lembrar"
              type="checkbox"
              className="h-[18px] w-[18px] accent-primary"
            />
            <label htmlFor="lembrar" className="text-sm text-muted-foreground">
              Manter conectado neste dispositivo
            </label>
          </div>

          {/* Preto sobre laranja: 10,9:1. O branco de antes dava 2,1:1. */}
          <button
            type="submit"
            disabled={loading}
            className="flex h-[52px] items-center justify-center gap-2.5 rounded-lg bg-primary font-display text-base font-semibold text-primary-foreground transition-colors hover:bg-pipa-orange-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="h-[18px] w-[18px] animate-spin" />
                Entrando…
              </>
            ) : (
              <>
                Entrar
                <ArrowRight className="h-[18px] w-[18px]" />
              </>
            )}
          </button>
        </form>

        <p className="m-0 text-center text-sm leading-relaxed text-muted-foreground">
          Ainda não tem acesso?{' '}
          <a
            href={mailto(CONTATO_SUPORTE, 'Solicitação de acesso à PIPADriven')}
            className="font-semibold text-foreground underline decoration-primary decoration-2 underline-offset-4"
          >
            Solicite seu acesso
          </a>
        </p>
      </main>

      <footer className="flex w-full max-w-[420px] items-center justify-center gap-4 py-2">
        <span className="inline-flex items-center gap-1.5 metric-label !text-muted-foreground/70">
          <ShieldCheck className="h-3.5 w-3.5" />
          Conexão segura
        </span>
        <span className="h-[3px] w-[3px] rounded-full bg-border" />
        <a href="/privacidade" className="text-xs text-muted-foreground/70 hover:text-foreground">
          Privacidade
        </a>
        <a href="/termos" className="text-xs text-muted-foreground/70 hover:text-foreground">
          Termos
        </a>
      </footer>
    </div>
  );
}
