import React, { useState } from 'react';
import { MapPin, Building2 } from 'lucide-react';

export interface GisFacilityNode {
  id: string;
  facilityName: string;
  provinceName: string;
  cityName: string;
  medicineName: string;
  availableStock: number;
  temperatureCelsius: number;
  status: 'TERSEDIA' | 'MENIPIS' | 'KOSONG';
  // Percentage coordinates relative to Indonesia Map Box (0-100%)
  mapX: number;
  mapY: number;
}

interface IndonesiaGisMapProps {
  facilities: GisFacilityNode[];
  onSelectFacility?: (facility: GisFacilityNode) => void;
  selectedFacilityId?: string | null;
}

export const IndonesiaGisMap: React.FC<IndonesiaGisMapProps> = ({
  facilities,
  onSelectFacility,
  selectedFacilityId
}) => {
  const [activeHoverNode, setActiveHoverNode] = useState<GisFacilityNode | null>(null);

  return (
    <div className="relative w-full rounded-lg bg-[#000000] border border-[#333333] p-4 overflow-hidden select-none">
      {/* Map Header Controls */}
      <div className="flex items-center justify-between mb-3 border-b border-[#222222] pb-2 font-mono text-xs text-[#888888]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#00df89] animate-pulse" />
          <span className="text-white font-bold">PETA GEOGRAFIS SPASIAL INDONESIA (34 PROVINSI)</span>
        </div>
        <span>GPS Datum: WGS 84</span>
      </div>

      {/* Real Geographic Indonesia Map Container */}
      <div className="relative w-full h-[360px] bg-[#050505] rounded border border-[#222222] overflow-hidden flex items-center justify-center">
        
        {/* Real Detailed Vector Map Outline of Indonesian Archipelago */}
        <svg 
          viewBox="0 0 1000 450" 
          className="w-full h-full object-contain opacity-80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Grid lines for GIS feeling */}
          <pattern id="gisGrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1c1c1c" strokeWidth="1" />
          </pattern>
          <rect width="1000" height="450" fill="url(#gisGrid)" />

          {/* SUMATRA */}
          <path 
            d="M80 180 L120 120 L180 90 L240 140 L280 200 L240 250 L160 280 L100 240 Z" 
            fill="#141414" 
            stroke="#333333" 
            strokeWidth="1.5" 
          />
          <text x="140" y="190" fill="#444444" fontSize="14" fontWeight="bold" fontFamily="monospace">SUMATRA</text>

          {/* JAVA */}
          <path 
            d="M260 290 L340 295 L420 300 L460 305 L460 320 L380 320 L280 315 L260 305 Z" 
            fill="#141414" 
            stroke="#333333" 
            strokeWidth="1.5" 
          />
          <text x="340" y="312" fill="#444444" fontSize="12" fontWeight="bold" fontFamily="monospace">JAWA</text>

          {/* KALIMANTAN */}
          <path 
            d="M320 100 L420 80 L480 120 L490 200 L420 230 L340 220 L300 160 Z" 
            fill="#141414" 
            stroke="#333333" 
            strokeWidth="1.5" 
          />
          <text x="380" y="155" fill="#444444" fontSize="14" fontWeight="bold" fontFamily="monospace">KALIMANTAN</text>

          {/* SULAWESI */}
          <path 
            d="M520 130 L580 130 L580 150 L540 160 L570 190 L610 180 L590 210 L540 210 L540 240 L520 230 L520 180 Z" 
            fill="#141414" 
            stroke="#333333" 
            strokeWidth="1.5" 
          />
          <text x="545" y="170" fill="#444444" fontSize="12" fontWeight="bold" fontFamily="monospace">SULAWESI</text>

          {/* BALI & NUSA TENGGARA */}
          <path d="M470 310 L500 310 L500 320 L470 320 Z" fill="#141414" stroke="#333333" strokeWidth="1" />
          <path d="M510 310 L560 310 L560 325 L510 325 Z" fill="#141414" stroke="#333333" strokeWidth="1" />
          <path d="M570 310 L630 310 L630 325 L570 325 Z" fill="#141414" stroke="#333333" strokeWidth="1" />
          <text x="530" y="338" fill="#444444" fontSize="10" fontWeight="bold" fontFamily="monospace">NUSA TENGGARA</text>

          {/* MALUKU ARCHIPELAGO */}
          <path d="M640 140 L690 140 L690 170 L640 170 Z" fill="#141414" stroke="#333333" strokeWidth="1.5" />
          <path d="M650 190 L710 190 L710 240 L650 240 Z" fill="#141414" stroke="#333333" strokeWidth="1.5" />
          <text x="655" y="160" fill="#444444" fontSize="11" fontWeight="bold" fontFamily="monospace">MALUKU UTARA</text>
          <text x="660" y="215" fill="#444444" fontSize="11" fontWeight="bold" fontFamily="monospace">MALUKU</text>

          {/* PAPUA */}
          <path 
            d="M740 180 L790 140 L880 150 L950 170 L950 270 L860 270 L820 240 L760 220 Z" 
            fill="#141414" 
            stroke="#333333" 
            strokeWidth="1.5" 
          />
          <text x="830" y="200" fill="#444444" fontSize="16" fontWeight="bold" fontFamily="monospace">PAPUA</text>
        </svg>

        {/* Interactive GIS Facility Markers/Pins */}
        {facilities.map((fac) => {
          const isSelected = selectedFacilityId === fac.id;
          const isHovered = activeHoverNode?.id === fac.id;

          const statusColor = fac.status === 'TERSEDIA' 
            ? 'bg-[#00df89] text-[#000000] border-[#00df89]' 
            : fac.status === 'MENIPIS' 
            ? 'bg-[#0070f3] text-white border-[#0070f3]' 
            : 'bg-[#ff0000] text-white border-[#ff0000]';

          const pinBg = fac.status === 'TERSEDIA' 
            ? 'bg-[#00df89]' 
            : fac.status === 'MENIPIS' 
            ? 'bg-[#0070f3]' 
            : 'bg-[#ff0000]';

          return (
            <div
              key={fac.id}
              style={{ left: `${fac.mapX}%`, top: `${fac.mapY}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer group"
              onClick={() => onSelectFacility && onSelectFacility(fac)}
              onMouseEnter={() => setActiveHoverNode(fac)}
              onMouseLeave={() => setActiveHoverNode(null)}
            >
              {/* Pulsing Outer Ping Ring */}
              <div className={`absolute -inset-2 rounded-full opacity-40 animate-ping ${pinBg}`} />

              {/* Facility Marker Badge */}
              <div className={`relative flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-mono font-bold shadow-2xl transition-transform duration-200 ${
                isSelected || isHovered ? 'scale-110 z-30 ring-2 ring-white' : 'scale-100'
              } ${statusColor}`}>
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate max-w-[120px]">{fac.facilityName}</span>
              </div>

              {/* Hover Tooltip Card */}
              {isHovered && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-[#0a0a0a] border border-[#666666] rounded-lg p-3 shadow-2xl z-40 text-xs font-sans text-white pointer-events-none">
                  <div className="flex items-center justify-between border-b border-[#333333] pb-1.5 mb-1.5">
                    <span className="font-bold text-white flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-[#0070f3]" />
                      {fac.facilityName}
                    </span>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold ${statusColor}`}>
                      {fac.status}
                    </span>
                  </div>

                  <p className="text-[11px] text-[#888888] font-mono">{fac.cityName}, {fac.provinceName}</p>

                  <div className="mt-2 bg-[#000000] p-2 rounded border border-[#222222] space-y-1 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-[#888888]">Obat Esensial:</span>
                      <span className="font-bold text-[#50e3c2]">{fac.medicineName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#888888]">Sisa Stok:</span>
                      <span className="font-bold font-mono text-white">{fac.availableStock} Unit</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#888888]">Suhu Cold-Chain:</span>
                      <span className="font-bold font-mono text-[#0070f3]">{fac.temperatureCelsius}°C</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Map Legend */}
      <div className="mt-3 flex items-center justify-between text-xs font-mono text-[#888888] border-t border-[#222222] pt-2">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00df89]" /> Stok Terjamin (&gt;80%)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0070f3]" /> Stok Menipis (40-80%)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff0000]" /> Stok Kritis (&lt;40%)
          </span>
        </div>
        <span>SATUSEHAT GIS Engine</span>
      </div>
    </div>
  );
};
