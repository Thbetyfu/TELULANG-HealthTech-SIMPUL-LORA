import { LoraRepository } from '../repositories/lora.repository';
import { LoraTaskEntity } from '../models/lora.model';

export interface RedistributionRecommendationItem {
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

export class RedistributionService {
  private recommendations: RedistributionRecommendationItem[] = [
    {
      id: 'REDIST-101',
      sourceFacilityName: 'IFK Kabupaten Bandung',
      sourceProvinceName: 'Jawa Barat (Cluster 1)',
      targetFacilityName: 'Pustu Desa Cihawuk',
      targetProvinceName: 'Jawa Barat (Cluster 2 - Terpencil)',
      medicineName: 'OAT Lini 2 (MDR-TB)',
      transferQuantity: 25,
      sourceStockAfterTransfer: 145,
      urgencyLevel: 'CRITICAL',
      estimatedMinutes: 62.0,
      status: 'PROPOSED'
    },
    {
      id: 'REDIST-102',
      sourceFacilityName: 'Gudang Farmasi DKI Jakarta',
      sourceProvinceName: 'DKI Jakarta (Cluster 1)',
      targetFacilityName: 'Puskesmas Jayawijaya',
      targetProvinceName: 'Papua (Cluster 3)',
      medicineName: 'Insulin Human Injeksi',
      transferQuantity: 50,
      sourceStockAfterTransfer: 320,
      urgencyLevel: 'HIGH',
      estimatedMinutes: 180.0,
      status: 'PROPOSED'
    }
  ];

  constructor(private loraRepo: LoraRepository) {}

  async getRecommendations(): Promise<RedistributionRecommendationItem[]> {
    return this.recommendations;
  }

  async dispatchRecommendation(id: string): Promise<{ recommendation: RedistributionRecommendationItem; task: LoraTaskEntity }> {
    const item = this.recommendations.find(r => r.id === id);
    if (!item) {
      throw new Error(`Rekomendasi redistribusi dengan ID ${id} tidak ditemukan.`);
    }

    item.status = 'DISPATCHED';

    // Create corresponding LORA Field Courier Task dynamically
    const newTask: LoraTaskEntity = {
      id: `TASK-LORA-${Date.now().toString().slice(-4)}`,
      sourceFacilityName: item.sourceFacilityName,
      targetFacilityName: item.targetFacilityName,
      targetAddress: item.targetProvinceName,
      medicineName: item.medicineName,
      quantity: item.transferQuantity,
      requiresColdChain: item.medicineName.toLowerCase().includes('insulin') || item.medicineName.toLowerCase().includes('oksitosin'),
      isHardDrug: item.medicineName.toLowerCase().includes('oat'),
      status: 'ASSIGNED',
      estimatedMinutes: item.estimatedMinutes,
      createdAt: new Date().toISOString()
    };

    const allTasks = await this.loraRepo.getAllTasks();
    allTasks.unshift(newTask);

    return {
      recommendation: item,
      task: newTask
    };
  }
}
