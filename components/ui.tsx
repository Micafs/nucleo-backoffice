'use client';

// ─── Componentes UI compartidos ────────────────────────────
// Átomos y moléculas de presentación usados en toda la app.
// Ninguno de estos componentes tiene lógica de negocio:
// solo reciben datos por props y los renderizan.

import { useEffect, ReactNode } from 'react';
import Icon from './Icon';
import { Team, User, TEAMS, getTeam } from '@/lib/data';
import type { Route } from '@/types/app.types';

// ─── Avatar ───────────────────────────────────────────────
// Círculo de iniciales coloreado que representa a un usuario.
// El color viene del perfil del usuario o cae a --accent por defecto.
export function Avatar({ user, size = 'md' }: { user: Pick<User, 'initials' | 'color'>; size?: 'sm' | 'md' | 'lg' | 'xl' }) {
  const cls = size === 'sm' ? 'avatar avatar--sm' : size === 'lg' ? 'avatar avatar--lg' : size === 'xl' ? 'avatar avatar--xl' : 'avatar';
  return (
    <div className={cls} style={{ background: user.color || 'var(--accent)' }}>
      {user.initials}
    </div>
  );
}

// ─── TeamGlyph ────────────────────────────────────────────
// Cuadrado coloreado con las siglas del equipo.
// Se usa como ícono visual del equipo en listas y cards.
export function TeamGlyph({ team, size = 14 }: { team: Team; size?: number }) {
  return (
    <div
      className="team-glyph"
      style={{
        background: team.color,
        width: size,
        height: size,
        fontSize: Math.max(8, size * 0.55),
        borderRadius: 4,
      }}
    >
      {team.glyph}
    </div>
  );
}

// ─── TeamChip ─────────────────────────────────────────────
// Muestra el ícono del equipo + su nombre + el rol del usuario en ese equipo.
// Se usa en la tabla de usuarios para listar las membresías.
export function TeamChip({ team, role }: { team: Team; role?: string }) {
  return (
    <span className="team-chip">
      <TeamGlyph team={team} />
      {team.name}
      {role && (
        <span style={{ color: 'var(--ink-4)', fontWeight: 400 }}>
          ·{' '}
          {role === 'admin' ? 'Admin' : role === 'member' ? 'Miembro' : role === 'viewer' ? 'Lector' : role}
        </span>
      )}
    </span>
  );
}

// ─── RolePill ─────────────────────────────────────────────
// Badge con el nombre legible del rol (super / admin / member / viewer).
// El atributo data-role permite estilizarlo diferente por tipo en CSS.
export function RolePill({ role }: { role: string }) {
  const label =
    role === 'super' ? 'Super Admin' :
    role === 'admin' ? 'Admin' :
    role === 'member' ? 'Miembro' :
    role === 'viewer' ? 'Lector' : role;
  return <span className="role-pill" data-role={role}>{label}</span>;
}

// ─── StatusDot ────────────────────────────────────────────
// Punto de color + texto que indica el estado de un usuario.
// Mapea: active → verde, pending → amarillo, suspended → rojo.
export function StatusDot({ status }: { status: string }) {
  const map: Record<string, string> = { active: 'ok', pending: 'warn', suspended: 'danger' };
  const label: Record<string, string> = { active: 'Activo', pending: 'Pendiente', suspended: 'Suspendido' };
  return (
    <span className="row" style={{ gap: 6, fontSize: 12 }}>
      <span className={`dot dot--${map[status]}`} />
      {label[status]}
    </span>
  );
}

// ─── AvatarStack ──────────────────────────────────────────
// Muestra hasta `max` avatares superpuestos y un contador del resto.
// Usado en las cards de equipos para visualizar los miembros.
export function AvatarStack({ users, max = 4 }: { users: Array<Pick<User, 'id' | 'initials' | 'color'>>; max?: number }) {
  const shown = users.slice(0, max);
  const extra = users.length - shown.length;
  return (
    <div className="avatar-stack">
      {shown.map((u) => (
        <Avatar key={u.id} user={u} size="sm" />
      ))}
      {extra > 0 && (
        <div className="avatar avatar--sm avatar-stack-more">+{extra}</div>
      )}
    </div>
  );
}

// ─── Modal ────────────────────────────────────────────────
// Contenedor de diálogo genérico con backdrop, título, cuerpo y footer.
// Se cierra al presionar Escape o al hacer clic fuera del cuadro.
interface ModalProps {
  title: string;
  sub?: string;          // Subtítulo opcional debajo del título
  onClose?: () => void;
  children: ReactNode;   // Contenido del cuerpo del modal
  footer?: ReactNode;    // Botones de acción (Cancelar / Confirmar)
  wide?: boolean;        // Si true, usa la variante ancha del modal
}

export function Modal({ title, sub, onClose, children, footer, wide }: ModalProps) {
  // Cerrar con Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose?.(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      {/* stopPropagation evita que el clic dentro del modal cierre el diálogo */}
      <div className={'modal' + (wide ? ' modal--wide' : '')} onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div style={{ flex: 1 }}>
            <h3 className="modal-title">{title}</h3>
            {sub && <p className="modal-sub">{sub}</p>}
          </div>
          <button className="btn btn--ghost btn--icon btn--sm" onClick={onClose} aria-label="Cerrar">
            <Icon name="x" size={14} />
          </button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-foot">{footer}</div>}
      </div>
    </div>
  );
}

// ─── Toast ────────────────────────────────────────────────
// Notificación temporal que se auto-destruye a los 2.8 segundos.
// El componente padre la elimina de la lista al ejecutarse onDone.
export function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2800);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div className="toast">
      <span className="dot" />
      {message}
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────
// Barra de navegación lateral. Renderiza dos vistas según el rol:
//  - isSuper (admin): muestra todo el menú del Back Office
//  - miembro: muestra solo los recursos del equipo activo
interface SidebarProps {
  route: Route;
  onNavigate: (r: { page: string; teamId?: string }) => void;
  view: string;           // 'admin' | 'member'
  onSwitchView: () => void; // Alterna entre vista Super Admin y vista Miembro
  invitePending: number;  // Cantidad de invitaciones pendientes (badge en Usuarios)
}

export function Sidebar({ route, onNavigate, view, onSwitchView, invitePending }: SidebarProps) {
  const isSuper = view === 'admin';
  return (
    <aside className="sidebar">
      {/* Logo y nombre de la aplicación */}
      <div className="sidebar-brand">
        <div className="sidebar-logo">N</div>
        <div>
          <div className="sidebar-brand-name">Nucleo</div>
          <div className="sidebar-brand-sub">back_office</div>
        </div>
      </div>

      {isSuper ? (
        <>
          {/* Navegación principal del Super Admin */}
          <div className="sidebar-section">
            <div className="sidebar-section-label">General</div>
            <button className="nav-item" data-active={route.page === 'dashboard'} onClick={() => onNavigate({ page: 'dashboard' })}>
              <Icon name="dashboard" className="nav-icon" /> Dashboard
            </button>
            <button className="nav-item" data-active={route.page === 'teams'} onClick={() => onNavigate({ page: 'teams' })}>
              <Icon name="team" className="nav-icon" /> Equipos
            </button>
            <button className="nav-item" data-active={route.page === 'users'} onClick={() => onNavigate({ page: 'users' })}>
              <Icon name="users" className="nav-icon" /> Usuarios
              {invitePending > 0 && <span className="badge">{invitePending}</span>}
            </button>
            <button className="nav-item" data-active={route.page === 'roles'} onClick={() => onNavigate({ page: 'roles' })}>
              <Icon name="shield" className="nav-icon" /> Roles y permisos
            </button>
            <button className="nav-item" data-active={route.page === 'audit'} onClick={() => onNavigate({ page: 'audit' })}>
              <Icon name="activity" className="nav-icon" /> Auditoría
            </button>
            <button className="nav-item" data-active={route.page === 'roadmap'} onClick={() => onNavigate({ page: 'roadmap' })}>
              <Icon name="layers" className="nav-icon" /> Roadmap
            </button>
          </div>

          {/* Accesos directos a cada equipo */}
          <div className="sidebar-section">
            <div className="sidebar-section-label">Equipos</div>
            {TEAMS.map((t) => (
              <button
                key={t.id}
                className="nav-item"
                data-active={route.page === 'team-detail' && route.teamId === t.id}
                onClick={() => onNavigate({ page: 'team-detail', teamId: t.id })}
              >
                <span className="team-glyph" style={{ background: t.color, width: 16, height: 16, fontSize: 9, borderRadius: 4 }}>{t.glyph}</span>
                {t.name}
              </button>
            ))}
          </div>
        </>
      ) : (
        <>
          {/* Navegación de la vista Miembro: recursos del equipo activo */}
          <div className="sidebar-section">
            <div className="sidebar-section-label">Mi espacio</div>
            <button className="nav-item" data-active={route.page === 'workspace'} onClick={() => onNavigate({ page: 'workspace' })}>
              <Icon name="dashboard" className="nav-icon" /> Inicio
            </button>
            {(() => {
              const currentTeam = getTeam(route.activeTeam || 'integraciones');
              return currentTeam.resources.map((r, i) => (
                <button key={r} className="nav-item">
                  <Icon name={(['database', 'code', 'users', 'activity'][i] || 'file-text') as string} className="nav-icon" /> {r}
                </button>
              ));
            })()}
          </div>
          <div className="sidebar-section">
            <div className="sidebar-section-label">Ajustes</div>
            <button className="nav-item"><Icon name="settings" className="nav-icon" /> Preferencias</button>
          </div>
        </>
      )}

      {/* Perfil del usuario logueado y botón para cambiar de vista */}
      <div className="sidebar-user">
        {isSuper ? (
          <>
            <div className="avatar" style={{ background: '#1a1914' }}>AR</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="sidebar-user-name">Ana Rivas</div>
              <div className="sidebar-user-role">Super Admin</div>
            </div>
            <button className="btn btn--ghost btn--icon btn--sm" onClick={onSwitchView} title="Cambiar vista">
              <Icon name="logout" size={14} />
            </button>
          </>
        ) : (
          <>
            <div className="avatar" style={{ background: '#4f46e5' }}>LF</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="sidebar-user-name">Lucía Fernández</div>
              <div className="sidebar-user-role">Admin · Integraciones</div>
            </div>
            <button className="btn btn--ghost btn--icon btn--sm" onClick={onSwitchView} title="Cambiar vista">
              <Icon name="logout" size={14} />
            </button>
          </>
        )}
      </div>
    </aside>
  );
}

// ─── Topbar ───────────────────────────────────────────────
// Barra superior con el rastro de breadcrumbs y acciones globales.
// Los crumbs se calculan en App.tsx según la ruta activa.
export function Topbar({ crumbs }: { crumbs: string[] }) {
  return (
    <div className="topbar">
      {/* Breadcrumbs: último ítem siempre en estado "activo" */}
      <div className="breadcrumbs">
        {crumbs.map((c, i) => (
          <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {i > 0 && <span className="sep"><Icon name="chevron-right" size={12} /></span>}
            <span className="crumb" data-current={i === crumbs.length - 1}>{c}</span>
          </span>
        ))}
      </div>
      {/* Acciones globales: búsqueda y notificaciones (sin funcionalidad aún) */}
      <div className="topbar-right">
        <button className="btn btn--ghost btn--icon btn--sm"><Icon name="search" size={14} /></button>
        <button className="btn btn--ghost btn--icon btn--sm"><Icon name="bell" size={14} /></button>
      </div>
    </div>
  );
}
