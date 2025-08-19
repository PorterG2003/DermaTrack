import React, { useEffect, useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { Text } from '../../../components';
import { OnboardingButton } from '../../../components/onboarding';
import { Profile } from '../../../hooks/useProfile';
import { useThemeContext } from '../../../theme/ThemeContext';

type Gender = 'male' | 'female';

interface GenderStepProps {
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

export function GenderStep({
  onNext,
  onPrevious,
  isFirstStep,
  isLastStep,
  profile,
  updateProfile
}: GenderStepProps) {
  const { theme } = useThemeContext();
  const [selectedGender, setSelectedGender] = useState<Gender | null>(null);

  // Additional safety check - if profile is somehow still null, provide a fallback
  if (!profile) {
    console.warn('GenderStep: Profile is null, showing loading state');
    return (
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ 
          flex: 1, 
          justifyContent: 'center', 
          alignItems: 'center', 
          padding: theme.spacing.l 
        }}>
          <Text variant="title" color="textPrimary">Loading...</Text>
        </View>
      </ScrollView>
    );
  }

  // Load existing data when component mounts
  useEffect(() => {
    if (profile.gender) {
      setSelectedGender(profile.gender);
    }
  }, [profile.gender]);

  const handleGenderSelect = async (gender: Gender) => {
    setSelectedGender(gender);
    // Save to onboarding data
    await updateProfile({ gender });
  };

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
        <Text variant="heading" color="textPrimary" textAlign="center" marginBottom="m">Tell us about yourself</Text>
        <Text variant="subtitle" color="textSecondary" textAlign="center" marginBottom="xl" paddingHorizontal="l">
          This helps us personalize your acne treatment recommendations and provide relevant insights for your skin type.
        </Text>
        <View style={{ width: '100%', marginBottom: theme.spacing.xl }}>
          <Text variant="subtitle" color="textPrimary" textAlign="center" marginBottom="l">What's your gender?</Text>
          <TouchableOpacity onPress={() => handleGenderSelect('male')} style={{ marginBottom: theme.spacing.m }}>
            <View style={{
              backgroundColor: selectedGender === 'male' ? theme.colors.primary : theme.colors.backgroundMuted,
              borderRadius: theme.borderRadii.l,
              padding: theme.spacing.l,
              borderWidth: 2,
              borderColor: selectedGender === 'male' ? theme.colors.primary : theme.colors.glassBorder,
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: selectedGender === 'male' ? theme.colors.primary : theme.colors.glassBorder,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: selectedGender === 'male' ? 0.3 : 0.1,
              shadowRadius: 8,
              elevation: selectedGender === 'male' ? 4 : 2,
            }}>
              <Text variant="title" color={selectedGender === 'male' ? 'white' : 'textPrimary'} textAlign="center">👨 Male</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleGenderSelect('female')}>
            <View style={{
              backgroundColor: selectedGender === 'female' ? theme.colors.primary : theme.colors.backgroundMuted,
              borderRadius: theme.borderRadii.l,
              padding: theme.spacing.l,
              borderWidth: 2,
              borderColor: selectedGender === 'female' ? theme.colors.primary : theme.colors.glassBorder,
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: selectedGender === 'female' ? theme.colors.primary : theme.colors.glassBorder,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: selectedGender === 'female' ? 0.3 : 0.1,
              shadowRadius: 8,
              elevation: selectedGender === 'female' ? 4 : 2,
            }}>
              <Text variant="title" color={selectedGender === 'female' ? 'white' : 'textPrimary'} textAlign="center">👩 Female</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={{
          backgroundColor: theme.colors.backgroundMuted,
          borderRadius: theme.borderRadii.m,
          padding: theme.spacing.m,
          borderWidth: 1,
          borderColor: theme.colors.glassBorder,
          width: '100%',
          marginBottom: theme.spacing.xl
        }}>
          <Text variant="caption" color="textSecondary" textAlign="center">🔒 Your privacy is important. This information helps us provide gender-specific acne treatment insights while keeping your data secure.</Text>
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
              disabled={!selectedGender}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
