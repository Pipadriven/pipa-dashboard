import { FlaskConical } from "lucide-react";

/**
 * Marca telas cujos números ainda são fixos no código, não vindos do banco.
 * Sem isto, um número inventado é indistinguível de um número real.
 */
export function DemoBadge({ nota }: { nota?: string }) {
  return (
    <div className="flex items-start gap-2 mb-4 sm:mb-6 rounded-lg border border-dashed border-primary/40 bg-primary/5 px-3 py-2">
      <FlaskConical className="h-4 w-4 shrink-0 mt-0.5 text-primary" />
      <p className="text-xs sm:text-[13px] text-muted-foreground leading-snug">
        <span className="font-semibold text-foreground">Dados de demonstração.</span>{" "}
        {nota ?? "Os números desta tela ainda são de exemplo e não vêm do banco."}
      </p>
    </div>
  );
}
