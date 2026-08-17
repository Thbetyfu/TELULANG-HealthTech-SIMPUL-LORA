export interface StockEntity {
  id: string;
  facilityId: string;
  kfaCode: string;
  medicineName: string;
  stockQty: number;
  bufferThreshold: number;
  expirationDate: Date;
  lastSyncedAt: Date;
}

export interface DiscrepancyAuditEntity {
  id: string;
  stockId: string;
  reportedSystemQty: number;
  actualPhysicalQty: number;
  discrepancyPct: number;
  status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED' | 'FALSE_ALARM';
  flaggedAt: Date;
}
