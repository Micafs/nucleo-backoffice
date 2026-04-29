'use client';

import { useState, useRef, useCallback } from 'react';
import Icon from '@/components/Icon';
import { Product, ParsedSheet } from '@/lib/data';

type DocTab = 'homologacion' | 'roadmap';

interface Props {
  product: Product;
  docs: Record<DocTab, ParsedSheet | null>;
  onUpdate: (tab: DocTab, sheet: ParsedSheet) => void;
  onBack: () => void;
  initialTab?: DocTab;
}

// ─── Status badge mapping ──────────────────────────────────
const STATUS_MAP: Record<string, string> = {
  'OK': 'badge--ok',
  'Aprobado': 'badge--ok',
  'En curso': 'badge--accent',
  'Pausado': 'badge--warn',
  'Desaprobado': 'badge--danger',
  'Cancelado': '',
  'CANCELADO': '',
  'CANCELADA': '',
  'N/A': '',
  'N/a': '',
  'DEV': 'badge--accent',
};

const STATUS_COLS = new Set([
  'despliegue en dev', 'despliegue qa', 'solicitud de ass',
  'despliegue hml', 'despliegue prd',
]);

function isStatusCol(h: string) { return STATUS_COLS.has(h.toLowerCase().trim()); }
function isLinkCol(h: string) { return h.toLowerCase().trim() === 'noc'; }

// ─── CSV / Roadmap parser ──────────────────────────────────
function parseCSVText(text: string): { headers: string[]; rows: Record<string, string>[] } {
  const normalized = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const lines = normalized.split('\n');

  const sample = lines.find((l) => l.trim().length > 0) || '';
  const delimiter = (sample.match(/;/g) || []).length >= (sample.match(/,/g) || []).length ? ';' : ',';

  const parseRow = (line: string) =>
    line.split(delimiter).map((c) => c.trim().replace(/^"|"$/g, ''));

  // Detect roadmap: any line whose first cell is exactly "Funcionalidades"
  const funcIdx = lines.findIndex((l) => parseRow(l)[0] === 'Funcionalidades');
  if (funcIdx !== -1) {
    return parseRoadmapLines(lines, funcIdx, parseRow);
  }

  // Standard homologacion format
  const nonEmpty = lines.filter((l) => l.replace(/[;,\s]/g, '').length > 0);
  if (nonEmpty.length === 0) return { headers: [], rows: [] };

  const headers = parseRow(nonEmpty[0]).filter(Boolean);
  const rows: Record<string, string>[] = [];

  for (let i = 1; i < nonEmpty.length; i++) {
    const cells = parseRow(nonEmpty[i]);
    const row: Record<string, string> = {};
    headers.forEach((h, idx) => { row[h] = cells[idx] ?? ''; });
    if (Object.values(row).some((v) => v.trim())) rows.push(row);
  }

  return { headers, rows };
}

function parseRoadmapLines(
  lines: string[],
  funcIdx: number,
  parseRow: (l: string) => string[],
): { headers: string[]; rows: Record<string, string>[] } {
  // Row after funcIdx has month names (ENE, FEB, ...)
  const monthCells = funcIdx + 1 < lines.length ? parseRow(lines[funcIdx + 1]) : [];

  const months: string[] = [];
  const monthCols: number[] = [];
  monthCells.forEach((cell, i) => {
    if (i >= 3 && cell.trim()) { months.push(cell.trim()); monthCols.push(i); }
  });

  const headers = ['Funcionalidades', 'Producto', 'Versiones', ...months];
  const rows: Record<string, string>[] = [];

  for (let i = funcIdx + 2; i < lines.length; i++) {
    const cells = parseRow(lines[i]);
    const func = cells[0]?.trim() ?? '';
    const prod = cells[1]?.trim() ?? '';
    const vers = cells[2]?.trim() ?? '';
    if (!func && !prod && !vers) continue;

    const row: Record<string, string> = { Funcionalidades: func, Producto: prod, Versiones: vers };
    months.forEach((month, mIdx) => {
      const start = monthCols[mIdx];
      const end = monthCols[mIdx + 1] ?? cells.length;
      const slice = cells.slice(start, Math.min(start + 4, end));
      row[month] = slice.some((c) => c?.trim()) ? '●' : '';
    });
    rows.push(row);
  }

  return { headers, rows: rows.filter((r) => r.Funcionalidades || r.Producto) };
}

// ─── Cell renderer ─────────────────────────────────────────
function renderCell(header: string, value: string, type: DocTab): React.ReactNode {
  if (!value.trim()) return <span className="muted xsmall">—</span>;

  if (type === 'homologacion') {
    if (isLinkCol(header)) {
      return (
        <a href={value} target="_blank" rel="noopener noreferrer" className="table-link">
          <Icon name="link" size={11} /> NOC
        </a>
      );
    }
    if (isStatusCol(header)) {
      const mod = STATUS_MAP[value.trim()];
      if (mod !== undefined) {
        return <span className={`badge ${mod}`}>{value.trim()}</span>;
      }
      // Unknown status value – show as neutral badge
      if (value.trim()) return <span className="badge">{value.trim()}</span>;
    }
  }

  if (type === 'roadmap' && value === '●') {
    return <span style={{ color: 'var(--accent)', fontWeight: 700, fontSize: 16 }}>●</span>;
  }

  return <span>{value}</span>;
}

// ─── Sheet table ───────────────────────────────────────────
function SheetTable({ sheet, type }: { sheet: ParsedSheet; type: DocTab }) {
  return (
    <div>
      <div className="row" style={{ marginBottom: 12 }}>
        <span className="xsmall muted">
          {sheet.rows.length} filas · Subido: {sheet.uploadedAt} · {sheet.fileName}
        </span>
      </div>
      <div className="table-scroll">
        <table className="table">
          <thead>
            <tr>
              {sheet.headers.map((h) => (
                <th key={h} style={{ whiteSpace: 'nowrap', minWidth: type === 'roadmap' && !['Funcionalidades','Producto','Versiones'].includes(h) ? 40 : undefined }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sheet.rows.map((row, i) => (
              <tr key={i}>
                {sheet.headers.map((h) => (
                  <td key={h} style={{ whiteSpace: 'nowrap', maxWidth: h === 'Componente' ? 260 : h === 'Comentario' ? 200 : undefined, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {renderCell(h, row[h] ?? '', type)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Empty state ───────────────────────────────────────────
function EmptySheet({ onUpload, tab }: { onUpload: () => void; tab: DocTab }) {
  return (
    <div className="empty">
      <div className="empty-icon">
        <Icon name={tab === 'homologacion' ? 'activity' : 'calendar'} size={22} />
      </div>
      <div style={{ fontWeight: 500, marginBottom: 6 }}>
        Sin datos de {tab === 'homologacion' ? 'homologación' : 'roadmap'}
      </div>
      <p className="small" style={{ color: 'var(--ink-4)', margin: '0 0 20px' }}>
        Subí un archivo CSV exportado desde tu tablero de producto.
        <br />
        El separador puede ser coma o punto y coma.
      </p>
      <button className="btn btn--accent" onClick={onUpload}>
        <Icon name="upload" size={13} /> Subir archivo
      </button>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────
export default function ProductDetailPage({
  product, docs, onUpdate, onBack, initialTab = 'homologacion',
}: Props) {
  const [tab, setTab] = useState<DocTab>(initialTab);
  const fileRef = useRef<HTMLInputElement>(null);
  const [processing, setProcessing] = useState(false);

  const handleFile = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setProcessing(true);
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const text = ev.target?.result as string;
          const { headers, rows } = parseCSVText(text);
          if (headers.length > 0) {
            onUpdate(tab, {
              fileName: file.name,
              uploadedAt: new Date().toLocaleString('es-AR'),
              headers,
              rows,
            });
          }
        } finally {
          setProcessing(false);
          if (fileRef.current) fileRef.current.value = '';
        }
      };
      reader.readAsText(file, 'UTF-8');
    },
    [tab, onUpdate],
  );

  const sheet = docs[tab];

  return (
    <>
      <div className="page-head">
        <div className="row" style={{ gap: 14 }}>
          <button className="btn btn--ghost btn--icon btn--sm" onClick={onBack} title="Volver">
            <Icon name="arrow-left" size={14} />
          </button>
          <div className="product-glyph product-glyph--sm" style={{ background: product.color }}>
            {product.glyph}
          </div>
          <div>
            <h1 className="page-title" style={{ margin: 0 }}>{product.name}</h1>
            <p className="page-sub" style={{ margin: 0 }}>{product.description}</p>
          </div>
        </div>
        <div className="row">
          <input
            ref={fileRef}
            type="file"
            accept=".csv,.xlsx"
            style={{ display: 'none' }}
            onChange={handleFile}
          />
          <button
            className="btn btn--accent"
            onClick={() => fileRef.current?.click()}
            disabled={processing}
          >
            <Icon name="upload" size={13} />
            {processing ? 'Procesando…' : `Subir ${tab === 'homologacion' ? 'Homologación' : 'Roadmap'}`}
          </button>
        </div>
      </div>

      <div className="tabs">
        <button className="tab" data-active={tab === 'homologacion'} onClick={() => setTab('homologacion')}>
          <Icon name="activity" size={13} /> Homologaciones
        </button>
        <button className="tab" data-active={tab === 'roadmap'} onClick={() => setTab('roadmap')}>
          <Icon name="calendar" size={13} /> Roadmap
        </button>
      </div>

      {sheet
        ? <SheetTable sheet={sheet} type={tab} />
        : <EmptySheet onUpload={() => fileRef.current?.click()} tab={tab} />}
    </>
  );
}
