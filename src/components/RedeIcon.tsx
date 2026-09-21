interface IconProps {
  className?: string;
  strokeWidth?: number;
}

/**
 * Ícone da Rede de Parceiros.
 *
 * O `Network` do lucide desenha um organograma — hierarquia, chefe e
 * subordinados. A rede da PIPA não é isso: são nós conectados entre si,
 * exatamente a malha do símbolo da marca (manual, p. 14). Este ícone
 * repete aquela geometria, então o menu conversa com a identidade.
 */
export function RedeIcon({ className, strokeWidth = 1.8 }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* arestas primeiro, para os nós ficarem por cima */}
      <path d="M6.9 7.2 17 8.6" />
      <path d="M6 8.1 11 17" />
      <path d="M18 11 13 17.2" />
      <circle cx="5" cy="6" r="2.2" />
      <circle cx="19" cy="9" r="2.2" />
      <circle cx="12" cy="19" r="2.2" />
    </svg>
  );
}
