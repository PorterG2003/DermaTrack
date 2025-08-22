import { useAuthActions } from "@convex-dev/auth/react";
import { Authenticated, AuthLoading, Unauthenticated, useQuery } from "convex/react";
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

import { TestSelectionScreen } from "../screens/test-selection";

import { CheckInHistoryScreen, CheckInHomeScreen } from "../screens/check-in";
import { ImageCaptureScreen, PhotoWalkthroughScreen, UnifiedCheckInFlow } from "../screens/tracking";
import { useThemeContext } from "../theme/ThemeContext";

export default function Index() {
  const { theme } = useThemeContext();
  const { signOut } = useAuthActions();
  const { isOnboardingComplete, isLoading: onboardingLoading, markOnboardingComplete, resetOnboarding } = useProfile();
  const [showPhotoCapture, setShowPhotoCapture] = useState(false);
  const [showWalkthrough, setShowWalkthrough] = useState(false);
  const [showTestSelection, setShowTestSelection] = useState(false);
  const [showCheckInHistory, setShowCheckInHistory] = useState(false);
  const [showUnifiedCheckIn, setShowUnifiedCheckIn] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const insets = useSafeAreaInsets();

  // Get user profile to access userId
  const userProfile = useQuery(api.userProfiles.getProfile);
  
  // Get the active test for the current user
  const activeTest = useQuery(api.tests.getActiveTest, 
    userProfile?.userId ? { userId: userProfile.userId } : "skip"
  );



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

  const handleStartUnifiedCheckIn = () => {
    if (activeTest) {
      setShowUnifiedCheckIn(true);
    } else {
      // No active test, show test selection
      setShowTestSelection(true);
    }
  };

  const handleUnifiedCheckInComplete = () => {
    setShowUnifiedCheckIn(false);
    // TODO: Show success message or refresh dashboard
  };

  const handleUnifiedCheckInCancel = () => {
    setShowUnifiedCheckIn(false);
  };

  const handleTestCreated = (testId: string) => {
    setShowTestSelection(false);
    // Test created successfully, start the unified check-in flow
    console.log('Test created with ID:', testId);
    setShowUnifiedCheckIn(true);
  };

  const handleBackFromTestSelection = () => {
    setShowTestSelection(false);
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
              isForCheckIn={true}
            />
          );
        }
        return <DashboardScreen onStartTest={handleStartTest} onStartUnifiedCheckIn={handleStartUnifiedCheckIn} />;
      case 'check-in':
        if (showCheckInHistory) {
          return (
            <CheckInHistoryScreen 
              onBack={handleBackFromCheckInHistory}
            />
          );
        }
        return (
          <CheckInHomeScreen 
            onStartCheckIn={handleStartUnifiedCheckIn}
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
              ) : showUnifiedCheckIn ? (
                <View style={{ flex: 1 }}>
                  <UnifiedCheckInFlow
                    test={activeTest || undefined}
                    userId={userProfile?.userId || ''}
                    onComplete={handleUnifiedCheckInComplete}
                    onCancel={handleUnifiedCheckInCancel}
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
        {isOnboardingComplete && !showWalkthrough && !showPhotoCapture && !showUnifiedCheckIn && (
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