// ─── Main App ───────────────────────────────────────────

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "permissionsView": "matrix",
  "accentColor": "#4f46e5",
  "density": "regular",
  "showTeamColors": true
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [view, setView] = React.useState('login'); // login | admin | member
  const [route, setRoute] = React.useState({ page: 'dashboard' });
  const [users, setUsers] = React.useState(USERS);
  const [openInvite, setOpenInvite] = React.useState(null);
  const [openCreateTeam, setOpenCreateTeam] = React.useState(false);
  const [toasts, setToasts] = React.useState([]);
  const [activeTeam, setActiveTeam] = React.useState('integraciones');
  const [permissions, setPermissions] = React.useState({
    integraciones: { admin: ROLE_DEFAULTS.admin, member: ROLE_DEFAULTS.member, viewer: ROLE_DEFAULTS.viewer },
    tech:          { admin: ROLE_DEFAULTS.admin, member: ROLE_DEFAULTS.member, viewer: ROLE_DEFAULTS.viewer },
    producto:      { admin: ROLE_DEFAULTS.admin, member: ROLE_DEFAULTS.member, viewer: ROLE_DEFAULTS.viewer },
  });

  const onToast = (msg) => {
    const id = Date.now() + Math.random();
    setToasts(ts => [...ts, { id, message: msg }]);
  };

  React.useEffect(() => {
    document.documentElement.style.setProperty('--accent', t.accentColor);
  }, [t.accentColor]);

  // Apply Tweaks: permissions view variant
  const permView = t.permissionsView;
  const setPermView = (v) => setTweak('permissionsView', v);

  const invitePending = users.filter(u => u.status === 'pending').length;

  const crumbs = (() => {
    if (route.page === 'dashboard') return ['Back Office', 'Dashboard'];
    if (route.page === 'teams') return ['Back Office', 'Equipos'];
    if (route.page === 'team-detail') return ['Back Office', 'Equipos', getTeam(route.teamId).name];
    if (route.page === 'users') return ['Back Office', 'Usuarios'];
    if (route.page === 'roles') return ['Back Office', 'Roles y permisos'];
    if (route.page === 'audit') return ['Back Office', 'Auditoría'];
    if (route.page === 'workspace') return ['Mi espacio', getTeam(activeTeam).name];
    return ['Back Office'];
  })();

  if (view === 'login') {
    return (
      <>
        <LoginPage onLogin={() => { setView('admin'); setRoute({ page: 'dashboard' }); }} />
        <TweaksPanelContent t={t} setTweak={setTweak} showLoginTweaks />
        <div className="toast-stack">
          {toasts.map(x => <Toast key={x.id} message={x.message} onDone={() => setToasts(ts => ts.filter(y => y.id !== x.id))} />)}
        </div>
      </>
    );
  }

  return (
    <div className="app" data-screen-label={view === 'admin' ? 'Super Admin' : 'Miembro'}>
      <Sidebar route={{ ...route, activeTeam }}
               onNavigate={setRoute}
               view={view}
               invitePending={invitePending}
               onSwitchView={() => {
                 if (view === 'admin') { setView('member'); setRoute({ page: 'workspace' }); }
                 else { setView('admin'); setRoute({ page: 'dashboard' }); }
               }} />
      <main className="main">
        <Topbar crumbs={crumbs} />
        <div className="content">
          {view === 'admin' && route.page === 'dashboard' && <DashboardPage users={users} onNavigate={(r) => { if (r.openInvite) setOpenInvite({ teamId: null }); else setRoute(r); }} />}
          {view === 'admin' && route.page === 'teams' && <TeamsPage users={users} onNavigate={setRoute} onCreate={() => setOpenCreateTeam(true)} />}
          {view === 'admin' && route.page === 'team-detail' && (
            <TeamDetailPage teamId={route.teamId} users={users}
                            onNavigate={setRoute}
                            onInvite={(teamId) => setOpenInvite({ teamId })}
                            permView={permView} setPermView={setPermView}
                            permissions={permissions} setPermissions={setPermissions} />
          )}
          {view === 'admin' && route.page === 'users' && (
            <UsersPage users={users} setUsers={setUsers}
                       openInvite={openInvite} setOpenInvite={setOpenInvite}
                       onToast={onToast} />
          )}
          {view === 'admin' && route.page === 'roles' && (
            <RolesPage permView={permView} setPermView={setPermView}
                       permissions={permissions} setPermissions={setPermissions} />
          )}
          {view === 'admin' && route.page === 'audit' && <AuditPage />}
          {view === 'member' && <MemberWorkspace activeTeam={activeTeam} setActiveTeam={setActiveTeam} />}
        </div>
      </main>

      {openCreateTeam && <CreateTeamModal onClose={() => setOpenCreateTeam(false)}
                                          onCreate={() => { setOpenCreateTeam(false); onToast('Equipo creado'); }} />}

      <TweaksPanelContent t={t} setTweak={setTweak} />

      <div className="toast-stack">
        {toasts.map(x => <Toast key={x.id} message={x.message} onDone={() => setToasts(ts => ts.filter(y => y.id !== x.id))} />)}
      </div>
    </div>
  );
}

function TweaksPanelContent({ t, setTweak, showLoginTweaks }) {
  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Variaciones de permisos" />
      <TweakRadio label="Vista de permisos" value={t.permissionsView}
                  options={[
                    { value: 'matrix', label: 'Matriz' },
                    { value: 'groups', label: 'Grupos' },
                    { value: 'cards',  label: 'Cards' },
                  ]}
                  onChange={v => setTweak('permissionsView', v)} />
      <div className="xsmall" style={{ color: 'rgba(41,38,27,.55)', lineHeight: 1.5 }}>
        Tres formas de visualizar el mismo modelo de permisos. Entrá a <b>Roles y permisos</b> o a un equipo &gt; pestaña <b>Permisos</b> para ver el cambio en vivo.
      </div>

      <TweakSection label="Branding" />
      <TweakColor label="Color de acento" value={t.accentColor}
                  onChange={v => setTweak('accentColor', v)} />
    </TweaksPanel>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
