import React from "react";

/**
 * Sem isto, qualquer erro de renderização derruba a árvore inteira e o
 * navegador mostra uma página em branco — sem pista nenhuma do que quebrou.
 */
export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { erro: Error | null }
> {
  state = { erro: null as Error | null };

  static getDerivedStateFromError(erro: Error) {
    return { erro };
  }

  componentDidCatch(erro: Error, info: React.ErrorInfo) {
    console.error("[PIPADriven] erro de renderização:", erro, info.componentStack);
  }

  render() {
    if (!this.state.erro) return this.props.children;
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-background">
        <div className="max-w-lg w-full rounded-xl border border-border bg-card p-6">
          <h1 className="text-lg font-bold text-foreground mb-1">Algo quebrou nesta tela</h1>
          <p className="text-sm text-muted-foreground mb-4">
            O restante do sistema continua funcionando. Recarregue a página; se persistir,
            copie a mensagem abaixo.
          </p>
          <pre className="text-xs bg-muted rounded-lg p-3 overflow-x-auto text-foreground whitespace-pre-wrap">
            {this.state.erro.message}
          </pre>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 text-sm font-semibold rounded-lg bg-primary text-primary-foreground"
          >
            Recarregar
          </button>
        </div>
      </div>
    );
  }
}
