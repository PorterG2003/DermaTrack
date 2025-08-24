import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '../../../components/ui/buttons/Button';
import { Container } from '../../../components/ui/layout/Container';
import { Spacer } from '../../../components/ui/layout/Spacer';
import { useThemeContext } from '../../../theme/ThemeContext';
import { OnboardingData } from '../OnboardingFlow';

interface CompleteStepProps {
  data: OnboardingData;
  onNext: (data: Partial<OnboardingData>) => void;
  onBack: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

export function CompleteStep({ 
  data, 
  onNext, 
  onBack, 
  isFirstStep, 
  isLastStep 
}: CompleteStepProps) {
  const { theme } = useThemeContext();

  const handleComplete = () => {
    onNext({}); // No additional data needed for completion
  };

  return (
    <Container>
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
            🎉 Onboarding Complete!
          </Text>
          
          <Spacer size="m" />
          
          <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
            Thank you for providing such detailed information about your skin and lifestyle. This comprehensive data will help us provide you with personalized insights and recommendations.
          </Text>

          <Spacer size="l" />

          <View style={[styles.summaryCard, { backgroundColor: theme.colors.backgroundMuted }]}>
            <Text style={[styles.summaryTitle, { color: theme.colors.textPrimary }]}>
              What we've collected:
            </Text>
            
            <Spacer size="s" />
            
            <Text style={[styles.summaryText, { color: theme.colors.textSecondary }]}>
              • Hormonal & medical context{'\n'}
              • Symptom patterns and breakout locations{'\n'}
              • Skin behavior and responses{'\n'}
              • Lifestyle factors and daily habits{'\n'}
              • Diet and nutrition patterns{'\n'}
              • Medications and supplements{'\n'}
              • Routine products and ingredients
            </Text>
          </View>

          <Spacer size="l" />

          <Text style={[styles.nextSteps, { color: theme.colors.textSecondary }]}>
            You're now ready to start tracking your skin progress and receiving personalized insights!
          </Text>
        </View>

        <View style={styles.navigationContainer}>
          <Button
            variant="glass"
            size="medium"
            style={{ flex: 1 }}
            onPress={onBack}
          >
            Back
          </Button>
          
          <Spacer size="m" />
          
          <Button
            variant="glass"
            size="medium"
            style={{ flex: 1 }}
            onPress={handleComplete}
          >
            Complete Setup
          </Button>
        </View>
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 40,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 16,
  },
  summaryCard: {
    padding: 20,
    borderRadius: 16,
    width: '100%',
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 14,
    lineHeight: 20,
  },
  nextSteps: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 16,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
});
