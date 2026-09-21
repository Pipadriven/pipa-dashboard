/**
 * Canais de contato e identificação da PIPA, usados em Ajuda, Termos,
 * Privacidade e nas páginas de módulo em preparação.
 *
 * Hoje os três canais apontam para a mesma caixa. Quando existirem
 * endereços separados, é trocar aqui — todas as telas leem deste arquivo.
 */

const CAIXA_UNICA = "pipadriven@gmail.com";

export const CONTATO_COMERCIAL = CAIXA_UNICA;
export const CONTATO_SUPORTE = CAIXA_UNICA;
export const CONTATO_PRIVACIDADE = CAIXA_UNICA;

/** Usado no rodapé de Termos e Privacidade. */
export const RAZAO_SOCIAL = "PIPA Driven LTDA";
export const CNPJ = "59.712.201/0001-64";
/** Endereço omitido por ora — o rodapé não renderiza linha vazia. */
export const ENDERECO = "";

/** Data da última revisão dos documentos legais. */
export const VIGENCIA_DOCUMENTOS = "[DATA — preencher na publicação]";

export function mailto(para: string, assunto: string, corpo?: string) {
  const params = new URLSearchParams({ subject: assunto });
  if (corpo) params.set("body", corpo);
  return `mailto:${para}?${params.toString()}`;
}
