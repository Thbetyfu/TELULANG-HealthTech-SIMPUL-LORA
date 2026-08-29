import React, { useEffect, useState } from 'react';
import {
  Search,
  Building2,
  CheckCircle2,
  Send,
  Filter,
  FileText,
  Loader2,
  AlertTriangle,
  RefreshCw,
  RotateCcw,
  Pill,
  Clock,
  Zap
} from 'lucide-react';
import { RealLeafletGisMap, RealGisFacilityNode } from '../components/RealLeafletGisMap';
import { apiUrl } from '../config/api';

export const PublicMapView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('SEMUA');
  const [selectedFacilityName, setSelectedFacilityName] = useState('SEMUA');
  const [selectedMedicineName, setSelectedMedicineName] = useState('SEMUA');
  const [selectedFacility, setSelectedFacility] = useState<RealGisFacilityNode | null>(null);
  const [facilities, setFacilities] = useState<RealGisFacilityNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<string>('');
  const [loadError, setLoadError] = useState<string | null>(null);
  const [disputeForm, setDisputeForm] = useState({
    facilityName: '',
    medicineName: '',
    description: '',
    contactEmail: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState<string | null>(null);
  const [disputeError, setDisputeError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchFacilities = async (isManual = false) => {
    try {
      if (isManual) setIsRefreshing(true);
      const res = await fetch(apiUrl('/api/v1/stocks/facilities'));
      if (!res.ok) throw new Error('Gagal memuat faskes dari BE');
      const json = await res.json();
      if (Array.isArray(json.data)) {
        setFacilities(json.data as RealGisFacilityNode[]);
        setLoadError(null);
        setLastSyncedAt(new Date().toLocaleTimeString());
      }
    } catch (err: unknown) {
      setLoadError(err instanceof Error ? err.message : 'Gagal memuat peta publik');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchFacilities();
  }, []);

  // Effect Auto-Refresh (setiap 15 detik)
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      fetchFacilities(false);
    }, 15000);
    return () => clearInterval(interval);
  }, [autoRefresh]);

  // Listener untuk filter faskes dari notifikasi modal
  useEffect(() => {
    const handleCustomFilter = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.facilityName) {
        setSelectedFacilityName(detail.facilityName);
      }
    };
    window.addEventListener('filter_facility_event', handleCustomFilter);
    return () => window.removeEventListener('filter_facility_event', handleCustomFilter);
  }, []);

  const provinces = Array.from(new Set(facilities.map((f) => f.provinceName))).sort();
  const puskesmasList = Array.from(new Set(facilities.map((f) => f.facilityName))).sort();
  const medicineList = Array.from(new Set(facilities.map((f) => f.medicineName))).sort();

  const filteredFacilities = facilities.filter((item) => {
    const q = searchQuery.toLowerCase();
    const matchQuery =
      item.facilityName.toLowerCase().includes(q) ||
      item.medicineName.toLowerCase().includes(q) ||
      item.provinceName.toLowerCase().includes(q);
    const matchProvince = selectedProvince === 'SEMUA' || item.provinceName === selectedProvince;
    const matchPuskesmas = selectedFacilityName === 'SEMUA' || item.facilityName === selectedFacilityName;
    const matchMedicine = selectedMedicineName === 'SEMUA' || item.medicineName === selectedMedicineName;
    return matchQuery && matchProvince && matchPuskesmas && matchMedicine;
  });

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedProvince('SEMUA');
    setSelectedFacilityName('SEMUA');
    setSelectedMedicineName('SEMUA');
  };

  const handleDisputeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!disputeForm.facilityName || !disputeForm.medicineName) return;

    setSubmitting(true);
    setDisputeError(null);

    try {
      const res = await fetch(apiUrl('/api/v1/disputes'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          puskesmasName: `${disputeForm.facilityName} | ${disputeForm.medicineName}`,
          provinceName: selectedFacility?.provinceName,
          disputeNotes:
            disputeForm.description ||
            `Pengaduan publik terkait ${disputeForm.medicineName} di ${disputeForm.facilityName}`
        })
      });

      const json = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(json?.message || 'Gagal mengirim pengaduan');
      }

      setTicketId(json?.data?.id || `DISPUTE-${Date.now()}`);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setTicketId(null);
        setDisputeForm({ facilityName: '', medicineName: '', description: '', contactEmail: '' });
      }, 4000);
    } catch (err: unknown) {
      setDisputeError(err instanceof Error ? err.message : 'Gagal mengirim pengaduan');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen font-sans pb-16"
      style={{ background: 'var(--md-sys-color-surface)', color: 'var(--md-sys-color-on-surface)' }}
    >
      <main className="mx-auto max-w-7xl px-4 sm:px-8 pt-6 sm:pt-8 space-y-6 sm:space-y-8">
        
        {/* Header Bar Actions: Refresh & Auto-Sync Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4" style={{ borderColor: 'var(--md-sys-color-outline-variant)' }}>
          <div>
            <h1 className="text-lg font-extrabold tracking-tight flex items-center gap-2">
              <Building2 className="w-5 h-5 text-sky-400" />
              Peta Transparansi Stok Logistik Faskes
            </h1>
            <p className="text-xs font-mono" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
              Monitoring ketersediaan faskes & obat esensial secara spasial waktu-nyata
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            {lastSyncedAt && (
              <span
                className="flex items-center gap-1.5 px-2.5 py-1 border text-[11px]"
                style={{
                  background: 'var(--md-sys-color-surface-container)',
                  borderColor: 'var(--md-sys-color-outline-variant)',
                  borderRadius: 'var(--md-sys-shape-corner-small)',
                  color: 'var(--md-sys-color-on-surface-variant)'
                }}
              >
                <Clock className="w-3.5 h-3.5" />
                Sync: {lastSyncedAt}
              </span>
            )}

            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              type="button"
              className={`flex items-center gap-1.5 px-3 py-1.5 border font-semibold text-xs transition-colors ${
                autoRefresh
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-transparent text-gray-400 border-gray-700'
              }`}
              style={{ borderRadius: 'var(--md-sys-shape-corner-small)' }}
              title="Toggle pembaruan data otomatis setiap 15 detik"
            >
              <Zap className={`w-3.5 h-3.5 ${autoRefresh ? 'text-emerald-400 fill-emerald-400 animate-pulse' : ''}`} />
              <span>Auto-Sync {autoRefresh ? 'ON' : 'OFF'}</span>
            </button>

            <button
              onClick={() => fetchFacilities(true)}
              disabled={isRefreshing}
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 border font-semibold text-xs transition-colors hover:bg-white/10 active:scale-95"
              style={{
                background: 'var(--md-sys-color-surface-container-high)',
                borderColor: 'var(--md-sys-color-outline-variant)',
                borderRadius: 'var(--md-sys-shape-corner-small)',
                color: 'var(--md-sys-color-on-surface)'
              }}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-sky-400' : ''}`} />
              <span>Refresh</span>
            </button>

            {(searchQuery || selectedProvince !== 'SEMUA' || selectedFacilityName !== 'SEMUA' || selectedMedicineName !== 'SEMUA') && (
              <button
                onClick={handleResetFilters}
                type="button"
                className="flex items-center gap-1.5 px-3 py-1.5 border text-xs font-semibold transition-colors hover:bg-rose-500/10 text-rose-400 border-rose-500/30"
                style={{ borderRadius: 'var(--md-sys-shape-corner-small)' }}
                title="Reset semua filter pencarian"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Filter</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter Control Bar with List Boxes */}
        <div
          className="border p-4 flex flex-col lg:flex-row items-stretch lg:items-center gap-3"
          style={{
            background: 'var(--md-sys-color-surface-container-low)',
            borderColor: 'var(--md-sys-color-outline-variant)',
            borderRadius: 'var(--md-sys-shape-corner-medium)'
          }}
        >
          {/* Teks Pencarian */}
          <div
            className="flex-1 flex items-center gap-3 px-4 py-2 border"
            style={{
              background: 'var(--md-sys-color-surface)',
              borderColor: 'var(--md-sys-color-outline-variant)',
              borderRadius: 'var(--md-sys-shape-corner-small)'
            }}
          >
            <Search className="w-4 h-4 shrink-0" style={{ color: 'var(--md-sys-color-on-surface-variant)' }} />
            <input
              type="text"
              placeholder="Cari kata kunci faskes, provinsi, atau obat..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-xs outline-none font-mono w-full"
              style={{ color: 'var(--md-sys-color-on-surface)' }}
            />
          </div>

          <div className="flex flex-wrap lg:flex-nowrap items-center gap-2.5 font-mono">
            {/* List Box 1: Provinsi */}
            <div className="flex items-center gap-1.5 flex-1 lg:flex-none">
              <Filter className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--md-sys-color-secondary)' }} />
              <select
                value={selectedProvince}
                onChange={(e) => setSelectedProvince(e.target.value)}
                className="text-xs font-medium px-3 py-2 border outline-none cursor-pointer w-full lg:w-44 truncate"
                style={{
                  background: 'var(--md-sys-color-surface)',
                  color: 'var(--md-sys-color-on-surface)',
                  borderColor: 'var(--md-sys-color-outline-variant)',
                  borderRadius: 'var(--md-sys-shape-corner-small)'
                }}
              >
                <option value="SEMUA">Semua Wilayah</option>
                {provinces.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            {/* List Box 2: Nama Puskesmas / Faskes */}
            <div className="flex items-center gap-1.5 flex-1 lg:flex-none">
              <Building2 className="w-3.5 h-3.5 shrink-0 text-sky-400" />
              <select
                value={selectedFacilityName}
                onChange={(e) => setSelectedFacilityName(e.target.value)}
                className="text-xs font-medium px-3 py-2 border outline-none cursor-pointer w-full lg:w-52 truncate"
                style={{
                  background: 'var(--md-sys-color-surface)',
                  color: 'var(--md-sys-color-on-surface)',
                  borderColor: selectedFacilityName !== 'SEMUA' ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-outline-variant)',
                  borderRadius: 'var(--md-sys-shape-corner-small)'
                }}
              >
                <option value="SEMUA">Semua Puskesmas / Faskes</option>
                {puskesmasList.map((fac) => (
                  <option key={fac} value={fac}>
                    {fac}
                  </option>
                ))}
              </select>
            </div>

            {/* List Box 3: Nama Obat Esensial */}
            <div className="flex items-center gap-1.5 flex-1 lg:flex-none">
              <Pill className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
              <select
                value={selectedMedicineName}
                onChange={(e) => setSelectedMedicineName(e.target.value)}
                className="text-xs font-medium px-3 py-2 border outline-none cursor-pointer w-full lg:w-52 truncate"
                style={{
                  background: 'var(--md-sys-color-surface)',
                  color: 'var(--md-sys-color-on-surface)',
                  borderColor: selectedMedicineName !== 'SEMUA' ? 'var(--md-sys-color-secondary)' : 'var(--md-sys-color-outline-variant)',
                  borderRadius: 'var(--md-sys-shape-corner-small)'
                }}
              >
                <option value="SEMUA">Semua Obat Esensial</option>
                {medicineList.map((med) => (
                  <option key={med} value={med}>
                    {med}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {loadError && (
          <div
            className="flex items-center gap-2 text-xs border p-3"
            style={{
              borderColor: 'var(--md-sys-color-error)',
              color: 'var(--md-sys-color-error)',
              borderRadius: 'var(--md-sys-shape-corner-small)'
            }}
          >
            <AlertTriangle className="w-4 h-4" />
            {loadError} — pastikan BE di :5000.
          </div>
        )}

        {loading ? (
          <div
            className="flex h-64 items-center justify-center gap-2 text-xs font-mono"
            style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
          >
            <Loader2 className="w-4 h-4 animate-spin" />
            Memuat faskes dari /api/v1/stocks/facilities...
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-3">
              <RealLeafletGisMap
                facilities={filteredFacilities}
                selectedFacilityId={selectedFacility?.id}
                onSelectFacility={(fac) => setSelectedFacility(fac)}
              />
            </div>

            <div
              className="lg:col-span-5 border p-5"
              style={{
                background: 'var(--md-sys-color-surface-container-low)',
                borderColor: 'var(--md-sys-color-outline-variant)',
                borderRadius: 'var(--md-sys-shape-corner-medium)'
              }}
            >
              <h2
                className="text-xs font-mono uppercase tracking-wider mb-3 flex items-center gap-2"
                style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
              >
                <Building2 className="w-4 h-4" style={{ color: 'var(--md-sys-color-on-surface)' }} />
                Faskes Terdaftar ({filteredFacilities.length})
              </h2>

              <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
                {filteredFacilities.map((stock) => {
                  const isSelected = selectedFacility?.id === stock.id;
                  return (
                    <div
                      key={stock.id}
                      onClick={() => setSelectedFacility(stock)}
                      className="p-3 border cursor-pointer transition-colors"
                      style={{
                        background: isSelected
                          ? 'var(--md-sys-color-primary-container)'
                          : 'var(--md-sys-color-surface)',
                        borderColor: isSelected
                          ? 'var(--md-sys-color-primary)'
                          : 'var(--md-sys-color-outline-variant)',
                        borderRadius: 'var(--md-sys-shape-corner-small)'
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-xs font-bold">{stock.facilityName}</h4>
                          <p
                            className="text-[11px] font-mono"
                            style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
                          >
                            {stock.provinceName}
                          </p>
                        </div>
                        <span
                          className="px-2 py-0.5 text-[10px] font-mono border"
                          style={{
                            borderRadius: 'var(--md-sys-shape-corner-extra-small)',
                            color:
                              stock.status === 'TERSEDIA'
                                ? 'var(--md-sys-color-primary)'
                                : stock.status === 'MENIPIS'
                                  ? 'var(--md-sys-color-secondary)'
                                  : 'var(--md-sys-color-error)',
                            borderColor: 'currentColor'
                          }}
                        >
                          {stock.status}
                        </span>
                      </div>
                      <div
                        className="mt-2 flex items-center justify-between pt-2 border-t text-xs"
                        style={{ borderColor: 'var(--md-sys-color-outline-variant)' }}
                      >
                        <span className="font-medium" style={{ color: 'var(--md-sys-color-secondary)' }}>
                          {stock.medicineName}
                        </span>
                        <span className="font-mono font-bold">{stock.availableStock} Unit</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        <div
          className="border p-6 shadow-2xl"
          style={{
            background: 'var(--md-sys-color-surface-container-low)',
            borderColor: 'var(--md-sys-color-outline-variant)',
            borderRadius: 'var(--md-sys-shape-corner-medium)'
          }}
        >
          <div className="max-w-2xl">
            <h2 className="text-sm font-bold flex items-center gap-2">
              <FileText className="w-4 h-4" style={{ color: 'var(--md-sys-color-error)' }} />
              Formulir Audit Pengaduan Publik
            </h2>
            <p className="text-xs mt-0.5" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
              Laporkan temuan selisih stok fisik — dikirim ke POST /api/v1/disputes.
            </p>

            {submitted ? (
              <div
                className="mt-4 p-3 border text-xs font-mono flex items-center gap-2"
                style={{
                  background: 'var(--md-sys-color-primary-container)',
                  borderColor: 'var(--md-sys-color-primary)',
                  color: 'var(--md-sys-color-on-primary-container)',
                  borderRadius: 'var(--md-sys-shape-corner-small)'
                }}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Tiket pengaduan berhasil: #{ticketId}</span>
              </div>
            ) : (
              <form onSubmit={handleDisputeSubmit} className="mt-4 space-y-3">
                {disputeError && (
                  <div
                    className="p-2 text-xs border"
                    style={{
                      borderColor: 'var(--md-sys-color-error)',
                      color: 'var(--md-sys-color-error)',
                      borderRadius: 'var(--md-sys-shape-corner-small)'
                    }}
                  >
                    {disputeError}
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label
                      className="text-xs font-medium block mb-1"
                      style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
                    >
                      Nama Faskes / Puskesmas
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Puskesmas Kairatu"
                      value={disputeForm.facilityName}
                      onChange={(e) => setDisputeForm({ ...disputeForm, facilityName: e.target.value })}
                      className="w-full border px-3 py-2 text-xs outline-none font-mono"
                      style={{
                        background: 'var(--md-sys-color-surface)',
                        borderColor: 'var(--md-sys-color-outline-variant)',
                        color: 'var(--md-sys-color-on-surface)',
                        borderRadius: 'var(--md-sys-shape-corner-small)'
                      }}
                    />
                  </div>
                  <div>
                    <label
                      className="text-xs font-medium block mb-1"
                      style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
                    >
                      Nama Obat Esensial
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Paracetamol Syrup"
                      value={disputeForm.medicineName}
                      onChange={(e) => setDisputeForm({ ...disputeForm, medicineName: e.target.value })}
                      className="w-full border px-3 py-2 text-xs outline-none font-mono"
                      style={{
                        background: 'var(--md-sys-color-surface)',
                        borderColor: 'var(--md-sys-color-outline-variant)',
                        color: 'var(--md-sys-color-on-surface)',
                        borderRadius: 'var(--md-sys-shape-corner-small)'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label
                    className="text-xs font-medium block mb-1"
                    style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
                  >
                    Deskripsi Temuan Selisih Stok
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Jelaskan kronologi perbedaan stok fisik obat..."
                    value={disputeForm.description}
                    onChange={(e) => setDisputeForm({ ...disputeForm, description: e.target.value })}
                    className="w-full border p-3 text-xs outline-none font-mono"
                    style={{
                      background: 'var(--md-sys-color-surface)',
                      borderColor: 'var(--md-sys-color-outline-variant)',
                      color: 'var(--md-sys-color-on-surface)',
                      borderRadius: 'var(--md-sys-shape-corner-small)'
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="m3-btn-primary px-4 py-2 text-xs flex items-center gap-2 disabled:opacity-60"
                >
                  {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  <span>Kirim Laporan Audit Publik</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
