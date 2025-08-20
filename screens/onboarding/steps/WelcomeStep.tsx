import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, View } from 'react-native';
import { Box, StepIcon, Text } from '../../../components';
import { OnboardingButton } from '../../../components/onboarding';
import { useThemeContext } from '../../../theme/ThemeContext';

interface WelcomeStepProps {
  step: any;
  currentIndex: number;
  totalSteps: number;
  onNext: () => void;
  onPrevious: () => void;
  onGoToStep: (index: number) => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

export function WelcomeStep({
  onNext,
  onPrevious,
  isFirstStep,
  isLastStep
}: WelcomeStepProps) {
  const { theme } = useThemeContext();
  
  // Welcome step always allows proceeding
  const canProceed = true;
  
  return (
    <ScrollView 
      style={{ flex: 1 }} 
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        padding: theme.spacing.l,
        paddingTop: theme.spacing.xl,
        width: '100%'
      }}>
        {/* Welcome Icon/Logo */}
        <StepIcon 
          icon="🩹"
          size="large"
          variant="emoji"
        />
        
        {/* Welcome Title */}
        <Text 
          variant="subtitle" 
          color="textPrimary" 
          textAlign="center"
          marginBottom="m"
          paddingHorizontal="m"
          numberOfLines={2}
          adjustsFontSizeToFit
          minimumFontScale={0.8}
        >
          Welcome to DermaTrack
        </Text>
        
        {/* Welcome Subtitle */}
        <Text 
          variant="subtitle" 
          color="textSecondary" 
          textAlign="center"
          marginBottom="xl"
          paddingHorizontal="l"
          numberOfLines={4}
          adjustsFontSizeToFit
          minimumFontScale={0.7}
        >
          Your personal acne tracking companion. Monitor breakouts, track treatments, and see real progress in your clear skin journey.
        </Text>
        
        {/* Feature Highlights */}
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
            numberOfLines={2}
            adjustsFontSizeToFit
          >
            What you'll be able to do:
          </Text>
          
          <View style={{ marginBottom: theme.spacing.s }}>
            <Box flexDirection="row" alignItems="center" justifyContent="center">
              <Ionicons name="camera" size={14} color={theme.colors.textSecondary} style={{ marginRight: 6 }} />
              <Text variant="caption" color="textSecondary" textAlign="center" numberOfLines={1}>
                Track acne breakouts and progress
              </Text>
            </Box>
          </View>
          
          <View style={{ marginBottom: theme.spacing.s }}>
            <Box flexDirection="row" alignItems="center" justifyContent="center">
              <Ionicons name="analytics" size={14} color={theme.colors.textSecondary} style={{ marginRight: 6 }} />
              <Text variant="caption" color="textSecondary" textAlign="center" numberOfLines={1}>
                Monitor treatment effectiveness
              </Text>
            </Box>
          </View>
          
          <View style={{ marginBottom: theme.spacing.s }}>
            <Box flexDirection="row" alignItems="center" justifyContent="center">
              <Ionicons name="search" size={14} color={theme.colors.textSecondary} style={{ marginRight: 6 }} />
              <Text variant="caption" color="textSecondary" textAlign="center" numberOfLines={1}>
                Identify acne triggers and patterns
              </Text>
            </Box>
          </View>
          
          <View>
            <Box flexDirection="row" alignItems="center" justifyContent="center">
              <Ionicons name="phone-portrait" size={14} color={theme.colors.textSecondary} style={{ marginRight: 6 }} />
              <Text variant="caption" color="textSecondary" textAlign="center" numberOfLines={1}>
                Build your clear skin routine
              </Text>
            </Box>
          </View>
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
              disabled={!canProceed}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
