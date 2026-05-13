// ─── Tipos del módulo Roadmap ──────────────────────────────
// Define la forma del CSV una vez que fue parseado y normalizado.
// Este tipo es compartido entre el parser (utils/), el servicio (services/)
// y el hook (hooks/), por eso vive en su propio archivo.

// Resultado de parsear un CSV de roadmap.
export interface ParsedRoadmap {
  headers: string[];               // Nombres de todas las columnas
  monthCols: string[];             // Solo las columnas que representan meses (ej: ['ENE', 'FEB'])
  rows: Record<string, string>[]; // Filas como objetos { columna: valor }
}
