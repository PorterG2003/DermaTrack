import React, { useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { Button } from '../../components/ui/buttons/Button';
import { Container } from '../../components/ui/layout/Container';
import { Spacer } from '../../components/ui/layout/Spacer';
import { useProfile } from '../../hooks/useProfile';
import { useUserSignals } from '../../hooks/useUserSignals';
import { useThemeContext } from '../../theme/ThemeContext';
import { OnboardingProgress } from './OnboardingProgress';
import { ONBOARDING_SECTIONS, getDisplayValue } from './onboardingSections';

export interface OnboardingData {
  // Hormonal & medical context
  sexAtBirth?: 'female' | 'male' | 'intersex' | 'prefer_not_to_say' | 'not_sure';
  menstruates?: boolean;
  cycleRegular?: 'yes' | 'no' | 'not_applicable';
  preMenstrualFlareDays?: 'none' | '1' | '2' | '3' | '4_5' | 'not_sure';
  contraception?: 'none' | 'combined_pill' | 'progestin_only' | 'hormonal_iud' | 'copper_iud' | 'implant' | 'ring' | 'patch' | 'other' | 'prefer_not_to_say';
  pregnancyStatus?: 'no' | 'pregnant' | 'postpartum' | 'breastfeeding';
  pcosDiagnosed?: 'yes' | 'no' | 'not_sure';
  familyHistoryAcne?: 'yes' | 'no' | 'not_sure';

  // Distribution & symptom clues
  areasAffected?: ('forehead' | 'hairline' | 'temples' | 'cheeks' | 'jawline' | 'chin' | 'neck' | 'chest' | 'back' | 'shoulders')[];
  itchy?: boolean;
  allBumpsLookSame?: 'yes' | 'no' | 'not_sure';
  comedonesPresent?: 'yes' | 'no' | 'not_sure';

  // Skin-type signals
  middayShineTzone?: 'yes' | 'no' | 'not_sure';
  middayShineCheeks?: 'yes' | 'no' | 'not_sure';
  feelsTightAfterCleanse?: 'yes' | 'no' | 'sometimes';
  visibleFlakingDaysPerWeek?: '0' | '1_2' | '3_4' | '5_7';
  blottingSheetsPerDay?: '0' | '1' | '2' | '3_plus';
  moisturizerReapplyPerDay?: '0' | '1' | '2' | '3_plus';
  stingsWithBasicMoisturizer?: 'yes' | 'no' | 'not_sure';
  historyOfEczemaOrDermatitis?: 'yes' | 'no' | 'not_sure';

  // Friction / heat / sweat
  maskHoursPerDay?: '0' | '1_2' | '3_4' | '5_plus';
  helmetHoursPerWeek?: '0' | '1_3' | '4_7' | '8_plus';
  chinstrapOrGearHoursPerWeek?: '0' | '1_3' | '4_7' | '8_plus';
  sweatyWorkoutsPerWeek?: '0' | '1_2' | '3_4' | '5_plus';
  showerSoonAfterSweat?: boolean;

  // Routine & product exposures
  waterTemp?: 'cool' | 'lukewarm' | 'hot';
  cleansesPerDay?: '0' | '1' | '2' | '3_plus';
  usesScrubsOrBrushes?: boolean;
  fragranceInSkincare?: 'yes' | 'no' | 'not_sure';
  fragranceInHaircare?: 'yes' | 'no' | 'not_sure';
  hairOilsOrPomades?: boolean;
  hairTouchesForehead?: boolean;
  usesMoisturizerDaily?: boolean;
  usesSunscreenDaily?: boolean;

  // Pillowcase-related
  pillowcaseChangesPerWeek?: '0' | '1' | '2' | '3_plus';
  laundryDetergentFragranced?: 'yes' | 'no' | 'not_sure';
  sleepWithLeaveInHairProducts?: boolean;

  // Diet levers
  sugaryDrinksPerDay?: '0' | '1' | '2' | '3_plus';
  whiteCarbServingsPerDay?: '0' | '1' | '2' | '3_plus';
  dairyServingsPerDay?: '0' | '1' | '2' | '3_plus';
  mostlySkimDairy?: 'yes' | 'no' | 'i_dont_drink_milk';
  wheyProteinUse?: boolean;

  // Medication trigger gate
  hasPotentialMedTrigger?: boolean;

  // Environment & lifestyle
  hotHumidExposure?: 'low' | 'medium' | 'high';
  saunaSteamSessionsPerWeek?: '0' | '1' | '2' | '3_plus';
  sleepHoursAvg?: '5_or_less' | '6' | '7' | '8' | '9_plus';
  stressNow_0to10?: number;

  // Allow dynamic indexing for question IDs
  [key: string]: any;
}

interface OnboardingFlowProps {
  onComplete: () => void;
}

// Onboarding sections are now imported from './onboardingSections'

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  console.log('🚀 OnboardingFlow: Component initialized');
  
  const { theme } = useThemeContext();
  const { height: screenHeight, width: screenWidth } = useWindowDimensions();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({});
  const [hasScrolled, setHasScrolled] = useState(false);
  const [needsScrollHint, setNeedsScrollHint] = useState(false);
  const [navigationStack, setNavigationStack] = useState<number[]>([0]); // Stack of visited steps
  
  const { updateSignals, ensureSignalsExist } = useUserSignals();
  const { updateProfile } = useProfile();
  
    // Refs for ScrollViews
  const introScrollViewRef = useRef<ScrollView>(null);
  const questionScrollViewRef = useRef<ScrollView>(null);
  
  // Function to check if a question should be displayed based on conditional logic
  const shouldShowQuestion = (question: any) => {
    if (!question.conditional) return true;
    
    const { dependsOn, value } = question.conditional;
    const dependentAnswer = onboardingData[dependsOn];
    
    const shouldShow = dependentAnswer === value;
    console.log(`🔍 Conditional check for ${question.id}:`, {
      dependsOn,
      expectedValue: value,
      actualValue: dependentAnswer,
      shouldShow
    });
    
    return shouldShow;
  };

  // Flatten the onboarding sections into a simple array of steps
  const flattenedSteps = ONBOARDING_SECTIONS.flatMap((section, sectionIndex) => {
    const steps: Array<{
      type: 'intro' | 'question';
      sectionIndex: number;
      section: any;
      title?: string;
      description?: string;
      questionIndex?: number;
      question?: any;
    }> = [];
    
    // Add intro step for this section
    steps.push({
      type: 'intro',
      sectionIndex,
      section,
      title: section.title,
      description: section.description
    });
    
    // Add all questions for this section (including conditional ones)
    section.questions.forEach((question, questionIndex) => {
      steps.push({
        type: 'question',
        sectionIndex,
        questionIndex,
        section,
        question
      });
    });
    
    return steps;
  });
  
  console.log('🔍 OnboardingFlow: Hooks initialized', {
    hasUpdateSignals: !!updateSignals,
    hasEnsureSignalsExist: !!ensureSignalsExist,
    hasUpdateProfile: !!updateProfile
  });

  // Simple array indexing - no complex calculations needed!
  const currentStep = flattenedSteps[currentStepIndex];
  const totalSteps = flattenedSteps.length;
  const isLastStep = currentStepIndex === totalSteps - 1;
  const isFirstStep = currentStepIndex === 0;

  console.log('📍 OnboardingFlow: Current step info', {
    currentStepIndex,
    currentStepType: currentStep?.type,
    currentStepTitle: currentStep?.type === 'intro' ? currentStep?.title : currentStep?.question?.question,
    isFirstStep,
    isLastStep,
    totalSteps
  });

  const handleNext = async (stepData?: Partial<OnboardingData>) => {
    console.log('➡️ OnboardingFlow: handleNext called', {
      hasStepData: !!stepData,
      stepDataKeys: stepData ? Object.keys(stepData) : [],
      isLastStep
    });

    if (stepData) {
      setOnboardingData(prev => ({ ...prev, ...stepData }));
      console.log('📝 OnboardingFlow: Updated onboarding data with step data');
    }

    if (isLastStep) {
      console.log('🏁 OnboardingFlow: Last step reached, saving data and completing');
      // Save all data and complete onboarding
      await saveOnboardingData();
      onComplete();
    } else {
      console.log('⏭️ OnboardingFlow: Moving to next step');
      
      // Push current step onto navigation stack before moving forward
      setNavigationStack(prev => [...prev, currentStepIndex]);
      console.log(`💾 Pushed step ${currentStepIndex} onto navigation stack: [${[...navigationStack, currentStepIndex].join(', ')}]`);
      
      // Simple increment - the render logic will handle conditional questions
      setCurrentStepIndex(prev => prev + 1);
      setHasScrolled(false); // Reset scroll state for new step
      setNeedsScrollHint(false); // Reset scroll hint state for new step
    }
  };
  
  const handleBack = () => {
    console.log('⬅️ OnboardingFlow: handleBack called', { isFirstStep, navigationStack });
    if (!isFirstStep && navigationStack.length > 1) {
      // Pop the last step from navigation stack and go back
      setNavigationStack(prev => {
        const newStack = [...prev];
        newStack.pop(); // Remove current step
        const previousStep = newStack[newStack.length - 1] || 0; // Get previous step, default to 0
        
        console.log(`⬅️ Going back from ${currentStepIndex} to ${previousStep}. Stack: [${newStack.join(', ')}]`);
        setCurrentStepIndex(previousStep);
        
        return newStack;
      });
      
      setHasScrolled(false); // Reset scroll state when going back
      setNeedsScrollHint(false); // Reset scroll hint state when going back
    } else {
      console.log('⚠️ Cannot go back: isFirstStep or navigation stack too short');
    }
  };

  // Helper function to convert range strings to numbers
  const convertRangeToNumber = (range: string | undefined): number | undefined => {
    if (!range) return undefined;
    
    switch (range) {
      case '0': return 0;
      case '1': return 1;
      case '2': return 2;
      case '1_2': return 1.5;
      case '3_4': return 3.5;
      case '4_5': return 4.5;
      case '1_3': return 2;
      case '4_7': return 5.5;
      case '8_plus': return 8;
      case '3_plus': return 3;
      case '5_plus': return 5;
      default: return undefined;
    }
  };

  // Helper function to convert yes/no/not_sure to boolean
  const convertYesNoToBoolean = (value: 'yes' | 'no' | 'not_sure' | undefined): boolean | undefined => {
    if (!value) return undefined;
    if (value === 'yes') return true;
    if (value === 'no') return false;
    return undefined; // 'not_sure' becomes undefined
  };

  // Helper function to convert sleep hours
  const convertSleepHours = (value: string | undefined): number | undefined => {
    if (!value) return undefined;
    
    switch (value) {
      case '5_or_less': return 5;
      case '6': return 6;
      case '7': return 7;
      case '8': return 8;
      case '9_plus': return 9;
      default: return undefined;
    }
  };

  const saveOnboardingData = async () => {
    console.log('💾 OnboardingFlow: Starting to save onboarding data');
    try {
      // Ensure user signals exist
      console.log('🔧 OnboardingFlow: Ensuring user signals exist');
      await ensureSignalsExist();
      console.log('✅ OnboardingFlow: User signals ensured');

      // Transform onboarding data to match the userSignals schema
      const signalsData = {
        // Hormonal & medical context
        sexAtBirth: (() => {
          if (onboardingData.sexAtBirth === 'prefer_not_to_say' || onboardingData.sexAtBirth === 'not_sure') {
            return 'unknown' as const;
          }
          if (onboardingData.sexAtBirth === 'female' || onboardingData.sexAtBirth === 'male' || onboardingData.sexAtBirth === 'intersex') {
            return onboardingData.sexAtBirth;
          }
          return undefined;
        })(),
        menstruates: onboardingData.menstruates,
        cycleRegular: onboardingData.cycleRegular === 'yes' ? true : onboardingData.cycleRegular === 'no' ? false : undefined,
        preMenstrualFlareDays: convertRangeToNumber(onboardingData.preMenstrualFlareDays),
        contraception: (() => {
          if (onboardingData.contraception === 'prefer_not_to_say') {
            return undefined;
          }
          if (onboardingData.contraception === 'combined_pill') {
            return 'combined_ocp' as const;
          }
          if (onboardingData.contraception === 'none' || onboardingData.contraception === 'progestin_only' || 
              onboardingData.contraception === 'hormonal_iud' || onboardingData.contraception === 'copper_iud' || 
              onboardingData.contraception === 'implant' || onboardingData.contraception === 'ring' || 
              onboardingData.contraception === 'patch' || onboardingData.contraception === 'other') {
            return onboardingData.contraception;
          }
          return undefined;
        })(),
        pregnancyStatus: (() => {
          if (onboardingData.pregnancyStatus === 'no') {
            return 'none' as const;
          }
          if (onboardingData.pregnancyStatus === 'pregnant' || onboardingData.pregnancyStatus === 'postpartum' || onboardingData.pregnancyStatus === 'breastfeeding') {
            return onboardingData.pregnancyStatus;
          }
          return undefined;
        })(),
        pcosDiagnosed: convertYesNoToBoolean(onboardingData.pcosDiagnosed),
        familyHistoryAcne: convertYesNoToBoolean(onboardingData.familyHistoryAcne),

        // Distribution & symptom clues
        areasAffected: onboardingData.areasAffected,
        itchy: onboardingData.itchy,
        allBumpsLookSame: convertYesNoToBoolean(onboardingData.allBumpsLookSame),
        comedonesPresent: convertYesNoToBoolean(onboardingData.comedonesPresent),

        // Skin-type signals
        middayShineTzone: convertYesNoToBoolean(onboardingData.middayShineTzone),
        middayShineCheeks: convertYesNoToBoolean(onboardingData.middayShineCheeks),
        feelsTightAfterCleanse: onboardingData.feelsTightAfterCleanse === 'yes' ? true : onboardingData.feelsTightAfterCleanse === 'no' ? false : undefined,
        visibleFlakingDaysPerWeek: convertRangeToNumber(onboardingData.visibleFlakingDaysPerWeek),
        blottingSheetsPerDay: convertRangeToNumber(onboardingData.blottingSheetsPerDay),
        moisturizerReapplyPerDay: convertRangeToNumber(onboardingData.moisturizerReapplyPerDay),
        stingsWithBasicMoisturizer: convertYesNoToBoolean(onboardingData.stingsWithBasicMoisturizer),
        historyOfEczemaOrDermatitis: convertYesNoToBoolean(onboardingData.historyOfEczemaOrDermatitis),

        // Friction / heat / sweat
        maskHoursPerDay: convertRangeToNumber(onboardingData.maskHoursPerDay),
        helmetHoursPerWeek: convertRangeToNumber(onboardingData.helmetHoursPerWeek),
        chinstrapOrGearHoursPerWeek: convertRangeToNumber(onboardingData.chinstrapOrGearHoursPerWeek),
        sweatyWorkoutsPerWeek: convertRangeToNumber(onboardingData.sweatyWorkoutsPerWeek),
        showerSoonAfterSweat: onboardingData.showerSoonAfterSweat,

        // Routine & product exposures
        waterTemp: onboardingData.waterTemp,
        cleansesPerDay: convertRangeToNumber(onboardingData.cleansesPerDay),
        usesScrubsOrBrushes: onboardingData.usesScrubsOrBrushes,
        fragranceInSkincare: convertYesNoToBoolean(onboardingData.fragranceInSkincare),
        fragranceInHaircare: convertYesNoToBoolean(onboardingData.fragranceInHaircare),
        hairOilsOrPomades: onboardingData.hairOilsOrPomades,
        hairTouchesForehead: onboardingData.hairTouchesForehead,
        usesMoisturizerDaily: onboardingData.usesMoisturizerDaily,
        usesSunscreenDaily: onboardingData.usesSunscreenDaily,

        // Pillowcase-related
        pillowcaseChangesPerWeek: convertRangeToNumber(onboardingData.pillowcaseChangesPerWeek),
        laundryDetergentFragranced: convertYesNoToBoolean(onboardingData.laundryDetergentFragranced),
        sleepWithLeaveInHairProducts: onboardingData.sleepWithLeaveInHairProducts,

        // Diet levers
        sugaryDrinksPerDay: convertRangeToNumber(onboardingData.sugaryDrinksPerDay),
        whiteCarbServingsPerDay: convertRangeToNumber(onboardingData.whiteCarbServingsPerDay),
        dairyServingsPerDay: convertRangeToNumber(onboardingData.dairyServingsPerDay),
        mostlySkimDairy: onboardingData.mostlySkimDairy === 'yes' ? true : onboardingData.mostlySkimDairy === 'no' ? false : undefined,
        wheyProteinUse: onboardingData.wheyProteinUse,

        // Medication trigger gate
        hasPotentialMedTrigger: onboardingData.hasPotentialMedTrigger,

        // Environment & lifestyle
        hotHumidExposure: onboardingData.hotHumidExposure,
        saunaSteamSessionsPerWeek: convertRangeToNumber(onboardingData.saunaSteamSessionsPerWeek),
        sleepHoursAvg: convertSleepHours(onboardingData.sleepHoursAvg),
        stressNow_0to10: onboardingData.stressNow_0to10,
      };

      console.log('📊 OnboardingFlow: Transformed signals data', {
        dataKeys: Object.keys(signalsData),
        dataValues: Object.values(signalsData).slice(0, 5) // Log first 5 values to avoid spam
      });

      console.log('💾 OnboardingFlow: Calling updateSignals');
      await updateSignals(signalsData);
      console.log('✅ OnboardingFlow: Signals updated successfully');

      // Mark onboarding as completed
      console.log('🏁 OnboardingFlow: Marking onboarding as completed');
      await updateProfile({ onboardingCompleted: true });
      console.log('✅ OnboardingFlow: Profile updated successfully');

      console.log('🎉 OnboardingFlow: Onboarding data saved successfully');
    } catch (error) {
      console.error('❌ OnboardingFlow: Failed to save onboarding data:', error);
      // Re-throw to allow parent component to handle the error
      throw error;
    }
  };
  
  // Helper functions for handling answers
  const handleAnswer = (questionId: string, answer: any) => {
    setOnboardingData(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleMultiChoice = (questionId: string, answer: any) => {
    setOnboardingData(prev => {
      const currentAnswers = prev[questionId] || [];
      const newAnswers = currentAnswers.includes(answer)
        ? currentAnswers.filter((a: any) => a !== answer)
        : [...currentAnswers, answer];
      return { ...prev, [questionId]: newAnswers };
    });
  };

  const canProceed = (questionId: string) => {
    const answer = onboardingData[questionId];
    
    // Check if answer is undefined or null (not answered)
    if (answer === undefined || answer === null) return false;
    
    // For multi-choice questions, check if at least one option is selected
    if (Array.isArray(answer)) {
      return answer.length > 0;
    }
    
    // For boolean values, both true and false are valid answers
    if (typeof answer === 'boolean') {
      return true;
    }
    
    // For other types, any value means answered
    return true;
  };

  // Get filtered questions for current section based on conditional logic
  const getVisibleQuestions = () => {
    if (!currentStep || currentStep.type !== 'question') return [];
    
    return [currentStep.question].filter(question => shouldShowQuestion(question));
  };

  // Handle scroll events to hide the scroll hint
  const handleScroll = () => {
    if (!hasScrolled) {
      setHasScrolled(true);
    }
  };

  // Check if content needs scrolling after layout
  const checkIfScrollingNeeded = (event: any) => {
    if (!event?.nativeEvent?.contentSize || !event?.nativeEvent?.layoutMeasurement) {
      console.log('📏 Content size check: Event not ready yet');
      return;
    }
    
    const { contentSize, layoutMeasurement } = event.nativeEvent;
    const isScrollable = contentSize.height > layoutMeasurement.height;
    setNeedsScrollHint(isScrollable);
    
    console.log(`📏 Content size check:`, {
      contentHeight: contentSize.height,
      layoutHeight: layoutMeasurement.height,
      isScrollable,
      needsScrollHint: isScrollable
    });
  };

  // Check scrolling after layout using actual screen dimensions
  const checkScrollingAfterLayout = (event: any) => {
    const { height: contentHeight } = event.nativeEvent.layout;
    
    // Calculate available ScrollView height more accurately
    // Account for: progress bar + padding + navigation buttons + scroll hint + safe areas
    const progressHeight = 100;
    const padding = 40;
    const navigationHeight = 80;
    const scrollHintHeight = 60;
    const safeAreaTop = 50; // Account for status bar and safe area
    const safeAreaBottom = 30;
    
    const availableScrollViewHeight = screenHeight - progressHeight - padding - navigationHeight - scrollHintHeight - safeAreaTop - safeAreaBottom;
    
    const isScrollable = contentHeight > availableScrollViewHeight;
    setNeedsScrollHint(isScrollable);
    
    console.log(`📏 Layout check:`, {
      contentHeight,
      screenHeight,
      availableScrollViewHeight,
      isScrollable,
      needsScrollHint: isScrollable,
      breakdown: {
        progressHeight,
        padding,
        navigationHeight,
        scrollHintHeight,
        safeAreaTop,
        safeAreaBottom
      }
    });
  };

    // Render current step based on flattened structure
  const renderCurrentStep = () => {
    if (!currentStep) {
      return (
        <View style={styles.questionContainer}>
          <Text style={{ color: 'red', textAlign: 'center', padding: 20 }}>
            Error: Step not found. Please restart the onboarding.
          </Text>
        </View>
      );
    }

    if (currentStep.type === 'intro') {
      // Intro screen
      return (
        <View style={styles.introContainer}>
          <ScrollView 
            ref={introScrollViewRef}
            style={styles.scrollableContent}
            contentContainerStyle={styles.scrollableContentContainer}
            showsVerticalScrollIndicator={false}
            bounces={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          >
            <View onLayout={checkScrollingAfterLayout}>
              <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
                {currentStep.title}
              </Text>
              
              <Spacer size="m" />
              
              <Text style={[styles.sectionDescription, { color: theme.colors.textSecondary }]}>
                {currentStep.description}
              </Text>
              
              <Spacer size="xl" />
            </View>
          </ScrollView>
          
          {/* Scroll hint card - only show if content needs scrolling and hasn't scrolled yet */}
          {needsScrollHint && !hasScrolled && (
            <View style={styles.scrollHintContainer}>
              <View style={styles.scrollHintCard}>
                <Text style={[styles.scrollHintText, { color: theme.colors.textSecondary }]}>
                  Scroll to see more
                </Text>
              </View>
            </View>
          )}
          
          <Button
            variant="glass"
            size="large"
            style={{ width: '100%' }}
            onPress={() => handleNext()}
          >
            Get Started
          </Button>
        </View>
      );
    } else if (currentStep.type === 'question') {
      // Question screen
      const question = currentStep.question;
      
      // Check if this question should be shown based on conditionals
      if (!shouldShowQuestion(question)) {
        console.log(`⏭️ Question ${question.id} should be skipped, moving to next`);
        // Skip this question by moving to next step (don't update lastRealStepIndex)
        setTimeout(() => {
          setCurrentStepIndex(prev => prev + 1);
          setHasScrolled(false);
          setNeedsScrollHint(false);
        }, 100);
        return (
          <View style={styles.questionContainer}>
            <Text style={{ textAlign: 'center', padding: 20 }}>
              Loading next question...
            </Text>
          </View>
        );
      }
      
      return (
        <View style={styles.questionContainer}>
          {/* Scrollable content area */}
          <ScrollView 
            ref={questionScrollViewRef}
            style={styles.scrollableContent}
            contentContainerStyle={styles.scrollableContentContainer}
            showsVerticalScrollIndicator={false}
            bounces={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          >
            <View onLayout={checkScrollingAfterLayout}>
              <Text style={[styles.questionTitle, { color: theme.colors.textPrimary }]}>
                {question.question}
              </Text>
            
            <Spacer size="s" />
            
            <Text style={[styles.questionExplanation, { color: theme.colors.textSecondary }]}>
              {question.explanation}
            </Text>
            
            <Spacer size="l" />
            
            {/* Render answer options based on question type */}
            {question.type === 'singleChoice' && (
              <View style={styles.optionsContainer}>
                {question.options.map((option: any, index: number) => (
                  <View key={index} style={styles.optionWrapper}>
                    <Button
                      variant="glass"
                      size="medium"
                      style={{ 
                        width: '100%',
                        ...(onboardingData[question.id] === option && {
                          backgroundColor: theme.colors.primary,
                          borderColor: theme.colors.primary,
                          shadowColor: theme.colors.primary,
                          shadowOpacity: 0.3,
                          elevation: 6
                        })
                      }}
                      onPress={() => handleAnswer(question.id, option)}
                    >
                      {getDisplayValue(question.id, option)}
                    </Button>
                  </View>
                ))}
              </View>
            )}
            
            {question.type === 'multiChoice' && (
              <View style={styles.optionsContainer}>
                {question.options.map((option: any, index: number) => (
                  <View key={index} style={styles.optionWrapper}>
                    <Button
                      variant="glass"
                      size="medium"
                      style={{ 
                        width: '100%',
                        ...(onboardingData[question.id]?.includes(option) && {
                          backgroundColor: theme.colors.primary,
                          borderColor: theme.colors.primary,
                          shadowColor: theme.colors.primary,
                          shadowOpacity: 0.3,
                          elevation: 6
                        })
                      }}
                      onPress={() => handleMultiChoice(question.id, option)}
                    >
                      {getDisplayValue(question.id, option)}
                    </Button>
                  </View>
                ))}
              </View>
            )}
            </View>
          </ScrollView>
          
          {/* Scroll hint card - only show if content needs scrolling and hasn't scrolled yet */}
          {needsScrollHint && !hasScrolled && (
            <View style={styles.scrollHintContainer}>
              <View style={styles.scrollHintCard}>
                <Text style={[styles.scrollHintText, { color: theme.colors.textSecondary }]}>
                  Scroll to see more
                </Text>
              </View>
            </View>
          )}
          
          {/* Navigation buttons - fixed at bottom */}
          <View style={styles.navigationContainer}>
            {!isFirstStep && (
              <Button
                variant="glass"
                size="medium"
                style={{ flex: 1 }}
                onPress={handleBack}
              >
                Back
              </Button>
            )}
            
            {!isFirstStep && <Spacer size="m" />}
            
            <Button
              variant="glass"
              size="medium"
              style={{ 
                flex: 1,
                opacity: canProceed(question.id) ? 1 : 0.5
              }}
              onPress={() => handleNext()}
              disabled={!canProceed(question.id)}
            >
              Continue
            </Button>
          </View>
        </View>
      );
    }
  };
  
  return (
    <Container>
      <View style={styles.container}>
        {/* Progress - fixed height, don't grow */}
        <View style={styles.progressContainer}>
          <OnboardingProgress
            currentStep={currentStepIndex + 1}
            totalSteps={totalSteps}
            stepTitle={currentStep?.title || currentStep?.question?.question || ''}
            stepDescription={currentStep?.description || ''}
          />
        </View>
        
        {/* Content area - take remaining space */}
        <View style={styles.contentContainer}>
          {renderCurrentStep()}
        </View>
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  progressContainer: {
    minHeight: 100,
    flex: 0, // Don't grow, fixed height
  },
  contentContainer: {
    flex: 1, // Take remaining space
  },
  introContainer: {
    padding: 20,
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 60,
  },
  questionContainer: {
    padding: 20,
    flex: 1,
    justifyContent: 'space-between',
  },
  scrollableContent: {
    flex: 1,
  },
  scrollableContentContainer: {
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 36,
  },
  sectionDescription: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 16,
  },
  questionTitle: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
    lineHeight: 32,
  },
  questionExplanation: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 32,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  optionsContainer: {
    marginBottom: 32,
  },
  optionWrapper: {
    marginBottom: 16,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 'auto',
    paddingTop: 24,
    gap: 12,
  },
  scrollHintContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  scrollHintCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  scrollHintText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
});
