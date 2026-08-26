import React, { useEffect, useRef } from 'react';
import { ShieldCheck, RefreshCw } from 'lucide-react';

export interface RealGisFacilityNode {
  id: string;
  facilityName: string;
  provinceName: string;
  cityName: string;
  medicineName: string;
  availableStock: number;
  temperatureCelsius: number;
  status: 'TERSEDIA' | 'MENIPIS' | 'KOSONG';
  lat: number;
  lng: number;
}

interface RealLeafletGisMapProps {
  facilities: RealGisFacilityNode[];
  onSelectFacility?: (facility: RealGisFacilityNode) => void;
  selectedFacilityId?: string | null;
}

declare global {
  interface Window {
    L: any;
  }
}

export const RealLeafletGisMap: React.FC<RealLeafletGisMapProps> = ({
  facilities,
  onSelectFacility,
  selectedFacilityId
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<{ [key: string]: any }>({});
  const [mapLoaded, setMapLoaded] = React.useState(false);

  // Dynamically load Leaflet CSS & JS from unpkg CDN
  useEffect(() => {
    const existingCss = document.getElementById('leaflet-css');
    if (!existingCss) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      link.onload = () => { checkReady(); };
      document.head.appendChild(link);
    }

    const existingJs = document.getElementById('leaflet-js');
    if (!existingJs) {
      const script = document.createElement('script');
      script.id = 'leaflet-js';
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = () => { checkReady(); };
      document.head.appendChild(script);
    }

    function checkReady() {
      if (window.L) {
        setMapLoaded(true);
      }
    }

    if (window.L) {
      setMapLoaded(true);
    }
  }, []);

  // Initialize Real Leaflet Map Engine
  useEffect(() => {
    if (!mapLoaded || !mapContainerRef.current || mapInstanceRef.current || !window.L) return;

    const L = window.L;

    // Center on Indonesia archipelago
    const map = L.map(mapContainerRef.current, {
      center: [-2.5489, 118.0148],
      zoom: 5,
      minZoom: 4,
      maxZoom: 18,
      zoomControl: true
    });

    // High-resolution CartoDB Dark Tiles (Real OpenStreetMap GIS Tile Provider)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [mapLoaded]);

  // Update Markers when facilities or selectedFacilityId changes
  useEffect(() => {
    if (!mapInstanceRef.current || !window.L) return;

    const L = window.L;
    const map = mapInstanceRef.current;

    // Clear old markers
    Object.values(markersRef.current).forEach((m: any) => m.remove());
    markersRef.current = {};

    facilities.forEach((fac) => {
      const colorHex = fac.status === 'TERSEDIA' ? '#00df89' : fac.status === 'MENIPIS' ? '#0070f3' : '#ff0000';

      // Custom Real GIS HTML Marker Pin
      const customIcon = L.divIcon({
        className: 'custom-gis-pin',
        html: `
          <div style="
            background-color: ${colorHex};
            color: #000;
            font-family: monospace;
            font-weight: bold;
            font-size: 10px;
            padding: 3px 8px;
            border-radius: 12px;
            border: 1px solid #fff;
            box-shadow: 0 0 12px ${colorHex};
            white-space: nowrap;
            display: flex;
            align-items: center;
            gap: 4px;
            cursor: pointer;
          ">
            <span>📍</span>
            <span>${fac.facilityName}</span>
          </div>
        `,
        iconSize: [120, 24],
        iconAnchor: [60, 12]
      });

      const marker = L.marker([fac.lat, fac.lng], { icon: customIcon }).addTo(map);

      // Popup details for real GIS inspection
      const popupContent = `
        <div style="font-family: sans-serif; background: #0a0a0a; color: #fff; border: 1px solid #333; padding: 10px; border-radius: 8px; min-width: 200px;">
          <div style="font-weight: bold; font-size: 12px; color: ${colorHex}; border-bottom: 1px solid #222; padding-bottom: 4px; margin-bottom: 6px;">
            ${fac.facilityName}
          </div>
          <div style="font-size: 11px; color: #888; font-family: monospace; margin-bottom: 6px;">
            ${fac.cityName}, ${fac.provinceName}
          </div>
          <div style="font-size: 11px; background: #000; padding: 6px; border-radius: 4px; border: 1px solid #222;">
            <div><strong>Obat:</strong> <span style="color: #50e3c2;">${fac.medicineName}</span></div>
            <div><strong>Stok:</strong> <span style="color: #fff; font-family: monospace;">${fac.availableStock} Unit</span></div>
            <div><strong>Cold-Chain:</strong> <span style="color: #0070f3; font-family: monospace;">${fac.temperatureCelsius}°C</span></div>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);

      marker.on('click', () => {
        if (onSelectFacility) {
          onSelectFacility(fac);
        }
      });

      markersRef.current[fac.id] = marker;
    });
  }, [mapLoaded, facilities, onSelectFacility]);

  // Pan to selected facility if changed
  useEffect(() => {
    if (selectedFacilityId && markersRef.current[selectedFacilityId] && mapInstanceRef.current) {
      const selectedFac = facilities.find(f => f.id === selectedFacilityId);
      if (selectedFac) {
        mapInstanceRef.current.setView([selectedFac.lat, selectedFac.lng], 8, { animate: true });
        markersRef.current[selectedFacilityId].openPopup();
      }
    }
  }, [selectedFacilityId, facilities]);

  return (
    <div className="relative w-full rounded-lg bg-[#000000] border border-[#333333] p-4 overflow-hidden select-none">
      {/* Map Header Controls */}
      <div className="flex items-center justify-between mb-3 border-b border-[#222222] pb-2 font-mono text-xs text-[#888888]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#00df89] animate-pulse" />
          <span className="text-white font-bold">REAL OPENSTREETMAP / CARTO REAL-TIME GIS ENGINE</span>
        </div>
        <div className="flex items-center gap-2 text-[11px]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#50e3c2]" />
          <span>WGS 84 Real Geodetic Datum</span>
        </div>
      </div>

      {/* Leaflet Real GIS Map Box */}
      <div className="relative w-full h-[420px] bg-[#050505] rounded border border-[#222222] overflow-hidden">
        {!mapLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#050505] text-xs font-mono text-[#888888]">
            <RefreshCw className="w-4 h-4 text-[#0070f3] animate-spin mr-2" />
            <span>Loading Real OpenStreetMap / CartoDB Tile Engine...</span>
          </div>
        )}
        <div ref={mapContainerRef} className="w-full h-full z-10" />
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
        <span>Leaflet v1.9 + CartoDB Dark Tiles</span>
      </div>
    </div>
  );
};
