import { z } from 'zod';

export const lostPetDetailsSchema = z.object({
  city: z.string().trim().min(2, 'City is required'),
  country: z.string().trim().min(2, 'Country is required'),
  dateLastSeen: z.string().trim().min(4, 'Date last seen is required'),
  description: z.string().trim().min(10, 'Description must be at least 10 characters long'),
  showPhone: z.boolean(),
  showTelegram: z.boolean(),
  timeApproximate: z.string().trim(),
});

export type LostPetDetailsFormValues = z.infer<typeof lostPetDetailsSchema>;
