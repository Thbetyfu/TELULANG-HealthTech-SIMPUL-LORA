import React, { useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle2, Map } from 'lucide-react';

export interface ProvinceSpatialData {
  id: string;
  name: string;
  clusterId: 1 | 2 | 3;
  meanStockY: number;
  pharmacistRatioX1: number;
  loraPriority: boolean;
  coordinates: { x: number; y: number };
}

interface IndonesiaSpatialMapProps {
  onSelectProvince?: (provinceName: string | null) => void;
}

export const IndonesiaSpatialMap: React.FC<IndonesiaSpatialMapProps> = ({ onSelectProvince }) => {
  const [provinces, setProvinces] = useState<ProvinceSpatialData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredProv, setHoveredProv] = useState<ProvinceSpatialData | null>(null);
  const [selectedProvId, setSelectedProvId] = useState<string | null>(null);

  useEffect(() => {
    // Dynamic Fetch Exclusively from SIMPUL Backend Analytics API Engine
    const fetchSpatialClusterData = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3001/api/v1/analytics/clusters');
        if (!response.ok) {
          throw new Error('Gagal terhubung ke SIMPUL/BE Analytics API Service');
        }
        const json = await response.json();
        
        if (json.data && Array.isArray(json.data)) {
          const mappedProvinces: ProvinceSpatialData[] = json.data.map((item: any) => ({
            id: item.provinceCode || item.provinceName.substring(0, 3).toUpperCase(),
            name: item.provinceName,
            clusterId: item.cluster as (1 | 2 | 3),
            meanStockY: item.availabilityRateY,
            pharmacistRatioX1: item.pharmacistRatioX1,
            loraPriority: item.cluster === 3,
            coordinates: item.coordinates || { x: 100, y: 100 }
          }));
          setProvinces(mappedProvinces);
          setError(null);
        }
      } catch (err: any) {
        setError(err.message || 'Koneksi ke backend SIMPUL/BE terputus.');
      } finally {
        setLoading(false);
      }
    };

    fetchSpatialClusterData();
  }, []);

  const getClusterColor = (clusterId: number) => {
    switch (clusterId) {
      case 1:
        return 'hsl(174, 100%, 41%)'; // Emerald Teal M3 Primary
      case 2:
        return 'hsl(38, 92%, 50%)';   // Amber Gold M3 Secondary
      case 3:
        return 'hsl(346, 84%, 61%)';  // Crimson Rose M3 Error/Alert
      default:
        return '#6b7280';
    }
  };

  const handleProvinceClick = (prov: ProvinceSpatialData) => {
    if (selectedProvId === prov.id) {
      setSelectedProvId(null);
      if (onSelectProvince) onSelectProvince(null);
    } else {
      setSelectedProvId(prov.id);
      if (onSelectProvince) onSelectProvince(prov.name);
    }
  };

  return (
    <div className="relative rounded-[28px] border border-white/[0.08] bg-[hsl(230,20%,14%)] p-6 shadow-2xl overflow-hidden backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
        <div className="flex items-center gap-3">
          <Map className="w-5 h-5 text-[hsl(172,85%,45%)]" />
          <div>
            <h3 className="text-lg font-black text-white">Visualisasi Spasial 34 Provinsi Indonesia</h3>
            <p className="text-xs text-gray-400">Peta Klasterisasi Dynamic API Engine (`SIMPUL/BE` Server)</p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs font-semibold">
          <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-[hsl(174,100%,41%)]"></span> Klaster I (Tinggi)</span>
          <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-[hsl(38,92%,50%)]"></span> Klaster II (Sedang)</span>
          <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-[hsl(346,84%,61%)]"></span> Klaster III (LORA)</span>
        </div>
      </div>

      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-[16px] border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs text-amber-300">
          <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
          <span>{error} (Pastikan server backend `SIMPUL/BE` aktif di port 3001).</span>
        </div>
      )}

      {loading ? (
        <div className="flex h-[300px] w-full items-center justify-center rounded-2xl bg-black/20 text-xs text-gray-400">
          <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-[hsl(172,85%,45%)] border-t-transparent mr-2" />
          <span>Memuat data spasial 34 provinsi dari REST API SIMPUL/BE...</span>
        </div>
      ) : (
        <div className="relative w-full overflow-x-auto">
          <svg viewBox="0 0 660 360" className="w-full h-auto min-w-[600px] select-none">
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="660" height="360" fill="url(#grid)" rx="20" />

            {/* Interactive Province Nodes Rendered Dynamically from API */}
            {provinces.map(prov => {
              const isSelected = selectedProvId === prov.id;
              const isHovered = hoveredProv?.id === prov.id;
              const color = getClusterColor(prov.clusterId);

              return (
                <g
                  key={prov.id}
                  onClick={() => handleProvinceClick(prov)}
                  onMouseEnter={() => setHoveredProv(prov)}
                  onMouseLeave={() => setHoveredProv(null)}
                  className="cursor-pointer transition-all duration-200"
                >
                  {(isSelected || isHovered) && (
                    <circle
                      cx={prov.coordinates.x}
                      cy={prov.coordinates.y}
                      r={prov.clusterId === 3 ? 18 : 15}
                      fill={color}
                      opacity="0.35"
                      className="animate-pulse"
                    />
                  )}

                  <circle
                    cx={prov.coordinates.x}
                    cy={prov.coordinates.y}
                    r={prov.clusterId === 3 ? 11 : 9}
                    fill={color}
                    stroke="#0a0f1d"
                    strokeWidth="2"
                    className="transition-transform duration-200 hover:scale-125"
                  />

                  <text
                    x={prov.coordinates.x}
                    y={prov.coordinates.y + 18}
                    textAnchor="middle"
                    fill={isSelected ? '#7effdb' : '#9ca3af'}
                    fontSize="8"
                    fontWeight={isSelected ? 'bold' : 'normal'}
                    className="pointer-events-none"
                  >
                    {prov.id}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Floating M3 Tooltip on Hover */}
          {hoveredProv && (
            <div className="absolute top-4 left-4 z-20 rounded-[20px] border border-white/[0.1] bg-[hsl(230,20%,14%)] p-4 shadow-2xl backdrop-blur-md max-w-xs text-xs animate-fade-in">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-2 mb-2">
                <span className="font-bold text-white text-sm">{hoveredProv.name}</span>
                <span
                  className="rounded-full px-2.5 py-0.5 font-bold text-[10px]"
                  style={{
                    backgroundColor: getClusterColor(hoveredProv.clusterId) + '33',
                    color: getClusterColor(hoveredProv.clusterId)
                  }}
                >
                  Klaster #{hoveredProv.clusterId}
                </span>
              </div>
              <div className="space-y-1.5 text-gray-300">
                <div className="flex justify-between">
                  <span>Rerata Stok Obat (Y):</span>
                  <span className="font-mono font-bold text-white">{hoveredProv.meanStockY}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Rasio Apoteker (X1):</span>
                  <span className="font-mono font-bold text-amber-400">{hoveredProv.pharmacistRatioX1} / puskesmas</span>
                </div>
                <div className="flex items-center justify-between border-t border-white/[0.08] pt-2 text-[11px]">
                  <span>Status Intervensi:</span>
                  {hoveredProv.loraPriority ? (
                    <span className="flex items-center gap-1 font-bold text-rose-400">
                      <AlertTriangle className="w-3.5 h-3.5" /> Prioritas Kurir LORA
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 font-bold text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Rantai Pasok Stabil
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <p className="mt-4 text-center text-xs text-gray-400 font-medium">
        Klik node provinsi pada peta spasial di atas untuk menyaring data faskes secara instan.
      </p>
    </div>
  );
};
