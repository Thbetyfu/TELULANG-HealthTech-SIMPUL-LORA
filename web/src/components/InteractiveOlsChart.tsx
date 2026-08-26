import React, { useEffect, useState } from 'react';
import { BarChart3, Info, Loader2, AlertTriangle } from 'lucide-react';
import { apiUrl } from '../config/api';

interface DataPoint {
  id: string;
  provinceName: string;
  pharmacistRatioX1: number;
  availabilityY: number;
  cluster: string;
}

interface OlsMetrics {
  adjustedR2: number;
  pharmacistCoeffBeta1: number;
  interceptBeta0: number;
}

const CLUSTER_LABEL: Record<number, string> = {
  1: 'Klaster 1 (Tinggi)',
  2: 'Klaster 2 (Moderat)',
  3: 'Klaster 3 (Kritis / LORA)'
};

export const InteractiveOlsChart: React.FC<{ adjustedR2?: number; beta1?: number }> = ({
  adjustedR2: adjustedR2Prop,
  beta1: beta1Prop
}) => {
  const [activePoint, setActivePoint] = useState<DataPoint | null>(null);
  const [points, setPoints] = useState<DataPoint[]>([]);
  const [metrics, setMetrics] = useState<OlsMetrics>({
    adjustedR2: adjustedR2Prop ?? 0.8001,
    pharmacistCoeffBeta1: beta1Prop ?? 22.94,
    interceptBeta0: 29.84
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [provRes, olsRes] = await Promise.all([
          fetch(apiUrl('/api/v1/analytics/provinces')),
          fetch(apiUrl('/api/v1/analytics/ols-metrics'))
        ]);

        if (!provRes.ok || !olsRes.ok) {
          throw new Error('Gagal memuat data OLS / provinsi dari BE');
        }

        const provJson = await provRes.json();
        const olsJson = await olsRes.json();

        if (olsJson.data) {
          setMetrics({
            adjustedR2: olsJson.data.adjustedR2 ?? adjustedR2Prop ?? 0.8001,
            pharmacistCoeffBeta1: olsJson.data.pharmacistCoeffBeta1 ?? beta1Prop ?? 22.94,
            interceptBeta0: olsJson.data.interceptBeta0 ?? 14.2
          });
        }

        if (Array.isArray(provJson.data)) {
          // Sample up to 12 provinces spanning clusters for readable scatter
          const mapped: DataPoint[] = provJson.data
            .slice()
            .sort((a: { availabilityRateY: number }, b: { availabilityRateY: number }) =>
              a.availabilityRateY - b.availabilityRateY
            )
            .filter((_: unknown, idx: number) => idx % 3 === 0)
            .slice(0, 12)
            .map((item: {
              provinceCode: string;
              provinceName: string;
              pharmacistRatioX1: number;
              availabilityRateY: number;
              cluster: number;
            }) => ({
              id: item.provinceCode,
              provinceName: item.provinceName,
              pharmacistRatioX1: Number((item.pharmacistRatioX1 * 4).toFixed(2)),
              availabilityY: item.availabilityRateY,
              cluster: CLUSTER_LABEL[item.cluster] || `Klaster ${item.cluster}`
            }));
          setPoints(mapped);
        }
        setError(null);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Gagal memuat chart');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [adjustedR2Prop, beta1Prop]);

  const adjustedR2 = metrics.adjustedR2;
  const beta1 = metrics.pharmacistCoeffBeta1;
  const intercept = metrics.interceptBeta0;

  const svgWidth = 700;
  const svgHeight = 320;
  const paddingLeft = 50;
  const paddingBottom = 40;
  const paddingTop = 30;
  const paddingRight = 30;

  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;

  const maxX = 5.0;
  const maxY = 100.0;

  const getX = (x: number) => paddingLeft + (x / maxX) * chartWidth;
  const getY = (y: number) => paddingTop + chartHeight - (y / maxY) * chartHeight;

  const lineX1 = 0.5;
  const lineY1 = intercept + beta1 * (lineX1 / 4);
  const lineX2 = 4.5;
  const lineY2 = Math.min(100, intercept + beta1 * (lineX2 / 4));

  return (
    <div
      className="border p-4 sm:p-6 shadow-2xl space-y-4 select-none"
      style={{
        background: 'var(--md-sys-color-surface-container-low)',
        borderColor: 'var(--md-sys-color-outline-variant)',
        borderRadius: 'var(--md-sys-shape-corner-medium)'
      }}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b pb-3"
        style={{ borderColor: 'var(--md-sys-color-outline-variant)' }}
      >
        <div>
          <h3 className="text-xs sm:text-sm font-bold flex items-center gap-2 font-mono">
            <BarChart3 className="w-4 h-4" style={{ color: 'var(--md-sys-color-secondary)' }} />
            INTERACTIVE OLS SCATTER (API-BACKED)
          </h3>
          <p className="text-[11px] font-mono mt-0.5" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
            Titik dari /api/v1/analytics/provinces; metrik dari /ols-metrics.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span
            className="px-2 py-1 border"
            style={{
              background: 'var(--md-sys-color-primary-container)',
              color: 'var(--md-sys-color-on-primary-container)',
              borderColor: 'var(--md-sys-color-primary)',
              borderRadius: 'var(--md-sys-shape-corner-extra-small)'
            }}
          >
            Adj. R2 = {(adjustedR2 * 100).toFixed(2)}%
          </span>
          <span
            className="px-2 py-1 border"
            style={{
              background: 'var(--md-sys-color-secondary-container)',
              color: 'var(--md-sys-color-on-secondary-container)',
              borderColor: 'var(--md-sys-color-secondary)',
              borderRadius: 'var(--md-sys-shape-corner-extra-small)'
            }}
          >
            b1 = +{beta1}
          </span>
        </div>
      </div>

      {error && (
        <div
          className="flex items-center gap-2 text-xs border p-2"
          style={{
            borderColor: 'var(--md-sys-color-error)',
            color: 'var(--md-sys-color-error)',
            borderRadius: 'var(--md-sys-shape-corner-small)'
          }}
        >
          <AlertTriangle className="w-4 h-4" />
          {error}
        </div>
      )}

      {loading ? (
        <div
          className="flex h-[240px] items-center justify-center gap-2 text-xs font-mono"
          style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
        >
          <Loader2 className="w-4 h-4 animate-spin" />
          Memuat scatter OLS dari BE...
        </div>
      ) : (
        <div
          className="relative border p-2 overflow-x-auto"
          style={{
            background: 'var(--md-sys-color-surface)',
            borderColor: 'var(--md-sys-color-outline-variant)',
            borderRadius: 'var(--md-sys-shape-corner-small)'
          }}
        >
          <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto min-w-[500px]">
            {[0, 25, 50, 75, 100].map((val) => (
              <g key={val}>
                <line
                  x1={paddingLeft}
                  y1={getY(val)}
                  x2={svgWidth - paddingRight}
                  y2={getY(val)}
                  stroke="var(--md-sys-color-outline-variant)"
                  strokeDasharray="4"
                />
                <text
                  x={paddingLeft - 10}
                  y={getY(val) + 4}
                  fill="var(--md-sys-color-on-surface-variant)"
                  fontSize="10"
                  fontFamily="monospace"
                  textAnchor="end"
                >
                  {val}%
                </text>
              </g>
            ))}

            {[1, 2, 3, 4, 5].map((val) => (
              <g key={val}>
                <line
                  x1={getX(val)}
                  y1={paddingTop}
                  x2={getX(val)}
                  y2={svgHeight - paddingBottom}
                  stroke="var(--md-sys-color-outline-variant)"
                  strokeDasharray="4"
                />
                <text
                  x={getX(val)}
                  y={svgHeight - paddingBottom + 18}
                  fill="var(--md-sys-color-on-surface-variant)"
                  fontSize="10"
                  fontFamily="monospace"
                  textAnchor="middle"
                >
                  {val}.0
                </text>
              </g>
            ))}

            <line
              x1={paddingLeft}
              y1={paddingTop}
              x2={paddingLeft}
              y2={svgHeight - paddingBottom}
              stroke="var(--md-sys-color-outline)"
              strokeWidth="1.5"
            />
            <line
              x1={paddingLeft}
              y1={svgHeight - paddingBottom}
              x2={svgWidth - paddingRight}
              y2={svgHeight - paddingBottom}
              stroke="var(--md-sys-color-outline)"
              strokeWidth="1.5"
            />

            <line
              x1={getX(lineX1)}
              y1={getY(lineY1)}
              x2={getX(lineX2)}
              y2={getY(lineY2)}
              stroke="var(--md-sys-color-primary)"
              strokeWidth="3"
              strokeLinecap="round"
            />

            {points.map((pt) => {
              const isHovered = activePoint?.id === pt.id;
              const dotColor =
                pt.availabilityY >= 85
                  ? 'var(--md-sys-color-primary)'
                  : pt.availabilityY >= 70
                    ? 'var(--md-sys-color-secondary)'
                    : 'var(--md-sys-color-error)';

              return (
                <g key={pt.id} className="cursor-pointer" onMouseEnter={() => setActivePoint(pt)}>
                  {isHovered && (
                    <circle
                      cx={getX(pt.pharmacistRatioX1)}
                      cy={getY(pt.availabilityY)}
                      r="12"
                      fill={dotColor}
                      opacity="0.3"
                    />
                  )}
                  <circle
                    cx={getX(pt.pharmacistRatioX1)}
                    cy={getY(pt.availabilityY)}
                    r={isHovered ? 8 : 5}
                    fill={dotColor}
                    stroke="var(--md-sys-color-on-surface)"
                    strokeWidth="1.5"
                  />
                  <text
                    x={getX(pt.pharmacistRatioX1) + 8}
                    y={getY(pt.availabilityY) - 6}
                    fill={isHovered ? 'var(--md-sys-color-on-surface)' : 'var(--md-sys-color-on-surface-variant)'}
                    fontSize="9"
                    fontFamily="monospace"
                    fontWeight={isHovered ? 'bold' : 'normal'}
                  >
                    {pt.provinceName}
                  </text>
                </g>
              );
            })}
          </svg>

          {activePoint && (
            <div
              className="absolute top-4 right-4 border p-3 text-xs font-mono shadow-2xl z-20 space-y-1"
              style={{
                background: 'var(--md-sys-color-surface-container)',
                borderColor: 'var(--md-sys-color-secondary)',
                borderRadius: 'var(--md-sys-shape-corner-small)',
                color: 'var(--md-sys-color-on-surface)'
              }}
            >
              <div
                className="font-bold border-b pb-1 flex items-center gap-1"
                style={{
                  color: 'var(--md-sys-color-secondary)',
                  borderColor: 'var(--md-sys-color-outline-variant)'
                }}
              >
                <Info className="w-3.5 h-3.5" />
                <span>{activePoint.provinceName}</span>
              </div>
              <div>
                Rasio Apoteker (X1 scale):{' '}
                <span className="font-bold">{activePoint.pharmacistRatioX1}</span>
              </div>
              <div>
                Ketersediaan Stok (Y):{' '}
                <span className="font-bold" style={{ color: 'var(--md-sys-color-primary)' }}>
                  {activePoint.availabilityY}%
                </span>
              </div>
              <div className="text-[10px]" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                {activePoint.cluster}
              </div>
            </div>
          )}
        </div>
      )}

      <div
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs font-mono pt-1"
        style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
      >
        <span className="flex items-center gap-2">
          <span className="w-3 h-0.5" style={{ background: 'var(--md-sys-color-primary)' }} />
          Garis tren OLS (seed BE; X1 divisualkan pada skala chart)
        </span>
        <span>Sumbu X: Rasio Apoteker (scaled) | Sumbu Y: Ketersediaan (%)</span>
      </div>
    </div>
  );
};
