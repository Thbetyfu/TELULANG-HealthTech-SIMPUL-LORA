import { v4 as uuidv4 } from 'uuid';
import { StockRepository } from '../repositories/stock.repository';
import { StockEntity, DiscrepancyAuditEntity } from '../models/stock.model';
import { CreateStockReconciliationInput } from '../schemas/stock.schema';

export class StockReconciliationService {
  constructor(private stockRepository: StockRepository) {}

  async processReconciliation(input: CreateStockReconciliationInput): Promise<{
    stock: StockEntity;
    discrepancyAudit: DiscrepancyAuditEntity | null;
  }> {
    let stock = await this.stockRepository.findByFacilityAndKfa(input.facilityId, input.kfaCode);

    if (!stock) {
      stock = {
        id: uuidv4(),
        facilityId: input.facilityId,
        kfaCode: input.kfaCode,
        medicineName: 'Obat Esensial KFA ' + input.kfaCode,
        stockQty: input.actualPhysicalQty,
        bufferThreshold: 50,
        expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        lastSyncedAt: new Date()
      };
    } else {
      stock.stockQty = input.actualPhysicalQty;
      stock.lastSyncedAt = new Date();
    }

    await this.stockRepository.saveStock(stock);

    // Calculate Discrepancy Percentage
    const diff = Math.abs(input.reportedSystemQty - input.actualPhysicalQty);
    const maxQty = Math.max(input.reportedSystemQty, 1);
    const discrepancyPct = Number(((diff / maxQty) * 100).toFixed(2));

    let discrepancyAudit: DiscrepancyAuditEntity | null = null;

    // Trigger Audit Alarm if Discrepancy exceeds 2.0%
    if (discrepancyPct > 2.0) {
      discrepancyAudit = {
        id: uuidv4(),
        stockId: stock.id,
        reportedSystemQty: input.reportedSystemQty,
        actualPhysicalQty: input.actualPhysicalQty,
        discrepancyPct,
        status: 'OPEN',
        flaggedAt: new Date()
      };
      await this.stockRepository.createDiscrepancyAudit(discrepancyAudit);
    }

    return { stock, discrepancyAudit };
  }

  async getActiveDiscrepancies(): Promise<DiscrepancyAuditEntity[]> {
    return this.stockRepository.findAllDiscrepancies();
  }
}
