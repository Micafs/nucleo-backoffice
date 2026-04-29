export type TeamId = 'integraciones' | 'tech' | 'producto';
export type RoleId = 'super' | 'admin' | 'member' | 'viewer';
export type UserStatus = 'active' | 'pending' | 'suspended';

export interface Team {
  id: TeamId;
  name: string;
  slug: string;
  description: string;
  color: string;
  glyph: string;
  resources: string[];
  icon: string;
}

export interface Membership {
  team: TeamId;
  role: 'admin' | 'member' | 'viewer';
}

export interface User {
  id: string;
  name: string;
  email: string;
  initials: string;
  color: string;
  status: UserStatus;
  lastSeen: string;
  memberships: Membership[];
}

export interface Permission {
  id: string;
  name: string;
  desc: string;
}

export interface PermissionGroup {
  id: string;
  label: string;
  icon: string;
  permissions: Permission[];
}

export interface Role {
  id: RoleId;
  label: string;
  desc: string;
}

export interface AuditEntry {
  time: string;
  actor: string;
  action: string;
  target: string;
  meta: string;
  icon: string;
}

export const TEAMS: Team[] = [
  {
    id: 'integraciones',
    name: 'Integraciones',
    slug: 'integraciones',
    description: 'APIs, webhooks y conexiones con partners externos.',
    color: 'var(--team-integraciones)',
    glyph: 'IN',
    resources: ['API Keys', 'Webhooks', 'Partners', 'Logs de integración'],
    icon: 'link',
  },
  {
    id: 'tech',
    name: 'Tech',
    slug: 'tech',
    description: 'Infraestructura, deploys, feature flags y observabilidad.',
    color: 'var(--team-tech)',
    glyph: 'TE',
    resources: ['Deploys', 'Feature Flags', 'Servicios', 'Incidentes'],
    icon: 'rocket',
  },
  {
    id: 'producto',
    name: 'Producto',
    slug: 'producto',
    description: 'Roadmap, specs, discovery y métricas de producto.',
    color: 'var(--team-producto)',
    glyph: 'PR',
    resources: ['Roadmap', 'Specs', 'Research', 'Métricas'],
    icon: 'package',
  },
];

export const getTeam = (id: string): Team =>
  TEAMS.find((t) => t.id === id) as Team;

export const PERMISSION_GROUPS: PermissionGroup[] = [
  {
    id: 'resources',
    label: 'Recursos',
    icon: 'database',
    permissions: [
      { id: 'view', name: 'Ver recursos', desc: 'Consultar todos los recursos del equipo' },
      { id: 'create', name: 'Crear recursos', desc: 'Agregar nuevos items al espacio del equipo' },
      { id: 'edit', name: 'Editar recursos', desc: 'Modificar items existentes del equipo' },
      { id: 'delete', name: 'Eliminar recursos', desc: 'Borrar permanentemente items del equipo' },
    ],
  },
  {
    id: 'members',
    label: 'Miembros',
    icon: 'users',
    permissions: [
      { id: 'invite', name: 'Invitar miembros', desc: 'Enviar invitaciones a nuevos miembros' },
      { id: 'manage_members', name: 'Gestionar miembros', desc: 'Cambiar roles y remover miembros' },
    ],
  },
  {
    id: 'settings',
    label: 'Configuración',
    icon: 'settings',
    permissions: [
      { id: 'manage_settings', name: 'Editar configuración', desc: 'Modificar ajustes del equipo' },
      { id: 'manage_integrations', name: 'Conectar integraciones', desc: 'Añadir o remover apps conectadas' },
    ],
  },
  {
    id: 'audit',
    label: 'Auditoría',
    icon: 'activity',
    permissions: [
      { id: 'view_logs', name: 'Ver logs', desc: 'Acceso al historial de actividad del equipo' },
      { id: 'export_data', name: 'Exportar datos', desc: 'Descargar información del equipo' },
    ],
  },
];

export const ALL_PERMISSIONS = PERMISSION_GROUPS.flatMap((g) =>
  g.permissions.map((p) => p.id)
);

export const ROLE_DEFAULTS: Record<string, string[]> = {
  admin: ['view', 'create', 'edit', 'delete', 'invite', 'manage_members', 'manage_settings', 'manage_integrations', 'view_logs', 'export_data'],
  member: ['view', 'create', 'edit', 'view_logs'],
  viewer: ['view'],
};

export const ROLES: Role[] = [
  { id: 'super', label: 'Super Admin', desc: 'Acceso global al Back Office.' },
  { id: 'admin', label: 'Admin de equipo', desc: 'Gestiona miembros y permisos del equipo.' },
  { id: 'member', label: 'Miembro', desc: 'Puede crear y editar recursos.' },
  { id: 'viewer', label: 'Lector', desc: 'Solo lectura.' },
];

export const USERS: User[] = [
  { id: 'u1', name: 'Lucía Fernández', email: 'lucia@empresa.com', initials: 'LF', color: '#4f46e5', status: 'active', lastSeen: 'Hace 3 min', memberships: [{ team: 'integraciones', role: 'admin' }, { team: 'producto', role: 'member' }] },
  { id: 'u2', name: 'Martín Giménez', email: 'martin@empresa.com', initials: 'MG', color: '#0f8a54', status: 'active', lastSeen: 'Hace 12 min', memberships: [{ team: 'tech', role: 'admin' }] },
  { id: 'u3', name: 'Sofía Álvarez', email: 'sofia@empresa.com', initials: 'SA', color: '#b45309', status: 'active', lastSeen: 'Hace 1 h', memberships: [{ team: 'producto', role: 'admin' }] },
  { id: 'u4', name: 'Diego Torres', email: 'diego@empresa.com', initials: 'DT', color: '#9333ea', status: 'active', lastSeen: 'Hace 22 min', memberships: [{ team: 'tech', role: 'member' }, { team: 'integraciones', role: 'member' }] },
  { id: 'u5', name: 'Camila Ruiz', email: 'camila@empresa.com', initials: 'CR', color: '#db2777', status: 'active', lastSeen: 'Hace 2 h', memberships: [{ team: 'producto', role: 'member' }] },
  { id: 'u6', name: 'Nicolás Peña', email: 'nicolas@empresa.com', initials: 'NP', color: '#0891b2', status: 'active', lastSeen: 'Hace 4 h', memberships: [{ team: 'tech', role: 'member' }] },
  { id: 'u7', name: 'Valentina López', email: 'valentina@empresa.com', initials: 'VL', color: '#65a30d', status: 'pending', lastSeen: 'Invitada', memberships: [{ team: 'integraciones', role: 'member' }] },
  { id: 'u8', name: 'Federico Romero', email: 'federico@empresa.com', initials: 'FR', color: '#c2410c', status: 'active', lastSeen: 'Ayer', memberships: [{ team: 'producto', role: 'viewer' }] },
  { id: 'u9', name: 'Agustina Díaz', email: 'agustina@empresa.com', initials: 'AD', color: '#7c3aed', status: 'suspended', lastSeen: 'Hace 3 días', memberships: [] },
  { id: 'u10', name: 'Joaquín Navarro', email: 'joaquin@empresa.com', initials: 'JN', color: '#0369a1', status: 'active', lastSeen: 'Hace 8 min', memberships: [{ team: 'integraciones', role: 'member' }, { team: 'tech', role: 'viewer' }] },
  { id: 'u11', name: 'Renata Silva', email: 'renata@empresa.com', initials: 'RS', color: '#be123c', status: 'active', lastSeen: 'Hace 1 h', memberships: [{ team: 'producto', role: 'member' }] },
  { id: 'u12', name: 'Tomás Molina', email: 'tomas@empresa.com', initials: 'TM', color: '#15803d', status: 'active', lastSeen: 'Hace 30 min', memberships: [{ team: 'tech', role: 'member' }] },
];

export const CURRENT_ADMIN = {
  id: 'admin0',
  name: 'Ana Rivas',
  email: 'ana@empresa.com',
  initials: 'AR',
  role: 'super' as RoleId,
};

export const AUDIT_LOG: AuditEntry[] = [
  { time: '14:32', actor: 'Ana Rivas', action: 'invitó a', target: 'valentina@empresa.com', meta: 'al equipo Integraciones', icon: 'user-plus' },
  { time: '13:15', actor: 'Martín Giménez', action: 'creó', target: 'un nuevo Feature Flag', meta: 'en Tech', icon: 'plus' },
  { time: '12:48', actor: 'Ana Rivas', action: 'cambió rol de', target: 'Lucía Fernández', meta: 'a Admin de equipo en Integraciones', icon: 'shield' },
  { time: '11:22', actor: 'Sofía Álvarez', action: 'editó permisos de', target: 'Federico Romero', meta: 'en Producto', icon: 'key' },
  { time: '10:05', actor: 'Ana Rivas', action: 'suspendió a', target: 'Agustina Díaz', meta: '— motivo: baja temporal', icon: 'lock' },
  { time: '09:42', actor: 'Diego Torres', action: 'actualizó', target: 'configuración de API', meta: 'en Integraciones', icon: 'settings' },
  { time: '09:10', actor: 'Ana Rivas', action: 'creó el equipo', target: 'Producto', meta: '', icon: 'team' },
];
