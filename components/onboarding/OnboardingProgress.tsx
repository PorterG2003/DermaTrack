import React from 'react';
import { View } from 'react-native';
import { Box, Text } from '../ui';
import { useThemeContext } from '../../theme/ThemeContext';

interface OnboardingProgressProps {
  currentStep: number;
  totalSteps: number;
  stepTitles?: string[];
}

export function OnboardingProgress({ 
  currentStep, 
  totalSteps, 
  stepTitles 
}: OnboardingProgressProps) {
  const { theme } = useThemeContext();
  
  return (
    <Box paddingHorizontal="l" paddingVertical="m">
      {/* Step counter */}
      <Box flexDirection="row" justifyContent="space-between" alignItems="center" marginBottom="m">
        <Box>
          <Box 
            backgroundColor="primary" 
            paddingHorizontal="s" 
            paddingVertical="xs" 
            borderRadius="s"
          >
            <Text 
              variant="caption"
              color="white"
              style={{ 
                fontSize: 12,
                fontWeight: '600'
              }}
            >
              Step {currentStep + 1} of {totalSteps}
            </Text>
          </Box>
        </Box>
        
        {stepTitles && stepTitles[currentStep] && (
          <Box flex={1} marginLeft="m">
            <Text 
              variant="caption"
              color="textSecondary"
              style={{ 
                fontSize: 14,
                fontWeight: '500'
              }}
            >
              {stepTitles[currentStep]}
            </Text>
          </Box>
        )}
      </Box>
      
      {/* Progress dots */}
      <Box flexDirection="row" justifyContent="center" alignItems="center">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <Box
            key={index}
            width={8}
            height={8}
            borderRadius="pill"
            marginHorizontal="xs"
            backgroundColor={index === currentStep ? "primary" : "glassBorder"}
            style={{
              opacity: index === currentStep ? 1 : 0.4,
            }}
          />
        ))}
      </Box>
    </Box>
  );
}
