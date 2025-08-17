import React, { useState } from 'react';
import { TouchableOpacity, ScrollView, View } from 'react-native';
import { Box, Text } from '../../../components';
import { OnboardingButton } from '../../../components/onboarding';
import { useThemeContext } from '../../../../src/theme/ThemeContext';

type Gender = 'male' | 'female';

export function GenderStep({
  onNext,
  onPrevious,
  isFirstStep,
  isLastStep
}: any) {
  const { theme } = useThemeContext();
  const [selectedGender, setSelectedGender] = useState<Gender | null>(null);

  const handleGenderSelect = (gender: Gender) => setSelectedGender(gender);

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
          This helps us personalize your experience and provide relevant health insights.
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
          <Text variant="caption" color="textSecondary" textAlign="center">🔒 Your privacy is important. This information is stored securely and only used to personalize your experience.</Text>
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
