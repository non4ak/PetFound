import React from "react";
import { TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";

import { ProfileSectionCard } from "@/components/profile/ProfileSectionCard";
import { VisibilityToggle } from "@/components/profile/VisibilityToggle";
import { AppScreenScaffold } from "@/components/ui/AppScreenScaffold";
import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";
import { useLogoutMutation } from "@/data/hooks/auth";
import { useMyPetsQuery } from "@/data/hooks/pets";
import { useProfileQuery } from "@/data/hooks/profile";
import { useAuth } from "@/contexts/AuthContext";
import { isUnauthorizedApiError } from "@/utils/apiError";
import type { Pet } from "@/types/pet";

interface ContactInfoRowProps {
  isPublic: boolean;
  label: string;
  value: string;
}

function ProfileVisibilityPill({ isPublic }: { isPublic: boolean }) {
  return <VisibilityToggle isPublic={isPublic} />;
}

function getProfileText(value: string): string {
  return value.trim().length > 0 ? value : "Not provided";
}

function getLocationText(city: string, country: string): string {
  const locationParts: string[] = [city.trim(), country.trim()].filter(
    (part: string) => part.length > 0,
  );

  return locationParts.length > 0 ? locationParts.join(", ") : "Not provided";
}

function ContactInfoRow({ isPublic, label, value }: ContactInfoRowProps) {
  return (
    <View className="flex-row items-start justify-between gap-4 py-4">
      <View className="flex-1">
        <Typography
          variant="body-small"
          className="text-[17px] leading-[21px] text-secondary-text"
        >
          {label}
        </Typography>
        <Typography
          variant="body-regular"
          className="mt-1.5 font-medium text-heading-text"
        >
          {value}
        </Typography>
      </View>
      <ProfileVisibilityPill isPublic={isPublic} />
    </View>
  );
}

export default function ProfileScreen() {
  const auth = useAuth();
  const { user } = auth;
  const router = useRouter();
  const logoutMutation = useLogoutMutation();
  const profileQuery = useProfileQuery();
  const petsQuery = useMyPetsQuery();
  const profile = profileQuery.data;
  const pets = petsQuery.data ?? [];

  const handleLogoutPress = async (): Promise<void> => {
    try {
      await logoutMutation.mutateAsync();
    } catch (error) {
      if (!isUnauthorizedApiError(error)) {
        throw error;
      }
    }

    await auth.logout();
  };

  return (
    <AppScreenScaffold
      contentClassName="bg-background"
      header={
        <View className="flex-row items-center justify-between py-6 px-4">
          <Typography variant="title-large">Profile</Typography>
          <TouchableOpacity
            className="rounded-[10px] border border-[#BDBDBD] bg-white px-4 py-2"
            onPress={() => router.push("/edit-profile")}
          >
            <Typography variant="body-small" className="text-heading-text">
              Edit profile
            </Typography>
          </TouchableOpacity>
        </View>
      }
      scrollContentClassName="pb-10"
    >
      <View className="rounded-lg bg-white px-6 py-12">
        <View className="flex-row items-center gap-5">
          <View className="flex-1 items-center justify-center">
            <View className="h-[80px] w-[80px] items-center justify-center overflow-hidden rounded-full border-2 border-primary">
              {profile?.userPhotoUrl !== undefined && profile.userPhotoUrl.trim().length > 0 ? (
                <Image
                  source={{ uri: profile.userPhotoUrl }}
                  style={{ height: 80, width: 80 }}
                  contentFit="cover"
                />
              ) : (
                <Ionicons name="person-outline" size={22} color="#D89F35" />
              )}
            </View>
          </View>

          <View className="flex-1">
            <Typography
              variant="title-small"
              className="font-semibold text-heading-text"
            >
              {profile?.userName ?? user?.userName ?? "user1"}
            </Typography>
            <Typography
              variant="body-small"
              className="mt-1 text-secondary-text"
            >
              {profile?.email ?? user?.email ?? "email@gmail.com"}
            </Typography>
          </View>
        </View>
      </View>

      <View className="mt-4">
        <ProfileSectionCard title="Contact info">
          <ContactInfoRow
            isPublic
            label="Phone"
            value={getProfileText(profile?.phoneNumber ?? "")}
          />
          <ContactInfoRow
            isPublic
            label="Social media link"
            value={getProfileText(profile?.socialNetwork ?? "")}
          />
          <View className="py-4">
            <Typography
              variant="body-small"
              className="text-[17px] leading-[21px] text-secondary-text"
            >
              Location
            </Typography>
            <Typography
              variant="body-regular"
              className="mt-1.5 font-medium text-heading-text"
            >
              {getLocationText(profile?.city ?? "", profile?.country ?? "")}
            </Typography>
          </View>
        </ProfileSectionCard>
      </View>

      <View className="mt-4">
        <ProfileSectionCard
          title="My pets"
          headerAction={
            <TouchableOpacity onPress={() => router.push("/create-pet")}>
              <Typography
                variant="body-small"
                className="font-semibold text-primary"
              >
                + Add
              </Typography>
            </TouchableOpacity>
          }
        >
          <View className="pt-3 gap-3">
            {pets.length === 0 ? (
              <Typography variant="body-small" className="text-secondary-text py-2">
                No pets added yet.
              </Typography>
            ) : (
              pets.map((pet: Pet) => (
                <TouchableOpacity
                  key={pet.id}
                  activeOpacity={0.85}
                  className="flex-row items-center rounded-[12px] border border-[#BFC9D6] bg-[#EEF4FB] px-4 py-4"
                  onPress={() => router.push(`/view-pet/${pet.id}`)}
                >
                  <View className="h-10 w-10 items-center justify-center rounded-[8px] border border-primary bg-[#FFF5E3]">
                    <Ionicons name="paw-outline" size={18} color="#D89F35" />
                  </View>

                  <View className="ml-4 flex-1">
                    <Typography
                      variant="body-medium"
                      className="font-semibold text-heading-text"
                    >
                      {pet.petName}
                    </Typography>
                    <Typography
                      variant="body-small"
                      className="mt-0.5 text-secondary-text"
                    >
                      {[pet.breed ?? pet.petTypeLabel, pet.petSexLabel, pet.petSizeLabel]
                        .filter(Boolean)
                        .join(" · ")}
                    </Typography>
                    {pet.chipNumber !== null && pet.chipNumber.length > 0 && (
                      <Typography
                        variant="body-small"
                        className="mt-0.5 font-semibold text-primary"
                      >
                        Chipped
                      </Typography>
                    )}
                  </View>

                  <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
                </TouchableOpacity>
              ))
            )}
          </View>
        </ProfileSectionCard>
      </View>

      <View className="mt-6">
        <Button
          disabled={logoutMutation.isPending}
          fullWidth
          label="Log out"
          onPress={handleLogoutPress}
          size="md"
          variant="outline"
        />
      </View>
    </AppScreenScaffold>
  );
}
