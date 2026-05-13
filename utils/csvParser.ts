// ─── Utilidades para parseo de CSV ────────────────────────
// Funciones puras: no tienen estado, no hacen llamadas a la red.
// Reciben texto y devuelven datos estructurados.

import type { ParsedRoadmap } from '@/types/roadmap.types';

// Nombres de los meses en español abreviado, usados para detectar
// columnas de mes dentro del CSV del roadmap.
export const MONTH_NAMES = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];

// Convierte el texto crudo de un CSV en una estructura tipada.
// Soporta dos formatos:
//   1. Roadmap propio (primera columna = "Funcionalidades")
//   2. CSV genérico con encabezados en la primera fila
export function parseCSV(text: string): ParsedRoadmap {
  // Normalizar saltos de línea para compatibilidad cross-platform
  const normalized = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const lines = normalized.split('\n');

  // Detectar automáticamente si el separador es coma o punto y coma
  const sample = lines.find((l) => l.trim().length > 0) || '';
  const delimiter = (sample.match(/;/g) || []).length >= (sample.match(/,/g) || []).length ? ';' : ',';

  // Divide una línea respetando comillas y eliminando espacios extra
  const parseRow = (line: string) =>
    line.split(delimiter).map((c) => c.trim().replace(/^"|"$/g, ''));

  // ── Formato Roadmap ──────────────────────────────────────
  // Se reconoce porque tiene una fila con "Funcionalidades" en la primera celda.
  // La estructura es: fila de label → fila de meses → filas de datos.
  const funcIdx = lines.findIndex((l) => parseRow(l)[0] === 'Funcionalidades');
  if (funcIdx !== -1) {
    const monthCells = funcIdx + 1 < lines.length ? parseRow(lines[funcIdx + 1]) : [];
    const months: string[] = [];
    const monthColIdxs: number[] = [];

    // Las columnas de mes arrancan desde el índice 3 (después de Func / Producto / Versiones)
    monthCells.forEach((cell, i) => {
      if (i >= 3 && cell.trim()) { months.push(cell.trim()); monthColIdxs.push(i); }
    });

    const headers = ['Funcionalidades', 'Producto', 'Versiones', ...months];
    const rows: Record<string, string>[] = [];

    // Leer las filas de datos a partir de funcIdx + 2
    for (let i = funcIdx + 2; i < lines.length; i++) {
      const cells = parseRow(lines[i]);
      const func = cells[0]?.trim() ?? '';
      const prod = cells[1]?.trim() ?? '';
      const vers = cells[2]?.trim() ?? '';
      if (!func && !prod && !vers) continue;

      const row: Record<string, string> = { Funcionalidades: func, Producto: prod, Versiones: vers };

      // Para cada mes, tomar hasta 4 columnas y marcar '●' si alguna tiene contenido
      months.forEach((month, mIdx) => {
        const start = monthColIdxs[mIdx];
        const end = monthColIdxs[mIdx + 1] ?? cells.length;
        const slice = cells.slice(start, Math.min(start + 4, end));
        row[month] = slice.some((c) => c?.trim()) ? '●' : '';
      });
      rows.push(row);
    }

    return {
      headers,
      monthCols: months,
      rows: rows.filter((r) => r.Funcionalidades || r.Producto),
    };
  }

  // ── Formato CSV genérico ─────────────────────────────────
  // Primera fila son los encabezados; el resto son datos.
  const nonEmpty = lines.filter((l) => l.replace(/[;,\s]/g, '').length > 0);
  if (nonEmpty.length === 0) return { headers: [], monthCols: [], rows: [] };

  const headers = parseRow(nonEmpty[0]).filter(Boolean);
  // Detectar qué columnas corresponden a meses según MONTH_NAMES
  const monthCols = headers.filter((h) => MONTH_NAMES.includes(h.toUpperCase()));
  const rows: Record<string, string>[] = [];

  for (let i = 1; i < nonEmpty.length; i++) {
    const cells = parseRow(nonEmpty[i]);
    const row: Record<string, string> = {};
    headers.forEach((h, idx) => { row[h] = cells[idx] ?? ''; });
    // Ignorar filas completamente vacías
    if (Object.values(row).some((v) => v.trim())) rows.push(row);
  }

  return { headers, monthCols, rows };
}

// Formatea una fecha como HH:MM:SS en español (zona horaria Argentina).
// Se usa para mostrar la hora del último refresco de datos.
export function fmtTime(d: Date): string {
  return d.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}
