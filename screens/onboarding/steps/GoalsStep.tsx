import React, { useState, useEffect } from 'react';
import { TouchableOpacity, ScrollView, View } from 'react-native';
import { Box, Text, StepIcon } from '../../../components';
import { OnboardingButton } from '../../../components/onboarding';
import { useThemeContext } from '../../../theme/ThemeContext';
import { Profile } from '../../../hooks/useProfile';

interface GoalsStepProps {
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

type SkinGoal = 'clearAcne' | 'preventBreakouts' | 'reduceScars' | 'buildRoutine' | 'trackProgress';

export function GoalsStep({
  onNext,
  onPrevious,
  isFirstStep,
  isLastStep,
  profile,
  updateProfile
}: GoalsStepProps) {
  const { theme } = useThemeContext();
  const [selectedGoals, setSelectedGoals] = useState<SkinGoal[]>([]);
  
  // Load existing data when component mounts
  useEffect(() => {
    if (profile.goals) {
      setSelectedGoals(profile.goals as SkinGoal[]);
    }
  }, [profile.goals]);
  
  const handleGoalToggle = async (goal: SkinGoal) => {
    let newGoals: SkinGoal[];
    if (selectedGoals.includes(goal)) {
      newGoals = selectedGoals.filter(g => g !== goal);
    } else {
      newGoals = [...selectedGoals, goal];
    }
    setSelectedGoals(newGoals);
    // Save to onboarding data
    await updateProfile({ goals: newGoals });
  };
  
  const goals: { value: SkinGoal; label: string; emoji: string; description: string }[] = [
    { 
      value: 'clearAcne', 
      label: 'Clear Current Acne', 
      emoji: '✨',
      description: 'Get rid of existing breakouts'
    },
    { 
      value: 'preventBreakouts', 
      label: 'Prevent Future Breakouts', 
      emoji: '🛡️',
      description: 'Stop new acne from forming'
    },
    { 
      value: 'reduceScars', 
      label: 'Reduce Acne Scars', 
      emoji: '🩹',
      description: 'Minimize marks and scarring'
    },
    { 
      value: 'buildRoutine', 
      label: 'Build Acne Routine', 
      emoji: '📋',
      description: 'Create effective treatment plan'
    },
    { 
      value: 'trackProgress', 
      label: 'Track Clear Skin Progress', 
      emoji: '📈',
      description: 'See your transformation journey'
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
          Set Your Acne Goals
        </Text>
        
        {/* Step Subtitle */}
        <Text 
          variant="subtitle" 
          color="textSecondary" 
          textAlign="center"
          marginBottom="xl"
          paddingHorizontal="l"
        >
          What would you like to achieve with your acne treatment? Choose all that apply.
        </Text>
        
        {/* Goals Icon */}
        <StepIcon 
          icon="🎯"
          size="large"
          variant="emoji"
        />
        
        {/* Goals Selection */}
        <View style={{ width: '100%', marginBottom: theme.spacing.xl }}>
          {goals.map((goal, index) => (
            <TouchableOpacity 
              key={goal.value}
              onPress={() => handleGoalToggle(goal.value)}
              style={{ marginBottom: index < goals.length - 1 ? theme.spacing.m : 0 }}
            >
              <View style={{
                backgroundColor: selectedGoals.includes(goal.value) ? theme.colors.primary : theme.colors.backgroundMuted,
                borderRadius: theme.borderRadii.l,
                padding: theme.spacing.m,
                borderWidth: 2,
                borderColor: selectedGoals.includes(goal.value) ? theme.colors.primary : theme.colors.glassBorder,
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: selectedGoals.includes(goal.value) ? theme.colors.primary : theme.colors.glassBorder,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: selectedGoals.includes(goal.value) ? 0.3 : 0.1,
                shadowRadius: 8,
                elevation: selectedGoals.includes(goal.value) ? 4 : 2,
              }}>
                <Text 
                  variant="title" 
                  color={selectedGoals.includes(goal.value) ? 'white' : 'textPrimary'}
                  textAlign="center"
                  marginBottom="xs"
                >
                  {goal.emoji} {goal.label}
                </Text>
                <Text 
                  variant="caption" 
                  color={selectedGoals.includes(goal.value) ? 'white' : 'textSecondary'}
                  textAlign="center"
                >
                  {goal.description}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        
        {/* Selection Summary */}
        {selectedGoals.length > 0 && (
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
              🎯 {selectedGoals.length} goal{selectedGoals.length !== 1 ? 's' : ''} selected
            </Text>
          </View>
        )}
        
        {/* Motivation Note */}
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
            💪 Setting clear acne goals helps you stay motivated and track your clear skin progress effectively.
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
              disabled={selectedGoals.length === 0}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
