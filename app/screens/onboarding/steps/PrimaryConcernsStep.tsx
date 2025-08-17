import React, { useState } from 'react';
import { TouchableOpacity, ScrollView, View } from 'react-native';
import { Box, Text } from '../../../components';
import { OnboardingButton } from '../../../components/onboarding';
import { useThemeContext } from '../../../../src/theme/ThemeContext';

interface PrimaryConcernsStepProps {
  step: any;
  currentIndex: number;
  totalSteps: number;
  onNext: () => void;
  onPrevious: () => void;
  onGoToStep: (index: number) => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

type SkinConcern = 'acne' | 'darkSpots' | 'wrinkles' | 'redness' | 'scars' | 'general';

export function PrimaryConcernsStep({
  onNext,
  onPrevious,
  isFirstStep,
  isLastStep
}: PrimaryConcernsStepProps) {
  const { theme } = useThemeContext();
  const [selectedConcerns, setSelectedConcerns] = useState<SkinConcern[]>([]);
  
  const handleConcernToggle = (concern: SkinConcern) => {
    if (selectedConcerns.includes(concern)) {
      setSelectedConcerns(selectedConcerns.filter(c => c !== concern));
    } else {
      setSelectedConcerns([...selectedConcerns, concern]);
    }
  };
  
  const concerns: { value: SkinConcern; label: string; emoji: string; description: string }[] = [
    { 
      value: 'acne', 
      label: 'Acne & Breakouts', 
      emoji: '🔴',
      description: 'Pimples, blackheads, whiteheads'
    },
    { 
      value: 'darkSpots', 
      label: 'Dark Spots', 
      emoji: '🌑',
      description: 'Hyperpigmentation, sun spots'
    },
    { 
      value: 'wrinkles', 
      label: 'Fine Lines & Wrinkles', 
      emoji: '📝',
      description: 'Age-related skin changes'
    },
    { 
      value: 'redness', 
      label: 'Redness & Irritation', 
      emoji: '🌡️',
      description: 'Inflammation, rosacea'
    },
    { 
      value: 'scars', 
      label: 'Scars & Marks', 
      emoji: '💔',
      description: 'Acne scars, injury marks'
    },
    { 
      value: 'general', 
      label: 'General Monitoring', 
      emoji: '📊',
      description: 'Overall skin health tracking'
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
          Primary Concerns
        </Text>
        
        {/* Step Subtitle */}
        <Text 
          variant="subtitle" 
          color="textSecondary" 
          textAlign="center"
          marginBottom="xl"
          paddingHorizontal="l"
        >
          Select what you'd like to track and monitor. You can choose multiple concerns.
        </Text>
        
        {/* Concerns Selection Options */}
        <View style={{ width: '100%', marginBottom: theme.spacing.xl }}>
          {concerns.map((concern, index) => (
            <TouchableOpacity 
              key={concern.value}
              onPress={() => handleConcernToggle(concern.value)}
              style={{ marginBottom: index < concerns.length - 1 ? theme.spacing.m : 0 }}
            >
              <View style={{
                backgroundColor: selectedConcerns.includes(concern.value) ? theme.colors.primary : theme.colors.backgroundMuted,
                borderRadius: theme.borderRadii.l,
                padding: theme.spacing.m,
                borderWidth: 2,
                borderColor: selectedConcerns.includes(concern.value) ? theme.colors.primary : theme.colors.glassBorder,
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: selectedConcerns.includes(concern.value) ? theme.colors.primary : theme.colors.glassBorder,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: selectedConcerns.includes(concern.value) ? 0.3 : 0.1,
                shadowRadius: 8,
                elevation: selectedConcerns.includes(concern.value) ? 4 : 2,
              }}>
                <Text 
                  variant="title" 
                  color={selectedConcerns.includes(concern.value) ? 'white' : 'textPrimary'}
                  textAlign="center"
                  marginBottom="xs"
                >
                  {concern.emoji} {concern.label}
                </Text>
                <Text 
                  variant="caption" 
                  color={selectedConcerns.includes(concern.value) ? 'white' : 'textSecondary'}
                  textAlign="center"
                >
                  {concern.description}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        
        {/* Selection Summary */}
        {selectedConcerns.length > 0 && (
          <View style={{
            backgroundColor: theme.colors.primary,
            borderRadius: theme.borderRadii.m,
            padding: theme.spacing.m,
            borderWidth: 1,
            borderColor: theme.colors.primary,
            width: '100%',
            marginBottom: theme.spacing.l
          }}>
            <Text 
              variant="subtitle" 
              color="white"
              textAlign="center"
            >
              ✅ Selected: {selectedConcerns.length} concern{selectedConcerns.length !== 1 ? 's' : ''}
            </Text>
          </View>
        )}
        
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
            💡 Choose what matters most to you. You can always add or remove concerns later.
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
              disabled={selectedConcerns.length === 0}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
