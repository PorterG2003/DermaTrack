import React, { useState } from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { Text, StepIcon, FaceSilhouette } from '../../components';
import { OnboardingButton } from '../../components/onboarding';
import { useThemeContext } from '../../theme/ThemeContext';

interface PhotoWalkthroughScreenProps {
  onStart: () => void;
  onBack?: () => void;
}

export function PhotoWalkthroughScreen({ onStart, onBack }: PhotoWalkthroughScreenProps) {
  const { theme } = useThemeContext();
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Photo Setup Guide",
      subtitle: "Learn how to take consistent photos for accurate acne tracking",
      icon: "📸",
      content: "You'll take 3 photos: left side, straight on, and right side. This gives us a complete view of your skin."
    },
    {
      title: "Choose Your Location",
      subtitle: "Pick a spot you can return to regularly",
      icon: "📍",
      content: "Find a well-lit area with consistent lighting. Natural light near a window works best. Avoid direct sunlight or harsh shadows."
    },
    {
      title: "Clear Your Face",
      subtitle: "Remove any obstructions for clear photos",
      icon: "✨",
      content: "Remove glasses, pull back hair, and ensure your face is clearly visible. This helps us see your skin clearly."
    },
    {
      title: "Position Your Face",
      subtitle: "Use the face silhouette guides for consistency",
      icon: "👻",
      content: "Position your face within the silhouette guides on screen. Each photo will show your previous photo as a ghost overlay to maintain consistency."
    },
    {
      title: "Take Three Photos",
      subtitle: "Left, center, and right angles",
      icon: "🔄",
      content: "1. Left side: Turn your head 45° to the left\n2. Center: Face straight ahead\n3. Right side: Turn your head 45° to the right\n\nUse the face silhouette guides to position yourself perfectly!"
    },
    {
      title: "Ready to Start?",
      subtitle: "Let's take your first progress photos!",
      icon: "🚀",
      content: "Remember: Take photos in the same location with the same lighting each time for the best tracking results."
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentStepData = steps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  return (
    <ScrollView 
      style={{ flex: 1 }}
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={{ 
        flex: 1, 
        padding: theme.spacing.l,
        paddingTop: theme.spacing.xl,
      }}>
        {/* Progress Indicator */}
        <View style={{
          flexDirection: 'row',
          justifyContent: 'center',
          marginBottom: theme.spacing.xl,
        }}>
          {steps.map((_, index) => (
            <View
              key={index}
              style={{
                width: 12,
                height: 12,
                borderRadius: 6,
                backgroundColor: index === currentStep ? theme.colors.primary : theme.colors.backgroundMuted,
                marginHorizontal: 4,
                borderWidth: 1,
                borderColor: index === currentStep ? theme.colors.primary : theme.colors.glassBorder,
              }}
            />
          ))}
        </View>

        {/* Step Icon */}
        <StepIcon 
          icon={currentStepData.icon}
          size="medium"
          variant="emoji"
        />

        {/* Step Title */}
        <Text 
          variant="heading" 
          color="textPrimary" 
          textAlign="center"
          marginBottom="m"
        >
          {currentStepData.title}
        </Text>

        {/* Step Subtitle */}
        <Text 
          variant="subtitle" 
          color="textSecondary" 
          textAlign="center"
          marginBottom="xl"
        >
          {currentStepData.subtitle}
        </Text>

        {/* Step Content */}
        <View style={{
          backgroundColor: theme.colors.backgroundMuted,
          borderRadius: theme.borderRadii.l,
          padding: theme.spacing.l,
          marginBottom: theme.spacing.xl,
          borderWidth: 1,
          borderColor: theme.colors.glassBorder,
        }}>
          <Text 
            variant="subtitle" 
            color="textPrimary" 
            textAlign="center"
            marginBottom="m"
          >
            💡 What to do:
          </Text>
          <Text 
            variant="subtitle" 
            color="textSecondary" 
            textAlign="center"
            lineHeight={24}
          >
            {currentStepData.content}
          </Text>
        </View>

        {/* Visual Guide for Photo Positions */}
        {currentStep === 4 && (
          <View style={{
            backgroundColor: theme.colors.backgroundMuted,
            borderRadius: theme.borderRadii.l,
            padding: theme.spacing.l,
            marginBottom: theme.spacing.xl,
            borderWidth: 1,
            borderColor: theme.colors.glassBorder,
            alignItems: 'center',
          }}>
            <Text 
              variant="subtitle" 
              color="textPrimary" 
              textAlign="center"
              marginBottom="m"
            >
              📱 Photo Positions:
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '100%', alignItems: 'center' }}>
              <View style={{ alignItems: 'center' }}>
                <FaceSilhouette angle="left" size={80} opacity={0.6} />
                <Text variant="caption" color="textSecondary" textAlign="center" marginTop="s">Left Side</Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <FaceSilhouette angle="center" size={80} opacity={0.6} />
                <Text variant="caption" color="textSecondary" textAlign="center" marginTop="s">Center</Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <FaceSilhouette angle="right" size={80} opacity={0.6} />
                <Text variant="caption" color="textSecondary" textAlign="center" marginTop="s">Right Side</Text>
              </View>
            </View>
          </View>
        )}

        {/* Navigation Buttons */}
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          gap: theme.spacing.m,
          marginTop: 'auto',
          paddingBottom: theme.spacing.l,
        }}>
          {/* Back Button */}
          {!isFirstStep && (
            <View style={{ flex: 1 }}>
              <OnboardingButton
                title="Previous"
                onPress={previousStep}
                variant="secondary"
              />
            </View>
          )}

          {/* Next/Start Button */}
          <View style={{ flex: 1 }}>
            <OnboardingButton
              title={isLastStep ? "Start Taking Photos" : "Next"}
              onPress={isLastStep ? onStart : nextStep}
              variant="primary"
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
