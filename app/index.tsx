import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeContext } from "../src/theme/ThemeContext";
import { View, TouchableOpacity } from "react-native";
import { AuthScreen } from "./screens";
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { Text, Box } from "./components";
import { useAuthActions } from "@convex-dev/auth/react";

export default function Index() {
  const { theme } = useThemeContext();
  const { signOut } = useAuthActions();
  
  // Debug logging
  console.log('Index - theme received:', theme);
  console.log('Index - gradients:', theme.gradients);
  console.log('Index - background colors:', theme.gradients.background.colors);
  
  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };
  
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
            <Box flex={1} justifyContent="center" alignItems="center" padding="l">
              <Text variant="title" color="textPrimary" textAlign="center">
                Welcome to DermaTrack! 🎉
              </Text>
              <Text variant="subtitle" color="textSecondary" textAlign="center" marginTop="m">
                You are successfully signed in with Google
              </Text>
              <TouchableOpacity
                onPress={handleSignOut}
                style={{
                  marginTop: 32,
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  paddingHorizontal: 24,
                  paddingVertical: 12,
                  borderRadius: 24,
                  borderWidth: 1,
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                }}
              >
                <Text variant="subtitle" color="textPrimary">Sign Out</Text>
              </TouchableOpacity>
            </Box>
          </Authenticated>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}