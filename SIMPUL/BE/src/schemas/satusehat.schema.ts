import { z } from 'zod';

export const SatusehatDispenseEventSchema = z.object({
  resourceType: z.literal('MedicationDispense'),
  satusehatId: z.string().min(3),
  facilitySatusehatCode: z.string().min(3),
  facilityName: z.string().optional().default('Puskesmas Bojongsoang'),
  kfaCode: z.string().min(5),
  medicineName: z.string().optional().default('Oksitosin Injeksi 10 UI/mL'),
  quantityDispensed: z.number().int().positive(),
  dispensedTimestamp: z.string()
});

export type SatusehatDispenseEventInput = z.infer<typeof SatusehatDispenseEventSchema>;
