const FORMULA_PREFIXES = new Set(['=', '+', '-', '@', '\t', '\r']);

function escapeCell(value: string | number | null | undefined): string {
  const text = value === null || value === undefined ? '' : String(value);
  const safe = FORMULA_PREFIXES.has(text.charAt(0)) ? `'${text}` : text;
  return /[",\n\r]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe;
}

export function toCsv(header: string[], rows: Array<Array<string | number | null | undefined>>): string {
  return [header, ...rows].map((row) => row.map(escapeCell).join(',')).join('\r\n');
}

export function downloadCsv(fileName: string, content: string) {
  const file = new Blob([`﻿${content}`], { type: 'text/csv;charset=utf-8' });
  const element = document.createElement('a');
  element.href = URL.createObjectURL(file);
  element.download = fileName;
  element.click();
  URL.revokeObjectURL(element.href);
}
