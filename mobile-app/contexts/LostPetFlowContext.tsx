import React, { createContext, useContext, useState, type ReactNode } from 'react';

import {
  OnboardingPetSex,
  OnboardingPetSize,
  OnboardingPetType,
} from '@/types/onboarding';
import { formatCurrentAnnouncementDate } from '@/utils/announcementDate';
import type {
  LostPetDetails,
  RegisteredPetCard,
} from '@/types/lost-pet';

interface LostPetFlowContextValue {
  details: LostPetDetails;
  registeredPets: RegisteredPetCard[];
  resetDraft: () => void;
  selectedPet: RegisteredPetCard | null;
  selectedPetId: string | null;
  selectPet: (petId: string) => void;
  updateDetails: (nextDetails: LostPetDetails) => void;
}

const REGISTERED_PETS: RegisteredPetCard[] = [
  {
    breed: 'Labrador',
    id: 'buddy',
    imageUrl:
      'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=1200&q=80',
    isChipped: true,
    petName: 'Buddy',
    petSex: OnboardingPetSex.Male,
    petSize: OnboardingPetSize.Large,
    petType: OnboardingPetType.Dog,
***REMOVED***,
  {
    breed: 'Mixed',
    id: 'cat',
    imageUrl:
      'https://images.unsplash.com/photo-1511044568932-338cba0ad803?auto=format&fit=crop&w=1200&q=80',
    isChipped: false,
    petName: 'Cat',
    petSex: OnboardingPetSex.Female,
    petSize: OnboardingPetSize.Small,
    petType: OnboardingPetType.Cat,
***REMOVED***,
];

function createInitialDetails(): LostPetDetails {
  return {
    city: 'Kharkiv',
    country: 'Ukraine',
    dateLastSeen: formatCurrentAnnouncementDate(),
    description:
      'Distinctive markings, collar colour, last known behaviour, and anything else that can help identify your pet.',
    showPhone: true,
    showTelegram: true,
    timeApproximate: '14:00',
***REMOVED***;
}

const LostPetFlowContext = createContext<LostPetFlowContextValue | null>(null);

export function LostPetFlowProvider({ children }: { children: ReactNode }) {
  const [details, setDetails] = useState<LostPetDetails>(createInitialDetails());
  const [selectedPetId, setSelectedPetId] = useState<string | null>(REGISTERED_PETS[0]?.id ?? null);

  const resetDraft = (): void => {
    setDetails(createInitialDetails());
    setSelectedPetId(REGISTERED_PETS[0]?.id ?? null);
***REMOVED***;

  const selectedPet: RegisteredPetCard | null =
    REGISTERED_PETS.find((pet: RegisteredPetCard) => pet.id === selectedPetId) ?? null;

  const value: LostPetFlowContextValue = {
    details,
    registeredPets: REGISTERED_PETS,
    resetDraft,
    selectedPet,
    selectedPetId,
    selectPet: setSelectedPetId,
    updateDetails: setDetails,
***REMOVED***;

  return (
    <LostPetFlowContext.Provider value={value}>
      {children}
    </LostPetFlowContext.Provider>
  );
}

export function useLostPetFlow(): LostPetFlowContextValue {
  const context: LostPetFlowContextValue | null = useContext(LostPetFlowContext);

  if (context === null) {
    throw new Error('useLostPetFlow must be used within a LostPetFlowProvider');
***REMOVED***

  return context;
}
