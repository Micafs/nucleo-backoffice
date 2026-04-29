'use client';

import Icon from '@/components/Icon';
import { RolePill } from '@/components/ui';
import { TEAMS, USERS, getTeam } from '@/lib/data';

interface MemberWorkspaceProps {
  activeTeam: string;
  setActiveTeam: (id: string) => void;
}

export default function MemberWorkspace({ activeTeam, setActiveTeam }: MemberWorkspaceProps) {
  const team = getTeam(activeTeam || 'integraciones');
  const user = USERS[0]; // Lucía
  const myTeams = user.memberships.map((m) => ({ team: getTeam(m.team), role: m.role }));
  const membership = user.memberships.find((m) => m.team === team.id) || { role: 'member' };

  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">Hola, Lucía 👋</h1>
          <p className="page-sub">Estás viendo el espacio de un miembro del equipo.</p>
        </div>
        <div className="row">
          <span className="small muted">Ver como:</span>
          <select className="select" style={{ width: 180 }} value={activeTeam} onChange={(e) => setActiveTeam(e.target.value)}>
            {myTeams.map(({ team: t, role }) => (
              <option key={t.id} value={t.id}>{t.name} ({role === 'admin' ? 'Admin' : 'Miembro'})</option>
            ))}
          </select>
        </div>
      </div>

      <div className="ws-hero">
        <div className="ws-hero-icon" style={{ background: team.color }}>{team.glyph}</div>
        <div>
          <h2>Espacio de {team.name}</h2>
          <p>{team.description}</p>
        </div>
        <div className="ws-hero-switch">
          <RolePill role={membership.role} />
        </div>
      </div>

      <div className="grid-2">
        <div className="ws-panel">
          <div className="row">
            <h3 className="ws-panel-title">Recursos del equipo</h3>
            <span className="spacer" />
            <button className="btn btn--sm btn--accent"><Icon name="plus" size={12} /> Nuevo</button>
          </div>
          {team.resources.map((r, i) => (
            <div key={r} className="ws-item">
              <div className="ws-item-icon">
                <Icon name={(['database', 'code', 'users', 'activity'][i] || 'file-text') as string} size={14} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500 }}>{r}</div>
                <div className="xsmall muted">Actualizado hace {i + 1} hora{i ? 's' : ''}</div>
              </div>
              <Icon name="chevron-right" size={14} className="muted" />
            </div>
          ))}
        </div>

        <div className="col" style={{ gap: 20 }}>
          <div className="ws-panel">
            <h3 className="ws-panel-title">Tus equipos</h3>
            {myTeams.map(({ team: t, role }) => (
              <div key={t.id} className="ws-item" style={{ cursor: 'pointer' }} onClick={() => setActiveTeam(t.id)}>
                <div className="team-icon" style={{ width: 28, height: 28, fontSize: 11, borderRadius: 7, background: t.color }}>{t.glyph}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 500 }}>{t.name}</div>
                  <div className="xsmall muted">Rol: {role === 'admin' ? 'Admin de equipo' : 'Miembro'}</div>
                </div>
                {activeTeam === t.id && <span className="badge badge--accent">Actual</span>}
              </div>
            ))}
          </div>

          <div className="ws-panel">
            <h3 className="ws-panel-title">Lo que podés hacer aquí</h3>
            {['Ver recursos', 'Crear recursos', 'Editar recursos', 'Ver logs'].map((p) => (
              <div key={p} className="row" style={{ padding: '6px 0', fontSize: 13 }}>
                <span className="dot dot--ok" />{p}
              </div>
            ))}
            {membership.role !== 'admin' && (
              <div className="row" style={{ padding: '6px 0', fontSize: 13, color: 'var(--ink-4)' }}>
                <span className="dot" style={{ background: 'var(--ink-5)' }} />
                Gestionar miembros · <span className="xsmall">requiere Admin</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
