import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

import {
  type OnboardingDraft,
  type OnboardingLocationStepData,
  type OnboardingPetStepData,
  type OnboardingProfileStepData,
  type OnboardingStayInLoopStepData,
} from '@/types/onboarding';

interface OnboardingContextValue {
  clearOnboardingDraft: () => void;
  onboardingDraft: OnboardingDraft;
  clearPetStep: () => void;
  clearStayInLoopStep: () => void;
  saveLocationStep: (location: OnboardingLocationStepData) => void;
  savePetStep: (pet: OnboardingPetStepData) => void;
  saveProfileStep: (profile: OnboardingProfileStepData) => void;
  saveStayInLoopStep: (stayInLoop: OnboardingStayInLoopStepData) => void;
}

function createInitialOnboardingDraft(): OnboardingDraft {
  return {
    location: {
      city: '',
      country: '',
  ***REMOVED***,
    pet: null,
    profile: {
      isPhonePublic: true,
      phoneNumber: '',
      socialNetwork: '',
      userPhotoUrl: '',
      userName: '',
  ***REMOVED***,
    stayInLoop: null,
***REMOVED***;
}

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [onboardingDraft, setOnboardingDraft] = useState<OnboardingDraft>(createInitialOnboardingDraft);

  const clearOnboardingDraft = (): void => {
    setOnboardingDraft(createInitialOnboardingDraft());
***REMOVED***;

  const clearPetStep = (): void => {
    setOnboardingDraft((currentDraft: OnboardingDraft) => ({
      ...currentDraft,
      pet: null,
  ***REMOVED***));
***REMOVED***;

  const clearStayInLoopStep = (): void => {
    setOnboardingDraft((currentDraft: OnboardingDraft) => ({
      ...currentDraft,
      stayInLoop: null,
  ***REMOVED***));
***REMOVED***;

  const saveLocationStep = (location: OnboardingLocationStepData): void => {
    setOnboardingDraft((currentDraft: OnboardingDraft) => ({
      ...currentDraft,
      location,
  ***REMOVED***));
***REMOVED***;

  const savePetStep = (pet: OnboardingPetStepData): void => {
    setOnboardingDraft((currentDraft: OnboardingDraft) => ({
      ...currentDraft,
      pet,
  ***REMOVED***));
***REMOVED***;

  const saveProfileStep = (profile: OnboardingProfileStepData): void => {
    setOnboardingDraft((currentDraft: OnboardingDraft) => ({
      ...currentDraft,
      profile,
  ***REMOVED***));
***REMOVED***;

  const saveStayInLoopStep = (stayInLoop: OnboardingStayInLoopStepData): void => {
    setOnboardingDraft((currentDraft: OnboardingDraft) => ({
      ...currentDraft,
      stayInLoop,
  ***REMOVED***));
***REMOVED***;

  const value: OnboardingContextValue = useMemo(
    () => ({
      clearOnboardingDraft,
      clearPetStep,
      clearStayInLoopStep,
      onboardingDraft,
      saveLocationStep,
      savePetStep,
      saveProfileStep,
      saveStayInLoopStep,
  ***REMOVED***),
    [onboardingDraft],
  );

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
}

export function useOnboarding(): OnboardingContextValue {
  const context: OnboardingContextValue | null = useContext(OnboardingContext);

  if (context === null) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
***REMOVED***

  return context;
}
