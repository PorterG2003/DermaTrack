import React, { useState } from 'react';
import { SafeAreaView } from 'react-native';
import { useThemeContext } from '../../theme/ThemeContext';
import { Box } from '../../components';
import { useOnboardingData } from '../../hooks/useOnboardingData';

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
  const { onboardingData, updateOnboardingData } = useOnboardingData();
  
  const currentStep = steps[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;
  
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
          onboardingData={onboardingData}
          updateOnboardingData={updateOnboardingData}
        />
      </Box>
    </SafeAreaView>
  );
}
