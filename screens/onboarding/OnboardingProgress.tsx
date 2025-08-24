import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Container } from '../../components/ui/layout/Container';
import { Spacer } from '../../components/ui/layout/Spacer';
import { useThemeContext } from '../../theme/ThemeContext';

interface OnboardingProgressProps {
  currentStep: number;
  totalSteps: number;
  stepTitle: string;
  stepDescription: string;
}

export function OnboardingProgress({ 
  currentStep, 
  totalSteps, 
  stepTitle, 
  stepDescription 
}: OnboardingProgressProps) {
  console.log('📊 OnboardingProgress: Component rendering', {
    currentStep,
    totalSteps,
    stepTitle,
    stepDescription
  });

  const { theme } = useThemeContext();
  console.log('🎨 OnboardingProgress: Theme loaded', {
    hasTheme: !!theme,
    themeColors: theme ? Object.keys(theme.colors).slice(0, 3) : []
  });

  const progressPercentage = (currentStep / totalSteps) * 100;
  console.log('📈 OnboardingProgress: Progress calculated', { progressPercentage });

  return (
    <Container>
      <View style={styles.header}>
        <Text style={[styles.stepIndicator, { color: theme.colors.textSecondary }]}>
          Step {currentStep} of {totalSteps}
        </Text>
      </View>

      <Spacer size="m" />

      {/* Progress Bar */}
      <View style={[styles.progressContainer, { backgroundColor: theme.colors.backgroundMuted }]}>
        <View 
          style={[
            styles.progressBar, 
            { 
              backgroundColor: theme.colors.primary,
              width: `${progressPercentage}%`
            }
          ]} 
        />
      </View>

      <Spacer size="m" />
    </Container>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  stepIndicator: {
    fontSize: 14,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 32,
  },
  stepDescription: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 16,
  },
  progressContainer: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
    marginHorizontal: 20,
  },
  progressBar: {
    height: '100%',
    borderRadius: 2,
  },
});
