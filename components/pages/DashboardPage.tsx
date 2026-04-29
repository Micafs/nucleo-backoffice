'use client';

import Icon from '@/components/Icon';
import { TEAMS, AUDIT_LOG, User } from '@/lib/data';

interface DashboardPageProps {
  users: User[];
  onNavigate: (r: { page: string; teamId?: string; openInvite?: boolean }) => void;
}

export default function DashboardPage({ users, onNavigate }: DashboardPageProps) {
  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.status === 'active').length;
  const pending = users.filter((u) => u.status === 'pending').length;

  const byTeam = TEAMS.map((t) => ({
    ...t,
    memberCount: users.filter((u) => u.memberships.some((m) => m.team === t.id) && u.status === 'active').length,
    adminCount: users.filter((u) => u.memberships.some((m) => m.team === t.id && m.role === 'admin')).length,
  }));

  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-sub">Visión global del Back Office y la actividad reciente.</p>
        </div>
        <div className="row">
          <button className="btn"><Icon name="calendar" size={14} /> Últimos 7 días</button>
          <button className="btn btn--accent" onClick={() => onNavigate({ page: 'users', openInvite: true })}>
            <Icon name="user-plus" size={14} /> Invitar usuario
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat">
          <div className="stat-label">Usuarios totales</div>
          <div className="stat-value">{totalUsers}</div>
          <div className="stat-delta">+2 esta semana</div>
        </div>
        <div className="stat">
          <div className="stat-label">Activos</div>
          <div className="stat-value">{activeUsers}</div>
          <div className="stat-delta">94% del total</div>
        </div>
        <div className="stat">
          <div className="stat-label">Invitaciones pendientes</div>
          <div className="stat-value">{pending}</div>
          <div className="stat-delta" data-dir="down">vence en 3 días</div>
        </div>
        <div className="stat">
          <div className="stat-label">Equipos</div>
          <div className="stat-value">{TEAMS.length}</div>
          <div className="stat-delta">0 creados hoy</div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-head">
            <div>
              <h3 className="card-title">Equipos</h3>
              <p className="card-sub">Miembros activos por equipo</p>
            </div>
            <button className="btn btn--sm" onClick={() => onNavigate({ page: 'teams' })}>Ver todos</button>
          </div>
          <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
            {byTeam.map((t) => {
              const pct = Math.round((t.memberCount / Math.max(1, activeUsers)) * 100);
              return (
                <div key={t.id} onClick={() => onNavigate({ page: 'team-detail', teamId: t.id })} style={{ cursor: 'pointer' }}>
                  <div className="row" style={{ marginBottom: 6 }}>
                    <div className="team-icon" style={{ width: 22, height: 22, borderRadius: 6, fontSize: 10, background: t.color }}>{t.glyph}</div>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{t.name}</div>
                    <div className="spacer" />
                    <div className="tabular small muted">{t.memberCount} miembros · {t.adminCount} admin</div>
                  </div>
                  <div style={{ height: 6, background: 'var(--bg-soft)', borderRadius: 999, overflow: 'hidden' }}>
                    <div style={{ height: '100%', background: t.color, width: pct + '%', transition: 'width 0.4s' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <h3 className="card-title">Actividad reciente</h3>
            <button className="btn btn--sm btn--ghost" onClick={() => onNavigate({ page: 'audit' })}>Ver todo</button>
          </div>
          <div className="card-body card-body--flush">
            {AUDIT_LOG.slice(0, 5).map((log, i) => (
              <div key={i} className="log-row">
                <div className="log-time">{log.time}</div>
                <div className="log-body">
                  <div className="log-msg">
                    <b>{log.actor}</b> {log.action} <b>{log.target}</b> {log.meta}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
