'use client';

// ─── Componente raíz de la aplicación ─────────────────────
// Orquesta todo: routing, estado global, permisos, toasts y docs.
// No renderiza UI propia; delega en Sidebar, Topbar y las páginas.
//
// Flujo general:
//  1. El usuario arranca en la vista 'login'
//  2. Al autenticarse, pasa a 'admin' (Super Admin) o 'member' (Miembro de equipo)
//  3. La ruta activa determina qué página se monta en <main>

import { useState, useEffect } from 'react';
import { Sidebar, Topbar, Toast } from '@/components/ui';
import LoginPage from '@/components/LoginPage';
import DashboardPage from '@/components/pages/DashboardPage';
import TeamsPage from '@/components/pages/TeamsPage';
import TeamDetailPage from '@/components/pages/TeamDetailPage';
import UsersPage from '@/components/pages/UsersPage';
import RolesPage from '@/components/pages/RolesPage';
import AuditPage from '@/components/pages/AuditPage';
import RoadmapPage from '@/components/pages/RoadmapPage';
import MemberWorkspace from '@/components/pages/MemberWorkspace';
import ProductDetailPage from '@/components/pages/ProductDetailPage';
import CreateTeamModal from '@/components/pages/CreateTeamModal';
import TweaksPanel, { TweakValues, TWEAK_DEFAULTS } from '@/components/TweaksPanel';
import { USERS, ROLE_DEFAULTS, getTeam, getProduct, User, ParsedSheet } from '@/lib/data';
import type { Route, PermissionsState, DocTab, ProductDocs } from '@/types/app.types';

// Estado inicial de permisos: todos los equipos arrancan con los defaults del rol
const INITIAL_PERMISSIONS: PermissionsState = {
  integraciones: { admin: [...ROLE_DEFAULTS.admin], member: [...ROLE_DEFAULTS.member], viewer: [...ROLE_DEFAULTS.viewer] },
  tech: { admin: [...ROLE_DEFAULTS.admin], member: [...ROLE_DEFAULTS.member], viewer: [...ROLE_DEFAULTS.viewer] },
  producto: { admin: [...ROLE_DEFAULTS.admin], member: [...ROLE_DEFAULTS.member], viewer: [...ROLE_DEFAULTS.viewer] },
};

export default function App() {
  // ── Estado de tweaks de diseño ─────────────────────────
  // Controla variaciones visuales (color de acento, vista de permisos)
  const [t, setTweaks] = useState<TweakValues>(TWEAK_DEFAULTS);

  // ── Estado de navegación ───────────────────────────────
  const [view, setView] = useState<'login' | 'admin' | 'member'>('login');
  const [route, setRoute] = useState<Route>({ page: 'dashboard' });
  const [activeTeam, setActiveTeam] = useState('integraciones'); // Equipo activo en vista miembro

  // ── Estado de datos ────────────────────────────────────
  const [users, setUsers] = useState<User[]>(USERS);
  const [permissions, setPermissions] = useState<PermissionsState>(INITIAL_PERMISSIONS);
  const [productDocs, setProductDocs] = useState<ProductDocs>({}); // Docs cargados por producto

  // ── Estado de modales ──────────────────────────────────
  const [openInvite, setOpenInvite] = useState<{ teamId: string | null } | null>(null);
  const [openCreateTeam, setOpenCreateTeam] = useState(false);

  // ── Estado de notificaciones ───────────────────────────
  const [toasts, setToasts] = useState<Array<{ id: number; message: string }>>([]);

  // Actualiza una sola clave del objeto de tweaks
  const setTweak = (key: keyof TweakValues, value: string) => {
    setTweaks((prev) => ({ ...prev, [key]: value }));
  };

  // Sincroniza el color de acento con la variable CSS del documento
  useEffect(() => {
    document.documentElement.style.setProperty('--accent', t.accentColor);
  }, [t.accentColor]);

  // Agrega un toast a la pila; se elimina solo cuando el componente Toast llama a onDone
  const onToast = (msg: string) => {
    const id = Date.now() + Math.random();
    setToasts((ts) => [...ts, { id, message: msg }]);
  };

  // Alias cortos para pasar la configuración de permisos a las páginas
  const permView = t.permissionsView;
  const setPermView = (v: string) => setTweak('permissionsView', v as keyof TweakValues);

  // Cantidad de invitaciones pendientes que se muestra como badge en Sidebar
  const invitePending = users.filter((u) => u.status === 'pending').length;

  // ── Helpers de documentos de producto ─────────────────
  // Devuelve los docs cargados para un producto, con null si todavía no se subió nada
  const getDocsFor = (productId: string): Record<DocTab, ParsedSheet | null> => ({
    homologacion: productDocs[productId]?.homologacion ?? null,
    roadmap: productDocs[productId]?.roadmap ?? null,
  });

  // Persiste una hoja parseada en el estado local del producto
  const updateProductDoc = (productId: string, tab: DocTab, sheet: ParsedSheet) => {
    setProductDocs((prev) => ({
      ...prev,
      [productId]: { ...getDocsFor(productId), [tab]: sheet },
    }));
  };

  // ── Breadcrumbs ────────────────────────────────────────
  // Calcula el rastro de navegación según la ruta activa
  const crumbs = (() => {
    if (route.page === 'dashboard') return ['Back Office', 'Dashboard'];
    if (route.page === 'teams') return ['Back Office', 'Equipos'];
    if (route.page === 'team-detail' && route.teamId) return ['Back Office', 'Equipos', getTeam(route.teamId).name];
    if (route.page === 'users') return ['Back Office', 'Usuarios'];
    if (route.page === 'roles') return ['Back Office', 'Roles y permisos'];
    if (route.page === 'audit') return ['Back Office', 'Auditoría'];
    if (route.page === 'roadmap') return ['Back Office', 'Roadmap'];
    if (route.page === 'workspace') return ['Mi espacio', getTeam(activeTeam).name];
    if (route.page === 'product-detail' && route.productId) {
      const p = getProduct(route.productId);
      return ['Mi espacio', getTeam(activeTeam).name, p?.name ?? route.productId];
    }
    return ['Back Office'];
  })();

  // ── Vista Login ────────────────────────────────────────
  // Renderizado separado: la pantalla de login no tiene Sidebar ni Topbar
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

  // Maneja navegación con lógica especial: openInvite abre el modal de invitación
  const handleNavigate = (r: { page: string; teamId?: string; openInvite?: boolean; productId?: string; productTab?: string }) => {
    if (r.openInvite) {
      setOpenInvite({ teamId: null });
      setRoute({ page: 'users' });
    } else {
      setRoute(r);
    }
  };

  // ── Vista principal (admin / member) ───────────────────
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
          {/* ── Páginas de Super Admin ── */}
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
          {view === 'admin' && route.page === 'roadmap' && <RoadmapPage />}

          {/* ── Páginas de Miembro ── */}
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

      {/* ── Modales globales ── */}
      {openCreateTeam && (
        <CreateTeamModal
          onClose={() => setOpenCreateTeam(false)}
          onCreate={() => { setOpenCreateTeam(false); onToast('Equipo creado'); }}
        />
      )}

      {/* Panel de tweaks flotante (herramienta de diseño) */}
      <TweaksPanel t={t} setTweak={setTweak} />

      {/* Pila de toasts en la esquina inferior */}
      <div className="toast-stack">
        {toasts.map((x) => (
          <Toast key={x.id} message={x.message} onDone={() => setToasts((ts) => ts.filter((y) => y.id !== x.id))} />
        ))}
      </div>
    </div>
  );
}
