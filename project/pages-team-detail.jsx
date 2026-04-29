// ─── Team Detail (members + permissions) ────────────────
const TeamDetailPage = ({ teamId, users, onNavigate, onInvite, permView, setPermView, permissions, setPermissions }) => {
  const team = getTeam(teamId);
  const [tab, setTab] = React.useState('members');
  const [selectedRole, setSelectedRole] = React.useState('admin');
  const [query, setQuery] = React.useState('');

  const members = users
    .filter(u => u.memberships.some(m => m.team === teamId))
    .filter(u => !query || u.name.toLowerCase().includes(query.toLowerCase()) || u.email.toLowerCase().includes(query.toLowerCase()));

  return (
    <>
      <div className="page-head">
        <div className="row" style={{ alignItems: 'flex-start', gap: 16 }}>
          <div className="team-icon" style={{ background: team.color, width: 48, height: 48, fontSize: 16, borderRadius: 12 }}>{team.glyph}</div>
          <div>
            <h1 className="page-title" style={{ marginBottom: 2 }}>{team.name}</h1>
            <p className="page-sub">{team.description}</p>
          </div>
        </div>
        <div className="row">
          <button className="btn"><Icon name="settings" size={14} /> Configuración</button>
          <button className="btn btn--accent" onClick={() => onInvite(teamId)}>
            <Icon name="user-plus" size={14} /> Agregar miembro
          </button>
        </div>
      </div>

      <div className="tabs">
        <button className="tab" data-active={tab==='members'} onClick={() => setTab('members')}>
          <Icon name="users" size={13} /> Miembros <span className="badge badge--mono">{members.length}</span>
        </button>
        <button className="tab" data-active={tab==='permissions'} onClick={() => setTab('permissions')}>
          <Icon name="shield" size={13} /> Permisos por rol
        </button>
        <button className="tab" data-active={tab==='settings'} onClick={() => setTab('settings')}>
          <Icon name="settings" size={13} /> Ajustes
        </button>
      </div>

      {tab === 'members' && (
        <div className="card">
          <div className="card-head">
            <div className="row" style={{ flex: 1 }}>
              <div className="input-wrap" style={{ flex: 1, maxWidth: 320 }}>
                <span className="lead-icon"><Icon name="search" size={13} /></span>
                <input className="input input--with-icon" placeholder="Buscar miembro por nombre o email…"
                       value={query} onChange={e => setQuery(e.target.value)} />
              </div>
              <span className="spacer" />
              <button className="btn btn--sm"><Icon name="filter" size={12} /> Filtros</button>
            </div>
          </div>
          <div className="card-body card-body--flush">
            {members.map(u => {
              const membership = u.memberships.find(m => m.team === teamId);
              return (
                <div key={u.id} className="member-row">
                  <Avatar user={u} />
                  <div className="member-info">
                    <div className="member-name">{u.name}</div>
                    <div className="member-email">{u.email}</div>
                  </div>
                  <StatusDot status={u.status} />
                  <RolePill role={membership.role} />
                  <button className="btn btn--ghost btn--icon btn--sm"><Icon name="more" size={14} /></button>
                </div>
              );
            })}
            {members.length === 0 && (
              <div className="empty">
                <div className="empty-icon"><Icon name="users" size={20} /></div>
                <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink)' }}>Sin miembros</div>
                <div className="small" style={{ marginTop: 4 }}>Invitá personas para empezar a colaborar.</div>
              </div>
            )}
          </div>
        </div>
      )}

      {tab === 'permissions' && (
        <PermissionsEditor
          team={team}
          selectedRole={selectedRole}
          setSelectedRole={setSelectedRole}
          variant={permView}
          onChangeVariant={setPermView}
          permissions={permissions}
          setPermissions={setPermissions}
        />
      )}

      {tab === 'settings' && (
        <div className="card">
          <div className="card-body">
            <div className="col" style={{ gap: 16, maxWidth: 520 }}>
              <div className="field">
                <label className="field-label">Nombre del equipo</label>
                <input className="input" defaultValue={team.name} />
              </div>
              <div className="field">
                <label className="field-label">Slug (identificador)</label>
                <input className="input mono" defaultValue={team.slug} />
                <span className="field-hint">Se usa en URLs y APIs. No se puede cambiar si hay integraciones activas.</span>
              </div>
              <div className="field">
                <label className="field-label">Descripción</label>
                <textarea className="textarea" defaultValue={team.description} />
              </div>
              <div className="sep" />
              <div className="row" style={{ justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontWeight: 500, fontSize: 13, color: 'var(--danger)' }}>Zona de peligro</div>
                  <div className="small muted">Eliminar el equipo es permanente y afecta a todos sus miembros.</div>
                </div>
                <button className="btn btn--danger"><Icon name="trash" size={13} /> Eliminar equipo</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// ─── Permissions editor with 3 variants ─────────────────
const PermissionsEditor = ({ team, selectedRole, setSelectedRole, variant, onChangeVariant, permissions, setPermissions }) => {
  const teamKey = team.id;
  const rolePerms = (permissions[teamKey]?.[selectedRole]) || ROLE_DEFAULTS[selectedRole] || [];

  const toggle = (permId) => {
    const next = rolePerms.includes(permId) ? rolePerms.filter(p => p !== permId) : [...rolePerms, permId];
    setPermissions({
      ...permissions,
      [teamKey]: { ...(permissions[teamKey] || {}), [selectedRole]: next },
    });
  };
  const has = (permId) => rolePerms.includes(permId);

  return (
    <div className="card">
      <div className="card-head">
        <div>
          <h3 className="card-title">Permisos de <RolePill role={selectedRole} /> en {team.name}</h3>
          <p className="card-sub">Configurá qué puede hacer cada rol dentro del espacio del equipo.</p>
        </div>
        <div className="row">
          <div className="segmented">
            <button data-active={variant==='matrix'} onClick={() => onChangeVariant('matrix')}>Matriz</button>
            <button data-active={variant==='groups'} onClick={() => onChangeVariant('groups')}>Agrupado</button>
            <button data-active={variant==='cards'} onClick={() => onChangeVariant('cards')}>Cards</button>
          </div>
        </div>
      </div>

      <div className="card-body">
        {variant !== 'matrix' && (
          <div className="row" style={{ marginBottom: 16, flexWrap: 'wrap' }}>
            <span className="small muted">Rol:</span>
            {['admin','member','viewer'].map(r => (
              <button key={r} className={'btn btn--sm' + (selectedRole === r ? ' btn--primary' : '')}
                      onClick={() => setSelectedRole(r)}>
                {r === 'admin' ? 'Admin de equipo' : r === 'member' ? 'Miembro' : 'Lector'}
              </button>
            ))}
          </div>
        )}

        {variant === 'matrix' && <PermissionsMatrix team={team} permissions={permissions} setPermissions={setPermissions} />}
        {variant === 'groups' && <PermissionsGroups has={has} toggle={toggle} />}
        {variant === 'cards'  && <PermissionsCards  has={has} toggle={toggle} />}
      </div>
    </div>
  );
};

const PermissionsMatrix = ({ team, permissions, setPermissions }) => {
  const teamKey = team.id;
  const getPerms = (role) => permissions[teamKey]?.[role] || ROLE_DEFAULTS[role] || [];
  const toggle = (role, permId) => {
    const current = getPerms(role);
    const next = current.includes(permId) ? current.filter(p => p !== permId) : [...current, permId];
    setPermissions({
      ...permissions,
      [teamKey]: { ...(permissions[teamKey] || {}), [role]: next },
    });
  };
  return (
    <div style={{ overflow: 'auto' }}>
      <table className="perm-matrix">
        <thead>
          <tr>
            <th style={{ minWidth: 260 }}>Permiso</th>
            <th>Admin de equipo</th>
            <th>Miembro</th>
            <th>Lector</th>
          </tr>
        </thead>
        <tbody>
          {PERMISSION_GROUPS.map(group => (
            <React.Fragment key={group.id}>
              <tr>
                <td colSpan={4} style={{ background: 'var(--bg-soft)', padding: '8px 14px', textAlign: 'left' }}>
                  <div className="row xsmall" style={{ color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
                    <Icon name={group.icon} size={12} /> {group.label}
                  </div>
                </td>
              </tr>
              {group.permissions.map(p => (
                <tr key={p.id}>
                  <td>
                    <div className="perm-name">{p.name}</div>
                    <div className="perm-desc">{p.desc}</div>
                  </td>
                  {['admin','member','viewer'].map(role => (
                    <td key={role}>
                      <input type="checkbox" className="checkbox"
                             checked={getPerms(role).includes(p.id)}
                             onChange={() => toggle(role, p.id)} />
                    </td>
                  ))}
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const PermissionsGroups = ({ has, toggle }) => (
  <>
    {PERMISSION_GROUPS.map(group => {
      const allOn = group.permissions.every(p => has(p.id));
      const someOn = group.permissions.some(p => has(p.id));
      return (
        <div key={group.id} className="perm-group">
          <div className="perm-group-head">
            <div className="perm-group-title">
              <Icon name={group.icon} size={14} /> {group.label}
            </div>
            <div className="row">
              <span className="xsmall muted tabular">
                {group.permissions.filter(p => has(p.id)).length}/{group.permissions.length}
              </span>
              <input type="checkbox" className="checkbox"
                     checked={allOn}
                     ref={el => { if (el) el.indeterminate = !allOn && someOn; }}
                     onChange={() => {
                       group.permissions.forEach(p => {
                         if (has(p.id) === allOn) toggle(p.id);
                       });
                     }} />
            </div>
          </div>
          <div className="perm-group-body">
            {group.permissions.map(p => (
              <label key={p.id} className="perm-check">
                <input type="checkbox" className="checkbox" checked={has(p.id)} onChange={() => toggle(p.id)} />
                <div className="perm-check-content">
                  <div className="perm-check-label">{p.name}</div>
                  <div className="perm-check-desc">{p.desc}</div>
                </div>
              </label>
            ))}
          </div>
        </div>
      );
    })}
  </>
);

const PermissionsCards = ({ has, toggle }) => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
    {PERMISSION_GROUPS.flatMap(g => g.permissions.map(p => ({ ...p, groupIcon: g.icon }))).map(p => (
      <div key={p.id} className="perm-card">
        <div className="perm-card-icon"><Icon name={p.groupIcon} size={14} /></div>
        <div className="perm-card-content">
          <div className="perm-card-title">{p.name}</div>
          <div className="perm-card-desc">{p.desc}</div>
        </div>
        <button className="switch" data-on={has(p.id)} onClick={() => toggle(p.id)}><i /></button>
      </div>
    ))}
  </div>
);

Object.assign(window, { TeamDetailPage });
