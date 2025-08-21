import { useAuthActions } from "@convex-dev/auth/react";
import { Authenticated, AuthLoading, Unauthenticated, useMutation, useQuery } from "convex/react";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Box, TabBar, Text } from "../components";
import { api } from "../convex/_generated/api";
import { useProfile } from "../hooks/useProfile";
import { AuthScreen } from "../screens";
import { DashboardScreen } from "../screens/dashboard";
import {
  CompleteStep,
  DateOfBirthStep,
  GenderStep,
  GoalsStep,
  NotificationsStep,
  OnboardingFlow,
  PhotoPermissionsStep,
  PrimaryConcernsStep,
  SkinTypeStep,
  WelcomeStep
} from "../screens/onboarding";
import { TestQuestionsFlow } from "../screens/test-questions";
import { TestSelectionScreen } from "../screens/test-selection";

import { CheckInHistoryScreen, CheckInHomeScreen } from "../screens/check-in";
import { ImageCaptureScreen, PhotoWalkthroughScreen } from "../screens/tracking";
import { useThemeContext } from "../theme/ThemeContext";

export default function Index() {
  const { theme } = useThemeContext();
  const { signOut } = useAuthActions();
  const { isOnboardingComplete, isLoading: onboardingLoading, markOnboardingComplete, resetOnboarding } = useProfile();
  const [showPhotoCapture, setShowPhotoCapture] = useState(false);
  const [showWalkthrough, setShowWalkthrough] = useState(false);
  const [showTestSelection, setShowTestSelection] = useState(false);
  const [showTestCheckIn, setShowTestCheckIn] = useState(false);
  const [showCheckInHistory, setShowCheckInHistory] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const insets = useSafeAreaInsets();

  // Get user profile to access userId
  const userProfile = useQuery(api.userProfiles.getProfile);
  
  // Get the active test for the current user
  const activeTest = useQuery(api.tests.getActiveTest, 
    userProfile?.userId ? { userId: userProfile.userId } : "skip"
  );

  // Mutation to create test check-in (without creating a regular check-in)
  const createTestCheckin = useMutation(api.testCheckins.createTestCheckin);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const handleResetOnboarding = async () => {
    await resetOnboarding();
    setShowPhotoCapture(false);
    setShowWalkthrough(false);
  };

  const handleOnboardingComplete = async () => {
    await markOnboardingComplete();
    setShowWalkthrough(true);
  };

  const handleStartPhotoCapture = () => {
    setShowWalkthrough(false);
    setShowPhotoCapture(true);
  };

  const handlePhotoTaken = (photoUri: string) => {
    if (photoUri === 'all-photos-complete') {
      // All photos taken, show success message
      console.log('All progress photos completed!');
      setShowPhotoCapture(false);
    } else {
      // Individual photo taken
      console.log('Photo taken:', photoUri);
    }
  };

  const handleBackFromPhoto = () => {
    setShowPhotoCapture(false);
  };

  const handleBackFromWalkthrough = () => {
    setShowWalkthrough(false);
  };

  const handleStartTest = () => {
    setShowTestSelection(true);
  };

  const handleTestCreated = (testId: string) => {
    setShowTestSelection(false);
    // Test created successfully, user is back on dashboard
    console.log('Test created with ID:', testId);
  };

  const handleBackFromTestSelection = () => {
    setShowTestSelection(false);
  };

  const handleStartTestCheckIn = () => {
    setShowTestCheckIn(true);
  };

  const handleTestCheckInComplete = async (answers: Array<{
    questionId: string;
    answer: string | number | boolean;
    questionType: 'rating' | 'yesNo' | 'text' | 'scale';
  }>) => {
    if (!userProfile?.userId || !activeTest) {
      console.error('Missing userId or activeTest for check-in creation');
      setShowTestCheckIn(false);
      return;
    }

    try {
      // Create the test check-in directly (without creating a regular check-in)
      const result = await createTestCheckin({
        testId: activeTest._id,
        userId: userProfile.userId,
        answers: answers,
      });
      
      console.log('Test check-in created successfully:', result);
      setShowTestCheckIn(false);
      
      // The dashboard will automatically refresh due to Convex's reactivity
      // and show "Today's Check-in Completed" instead of the button
    } catch (error) {
      console.error('Failed to create test check-in:', error);
      // TODO: Show error message to user
      setShowTestCheckIn(false);
    }
  };

  const handleBackFromTestCheckIn = () => {
    setShowTestCheckIn(false);
  };

  const handleViewAllCheckIns = () => {
    setShowCheckInHistory(true);
  };

  const handleBackFromCheckInHistory = () => {
    setShowCheckInHistory(false);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        if (showTestSelection) {
          return (
            <TestSelectionScreen
              onTestCreated={handleTestCreated}
              onBack={handleBackFromTestSelection}
            />
          );
        }
        if (showTestCheckIn) {
          if (activeTest) {
            return (
              <TestQuestionsFlow
                test={activeTest}
                onComplete={handleTestCheckInComplete}
                onCancel={handleBackFromTestCheckIn}
              />
            );
          }
          // Show loading or error state if no active test
          return (
            <Box flex={1} justifyContent="center" alignItems="center" padding="l">
              <Text variant="title" color="textPrimary" textAlign="center">
                Loading Test...
              </Text>
              <Text variant="subtitle" color="textSecondary" textAlign="center" marginTop="m">
                Please wait while we load your test information
              </Text>
            </Box>
          );
        }
        return <DashboardScreen onStartTest={handleStartTest} onStartTestCheckIn={handleStartTestCheckIn} />;
      case 'check-in':
        if (showCheckInHistory) {
          return (
            <CheckInHistoryScreen 
              onBack={handleBackFromCheckInHistory}
            />
          );
        }
        if (showTestCheckIn) {
          if (activeTest) {
            return (
              <TestQuestionsFlow
                test={activeTest}
                onComplete={handleTestCheckInComplete}
                onCancel={handleBackFromTestCheckIn}
              />
            );
          }
          // Show loading or error state if no active test
          return (
            <Box flex={1} justifyContent="center" alignItems="center" padding="l">
              <Text variant="title" color="textPrimary" textAlign="center">
                Loading Test...
              </Text>
              <Text variant="subtitle" color="textSecondary" textAlign="center" marginTop="m">
                Please wait while we load your test information
              </Text>
            </Box>
          );
        }
        return (
          <CheckInHomeScreen 
            onStartCheckIn={handleStartTestCheckIn}
            onViewAllCheckIns={handleViewAllCheckIns}
          />
        );
      case 'profile':
        return (
          <Box flex={1} padding="l">
            <Box marginBottom="xl">
              <Text variant="title" color="textPrimary">
                Profile
              </Text>
              <Text variant="subtitle" color="textSecondary" marginTop="xs">
                Manage your account and settings
              </Text>
            </Box>

            <Box 
              backgroundColor="backgroundMuted" 
              padding="l" 
              borderRadius="m"
              borderWidth={1}
              borderColor="glassBorder"
              marginBottom="m"
            >
              <Text variant="subtitle" color="textPrimary" marginBottom="s">
                Account Settings
              </Text>
              <Text variant="subtitle" color="textSecondary" marginBottom="l">
                Coming soon: Profile customization and preferences
              </Text>
            </Box>

            <Box 
              backgroundColor="backgroundMuted" 
              padding="l" 
              borderRadius="m"
              borderWidth={1}
              borderColor="glassBorder"
              marginBottom="m"
            >
              <Text variant="subtitle" color="textPrimary" marginBottom="s">
                Data & Privacy
              </Text>
              <Text variant="subtitle" color="textSecondary" marginBottom="l">
                Coming soon: Data export and privacy controls
              </Text>
            </Box>

            <TouchableOpacity
              onPress={handleSignOut}
              style={{
                backgroundColor: '#ff6b6b',
                paddingHorizontal: 24,
                paddingVertical: 12,
                borderRadius: 24,
                alignSelf: 'center',
                marginTop: 32,
              }}
            >
              <Text variant="subtitle" color="white">Sign Out</Text>
            </TouchableOpacity>
          </Box>
      );
      default:
        return <DashboardScreen />;
    }
  };

  console.log('🔍 Step components check:');
  console.log('WelcomeStep:', WelcomeStep);
  console.log('GenderStep:', GenderStep);
  console.log('DateOfBirthStep:', DateOfBirthStep);
  console.log('SkinTypeStep:', SkinTypeStep);
  console.log('PrimaryConcernsStep:', PrimaryConcernsStep);
  console.log('PhotoPermissionsStep:', PhotoPermissionsStep);
  console.log('NotificationsStep:', NotificationsStep);
  console.log('GoalsStep:', GoalsStep);
  console.log('CompleteStep:', CompleteStep);

  const onboardingSteps = [
    { id: 'welcome', title: 'Welcome to DermaTrack', component: WelcomeStep },
    { id: 'gender', title: 'About You', component: GenderStep },
    { id: 'dateOfBirth', title: 'Your Age', component: DateOfBirthStep },
    { id: 'skinType', title: 'Acne-Prone Skin Type', component: SkinTypeStep },
    { id: 'primaryConcerns', title: 'Acne Concerns', component: PrimaryConcernsStep },
    { id: 'photoPermissions', title: 'Track Progress', component: PhotoPermissionsStep },
    { id: 'notifications', title: 'Reminders', component: NotificationsStep },
    { id: 'goals', title: 'Acne Goals', component: GoalsStep },
    { id: 'complete', title: 'Ready to Start', component: CompleteStep },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <LinearGradient
        colors={theme.gradients.background.colors as [string, string, string, string, string, string, string, string, string, string, string, string, string, string, string]}
        locations={theme.gradients.background.locations as [number, number, number, number, number, number, number, number, number, number, number, number, number, number, number]}
        start={theme.gradients.background.start}
        end={theme.gradients.background.end}
        style={{ flex: 1 }}
      >
        <View style={{ 
          flex: 1, 
          paddingTop: insets.top,
          paddingLeft: insets.left,
          paddingRight: insets.right,
          paddingBottom: 80
        }}>
          <AuthLoading>
            <Box flex={1} justifyContent="center" alignItems="center">
              <Text variant="title" color="textPrimary">Loading...</Text>
            </Box>
          </AuthLoading>
          
          <Unauthenticated>
            <AuthScreen />
          </Unauthenticated>
          
          <Authenticated>
            {onboardingLoading ? (
              <Box flex={1} justifyContent="center" alignItems="center">
                <Text variant="title" color="textPrimary">Loading...</Text>
              </Box>
            ) : isOnboardingComplete ? (
              showWalkthrough ? (
                <View style={{ flex: 1 }}>
                  <PhotoWalkthroughScreen
                    onStart={handleStartPhotoCapture}
                    onBack={handleBackFromWalkthrough}
                  />
                </View>
              ) : showPhotoCapture ? (
                <View style={{ flex: 1 }}>
                  <ImageCaptureScreen
                    onPhotoTaken={handlePhotoTaken}
                    onBack={handleBackFromPhoto}
                    userId={userProfile?.userId}
                  />
                </View>
              ) : (
                <View style={{ flex: 1 }}>
                  {renderTabContent()}
                </View>
              )
            ) : (
              <View style={{ flex: 1 }}>
                <OnboardingFlow 
                  steps={onboardingSteps} 
                  onComplete={handleOnboardingComplete} 
                />
              </View>
            )}
          </Authenticated>
        </View>
        
        {/* Tab bar positioned absolutely at bottom, below safe area */}
        {isOnboardingComplete && !showWalkthrough && !showPhotoCapture && (
          <TabBar 
            activeTab={activeTab} 
            onTabPress={setActiveTab}
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              paddingBottom: insets.bottom
            }}
          />
        )}
      </LinearGradient>
    </View>
  );
}