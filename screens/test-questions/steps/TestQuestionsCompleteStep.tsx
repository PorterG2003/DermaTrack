import React from 'react';
import { ScrollView, View } from 'react-native';
import { Box, GuideButton, Text } from '../../../components';
import { useThemeContext } from '../../../theme/ThemeContext';

interface TestQuestionsCompleteStepProps {
  onComplete: () => void;
  onPrevious: () => void;
  testName: string;
  answersCount: number;
}

export function TestQuestionsCompleteStep({
  onComplete,
  onPrevious,
  testName,
  answersCount
}: TestQuestionsCompleteStepProps) {
  const { theme } = useThemeContext();
  
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
        {/* Success Icon */}
        <Box 
          width={80} 
          height={80} 
          borderRadius="full"
          backgroundColor="success"
          justifyContent="center"
          alignItems="center"
          marginBottom="xl"
        >
          <Text variant="heading" color="white" fontSize={40}>
            ✓
          </Text>
        </Box>
        
        {/* Completion Title */}
        <Text 
          variant="heading" 
          color="textPrimary" 
          textAlign="center"
          marginBottom="m"
          paddingHorizontal="m"
        >
          Test Questions Complete!
        </Text>
        
        {/* Completion Message */}
        <Text 
          variant="subtitle" 
          color="textSecondary" 
          textAlign="center"
          marginBottom="xl"
          paddingHorizontal="l"
        >
          You've successfully answered all {answersCount} questions for "{testName}". Your responses have been saved and will help track your progress.
        </Text>
        
        {/* Summary Box */}
        <Box 
          backgroundColor="backgroundMuted"
          borderRadius="l"
          padding="l"
          marginBottom="xl"
          borderWidth={1}
          borderColor="glassBorder"
          width="100%"
          maxWidth="90%"
        >
          <Text 
            variant="subtitle" 
            color="textPrimary" 
            textAlign="center"
            marginBottom="m"
          >
            What happens next?
          </Text>
          
          <Box marginBottom="s">
            <Text variant="body" color="textSecondary" marginBottom="xs">
              • Your answers are saved with this check-in
            </Text>
            <Text variant="body" color="textSecondary" marginBottom="xs">
              • Progress will be tracked over time
            </Text>
            <Text variant="body" color="textSecondary" marginBottom="xs">
              • You can review trends in your dashboard
            </Text>
          </Box>
        </Box>
        
        {/* Action Buttons */}
        <GuideButton
          onNext={onComplete}
          onPrevious={onPrevious}
          isFirstStep={false}
          isLastStep={true}
          canProceed={true}
          nextText="Finish Check-in"
        />
      </View>
    </ScrollView>
  );
}
