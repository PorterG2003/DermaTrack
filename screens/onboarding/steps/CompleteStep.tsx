import React from 'react';
import { View } from 'react-native';
import { Text } from '../../../components';
import { OnboardingButton } from '../../../components/onboarding';
import { Profile } from '../../../hooks/useProfile';
import { useThemeContext } from '../../../theme/ThemeContext';

interface CompleteStepProps {
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

export function CompleteStep({
  onNext,
  onPrevious,
  isFirstStep,
  isLastStep,
  profile,
  updateProfile
}: CompleteStepProps) {
  const { theme } = useThemeContext();
  
  // Complete step always allows proceeding
  const canProceed = true;
  
  return (
    <View style={{ 
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center', 
      padding: theme.spacing.l,
      paddingTop: theme.spacing.xl,
      width: '100%'
    }}>
      {/* Celebration Icon */}
      <View style={{
        width: 140,
        height: 140,
        borderRadius: theme.borderRadii.xl,
        backgroundColor: theme.colors.primary,
        borderWidth: 1,
        borderColor: theme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: theme.spacing.xl,
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
        elevation: 8,
      }}>
        <Text variant="title" color="white" fontSize={64} height={140} lineHeight={140}>
          🎉
        </Text>
      </View>
      
      {/* Completion Title */}
      <Text 
        variant="heading" 
        color="textPrimary" 
        textAlign="center"
        marginBottom="m"
      >
        You're All Set!
      </Text>
      
      {/* Completion Subtitle */}
      <Text 
        variant="subtitle" 
        color="textSecondary" 
        textAlign="center"
        marginBottom="xl"
        paddingHorizontal="l"
      >
        Welcome to DermaTrack! Your personalized acne treatment journey is ready to begin.
      </Text>
      
      {/* What's Next */}
      <View style={{
        backgroundColor: theme.colors.backgroundMuted,
        borderRadius: theme.borderRadii.l,
        padding: theme.spacing.l,
        marginBottom: theme.spacing.xl,
        borderWidth: 1,
        borderColor: theme.colors.glassBorder,
        width: '100%',
        maxWidth: '90%'
      }}>
        <Text 
          variant="subtitle" 
          color="textPrimary" 
          textAlign="center"
          marginBottom="m"
        >
          🚀 What's Next:
        </Text>
        
        <View style={{ marginBottom: theme.spacing.s }}>
          <Text variant="caption" color="textSecondary" textAlign="center">
            📸 Take your first acne photo to start tracking
          </Text>
        </View>
        
        <View style={{ marginBottom: theme.spacing.s }}>
          <Text variant="caption" color="textSecondary" textAlign="center">
            📊 View your personalized acne dashboard
          </Text>
        </View>
        
        <View style={{ marginBottom: theme.spacing.s }}>
          <Text variant="caption" color="textSecondary" textAlign="center">
            🔔 Set up your first tracking reminder
          </Text>
        </View>
        
        <View>
          <Text variant="caption" color="textSecondary" textAlign="center">
            📱 Start building your clear skin routine
          </Text>
        </View>
      </View>
      
      {/* Tip Card */}
      <View style={{
        backgroundColor: theme.colors.backgroundMuted,
        borderRadius: theme.borderRadii.m,
        padding: theme.spacing.m,
        borderWidth: 1,
        borderColor: theme.colors.glassBorder,
        width: '100%',
        maxWidth: '90%',
        marginBottom: theme.spacing.xl
      }}>
        <Text 
          variant="caption" 
          color="textSecondary" 
          textAlign="center"
        >
          💡 Tip: Take photos in consistent lighting to track your acne progress accurately.
        </Text>
      </View>
      
      {/* Main Action Button */}
      <View style={{
        width: '100%',
        paddingHorizontal: theme.spacing.l,
        marginTop: theme.spacing.xl
      }}>
        <OnboardingButton
          title="Take Your First Progress Photos"
          onPress={onNext}
          variant="primary"
          disabled={!canProceed}
        />
      </View>
      
      {/* Back Button Only */}
      {!isFirstStep && (
        <View style={{
          width: '100%',
          paddingHorizontal: theme.spacing.l,
          marginTop: theme.spacing.m
        }}>
          <OnboardingButton
            title="Back"
            onPress={onPrevious}
            variant="secondary"
          />
        </View>
      )}
    </View>
  );
}
