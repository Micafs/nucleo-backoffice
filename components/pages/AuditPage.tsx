'use client';

import Icon from '@/components/Icon';
import { AUDIT_LOG } from '@/lib/data';

export default function AuditPage() {
  const doubled = [...AUDIT_LOG, ...AUDIT_LOG];
  return (
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
          {doubled.map((log, i) => (
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
}
