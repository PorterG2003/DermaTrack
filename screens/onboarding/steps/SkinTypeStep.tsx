import React, { useState, useEffect } from 'react';
import { TouchableOpacity, ScrollView, View } from 'react-native';
import { Box, Text } from '../../../components';
import { OnboardingButton } from '../../../components/onboarding';
import { useThemeContext } from '../../../theme/ThemeContext';
import { Profile } from '../../../hooks/useProfile';

interface SkinTypeStepProps {
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

type SkinType = 'oily' | 'dry' | 'combination' | 'normal' | 'sensitive';

export function SkinTypeStep({
  onNext,
  onPrevious,
  isFirstStep,
  isLastStep,
  profile,
  updateProfile
}: SkinTypeStepProps) {
  const { theme } = useThemeContext();
  const [selectedSkinType, setSelectedSkinType] = useState<SkinType | null>(null);
  
  // Load existing data when component mounts
  useEffect(() => {
    if (profile.skinType) {
      setSelectedSkinType(profile.skinType);
    }
  }, [profile.skinType]);
  
  const handleSkinTypeSelect = async (skinType: SkinType) => {
    setSelectedSkinType(skinType);
    // Save to onboarding data
    await updateProfile({ skinType });
  };
  
  const skinTypes: { value: SkinType; label: string; emoji: string; description: string }[] = [
    { 
      value: 'oily', 
      label: 'Oily', 
      emoji: '💧',
      description: 'Shiny, frequent breakouts, enlarged pores'
    },
    { 
      value: 'combination', 
      label: 'Combination', 
      emoji: '🎭',
      description: 'Oily T-zone, dry cheeks, mixed concerns'
    },
    { 
      value: 'sensitive', 
      label: 'Sensitive', 
      emoji: '🌹',
      description: 'Easily irritated, prone to inflammation'
    },
    { 
      value: 'dry', 
      label: 'Dry', 
      emoji: '🏜️',
      description: 'Tight, flaky, may still get breakouts'
    },
    { 
      value: 'normal', 
      label: 'Normal', 
      emoji: '✨',
      description: 'Generally clear, occasional breakouts'
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
          Acne-Prone Skin Type
        </Text>
        
        {/* Step Subtitle */}
        <Text 
          variant="subtitle" 
          color="textSecondary" 
          textAlign="center"
          marginBottom="xl"
          paddingHorizontal="l"
        >
          Understanding your skin type helps us recommend the right acne treatments and track what works best for you.
        </Text>
        
        {/* Skin Type Selection Options */}
        <View style={{ width: '100%', marginBottom: theme.spacing.xl }}>
          {skinTypes.map((skinType, index) => (
            <TouchableOpacity 
              key={skinType.value}
              onPress={() => handleSkinTypeSelect(skinType.value)}
              style={{ marginBottom: index < skinTypes.length - 1 ? theme.spacing.m : 0 }}
            >
              <View style={{
                backgroundColor: selectedSkinType === skinType.value ? theme.colors.primary : theme.colors.backgroundMuted,
                borderRadius: theme.borderRadii.l,
                padding: theme.spacing.m,
                borderWidth: 2,
                borderColor: selectedSkinType === skinType.value ? theme.colors.primary : theme.colors.glassBorder,
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: selectedSkinType === skinType.value ? theme.colors.primary : theme.colors.glassBorder,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: selectedSkinType === skinType.value ? 0.3 : 0.1,
                shadowRadius: 8,
                elevation: selectedSkinType === skinType.value ? 4 : 2,
              }}>
                <Text 
                  variant="title" 
                  color={selectedSkinType === skinType.value ? 'white' : 'textPrimary'}
                  textAlign="center"
                  marginBottom="xs"
                >
                  {skinType.emoji} {skinType.label}
                </Text>
                <Text 
                  variant="caption" 
                  color={selectedSkinType === skinType.value ? 'white' : 'textSecondary'}
                  textAlign="center"
                >
                  {skinType.description}
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
            💡 Choose what feels most accurate for your acne-prone skin. This helps us personalize your treatment tracking.
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
              disabled={!selectedSkinType}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
