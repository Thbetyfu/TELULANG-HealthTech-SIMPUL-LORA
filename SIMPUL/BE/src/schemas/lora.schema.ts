import { z } from 'zod';

export const submitPodSchema = z.object({
  taskId: z.string().min(1, 'Task ID wajib diisi'),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  signatureTte: z.string().min(10, 'Tanda tangan TTE wajib diisi')
});

export type SubmitPodInput = z.infer<typeof submitPodSchema>;
