import { useMutation, type UseMutationResult } from '@tanstack/react-query';

import { submitOnboardingQuery } from '@/data/queries/onboarding';
import type { OnboardingDraft } from '@/types/onboarding';

export function useSubmitOnboardingMutation(): UseMutationResult<void, Error, OnboardingDraft> {
  return useMutation({
    mutationFn: submitOnboardingQuery,
  });
}
