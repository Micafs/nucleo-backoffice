// ─── Shared UI components ────────────────────────────────

const Avatar = ({ user, size = 'md' }) => {
  const cls = size === 'sm' ? 'avatar avatar--sm' : size === 'lg' ? 'avatar avatar--lg' : size === 'xl' ? 'avatar avatar--xl' : 'avatar';
  return (
    <div className={cls} style={{ background: user.color || 'var(--accent)' }}>
      {user.initials}
    </div>
  );
};

const TeamGlyph = ({ team, size = 14 }) => (
  <div className="team-glyph" style={{ background: team.color, width: size, height: size, fontSize: Math.max(8, size * 0.55) }}>
    {team.glyph}
  </div>
);

const TeamChip = ({ team, role }) => (
  <span className="team-chip">
    <TeamGlyph team={team} />
    {team.name}
    {role && <span style={{ color: 'var(--ink-4)', fontWeight: 400 }}>· {role === 'admin' ? 'Admin' : role === 'member' ? 'Miembro' : role === 'viewer' ? 'Lector' : role}</span>}
  </span>
);

const RolePill = ({ role }) => {
  const label = role === 'super' ? 'Super Admin' : role === 'admin' ? 'Admin' : role === 'member' ? 'Miembro' : role === 'viewer' ? 'Lector' : role;
  return <span className="role-pill" data-role={role}>{label}</span>;
};

const StatusDot = ({ status }) => {
  const map = { active: 'ok', pending: 'warn', suspended: 'danger' };
  const label = { active: 'Activo', pending: 'Pendiente', suspended: 'Suspendido' };
  return <span className="row" style={{ gap: 6, fontSize: 12 }}><span className={`dot dot--${map[status]}`} />{label[status]}</span>;
};

const AvatarStack = ({ users, max = 4 }) => {
  const shown = users.slice(0, max);
  const extra = users.length - shown.length;
  return (
    <div className="avatar-stack">
      {shown.map(u => <Avatar key={u.id} user={u} size="sm" />)}
      {extra > 0 && <div className="avatar avatar--sm avatar-stack-more">+{extra}</div>}
    </div>
  );
};

const Modal = ({ title, sub, onClose, children, footer, wide }) => {
  React.useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose?.(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className={'modal' + (wide ? ' modal--wide' : '')} onClick={e => e.stopPropagation()}>
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
};

const Toast = ({ message, onDone }) => {
  React.useEffect(() => {
    const t = setTimeout(onDone, 2800);
    return () => clearTimeout(t);
  }, [onDone]);
  return <div className="toast"><span className="dot" />{message}</div>;
};

// ─── Sidebar nav ─────────────────────────────────────────
const Sidebar = ({ route, onNavigate, view, onSwitchView, invitePending }) => {
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
            {TEAMS.map(t => (
              <button key={t.id} className="nav-item"
                      data-active={route.page === 'team-detail' && route.teamId === t.id}
                      onClick={() => onNavigate({ page: 'team-detail', teamId: t.id })}>
                <span className="team-glyph" style={{ background: t.color, width: 16, height: 16, fontSize: 9 }}>{t.glyph}</span>
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
                  <Icon name={['database','code','users','activity'][i] || 'file-text'} className="nav-icon" /> {r}
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
};

// ─── Topbar / breadcrumbs ────────────────────────────────
const Topbar = ({ crumbs, actions }) => (
  <div className="topbar">
    <div className="breadcrumbs">
      {crumbs.map((c, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span className="sep"><Icon name="chevron-right" size={12} /></span>}
          <span className="crumb" data-current={i === crumbs.length - 1}>{c}</span>
        </React.Fragment>
      ))}
    </div>
    <div className="topbar-right">
      <button className="btn btn--ghost btn--icon btn--sm"><Icon name="search" size={14} /></button>
      <button className="btn btn--ghost btn--icon btn--sm"><Icon name="bell" size={14} /></button>
      {actions}
    </div>
  </div>
);

Object.assign(window, {
  Avatar, TeamGlyph, TeamChip, RolePill, StatusDot, AvatarStack,
  Modal, Toast, Sidebar, Topbar,
});
