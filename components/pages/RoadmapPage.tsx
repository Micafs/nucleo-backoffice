'use client';

// ─── Página: Roadmap ───────────────────────────────────────
// Responsabilidad: solo presentación.
// Todo el estado, la carga de datos y el auto-refresh están en useRoadmap().
// Este componente calcula los datos derivados para las estadísticas
// y construye el JSX de las tablas, cards y filtros.

import { useState } from 'react';
import Icon from '@/components/Icon';
import { useRoadmap } from '@/hooks/useRoadmap';
import { MONTH_NAMES, fmtTime } from '@/utils/csvParser';

export default function RoadmapPage() {
  // Toda la lógica de carga y estado viene del hook
  const {
    data, loading, error, lastRefresh,
    activeUrl, urlInput, autoRefresh, configOpen,
    setUrlInput, setAutoRefresh, setConfigOpen,
    connect, refresh,
  } = useRoadmap();

  // Filtros de la tabla de detalle (estado local de UI, no necesitan ir al hook)
  const [search, setSearch] = useState('');
  const [filterProduct, setFilterProduct] = useState('');

  // ─── Cálculos derivados de los datos ──────────────────────
  // Determinan qué meses son pasado, presente y futuro para colorear la tabla
  const currentMonthIdx = new Date().getMonth();
  const currentMonth = MONTH_NAMES[currentMonthIdx];

  const monthCols = data?.monthCols ?? [];
  const currentMonthPos = monthCols.indexOf(currentMonth);
  const pastMonths = currentMonthPos >= 0 ? monthCols.slice(0, currentMonthPos) : [];
  const futureMonths = currentMonthPos >= 0 ? monthCols.slice(currentMonthPos + 1) : monthCols;

  const allRows = data?.rows ?? [];
  const featureRows = allRows.filter((r) => r.Funcionalidades); // Solo filas con funcionalidad definida
  const totalRows = featureRows.length;

  // Contadores para las tarjetas de estadísticas del encabezado
  const activeCount = featureRows.filter((r) => r[currentMonth] === '●').length;
  const prevCount = featureRows.filter((r) => pastMonths.some((m) => r[m] === '●')).length;
  const upcomingCount = featureRows.filter((r) => futureMonths.some((m) => r[m] === '●')).length;

  // Lista de productos únicos y su cantidad de funcionalidades (para el gráfico de barras)
  const products = Array.from(new Set(allRows.map((r) => r.Producto).filter(Boolean)));
  const productCounts = products
    .map((p) => ({ name: p, count: allRows.filter((r) => r.Producto === p).length }))
    .sort((a, b) => b.count - a.count);

  // Actividad por mes: cuántas funcionalidades tienen marca '●' en cada columna de mes
  const monthActivity = monthCols.map((m) => ({
    month: m,
    count: allRows.filter((r) => r[m] === '●').length,
    isPast: pastMonths.includes(m),
    isCurrent: m === currentMonth,
  }));

  // Filas visibles en la tabla de detalle según los filtros activos
  const filteredRows = allRows.filter((r) => {
    if (!r.Funcionalidades && !r.Producto) return false;
    const matchSearch =
      !search ||
      r.Funcionalidades?.toLowerCase().includes(search.toLowerCase()) ||
      r.Producto?.toLowerCase().includes(search.toLowerCase());
    const matchProduct = !filterProduct || r.Producto === filterProduct;
    return matchSearch && matchProduct;
  });

  return (
    <>
      {/* ─── Page header ─── */}
      <div className="page-head">
        <div>
          <h1 className="page-title">Roadmap</h1>
          <p className="page-sub">Visualización en tiempo real desde CSV publicado.</p>
        </div>
        <div className="row">
          {lastRefresh && (
            <span className="xsmall muted" style={{ fontVariantNumeric: 'tabular-nums' }}>
              Actualizado: {fmtTime(lastRefresh)}
            </span>
          )}
          {activeUrl && (
            <button className="btn btn--sm" onClick={refresh} disabled={loading}>
              <Icon name="activity" size={13} />
              {loading ? 'Cargando…' : 'Refrescar'}
            </button>
          )}
          <button className="btn btn--sm" onClick={() => setConfigOpen((o) => !o)}>
            <Icon name="settings" size={13} />
            {configOpen ? 'Ocultar config' : 'Configurar'}
          </button>
        </div>
      </div>

      {/* ─── Config panel ─── */}
      {configOpen && (
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="card-head">
            <div>
              <h3 className="card-title">Fuente de datos</h3>
              <p className="card-sub">
                Pegá la URL del CSV publicado desde Google Sheets, Excel Online, etc.
              </p>
            </div>
          </div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', gap: 8 }}>
              <div className="input-wrap" style={{ flex: 1 }}>
                <Icon name="link" size={14} className="lead-icon" />
                <input
                  className="input input--with-icon"
                  placeholder="https://docs.google.com/spreadsheets/…/pub?output=csv"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && connect()}
                />
              </div>
              <button
                className="btn btn--accent"
                onClick={connect}
                disabled={!urlInput.trim() || loading}
              >
                <Icon name="globe" size={13} />
                Conectar
              </button>
            </div>

            <div className="row">
              <button
                className="switch"
                data-on={autoRefresh ? 'true' : 'false'}
                onClick={() => setAutoRefresh(!autoRefresh)}
                title="Auto-refresh"
              >
                <i />
              </button>
              <span className="small" style={{ color: 'var(--ink-2)' }}>
                Auto-refresh cada 30 s
              </span>
            </div>

            {error && (
              <div
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  color: 'var(--danger)', fontSize: 13,
                  padding: '10px 14px',
                  background: 'var(--danger-soft)',
                  borderRadius: 'var(--radius-sm)',
                }}
              >
                <Icon name="alert" size={14} />
                {error}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── No URL state ─── */}
      {!activeUrl && !loading && (
        <div className="empty">
          <div className="empty-icon">
            <Icon name="layers" size={22} />
          </div>
          <div style={{ fontWeight: 500, marginBottom: 6 }}>Sin fuente configurada</div>
          <p className="small" style={{ color: 'var(--ink-4)', margin: 0 }}>
            Pegá una URL CSV arriba y hacé clic en Conectar para visualizar el roadmap.
          </p>
        </div>
      )}

      {/* ─── Loading (initial) ─── */}
      {loading && !data && (
        <div className="empty">
          <div className="empty-icon">
            <Icon name="activity" size={22} />
          </div>
          <div style={{ fontWeight: 500 }}>Cargando datos…</div>
        </div>
      )}

      {/* ─── Dashboard ─── */}
      {data && (
        <>
          {/* Stats */}
          <div className="stats-grid">
            <div className="stat">
              <div className="stat-label">Total funcionalidades</div>
              <div className="stat-value">{totalRows}</div>
              <div className="stat-delta" style={{ color: 'var(--ink-3)' }}>en el roadmap</div>
            </div>
            <div className="stat">
              <div className="stat-label">En progreso</div>
              <div className="stat-value">{activeCount}</div>
              <div className="stat-delta">este mes ({currentMonth})</div>
            </div>
            <div className="stat">
              <div className="stat-label">Meses anteriores</div>
              <div className="stat-value">{prevCount}</div>
              <div className="stat-delta" style={{ color: 'var(--ink-3)' }}>
                {pastMonths.length > 0 ? pastMonths.join(', ') : 'sin historial'}
              </div>
            </div>
            <div className="stat">
              <div className="stat-label">Próximas</div>
              <div className="stat-value">{upcomingCount}</div>
              <div className="stat-delta" style={{ color: 'var(--accent)' }}>meses futuros</div>
            </div>
          </div>

          {/* Breakdown grid */}
          <div className="grid-2" style={{ marginBottom: 20 }}>
            <div className="card">
              <div className="card-head">
                <div>
                  <h3 className="card-title">Por producto</h3>
                  <p className="card-sub">Funcionalidades por área</p>
                </div>
              </div>
              <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                {productCounts.length === 0 && (
                  <span className="small muted">Sin columna Producto en el CSV</span>
                )}
                {productCounts.map(({ name, count }) => {
                  const pct = Math.round((count / Math.max(1, totalRows)) * 100);
                  return (
                    <div key={name}>
                      <div className="row" style={{ marginBottom: 6 }}>
                        <div style={{ fontSize: 13, fontWeight: 500, flex: 1 }}>
                          {name || <span className="muted">(sin producto)</span>}
                        </div>
                        <div className="tabular xsmall muted">{count}</div>
                      </div>
                      <div style={{ height: 6, background: 'var(--bg-soft)', borderRadius: 999, overflow: 'hidden' }}>
                        <div style={{ height: '100%', background: 'var(--accent)', width: pct + '%', transition: 'width 0.4s' }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="card">
              <div className="card-head">
                <h3 className="card-title">Actividad por mes</h3>
              </div>
              <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {monthActivity.length === 0 && (
                  <span className="small muted">Sin columnas de mes detectadas</span>
                )}
                {monthActivity.map(({ month, count, isPast, isCurrent }) => {
                  const pct = Math.round((count / Math.max(1, totalRows)) * 100);
                  return (
                    <div key={month}>
                      <div className="row" style={{ marginBottom: 4 }}>
                        <div style={{
                          fontSize: 10, fontWeight: 700, width: 38, flexShrink: 0,
                          color: isCurrent ? 'var(--accent)' : isPast ? 'var(--ink-5)' : 'var(--ink-3)',
                          textTransform: 'uppercase', letterSpacing: '0.07em',
                          display: 'flex', alignItems: 'center', gap: 3,
                        }}>
                          {month}
                          {isCurrent && (
                            <span style={{ display: 'inline-block', width: 5, height: 5, borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }} />
                          )}
                        </div>
                        <div style={{ flex: 1, height: 6, background: 'var(--bg-soft)', borderRadius: 999, overflow: 'hidden' }}>
                          <div style={{
                            height: '100%',
                            background: isCurrent ? 'var(--accent)' : isPast ? 'var(--ink-5)' : 'var(--accent-soft)',
                            width: pct + '%', transition: 'width 0.4s',
                          }} />
                        </div>
                        <div className="tabular xsmall muted" style={{ width: 20, textAlign: 'right' }}>{count}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Timeline Gantt */}
          {monthCols.length > 0 && (
            <div className="card" style={{ marginBottom: 20 }}>
              <div className="card-head">
                <div>
                  <h3 className="card-title">Timeline</h3>
                  <p className="card-sub">Funcionalidades activas por mes · mes actual resaltado</p>
                </div>
              </div>
              <div className="table-scroll">
                <table className="table">
                  <thead>
                    <tr>
                      <th style={{ minWidth: 200 }}>Funcionalidad</th>
                      <th style={{ minWidth: 100 }}>Producto</th>
                      {monthCols.map((m) => (
                        <th key={m} style={{
                          textAlign: 'center', minWidth: 44,
                          background: m === currentMonth ? 'var(--accent-soft)' : undefined,
                          color: m === currentMonth ? 'var(--accent)' : undefined,
                        }}>
                          {m}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRows.slice(0, 80).map((row, i) => (
                      <tr key={i}>
                        <td style={{ fontWeight: row.Funcionalidades ? 500 : 400 }}>
                          {row.Funcionalidades || <span className="muted xsmall">—</span>}
                        </td>
                        <td>
                          {row.Producto ? <span className="badge">{row.Producto}</span> : <span className="muted xsmall">—</span>}
                        </td>
                        {monthCols.map((m) => (
                          <td key={m} style={{ textAlign: 'center', background: m === currentMonth ? 'var(--accent-soft)' : undefined }}>
                            {row[m] === '●' && (
                              <span style={{
                                display: 'inline-block', width: 10, height: 10, borderRadius: '50%',
                                background: pastMonths.includes(m) ? 'var(--ink-5)' : 'var(--accent)',
                                opacity: pastMonths.includes(m) ? 0.7 : 1,
                              }} />
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                    {filteredRows.length === 0 && (
                      <tr>
                        <td colSpan={2 + monthCols.length} style={{ textAlign: 'center', color: 'var(--ink-4)', padding: '24px 20px' }}>
                          Sin resultados
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {filteredRows.length > 80 && (
                <div style={{ padding: '10px 20px', fontSize: 12, color: 'var(--ink-4)', borderTop: '1px solid var(--border)' }}>
                  Mostrando 80 de {filteredRows.length} funcionalidades. Usá el buscador para filtrar.
                </div>
              )}
            </div>
          )}

          {/* Detail table */}
          <div className="card">
            <div className="card-head">
              <div>
                <h3 className="card-title">Detalle</h3>
                <p className="card-sub">{filteredRows.length} de {totalRows} funcionalidades</p>
              </div>
              <div className="row">
                {products.length > 0 && (
                  <select className="select" style={{ height: 32, fontSize: 12, width: 'auto' }} value={filterProduct} onChange={(e) => setFilterProduct(e.target.value)}>
                    <option value="">Todos los productos</option>
                    {products.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                )}
                <div className="input-wrap">
                  <Icon name="search" size={14} className="lead-icon" />
                  <input
                    className="input input--with-icon"
                    style={{ height: 32, fontSize: 12, width: 220 }}
                    placeholder="Buscar funcionalidad…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="card-body card-body--flush">
              <div className="table-scroll">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Funcionalidad</th>
                      <th>Producto</th>
                      <th>Versiones</th>
                      <th>Estado</th>
                      <th>Meses activos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRows.map((row, i) => {
                      const activeMeses = monthCols.filter((m) => row[m] === '●');
                      const isActive = activeMeses.includes(currentMonth);
                      const isCompleted = activeMeses.length > 0 && activeMeses.every((m) => pastMonths.includes(m));
                      const statusLabel = isActive ? 'En progreso' : isCompleted ? 'Completado' : activeMeses.length > 0 ? 'Planificado' : null;
                      const statusClass = isActive ? 'badge--accent' : isCompleted ? 'badge--ok' : '';

                      return (
                        <tr key={i}>
                          <td style={{ fontWeight: 500, maxWidth: 280 }}>
                            {row.Funcionalidades || <span className="muted xsmall">—</span>}
                          </td>
                          <td>
                            {row.Producto ? <span className="badge">{row.Producto}</span> : <span className="muted xsmall">—</span>}
                          </td>
                          <td className="xsmall muted">{row.Versiones || '—'}</td>
                          <td>
                            {statusLabel ? <span className={`badge ${statusClass}`}>{statusLabel}</span> : <span className="xsmall muted">—</span>}
                          </td>
                          <td>
                            <div className="row" style={{ gap: 4, flexWrap: 'wrap' }}>
                              {activeMeses.map((m) => (
                                <span key={m} style={{
                                  display: 'inline-flex', alignItems: 'center',
                                  padding: '1px 7px', borderRadius: 4,
                                  fontSize: 10, fontWeight: 700,
                                  background: m === currentMonth ? 'var(--accent-soft)' : 'var(--bg-soft)',
                                  color: m === currentMonth ? 'var(--accent)' : pastMonths.includes(m) ? 'var(--ink-5)' : 'var(--ink-3)',
                                  border: '1px solid var(--border)',
                                  letterSpacing: '0.05em', textTransform: 'uppercase',
                                }}>
                                  {m}
                                </span>
                              ))}
                              {activeMeses.length === 0 && <span className="xsmall muted">—</span>}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                    {filteredRows.length === 0 && (
                      <tr>
                        <td colSpan={5} style={{ textAlign: 'center', color: 'var(--ink-4)', padding: '28px 20px' }}>
                          Sin resultados para la búsqueda
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
