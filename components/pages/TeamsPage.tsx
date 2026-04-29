'use client';

import Icon from '@/components/Icon';
import { AvatarStack } from '@/components/ui';
import { TEAMS, User } from '@/lib/data';

interface TeamsPageProps {
  users: User[];
  onNavigate: (r: { page: string; teamId?: string }) => void;
  onCreate: () => void;
}

export default function TeamsPage({ users, onNavigate, onCreate }: TeamsPageProps) {
  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">Equipos</h1>
          <p className="page-sub">Cada equipo tiene su propio espacio, miembros y permisos.</p>
        </div>
        <div className="row">
          <button className="btn btn--accent" onClick={onCreate}>
            <Icon name="plus" size={14} /> Nuevo equipo
          </button>
        </div>
      </div>

      <div className="grid-3">
        {TEAMS.map((team) => {
          const members = users.filter((u) => u.memberships.some((m) => m.team === team.id));
          const admins = members.filter((u) => u.memberships.find((m) => m.team === team.id && m.role === 'admin'));
          return (
            <div key={team.id} className="team-card" onClick={() => onNavigate({ page: 'team-detail', teamId: team.id })}>
              <div className="team-card-head">
                <div className="team-icon" style={{ background: team.color }}>{team.glyph}</div>
                <button className="btn btn--ghost btn--icon btn--sm" onClick={(e) => e.stopPropagation()}>
                  <Icon name="more" size={14} />
                </button>
              </div>
              <div>
                <h3 className="team-card-name">{team.name}</h3>
                <p className="team-card-desc">{team.description}</p>
              </div>
              <div className="row">
                <AvatarStack users={members} max={4} />
                <span className="spacer" />
                <span className="badge badge--mono">#{team.slug}</span>
              </div>
              <div className="team-card-stats">
                <div className="team-card-stat">
                  <div className="team-card-stat-label">Miembros</div>
                  <div className="team-card-stat-value">{members.length}</div>
                </div>
                <div className="team-card-stat">
                  <div className="team-card-stat-label">Admins</div>
                  <div className="team-card-stat-value">{admins.length}</div>
                </div>
                <div className="team-card-stat">
                  <div className="team-card-stat-label">Recursos</div>
                  <div className="team-card-stat-value">{team.resources.length}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
