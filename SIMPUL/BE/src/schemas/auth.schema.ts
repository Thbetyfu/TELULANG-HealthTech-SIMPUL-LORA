import { z } from 'zod';

export const LoginRequestSchema = z.object({
  identifier: z.string().min(1, 'NIP / ID wajib diisi'),
  password: z.string().optional().default(''),
  role: z.enum(['simpul', 'lora', 'public'])
});

export type LoginRequestInput = z.infer<typeof LoginRequestSchema>;
