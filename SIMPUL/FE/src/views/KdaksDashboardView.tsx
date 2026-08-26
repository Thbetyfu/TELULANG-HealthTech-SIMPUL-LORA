import React, { useEffect, useState } from 'react';
import { 
  Building2, 
  CheckCircle2, 
  Send, 
  RefreshCw, 
  ShieldAlert,
  ArrowRightLeft,
  BarChart3
} from 'lucide-react';
import { InteractiveOlsChart } from '../../../../web/src/components/InteractiveOlsChart';
import { apiUrl } from '../../../../web/src/config/api';

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
  const [clusters, setClusters] = useState<ClusterProfile[]>([
    {
      clusterId: 1,
      name: 'Klaster 1: Rawan Ketersediaan Tinggi',
      description: 'Wilayah dengan rasio apoteker rendah dan ketersediaan obat esensial kritis (<65%). Prioritas redistribusi utama.',
      provinceCount: 12,
      meanAvailabilityY: 62.4,
      meanPharmacistRatioX1: 1.45
    },
    {
      clusterId: 2,
      name: 'Klaster 2: Ketersediaan Moderat',
      description: 'Wilayah dengan pasokan obat stabil namun rentan terhadap lonjakan musiman (Demam Berdarah/ISPA).',
      provinceCount: 14,
      meanAvailabilityY: 81.2,
      meanPharmacistRatioX1: 2.80
    },
    {
      clusterId: 3,
      name: 'Klaster 3: Surplus Rantai Pasok',
      description: 'Pusat distribusi logistik farmasi dengan kecukupan stok tinggi (>92%) dan cadangan penyangga terjamin.',
      provinceCount: 8,
      meanAvailabilityY: 94.8,
      meanPharmacistRatioX1: 4.12
    }
  ]);

  const [metrics, setMetrics] = useState<OLSMetrics>({
    adjustedR2: 0.8001,
    fStatistic: 34.03,
    pharmacistCoeffBeta1: 22.94,
    moranI: 0.4575
  });

  const [liveAlerts] = useState<LiveAlertEvent[]>([
    {
      event: 'DISCREPANCY_ALERT',
      facilityName: 'RSUD Kabupaten Halmahera Selatan',
      medicineName: 'Amoxicillin 500mg (Tab)',
      newStockQty: 450,
      discrepancyPct: 18.4,
      timestamp: '14:02:11'
    },
    {
      event: 'DISCREPANCY_ALERT',
      facilityName: 'Puskesmas Kairatu Seram Barat',
      medicineName: 'Paracetamol Syrup 120mg/5ml',
      newStockQty: 120,
      discrepancyPct: 24.1,
      timestamp: '13:45:09'
    }
  ]);

  const [redistributions, setRedistributions] = useState<RedistributionItem[]>([
    {
      id: 'REDIST-2026-001',
      sourceFacilityName: 'Dinas Kesehatan Kota Ambon',
      sourceProvinceName: 'Maluku',
      targetFacilityName: 'Puskesmas Kairatu',
      targetProvinceName: 'Maluku',
      medicineName: 'Paracetamol Syrup 120mg/5ml',
      transferQuantity: 500,
      sourceStockAfterTransfer: 2400,
      urgencyLevel: 'CRITICAL',
      estimatedMinutes: 45,
      status: 'PROPOSED'
    },
    {
      id: 'REDIST-2026-002',
      sourceFacilityName: 'RSUD Chasan Boesoirie Ternate',
      sourceProvinceName: 'Maluku Utara',
      targetFacilityName: 'RSUD Halmahera Selatan',
      targetProvinceName: 'Maluku Utara',
      medicineName: 'Amoxicillin 500mg',
      transferQuantity: 1000,
      sourceStockAfterTransfer: 4500,
      urgencyLevel: 'HIGH',
      estimatedMinutes: 90,
      status: 'PROPOSED'
    }
  ]);

  const fetchRedistributions = async () => {
    try {
      const res = await fetch(apiUrl('/api/v1/redistributions'));
      if (res.ok) {
        const json = await res.json();
        if (json.data && json.data.length > 0) {
          setRedistributions(json.data);
        }
      }
    } catch (_e) {
      // Keep seed fallback if BE unreachable
    }
  };

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [clusterRes, olsRes] = await Promise.all([
          fetch(apiUrl('/api/v1/analytics/profiles')),
          fetch(apiUrl('/api/v1/analytics/ols-metrics'))
        ]);

        if (clusterRes.ok && olsRes.ok) {
          const clusterJson = await clusterRes.json();
          const olsJson = await olsRes.json();
          setClusters(clusterJson.data);
          setMetrics(olsJson.data);
        }
      } catch (_err) {
        // Keep seed fallback if BE unreachable
      }
    };

    fetchAnalytics();
    fetchRedistributions();
  }, []);

  const handleDispatch = (id: string) => {
    setRedistributions(prev => prev.map(item => item.id === id ? { ...item, status: 'DISPATCHED' } : item));
  };

  return (
    <div className="min-h-screen bg-[#000000] text-[#ffffff] font-sans pb-16">
      {/* Content Area */}
      <main className="mx-auto max-w-7xl px-4 sm:px-8 pt-6 sm:pt-8 space-y-6 sm:space-y-8">
        
        {/* Discrepancy Alert */}
        {liveAlerts.length > 0 && (
          <div className="rounded-lg bg-[#0a0a0a] border border-[#ff0000] p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-[#ff0000] shrink-0 mt-0.5" />
              <div>
                <h3 className="text-xs font-bold text-[#ff0000] font-mono uppercase tracking-wider">
                  DISCREPANCY ALERT DETECTED (&gt;2.0% Toleransi Selisih)
                </h3>
                <p className="text-xs text-[#888888] mt-0.5">
                  Terdeteksi {liveAlerts.length} insiden perbedaan kuantitas obat antara rekam medis dan BPJS P-Care.
                </p>
              </div>
            </div>
            <span className="text-[11px] font-mono text-[#ff0000] bg-[#1a0000] px-2.5 py-1 rounded border border-[#ff0000]/40">
              Audit Event Logged
            </span>
          </div>
        )}

        {/* Section 1: Analytics Metrics Cards Grid */}
        <div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 mb-3">
            <h2 className="text-xs font-mono text-[#888888] uppercase tracking-wider">
              OLS Regression Spatial Analytics
            </h2>
            <span className="text-[11px] text-[#888888] font-mono">Formula: Y = 29.84 + {metrics.pharmacistCoeffBeta1}(X1)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 sm:p-5 rounded-lg bg-[#0a0a0a] border border-[#333333] hover:border-[#666666] transition-colors">
              <p className="text-xs font-mono text-[#888888]">Adjusted R² Score</p>
              <p className="text-2xl sm:text-3xl font-bold font-mono text-white mt-2">{(metrics.adjustedR2 * 100).toFixed(2)}%</p>
              <p className="text-[11px] text-[#888888] mt-1">Variabilitas ketersediaan terjelaskan model.</p>
            </div>

            <div className="p-4 sm:p-5 rounded-lg bg-[#0a0a0a] border border-[#333333] hover:border-[#666666] transition-colors">
              <p className="text-xs font-mono text-[#888888]">F-Statistic Test</p>
              <p className="text-2xl sm:text-3xl font-bold font-mono text-[#0070f3] mt-2">{metrics.fStatistic}</p>
              <p className="text-[11px] text-[#888888] mt-1">Signifikan secara simultan (p &lt; 0.001).</p>
            </div>

            <div className="p-4 sm:p-5 rounded-lg bg-[#0a0a0a] border border-[#333333] hover:border-[#666666] transition-colors">
              <p className="text-xs font-mono text-[#888888]">Koefisien Apoteker (β1)</p>
              <p className="text-2xl sm:text-3xl font-bold font-mono text-[#50e3c2] mt-2">+{metrics.pharmacistCoeffBeta1}</p>
              <p className="text-[11px] text-[#888888] mt-1">Setiap apoteker/100rb naikkan stok 22.9%.</p>
            </div>

            <div className="p-4 sm:p-5 rounded-lg bg-[#0a0a0a] border border-[#333333] hover:border-[#666666] transition-colors">
              <p className="text-xs font-mono text-[#888888]">Moran's I Autokorelasi</p>
              <p className="text-2xl sm:text-3xl font-bold font-mono text-[#00df89] mt-2">{metrics.moranI}</p>
              <p className="text-[11px] text-[#888888] mt-1">Autokorelasi spasial positif antar-wilayah.</p>
            </div>
          </div>
        </div>

        {/* Section 2: NATIVE INTERACTIVE REACT SVG CHART */}
        <InteractiveOlsChart adjustedR2={metrics.adjustedR2} beta1={metrics.pharmacistCoeffBeta1} />

        {/* Section 3: SERVER-SIDE BACKEND SVG CHART STREAM */}
        <div className="rounded-lg bg-[#0a0a0a] border border-[#333333] p-4 sm:p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-4 border-b border-[#222222] pb-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2 font-mono">
              <BarChart3 className="w-4 h-4 text-[#50e3c2]" />
              VISUALISASI GRAFIK REGRESI OLS (BACKEND API SERVER STREAM)
            </h2>
            <span className="text-xs font-mono text-[#00df89] bg-[#001f10] px-2.5 py-0.5 rounded border border-[#00df89]/30">
              Live SVG Stream (Port 5000)
            </span>
          </div>

          <div className="rounded bg-[#000000] border border-[#222222] overflow-hidden p-2">
            <img 
              src={apiUrl('/api/v1/analytics/visuals/ols-chart.svg')} 
              alt="OLS Spatial Regression SVG Chart"
              className="w-full h-auto object-contain rounded" 
            />
          </div>
        </div>

        {/* Section 4: K-Means Profiles */}
        <div>
          <h2 className="text-xs font-mono text-[#888888] uppercase tracking-wider mb-3">
            K-Means Spatial Clustering (k=3)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {clusters.map(cluster => (
              <div key={cluster.clusterId} className="rounded-lg bg-[#0a0a0a] border border-[#333333] p-4 sm:p-5 flex flex-col justify-between hover:border-[#666666] transition-colors">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 rounded bg-[#111111] border border-[#333333] text-xs font-mono text-[#888888]">
                      {cluster.provinceCount} Provinsi
                    </span>
                    <span className="text-xs text-[#888888] font-mono">#cluster-0{cluster.clusterId}</span>
                  </div>

                  <h3 className="text-sm font-bold text-white mt-1">{cluster.name}</h3>
                  <p className="text-xs text-[#888888] leading-relaxed mt-2">{cluster.description}</p>
                </div>

                <div className="mt-5 pt-3 border-t border-[#333333] grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[10px] text-[#888888] uppercase font-mono">Mean Stock (Y)</p>
                    <p className="text-sm font-bold font-mono text-white">{cluster.meanAvailabilityY}%</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#888888] uppercase font-mono">Pharmacist Ratio (X1)</p>
                    <p className="text-sm font-bold font-mono text-[#50e3c2]">{cluster.meanPharmacistRatioX1}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 5: Data Table */}
        <div className="rounded-lg bg-[#0a0a0a] border border-[#333333] p-4 sm:p-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <ArrowRightLeft className="w-4 h-4 text-[#0070f3]" />
                Inter-Facility Stock Redistribution Engine
              </h2>
              <p className="text-xs text-[#888888]">Automatic dispatch recommendation from surplus facilities to critical regions.</p>
            </div>
            <button 
              onClick={fetchRedistributions}
              className="flex items-center gap-2 px-3 py-1.5 bg-[#000000] hover:bg-[#111111] text-white text-xs font-medium rounded border border-[#333333] hover:border-[#666666] transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Table</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-white">
              <tbody className="divide-y divide-[#222222]">
                {redistributions.map(item => (
                  <tr key={item.id} className="hover:bg-[#111111] transition-colors">
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <div className="font-semibold text-white flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-[#0070f3]" />
                        {item.sourceFacilityName}
                      </div>
                      <span className="text-[10px] text-[#888888] font-mono">{item.sourceProvinceName}</span>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <div className="font-semibold text-white flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-[#ff0000]" />
                        {item.targetFacilityName}
                      </div>
                      <span className="text-[10px] text-[#888888] font-mono">{item.targetProvinceName}</span>
                    </td>
                    <td className="px-4 py-3.5 font-medium text-[#50e3c2] whitespace-nowrap">{item.medicineName}</td>
                    <td className="px-4 py-3.5 font-mono text-white whitespace-nowrap">{item.transferQuantity} Units</td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                        item.urgencyLevel === 'CRITICAL' 
                          ? 'bg-[#1a0000] text-[#ff0000] border border-[#ff0000]/40' 
                          : 'bg-[#001020] text-[#0070f3] border border-[#0070f3]/40'
                      }`}>
                        {item.urgencyLevel}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      {item.status === 'PROPOSED' ? (
                        <button
                          onClick={() => handleDispatch(item.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#ffffff] hover:bg-[#cccccc] text-[#000000] font-semibold text-xs transition-colors"
                        >
                          <Send className="w-3.5 h-3.5 text-[#000000]" />
                          <span>Dispatch LORA</span>
                        </button>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[#00df89] font-mono text-xs bg-[#001f10] px-2.5 py-1 rounded border border-[#00df89]/30">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Dispatched
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};
