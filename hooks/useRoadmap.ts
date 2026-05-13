'use client';

// ─── Hook: useRoadmap ──────────────────────────────────────
// Encapsula todo el estado y la lógica de negocio del módulo Roadmap.
// El componente RoadmapPage consume este hook y se ocupa solo de renderizar.
//
// Responsabilidades de este hook:
//  - Guardar la URL ingresada por el usuario y la URL activa (confirmada)
//  - Disparar la carga de datos al conectar y en el intervalo de auto-refresh
//  - Mantener el estado de carga, error y timestamp del último refresco
//  - Controlar la visibilidad del panel de configuración

import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchCsvData } from '@/services/csvService';
import type { ParsedRoadmap } from '@/types/roadmap.types';

// Contrato público del hook: qué expone hacia el componente
interface UseRoadmapReturn {
  data: ParsedRoadmap | null;    // Datos parseados del CSV (null si no se cargó aún)
  loading: boolean;              // true mientras se está haciendo fetch
  error: string | null;          // Mensaje de error si la última carga falló
  lastRefresh: Date | null;      // Hora de la última carga exitosa
  activeUrl: string;             // URL actualmente conectada
  urlInput: string;              // Texto del input antes de confirmar
  autoRefresh: boolean;          // Si el auto-refresh cada 30s está activo
  configOpen: boolean;           // Si el panel de configuración está visible
  setUrlInput: (v: string) => void;
  setAutoRefresh: (v: boolean) => void;
  setConfigOpen: (v: boolean | ((prev: boolean) => boolean)) => void;
  connect: () => void;           // Confirma la URL del input y dispara la primera carga
  refresh: () => void;           // Recarga manualmente con la URL activa
}

export function useRoadmap(): UseRoadmapReturn {
  // ── Estado del input y la conexión ────────────────────────
  const [urlInput, setUrlInput] = useState('');       // Lo que escribe el usuario
  const [activeUrl, setActiveUrl] = useState('');     // URL confirmada al hacer "Conectar"

  // ── Estado de los datos ───────────────────────────────────
  const [data, setData] = useState<ParsedRoadmap | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  // ── Estado de la UI del panel ─────────────────────────────
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [configOpen, setConfigOpen] = useState(true); // Empieza abierto hasta que haya datos

  // Ref para leer configOpen desde dentro del callback sin re-crearlo
  // (evita que fetchData quede con un closure desactualizado)
  const configOpenRef = useRef(configOpen);
  configOpenRef.current = configOpen;

  // ── Función de carga ──────────────────────────────────────
  // useCallback evita que se recree en cada render, necesario para el useEffect de intervalo
  const fetchData = useCallback(async (url: string) => {
    if (!url) return;
    setLoading(true);
    setError(null);
    try {
      const parsed = await fetchCsvData(url);
      setData(parsed);
      setLastRefresh(new Date());
      // Colapsar el panel de config automáticamente cuando llegan los primeros datos
      if (configOpenRef.current && parsed.rows.length > 0) setConfigOpen(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Auto-refresh cada 30 segundos ─────────────────────────
  // Se activa solo si hay una URL confirmada y el toggle está encendido
  useEffect(() => {
    if (!activeUrl || !autoRefresh) return;
    const id = setInterval(() => fetchData(activeUrl), 30_000);
    return () => clearInterval(id); // Limpiar el intervalo al desmontar o cambiar dependencias
  }, [activeUrl, autoRefresh, fetchData]);

  // ── Confirmar conexión ────────────────────────────────────
  // Valida que haya URL, la guarda como activa y dispara la primera carga
  const connect = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    setActiveUrl(trimmed);
    fetchData(trimmed);
  };

  return {
    data,
    loading,
    error,
    lastRefresh,
    activeUrl,
    urlInput,
    autoRefresh,
    configOpen,
    setUrlInput,
    setAutoRefresh,
    setConfigOpen,
    connect,
    refresh: () => fetchData(activeUrl),
  };
}
