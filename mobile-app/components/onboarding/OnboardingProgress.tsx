import React from 'react';
import { View } from 'react-native';

import { cn } from '@/utils';

interface OnboardingProgressProps {
  activeStep: number;
  totalSteps: number;
}

function createStepIndexes(totalSteps: number): number[] {
  return Array.from({ length: totalSteps }, (_, index: number) => index);
}

export function OnboardingProgress({
  activeStep,
  totalSteps,
}: OnboardingProgressProps) {
  const stepIndexes: number[] = createStepIndexes(totalSteps);

  return (
    <View className="mt-6 flex-row items-center justify-center gap-2">
      {stepIndexes.map((stepIndex: number) => {
        const isActive: boolean = stepIndex + 1 === activeStep;

        return (
          <View
            key={stepIndex}
            className={cn(
              'h-2 w-2 rounded-full bg-light-gray',
              isActive && 'bg-primary',
            )}
          />
        );
      })}
    </View>
  );
}
