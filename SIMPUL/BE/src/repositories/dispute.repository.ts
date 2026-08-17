import { DisputeReportEntity } from '../models/dispute.model';
import { v4 as uuidv4 } from 'uuid';

export class DisputeRepository {
  private disputes: DisputeReportEntity[] = [
    {
      id: 'DISP-001',
      puskesmasName: 'Pustu Desa Cihawuk',
      provinceName: 'Jawa Barat',
      disputeNotes: 'Stok OAT Lini 2 dilaporkan kosong saat pasien mencari obat MDR-TB.',
      status: 'PENDING_INSPECTION',
      createdAt: new Date().toISOString()
    }
  ];

  async create(puskesmasName: string, disputeNotes: string, provinceName?: string): Promise<DisputeReportEntity> {
    const newDispute: DisputeReportEntity = {
      id: `DISP-${uuidv4().substring(0, 8)}`,
      puskesmasName,
      provinceName: provinceName || 'Jawa Barat',
      disputeNotes,
      status: 'PENDING_INSPECTION',
      createdAt: new Date().toISOString()
    };
    this.disputes.unshift(newDispute);
    return newDispute;
  }

  async getAll(): Promise<DisputeReportEntity[]> {
    return this.disputes;
  }
}
