// ─── Servicio de carga de CSV ──────────────────────────────
// Responsabilidad única: hablar con la API interna /api/csv
// y devolver los datos ya parseados.
//
// Los componentes y hooks nunca hacen fetch() directamente;
// siempre pasan por este servicio, que centraliza la URL,
// el manejo de errores HTTP y la validación de la respuesta.

import { parseCSV } from '@/utils/csvParser';
import type { ParsedRoadmap } from '@/types/roadmap.types';

// Obtiene un CSV desde una URL pública, pasando por el proxy interno
// (/api/csv) para evitar problemas de CORS.
// Lanza un Error con mensaje legible si algo falla.
export async function fetchCsvData(url: string): Promise<ParsedRoadmap> {
  // El endpoint /api/csv actúa como proxy: recibe la URL y devuelve el texto plano
  const res = await fetch(`/api/csv?url=${encodeURIComponent(url)}`);
  if (!res.ok) throw new Error(`Error al obtener el CSV (HTTP ${res.status})`);

  const text = await res.text();

  // El proxy devuelve JSON con "error" cuando la URL remota falla
  if (text.startsWith('{') && text.includes('"error"')) {
    const json = JSON.parse(text) as { error: string };
    throw new Error(json.error);
  }

  // Parsear el texto a estructura tipada
  const parsed = parseCSV(text);
  if (parsed.headers.length === 0) throw new Error('CSV vacío o formato no reconocido');
  return parsed;
}
