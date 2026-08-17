import { z } from 'zod';

export const ClusterQuerySchema = z.object({
  clusterId: z.string().optional(),
  year: z.string().optional()
});

export const OLSPredictionInputSchema = z.object({
  pharmacistRatioX1: z.number().min(0).max(5),
  accreditationRateX2: z.number().min(0).max(100).optional().default(75),
  roadIndexX3: z.number().min(0).max(100).optional().default(65),
  humanDevelopmentIndexX4: z.number().min(0).max(100).optional().default(72)
});

export type ClusterQueryInput = z.infer<typeof ClusterQuerySchema>;
export type OLSPredictionInput = z.infer<typeof OLSPredictionInputSchema>;
