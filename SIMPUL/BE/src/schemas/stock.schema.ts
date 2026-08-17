import { z } from 'zod';

export const CreateStockReconciliationSchema = z.object({
  facilityId: z.string().uuid({ message: 'Facility ID must be a valid UUID' }),
  kfaCode: z.string().min(5, { message: 'KFA Code must be at least 5 characters' }),
  reportedSystemQty: z.number().int().nonnegative({ message: 'System Qty cannot be negative' }),
  actualPhysicalQty: z.number().int().nonnegative({ message: 'Physical Qty cannot be negative' }),
  auditNotes: z.string().optional()
});

export const StockQuerySchema = z.object({
  facilityId: z.string().uuid().optional(),
  kfaCode: z.string().optional(),
  discrepancyOnly: z.enum(['true', 'false']).optional()
});

export type CreateStockReconciliationInput = z.infer<typeof CreateStockReconciliationSchema>;
export type StockQueryInput = z.infer<typeof StockQuerySchema>;
