import React, { useState } from 'react';
import { SafeAreaView } from 'react-native';
import { Box, Text } from '../../components';
import { useThemeContext } from '../../theme/ThemeContext';
import { TestQuestionStep } from './steps/TestQuestionStep';

interface TestQuestion {
  id: string;
  type: 'rating' | 'yesNo' | 'text' | 'scale';
  question: string;
  required: boolean;
  options?: string[];
}

interface Test {
  _id: string;
  name: string;
  description?: string;
  formStructure: {
    questions: TestQuestion[];
  };
}

interface TestQuestionsFlowProps {
  test: Test;
  onComplete: (answers: Array<{
    questionId: string;
    answer: string | number | boolean;
    questionType: 'rating' | 'yesNo' | 'text' | 'scale';
  }>) => void;
  onCancel: () => void;
}

export function TestQuestionsFlow({ test, onComplete, onCancel }: TestQuestionsFlowProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const { theme } = useThemeContext();
  
  const questions = test.formStructure.questions;
  const currentQuestion = questions[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === questions.length - 1;
  
  // Check if current question is answered
  const isCurrentQuestionAnswered = () => {
    if (!currentQuestion) return false;
    if (!currentQuestion.required) return true;
    return answers[currentQuestion.id] !== undefined && answers[currentQuestion.id] !== '';
  };
  
  const goToNextStep = () => {
    if (isLastStep) {
      // Convert answers to the format expected by onComplete
      const formattedAnswers = questions.map(question => ({
        questionId: question.id,
        answer: answers[question.id],
        questionType: question.type,
      })).filter(answer => answer.answer !== undefined);
      
      onComplete(formattedAnswers);
    } else {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };
  
  const goToPreviousStep = () => {
    if (!isFirstStep) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };
  
  const goToStep = (index: number) => {
    setCurrentStepIndex(index);
  };
  
  const updateAnswer = (questionId: string, answer: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer,
    }));
  };
  
  const getProgressPercentage = () => {
    const answeredCount = questions.filter(q => 
      q.required ? answers[q.id] !== undefined && answers[q.id] !== '' : true
    ).length;
    return (answeredCount / questions.length) * 100;
  };
  
  if (!currentQuestion) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Box flex={1} justifyContent="center" alignItems="center">
          <Text variant="title" color="textPrimary">No questions found</Text>
        </Box>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Box flex={1}>
        
        {/* Progress dots */}
        <Box flexDirection="row" justifyContent="center" alignItems="center">
          {Array.from({ length: questions.length }).map((_, index) => (
            <Box
              key={index}
              width={8}
              height={8}
              borderRadius="pill"
              marginHorizontal="xs"
              backgroundColor={index === currentStepIndex ? "primary" : "glassBorder"}
              style={{
                opacity: index === currentStepIndex ? 1 : 0.4,
              }}
            />
          ))}
        </Box>
        
        {/* Question content */}
        <TestQuestionStep
          question={currentQuestion}
          currentIndex={currentStepIndex}
          totalSteps={questions.length}
          onNext={goToNextStep}
          onPrevious={goToPreviousStep}
          onGoToStep={goToStep}
          isFirstStep={isFirstStep}
          isLastStep={isLastStep}
          answer={answers[currentQuestion.id]}
          onAnswerChange={(answer) => updateAnswer(currentQuestion.id, answer)}
          canProceed={isCurrentQuestionAnswered()}
        />
      </Box>
    </SafeAreaView>
  );
}
