'use client';

import { useEffect, useRef, ReactNode } from 'react';
import Icon from './Icon';
import { Team, User, Membership } from '@/lib/data';

// ─── Avatar ───────────────────────────────────────────────
export function Avatar({ user, size = 'md' }: { user: Pick<User, 'initials' | 'color'>; size?: 'sm' | 'md' | 'lg' | 'xl' }) {
  const cls = size === 'sm' ? 'avatar avatar--sm' : size === 'lg' ? 'avatar avatar--lg' : size === 'xl' ? 'avatar avatar--xl' : 'avatar';
  return (
    <div className={cls} style={{ background: user.color || 'var(--accent)' }}>
      {user.initials}
    </div>
  );
}

// ─── TeamGlyph ────────────────────────────────────────────
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
export function RolePill({ role }: { role: string }) {
  const label =
    role === 'super' ? 'Super Admin' :
    role === 'admin' ? 'Admin' :
    role === 'member' ? 'Miembro' :
    role === 'viewer' ? 'Lector' : role;
  return <span className="role-pill" data-role={role}>{label}</span>;
}

// ─── StatusDot ────────────────────────────────────────────
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
interface ModalProps {
  title: string;
  sub?: string;
  onClose?: () => void;
  children: ReactNode;
  footer?: ReactNode;
  wide?: boolean;
}

export function Modal({ title, sub, onClose, children, footer, wide }: ModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose?.(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="modal-backdrop" onClick={onClose}>
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

// ─── Sidebar nav ──────────────────────────────────────────
import { TEAMS, getTeam } from '@/lib/data';

interface Route {
  page: string;
  teamId?: string;
  activeTeam?: string;
}

interface SidebarProps {
  route: Route;
  onNavigate: (r: { page: string; teamId?: string }) => void;
  view: string;
  onSwitchView: () => void;
  invitePending: number;
}

export function Sidebar({ route, onNavigate, view, onSwitchView, invitePending }: SidebarProps) {
  const isSuper = view === 'admin';
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-logo">N</div>
        <div>
          <div className="sidebar-brand-name">Nucleo</div>
          <div className="sidebar-brand-sub">back_office</div>
        </div>
      </div>

      {isSuper ? (
        <>
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
          </div>
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

// ─── Topbar / breadcrumbs ─────────────────────────────────
export function Topbar({ crumbs }: { crumbs: string[] }) {
  return (
    <div className="topbar">
      <div className="breadcrumbs">
        {crumbs.map((c, i) => (
          <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {i > 0 && <span className="sep"><Icon name="chevron-right" size={12} /></span>}
            <span className="crumb" data-current={i === crumbs.length - 1}>{c}</span>
          </span>
        ))}
      </div>
      <div className="topbar-right">
        <button className="btn btn--ghost btn--icon btn--sm"><Icon name="search" size={14} /></button>
        <button className="btn btn--ghost btn--icon btn--sm"><Icon name="bell" size={14} /></button>
      </div>
    </div>
  );
}
