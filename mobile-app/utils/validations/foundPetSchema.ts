import { z } from "zod";
import { isValidAnnouncementDate } from "@/utils/announcementDate";

import {
  OnboardingPetAgeCategory,
  OnboardingPetSex,
  OnboardingPetSize,
  OnboardingPetType,
} from "@/types/onboarding";

const chipNumberPattern = /^\d{10,20}$/;

export const foundPetInfoSchema = z
  .object({
    breed: z.string().trim(),
    chipNumber: z
      .string()
      .trim()
      .refine(
        (value: string) =>
          value.length === 0 || chipNumberPattern.test(value),
        "Chip number must contain 10 to 20 digits"
      ),
    hasMicrochip: z.boolean(),
    petAgeCategory: z.nativeEnum(OnboardingPetAgeCategory).nullable(),
    petSex: z.nativeEnum(OnboardingPetSex).nullable(),
    petSize: z.nativeEnum(OnboardingPetSize).nullable(),
    petType: z.nativeEnum(OnboardingPetType).nullable(),
  })
  .superRefine((data, context) => {
    if (data.hasMicrochip && data.chipNumber.length === 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Chip number is required when microchip is enabled",
        path: ["chipNumber"],
      });
    }
  });

export const foundPetDetailsSchema = z.object({
  city: z.string().trim().min(2, "City is required"),
  country: z.string().trim().min(2, "Country is required"),
  dateLastSeen: z
    .string()
    .trim()
    .min(4, "Date is required")
    .refine(
      (value: string) => isValidAnnouncementDate(value),
      "Enter a valid date like 07.05.2026",
    ),
  description: z.string().trim(),
  showPhone: z.boolean(),
  showTelegram: z.boolean(),
  timeApproximate: z.string().trim(),
});

export type FoundPetInfoFormValues = z.infer<typeof foundPetInfoSchema>;
export type FoundPetDetailsFormValues = z.infer<typeof foundPetDetailsSchema>;
