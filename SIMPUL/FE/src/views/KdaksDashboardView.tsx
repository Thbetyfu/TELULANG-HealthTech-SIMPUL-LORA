import React, { useEffect, useState } from 'react';
import { Building2, Zap, AlertTriangle, CheckCircle2, Send, Layers, TrendingUp, Activity } from 'lucide-react';

interface ClusterProfile {
  clusterId: number;
  name: string;
  description: string;
  provinceCount: number;
  meanAvailabilityY: number;
  meanPharmacistRatioX1: number;
}

interface OLSMetrics {
  adjustedR2: number;
  fStatistic: number;
  pharmacistCoeffBeta1: number;
  moranI: number;
}

interface LiveAlertEvent {
  event: string;
  facilityName: string;
  medicineName: string;
  newStockQty: number;
  discrepancyPct?: number;
  timestamp: string;
}

interface RedistributionItem {
  id: string;
  sourceFacilityName: string;
  sourceProvinceName: string;
  targetFacilityName: string;
  targetProvinceName: string;
  medicineName: string;
  transferQuantity: number;
  sourceStockAfterTransfer: number;
  urgencyLevel: 'HIGH' | 'CRITICAL' | 'NORMAL';
  estimatedMinutes: number;
  status: 'PROPOSED' | 'DISPATCHED';
}

export const KdaksDashboardView: React.FC = () => {
  const [clusters, setClusters] = useState<ClusterProfile[]>([]);
  const [metrics, setMetrics] = useState<OLSMetrics | null>(null);
  const [liveAlerts, setLiveAlerts] = useState<LiveAlertEvent[]>([]);
  const [redistributions, setRedistributions] = useState<RedistributionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRedistributions = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/v1/redistributions');
      if (res.ok) {
        const json = await res.json();
        setRedistributions(json.data || []);
      }
    } catch (_e) {
      // fallback
    }
  };

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [clusterRes, olsRes] = await Promise.all([
          fetch('http://localhost:3001/api/v1/analytics/profiles'),
          fetch('http://localhost:3001/api/v1/analytics/ols-metrics')
        ]);

        if (!clusterRes.ok || !olsRes.ok) {
          throw new Error('Gagal mengambil data analitis dari SIMPUL/BE Server');
        }

        const clusterJson = await clusterRes.json();
        const olsJson = await olsRes.json();

        setClusters(clusterJson.data);
        setMetrics(olsJson.data);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Koneksi ke backend SIMPUL/BE terputus.');
      } finally {
        setLoading(false);
      }
    };

    const pollDiscrepancies = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/v1/stocks/discrepancies');
        if (res.ok) {
          const json = await res.json();
          if (json.data && json.data.length > 0) {
            setLiveAlerts(json.data.map((d: any) => ({
              event: 'DISCREPANCY_ALERT',
              facilityName: d.facilityName || 'Faskes Terdaftar',
              medicineName: d.medicineName || 'Obat Esensial',
              newStockQty: d.remainingStock || d.currentStock || 0,
              discrepancyPct: d.discrepancyPct || 15.5,
              timestamp: new Date().toLocaleTimeString()
            })));
          }
        }
      } catch (_e) {
        // Polling silent fallback
      }
    };

    fetchAnalytics();
    pollDiscrepancies();
    fetchRedistributions();
    const interval = setInterval(pollDiscrepancies, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleDispatch = async (id: string) => {
    try {
      const res = await fetch('http://localhost:3001/api/v1/redistributions/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        fetchRedistributions();
      }
    } catch (err: any) {
      alert('Gagal disposisi: ' + err.message);
    }
  };

  const triggerSimulatedWebhook = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/v1/integration/satusehat/dispense-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resourceType: 'MedicationDispense',
          satusehatId: 'disp-' + Date.now(),
          facilitySatusehatCode: '1000213',
          facilityName: 'Puskesmas Bojongsoang',
          kfaCode: '93000122',
          medicineName: 'Oksitosin Injeksi 10 UI/mL',
          quantityDispensed: 160,
          dispensedTimestamp: new Date().toISOString()
        })
      });
      const data = await res.json();
      if (res.ok) {
        setLiveAlerts(prev => [
          {
            event: data.data.discrepancyFlagged ? 'DISCREPANCY_ALERT' : 'STOCK_UPDATED',
            facilityName: 'Puskesmas Bojongsoang',
            medicineName: 'Oksitosin Injeksi 10 UI/mL',
            newStockQty: data.data.remainingStock,
            discrepancyPct: 15.5,
            timestamp: new Date().toLocaleTimeString()
          },
          ...prev
        ]);
      }
    } catch (err: any) {
      alert('Gagal memicu webhook: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[hsl(230,25%,8%)] p-6 font-sans text-gray-100 selection:bg-[hsl(172,85%,45%)] selection:text-black">
      {/* Material 3 Header Top App Bar */}
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-[28px] border border-white/[0.08] bg-[hsl(230,20%,14%)] p-5 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-[hsl(172,85%,45%)] text-gray-950 shadow-lg shadow-[hsl(172,85%,45%,0.25)]">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black tracking-tight text-white sm:text-2xl">
                K-DAK Strategic Management Dashboard
              </h1>
              <span className="rounded-full bg-[hsl(172,75%,14%)] px-3 py-0.5 text-xs font-bold text-[hsl(172,90%,82%)] border border-[hsl(172,85%,45%,0.3)]">
                M3 Executive
              </span>
            </div>
            <p className="text-xs text-gray-400">Model Prediktif OLS, K-Means Clustering, & Disposisi Logistik Real-Time</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={triggerSimulatedWebhook}
            className="flex items-center gap-2 rounded-full bg-[hsl(210,90%,65%)] px-5 py-2.5 text-xs font-extrabold text-gray-950 shadow-lg transition hover:scale-105 active:scale-95"
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>Simulasi SATUSEHAT Webhook</span>
          </button>
          <div className="hidden sm:flex items-center gap-2 rounded-full bg-[hsl(230,25%,8%)] px-4 py-2 text-xs font-semibold text-gray-300 border border-white/[0.08]">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>BE Server: Port 3001</span>
          </div>
        </div>
      </header>

      {/* Live Discrepancy Alerts - M3 Error Container Banner */}
      {liveAlerts.length > 0 && (
        <div className="mb-8 flex flex-col gap-3">
          {liveAlerts.map((alert, idx) => (
            <div
              key={idx}
              className="flex flex-wrap items-center justify-between gap-3 rounded-[20px] bg-[hsl(340,60%,14%)] p-4 text-xs font-medium text-[hsl(340,90%,85%)] border border-[hsl(340,85%,65%,0.3)] shadow-xl animate-fade-in"
            >
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="w-5 h-5 text-[hsl(340,85%,65%)] shrink-0" />
                <div>
                  <span className="font-extrabold text-white uppercase tracking-wider">[!] REAL-TIME ALARM SATUSEHAT: </span>
                  {alert.facilityName} &mdash; <span className="font-bold text-white">{alert.medicineName}</span> (Sisa Stok: <span className="font-mono font-bold text-amber-300">{alert.newStockQty} unit</span>)
                </div>
              </div>
              <span className="font-mono text-[11px] text-gray-400 bg-black/30 px-3 py-1 rounded-full">{alert.timestamp}</span>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="mb-8 flex items-center gap-3 rounded-[20px] bg-[hsl(340,60%,14%)] p-5 text-xs font-medium text-[hsl(340,90%,85%)] border border-[hsl(340,85%,65%,0.3)] shadow-xl">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
          <span>{error} (Pastikan backend `SIMPUL/BE` berjalan di port 3001).</span>
        </div>
      )}

      {loading ? (
        <div className="py-20 text-center text-xs text-gray-400">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-[hsl(172,85%,45%)] border-t-transparent mb-3" />
          <p>Memuat data analitis Material 3 dari SIMPUL/BE Engine...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* M3 Cluster Cards */}
          {clusters.map(cluster => (
            <div
              key={cluster.clusterId}
              className="group relative flex flex-col justify-between rounded-[28px] border border-white/[0.08] bg-[hsl(230,20%,14%)] p-6 shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:border-[hsl(172,85%,45%,0.4)] hover:bg-[hsl(230,18%,18%)]"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="rounded-full bg-[hsl(172,75%,14%)] px-3.5 py-1 font-mono text-xs text-[hsl(172,90%,82%)] font-extrabold border border-[hsl(172,85%,45%,0.2)]">
                    Klaster #{cluster.clusterId}
                  </span>
                  <span className="text-xs font-semibold text-gray-400">{cluster.provinceCount} Provinsi</span>
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-[hsl(172,85%,45%)] transition-colors">{cluster.name}</h3>
                <p className="mt-2 text-xs leading-relaxed text-gray-400">{cluster.description}</p>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3 border-t border-white/[0.08] pt-4 text-xs">
                <div className="rounded-[14px] bg-[hsl(230,25%,8%)] p-3 border border-white/[0.05]">
                  <span className="block text-[10px] text-gray-400 font-medium">Rerata Stok (Y)</span>
                  <span className="text-base font-extrabold text-[hsl(172,85%,45%)]">{cluster.meanAvailabilityY}%</span>
                </div>
                <div className="rounded-[14px] bg-[hsl(230,25%,8%)] p-3 border border-white/[0.05]">
                  <span className="block text-[10px] text-gray-400 font-medium">Rasio Apoteker (X1)</span>
                  <span className="text-base font-extrabold text-amber-400">{cluster.meanPharmacistRatioX1}</span>
                </div>
              </div>
            </div>
          ))}

          {/* M3 OLS Model Metrics Card */}
          {metrics && (
            <div className="col-span-full rounded-[28px] border border-[hsl(172,85%,45%,0.3)] bg-gradient-to-br from-[hsl(230,20%,14%)] to-[hsl(172,75%,10%)] p-7 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-6 h-6 text-[hsl(172,85%,45%)]" />
                  <div>
                    <h3 className="text-xl font-black text-white">Google Material 3 &mdash; OLS Regression Analytics Engine</h3>
                    <p className="text-xs text-gray-400 mt-1">Formulasi Matematis SEC Paper SEC_(SD2026020000224) &mdash; Autokorelasi Spasial Moran's I</p>
                  </div>
                </div>
                <span className="rounded-full bg-[hsl(172,75%,14%)] px-4 py-1.5 text-xs font-extrabold text-[hsl(172,90%,82%)] border border-[hsl(172,85%,45%,0.3)]">
                  Fitted OLS Model
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs lg:grid-cols-4">
                <div className="rounded-[20px] bg-[hsl(230,25%,8%,0.7)] p-4 border border-white/[0.08] backdrop-blur-md">
                  <span className="block text-gray-400 font-medium mb-1">Adjusted R² Variance</span>
                  <span className="text-2xl font-black text-white">{(metrics.adjustedR2 * 100).toFixed(1)}%</span>
                </div>
                <div className="rounded-[20px] bg-[hsl(230,25%,8%,0.7)] p-4 border border-white/[0.08] backdrop-blur-md">
                  <span className="block text-gray-400 font-medium mb-1">F-Statistic Model</span>
                  <span className="text-2xl font-black text-cyan-300">{metrics.fStatistic} <span className="text-xs font-normal text-gray-400">(p &lt; 0,001)</span></span>
                </div>
                <div className="rounded-[20px] bg-[hsl(230,25%,8%,0.7)] p-4 border border-white/[0.08] backdrop-blur-md">
                  <span className="block text-gray-400 font-medium mb-1">Beta 1 (Rasio Apoteker)</span>
                  <span className="text-2xl font-black text-amber-300">+{metrics.pharmacistCoeffBeta1}</span>
                </div>
                <div className="rounded-[20px] bg-[hsl(230,25%,8%,0.7)] p-4 border border-white/[0.08] backdrop-blur-md">
                  <span className="block text-gray-400 font-medium mb-1">Moran's I (Spasial)</span>
                  <span className="text-2xl font-black text-rose-300">{metrics.moranI}</span>
                </div>
              </div>
            </div>
          )}

          {/* M3 Redistribution Recommendations Card */}
          <div className="col-span-full rounded-[28px] border border-white/[0.08] bg-[hsl(230,20%,14%)] p-7 shadow-2xl">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <Layers className="w-6 h-6 text-cyan-400" />
                <div>
                  <h3 className="text-xl font-black text-white">Rekomendasi Redistribusi Stok Antar-Wilayah</h3>
                  <p className="text-xs text-gray-400 mt-1">Pemindahan stok surplus (Buffer &gt;120%) dari Faskes Klaster 1 ke Faskes Defisit Klaster 3</p>
                </div>
              </div>
              <span className="rounded-full bg-[hsl(172,75%,14%)] px-4 py-1.5 text-xs font-bold text-[hsl(172,90%,82%)] border border-[hsl(172,85%,45%,0.3)]">
                {redistributions.length} Rekomendasi Aktif
              </span>
            </div>

            <div className="flex flex-col gap-4">
              {redistributions.map(item => (
                <div
                  key={item.id}
                  className="flex flex-wrap items-center justify-between gap-4 rounded-[20px] border border-white/[0.08] bg-[hsl(230,25%,8%)] p-5 transition-all hover:border-[hsl(172,85%,45%,0.3)]"
                >
                  <div className="flex flex-col gap-1.5 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">[{item.id}]</span>
                      <span className="text-sm font-extrabold text-white">{item.medicineName}</span>
                      <span className="rounded-full bg-rose-500/20 px-2.5 py-0.5 text-[10px] text-rose-300 font-bold border border-rose-500/30">
                        {item.urgencyLevel} PRIORITY
                      </span>
                    </div>
                    <div className="text-gray-300">
                      Asal: <span className="font-semibold text-emerald-300">{item.sourceFacilityName} ({item.sourceProvinceName})</span>
                    </div>
                    <div className="text-gray-300">
                      Tujuan: <span className="font-semibold text-amber-300">{item.targetFacilityName} ({item.targetProvinceName})</span>
                    </div>
                    <div className="text-gray-400">
                      Jumlah Transfer: <span className="font-mono font-extrabold text-white">{item.transferQuantity} unit</span> (Sisa Stok Pengirim: {item.sourceStockAfterTransfer} unit &mdash; Aman &gt;120% Buffer)
                    </div>
                  </div>

                  <div>
                    {item.status === 'DISPATCHED' ? (
                      <span className="flex items-center gap-2 rounded-full bg-emerald-500/20 px-5 py-2.5 text-xs font-bold text-emerald-300 border border-emerald-500/30">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Didisposisi ke Kurir LORA</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => handleDispatch(item.id)}
                        className="flex items-center gap-2 rounded-full bg-[hsl(172,85%,45%)] px-6 py-2.5 text-xs font-extrabold text-gray-950 transition hover:scale-105 shadow-lg active:scale-95"
                      >
                        <Send className="w-4 h-4 fill-current" />
                        <span>Disposisi ke Kurir LORA</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
