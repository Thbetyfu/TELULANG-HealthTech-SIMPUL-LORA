import React, { useEffect, useState } from 'react';

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

export const KdaksDashboardView: React.FC = () => {
  const [clusters, setClusters] = useState<ClusterProfile[]>([]);
  const [metrics, setMetrics] = useState<OLSMetrics | null>(null);
  const [liveAlerts, setLiveAlerts] = useState<LiveAlertEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

    fetchAnalytics();
  }, []);

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
    <div className="min-h-screen bg-[hsl(222,47%,7%)] p-6 font-sans text-white">
      {/* Material 3 Top App Bar */}
      <header className="mb-6 flex items-center justify-between rounded-[16px] bg-[hsl(217,33%,12%)] p-4 shadow-md">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[hsl(174,100%,41%)] text-gray-950 font-bold">
            M3
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[hsl(174,100%,41%)]">
              K-DAK Strategic Management Dashboard
            </h1>
            <p className="text-xs text-gray-400">Google Material Design 3 (M3 / Material You) System</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={triggerSimulatedWebhook}
            className="rounded-full bg-[hsl(190,95%,50%)] px-4 py-1.5 text-xs font-bold text-gray-950 transition hover:opacity-90"
          >
            + Simulasi SATUSEHAT Webhook
          </button>
          <div className="rounded-full bg-[hsl(174,80%,18%)] px-4 py-1.5 text-xs font-semibold text-[hsl(174,100%,80%)] border border-[hsl(174,100%,41%,0.3)]">
            BE Server: http://localhost:3001
          </div>
        </div>
      </header>

      {/* Live Discrepancy Alerts */}
      {liveAlerts.length > 0 && (
        <div className="mb-6 flex flex-col gap-2">
          {liveAlerts.map((alert, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between rounded-[12px] bg-[hsl(346,80%,18%)] p-4 text-xs font-medium text-[hsl(346,100%,80%)] border border-[hsl(346,84%,61%,0.3)]"
            >
              <div>
                <span className="font-bold text-white">[!] LIVE REAL-TIME ALERT: </span>
                {alert.facilityName} - {alert.medicineName} (Sisa Stok: {alert.newStockQty} unit)
              </div>
              <span className="font-mono text-gray-300">{alert.timestamp}</span>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-[12px] bg-[hsl(346,80%,18%)] p-4 text-xs font-medium text-[hsl(346,100%,80%)] border border-[hsl(346,84%,61%,0.3)]">
          ⚠️ {error} (Pastikan backend `SIMPUL/BE` berjalan di port 3001).
        </div>
      )}

      {loading ? (
        <div className="text-center text-xs text-gray-400">Memuat data analitis M3 dari SIMPUL/BE...</div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* M3 Cluster Cards */}
          {clusters.map(cluster => (
            <div
              key={cluster.clusterId}
              className="rounded-[16px] border border-[hsla(210,100%,75%,0.15)] bg-[hsl(217,30%,16%)] p-5 shadow-lg transition-all duration-200 hover:bg-[hsl(217,25%,20%)]"
            >
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-[hsl(190,80%,18%)] px-3 py-0.5 font-mono text-xs text-[hsl(190,100%,80%)] font-semibold">
                  Cluster #{cluster.clusterId}
                </span>
                <span className="text-xs text-gray-400">{cluster.provinceCount} Provinsi</span>
              </div>
              <h3 className="mt-3 text-base font-bold text-white">{cluster.name}</h3>
              <p className="mt-1 text-xs text-gray-400">{cluster.description}</p>
              
              <div className="mt-4 flex justify-between border-t border-[hsla(210,100%,75%,0.1)] pt-3 text-xs">
                <div>
                  <span className="block text-gray-400">Rerata Stok (Y)</span>
                  <span className="font-bold text-[hsl(174,100%,41%)]">{cluster.meanAvailabilityY}%</span>
                </div>
                <div>
                  <span className="block text-gray-400">Rasio Apoteker (X1)</span>
                  <span className="font-bold text-amber-400">{cluster.meanPharmacistRatioX1}</span>
                </div>
              </div>
            </div>
          ))}

          {/* M3 OLS Model Metrics Card */}
          {metrics && (
            <div className="col-span-full rounded-[28px] border border-[hsl(174,100%,41%,0.3)] bg-[hsl(174,80%,18%)] p-6 shadow-xl text-[hsl(174,100%,80%)]">
              <h3 className="text-lg font-bold text-white">Google Material 3 - OLS Regression Analytics</h3>
              <div className="mt-4 grid grid-cols-2 gap-4 text-xs lg:grid-cols-4">
                <div className="rounded-[12px] bg-black/30 p-4 border border-[hsl(174,100%,41%,0.2)]">
                  <span className="block text-gray-300">Adjusted R2</span>
                  <span className="text-xl font-bold text-white">{(metrics.adjustedR2 * 100).toFixed(1)}%</span>
                </div>
                <div className="rounded-[12px] bg-black/30 p-4 border border-[hsl(174,100%,41%,0.2)]">
                  <span className="block text-gray-300">F-Statistic Model</span>
                  <span className="text-xl font-bold text-cyan-300">{metrics.fStatistic} (p &lt; 0,001)</span>
                </div>
                <div className="rounded-[12px] bg-black/30 p-4 border border-[hsl(174,100%,41%,0.2)]">
                  <span className="block text-gray-300">Beta 1 (Rasio Apoteker)</span>
                  <span className="text-xl font-bold text-amber-300">+{metrics.pharmacistCoeffBeta1}</span>
                </div>
                <div className="rounded-[12px] bg-black/30 p-4 border border-[hsl(174,100%,41%,0.2)]">
                  <span className="block text-gray-300">Moran's I (Spasial)</span>
                  <span className="text-xl font-bold text-rose-300">{metrics.moranI}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
