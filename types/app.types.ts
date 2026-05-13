// ─── Tipos globales de la aplicación ──────────────────────
// Centraliza los tipos compartidos entre múltiples componentes.
// Si un tipo se usa en más de un archivo, vive acá.

import type { ParsedSheet } from '@/lib/data';

// Representa la página activa y los parámetros de navegación.
// Todos los cambios de ruta pasan por este objeto.
export interface Route {
  page: string;       // Nombre de la página activa (ej: 'dashboard', 'team-detail')
  teamId?: string;    // ID del equipo cuando se navega a un detalle de equipo
  productId?: string; // ID del producto cuando se navega a detalle de producto
  productTab?: string; // Pestaña inicial dentro del detalle de producto
  activeTeam?: string; // Equipo seleccionado en la vista de miembro
}

// Estructura de permisos por equipo y por rol.
// Forma: { [teamId]: { [roleId]: string[] } }
export type PermissionsState = Record<string, Record<string, string[]>>;

// Las dos pestañas posibles dentro de un detalle de producto.
export type DocTab = 'homologacion' | 'roadmap';

// Documentos cargados por producto, organizados por pestaña.
// Forma: { [productId]: { homologacion: ParsedSheet | null, roadmap: ParsedSheet | null } }
export type ProductDocs = Record<string, Record<DocTab, ParsedSheet | null>>;
