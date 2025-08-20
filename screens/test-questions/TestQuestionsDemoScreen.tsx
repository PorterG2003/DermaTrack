import React, { useState } from 'react';
import { Alert, SafeAreaView } from 'react-native';
import { Box, Button, Text } from '../../components';
import { useTestCheckins } from '../../hooks/useTestCheckins';
import { useThemeContext } from '../../theme/ThemeContext';
import { TestQuestionsFlow } from './TestQuestionsFlow';

// Sample test data for demonstration
const sampleTest = {
  _id: 'sample-test-1',
  name: 'New Product Test',
  description: 'Testing a new acne treatment product',
  formStructure: {
    questions: [
      {
        id: 'q1',
        type: 'rating' as const,
        question: 'How would you rate your skin condition today?',
        required: true,
        options: ['None', 'Mild', 'Moderate', 'Severe'],
      },
      {
        id: 'q2',
        type: 'yesNo' as const,
        question: 'Did you use the new product today?',
        required: true,
      },
      {
        id: 'q3',
        type: 'text' as const,
        question: 'Describe any side effects or reactions you noticed:',
        required: false,
      },
      {
        id: 'q4',
        type: 'scale' as const,
        question: 'How effective was the product today?',
        required: true,
        options: ['Not Effective', 'Slightly Effective', 'Moderately Effective', 'Very Effective', 'Extremely Effective'],
      },
      {
        id: 'q5',
        type: 'rating' as const,
        question: 'How would you rate the texture/applicability of the product?',
        required: true,
        options: ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'],
      },
    ],
  },
};

export function TestQuestionsDemoScreen() {
  const [showQuestions, setShowQuestions] = useState(false);
  const { theme } = useThemeContext();
  const { submitCheckInWithAnswers } = useTestCheckins();

  const handleStartQuestions = () => {
    setShowQuestions(true);
  };

  const handleQuestionsComplete = async (answers: any[]) => {
    try {
      // In a real app, you would get the actual userId and testId
      const userId = 'demo-user-123';
      const testId = sampleTest._id;
      
      const result = await submitCheckInWithAnswers(userId, testId, answers);
      
      Alert.alert(
        'Success!',
        `Check-in created with ID: ${result.checkInId}\nTest check-in ID: ${result.testCheckinId}`,
        [
          {
            text: 'OK',
            onPress: () => setShowQuestions(false),
          },
        ]
      );
      
      console.log('Check-in created successfully:', result);
    } catch (error) {
      Alert.alert('Error', 'Failed to create check-in. Please try again.');
      console.error('Error creating check-in:', error);
    }
  };

  const handleCancel = () => {
    setShowQuestions(false);
  };

  if (showQuestions) {
    return (
      <TestQuestionsFlow
        test={sampleTest}
        onComplete={handleQuestionsComplete}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Box flex={1} padding="l" justifyContent="center" alignItems="center">
        <Text variant="heading" color="textPrimary" marginBottom="xl" textAlign="center">
          Test Questions Demo
        </Text>
        
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
          <Text variant="subtitle" color="textPrimary" marginBottom="m" textAlign="center">
            Sample Test: {sampleTest.name}
          </Text>
          
          <Text variant="subtitle" color="textSecondary" marginBottom="m" textAlign="center">
            {sampleTest.description}
          </Text>
          
          <Text variant="caption" color="textSecondary" textAlign="center">
            This test has {sampleTest.formStructure.questions.length} questions including:
          </Text>
          
          <Box marginTop="m">
            {sampleTest.formStructure.questions.map((question, index) => (
              <Text key={question.id} variant="subtitle" color="textSecondary" marginBottom="xs">
                {index + 1}. {question.question} ({question.type})
                {question.required && ' *'}
              </Text>
            ))}
          </Box>
        </Box>
        
        <Button
          onPress={handleStartQuestions}
          variant="primary"
          size="large"
        >
          Start Test Questions
        </Button>
        
        <Text variant="caption" color="textSecondary" marginTop="l" textAlign="center">
          This demo shows how the test questions flow works. In a real app, this would be integrated with your actual test data and user authentication.
        </Text>
      </Box>
    </SafeAreaView>
  );
}
