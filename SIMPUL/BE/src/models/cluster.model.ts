export interface ProvinceIndicatorEntity {
  provinceCode: string;
  provinceName: string;
  availabilityRateY: number;      // Y: % Puskesmas dengan ketersediaan obat >= 80%
  pharmacistRatioX1: number;      // X1: Rasio apoteker per puskesmas
  accreditationRateX2: number;    // X2: % Akreditasi puskesmas
  roadIndexX3: number;            // X3: Indeks Aksesibilitas Jalan
  humanDevelopmentIndexX4: number; // X4: IPM
  cluster?: number;                // 1 (Tinggi), 2 (Sedang), 3 (Rendah)
  coordinates?: { x: number; y: number }; // Canvas GIS coordinates
}

export interface ClusterProfileEntity {
  clusterId: number;
  name: string;
  description: string;
  provinceCount: number;
  meanAvailabilityY: number;
  meanPharmacistRatioX1: number;
  meanAccreditationX2: number;
  meanRoadIndexX3: number;
  meanHdiX4: number;
}

export interface OLSModelMetricsEntity {
  interceptBeta0: number;
  pharmacistCoeffBeta1: number;     // +22.94
  accreditationCoeffBeta2: number;  // +12.21
  roadIndexCoeffBeta3: number;      // +7.32
  hdiCoeffBeta4: number;            // +0.61
  adjustedR2: number;              // 0.8001 (80.0%)
  fStatistic: number;              // 34.03
  pValue: number;                  // < 0.001
  moranI: number;                  // 0.4575
}
