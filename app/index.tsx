import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeContext } from "../src/theme/ThemeContext";
import { View, TouchableOpacity } from "react-native";
import { AuthScreen } from "./screens";
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { Text, Box } from "./components";
import { useAuthActions } from "@convex-dev/auth/react";
import { 
  OnboardingFlow, 
  WelcomeStep, 
  GenderStep, 
  AgeRangeStep, 
  SkinTypeStep, 
  PrimaryConcernsStep, 
  PhotoPermissionsStep, 
  NotificationsStep, 
  GoalsStep, 
  CompleteStep 
} from "./screens/onboarding";
import { useOnboarding } from "./hooks/useOnboarding";

export default function Index() {
  const { theme } = useThemeContext();
  const { signOut } = useAuthActions();
  const { isOnboardingComplete, isLoading: onboardingLoading, markOnboardingComplete, resetOnboarding } = useOnboarding();
  
  // Debug logging
  console.log('Index - theme received:', theme);
  console.log('Index - gradients:', theme.gradients);
  console.log('Index - background colors:', theme.gradients.background.colors);
  console.log('Index - onboarding state:', { isOnboardingComplete, onboardingLoading });
  
  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };
  
  const handleResetOnboarding = async () => {
    await resetOnboarding();
  };
  
  // Define onboarding steps
  const onboardingSteps = [
    {
      id: 'welcome',
      title: 'Welcome',
      component: WelcomeStep,
    },
    {
      id: 'gender',
      title: 'Gender',
      component: GenderStep,
    },
    {
      id: 'ageRange',
      title: 'Age Range',
      component: AgeRangeStep,
    },
    {
      id: 'skinType',
      title: 'Skin Type',
      component: SkinTypeStep,
    },
    {
      id: 'primaryConcerns',
      title: 'Primary Concerns',
      component: PrimaryConcernsStep,
    },
    {
      id: 'photoPermissions',
      title: 'Camera Access',
      component: PhotoPermissionsStep,
    },
    {
      id: 'notifications',
      title: 'Notifications',
      component: NotificationsStep,
    },
    {
      id: 'goals',
      title: 'Goals',
      component: GoalsStep,
    },
    {
      id: 'complete',
      title: 'Complete',
      component: CompleteStep,
    },
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
        <SafeAreaView style={{ flex: 1 }}>
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
              <Box flex={1} justifyContent="center" alignItems="center" padding="l">
                <Text variant="title" color="textPrimary" textAlign="center">
                  Welcome to DermaTrack! 🎉
                </Text>
                <Text variant="subtitle" color="textSecondary" textAlign="center" marginTop="m">
                  You are successfully signed in with Google
                </Text>
                
                {/* Temporary Reset Button for Testing */}
                <TouchableOpacity
                  onPress={handleResetOnboarding}
                  style={{
                    marginTop: 24,
                    backgroundColor: theme.colors.backgroundMuted,
                    paddingHorizontal: 24,
                    paddingVertical: 12,
                    borderRadius: 24,
                    borderWidth: 1,
                    borderColor: theme.colors.glassBorder,
                  }}
                >
                  <Text variant="subtitle" color="textPrimary">Reset Onboarding (Testing)</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  onPress={handleSignOut}
                  style={{
                    marginTop: 16,
                    backgroundColor: theme.colors.backgroundMuted,
                    paddingHorizontal: 24,
                    paddingVertical: 12,
                    borderRadius: 24,
                    borderWidth: 1,
                    borderColor: theme.colors.glassBorder,
                  }}
                >
                  <Text variant="subtitle" color="textPrimary">Sign Out</Text>
                </TouchableOpacity>
              </Box>
            ) : (
              <OnboardingFlow 
                steps={onboardingSteps} 
                onComplete={markOnboardingComplete} 
              />
            )}
          </Authenticated>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}