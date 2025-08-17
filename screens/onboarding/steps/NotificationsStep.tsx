import React, { useState, useEffect } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Box, Text } from '../../../components';
import { OnboardingButton } from '../../../components/onboarding';
import { useThemeContext } from '../../../theme/ThemeContext';
import { Profile } from '../../../hooks/useProfile';

interface NotificationsStepProps {
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

type NotificationPreference = 'daily' | 'weekly' | 'important' | 'none';

export function NotificationsStep({
  onNext,
  onPrevious,
  isFirstStep,
  isLastStep,
  profile,
  updateProfile
}: NotificationsStepProps) {
  const { theme } = useThemeContext();
  const [selectedPreference, setSelectedPreference] = useState<NotificationPreference | null>(null);
  
  // Load existing data when component mounts
  useEffect(() => {
    if (profile.notificationPreference) {
      setSelectedPreference(profile.notificationPreference);
    }
  }, [profile.notificationPreference]);
  
  const handlePreferenceSelect = async (preference: NotificationPreference) => {
    setSelectedPreference(preference);
    // Save to onboarding data
    await updateProfile({ notificationPreference: preference });
  };
  
  const preferences: { value: NotificationPreference; label: string; emoji: string; description: string }[] = [
    { 
      value: 'daily', 
      label: 'Daily Acne Tracking', 
      emoji: '📅',
      description: 'Get reminded to track your breakouts daily'
    },
    { 
      value: 'weekly', 
      label: 'Weekly Progress Reports', 
      emoji: '📊',
      description: 'See your acne improvement over time'
    },
    { 
      value: 'important', 
      label: 'Treatment Reminders Only', 
      emoji: '🔔',
      description: 'Only get notified about treatment changes'
    },
    { 
      value: 'none', 
      label: 'No Notifications', 
      emoji: '🔕',
      description: 'Check the app when you want to'
    },
  ];
  
  return (
    <Box flex={1} justifyContent="center" alignItems="center" padding="l">
      {/* Step Title */}
      <Text 
        variant="heading" 
        color="textPrimary" 
        textAlign="center"
        marginBottom="m"
      >
        Acne Tracking Reminders
      </Text>
      
      {/* Step Subtitle */}
      <Text 
        variant="subtitle" 
        color="textSecondary" 
        textAlign="center"
        marginBottom="xl"
        paddingHorizontal="l"
      >
        Choose how often you'd like to be reminded to track your acne progress and treatments.
      </Text>
      
      {/* Notification Icon */}
      <Box 
        width={140} 
        height={140} 
        borderRadius="xl"
        backgroundColor="backgroundMuted"
        borderWidth={1}
        borderColor="glassBorder"
        justifyContent="center"
        alignItems="center"
        marginBottom="xl"
        style={{
          shadowColor: theme.colors.primary,
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.3,
          shadowRadius: 16,
          elevation: 8,
        }}
      >
        <Text variant="title" color="primary" fontSize={64} height={140} lineHeight={140}>
          🔔
        </Text>
      </Box>
      
      {/* Notification Preferences */}
      <Box width="100%" marginBottom="xl">
        {preferences.map((preference, index) => (
          <TouchableOpacity 
            key={preference.value}
            onPress={() => handlePreferenceSelect(preference.value)}
            style={{ marginBottom: index < preferences.length - 1 ? theme.spacing.m : 0 }}
          >
            <Box 
              backgroundColor={selectedPreference === preference.value ? 'primary' : 'backgroundMuted'}
              borderRadius="l"
              padding="l"
              borderWidth={2}
              borderColor={selectedPreference === preference.value ? 'primary' : 'glassBorder'}
              alignItems="center"
              justifyContent="center"
              style={{
                shadowColor: selectedPreference === preference.value ? theme.colors.primary : theme.colors.glassBorder,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: selectedPreference === preference.value ? 0.3 : 0.1,
                shadowRadius: 8,
                elevation: selectedPreference === preference.value ? 4 : 2,
              }}
            >
              <Text 
                variant="title" 
                color={selectedPreference === preference.value ? 'white' : 'textPrimary'}
                textAlign="center"
                marginBottom="xs"
              >
                {preference.emoji} {preference.label}
              </Text>
              <Text 
                variant="caption" 
                color={selectedPreference === preference.value ? 'white' : 'textSecondary'}
                textAlign="center"
              >
                {preference.description}
              </Text>
            </Box>
          </TouchableOpacity>
        ))}
      </Box>
      
      {/* Help Note */}
      <Box 
        backgroundColor="backgroundMuted"
        borderRadius="m"
        padding="m"
        borderWidth={1}
        borderColor="glassBorder"
        width="100%"
      >
        <Text 
          variant="caption" 
          color="textSecondary" 
          textAlign="center"
        >
          💡 Regular tracking helps you see what treatments work best for your acne. You can change these settings anytime.
        </Text>
      </Box>

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
            disabled={!selectedPreference}
          />
        </View>
      </View>
    </Box>
  );
}
