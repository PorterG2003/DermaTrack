import { useMutation } from 'convex/react';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { Button } from '../../components/ui/buttons/Button';
import { AISummaryDisplay } from '../../components/ui/feedback/AISummaryDisplay';
import { NoActiveTestScreen } from '../../components/ui/feedback/NoActiveTestScreen';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';
import { useAISummarization } from '../../hooks/useAISummarization';
import { useProfile } from '../../hooks/useProfile';
import { useThemeContext } from '../../theme/ThemeContext';
import { TestQuestionsFlow } from '../test-questions/TestQuestionsFlow';
import { ImageCaptureScreen } from './ImageCaptureScreen';

interface UnifiedCheckInFlowProps {
  test?: {
    _id: Id<"tests">;
    name: string;
    description?: string;
    formStructure: {
      questions: Array<{
        id: string;
        type: 'rating' | 'yesNo' | 'text' | 'scale';
        question: string;
        required: boolean;
        options?: string[];
      }>;
    };
  };
  userId: string;
  onComplete: () => void;
  onCancel: () => void;
}

interface PhotoData {
  leftPhotoId?: Id<"photos">;
  centerPhotoId?: Id<"photos">;
  rightPhotoId?: Id<"photos">;
}

export function UnifiedCheckInFlow({ test, userId, onComplete, onCancel }: UnifiedCheckInFlowProps) {
  const { theme } = useThemeContext();
  const [currentStep, setCurrentStep] = useState<'photos' | 'questions' | 'noTest' | 'completing'>('photos');
  const [photoData, setPhotoData] = useState<PhotoData>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [aiSummary, setAiSummary] = useState<string | null>(null);

  // Animation values for loading dots
  const dotAnimations = [
    useRef(new Animated.Value(0.6)).current,
    useRef(new Animated.Value(0.6)).current,
    useRef(new Animated.Value(0.6)).current,
  ];

  // Mutations to create check-ins
  const createCheckInWithTestAnswers = useMutation(api.checkIns.createCheckInWithTestAnswers);
  const createCheckIn = useMutation(api.checkIns.createCheckIn);
  
  // AI summarization hook
  const { generateAndSaveSummary } = useAISummarization();
  
  // User profile for AI summarization context
  const { profile } = useProfile();

  // Animate loading dots when AI summarization is happening
  useEffect(() => {
    if (isGeneratingSummary) {
      const animations = dotAnimations.map((anim, index) => 
        Animated.loop(
          Animated.sequence([
            Animated.timing(anim, {
              toValue: 1,
              duration: 600,
              delay: index * 200,
              useNativeDriver: true,
            }),
            Animated.timing(anim, {
              toValue: 0.6,
              duration: 600,
              useNativeDriver: true,
            }),
          ])
        )
      );
      
      animations.forEach(animation => animation.start());
      
      return () => {
        animations.forEach(animation => animation.stop());
      };
    }
  }, [isGeneratingSummary, dotAnimations]);

  const handlePhotosComplete = (photos: PhotoData) => {
    setPhotoData(photos);
    // If no test is available, show the no test screen
    if (!test) {
      setCurrentStep('noTest');
    } else {
      setCurrentStep('questions');
    }
  };

  const handleQuestionsComplete = async (answers: Array<{
    questionId: string;
    answer: string | number | boolean;
    questionType: 'rating' | 'yesNo' | 'text' | 'scale';
  }>) => {
    if (!photoData.leftPhotoId || !photoData.centerPhotoId || !photoData.rightPhotoId) {
      console.error('Missing photo data');
      return;
    }

    setIsSubmitting(true);
    try {
      if (test) {
        // Create the complete check-in with photos and test answers
        const result = await createCheckInWithTestAnswers({
          userId,
          testId: test._id,
          leftPhotoId: photoData.leftPhotoId,
          centerPhotoId: photoData.centerPhotoId,
          rightPhotoId: photoData.rightPhotoId,
          testAnswers: answers,
        });

        console.log('Unified check-in created successfully:', result);
        
        // Generate AI summary if we have a test check-in
        if (result.testCheckinId && answers.length > 0) {
          try {
            // Prepare data for AI summarization
            const summarizationData = {
              testName: test.name,
              testDescription: test.description,
              userProfile: {
                skinType: profile?.skinType,
                primaryConcerns: profile?.primaryConcerns,
                goals: profile?.goals,
              },
              answers: answers.map((answer, index) => {
                const question = test.formStructure.questions.find(q => q.id === answer.questionId);
                return {
                  question: question?.question || `Question ${index + 1}`,
                  answer: answer.answer,
                  questionType: answer.questionType,
                };
              }),
              checkInDate: new Date().toLocaleDateString(),
            };
            
            // Show completing state while AI summarization is happening
            setCurrentStep('completing');
            setIsGeneratingSummary(true);
            
            // Generate AI summary asynchronously (don't wait for completion)
            generateAndSaveSummary(result.testCheckinId, summarizationData)
              .then((summaryResult) => {
                if (summaryResult.success && summaryResult.summary) {
                  console.log('AI summary generated successfully:', summaryResult.summary);
                  setAiSummary(summaryResult.summary);
                } else {
                  console.warn('AI summary generation failed:', summaryResult.error);
                }
                // Don't call onComplete here - let the user see the summary first
              })
              .catch((error) => {
                console.error('AI summary generation error:', error);
                // Don't call onComplete here - let the user see the completion state
              })
              .finally(() => {
                setIsGeneratingSummary(false);
              });
          } catch (summaryError) {
            console.warn('Failed to initiate AI summary generation:', summaryError);
            // Don't block the main flow if AI summarization fails
            setCurrentStep('completing');
          }
        } else {
          // No test check-in, complete immediately
          onComplete();
        }
      } else {
        // Create a basic check-in with just photos (no test)
        const result = await createCheckIn({
          userId,
          leftPhotoId: photoData.leftPhotoId,
          centerPhotoId: photoData.centerPhotoId,
          rightPhotoId: photoData.rightPhotoId,
        });

        console.log('Basic check-in created successfully:', result);
        onComplete();
      }
      
      // Remove this duplicate onComplete() call
      // onComplete();
    } catch (error) {
      console.error('Failed to create unified check-in:', error);
      // TODO: Show error message to user
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackFromQuestions = () => {
    setCurrentStep('photos');
  };

  const handleBackFromNoTest = () => {
    setCurrentStep('photos');
  };

  if (currentStep === 'photos') {
    return (
      <ImageCaptureScreen
        onPhotosComplete={(photoIds) => {
          handlePhotosComplete(photoIds);
        }}
        onBack={onCancel}
        userId={userId}
      />
    );
  }

  if (currentStep === 'noTest') {
    return (
      <NoActiveTestScreen
        onBack={handleBackFromNoTest}
        onSelectTest={() => {
          // TODO: Navigate to test selection screen
          // For now, just go back to photos
          handleBackFromNoTest();
        }}
        onCreateBasicCheckIn={() => {
          // Create a basic check-in with just photos
          handleQuestionsComplete([]);
        }}
      />
    );
  }

  if (currentStep === 'completing') {
    return (
      <View style={styles.completingContent}>
        {isGeneratingSummary && (
          <View style={styles.loadingSection}>
            <Text style={[styles.loadingTitle, { color: theme.colors.textPrimary }]}>
              Generating AI Insights...
            </Text>
            <View style={styles.loadingContainer}>
              {dotAnimations.map((anim, index) => (
                <Animated.View
                  key={index}
                  style={[
                    styles.loadingDot,
                    { 
                      backgroundColor: theme.colors.primary,
                      opacity: anim,
                    }
                  ]}
                />
              ))}
            </View>
          </View>
        )}
        
        {!aiSummary && !isGeneratingSummary && (
          <View style={styles.buttonContainer}>
            <Button
              variant="primary"
              onPress={onComplete}
              style={styles.continueButton}
            >
              Continue
            </Button>
          </View>
        )}
        
        {aiSummary && !isGeneratingSummary && (
          <View style={styles.summarySection}>
            <AISummaryDisplay summary={aiSummary} />
            <View style={styles.buttonContainer}>
              <Button
                variant="primary"
                onPress={onComplete}
                style={styles.continueButton}
              >
                Continue
              </Button>
            </View>
          </View>
        )}
      </View>
    );
  }

  // If we have a test, show the questions flow
  if (test) {
    return (
      <TestQuestionsFlow
        test={test}
        onComplete={handleQuestionsComplete}
        onCancel={handleBackFromQuestions}
      />
    );
  }

  // Fallback - this shouldn't happen but just in case
  return (
    <NoActiveTestScreen
      onBack={onCancel}
      onSelectTest={() => {
        // TODO: Navigate to test selection screen
        onCancel();
      }}
    />
  );
}

const styles = StyleSheet.create({
  completingContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
    width: '100%',
  },
  loadingSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  loadingTitle: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
  },
  loadingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 24,
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    opacity: 0.6,
  },
  buttonContainer: {
    marginTop: 24,
    width: '100%',
    maxWidth: 300,
  },
  continueButton: {
    width: '100%',
  },
  summarySection: {
    width: '100%',
    alignItems: 'center',
    marginTop: 24,
  },
});
