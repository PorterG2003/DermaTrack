import React, { useState } from 'react';
import { TouchableOpacity, ScrollView, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Box, Text } from '../../../components';
import { OnboardingButton } from '../../../components/onboarding';
import { useThemeContext } from '../../../../src/theme/ThemeContext';

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
        <View style={{
          width: 140,
          height: 140,
          borderRadius: theme.borderRadii.xl,
          backgroundColor: theme.colors.backgroundMuted,
          borderWidth: 1,
          borderColor: theme.colors.glassBorder,
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: theme.spacing.xl,
          shadowColor: theme.colors.primary,
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.3,
          shadowRadius: 16,
          elevation: 8,
        }}>
          <Text variant="title" color="primary" fontSize={64} height={140} lineHeight={140}>
            🩺
          </Text>
        </View>
        
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
          Your personal skin health companion. Track, monitor, and understand your skin better than ever before.
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
            ✨ What you'll be able to do:
          </Text>
          
          <View style={{ marginBottom: theme.spacing.s }}>
            <Text variant="caption" color="textSecondary" textAlign="center" numberOfLines={1}>
              📸 Take photos of skin concerns
            </Text>
          </View>
          
          <View style={{ marginBottom: theme.spacing.s }}>
            <Text variant="caption" color="textSecondary" textAlign="center" numberOfLines={1}>
              📊 Track changes over time
            </Text>
          </View>
          
          <View style={{ marginBottom: theme.spacing.s }}>
            <Text variant="caption" color="textSecondary" textAlign="center" numberOfLines={1}>
              🔍 Monitor healing progress
            </Text>
          </View>
          
          <View>
            <Text variant="caption" color="textSecondary" textAlign="center" numberOfLines={1}>
              📱 Access your data anywhere
            </Text>
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
