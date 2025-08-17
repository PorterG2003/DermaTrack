import React, { useState, useEffect } from 'react';
import { TouchableOpacity, ScrollView, View } from 'react-native';
import { Box, Text } from '../../../components';
import { OnboardingButton } from '../../../components/onboarding';
import { useThemeContext } from '../../../theme/ThemeContext';
import { Profile } from '../../../hooks/useProfile';

interface PrimaryConcernsStepProps {
  step: any;
  currentIndex: number;
  totalSteps: number;
  onNext: () => void;
  onPrevious: () => void;
  onGoToStep: (index: number) => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  profile: Profile;
  updateProfile: (data: Partial<Profile>) => Promise<void>;
}

type SkinConcern = 'acne' | 'blackheads' | 'whiteheads' | 'cysticAcne' | 'acneScars' | 'acneMarks';

export function PrimaryConcernsStep({
  onNext,
  onPrevious,
  isFirstStep,
  isLastStep,
  profile,
  updateProfile
}: PrimaryConcernsStepProps) {
  const { theme } = useThemeContext();
  const [selectedConcerns, setSelectedConcerns] = useState<SkinConcern[]>([]);
  
  // Load existing data when component mounts
  useEffect(() => {
    if (profile.primaryConcerns) {
      setSelectedConcerns(profile.primaryConcerns as SkinConcern[]);
    }
  }, [profile.primaryConcerns]);
  
  const handleConcernToggle = async (concern: SkinConcern) => {
    let newConcerns: SkinConcern[];
    if (selectedConcerns.includes(concern)) {
      newConcerns = selectedConcerns.filter(c => c !== concern);
    } else {
      newConcerns = [...selectedConcerns, concern];
    }
    setSelectedConcerns(newConcerns);
    // Save to onboarding data
    await updateProfile({ primaryConcerns: newConcerns });
  };
  
  const concerns: { value: SkinConcern; label: string; emoji: string; description: string }[] = [
    { 
      value: 'acne', 
      label: 'Acne Breakouts', 
      emoji: '🔴',
      description: 'Regular pimples and zits'
    },
    { 
      value: 'blackheads', 
      label: 'Blackheads', 
      emoji: '⚫',
      description: 'Clogged pores with dark tops'
    },
    { 
      value: 'whiteheads', 
      label: 'Whiteheads', 
      emoji: '⚪',
      description: 'Small white bumps under skin'
    },
    { 
      value: 'cysticAcne', 
      label: 'Cystic Acne', 
      emoji: '💥',
      description: 'Deep, painful acne nodules'
    },
    { 
      value: 'acneScars', 
      label: 'Acne Scars', 
      emoji: '💔',
      description: 'Permanent marks from breakouts'
    },
    { 
      value: 'acneMarks', 
      label: 'Acne Marks', 
      emoji: '🌑',
      description: 'Dark spots after breakouts'
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
          Acne Concerns
        </Text>
        
        {/* Step Subtitle */}
        <Text 
          variant="subtitle" 
          color="textSecondary" 
          textAlign="center"
          marginBottom="xl"
          paddingHorizontal="l"
        >
          Select the types of acne you're dealing with. This helps us track your progress more effectively.
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
            💡 Choose all the acne types you experience. This helps us provide better tracking and treatment insights.
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
