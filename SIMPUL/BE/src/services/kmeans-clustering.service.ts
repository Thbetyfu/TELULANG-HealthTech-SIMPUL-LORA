import { ClusterRepository } from '../repositories/cluster.repository';
import { ClusterProfileEntity, ProvinceIndicatorEntity } from '../models/cluster.model';

export class KMeansClusteringService {
  constructor(private clusterRepository: ClusterRepository) {}

  async executeClustering(): Promise<ClusterProfileEntity[]> {
    const provinces = await this.clusterRepository.getAllProvinces();

    const cluster1 = provinces.filter(p => p.cluster === 1);
    const cluster2 = provinces.filter(p => p.cluster === 2);
    const cluster3 = provinces.filter(p => p.cluster === 3);

    return [
      this.calculateClusterProfile(1, 'Klaster I (Ketahanan Tinggi)', 'Wilayah perkotaan dengan ketersediaan obat dan rasio apoteker tinggi', cluster1),
      this.calculateClusterProfile(2, 'Klaster II (Ketahanan Sedang)', 'Wilayah berkembang dengan ketersediaan obat sedang', cluster2),
      this.calculateClusterProfile(3, 'Klaster III (Ketahanan Rendah)', 'Wilayah terpencil/kepulauan rentan dengan keterbatasan apoteker dan akses jalan', cluster3)
    ];
  }

  private calculateClusterProfile(
    clusterId: number,
    name: string,
    description: string,
    provinces: ProvinceIndicatorEntity[]
  ): ClusterProfileEntity {
    const count = provinces.length || 1;
    const sumY = provinces.reduce((acc, p) => acc + p.availabilityRateY, 0);
    const sumX1 = provinces.reduce((acc, p) => acc + p.pharmacistRatioX1, 0);
    const sumX2 = provinces.reduce((acc, p) => acc + p.accreditationRateX2, 0);
    const sumX3 = provinces.reduce((acc, p) => acc + p.roadIndexX3, 0);
    const sumX4 = provinces.reduce((acc, p) => acc + p.humanDevelopmentIndexX4, 0);

    return {
      clusterId,
      name,
      description,
      provinceCount: provinces.length,
      meanAvailabilityY: Number((sumY / count).toFixed(1)),
      meanPharmacistRatioX1: Number((sumX1 / count).toFixed(2)),
      meanAccreditationX2: Number((sumX2 / count).toFixed(1)),
      meanRoadIndexX3: Number((sumX3 / count).toFixed(1)),
      meanHdiX4: Number((sumX4 / count).toFixed(1))
    };
  }
}
