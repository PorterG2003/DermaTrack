import React, { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Text } from '../../../components';
import { OnboardingButton } from '../../../components/onboarding';
import { Input } from '../../../components/ui';
import { Profile } from '../../../hooks/useProfile';
import { useThemeContext } from '../../../theme/ThemeContext';

interface DateOfBirthStepProps {
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

export function DateOfBirthStep({
  onNext,
  onPrevious,
  isFirstStep,
  isLastStep,
  profile,
  updateProfile
}: DateOfBirthStepProps) {
  const { theme } = useThemeContext();
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Load existing data when component mounts
  useEffect(() => {
    if (profile.dateOfBirth) {
      const date = new Date(profile.dateOfBirth);
      setMonth((date.getMonth() + 1).toString().padStart(2, '0'));
      setYear(date.getFullYear().toString());
    }
  }, [profile.dateOfBirth]);

  const handleMonthChange = (text: string) => {
    // Only allow numbers and limit to 2 digits
    const cleanText = text.replace(/[^0-9]/g, '').slice(0, 2);
    
    // Validate month range (01-12)
    if (cleanText === '' || (parseInt(cleanText) >= 1 && parseInt(cleanText) <= 12)) {
      setMonth(cleanText);
    }
  };

  const handleYearChange = (text: string) => {
    // Only allow numbers and limit to 4 digits
    const cleanText = text.replace(/[^0-9]/g, '').slice(0, 4);
    setYear(cleanText);
  };

  const handleNext = async () => {
    if (!canProceed) return;
    
    setIsLoading(true);
    try {
      // Create date object (using day 1 to avoid timezone issues)
      const monthNum = parseInt(month) - 1; // JavaScript months are 0-indexed
      const yearNum = parseInt(year);
      const date = new Date(yearNum, monthNum, 1, 12, 0, 0, 0); // Use noon to avoid timezone issues
      
      await updateProfile({ dateOfBirth: date.getTime() });
      onNext();
    } catch (error) {
      console.error('Error saving date of birth:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getAge = () => {
    if (month && year) {
      const monthNum = parseInt(month) - 1;
      const yearNum = parseInt(year);
      const birthDate = new Date(yearNum, monthNum, 1);
      const today = new Date();
      
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      return age;
    }
    return null;
  };

  const canProceed = month && year && 
    parseInt(month) >= 1 && parseInt(month) <= 12 &&
    parseInt(year) >= 1900 && parseInt(year) <= new Date().getFullYear();

  const age = getAge();

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
        <Text variant="heading" color="textPrimary" textAlign="center" marginBottom="m">
          When were you born?
        </Text>
        
        <Text variant="subtitle" color="textSecondary" textAlign="center" marginBottom="xl" paddingHorizontal="l">
          This helps us provide age-appropriate acne treatment recommendations.
        </Text>
        
        {/* Date Input Fields */}
        <View style={{ width: '100%', marginBottom: theme.spacing.xl }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: theme.spacing.m }}>
            <View style={{ flex: 1 }}>
              <Input
                label="Month"
                placeholder="MM"
                value={month}
                onChangeText={handleMonthChange}
                keyboardType="numeric"
                maxLength={2}
                size="large"
                variant="glass"
              />
            </View>
            
            <View style={{ flex: 1 }}>
              <Input
                label="Year"
                placeholder="YYYY"
                value={year}
                onChangeText={handleYearChange}
                keyboardType="numeric"
                maxLength={4}
                size="large"
                variant="glass"
              />
            </View>
          </View>
          
          {/* Age Display */}
          {age !== null && (
            <View style={{
              backgroundColor: theme.colors.primary,
              borderRadius: theme.borderRadii.m,
              padding: theme.spacing.m,
              alignItems: 'center',
              marginTop: theme.spacing.m
            }}>
              <Text variant="title" color="white" textAlign="center">
                Age: {age} years old
              </Text>
            </View>
          )}
        </View>

        {/* Info Box */}
        <View style={{
          backgroundColor: theme.colors.backgroundMuted,
          borderRadius: theme.borderRadii.m,
          padding: theme.spacing.m,
          borderWidth: 1,
          borderColor: theme.colors.glassBorder,
          width: '100%',
          marginBottom: theme.spacing.xl
        }}>
          <Text variant="caption" color="textSecondary" textAlign="center">
            🎯 Age-specific insights help us provide better acne treatment recommendations for your skin journey.
          </Text>
        </View>
        
        {/* Navigation Buttons */}
        <View style={{
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-between',
          gap: theme.spacing.m,
          marginTop: theme.spacing.xl
        }}>
          {!isFirstStep && (
            <View style={{ flex: 1 }}>
              <OnboardingButton
                title="Back"
                onPress={onPrevious}
                variant="secondary"
              />
            </View>
          )}
          
          <View style={{ flex: 1 }}>
            <OnboardingButton
              title={isLastStep ? "Get Started" : "Next"}
              onPress={handleNext}
              variant="primary"
              disabled={!canProceed || isLoading}
              loading={isLoading}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
