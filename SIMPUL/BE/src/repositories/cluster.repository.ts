import { ProvinceIndicatorEntity } from '../models/cluster.model';

export class ClusterRepository {
  // Grounded 34 Provinces Dataset from BPS & Kemenkes Profil Kesehatan 2021-2023 with GIS Canvas Coordinates
  private provinces: ProvinceIndicatorEntity[] = [
    // Cluster I (Ketahanan Tinggi - Urban/Perkotaan - 9 Provinsi)
    { provinceCode: '31', provinceName: 'DKI Jakarta', availabilityRateY: 96.5, pharmacistRatioX1: 1.05, accreditationRateX2: 95.0, roadIndexX3: 98.2, humanDevelopmentIndexX4: 82.5, cluster: 1, coordinates: { x: 210, y: 275 } },
    { provinceCode: '32', provinceName: 'Jawa Barat', availabilityRateY: 92.2, pharmacistRatioX1: 0.88, accreditationRateX2: 87.4, roadIndexX3: 89.7, humanDevelopmentIndexX4: 78.5, cluster: 1, coordinates: { x: 230, y: 285 } },
    { provinceCode: '33', provinceName: 'Jawa Tengah', availabilityRateY: 94.1, pharmacistRatioX1: 0.92, accreditationRateX2: 90.1, roadIndexX3: 91.5, humanDevelopmentIndexX4: 78.2, cluster: 1, coordinates: { x: 270, y: 290 } },
    { provinceCode: '34', provinceName: 'DI Yogyakarta', availabilityRateY: 95.8, pharmacistRatioX1: 1.02, accreditationRateX2: 94.2, roadIndexX3: 95.0, humanDevelopmentIndexX4: 81.1, cluster: 1, coordinates: { x: 280, y: 305 } },
    { provinceCode: '35', provinceName: 'Jawa Timur', availabilityRateY: 91.5, pharmacistRatioX1: 0.85, accreditationRateX2: 86.0, roadIndexX3: 88.0, humanDevelopmentIndexX4: 77.8, cluster: 1, coordinates: { x: 320, y: 295 } },
    { provinceCode: '51', provinceName: 'Bali', availabilityRateY: 93.0, pharmacistRatioX1: 0.89, accreditationRateX2: 89.0, roadIndexX3: 92.0, humanDevelopmentIndexX4: 79.0, cluster: 1, coordinates: { x: 360, y: 305 } },
    { provinceCode: '36', provinceName: 'Banten', availabilityRateY: 89.8, pharmacistRatioX1: 0.78, accreditationRateX2: 83.5, roadIndexX3: 85.4, humanDevelopmentIndexX4: 76.5, cluster: 1, coordinates: { x: 200, y: 285 } },
    { provinceCode: '13', provinceName: 'Sumatera Barat', availabilityRateY: 88.5, pharmacistRatioX1: 0.75, accreditationRateX2: 82.0, roadIndexX3: 84.0, humanDevelopmentIndexX4: 76.0, cluster: 1, coordinates: { x: 110, y: 180 } },
    { provinceCode: '21', provinceName: 'Kepulauan Riau', availabilityRateY: 88.4, pharmacistRatioX1: 0.76, accreditationRateX2: 81.5, roadIndexX3: 83.5, humanDevelopmentIndexX4: 77.2, cluster: 1, coordinates: { x: 160, y: 140 } },

    // Cluster II (Ketahanan Sedang - 19 Provinsi)
    { provinceCode: '11', provinceName: 'Aceh', availabilityRateY: 82.1, pharmacistRatioX1: 0.52, accreditationRateX2: 72.0, roadIndexX3: 64.0, humanDevelopmentIndexX4: 73.5, cluster: 2, coordinates: { x: 50, y: 100 } },
    { provinceCode: '12', provinceName: 'Sumatera Utara', availabilityRateY: 83.5, pharmacistRatioX1: 0.55, accreditationRateX2: 73.5, roadIndexX3: 65.2, humanDevelopmentIndexX4: 74.0, cluster: 2, coordinates: { x: 90, y: 130 } },
    { provinceCode: '14', provinceName: 'Riau', availabilityRateY: 81.8, pharmacistRatioX1: 0.51, accreditationRateX2: 71.0, roadIndexX3: 62.5, humanDevelopmentIndexX4: 73.0, cluster: 2, coordinates: { x: 135, y: 155 } },
    { provinceCode: '15', provinceName: 'Jambi', availabilityRateY: 80.5, pharmacistRatioX1: 0.48, accreditationRateX2: 70.2, roadIndexX3: 61.0, humanDevelopmentIndexX4: 72.5, cluster: 2, coordinates: { x: 145, y: 200 } },
    { provinceCode: '16', provinceName: 'Sumatera Selatan', availabilityRateY: 82.4, pharmacistRatioX1: 0.53, accreditationRateX2: 72.8, roadIndexX3: 63.5, humanDevelopmentIndexX4: 73.2, cluster: 2, coordinates: { x: 165, y: 225 } },
    { provinceCode: '17', provinceName: 'Bengkulu', availabilityRateY: 79.8, pharmacistRatioX1: 0.46, accreditationRateX2: 69.5, roadIndexX3: 60.2, humanDevelopmentIndexX4: 72.0, cluster: 2, coordinates: { x: 140, y: 235 } },
    { provinceCode: '18', provinceName: 'Lampung', availabilityRateY: 81.2, pharmacistRatioX1: 0.50, accreditationRateX2: 71.1, roadIndexX3: 62.0, humanDevelopmentIndexX4: 72.8, cluster: 2, coordinates: { x: 180, y: 260 } },
    { provinceCode: '19', provinceName: 'Bangka Belitung', availabilityRateY: 82.8, pharmacistRatioX1: 0.54, accreditationRateX2: 73.0, roadIndexX3: 64.5, humanDevelopmentIndexX4: 73.8, cluster: 2, coordinates: { x: 190, y: 215 } },
    { provinceCode: '61', provinceName: 'Kalimantan Barat', availabilityRateY: 78.5, pharmacistRatioX1: 0.44, accreditationRateX2: 68.0, roadIndexX3: 58.5, humanDevelopmentIndexX4: 71.2, cluster: 2, coordinates: { x: 240, y: 175 } },
    { provinceCode: '62', provinceName: 'Kalimantan Tengah', availabilityRateY: 79.2, pharmacistRatioX1: 0.45, accreditationRateX2: 68.8, roadIndexX3: 59.2, humanDevelopmentIndexX4: 71.8, cluster: 2, coordinates: { x: 275, y: 195 } },
    { provinceCode: '63', provinceName: 'Kalimantan Selatan', availabilityRateY: 83.0, pharmacistRatioX1: 0.56, accreditationRateX2: 73.8, roadIndexX3: 65.0, humanDevelopmentIndexX4: 74.2, cluster: 2, coordinates: { x: 305, y: 215 } },
    { provinceCode: '64', provinceName: 'Kalimantan Timur', availabilityRateY: 84.2, pharmacistRatioX1: 0.58, accreditationRateX2: 75.0, roadIndexX3: 66.8, humanDevelopmentIndexX4: 77.5, cluster: 2, coordinates: { x: 325, y: 165 } },
    { provinceCode: '71', provinceName: 'Sulawesi Utara', availabilityRateY: 82.0, pharmacistRatioX1: 0.52, accreditationRateX2: 72.5, roadIndexX3: 63.0, humanDevelopmentIndexX4: 74.0, cluster: 2, coordinates: { x: 410, y: 120 } },
    { provinceCode: '72', provinceName: 'Sulawesi Tengah', availabilityRateY: 78.8, pharmacistRatioX1: 0.44, accreditationRateX2: 68.2, roadIndexX3: 58.8, humanDevelopmentIndexX4: 71.5, cluster: 2, coordinates: { x: 385, y: 165 } },
    { provinceCode: '73', provinceName: 'Sulawesi Selatan', availabilityRateY: 83.8, pharmacistRatioX1: 0.57, accreditationRateX2: 74.2, roadIndexX3: 65.8, humanDevelopmentIndexX4: 74.5, cluster: 2, coordinates: { x: 375, y: 230 } },
    { provinceCode: '74', provinceName: 'Sulawesi Tenggara', availabilityRateY: 79.5, pharmacistRatioX1: 0.46, accreditationRateX2: 69.0, roadIndexX3: 59.8, humanDevelopmentIndexX4: 72.2, cluster: 2, coordinates: { x: 410, y: 210 } },
    { provinceCode: '75', provinceName: 'Gorontalo', availabilityRateY: 81.0, pharmacistRatioX1: 0.49, accreditationRateX2: 70.8, roadIndexX3: 61.5, humanDevelopmentIndexX4: 72.5, cluster: 2, coordinates: { x: 390, y: 135 } },
    { provinceCode: '76', provinceName: 'Sulawesi Barat', availabilityRateY: 77.9, pharmacistRatioX1: 0.42, accreditationRateX2: 67.5, roadIndexX3: 57.5, humanDevelopmentIndexX4: 70.8, cluster: 2, coordinates: { x: 360, y: 200 } },
    { provinceCode: '52', provinceName: 'Nusa Tenggara Barat', availabilityRateY: 80.8, pharmacistRatioX1: 0.48, accreditationRateX2: 70.5, roadIndexX3: 61.2, humanDevelopmentIndexX4: 72.4, cluster: 2, coordinates: { x: 385, y: 310 } },

    // Cluster III (Ketahanan Rendah - 6 Provinsi Terpencil/Kepulauan)
    { provinceCode: '53', provinceName: 'Nusa Tenggara Timur', availabilityRateY: 64.5, pharmacistRatioX1: 0.28, accreditationRateX2: 56.0, roadIndexX3: 52.0, humanDevelopmentIndexX4: 67.5, cluster: 3, coordinates: { x: 430, y: 315 } },
    { provinceCode: '81', provinceName: 'Maluku', availabilityRateY: 63.2, pharmacistRatioX1: 0.27, accreditationRateX2: 55.2, roadIndexX3: 51.2, humanDevelopmentIndexX4: 66.8, cluster: 3, coordinates: { x: 475, y: 215 } },
    { provinceCode: '82', provinceName: 'Maluku Utara', availabilityRateY: 62.8, pharmacistRatioX1: 0.26, accreditationRateX2: 54.8, roadIndexX3: 50.8, humanDevelopmentIndexX4: 66.5, cluster: 3, coordinates: { x: 465, y: 145 } },
    { provinceCode: '91', provinceName: 'Papua Barat', availabilityRateY: 61.5, pharmacistRatioX1: 0.25, accreditationRateX2: 53.5, roadIndexX3: 49.5, humanDevelopmentIndexX4: 65.8, cluster: 3, coordinates: { x: 535, y: 195 } },
    { provinceCode: '92', provinceName: 'Papua', availabilityRateY: 60.1, pharmacistRatioX1: 0.24, accreditationRateX2: 52.8, roadIndexX3: 48.5, humanDevelopmentIndexX4: 64.9, cluster: 3, coordinates: { x: 595, y: 215 } },
    { provinceCode: '65', provinceName: 'Kalimantan Utara', availabilityRateY: 60.5, pharmacistRatioX1: 0.25, accreditationRateX2: 56.5, roadIndexX3: 50.0, humanDevelopmentIndexX4: 66.3, cluster: 3, coordinates: { x: 325, y: 125 } }
  ];

  async getAllProvinces(): Promise<ProvinceIndicatorEntity[]> {
    return this.provinces;
  }

  async getProvincesByCluster(clusterId: number): Promise<ProvinceIndicatorEntity[]> {
    return this.provinces.filter(p => p.cluster === clusterId);
  }
}
