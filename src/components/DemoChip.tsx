import { FlaskConical } from "lucide-react";

/**
 * Marca um card cujos números ainda são fixos no código.
 *
 * Na Visão Geral os KPIs do topo e a origem dos leads vêm do banco, mas
 * seis widgets abaixo deles ainda têm números escritos à mão. Sem marcação,
 * um print da tela mistura os dois e o cliente não tem como distinguir.
 *
 * É temporário por construção: quando o widget passar a ler do banco,
 * apague o chip junto.
 */
export function DemoChip({ titulo = "exemplo" }: { titulo?: string }) {
  return (
    <span
      className="inline-flex shrink-0 items-center gap-1 rounded border border-dashed px-1.5 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider"
      style={{
        color: "hsl(var(--muted-foreground))",
        borderColor: "hsl(var(--input))",
      }}
      title="Os números deste bloco ainda não vêm do banco — dependem de dado oficial do cliente"
    >
      <FlaskConical className="h-3 w-3" />
      {titulo}
    </span>
  );
}
