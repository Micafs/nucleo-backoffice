'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui';

interface CreateTeamModalProps {
  onClose: () => void;
  onCreate: (data: { name: string; desc: string }) => void;
}

export default function CreateTeamModal({ onClose, onCreate }: CreateTeamModalProps) {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');

  return (
    <Modal
      title="Nuevo equipo"
      sub="Se creará un espacio aislado con sus propios miembros y permisos."
      onClose={onClose}
      footer={
        <>
          <button className="btn" onClick={onClose}>Cancelar</button>
          <button className="btn btn--accent" disabled={!name} onClick={() => onCreate({ name, desc })}>
            Crear equipo
          </button>
        </>
      }
    >
      <div className="col" style={{ gap: 16 }}>
        <div className="field">
          <label className="field-label">Nombre del equipo</label>
          <input className="input" autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej: Data & Analytics" />
        </div>
        <div className="field">
          <label className="field-label">Descripción</label>
          <textarea className="textarea" value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="¿De qué se ocupa este equipo?" />
        </div>
      </div>
    </Modal>
  );
}
