import React, { useState } from 'react';
import { TouchableOpacity, ScrollView, View } from 'react-native';
import { Box, Text } from '../../../components';
import { OnboardingButton } from '../../../components/onboarding';
import { useThemeContext } from '../../../../src/theme/ThemeContext';

interface GoalsStepProps {
  step: any;
  currentIndex: number;
  totalSteps: number;
  onNext: () => void;
  onPrevious: () => void;
  onGoToStep: (index: number) => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

type SkinGoal = 'trackChanges' | 'monitorHealing' | 'preventIssues' | 'generalHealth' | 'compareProgress';

export function GoalsStep({
  onNext,
  onPrevious,
  isFirstStep,
  isLastStep
}: GoalsStepProps) {
  const { theme } = useThemeContext();
  const [selectedGoals, setSelectedGoals] = useState<SkinGoal[]>([]);
  
  const handleGoalToggle = (goal: SkinGoal) => {
    if (selectedGoals.includes(goal)) {
      setSelectedGoals(selectedGoals.filter(g => g !== goal));
    } else {
      setSelectedGoals([...selectedGoals, goal]);
    }
  };
  
  const goals: { value: SkinGoal; label: string; emoji: string; description: string }[] = [
    { 
      value: 'trackChanges', 
      label: 'Track Changes Over Time', 
      emoji: '📈',
      description: 'Monitor how your skin evolves'
    },
    { 
      value: 'monitorHealing', 
      label: 'Monitor Healing Progress', 
      emoji: '🩹',
      description: 'Track recovery from skin issues'
    },
    { 
      value: 'preventIssues', 
      label: 'Prevent Future Issues', 
      emoji: '🛡️',
      description: 'Identify patterns to avoid problems'
    },
    { 
      value: 'generalHealth', 
      label: 'General Skin Health', 
      emoji: '✨',
      description: 'Overall skin wellness monitoring'
    },
    { 
      value: 'compareProgress', 
      label: 'Compare Before & After', 
      emoji: '🔄',
      description: 'See your skin transformation'
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
          Set Your Goals
        </Text>
        
        {/* Step Subtitle */}
        <Text 
          variant="subtitle" 
          color="textSecondary" 
          textAlign="center"
          marginBottom="xl"
          paddingHorizontal="l"
        >
          What would you like to achieve with DermaTrack? Choose all that apply.
        </Text>
        
        {/* Goals Icon */}
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
            🎯
          </Text>
        </View>
        
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
            💪 Setting clear goals helps you stay motivated and track your progress effectively.
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
