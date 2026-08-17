import { LoraRepository } from '../repositories/lora.repository';
import { SubmitPodInput } from '../schemas/lora.schema';
import { LoraTaskEntity } from '../models/lora.model';

export class LoraService {
  constructor(private loraRepo: LoraRepository) {}

  async listTasks(): Promise<LoraTaskEntity[]> {
    return this.loraRepo.getAllTasks();
  }

  async submitPod(input: SubmitPodInput): Promise<LoraTaskEntity> {
    const updatedTask = await this.loraRepo.updatePod(input.taskId, input.signatureTte, input.latitude, input.longitude);
    if (!updatedTask) {
      throw new Error(`Tugas logistik LORA dengan ID ${input.taskId} tidak ditemukan.`);
    }
    return updatedTask;
  }
}
