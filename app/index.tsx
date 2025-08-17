import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeContext } from "../theme/ThemeContext";
import { View, TouchableOpacity } from "react-native";
import { AuthScreen } from "../screens";
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { Text, Box } from "../components";
import { useAuthActions } from "@convex-dev/auth/react";
import {
  OnboardingFlow,
  WelcomeStep,
  GenderStep,
  DateOfBirthStep,
  SkinTypeStep,
  PrimaryConcernsStep,
  PhotoPermissionsStep,
  NotificationsStep,
  GoalsStep,
  CompleteStep
} from "../screens/onboarding";
import { useOnboardingData } from "../hooks/useOnboardingData";

export default function Index() {
  const { theme } = useThemeContext();
  const { signOut } = useAuthActions();
  const { isOnboardingComplete, isLoading: onboardingLoading, markOnboardingComplete, resetOnboarding } = useOnboardingData();

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