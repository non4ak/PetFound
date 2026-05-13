import {
  AnnouncementPetStatus,
  type AnnouncementDetails,
  type CreateAnnouncementRequest,
} from "@/types/announcement";
import type { FoundPetInfo } from "@/types/found-pet";
import type { RegisteredPetCard } from "@/types/lost-pet";
import type {
  OnboardingPetSex,
  OnboardingPetSize,
  OnboardingPetType,
} from "@/types/onboarding";
import { toAnnouncementDateTimeOffset } from "@/utils/announcementDate";
import {
  getPetSexLabel,
  getPetSizeLabel,
  getPetTypeLabel,
} from "@/utils/petLabels";

const DEFAULT_APPROXIMATE_TIME: string = "Unknown";
const DEFAULT_PET_DETAILS: string = "No additional details provided.";
export const FOUND_PET_PREVIEW_TITLE: string = "Found pet";

interface AnnouncementPreviewBadgeSource {
  breed: string;
  petSex: OnboardingPetSex | null;
  petSize: OnboardingPetSize | null;
  petType: OnboardingPetType | null;
}

function getTrimmedValue(value: string): string | null {
  const trimmedValue: string = value.trim();

  if (trimmedValue.length === 0) {
    return null;
***REMOVED***

  return trimmedValue;
}

function createBaseAnnouncementRequest(
  details: AnnouncementDetails,
  petStatus: AnnouncementPetStatus,
): CreateAnnouncementRequest {
  return {
    approximateTime:
      getTrimmedValue(details.timeApproximate) ?? DEFAULT_APPROXIMATE_TIME,
    city: details.city.trim(),
    country: details.country.trim(),
    isPhonePublic: details.showPhone,
    isTelegramActive: details.showTelegram,
    lastDateWhenSeen: toAnnouncementDateTimeOffset(details.dateLastSeen),
    nearLandmark: details.city.trim(),
    petDetails: getTrimmedValue(details.description) ?? DEFAULT_PET_DETAILS,
    petStatus,
    ...(details.lastSeenLatitude !== null
      ? { lastSeenLatitude: details.lastSeenLatitude }
      : {}),
    ...(details.lastSeenLongitude !== null
      ? { lastSeenLongitude: details.lastSeenLongitude }
      : {}),
***REMOVED***;
}

export function createLostPetAnnouncementRequest(
  details: AnnouncementDetails,
  selectedPet: RegisteredPetCard,
): CreateAnnouncementRequest {
  return {
    ...createBaseAnnouncementRequest(details, AnnouncementPetStatus.Lost),
    petId: selectedPet.id,
***REMOVED***;
}

export function createFoundPetAnnouncementRequest(
  details: AnnouncementDetails,
  info: FoundPetInfo,
  photoUri: string | null,
): CreateAnnouncementRequest {
  const breed: string | null = getTrimmedValue(info.breed);
  const chipNumber: string | null = getTrimmedValue(info.chipNumber);
  const petPhotoUrl: string | null =
    photoUri === null ? null : getTrimmedValue(photoUri);

  return {
    ...createBaseAnnouncementRequest(details, AnnouncementPetStatus.Found),
    petName: FOUND_PET_PREVIEW_TITLE,
    ...(breed !== null ? { breed } : {}),
    ...(chipNumber !== null ? { chipNumber } : {}),
    ...(info.petAgeCategory !== null
      ? { petAgeCategory: info.petAgeCategory }
      : {}),
    ...(petPhotoUrl !== null ? { petPhotoUrl } : {}),
    ...(info.petSex !== null ? { petSex: info.petSex } : {}),
    ...(info.petSize !== null ? { petSize: info.petSize } : {}),
    ...(info.petType !== null ? { petType: info.petType } : {}),
***REMOVED***;
}

export function getAnnouncementPreviewBadges(
  source: AnnouncementPreviewBadgeSource,
): string[] {
  const badges: string[] = [getPetTypeLabel(source.petType)];
  const breed: string | null = getTrimmedValue(source.breed);
  const sexLabel: string | null = getPetSexLabel(source.petSex);
  const sizeLabel: string | null = getPetSizeLabel(source.petSize);

  if (breed !== null) {
    badges.push(breed);
***REMOVED***

  if (sexLabel !== null) {
    badges.push(sexLabel);
***REMOVED***

  if (sizeLabel !== null) {
    badges.push(sizeLabel);
***REMOVED***

  return badges;
}
