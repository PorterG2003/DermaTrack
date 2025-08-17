import React, { useState } from 'react';
import { TouchableOpacity, ScrollView, View } from 'react-native';
import { Box, Text } from '../../../components';
import { OnboardingButton } from '../../../components/onboarding';
import { useThemeContext } from '../../../../src/theme/ThemeContext';

interface AgeRangeStepProps {
  step: any;
  currentIndex: number;
  totalSteps: number;
  onNext: () => void;
  onPrevious: () => void;
  onGoToStep: (index: number) => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

type AgeRange = '18-25' | '26-35' | '36-45' | '46-55' | '55+';

export function AgeRangeStep({
  onNext,
  onPrevious,
  isFirstStep,
  isLastStep
}: AgeRangeStepProps) {
  const { theme } = useThemeContext();
  const [selectedAgeRange, setSelectedAgeRange] = useState<AgeRange | null>(null);
  
  const handleAgeRangeSelect = (ageRange: AgeRange) => {
    setSelectedAgeRange(ageRange);
  };
  
  const ageRanges: { value: AgeRange; label: string; emoji: string; description: string }[] = [
    { 
      value: '18-25', 
      label: '18-25', 
      emoji: '🎓',
      description: 'Young adult, early skin care habits'
    },
    { 
      value: '26-35', 
      label: '26-35', 
      emoji: '💼',
      description: 'Professional life, stress management'
    },
    { 
      value: '36-45', 
      label: '36-45', 
      emoji: '🌟',
      description: 'Mature skin, prevention focus'
    },
    { 
      value: '46-55', 
      label: '46-55', 
      emoji: '✨',
      description: 'Mid-life, skin maintenance'
    },
    { 
      value: '55+', 
      label: '55+', 
      emoji: '👑',
      description: 'Senior, specialized care needs'
    },
  ];
  
  return (
    <ScrollView 
      style={{ flex: 1 }} 
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={{ 
        flex: 1, 
        justifyContent: 'flex-start', 
        alignItems: 'center', 
        padding: theme.spacing.l,
        paddingTop: theme.spacing.xl,
        width: '100%'
      }}>
        {/* Step Title */}
        <Text 
          variant="heading" 
          color="textPrimary" 
          textAlign="center"
          marginBottom="m"
        >
          Age Range
        </Text>
        
        {/* Step Subtitle */}
        <Text 
          variant="subtitle" 
          color="textSecondary" 
          textAlign="center"
          marginBottom="xl"
          paddingHorizontal="l"
        >
          This helps us provide age-appropriate skin health recommendations.
        </Text>
        
        {/* Age Range Selection Options */}
        <View style={{ width: '100%', marginBottom: theme.spacing.xl }}>
          {ageRanges.map((ageRange, index) => (
            <TouchableOpacity 
              key={ageRange.value}
              onPress={() => handleAgeRangeSelect(ageRange.value)}
              style={{ marginBottom: index < ageRanges.length - 1 ? theme.spacing.m : 0 }}
            >
              <View style={{
                backgroundColor: selectedAgeRange === ageRange.value ? theme.colors.primary : theme.colors.backgroundMuted,
                borderRadius: theme.borderRadii.l,
                padding: theme.spacing.m,
                borderWidth: 2,
                borderColor: selectedAgeRange === ageRange.value ? theme.colors.primary : theme.colors.glassBorder,
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: selectedAgeRange === ageRange.value ? theme.colors.primary : theme.colors.glassBorder,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: selectedAgeRange === ageRange.value ? 0.3 : 0.1,
                shadowRadius: 8,
                elevation: selectedAgeRange === ageRange.value ? 4 : 2,
              }}>
                <Text 
                  variant="title" 
                  color={selectedAgeRange === ageRange.value ? 'white' : 'textPrimary'}
                  textAlign="center"
                  marginBottom="xs"
                >
                  {ageRange.emoji} {ageRange.label}
                </Text>
                <Text 
                  variant="caption" 
                  color={selectedAgeRange === ageRange.value ? 'white' : 'textSecondary'}
                  textAlign="center"
                >
                  {ageRange.description}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        
        {/* Help Note */}
        <View style={{
          backgroundColor: theme.colors.backgroundMuted,
          borderRadius: theme.borderRadii.m,
          padding: theme.spacing.m,
          borderWidth: 1,
          borderColor: theme.colors.glassBorder,
          width: '100%',
          marginBottom: theme.spacing.xl
        }}>
          <Text 
            variant="caption" 
            color="textSecondary" 
            textAlign="center"
          >
            💡 Age-appropriate recommendations help ensure the best skin health outcomes.
          </Text>
        </View>
        
        {/* Navigation Buttons - integrated into content */}
        <View style={{
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: theme.spacing.l,
          marginTop: theme.spacing.xl
        }}>
          {!isFirstStep && (
            <View style={{ flex: 1, marginRight: theme.spacing.s }}>
              <OnboardingButton
                title="Back"
                onPress={onPrevious}
                variant="secondary"
              />
            </View>
          )}
          
          <View style={{ flex: 1, marginLeft: isFirstStep ? 0 : theme.spacing.s }}>
            <OnboardingButton
              title={isLastStep ? "Get Started" : "Next"}
              onPress={onNext}
              variant="primary"
              disabled={!selectedAgeRange}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
