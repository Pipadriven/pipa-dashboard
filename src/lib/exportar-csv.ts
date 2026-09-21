/**
 * Geração de CSV no navegador.
 *
 * Separador ponto e vírgula e BOM UTF-8 de propósito: é o que o Excel em
 * português abre sem pedir assistente de importação. Vírgula quebraria os
 * valores em reais, que já usam vírgula decimal.
 */

function celula(v: string | number | null | undefined): string {
  if (v === null || v === undefined) return "";
  const s = String(v);
  return /[;"\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function baixarCSV(nomeArquivo: string, linhas: Array<Array<string | number | null>>) {
  const conteudo = linhas.map((l) => l.map(celula).join(";")).join("\r\n");
  const blob = new Blob(["﻿" + conteudo], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = nomeArquivo;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/** Data no formato que vira nome de arquivo ordenável: 2026-09-21 */
export function carimboDeData(d = new Date()): string {
  return d.toISOString().slice(0, 10);
}
