import React, { useState } from 'react';
import { SafeAreaView } from 'react-native';
import { useThemeContext } from '../../theme/ThemeContext';
import { Box, Text } from '../../components';
import { useProfile } from '../../hooks/useProfile';

interface OnboardingStep {
  id: string;
  title: string;
  component: React.ComponentType<any>;
}

interface OnboardingFlowProps {
  steps: OnboardingStep[];
  onComplete: () => void;
}

export function OnboardingFlow({ steps, onComplete }: OnboardingFlowProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const { theme } = useThemeContext();
  const { profile, updateProfile, isLoading } = useProfile();
  
  // Debug logging
  console.log('🔍 OnboardingFlow:', { profile, isLoading, profileType: typeof profile });
  
  const currentStep = steps[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;
  
  // Show loading state while profile is being fetched
  if (isLoading || !profile) {
    console.log('🔍 OnboardingFlow: Showing loading state');
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Box flex={1} justifyContent="center" alignItems="center">
          <Text variant="title" color="textPrimary">Loading...</Text>
        </Box>
      </SafeAreaView>
    );
  }
  
  const goToNextStep = () => {
    if (isLastStep) {
      onComplete();
    } else {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };
  
  const goToPreviousStep = () => {
    if (!isFirstStep) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };
  
  const goToStep = (index: number) => {
    setCurrentStepIndex(index);
  };
  
  const CurrentStepComponent = currentStep.component;
  
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Box flex={1}>
        {/* Step content with integrated navigation buttons */}
        <CurrentStepComponent
          step={currentStep}
          currentIndex={currentStepIndex}
          totalSteps={steps.length}
          onNext={goToNextStep}
          onPrevious={goToPreviousStep}
          onGoToStep={goToStep}
          isFirstStep={isFirstStep}
          isLastStep={isLastStep}
          profile={profile}
          updateProfile={updateProfile}
        />
      </Box>
    </SafeAreaView>
  );
}
