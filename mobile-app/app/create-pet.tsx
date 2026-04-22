import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { AppScreenScaffold } from '@/components/ui/AppScreenScaffold';
import { Button } from '@/components/ui/Button';
import { ControlledInput } from '@/components/ui/ControlledInput';
import {
  ControlledSelectChips,
  type SelectChipOption,
} from '@/components/ui/ControlledSelectChips';
import { ControlledSwitch } from '@/components/ui/ControlledSwitch';
import { Typography } from '@/components/ui/Typography';
import {
  OnboardingPetAgeCategory,
  OnboardingPetSex,
  OnboardingPetSize,
  OnboardingPetType,
} from '@/types/onboarding';
import {
  onboardingPetSchema,
  type OnboardingPetFormValues,
} from '@/utils/validations/onboardingSchema';

const PET_TYPE_OPTIONS: readonly SelectChipOption<OnboardingPetType>[] = [
  { label: 'Dog', value: OnboardingPetType.Dog },
  { label: 'Cat', value: OnboardingPetType.Cat },
  { label: 'Other', value: OnboardingPetType.Other },
];

const PET_SEX_OPTIONS: readonly SelectChipOption<OnboardingPetSex>[] = [
  { label: 'Male', value: OnboardingPetSex.Male },
  { label: 'Female', value: OnboardingPetSex.Female },
];

const PET_SIZE_OPTIONS: readonly SelectChipOption<OnboardingPetSize>[] = [
  { label: 'Small', value: OnboardingPetSize.Small },
  { label: 'Medium', value: OnboardingPetSize.Medium },
  { label: 'Large', value: OnboardingPetSize.Large },
];

const PET_AGE_OPTIONS: readonly SelectChipOption<OnboardingPetAgeCategory>[] = [
  { label: 'Young', value: OnboardingPetAgeCategory.Young },
  { label: 'Adult', value: OnboardingPetAgeCategory.Adult },
  { label: 'Senior', value: OnboardingPetAgeCategory.Senior },
];

export default function CreatePetScreen() {
  const router = useRouter();
  const {
    control,
    formState: { errors },
    handleSubmit,
    watch,
***REMOVED*** = useForm<OnboardingPetFormValues>({
    defaultValues: {
      breed: '',
      chipNumber: '',
      description: '',
      hasMicrochip: false,
      petAgeCategory: OnboardingPetAgeCategory.Adult,
      petName: '',
      petPhotoUrl: '',
      petSex: OnboardingPetSex.Male,
      petSize: OnboardingPetSize.Medium,
      petType: OnboardingPetType.Dog,
  ***REMOVED***,
    resolver: zodResolver(onboardingPetSchema),
***REMOVED***);
  const hasMicrochip: boolean = watch('hasMicrochip');

  const handleCreatePetPress = async (): Promise<void> => {
    router.back();
***REMOVED***;

  return (
    <AppScreenScaffold
      footer={
        <Button
          fullWidth
          label="Create pet"
          onPress={handleSubmit(handleCreatePetPress)}
          size="lg"
          variant="primary"
        />
    ***REMOVED***
      header={
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            className="h-11 w-11 items-center justify-center rounded-full bg-white"
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={22} color="#1E1E1E" />
          </TouchableOpacity>
          <Typography variant="title-medium">Add pet</Typography>
          <View className="w-11" />
        </View>
    ***REMOVED***
    >
      <View className="rounded-[28px] border border-[#F0E4C5] bg-white p-5">
        <View className="gap-5">
          <ControlledInput
            control={control}
            errorText={errors.petName?.message}
            label="Pet name"
            placeholder="Buddy"
            name="petName"
          />

          <ControlledSelectChips
            control={control}
            label="Pet type"
            name="petType"
            options={PET_TYPE_OPTIONS}
          />

          <ControlledSelectChips
            control={control}
            label="Sex"
            name="petSex"
            options={PET_SEX_OPTIONS}
          />

          <ControlledSelectChips
            control={control}
            label="Size"
            name="petSize"
            options={PET_SIZE_OPTIONS}
          />

          <ControlledSelectChips
            control={control}
            label="Age"
            name="petAgeCategory"
            options={PET_AGE_OPTIONS}
          />

          <ControlledInput
            control={control}
            errorText={errors.breed?.message}
            label="Breed"
            placeholder="Labrador"
            name="breed"
          />

          <ControlledSwitch
            control={control}
            description="Turn this on to save the pet's chip number."
            name="hasMicrochip"
            title="Has microchip"
          >
            {hasMicrochip ? (
              <ControlledInput
                control={control}
                errorText={errors.chipNumber?.message}
                keyboardType="number-pad"
                label="Chip number"
                placeholder="985112003456789"
                name="chipNumber"
              />
            ) : null}
          </ControlledSwitch>

          <ControlledInput
            autoCapitalize="none"
            autoCorrect={false}
            control={control}
            errorText={errors.petPhotoUrl?.message}
            isOptional
            keyboardType="url"
            label="Pet photo URL"
            placeholder="https://example.com/pet.jpg"
            name="petPhotoUrl"
          />

          <ControlledInput
            className="min-h-[120px] pt-4"
            containerClassName="pb-2"
            control={control}
            errorText={errors.description?.message}
            isOptional
            label="Description"
            multiline
            numberOfLines={4}
            placeholder="Friendly, wears a blue collar"
            textAlignVertical="top"
            name="description"
          />
        </View>
      </View>
    </AppScreenScaffold>
  );
}
