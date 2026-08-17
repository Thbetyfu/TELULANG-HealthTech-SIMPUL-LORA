import { StockEntity, DiscrepancyAuditEntity } from '../models/stock.model';

export class StockRepository {
  // In-Memory fallback store for initial setup until Prisma DB connection string is initialized
  private stocks: Map<string, StockEntity> = new Map();
  private audits: Map<string, DiscrepancyAuditEntity> = new Map();

  async findByFacilityAndKfa(facilityId: string, kfaCode: string): Promise<StockEntity | null> {
    for (const stock of this.stocks.values()) {
      if (stock.facilityId === facilityId && stock.kfaCode === kfaCode) {
        return stock;
      }
    }
    return null;
  }

  async saveStock(stock: StockEntity): Promise<StockEntity> {
    this.stocks.set(stock.id, stock);
    return stock;
  }

  async createDiscrepancyAudit(audit: DiscrepancyAuditEntity): Promise<DiscrepancyAuditEntity> {
    this.audits.set(audit.id, audit);
    return audit;
  }

  async findAllDiscrepancies(): Promise<DiscrepancyAuditEntity[]> {
    return Array.from(this.audits.values()).filter(a => a.status === 'OPEN');
  }
}
