import symbolOrange from "../assets/pipa-symbol.png";
import symbolBlack from "../assets/pipa-symbol-black.png";

/**
 * Assinatura da marca, em um lugar só.
 *
 * ATENÇÃO — o manual (p. 11, "Usos incorretos") proíbe recompor a marca:
 * a assinatura é um arquivo fechado. O que está aqui é o símbolo oficial
 * mais o lettering TIPOGRAFADO em Archivo, que é o mais próximo possível
 * sem o arquivo original. Assim que o SVG da assinatura horizontal estiver
 * exportado, troque o conteúdo deste componente por um único <img> — todo
 * o resto do app já consome a marca por aqui.
 */

interface BrandMarkProps {
  /** Altura do símbolo em px. O lettering acompanha. */
  size?: number;
  /** Cor da assinatura INTEIRA — símbolo e lettering juntos.
   *  O manual (p. 11) trata marca bicolor como uso incorreto. */
  tone?: "orange" | "black";
  /** Só o símbolo, sem o lettering (sidebar recolhida, favicon, avatar). */
  symbolOnly?: boolean;
  className?: string;
}

export function BrandMark({
  size = 32,
  tone = "orange",
  symbolOnly = false,
  className = "",
}: BrandMarkProps) {
  // Símbolo e lettering sempre na mesma cor: trocar o tom troca os dois.
  const isOrange = tone === "orange";
  const symbol = isOrange ? symbolOrange : symbolBlack;
  const color = isOrange ? "hsl(var(--primary))" : "hsl(var(--foreground))";

  // O símbolo é 532×310. Sem largura explícita + shrink-0, um container
  // flex apertado (a sidebar recolhida) comprime só a largura e a marca
  // sai achatada — o manual (p. 11) chama isso de distorção.
  const ASPECTO = 532 / 310;

  return (
    <span className={`inline-flex shrink-0 items-center gap-2.5 ${className}`}>
      <img
        src={symbol}
        alt={symbolOnly ? "PIPADriven" : ""}
        aria-hidden={symbolOnly ? undefined : true}
        className="shrink-0"
        style={{
          height: size,
          width: Math.round(size * ASPECTO),
          objectFit: "contain",
        }}
      />
      {!symbolOnly && (
        <span
          className="font-display leading-none"
          style={{ fontSize: size * 0.56, letterSpacing: "-0.02em", color }}
        >
          <span className="font-extrabold">PIPA</span>
          <span className="font-bold italic">Driven</span>
        </span>
      )}
    </span>
  );
}
