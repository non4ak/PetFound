import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

import { useMyPetsQuery } from '@/data/hooks/pets';
import { formatCurrentAnnouncementDate } from '@/utils/announcementDate';
import type { Pet } from '@/types/pet';
import type {
  LostPetDetails,
  RegisteredPetCard,
} from '@/types/lost-pet';

interface LostPetFlowContextValue {
  details: LostPetDetails;
  isLoadingPets: boolean;
  registeredPets: RegisteredPetCard[];
  resetDraft: () => void;
  selectedPet: RegisteredPetCard | null;
  selectedPetId: number | null;
  selectPet: (petId: number) => void;
  updateDetails: (nextDetails: LostPetDetails) => void;
}

function petToRegisteredCard(pet: Pet): RegisteredPetCard {
  return {
    breed: pet.breed ?? '',
    id: pet.id,
    imageUrl: pet.petPhotoUrl ?? '',
    isChipped: !!pet.chipNumber && pet.chipNumber.length > 0,
    petName: pet.petName,
    petSex: pet.petSex,
    petSize: pet.petSize,
    petType: pet.petType,
***REMOVED***;
}

function createInitialDetails(): LostPetDetails {
  return {
    city: '',
    country: '',
    dateLastSeen: formatCurrentAnnouncementDate(),
    description: '',
    showPhone: true,
    showTelegram: true,
    timeApproximate: '',
***REMOVED***;
}

const LostPetFlowContext = createContext<LostPetFlowContextValue | null>(null);

export function LostPetFlowProvider({ children }: { children: ReactNode }) {
  const { data: pets, isLoading } = useMyPetsQuery();
  const registeredPets = (pets ?? []).map(petToRegisteredCard);

  const [details, setDetails] = useState<LostPetDetails>(createInitialDetails());
  const [selectedPetId, setSelectedPetId] = useState<number | null>(null);

  useEffect(() => {
    if (selectedPetId === null && registeredPets.length > 0) {
      setSelectedPetId(registeredPets[0].id);
  ***REMOVED***
***REMOVED***, [registeredPets.length]);

  const resetDraft = (): void => {
    setDetails(createInitialDetails());
    setSelectedPetId(registeredPets[0]?.id ?? null);
***REMOVED***;

  const selectedPet = registeredPets.find((p) => p.id === selectedPetId) ?? null;

  const value: LostPetFlowContextValue = {
    details,
    isLoadingPets: isLoading,
    registeredPets,
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
