// ─── Users page ─────────────────────────────────────────
const UsersPage = ({ users, setUsers, openInvite, setOpenInvite, onToast }) => {
  const [query, setQuery] = React.useState('');
  const [filter, setFilter] = React.useState('all');
  const [editingUser, setEditingUser] = React.useState(null);
  const [menuFor, setMenuFor] = React.useState(null);

  const filtered = users.filter(u => {
    if (query && !u.name.toLowerCase().includes(query.toLowerCase()) && !u.email.toLowerCase().includes(query.toLowerCase())) return false;
    if (filter === 'active' && u.status !== 'active') return false;
    if (filter === 'pending' && u.status !== 'pending') return false;
    if (filter === 'suspended' && u.status !== 'suspended') return false;
    if (filter.startsWith('team:') && !u.memberships.some(m => m.team === filter.slice(5))) return false;
    return true;
  });

  const toggleStatus = (user) => {
    const next = user.status === 'suspended' ? 'active' : 'suspended';
    setUsers(users.map(u => u.id === user.id ? { ...u, status: next } : u));
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
                     value={query} onChange={e => setQuery(e.target.value)} />
            </div>
            <span className="spacer" />
            <div className="segmented">
              <button data-active={filter==='all'} onClick={() => setFilter('all')}>Todos</button>
              <button data-active={filter==='active'} onClick={() => setFilter('active')}>Activos</button>
              <button data-active={filter==='pending'} onClick={() => setFilter('pending')}>Pendientes</button>
              <button data-active={filter==='suspended'} onClick={() => setFilter('suspended')}>Suspendidos</button>
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
              {filtered.map(u => (
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
                      {u.memberships.map(m => {
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

      {openInvite && <InviteModal initialTeam={openInvite.teamId} onClose={() => setOpenInvite(null)}
                                 onInvite={(payload) => {
                                   const newUser = {
                                     id: 'u' + (users.length + 100),
                                     name: payload.email.split('@')[0].replace(/\./g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
                                     email: payload.email,
                                     initials: payload.email.slice(0, 2).toUpperCase(),
                                     color: '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6,'0'),
                                     status: 'pending',
                                     lastSeen: 'Invitada/o',
                                     memberships: payload.teams.map(t => ({ team: t, role: payload.role })),
                                   };
                                   setUsers([newUser, ...users]);
                                   setOpenInvite(null);
                                   onToast(`Invitación enviada a ${payload.email}`);
                                 }} />}

      {editingUser && <EditUserModal user={editingUser} onClose={() => setEditingUser(null)}
                                     onSave={(u) => {
                                       setUsers(users.map(x => x.id === u.id ? u : x));
                                       setEditingUser(null);
                                       onToast(`Cambios guardados en ${u.name}`);
                                     }} />}
    </>
  );
};

const InviteModal = ({ initialTeam, onClose, onInvite }) => {
  const [email, setEmail] = React.useState('');
  const [teams, setTeams] = React.useState(initialTeam ? [initialTeam] : []);
  const [role, setRole] = React.useState('member');
  const toggleTeam = (id) => setTeams(teams.includes(id) ? teams.filter(x => x !== id) : [...teams, id]);
  const valid = email.includes('@') && teams.length > 0;

  return (
    <Modal title="Invitar usuario" sub="Se enviará un email con un link para crear la cuenta."
           onClose={onClose} wide
           footer={<>
             <button className="btn" onClick={onClose}>Cancelar</button>
             <button className="btn btn--accent" disabled={!valid} onClick={() => onInvite({ email, teams, role })}>
               <Icon name="send" size={13} /> Enviar invitación
             </button>
           </>}>
      <div className="col" style={{ gap: 16 }}>
        <div className="field">
          <label className="field-label">Email</label>
          <input className="input" type="email" placeholder="nombre@empresa.com" autoFocus
                 value={email} onChange={e => setEmail(e.target.value)} />
          <span className="field-hint">Se aceptan solo dominios corporativos (@empresa.com).</span>
        </div>

        <div className="field">
          <label className="field-label">Asignar a equipos</label>
          <div className="col" style={{ gap: 6 }}>
            {TEAMS.map(t => (
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
            {['admin','member','viewer'].map(r => (
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
};

const EditUserModal = ({ user, onClose, onSave }) => {
  const [draft, setDraft] = React.useState(user);
  const updateMembership = (teamId, role) => {
    const exists = draft.memberships.find(m => m.team === teamId);
    let next;
    if (role === null) next = draft.memberships.filter(m => m.team !== teamId);
    else if (exists) next = draft.memberships.map(m => m.team === teamId ? { ...m, role } : m);
    else next = [...draft.memberships, { team: teamId, role }];
    setDraft({ ...draft, memberships: next });
  };
  return (
    <Modal title="Editar usuario" sub={user.email} onClose={onClose} wide
           footer={<>
             <button className="btn" onClick={onClose}>Cancelar</button>
             <button className="btn btn--accent" onClick={() => onSave(draft)}>Guardar cambios</button>
           </>}>
      <div className="row" style={{ marginBottom: 20, gap: 16 }}>
        <Avatar user={user} size="xl" />
        <div style={{ flex: 1 }}>
          <div className="field">
            <label className="field-label">Nombre</label>
            <input className="input" value={draft.name} onChange={e => setDraft({ ...draft, name: e.target.value })} />
          </div>
        </div>
      </div>

      <div className="field" style={{ marginBottom: 16 }}>
        <label className="field-label">Pertenencia a equipos y rol</label>
        <div className="col" style={{ gap: 6 }}>
          {TEAMS.map(t => {
            const m = draft.memberships.find(x => x.team === t.id);
            return (
              <div key={t.id} className="row" style={{ padding: 10, border: '1px solid var(--border)', borderRadius: 8 }}>
                <input type="checkbox" className="checkbox" checked={!!m}
                       onChange={() => updateMembership(t.id, m ? null : 'member')} />
                <div className="team-icon" style={{ width: 26, height: 26, fontSize: 10, borderRadius: 7, background: t.color }}>{t.glyph}</div>
                <div style={{ flex: 1, fontSize: 13, fontWeight: 500 }}>{t.name}</div>
                {m && (
                  <select className="select" style={{ width: 140, height: 30, fontSize: 12 }}
                          value={m.role} onChange={e => updateMembership(t.id, e.target.value)}>
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
};

// ─── Roles page ─────────────────────────────────────────
const RolesPage = ({ permView, setPermView, permissions, setPermissions }) => {
  const [teamId, setTeamId] = React.useState('integraciones');
  const [selectedRole, setSelectedRole] = React.useState('admin');
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
        {ROLES.map(r => (
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
            {TEAMS.map(t => (
              <button key={t.id} className={'btn btn--sm' + (teamId === t.id ? ' btn--primary' : '')} onClick={() => setTeamId(t.id)}>
                <div className="team-icon" style={{ width: 14, height: 14, fontSize: 8, borderRadius: 4, background: t.color }}>{t.glyph}</div>
                {t.name}
              </button>
            ))}
          </div>
        </div>
        <div className="card-body">
          <PermissionsEditor team={team} selectedRole={selectedRole} setSelectedRole={setSelectedRole}
                             variant={permView} onChangeVariant={setPermView}
                             permissions={permissions} setPermissions={setPermissions} />
        </div>
      </div>
    </>
  );
};

// ─── Audit page ─────────────────────────────────────────
const AuditPage = () => (
  <>
    <div className="page-head">
      <div>
        <h1 className="page-title">Auditoría</h1>
        <p className="page-sub">Historial completo de acciones en el Back Office.</p>
      </div>
      <div className="row">
        <button className="btn"><Icon name="filter" size={13} /> Filtros</button>
        <button className="btn"><Icon name="file-text" size={13} /> Exportar CSV</button>
      </div>
    </div>
    <div className="card">
      <div className="card-body card-body--flush">
        {AUDIT_LOG.concat(AUDIT_LOG).map((log, i) => (
          <div key={i} className="log-row">
            <div className="log-time">{log.time}</div>
            <div style={{ width: 24, height: 24, borderRadius: 6, background: 'var(--bg-soft)', display: 'grid', placeItems: 'center', color: 'var(--ink-3)', flexShrink: 0 }}>
              <Icon name={log.icon} size={12} />
            </div>
            <div className="log-body">
              <div className="log-msg">
                <b>{log.actor}</b> {log.action} <b>{log.target}</b> {log.meta}
              </div>
              <div className="xsmall muted" style={{ marginTop: 2 }}>IP 10.0.2.14 · Chrome en macOS</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </>
);

// ─── Member workspace view ──────────────────────────────
const MemberWorkspace = ({ activeTeam, setActiveTeam }) => {
  const team = getTeam(activeTeam || 'integraciones');
  const user = USERS[0]; // Lucía
  const myTeams = user.memberships.map(m => ({ team: getTeam(m.team), role: m.role }));
  const membership = user.memberships.find(m => m.team === team.id) || { role: 'member' };

  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">Hola, Lucía 👋</h1>
          <p className="page-sub">Estás viendo el espacio de un miembro del equipo.</p>
        </div>
        <div className="row">
          <span className="small muted">Ver como:</span>
          <select className="select" style={{ width: 180 }} value={activeTeam} onChange={e => setActiveTeam(e.target.value)}>
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
              <div className="ws-item-icon"><Icon name={['database','code','users','activity'][i] || 'file-text'} size={14} /></div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500 }}>{r}</div>
                <div className="xsmall muted">Actualizado hace {i+1} hora{i ? 's' : ''}</div>
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
            {['Ver recursos','Crear recursos','Editar recursos','Ver logs'].map(p => (
              <div key={p} className="row" style={{ padding: '6px 0', fontSize: 13 }}>
                <span className="dot dot--ok" />{p}
              </div>
            ))}
            {membership.role !== 'admin' && (
              <div className="row" style={{ padding: '6px 0', fontSize: 13, color: 'var(--ink-4)' }}>
                <span className="dot" style={{ background: 'var(--ink-5)' }} />Gestionar miembros · <span className="xsmall">requiere Admin</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

// ─── Create team modal ──────────────────────────────────
const CreateTeamModal = ({ onClose, onCreate }) => {
  const [name, setName] = React.useState('');
  const [desc, setDesc] = React.useState('');
  return (
    <Modal title="Nuevo equipo" sub="Se creará un espacio aislado con sus propios miembros y permisos." onClose={onClose}
           footer={<>
             <button className="btn" onClick={onClose}>Cancelar</button>
             <button className="btn btn--accent" disabled={!name} onClick={() => onCreate({ name, desc })}>Crear equipo</button>
           </>}>
      <div className="col" style={{ gap: 16 }}>
        <div className="field">
          <label className="field-label">Nombre del equipo</label>
          <input className="input" autoFocus value={name} onChange={e => setName(e.target.value)} placeholder="Ej: Data & Analytics" />
        </div>
        <div className="field">
          <label className="field-label">Descripción</label>
          <textarea className="textarea" value={desc} onChange={e => setDesc(e.target.value)} placeholder="¿De qué se ocupa este equipo?" />
        </div>
      </div>
    </Modal>
  );
};

Object.assign(window, { UsersPage, RolesPage, AuditPage, MemberWorkspace, CreateTeamModal });
