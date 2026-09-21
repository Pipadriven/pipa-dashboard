import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { BrandMark } from "../components/BrandMark";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404: rota inexistente acessada:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-8 bg-background p-6">
      <BrandMark size={40} tone="black" />

      <div className="flex max-w-[420px] flex-col items-center gap-4 text-center">
        <span className="metric-label">Erro 404</span>
        <h1 className="m-0 font-display text-[32px] font-bold leading-tight text-foreground">
          Esta página não existe
        </h1>
        <p className="m-0 text-base leading-relaxed text-muted-foreground">
          O endereço <span className="font-mono text-sm text-foreground">{location.pathname}</span>{" "}
          não corresponde a nenhuma tela da plataforma. Pode ser um link antigo.
        </p>
        <Link
          to="/"
          className="mt-2 inline-flex h-12 items-center gap-2.5 rounded-lg bg-primary px-6 font-display text-base font-semibold text-primary-foreground transition-colors hover:bg-pipa-orange-dark"
        >
          <ArrowLeft className="h-[18px] w-[18px]" />
          Voltar para a Visão Geral
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
