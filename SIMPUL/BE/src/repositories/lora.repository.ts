import { LoraTaskEntity } from '../models/lora.model';

export class LoraRepository {
  private tasks: LoraTaskEntity[] = [
    {
      id: 'TASK-LORA-9981',
      sourceFacilityName: 'IFK Kabupaten Bandung',
      targetFacilityName: 'Pustu Desa Sukamaju',
      targetAddress: 'Kec. Bojongsoang, Kab. Bandung',
      medicineName: 'Oksitosin Injeksi 10 UI/mL',
      quantity: 50,
      requiresColdChain: true,
      isHardDrug: false,
      status: 'ASSIGNED',
      estimatedMinutes: 48.5,
      createdAt: new Date().toISOString()
    },
    {
      id: 'TASK-LORA-9982',
      sourceFacilityName: 'Puskesmas Bojongsoang',
      targetFacilityName: 'Pustu Desa Cihawuk',
      targetAddress: 'Kec. Kertasari (Terpencil)',
      medicineName: 'OAT Lini 2 (MDR-TB)',
      quantity: 20,
      requiresColdChain: false,
      isHardDrug: true,
      status: 'ASSIGNED',
      estimatedMinutes: 62.0,
      createdAt: new Date().toISOString()
    }
  ];

  async getAllTasks(): Promise<LoraTaskEntity[]> {
    return this.tasks;
  }

  async getTaskById(id: string): Promise<LoraTaskEntity | undefined> {
    return this.tasks.find(t => t.id === id);
  }

  async updatePod(id: string, signatureTte: string, latitude?: number, longitude?: number): Promise<LoraTaskEntity | null> {
    const task = this.tasks.find(t => t.id === id);
    if (!task) return null;

    task.status = 'DELIVERED';
    task.signatureTte = signatureTte;
    task.latitude = latitude;
    task.longitude = longitude;
    task.podTimestamp = new Date().toISOString();

    return task;
  }
}
