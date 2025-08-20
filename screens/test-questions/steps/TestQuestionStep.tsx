import React, { useEffect, useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { Box, GuideButton, Input, Text } from '../../../components';
import { useThemeContext } from '../../../theme/ThemeContext';

interface TestQuestion {
  id: string;
  type: 'rating' | 'yesNo' | 'text' | 'scale';
  question: string;
  required: boolean;
  options?: string[];
}

interface TestQuestionStepProps {
  question: TestQuestion;
  currentIndex: number;
  totalSteps: number;
  onNext: () => void;
  onPrevious: () => void;
  onGoToStep: (index: number) => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  answer: any;
  onAnswerChange: (answer: any) => void;
  canProceed: boolean;
}

export function TestQuestionStep({
  question,
  currentIndex,
  totalSteps,
  onNext,
  onPrevious,
  isFirstStep,
  isLastStep,
  answer,
  onAnswerChange,
  canProceed
}: TestQuestionStepProps) {
  const { theme } = useThemeContext();
  const [localAnswer, setLocalAnswer] = useState<any>(answer);
  
  // Update local answer when prop changes
  useEffect(() => {
    setLocalAnswer(answer);
  }, [answer]);
  
  const handleAnswerChange = (newAnswer: any) => {
    setLocalAnswer(newAnswer);
    onAnswerChange(newAnswer);
  };
  
  const renderQuestionInput = () => {
    switch (question.type) {
      case 'rating':
        return renderRatingSlider();
      case 'yesNo':
        return renderYesNoInput();
      case 'text':
        return renderTextInput();
      case 'scale':
        return renderScaleInput();
      default:
        return null;
    }
  };
  
  const renderRatingSlider = () => {
    const defaultScale = ['None', 'Mild', 'Moderate', 'Severe'];
    const scaleOptions = question.options || defaultScale;
    
    return (
      <View style={{ width: '100%' }}>
        <Text variant="subtitle" color="textSecondary" marginBottom="l" textAlign="center">
          Select the option that best describes your experience
        </Text>
        <View style={{ width: '100%' }}>
          {scaleOptions.map((option, index) => (
            <TouchableOpacity
              key={option}
              onPress={() => handleAnswerChange(index)}
              style={{
                paddingHorizontal: theme.spacing.l,
                paddingVertical: theme.spacing.m,
                marginBottom: theme.spacing.s,
                borderRadius: theme.borderRadii.m,
                backgroundColor: localAnswer === index 
                  ? theme.colors.primary 
                  : theme.colors.backgroundMuted,
                borderWidth: 1,
                borderColor: localAnswer === index 
                  ? theme.colors.primary 
                  : theme.colors.glassBorder,
                flexDirection: 'row',
                alignItems: 'center',
                minHeight: 56,
              }}
            >
              <View style={{
                width: 18,
                height: 18,
                borderRadius: 9,
                backgroundColor: localAnswer === index ? 'white' : 'transparent',
                borderWidth: 2,
                borderColor: localAnswer === index ? theme.colors.primary : theme.colors.glassBorder,
                marginRight: theme.spacing.m,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                {localAnswer === index && (
                  <View style={{
                    width: 6,
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: theme.colors.primary,
                  }} />
                )}
              </View>
              <Text 
                variant="subtitle" 
                color={localAnswer === index ? 'white' : 'textPrimary'}
                flex={1}
                fontWeight="500"
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };
  
  const renderYesNoInput = () => {
    const options = [
      { value: true, label: 'Yes' },
      { value: false, label: 'No' }
    ];
    
    return (
      <View style={{ width: '100%' }}>
        <View style={{ 
          flexDirection: 'row', 
          justifyContent: 'space-between', 
          gap: theme.spacing.m
        }}>
          {options.map((option) => (
            <TouchableOpacity
              key={option.label}
              onPress={() => handleAnswerChange(option.value)}
              style={{
                flex: 1,
                paddingVertical: theme.spacing.l,
                paddingHorizontal: theme.spacing.l,
                borderRadius: theme.borderRadii.m,
                backgroundColor: localAnswer === option.value 
                  ? theme.colors.primary 
                  : theme.colors.backgroundMuted,
                borderWidth: 1,
                borderColor: localAnswer === option.value 
                  ? theme.colors.primary 
                  : theme.colors.glassBorder,
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 64,
              }}
            >
              <Text 
                variant="subtitle" 
                color={localAnswer === option.value ? 'white' : 'textPrimary'}
                fontWeight="600"
                textAlign="center"
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };
  
  const renderTextInput = () => {
    return (
      <View style={{ width: '100%' }}>
        <Input
          placeholder="Type your answer here..."
          value={localAnswer || ''}
          onChangeText={handleAnswerChange}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>
    );
  };
  
  const renderScaleInput = () => {
    const scaleOptions = question.options || ['Very Low', 'Low', 'Medium', 'High', 'Very High'];
    
    return (
      <View style={{ width: '100%' }}>
        <Text variant="subtitle" color="textSecondary" marginBottom="l" textAlign="center">
          Select the option that best describes your experience
        </Text>
        <View style={{ width: '100%' }}>
          {scaleOptions.map((option, index) => (
            <TouchableOpacity
              key={option}
              onPress={() => handleAnswerChange(option)}
              style={{
                paddingHorizontal: theme.spacing.l,
                paddingVertical: theme.spacing.m,
                marginBottom: theme.spacing.s,
                borderRadius: theme.borderRadii.m,
                backgroundColor: localAnswer === option 
                  ? theme.colors.primary 
                  : theme.colors.backgroundMuted,
                borderWidth: 1,
                borderColor: localAnswer === option 
                  ? theme.colors.primary 
                  : theme.colors.glassBorder,
                flexDirection: 'row',
                alignItems: 'center',
                minHeight: 56,
              }}
            >
              <View style={{
                width: 18,
                height: 18,
                borderRadius: 9,
                backgroundColor: localAnswer === option ? 'white' : 'transparent',
                borderWidth: 2,
                borderColor: localAnswer === option ? theme.colors.primary : theme.colors.glassBorder,
                marginRight: theme.spacing.m,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                {localAnswer === option && (
                  <View style={{
                    width: 6,
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: theme.colors.primary,
                  }} />
                )}
              </View>
              <Text 
                variant="subtitle" 
                color={localAnswer === option ? 'white' : 'textPrimary'}
                flex={1}
                fontWeight="500"
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };
  
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
        {/* Question Title */}
        <Text 
          variant="heading" 
          color="textPrimary" 
          textAlign="center"
          marginBottom="s"
          paddingHorizontal="m"
          lineHeight={32}
        >
          {question.question}
        </Text>
        
        {/* Required indicator */}
        {question.required && (
          <Text 
            variant="caption" 
            color="textSecondary" 
            textAlign="center"
            marginBottom="xl"
          >
            Required
          </Text>
        )}
        
        {/* Question Input */}
        <Box width="100%" marginBottom="xl">
          {renderQuestionInput()}
        </Box>
        
        {/* Navigation Buttons - positioned below content for easy reach */}
        <GuideButton
          onNext={onNext}
          onPrevious={onPrevious}
          isFirstStep={isFirstStep}
          isLastStep={isLastStep}
          canProceed={canProceed}
          nextText={isLastStep ? "Complete" : "Next"}
        />
      </View>
    </ScrollView>
  );
}
