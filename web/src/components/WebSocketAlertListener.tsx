import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { ShieldAlert, BellRing, X, WifiOff, ExternalLink, Copy, Check, Building2, Pill, Activity } from 'lucide-react';
import { API_BASE_URL } from '../config/api';

export interface WebSocketAlertPayload {
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

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

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleFilterFacilityInMap = (facilityName: string) => {
    window.dispatchEvent(
      new CustomEvent('filter_facility_event', {
        detail: { facilityName }
      })
    );
    setIsModalOpen(false);
  };

  if (!activeAlert && connectionLabel !== 'offline') return null;

  if (!activeAlert && connectionLabel === 'offline') {
    return (
      <div
        className="fixed bottom-6 right-6 z-50 max-w-xs w-full border p-3 text-[11px] font-mono flex items-center gap-2 shadow-lg"
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
    <>
      {/* Clickable Toast Card */}
      <div
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 z-40 max-w-sm w-full border p-4 shadow-2xl text-xs font-sans cursor-pointer transition-all duration-200 hover:scale-[1.02] active:scale-[0.99] group"
        style={{
          background: 'var(--md-sys-color-surface-container-low)',
          borderColor: 'var(--md-sys-color-error)',
          borderRadius: 'var(--md-sys-shape-corner-medium)',
          color: 'var(--md-sys-color-on-surface)'
        }}
        title="Klik untuk membuka detail modal notifikasi"
      >
        <div
          className="flex items-start justify-between border-b pb-2 mb-2"
          style={{ borderColor: 'var(--md-sys-color-outline-variant)' }}
        >
          <span
            className="font-mono font-bold flex items-center gap-1.5 uppercase text-[11px]"
            style={{ color: 'var(--md-sys-color-error)' }}
          >
            <BellRing className="w-4 h-4 animate-bounce" />
            {activeAlert.source === 'socket.io' ? 'LIVE SOCKET.IO ALERT (KLIK DETAIL)' : 'ALERT (KLIK DETAIL)'}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveAlert(null);
            }}
            className="p-0.5 rounded hover:bg-black/10 transition-colors"
            style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
            type="button"
            aria-label="Tutup alert"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-1">
          <p className="font-bold flex items-center gap-1 group-hover:underline">
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
            <span className="flex items-center gap-1 text-[11px] font-semibold text-sky-400">
              Detail <ExternalLink className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>

      {/* Modal Dialog Detail Notifikasi M3 */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="w-full max-w-lg border p-6 shadow-2xl space-y-5 rounded-2xl relative"
            style={{
              background: 'var(--md-sys-color-surface-container-high)',
              borderColor: 'var(--md-sys-color-outline-variant)',
              color: 'var(--md-sys-color-on-surface)'
            }}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b pb-4" style={{ borderColor: 'var(--md-sys-color-outline-variant)' }}>
              <div className="flex items-center gap-3">
                <div
                  className="p-2.5 rounded-xl border flex items-center justify-center"
                  style={{
                    background: 'var(--md-sys-color-error-container)',
                    borderColor: 'var(--md-sys-color-error)',
                    color: 'var(--md-sys-color-on-error-container)'
                  }}
                >
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold tracking-tight">Audit Event Notifikasi Discrepancy</h3>
                  <p className="text-xs font-mono" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                    ID: {activeAlert.id}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg border transition-colors hover:bg-black/10"
                style={{ borderColor: 'var(--md-sys-color-outline-variant)' }}
                type="button"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-4 text-xs font-sans">
              <div
                className="p-4 border rounded-xl space-y-2.5"
                style={{
                  background: 'var(--md-sys-color-surface)',
                  borderColor: 'var(--md-sys-color-outline-variant)'
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] uppercase tracking-wider" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                    Faskes Terkait
                  </span>
                  <span className="font-bold font-mono text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    KRITIS (&gt;2.0% Toleransi)
                  </span>
                </div>
                <p className="font-extrabold text-sm flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-sky-400" />
                  {activeAlert.facilityName}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div
                  className="p-3 border rounded-xl"
                  style={{
                    background: 'var(--md-sys-color-surface)',
                    borderColor: 'var(--md-sys-color-outline-variant)'
                  }}
                >
                  <span className="font-mono text-[10px] uppercase block mb-1" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                    Obat Esensial
                  </span>
                  <p className="font-bold text-xs flex items-center gap-1.5" style={{ color: 'var(--md-sys-color-secondary)' }}>
                    <Pill className="w-3.5 h-3.5" />
                    {activeAlert.medicineName}
                  </p>
                </div>

                <div
                  className="p-3 border rounded-xl"
                  style={{
                    background: 'var(--md-sys-color-surface)',
                    borderColor: 'var(--md-sys-color-outline-variant)'
                  }}
                >
                  <span className="font-mono text-[10px] uppercase block mb-1" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                    Tingkat Deviasi
                  </span>
                  <p className="font-mono font-black text-sm text-rose-400">
                    +{activeAlert.discrepancyPct}%
                  </p>
                </div>
              </div>

              {/* Comparison Breakdown Box */}
              <div
                className="p-4 border rounded-xl space-y-2 font-mono text-[11px]"
                style={{
                  background: 'var(--md-sys-color-surface-container-lowest)',
                  borderColor: 'var(--md-sys-color-outline-variant)'
                }}
              >
                <div className="flex items-center justify-between border-b pb-1.5" style={{ borderColor: 'var(--md-sys-color-outline-variant)' }}>
                  <span style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>Sumber Data A (Rekam Medis)</span>
                  <span className="font-bold text-emerald-400">Tersinkronasi</span>
                </div>
                <div className="flex items-center justify-between border-b pb-1.5" style={{ borderColor: 'var(--md-sys-color-outline-variant)' }}>
                  <span style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>Sumber Data B (BPJS P-Care)</span>
                  <span className="font-bold text-rose-400">Selisih Terdeteksi</span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>Waktu Notifikasi Diterima</span>
                  <span className="font-bold">{activeAlert.timestamp}</span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <button
                onClick={() => handleCopyId(activeAlert.id)}
                type="button"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 border rounded-xl text-xs font-mono transition-colors hover:bg-black/10"
                style={{ borderColor: 'var(--md-sys-color-outline-variant)' }}
              >
                {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedId ? 'Tersalin!' : 'Salin Log ID'}</span>
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => handleFilterFacilityInMap(activeAlert.facilityName)}
                  type="button"
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-slate-950 font-bold rounded-xl text-xs transition-colors shadow-md"
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>Filter di Peta</span>
                </button>
                <button
                  onClick={() => setIsModalOpen(false)}
                  type="button"
                  className="flex-1 sm:flex-none px-4 py-2 border rounded-xl text-xs font-semibold transition-colors hover:bg-black/10"
                  style={{ borderColor: 'var(--md-sys-color-outline-variant)' }}
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

