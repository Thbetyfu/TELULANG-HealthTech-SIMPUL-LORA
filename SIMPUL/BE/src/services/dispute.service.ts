import { DisputeRepository } from '../repositories/dispute.repository';
import { CreateDisputeInput } from '../schemas/dispute.schema';
import { DisputeReportEntity } from '../models/dispute.model';

export class DisputeService {
  constructor(private disputeRepo: DisputeRepository) {}

  async submitDispute(input: CreateDisputeInput): Promise<DisputeReportEntity> {
    return this.disputeRepo.create(input.puskesmasName, input.disputeNotes, input.provinceName);
  }

  async getDisputes(): Promise<DisputeReportEntity[]> {
    return this.disputeRepo.getAll();
  }
}
