import {
  MAP_DEFAULT_PET_IMAGE_URI,
  PET_MARKER_COLORS,
} from "../constants/map.constants";
import {
  AnnouncementPetStatus,
  type Announcement,
  type AnnouncementQueryFilter,
} from "../types/announcement";
import type {
  MapFilterChipVariant,
  PetMapMarkerData,
  PetMapMarkerType,
  PetTypeQueryValue,
} from "../types/map.types";
import { getMapTargetCoordinate } from "./mapTarget";

const DOG_PET_TYPE_QUERY_VALUE: PetTypeQueryValue = 0;
const CAT_PET_TYPE_QUERY_VALUE: PetTypeQueryValue = 1;

const STATUS_FILTERS: Readonly<Record<string, AnnouncementPetStatus>> = {
  found: AnnouncementPetStatus.Found,
  lost: AnnouncementPetStatus.Lost,
};

const PET_TYPE_FILTERS: Readonly<Record<string, PetTypeQueryValue>> = {
  cat: CAT_PET_TYPE_QUERY_VALUE,
  dog: DOG_PET_TYPE_QUERY_VALUE,
};

export function getFilterChipClassName(variant: MapFilterChipVariant): string {
  if (variant === "accent") {
    return "bg-primary";
  }

  return "bg-white";
}

export function getFilterChipTextColor(variant: MapFilterChipVariant): string {
  if (variant === "accent") {
    return "#0F172A";
  }

  return "#000000";
}

export function getPetMarkerColor(type: PetMapMarkerType): string {
  return PET_MARKER_COLORS[type];
}

export function getActiveMapFilterIds(
  query: AnnouncementQueryFilter,
): string[] {
  const activeFilterIds: string[] = [];

  Object.entries(STATUS_FILTERS).forEach(([filterId, petStatus]) => {
    if (query.petStatus === petStatus) {
      activeFilterIds.push(filterId);
    }
  });

  Object.entries(PET_TYPE_FILTERS).forEach(([filterId, petType]) => {
    if (query.petType === petType) {
      activeFilterIds.push(filterId);
    }
  });

  return activeFilterIds;
}

export function getNextMapFilterQuery(
  query: AnnouncementQueryFilter,
  filterId: string,
): AnnouncementQueryFilter {
  const petStatus: AnnouncementPetStatus | undefined =
    STATUS_FILTERS[filterId];

  if (petStatus !== undefined) {
    return {
      ...query,
      petStatus: query.petStatus === petStatus ? undefined : petStatus,
    };
  }

  const petType: PetTypeQueryValue | undefined = PET_TYPE_FILTERS[filterId];

  if (petType !== undefined) {
    return {
      ...query,
      petType: query.petType === petType ? undefined : petType,
    };
  }

  return query;
}

export function mapAnnouncementsToMarkers(
  announcements: Announcement[] | undefined,
): PetMapMarkerData[] {
  if (announcements === undefined) {
    return [];
  }

  return announcements.reduce<PetMapMarkerData[]>(
    (markers: PetMapMarkerData[], announcement: Announcement) => {
      const coordinate = getMapTargetCoordinate(
        announcement.lastSeenLatitude,
        announcement.lastSeenLongitude,
      );

      if (coordinate === null) {
        return markers;
      }

      markers.push({
        id: announcement.id,
        imageUri: announcement.petPhotoUrl?.startsWith("http")
          ? announcement.petPhotoUrl
          : MAP_DEFAULT_PET_IMAGE_URI,
        latitude: coordinate.latitude,
        longitude: coordinate.longitude,
        petId: announcement.petId,
        type:
          announcement.petStatus === AnnouncementPetStatus.Lost
            ? "lost"
            : "found",
      });

      return markers;
    },
    [],
  );
}
