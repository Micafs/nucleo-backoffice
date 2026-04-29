'use client';

import { useState } from 'react';
import Icon from './Icon';
import { TEAMS } from '@/lib/data';

interface LoginPageProps {
  onLogin: () => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('ana@empresa.com');
  const [password, setPassword] = useState('••••••••••');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) { setError('Ingresá un email válido.'); return; }
    if (password.length < 6) { setError('La contraseña debe tener al menos 6 caracteres.'); return; }
    setError('');
    setLoading(true);
    setTimeout(() => { setLoading(false); onLogin(); }, 700);
  };

  return (
    <div className="login-page">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 64px' }}>
        <div className="login-panel" style={{ maxWidth: 400, width: '100%' }}>
          <div className="login-brand">
            <div className="sidebar-logo">N</div>
            <div>
              <div className="sidebar-brand-name">Nucleo</div>
              <div className="sidebar-brand-sub">back_office</div>
            </div>
          </div>

          <div className="login-form-wrap">
            <h1>Ingresá al Back Office</h1>
            <p className="sub">Usá tu cuenta corporativa para acceder al espacio de tu equipo.</p>

            <form className="login-form" onSubmit={submit}>
              <div className="field">
                <label className="field-label">Email</label>
                <div className="input-wrap">
                  <span className="lead-icon"><Icon name="mail" size={14} /></span>
                  <input
                    className="input input--with-icon"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    data-error={error.includes('email') ? 'true' : 'false'}
                    placeholder="tu@empresa.com"
                    autoFocus
                  />
                </div>
              </div>

              <div className="field">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <label className="field-label">Contraseña</label>
                  <a href="#" className="xsmall muted" style={{ textDecoration: 'underline' }}>¿Olvidaste tu contraseña?</a>
                </div>
                <div className="input-wrap">
                  <span className="lead-icon"><Icon name="lock" size={14} /></span>
                  <input
                    className="input input--with-icon"
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    data-error={error.includes('contraseña') ? 'true' : 'false'}
                    placeholder="Tu contraseña"
                  />
                  <button
                    type="button"
                    className="btn btn--ghost btn--icon btn--sm"
                    style={{ position: 'absolute', right: 4, top: 4 }}
                    onClick={() => setShowPw(!showPw)}
                    tabIndex={-1}
                  >
                    <Icon name={showPw ? 'eye-off' : 'eye'} size={14} />
                  </button>
                </div>
              </div>

              {error && (
                <div className="field-error">
                  <Icon name="alert" size={12} />{error}
                </div>
              )}

              <div className="row" style={{ justifyContent: 'space-between', marginTop: 4 }}>
                <label className="row" style={{ gap: 8, cursor: 'pointer' }}>
                  <input type="checkbox" className="checkbox" defaultChecked />
                  <span className="small">Mantener sesión iniciada</span>
                </label>
              </div>

              <button
                type="submit"
                className="btn btn--accent"
                style={{ width: '100%', height: 40, marginTop: 8 }}
                disabled={loading}
              >
                {loading ? 'Ingresando…' : 'Ingresar'}
              </button>
            </form>
          </div>

          <div className="login-foot">
            <span>© 2026 Nucleo</span>
            <span className="row" style={{ gap: 12 }}>
              <a href="#">Privacidad</a>
              <a href="#">Términos</a>
              <a href="#">Soporte</a>
            </span>
          </div>
        </div>
      </div>

      <div className="login-visual">
        <div className="login-visual-inner">
          <LoginVisualMock />
        </div>
      </div>
    </div>
  );
}

function LoginVisualMock() {
  return (
    <div style={{
      background: 'var(--bg-elev)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      padding: 20,
      boxShadow: 'var(--shadow-lg)',
      transform: 'rotate(-0.5deg)',
    }}>
      <div className="row" style={{ marginBottom: 16 }}>
        <div className="sidebar-logo" style={{ width: 22, height: 22, fontSize: 11 }}>N</div>
        <div style={{ fontSize: 13, fontWeight: 600 }}>Back Office</div>
        <div className="spacer" />
        <div className="row" style={{ gap: 4 }}>
          <span className="dot" style={{ background: '#ef4444', width: 8, height: 8 }} />
          <span className="dot" style={{ background: '#f59e0b', width: 8, height: 8 }} />
          <span className="dot dot--ok" style={{ width: 8, height: 8 }} />
        </div>
      </div>
      <div style={{ fontSize: 11, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginBottom: 10 }}>Equipos</div>
      {TEAMS.map((t) => (
        <div key={t.id} style={{
          display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
          border: '1px solid var(--border)', borderRadius: 8, marginBottom: 6,
        }}>
          <div className="team-icon" style={{ width: 28, height: 28, fontSize: 11, borderRadius: 7, background: t.color }}>{t.glyph}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 500 }}>{t.name}</div>
            <div style={{ fontSize: 10, color: 'var(--ink-3)' }}>{t.description}</div>
          </div>
          <span className="badge badge--mono">{Math.floor(Math.random() * 8) + 3} miembros</span>
        </div>
      ))}
      <div style={{ marginTop: 14, padding: 10, background: 'var(--bg-soft)', borderRadius: 8, fontSize: 11, color: 'var(--ink-3)', display: 'flex', gap: 8, alignItems: 'center' }}>
        <Icon name="shield" size={14} />
        Permisos granulares por equipo y por miembro.
      </div>
    </div>
  );
}
