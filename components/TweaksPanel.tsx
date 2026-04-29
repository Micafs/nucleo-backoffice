'use client';

import { useState, useRef, useEffect, useCallback, ReactNode } from 'react';

const TWEAKS_CSS = `
  .twk-panel{position:fixed;right:16px;bottom:16px;z-index:2147483646;width:280px;
    max-height:calc(100vh - 32px);display:flex;flex-direction:column;
    background:rgba(250,249,247,.78);color:#29261b;
    -webkit-backdrop-filter:blur(24px) saturate(160%);backdrop-filter:blur(24px) saturate(160%);
    border:.5px solid rgba(255,255,255,.6);border-radius:14px;
    box-shadow:0 1px 0 rgba(255,255,255,.5) inset,0 12px 40px rgba(0,0,0,.18);
    font:11.5px/1.4 ui-sans-serif,system-ui,-apple-system,sans-serif;overflow:hidden}
  .twk-hd{display:flex;align-items:center;justify-content:space-between;
    padding:10px 8px 10px 14px;cursor:move;user-select:none}
  .twk-hd b{font-size:12px;font-weight:600;letter-spacing:.01em}
  .twk-x{appearance:none;border:0;background:transparent;color:rgba(41,38,27,.55);
    width:22px;height:22px;border-radius:6px;cursor:default;font-size:13px;line-height:1}
  .twk-x:hover{background:rgba(0,0,0,.06);color:#29261b}
  .twk-body{padding:2px 14px 14px;display:flex;flex-direction:column;gap:10px;
    overflow-y:auto;overflow-x:hidden;min-height:0}
  .twk-row{display:flex;flex-direction:column;gap:5px}
  .twk-row-h{flex-direction:row;align-items:center;justify-content:space-between;gap:10px}
  .twk-lbl{display:flex;justify-content:space-between;align-items:baseline;color:rgba(41,38,27,.72)}
  .twk-lbl>span:first-child{font-weight:500}
  .twk-sect{font-size:10px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;
    color:rgba(41,38,27,.45);padding:10px 0 0}
  .twk-sect:first-child{padding-top:0}
  .twk-seg{position:relative;display:flex;padding:2px;border-radius:8px;
    background:rgba(0,0,0,.06);user-select:none}
  .twk-seg-thumb{position:absolute;top:2px;bottom:2px;border-radius:6px;
    background:rgba(255,255,255,.9);box-shadow:0 1px 2px rgba(0,0,0,.12);
    transition:left .15s cubic-bezier(.3,.7,.4,1),width .15s}
  .twk-seg button{appearance:none;position:relative;z-index:1;flex:1;border:0;
    background:transparent;color:inherit;font:inherit;font-weight:500;height:22px;
    border-radius:6px;cursor:default;padding:0}
  .twk-swatch{appearance:none;-webkit-appearance:none;width:56px;height:22px;
    border:.5px solid rgba(0,0,0,.1);border-radius:6px;padding:0;cursor:default;
    background:transparent;flex-shrink:0}
  .twk-swatch::-webkit-color-swatch-wrapper{padding:0}
  .twk-swatch::-webkit-color-swatch{border:0;border-radius:5.5px}
`;

export interface TweakValues {
  permissionsView: 'matrix' | 'groups' | 'cards';
  accentColor: string;
}

export const TWEAK_DEFAULTS: TweakValues = {
  permissionsView: 'matrix',
  accentColor: '#4f46e5',
};

interface TweaksPanelProps {
  t: TweakValues;
  setTweak: (key: keyof TweakValues, value: string) => void;
}

export default function TweaksPanel({ t, setTweak }: TweaksPanelProps) {
  const [open, setOpen] = useState(false);
  const dragRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef({ x: 16, y: 16 });
  const PAD = 16;

  const clampToViewport = useCallback(() => {
    const panel = dragRef.current;
    if (!panel) return;
    const w = panel.offsetWidth, h = panel.offsetHeight;
    const maxRight = Math.max(PAD, window.innerWidth - w - PAD);
    const maxBottom = Math.max(PAD, window.innerHeight - h - PAD);
    offsetRef.current = {
      x: Math.min(maxRight, Math.max(PAD, offsetRef.current.x)),
      y: Math.min(maxBottom, Math.max(PAD, offsetRef.current.y)),
    };
    panel.style.right = offsetRef.current.x + 'px';
    panel.style.bottom = offsetRef.current.y + 'px';
  }, []);

  useEffect(() => {
    if (!open) return;
    clampToViewport();
  }, [open, clampToViewport]);

  const onDragStart = (e: React.MouseEvent) => {
    const panel = dragRef.current;
    if (!panel) return;
    const r = panel.getBoundingClientRect();
    const sx = e.clientX, sy = e.clientY;
    const startRight = window.innerWidth - r.right;
    const startBottom = window.innerHeight - r.bottom;
    const move = (ev: MouseEvent) => {
      offsetRef.current = {
        x: startRight - (ev.clientX - sx),
        y: startBottom - (ev.clientY - sy),
      };
      clampToViewport();
    };
    const up = () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: 'fixed',
          right: 16,
          bottom: 16,
          zIndex: 2147483645,
          background: 'var(--ink)',
          color: '#fff',
          border: 0,
          borderRadius: 8,
          padding: '6px 12px',
          fontSize: 12,
          fontWeight: 600,
          cursor: 'pointer',
          display: open ? 'none' : 'flex',
          alignItems: 'center',
          gap: 6,
        }}
      >
        ⚙ Tweaks
      </button>

      {open && (
        <>
          <style>{TWEAKS_CSS}</style>
          <div
            ref={dragRef}
            className="twk-panel"
            style={{ right: offsetRef.current.x, bottom: offsetRef.current.y }}
          >
            <div className="twk-hd" onMouseDown={onDragStart}>
              <b>Tweaks</b>
              <button className="twk-x" onMouseDown={(e) => e.stopPropagation()} onClick={() => setOpen(false)}>✕</button>
            </div>
            <div className="twk-body">
              <div className="twk-sect">Variaciones de permisos</div>
              <div className="twk-row">
                <div className="twk-lbl"><span>Vista de permisos</span></div>
                <TweakSegmented
                  value={t.permissionsView}
                  options={[
                    { value: 'matrix', label: 'Matriz' },
                    { value: 'groups', label: 'Grupos' },
                    { value: 'cards', label: 'Cards' },
                  ]}
                  onChange={(v) => setTweak('permissionsView', v)}
                />
              </div>
              <div style={{ fontSize: 11, color: 'rgba(41,38,27,.55)', lineHeight: 1.5 }}>
                Tres formas de visualizar el mismo modelo de permisos. Entrá a <b>Roles y permisos</b> o a un equipo &gt; pestaña <b>Permisos</b> para ver el cambio en vivo.
              </div>

              <div className="twk-sect">Branding</div>
              <div className="twk-row twk-row-h">
                <div className="twk-lbl"><span>Color de acento</span></div>
                <input
                  type="color"
                  className="twk-swatch"
                  value={t.accentColor}
                  onChange={(e) => setTweak('accentColor', e.target.value)}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

function TweakSegmented({ value, options, onChange }: {
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  const idx = Math.max(0, options.findIndex((o) => o.value === value));
  const n = options.length;

  return (
    <div className="twk-seg">
      <div
        className="twk-seg-thumb"
        style={{
          left: `calc(2px + ${idx} * (100% - 4px) / ${n})`,
          width: `calc((100% - 4px) / ${n})`,
        }}
      />
      {options.map((o) => (
        <button key={o.value} type="button" onClick={() => onChange(o.value)}>
          {o.label}
        </button>
      ))}
    </div>
  );
}
