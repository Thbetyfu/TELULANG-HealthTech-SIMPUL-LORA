import { z } from 'zod';

export const createDisputeSchema = z.object({
  puskesmasName: z.string().min(3, 'Nama Puskesmas minimal 3 karakter'),
  provinceName: z.string().optional(),
  disputeNotes: z.string().min(5, 'Catatan pengaduan minimal 5 karakter')
});

export type CreateDisputeInput = z.infer<typeof createDisputeSchema>;
