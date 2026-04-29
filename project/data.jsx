// ─── Icons (lightweight inline SVG set) ──────────────────
const Icon = ({ name, size = 16, className = '', style }) => {
  const paths = {
    dashboard: 'M3 3h7v9H3zm0 12h7v6H3zm11 0h7v6h-7zm0-12h7v9h-7z',
    users: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z M22 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75',
    team: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75',
    shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z',
    activity: 'M22 12h-4l-3 9L9 3l-3 9H2',
    settings: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h0a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z',
    search: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z M21 21l-4.35-4.35',
    plus: 'M12 5v14 M5 12h14',
    mail: 'M4 4h16v16H4z M22 6l-10 7L2 6',
    lock: 'M5 11h14v10H5z M7 11V7a5 5 0 0 1 10 0v4',
    eye: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
    'eye-off': 'M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24 M1 1l22 22',
    logout: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9',
    chevron: 'M6 9l6 6 6-6',
    'chevron-right': 'M9 18l6-6-6-6',
    edit: 'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7 M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5Z',
    trash: 'M3 6h18 M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2 M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6',
    more: 'M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z M19 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z M5 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z',
    check: 'M20 6L9 17l-5-5',
    x: 'M18 6L6 18 M6 6l12 12',
    alert: 'M12 9v4 M12 17h.01 M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z',
    info: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z M12 16v-4 M12 8h.01',
    bell: 'M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0',
    globe: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z M2 12h20 M12 2a15 15 0 0 1 0 20 M12 2a15 15 0 0 0 0 20',
    code: 'M16 18l6-6-6-6 M8 6l-6 6 6 6',
    link: 'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71 M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71',
    layers: 'M12 2L2 7l10 5 10-5-10-5Z M2 17l10 5 10-5 M2 12l10 5 10-5',
    database: 'M12 8c4.97 0 9-1.34 9-3s-4.03-3-9-3-9 1.34-9 3 4.03 3 9 3 M21 12c0 1.66-4 3-9 3s-9-1.34-9-3 M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5',
    rocket: 'M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09Z M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2Z M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0 M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5',
    package: 'M16.5 9.4l-9-5.19 M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z M3.27 6.96L12 12.01l8.73-5.05 M12 22.08V12',
    'file-text': 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8',
    send: 'M22 2L11 13 M22 2l-7 20-4-9-9-4 20-7Z',
    'user-plus': 'M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M8.5 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z M20 8v6 M23 11h-6',
    filter: 'M22 3H2l8 9.46V19l4 2v-8.54L22 3Z',
    calendar: 'M19 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Z M16 2v4 M8 2v4 M3 10h18',
    key: 'M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4',
  };
  const d = paths[name];
  if (!d) return null;
  return (
    <svg className={className} style={style} width={size} height={size} viewBox="0 0 24 24"
         fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      {d.split(' M').map((p, i) => <path key={i} d={(i === 0 ? '' : 'M') + p} />)}
    </svg>
  );
};

// ─── Team definitions ────────────────────────────────────
const TEAMS = [
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

const getTeam = (id) => TEAMS.find(t => t.id === id);

// ─── Permission catalog ──────────────────────────────────
const PERMISSION_GROUPS = [
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

const ALL_PERMISSIONS = PERMISSION_GROUPS.flatMap(g => g.permissions.map(p => p.id));

const ROLE_DEFAULTS = {
  admin:  ['view','create','edit','delete','invite','manage_members','manage_settings','manage_integrations','view_logs','export_data'],
  member: ['view','create','edit','view_logs'],
  viewer: ['view'],
};

const ROLES = [
  { id: 'super',  label: 'Super Admin',    desc: 'Acceso global al Back Office.' },
  { id: 'admin',  label: 'Admin de equipo', desc: 'Gestiona miembros y permisos del equipo.' },
  { id: 'member', label: 'Miembro',         desc: 'Puede crear y editar recursos.' },
  { id: 'viewer', label: 'Lector',          desc: 'Solo lectura.' },
];

// ─── Mock users ──────────────────────────────────────────
const USERS = [
  { id: 'u1', name: 'Lucía Fernández', email: 'lucia@empresa.com', initials: 'LF', color: '#4f46e5', status: 'active',  lastSeen: 'Hace 3 min',   memberships: [{team:'integraciones', role:'admin'}, {team:'producto', role:'member'}] },
  { id: 'u2', name: 'Martín Giménez',  email: 'martin@empresa.com', initials: 'MG', color: '#0f8a54', status: 'active',  lastSeen: 'Hace 12 min',  memberships: [{team:'tech', role:'admin'}] },
  { id: 'u3', name: 'Sofía Álvarez',   email: 'sofia@empresa.com',  initials: 'SA', color: '#b45309', status: 'active',  lastSeen: 'Hace 1 h',     memberships: [{team:'producto', role:'admin'}] },
  { id: 'u4', name: 'Diego Torres',    email: 'diego@empresa.com',  initials: 'DT', color: '#9333ea', status: 'active',  lastSeen: 'Hace 22 min',  memberships: [{team:'tech', role:'member'}, {team:'integraciones', role:'member'}] },
  { id: 'u5', name: 'Camila Ruiz',     email: 'camila@empresa.com', initials: 'CR', color: '#db2777', status: 'active',  lastSeen: 'Hace 2 h',     memberships: [{team:'producto', role:'member'}] },
  { id: 'u6', name: 'Nicolás Peña',    email: 'nicolas@empresa.com',initials: 'NP', color: '#0891b2', status: 'active',  lastSeen: 'Hace 4 h',     memberships: [{team:'tech', role:'member'}] },
  { id: 'u7', name: 'Valentina López', email: 'valentina@empresa.com', initials: 'VL', color: '#65a30d', status: 'pending', lastSeen: 'Invitada',  memberships: [{team:'integraciones', role:'member'}] },
  { id: 'u8', name: 'Federico Romero', email: 'federico@empresa.com',initials: 'FR', color: '#c2410c', status: 'active',  lastSeen: 'Ayer',         memberships: [{team:'producto', role:'viewer'}] },
  { id: 'u9', name: 'Agustina Díaz',   email: 'agustina@empresa.com',initials: 'AD', color: '#7c3aed', status: 'suspended', lastSeen: 'Hace 3 días', memberships: [] },
  { id: 'u10',name: 'Joaquín Navarro', email: 'joaquin@empresa.com', initials:'JN', color: '#0369a1', status: 'active',  lastSeen: 'Hace 8 min',   memberships: [{team:'integraciones', role:'member'}, {team:'tech', role:'viewer'}] },
  { id: 'u11',name: 'Renata Silva',    email: 'renata@empresa.com', initials:'RS',  color: '#be123c', status: 'active',  lastSeen: 'Hace 1 h',     memberships: [{team:'producto', role:'member'}] },
  { id: 'u12',name: 'Tomás Molina',    email: 'tomas@empresa.com',  initials:'TM',  color: '#15803d', status: 'active',  lastSeen: 'Hace 30 min',  memberships: [{team:'tech', role:'member'}] },
];

const CURRENT_ADMIN = {
  id: 'admin0', name: 'Ana Rivas', email: 'ana@empresa.com', initials: 'AR', role: 'super',
};

// ─── Audit log ───────────────────────────────────────────
const AUDIT_LOG = [
  { time: '14:32', actor: 'Ana Rivas',   action: 'invitó a',           target: 'valentina@empresa.com', meta: 'al equipo Integraciones',        icon: 'user-plus' },
  { time: '13:15', actor: 'Martín Giménez', action: 'creó',             target: 'un nuevo Feature Flag',  meta: 'en Tech',                       icon: 'plus' },
  { time: '12:48', actor: 'Ana Rivas',   action: 'cambió rol de',      target: 'Lucía Fernández',        meta: 'a Admin de equipo en Integraciones', icon: 'shield' },
  { time: '11:22', actor: 'Sofía Álvarez', action: 'editó permisos de',  target: 'Federico Romero',      meta: 'en Producto',                    icon: 'key' },
  { time: '10:05', actor: 'Ana Rivas',   action: 'suspendió a',        target: 'Agustina Díaz',          meta: '— motivo: baja temporal',        icon: 'lock' },
  { time: '09:42', actor: 'Diego Torres', action: 'actualizó',          target: 'configuración de API',   meta: 'en Integraciones',               icon: 'settings' },
  { time: '09:10', actor: 'Ana Rivas',   action: 'creó el equipo',     target: 'Producto',               meta: '',                               icon: 'team' },
];

Object.assign(window, {
  Icon, TEAMS, getTeam, PERMISSION_GROUPS, ALL_PERMISSIONS, ROLE_DEFAULTS, ROLES,
  USERS, CURRENT_ADMIN, AUDIT_LOG,
});
