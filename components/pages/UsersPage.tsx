'use client';

import { useState } from 'react';
import Icon from '@/components/Icon';
import { Avatar, TeamChip, StatusDot, Modal } from '@/components/ui';
import { TEAMS, getTeam, User } from '@/lib/data';

interface UsersPageProps {
  users: User[];
  setUsers: (u: User[]) => void;
  openInvite: { teamId: string | null } | null;
  setOpenInvite: (v: { teamId: string | null } | null) => void;
  onToast: (msg: string) => void;
}

export default function UsersPage({ users, setUsers, openInvite, setOpenInvite, onToast }: UsersPageProps) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [menuFor, setMenuFor] = useState<string | null>(null);

  const filtered = users.filter((u) => {
    if (query && !u.name.toLowerCase().includes(query.toLowerCase()) && !u.email.toLowerCase().includes(query.toLowerCase())) return false;
    if (filter === 'active' && u.status !== 'active') return false;
    if (filter === 'pending' && u.status !== 'pending') return false;
    if (filter === 'suspended' && u.status !== 'suspended') return false;
    return true;
  });

  const toggleStatus = (user: User) => {
    const next = user.status === 'suspended' ? 'active' : 'suspended';
    setUsers(users.map((u) => u.id === user.id ? { ...u, status: next } : u));
    onToast(next === 'suspended' ? `${user.name} suspendido/a` : `${user.name} reactivado/a`);
    setMenuFor(null);
  };

  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">Usuarios</h1>
          <p className="page-sub">Invitá, suspendé y asigná a las personas a uno o varios equipos.</p>
        </div>
        <div className="row">
          <button className="btn btn--accent" onClick={() => setOpenInvite({ teamId: null })}>
            <Icon name="user-plus" size={14} /> Invitar usuario
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-head">
          <div className="row" style={{ flex: 1 }}>
            <div className="input-wrap" style={{ flex: 1, maxWidth: 320 }}>
              <span className="lead-icon"><Icon name="search" size={13} /></span>
              <input className="input input--with-icon" placeholder="Buscar por nombre o email…"
                     value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
            <span className="spacer" />
            <div className="segmented">
              <button data-active={filter === 'all'} onClick={() => setFilter('all')}>Todos</button>
              <button data-active={filter === 'active'} onClick={() => setFilter('active')}>Activos</button>
              <button data-active={filter === 'pending'} onClick={() => setFilter('pending')}>Pendientes</button>
              <button data-active={filter === 'suspended'} onClick={() => setFilter('suspended')}>Suspendidos</button>
            </div>
          </div>
        </div>
        <div className="card-body card-body--flush">
          <table className="table">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Equipos</th>
                <th>Estado</th>
                <th>Última actividad</th>
                <th style={{ width: 40 }}></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id}>
                  <td>
                    <div className="row">
                      <Avatar user={u} />
                      <div>
                        <div style={{ fontWeight: 500 }}>{u.name}</div>
                        <div className="xsmall muted">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="row" style={{ flexWrap: 'wrap', gap: 4 }}>
                      {u.memberships.length === 0 && <span className="xsmall muted">— sin equipos —</span>}
                      {u.memberships.map((m) => {
                        const team = getTeam(m.team);
                        return <TeamChip key={m.team} team={team} role={m.role} />;
                      })}
                    </div>
                  </td>
                  <td><StatusDot status={u.status} /></td>
                  <td className="small muted">{u.lastSeen}</td>
                  <td style={{ position: 'relative' }}>
                    <button className="btn btn--ghost btn--icon btn--sm" onClick={() => setMenuFor(menuFor === u.id ? null : u.id)}>
                      <Icon name="more" size={14} />
                    </button>
                    {menuFor === u.id && (
                      <>
                        <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={() => setMenuFor(null)} />
                        <div className="menu" style={{ right: 12, top: 38 }}>
                          <button className="menu-item" onClick={() => { setEditingUser(u); setMenuFor(null); }}>
                            <Icon name="edit" size={13} /> Editar usuario
                          </button>
                          <button className="menu-item" onClick={() => { setMenuFor(null); onToast('Invitación reenviada'); }}>
                            <Icon name="send" size={13} /> Reenviar invitación
                          </button>
                          <div className="menu-sep" />
                          <button className="menu-item" onClick={() => toggleStatus(u)}>
                            <Icon name="lock" size={13} />
                            {u.status === 'suspended' ? 'Reactivar' : 'Suspender'}
                          </button>
                          <button className="menu-item" data-danger="true" onClick={() => setMenuFor(null)}>
                            <Icon name="trash" size={13} /> Eliminar
                          </button>
                        </div>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {openInvite && (
        <InviteModal
          initialTeam={openInvite.teamId}
          onClose={() => setOpenInvite(null)}
          onInvite={(payload) => {
            const newUser: User = {
              id: 'u' + (users.length + 100),
              name: payload.email.split('@')[0].replace(/\./g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
              email: payload.email,
              initials: payload.email.slice(0, 2).toUpperCase(),
              color: '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'),
              status: 'pending',
              lastSeen: 'Invitada/o',
              memberships: payload.teams.map((t) => ({ team: t as User['memberships'][0]['team'], role: payload.role as 'admin' | 'member' | 'viewer' })),
            };
            setUsers([newUser, ...users]);
            setOpenInvite(null);
            onToast(`Invitación enviada a ${payload.email}`);
          }}
        />
      )}

      {editingUser && (
        <EditUserModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSave={(u) => {
            setUsers(users.map((x) => x.id === u.id ? u : x));
            setEditingUser(null);
            onToast(`Cambios guardados en ${u.name}`);
          }}
        />
      )}
    </>
  );
}

// ─── Invite Modal ─────────────────────────────────────────
function InviteModal({ initialTeam, onClose, onInvite }: {
  initialTeam: string | null;
  onClose: () => void;
  onInvite: (p: { email: string; teams: string[]; role: string }) => void;
}) {
  const [email, setEmail] = useState('');
  const [teams, setTeams] = useState<string[]>(initialTeam ? [initialTeam] : []);
  const [role, setRole] = useState('member');
  const toggleTeam = (id: string) => setTeams(teams.includes(id) ? teams.filter((x) => x !== id) : [...teams, id]);
  const valid = email.includes('@') && teams.length > 0;

  return (
    <Modal
      title="Invitar usuario"
      sub="Se enviará un email con un link para crear la cuenta."
      onClose={onClose}
      wide
      footer={
        <>
          <button className="btn" onClick={onClose}>Cancelar</button>
          <button className="btn btn--accent" disabled={!valid} onClick={() => onInvite({ email, teams, role })}>
            <Icon name="send" size={13} /> Enviar invitación
          </button>
        </>
      }
    >
      <div className="col" style={{ gap: 16 }}>
        <div className="field">
          <label className="field-label">Email</label>
          <input className="input" type="email" placeholder="nombre@empresa.com" autoFocus
                 value={email} onChange={(e) => setEmail(e.target.value)} />
          <span className="field-hint">Se aceptan solo dominios corporativos (@empresa.com).</span>
        </div>

        <div className="field">
          <label className="field-label">Asignar a equipos</label>
          <div className="col" style={{ gap: 6 }}>
            {TEAMS.map((t) => (
              <label key={t.id} className="row" style={{
                padding: 10, border: '1px solid var(--border)', borderRadius: 8, cursor: 'pointer',
                background: teams.includes(t.id) ? 'var(--accent-soft)' : 'transparent',
                borderColor: teams.includes(t.id) ? 'var(--accent)' : 'var(--border)',
              }}>
                <input type="checkbox" className="checkbox" checked={teams.includes(t.id)} onChange={() => toggleTeam(t.id)} />
                <div className="team-icon" style={{ width: 26, height: 26, fontSize: 10, borderRadius: 7, background: t.color }}>{t.glyph}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 500, fontSize: 13 }}>{t.name}</div>
                  <div className="xsmall muted">{t.description}</div>
                </div>
              </label>
            ))}
          </div>
          <span className="field-hint">Una persona puede pertenecer a varios equipos a la vez.</span>
        </div>

        <div className="field">
          <label className="field-label">Rol inicial en los equipos seleccionados</label>
          <div className="row" style={{ gap: 8, flexWrap: 'wrap' }}>
            {['admin', 'member', 'viewer'].map((r) => (
              <button key={r} type="button" onClick={() => setRole(r)}
                      className={'btn btn--sm' + (role === r ? ' btn--primary' : '')}>
                {r === 'admin' ? 'Admin' : r === 'member' ? 'Miembro' : 'Lector'}
              </button>
            ))}
          </div>
          <span className="field-hint">Podés cambiar el rol después de forma individual.</span>
        </div>
      </div>
    </Modal>
  );
}

// ─── Edit User Modal ──────────────────────────────────────
function EditUserModal({ user, onClose, onSave }: {
  user: User;
  onClose: () => void;
  onSave: (u: User) => void;
}) {
  const [draft, setDraft] = useState<User>(user);

  const updateMembership = (teamId: string, role: string | null) => {
    const exists = draft.memberships.find((m) => m.team === teamId);
    let next: User['memberships'];
    if (role === null) next = draft.memberships.filter((m) => m.team !== teamId);
    else if (exists) next = draft.memberships.map((m) => m.team === teamId ? { ...m, role: role as 'admin' | 'member' | 'viewer' } : m);
    else next = [...draft.memberships, { team: teamId as User['memberships'][0]['team'], role: role as 'admin' | 'member' | 'viewer' }];
    setDraft({ ...draft, memberships: next });
  };

  return (
    <Modal title="Editar usuario" sub={user.email} onClose={onClose} wide
           footer={
             <>
               <button className="btn" onClick={onClose}>Cancelar</button>
               <button className="btn btn--accent" onClick={() => onSave(draft)}>Guardar cambios</button>
             </>
           }>
      <div className="row" style={{ marginBottom: 20, gap: 16 }}>
        <Avatar user={user} size="xl" />
        <div style={{ flex: 1 }}>
          <div className="field">
            <label className="field-label">Nombre</label>
            <input className="input" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
          </div>
        </div>
      </div>

      <div className="field" style={{ marginBottom: 16 }}>
        <label className="field-label">Pertenencia a equipos y rol</label>
        <div className="col" style={{ gap: 6 }}>
          {TEAMS.map((t) => {
            const m = draft.memberships.find((x) => x.team === t.id);
            return (
              <div key={t.id} className="row" style={{ padding: 10, border: '1px solid var(--border)', borderRadius: 8 }}>
                <input type="checkbox" className="checkbox" checked={!!m}
                       onChange={() => updateMembership(t.id, m ? null : 'member')} />
                <div className="team-icon" style={{ width: 26, height: 26, fontSize: 10, borderRadius: 7, background: t.color }}>{t.glyph}</div>
                <div style={{ flex: 1, fontSize: 13, fontWeight: 500 }}>{t.name}</div>
                {m && (
                  <select className="select" style={{ width: 140, height: 30, fontSize: 12 }}
                          value={m.role} onChange={(e) => updateMembership(t.id, e.target.value)}>
                    <option value="admin">Admin</option>
                    <option value="member">Miembro</option>
                    <option value="viewer">Lector</option>
                  </select>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
}
