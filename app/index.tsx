import { useAuthActions } from "@convex-dev/auth/react";
import { Authenticated, AuthLoading, Unauthenticated } from "convex/react";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Box, TabBar, Text } from "../components";
import { useProfile } from "../hooks/useProfile";
import { useStoreUserEffect } from "../hooks/useStoreUserEffect";
import { AuthScreen } from "../screens";
import { DashboardScreen } from "../screens/dashboard";


import { TestSelectionScreen } from "../screens/test-selection";

import { CheckInHistoryScreen, CheckInHomeScreen } from "../screens/check-in";
import { ImageCaptureScreen, PhotoWalkthroughScreen, UnifiedCheckInFlow } from "../screens/tracking";
import { useThemeContext } from "../theme/ThemeContext";

import { OnboardingFlow } from "../screens/onboarding";

export default function Index() {
  console.log('🚀 Index: Component initialized');
  
  const { theme } = useThemeContext();
  const { signOut } = useAuthActions();
  const { isLoading: storeUserLoading, isAuthenticated } = useStoreUserEffect();
  const { profile, isOnboardingComplete, isLoading: onboardingLoading, markOnboardingComplete, resetOnboarding } = useProfile();
  const [showPhotoCapture, setShowPhotoCapture] = useState(false);
  const [showWalkthrough, setShowWalkthrough] = useState(false);
  const [showTestSelection, setShowTestSelection] = useState(false);
  const [showCheckInHistory, setShowCheckInHistory] = useState(false);
  const [showUnifiedCheckIn, setShowUnifiedCheckIn] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const insets = useSafeAreaInsets();

  console.log('🔍 Index: Hooks initialized', {
    hasTheme: !!theme,
    hasSignOut: !!signOut,
    storeUserLoading,
    isAuthenticated,
    hasProfile: !!profile,
    profileId: profile?._id,
    isOnboardingComplete,
    onboardingLoading,
    hasMarkOnboardingComplete: !!markOnboardingComplete,
    hasResetOnboarding: !!resetOnboarding
  });

  console.log('📱 Index: State values', {
    showPhotoCapture,
    showWalkthrough,
    showTestSelection,
    showCheckInHistory,
    showUnifiedCheckIn,
    activeTab
  });

  const handleSignOut = async () => {
    console.log('🚪 Index: handleSignOut called');
    try {
      await signOut();
    } catch (error) {
      console.error('❌ Index: Sign out error:', error);
    }
  };

  const handleResetOnboarding = async () => {
    console.log('🔄 Index: handleResetOnboarding called');
    await resetOnboarding();
    setShowPhotoCapture(false);
    setShowWalkthrough(false);
  };

  const handleOnboardingComplete = async () => {
    console.log('✅ Index: handleOnboardingComplete called');
    await markOnboardingComplete();
    setShowWalkthrough(true);
  };

  const handleStartPhotoCapture = () => {
    console.log('📸 Index: handleStartPhotoCapture called');
    setShowWalkthrough(false);
    setShowPhotoCapture(true);
  };

  const handlePhotoTaken = (photoUri: string) => {
    console.log('📷 Index: handlePhotoTaken called', { photoUri });
    if (photoUri === 'all-photos-complete') {
      // All photos taken, show success message
      console.log('🎉 Index: All progress photos completed!');
      setShowPhotoCapture(false);
    } else {
      // Individual photo taken
      console.log('📷 Index: Photo taken:', photoUri);
    }
  };

  const handleBackFromPhoto = () => {
    console.log('⬅️ Index: handleBackFromPhoto called');
    setShowPhotoCapture(false);
  };

  const handleBackFromWalkthrough = () => {
    console.log('⬅️ Index: handleBackFromWalkthrough called');
    setShowWalkthrough(false);
  };

  const handleStartTest = () => {
    console.log('🧪 Index: handleStartTest called');
    setShowTestSelection(true);
  };

  const handleStartUnifiedCheckIn = () => {
    console.log('🔍 Index: handleStartUnifiedCheckIn called');
    // TODO: Implement unified check-in
    setShowUnifiedCheckIn(true);
  };

  const handleUnifiedCheckInComplete = () => {
    console.log('✅ Index: handleUnifiedCheckInComplete called');
    setShowUnifiedCheckIn(false);
    // TODO: Show success message or refresh dashboard
  };

  const handleUnifiedCheckInCancel = () => {
    console.log('❌ Index: handleUnifiedCheckInCancel called');
    setShowUnifiedCheckIn(false);
  };

  const handleTestCreated = (testId: string) => {
    console.log('🧪 Index: handleTestCreated called', { testId });
    setShowTestSelection(false);
    // Test created successfully, start the unified check-in flow
    console.log('🎯 Index: Test created with ID:', testId);
    setShowUnifiedCheckIn(true);
  };

  const handleBackFromTestSelection = () => {
    console.log('⬅️ Index: handleBackFromTestSelection called');
    setShowTestSelection(false);
  };



  const handleViewAllCheckIns = () => {
    console.log('📋 Index: handleViewAllCheckIns called');
    setShowCheckInHistory(true);
  };

  const handleBackFromCheckInHistory = () => {
    console.log('⬅️ Index: handleBackFromCheckInHistory called');
    setShowCheckInHistory(false);
  };

  const renderTabContent = () => {
    console.log('🎭 Index: renderTabContent called', { activeTab });
    
    switch (activeTab) {
      case 'dashboard':
        if (showTestSelection) {
          console.log('🧪 Index: Rendering TestSelectionScreen');
          return (
            <TestSelectionScreen
              onTestCreated={handleTestCreated}
              onBack={handleBackFromTestSelection}
              isForCheckIn={true}
            />
          );
        }
        console.log('🏠 Index: Rendering DashboardScreen');
        return <DashboardScreen onStartTest={handleStartTest} onStartUnifiedCheckIn={handleStartUnifiedCheckIn} />;
      case 'check-in':
        if (showCheckInHistory) {
          console.log('📋 Index: Rendering CheckInHistoryScreen');
          return (
            <CheckInHistoryScreen 
              onBack={handleBackFromCheckInHistory}
            />
          );
        }
        console.log('🔍 Index: Rendering CheckInHomeScreen');
        return (
          <CheckInHomeScreen 
            onStartCheckIn={handleStartUnifiedCheckIn}
            onViewAllCheckIns={handleViewAllCheckIns}
          />
        );
            case 'profile':
        console.log('👤 Index: Rendering Profile tab');
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
        console.log('🏠 Index: Rendering default DashboardScreen');
        return <DashboardScreen />;
    }
  };

  console.log('🎯 Index: About to render main UI', {
    storeUserLoading,
    onboardingLoading,
    isOnboardingComplete,
    showWalkthrough,
    showPhotoCapture,
    showUnifiedCheckIn
  });

  // Debug: Check what the render logic decides
  if (storeUserLoading || onboardingLoading) {
    console.log('📱 Index: RENDERING LOADING SCREEN');
  } else if (isOnboardingComplete) {
    console.log('📱 Index: RENDERING POST-ONBOARDING CONTENT');
  } else {
    console.log('📱 Index: RENDERING ONBOARDING FLOW');
  }

  console.log('🎨 Index: Background color', {
    backgroundColor: theme.colors.background,
    gradientColors: theme.gradients.background.colors.slice(0, 3)
  });

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
            {storeUserLoading || onboardingLoading ? (
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
                    userId={profile?._id}
                  />
                </View>
              ) : showUnifiedCheckIn ? (
                profile?._id ? (
                  <View style={{ flex: 1 }}>
                    <UnifiedCheckInFlow
                      test={undefined}
                      userId={profile._id}
                      onComplete={handleUnifiedCheckInComplete}
                      onCancel={handleUnifiedCheckInCancel}
                    />
                  </View>
                ) : (
                  <Box flex={1} justifyContent="center" alignItems="center">
                    <Text variant="title" color="textPrimary">Loading profile...</Text>
                  </Box>
                )
              ) : (
                <View style={{ flex: 1 }}>
                  {renderTabContent()}
                </View>
              )
            ) : (
              <View style={{ flex: 1 }}>
                <OnboardingFlow 
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