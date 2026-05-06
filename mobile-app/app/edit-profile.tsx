import React, { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { ControlledProfilePhotoUpload } from "@/components/profile/ControlledProfilePhotoUpload";
import { ProfileSectionCard } from "@/components/profile/ProfileSectionCard";
import { VisibilityToggle } from "@/components/profile/VisibilityToggle";
import { AppScreenScaffold } from "@/components/ui/AppScreenScaffold";
import { Button } from "@/components/ui/Button";
import { ControlledInput } from "@/components/ui/ControlledInput";
import { ControlledNotificationChannel } from "@/components/ui/ControlledNotificationChannel";
import { ControlledSwitch } from "@/components/ui/ControlledSwitch";
import { Typography } from "@/components/ui/Typography";
import {
  editProfileDefaults,
  notificationChannelOptions,
} from "@/constants/editProfile";
import {
  useProfileQuery,
  useUpdateProfileMutation,
} from "@/data/hooks/profile";
import {
  editProfileSchema,
  type EditProfileFormValues,
} from "@/utils/validations/editProfileSchema";

interface ContactInputRowProps {
  children: React.ReactNode;
  isPublic: boolean;
  onTogglePublic: (value: boolean) => void;
}

function ContactInputRow({
  children,
  isPublic,
  onTogglePublic,
}: ContactInputRowProps) {
  return (
    <View className="flex-row items-start gap-3">
      <View className="flex-1">{children}</View>
      <View className="pt-[26px]">
        <VisibilityToggle
          isPublic={isPublic}
          onPress={() => onTogglePublic(!isPublic)}
        />
      </View>
    </View>
  );
}

export default function EditProfileScreen() {
  const router = useRouter();
  const profileQuery = useProfileQuery();
  const updateProfileMutation = useUpdateProfileMutation();
  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
    watch,
***REMOVED*** = useForm<EditProfileFormValues>({
    defaultValues: editProfileDefaults,
    resolver: zodResolver(editProfileSchema),
***REMOVED***);

  useEffect(() => {
    if (profileQuery.data === undefined) {
      return;
  ***REMOVED***

    reset({
      ...editProfileDefaults,
      city: profileQuery.data.city,
      country: profileQuery.data.country,
      email: profileQuery.data.email,
      notificationChannel: profileQuery.data.notificationChannelPreference,
      phoneNumber: profileQuery.data.phoneNumber,
      socialNetwork: profileQuery.data.socialNetwork,
      userPhotoUrl: profileQuery.data.userPhotoUrl,
      userName: profileQuery.data.userName,
  ***REMOVED***);
***REMOVED***, [profileQuery.data, reset]);

  const isPhonePublic = watch("isPhonePublic");
  const isSocialPublic = watch("isSocialPublic");

  const handleSavePress = async (
    values: EditProfileFormValues,
  ): Promise<void> => {
    await updateProfileMutation.mutateAsync({
      phoneNumber: values.phoneNumber.trim(),
      socialNetwork: values.socialNetwork.trim(),
      userPhotoUrl: values.userPhotoUrl.trim(),
      country: values.country.trim(),
      city: values.city.trim(),
      notificationChannelPreference: values.notificationChannel,
  ***REMOVED***);
    router.back();
***REMOVED***;

  return (
    <AppScreenScaffold
      contentClassName="bg-background"
      header={
        <View className="flex-row items-center justify-between py-4">
          <TouchableOpacity
            className="h-10 w-10 items-center justify-center rounded-full bg-white"
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={20} color="#1E1E1E" />
          </TouchableOpacity>
          <Typography variant="title-medium">Edit Profile</Typography>
          <TouchableOpacity
            disabled={updateProfileMutation.isPending}
            onPress={handleSubmit(handleSavePress)}
          >
            <Typography
              variant="body-regular"
              className="font-semibold text-heading-text"
            >
              Save
            </Typography>
          </TouchableOpacity>
        </View>
    ***REMOVED***
      scrollContentClassName="pb-10"
    >
      <View className=" items-center">
        <ControlledProfilePhotoUpload
          control={control}
          label="Tap to change photo"
          name="userPhotoUrl"
        />
      </View>

      <View className="mt-6">
        <ProfileSectionCard title="Basic info">
          <View className="gap-4 pt-2">
            <ControlledInput
              autoCapitalize="none"
              autoCorrect={false}
              control={control}
              errorText={errors.userName?.message}
              label="Username"
              placeholder="@username"
              name="userName"
            />

            <ControlledInput
              control={control}
              editable={false}
              errorText={errors.email?.message}
              helperText="Email cannot be changed"
              keyboardType="email-address"
              label="Email"
              name="email"
              placeholder="email@gmail.com"
            />
          </View>
        </ProfileSectionCard>
      </View>

      <View className="mt-4">
        <ProfileSectionCard title="Contact">
          <View className="gap-2 pt-2">
            <ContactInputRow
              isPublic={isPhonePublic}
              onTogglePublic={(v) => setValue("isPhonePublic", v)}
            >
              <ControlledInput
                control={control}
                errorText={errors.phoneNumber?.message}
                keyboardType="phone-pad"
                label="Phone"
                placeholder="+38 (099) 123-45-67"
                name="phoneNumber"
              />
            </ContactInputRow>

            <ContactInputRow
              isPublic={isSocialPublic}
              onTogglePublic={(v) => setValue("isSocialPublic", v)}
            >
              <ControlledInput
                autoCapitalize="none"
                autoCorrect={false}
                control={control}
                errorText={errors.socialNetwork?.message}
                label="Telegram link"
                placeholder="@yoursocialmedia"
                name="socialNetwork"
              />
            </ContactInputRow>
          </View>
        </ProfileSectionCard>
      </View>

      <View className="mt-4">
        <ProfileSectionCard title="Location">
          <View className="gap-4 pt-2">
            <ControlledInput
              control={control}
              errorText={errors.country?.message}
              label="Country"
              placeholder="Ukraine"
              name="country"
            />

            <ControlledInput
              control={control}
              errorText={errors.city?.message}
              label="City"
              placeholder="Kharkiv"
              name="city"
            />

            <Button
              fullWidth
              label="Update my current location"
              variant="primary"
              size="md"
              onPress={() => {}}
            />
          </View>
        </ProfileSectionCard>
      </View>

      <View className="mt-4">
        <ProfileSectionCard title="Notifications">
          <View className="gap-4 pt-2">
            <ControlledSwitch
              control={control}
              name="isMatchFoundEnabled"
              title="Match found"
            />

            <ControlledSwitch
              control={control}
              name="isNewCommentEnabled"
              title="New comment"
            />

            <ControlledSwitch
              control={control}
              name="isNearbyPostsEnabled"
              title="Nearby posts"
            />

            <ControlledNotificationChannel
              control={control}
              name="notificationChannel"
              options={notificationChannelOptions}
            />
          </View>
        </ProfileSectionCard>
      </View>

      <View className="mt-6">
        <Button
          fullWidth
          label="Change password"
          variant="outline"
          size="md"
          onPress={() => {}}
        />
      </View>
    </AppScreenScaffold>
  );
}
