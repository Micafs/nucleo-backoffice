'use client';

import { useState, useEffect } from 'react';
import { Sidebar, Topbar, Toast } from '@/components/ui';
import LoginPage from '@/components/LoginPage';
import DashboardPage from '@/components/pages/DashboardPage';
import TeamsPage from '@/components/pages/TeamsPage';
import TeamDetailPage from '@/components/pages/TeamDetailPage';
import UsersPage from '@/components/pages/UsersPage';
import RolesPage from '@/components/pages/RolesPage';
import AuditPage from '@/components/pages/AuditPage';
import MemberWorkspace from '@/components/pages/MemberWorkspace';
import ProductDetailPage from '@/components/pages/ProductDetailPage';
import CreateTeamModal from '@/components/pages/CreateTeamModal';
import TweaksPanel, { TweakValues, TWEAK_DEFAULTS } from '@/components/TweaksPanel';
import { USERS, ROLE_DEFAULTS, getTeam, getProduct, User, ParsedSheet } from '@/lib/data';

type PermissionsState = Record<string, Record<string, string[]>>;
type DocTab = 'homologacion' | 'roadmap';
type ProductDocs = Record<string, Record<DocTab, ParsedSheet | null>>;

interface Route {
  page: string;
  teamId?: string;
  productId?: string;
  productTab?: string;
}

const INITIAL_PERMISSIONS: PermissionsState = {
  integraciones: { admin: [...ROLE_DEFAULTS.admin], member: [...ROLE_DEFAULTS.member], viewer: [...ROLE_DEFAULTS.viewer] },
  tech: { admin: [...ROLE_DEFAULTS.admin], member: [...ROLE_DEFAULTS.member], viewer: [...ROLE_DEFAULTS.viewer] },
  producto: { admin: [...ROLE_DEFAULTS.admin], member: [...ROLE_DEFAULTS.member], viewer: [...ROLE_DEFAULTS.viewer] },
};

export default function App() {
  const [t, setTweaks] = useState<TweakValues>(TWEAK_DEFAULTS);
  const [view, setView] = useState<'login' | 'admin' | 'member'>('login');
  const [route, setRoute] = useState<Route>({ page: 'dashboard' });
  const [users, setUsers] = useState<User[]>(USERS);
  const [openInvite, setOpenInvite] = useState<{ teamId: string | null } | null>(null);
  const [openCreateTeam, setOpenCreateTeam] = useState(false);
  const [toasts, setToasts] = useState<Array<{ id: number; message: string }>>([]);
  const [activeTeam, setActiveTeam] = useState('integraciones');
  const [permissions, setPermissions] = useState<PermissionsState>(INITIAL_PERMISSIONS);
  const [productDocs, setProductDocs] = useState<ProductDocs>({});

  const setTweak = (key: keyof TweakValues, value: string) => {
    setTweaks((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    document.documentElement.style.setProperty('--accent', t.accentColor);
  }, [t.accentColor]);

  const onToast = (msg: string) => {
    const id = Date.now() + Math.random();
    setToasts((ts) => [...ts, { id, message: msg }]);
  };

  const permView = t.permissionsView;
  const setPermView = (v: string) => setTweak('permissionsView', v as keyof TweakValues);

  const invitePending = users.filter((u) => u.status === 'pending').length;

  const getDocsFor = (productId: string): Record<DocTab, ParsedSheet | null> => ({
    homologacion: productDocs[productId]?.homologacion ?? null,
    roadmap: productDocs[productId]?.roadmap ?? null,
  });

  const updateProductDoc = (productId: string, tab: DocTab, sheet: ParsedSheet) => {
    setProductDocs((prev) => ({
      ...prev,
      [productId]: { ...getDocsFor(productId), [tab]: sheet },
    }));
  };

  const crumbs = (() => {
    if (route.page === 'dashboard') return ['Back Office', 'Dashboard'];
    if (route.page === 'teams') return ['Back Office', 'Equipos'];
    if (route.page === 'team-detail' && route.teamId) return ['Back Office', 'Equipos', getTeam(route.teamId).name];
    if (route.page === 'users') return ['Back Office', 'Usuarios'];
    if (route.page === 'roles') return ['Back Office', 'Roles y permisos'];
    if (route.page === 'audit') return ['Back Office', 'Auditoría'];
    if (route.page === 'workspace') return ['Mi espacio', getTeam(activeTeam).name];
    if (route.page === 'product-detail' && route.productId) {
      const p = getProduct(route.productId);
      return ['Mi espacio', getTeam(activeTeam).name, p?.name ?? route.productId];
    }
    return ['Back Office'];
  })();

  if (view === 'login') {
    return (
      <>
        <LoginPage onLogin={() => { setView('admin'); setRoute({ page: 'dashboard' }); }} />
        <TweaksPanel t={t} setTweak={setTweak} />
        <div className="toast-stack">
          {toasts.map((x) => (
            <Toast key={x.id} message={x.message} onDone={() => setToasts((ts) => ts.filter((y) => y.id !== x.id))} />
          ))}
        </div>
      </>
    );
  }

  const handleNavigate = (r: { page: string; teamId?: string; openInvite?: boolean; productId?: string; productTab?: string }) => {
    if (r.openInvite) {
      setOpenInvite({ teamId: null });
      setRoute({ page: 'users' });
    } else {
      setRoute(r);
    }
  };

  return (
    <div className="app">
      <Sidebar
        route={{ ...route, activeTeam }}
        onNavigate={setRoute}
        view={view}
        invitePending={invitePending}
        onSwitchView={() => {
          if (view === 'admin') { setView('member'); setRoute({ page: 'workspace' }); }
          else { setView('admin'); setRoute({ page: 'dashboard' }); }
        }}
      />
      <main className="main">
        <Topbar crumbs={crumbs} />
        <div className="content">
          {view === 'admin' && route.page === 'dashboard' && (
            <DashboardPage users={users} onNavigate={handleNavigate} />
          )}
          {view === 'admin' && route.page === 'teams' && (
            <TeamsPage users={users} onNavigate={setRoute} onCreate={() => setOpenCreateTeam(true)} />
          )}
          {view === 'admin' && route.page === 'team-detail' && route.teamId && (
            <TeamDetailPage
              teamId={route.teamId}
              users={users}
              onNavigate={setRoute}
              onInvite={(teamId) => setOpenInvite({ teamId })}
              permView={permView as 'matrix' | 'groups' | 'cards'}
              setPermView={(v) => setTweak('permissionsView', v)}
              permissions={permissions}
              setPermissions={setPermissions}
            />
          )}
          {view === 'admin' && route.page === 'users' && (
            <UsersPage
              users={users}
              setUsers={setUsers}
              openInvite={openInvite}
              setOpenInvite={setOpenInvite}
              onToast={onToast}
            />
          )}
          {view === 'admin' && route.page === 'roles' && (
            <RolesPage
              permView={permView as 'matrix' | 'groups' | 'cards'}
              setPermView={(v) => setTweak('permissionsView', v)}
              permissions={permissions}
              setPermissions={setPermissions}
            />
          )}
          {view === 'admin' && route.page === 'audit' && <AuditPage />}
          {view === 'member' && route.page !== 'product-detail' && (
            <MemberWorkspace
              activeTeam={activeTeam}
              setActiveTeam={setActiveTeam}
              onNavigate={setRoute}
            />
          )}
          {view === 'member' && route.page === 'product-detail' && route.productId && (() => {
            const product = getProduct(route.productId);
            if (!product) return null;
            return (
              <ProductDetailPage
                product={product}
                docs={getDocsFor(route.productId)}
                onUpdate={(tab, sheet) => updateProductDoc(route.productId!, tab, sheet)}
                onBack={() => setRoute({ page: 'workspace' })}
                initialTab={(route.productTab as DocTab) || 'homologacion'}
              />
            );
          })()}
        </div>
      </main>

      {openCreateTeam && (
        <CreateTeamModal
          onClose={() => setOpenCreateTeam(false)}
          onCreate={() => { setOpenCreateTeam(false); onToast('Equipo creado'); }}
        />
      )}

      <TweaksPanel t={t} setTweak={setTweak} />

      <div className="toast-stack">
        {toasts.map((x) => (
          <Toast key={x.id} message={x.message} onDone={() => setToasts((ts) => ts.filter((y) => y.id !== x.id))} />
        ))}
      </div>
    </div>
  );
}
