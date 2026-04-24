import React from 'react';
import { View } from 'react-native';

import { Typography } from '@/components/ui/Typography';

export interface StepperProps {
  currentPage: number;
  totalPages: number;
  title: string;
  subtitle: string;
  isOptional?: boolean;
}

export function Stepper({ currentPage, totalPages, title, subtitle, isOptional }: StepperProps) {
  return (
    <View className="gap-2 mb-8">
      <Typography variant="body-regular" className="text-primary">
        Step {currentPage} of {totalPages}
        {isOptional ? ' • Optional' : ''}
      </Typography>

      <Typography variant="title-large" className="text-heading-text">
        {title}
      </Typography>
      <Typography variant="body-regular" className="text-[#9CA3AF]">
        {subtitle}
      </Typography>
    </View>
  );
}
