import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { ShieldAlert, BellRing, X, WifiOff } from 'lucide-react';
import { API_BASE_URL } from '../config/api';

interface WebSocketAlertPayload {
  id: string;
  facilityName: string;
  medicineName: string;
  discrepancyPct: number;
  message: string;
  timestamp: string;
  source: 'socket.io' | 'offline';
}

export const WebSocketAlertListener: React.FC = () => {
  const [activeAlert, setActiveAlert] = useState<WebSocketAlertPayload | null>(null);
  const [connectionLabel, setConnectionLabel] = useState<'connecting' | 'live' | 'offline'>('connecting');

  useEffect(() => {
    let socket: Socket | null = null;
    let cancelled = false;

    try {
      socket = io(API_BASE_URL, {
        transports: ['websocket', 'polling'],
        reconnectionAttempts: 5,
        timeout: 8000
      });

      socket.on('connect', () => {
        if (!cancelled) setConnectionLabel('live');
      });

      socket.on('disconnect', () => {
        if (!cancelled) setConnectionLabel('offline');
      });

      socket.on('connect_error', () => {
        if (!cancelled) setConnectionLabel('offline');
      });

      socket.on('stock_event', (payload: {
        event?: string;
        facilityName?: string;
        medicineName?: string;
        discrepancyPct?: number;
        timestamp?: string;
      }) => {
        if (cancelled) return;
        if (payload.event !== 'DISCREPANCY_ALERT') return;

        setActiveAlert({
          id: `ALT-WS-${Date.now()}`,
          facilityName: payload.facilityName || 'Faskes tidak diketahui',
          medicineName: payload.medicineName || 'Obat esensial',
          discrepancyPct: payload.discrepancyPct ?? 0,
          message: 'Selisih Kuantitas Obat Terdeteksi (Rekam Medis vs BPJS P-Care)',
          timestamp: payload.timestamp
            ? new Date(payload.timestamp).toLocaleTimeString()
            : new Date().toLocaleTimeString(),
          source: 'socket.io'
        });
      });
    } catch {
      setConnectionLabel('offline');
    }

    return () => {
      cancelled = true;
      socket?.disconnect();
    };
  }, []);

  if (!activeAlert && connectionLabel !== 'offline') return null;

  if (!activeAlert && connectionLabel === 'offline') {
    return (
      <div
        className="fixed bottom-6 right-6 z-50 max-w-xs w-full border p-3 text-[11px] font-mono flex items-center gap-2"
        style={{
          background: 'var(--md-sys-color-surface-container)',
          borderColor: 'var(--md-sys-color-outline-variant)',
          borderRadius: 'var(--md-sys-shape-corner-medium)',
          color: 'var(--md-sys-color-on-surface-variant)'
        }}
      >
        <WifiOff className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--md-sys-color-error)' }} />
        <span>Socket.IO offline — BE :5000 tidak terhubung</span>
      </div>
    );
  }

  if (!activeAlert) return null;

  return (
    <div
      className="fixed bottom-6 right-6 z-50 max-w-sm w-full border p-4 shadow-2xl text-xs font-sans select-none"
      style={{
        background: 'var(--md-sys-color-surface-container-low)',
        borderColor: 'var(--md-sys-color-error)',
        borderRadius: 'var(--md-sys-shape-corner-medium)',
        color: 'var(--md-sys-color-on-surface)'
      }}
    >
      <div
        className="flex items-start justify-between border-b pb-2 mb-2"
        style={{ borderColor: 'var(--md-sys-color-outline-variant)' }}
      >
        <span
          className="font-mono font-bold flex items-center gap-1.5 uppercase text-[11px]"
          style={{ color: 'var(--md-sys-color-error)' }}
        >
          <BellRing className="w-4 h-4" />
          {activeAlert.source === 'socket.io' ? 'LIVE SOCKET.IO ALERT' : 'ALERT'}
        </span>
        <button
          onClick={() => setActiveAlert(null)}
          className="p-0.5"
          style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
          type="button"
          aria-label="Tutup alert"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="space-y-1">
        <p className="font-bold flex items-center gap-1">
          <ShieldAlert className="w-4 h-4 shrink-0" style={{ color: 'var(--md-sys-color-error)' }} />
          {activeAlert.facilityName}
        </p>
        <p className="font-medium" style={{ color: 'var(--md-sys-color-secondary)' }}>
          {activeAlert.medicineName}
        </p>
        <p className="text-[11px]" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
          {activeAlert.message}
        </p>

        <div
          className="mt-2 pt-2 border-t flex items-center justify-between text-[10px] font-mono"
          style={{ borderColor: 'var(--md-sys-color-outline-variant)' }}
        >
          <span className="font-bold" style={{ color: 'var(--md-sys-color-error)' }}>
            Deviasi Selisih: +{activeAlert.discrepancyPct}%
          </span>
          <span style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>{activeAlert.timestamp}</span>
        </div>
      </div>
    </div>
  );
};
