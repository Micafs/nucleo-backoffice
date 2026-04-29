'use client';

import { useState } from 'react';
import Icon from '@/components/Icon';
import { RolePill } from '@/components/ui';
import { PermissionsEditor } from './TeamDetailPage';
import { TEAMS, ROLES, getTeam } from '@/lib/data';

type PermView = 'matrix' | 'groups' | 'cards';
type PermissionsState = Record<string, Record<string, string[]>>;

interface RolesPageProps {
  permView: PermView;
  setPermView: (v: PermView) => void;
  permissions: PermissionsState;
  setPermissions: (p: PermissionsState) => void;
}

export default function RolesPage({ permView, setPermView, permissions, setPermissions }: RolesPageProps) {
  const [teamId, setTeamId] = useState('integraciones');
  const [selectedRole, setSelectedRole] = useState('admin');
  const team = getTeam(teamId);

  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">Roles y permisos</h1>
          <p className="page-sub">Cuatro roles globales. Los permisos finos se configuran por equipo.</p>
        </div>
      </div>

      <div className="grid-3" style={{ marginBottom: 20, gridTemplateColumns: 'repeat(4, 1fr)' }}>
        {ROLES.map((r) => (
          <div key={r.id} className="card" style={{ padding: 16 }}>
            <RolePill role={r.id} />
            <div style={{ fontWeight: 600, fontSize: 14, marginTop: 10 }}>{r.label}</div>
            <div className="small muted" style={{ marginTop: 2 }}>{r.desc}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-head">
          <div className="row">
            <span className="small muted">Equipo:</span>
            {TEAMS.map((t) => (
              <button key={t.id} className={'btn btn--sm' + (teamId === t.id ? ' btn--primary' : '')} onClick={() => setTeamId(t.id)}>
                <div className="team-icon" style={{ width: 14, height: 14, fontSize: 8, borderRadius: 4, background: t.color }}>{t.glyph}</div>
                {t.name}
              </button>
            ))}
          </div>
        </div>
        <div className="card-body">
          <PermissionsEditor
            team={team}
            selectedRole={selectedRole}
            setSelectedRole={setSelectedRole}
            variant={permView}
            onChangeVariant={setPermView}
            permissions={permissions}
            setPermissions={setPermissions}
          />
        </div>
      </div>
    </>
  );
}
