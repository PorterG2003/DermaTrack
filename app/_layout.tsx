import { Platform } from 'react-native'
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import { Stack } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { ThemeProvider as RestyleThemeProvider } from "@shopify/restyle";
import { ThemeProvider, useThemeContext } from "../src/theme";
import { LoadingScreen } from "./components";
import { useAppLoading } from "./hooks/useAppLoading";

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
});

const secureStorage = {
  getItem: SecureStore.getItemAsync,
  setItem: SecureStore.setItemAsync,
  removeItem: SecureStore.deleteItemAsync,
};

function AppContent() {
  const { theme } = useThemeContext();
  const { isLoading, loadingMessage } = useAppLoading();
  
  if (isLoading) {
    return <LoadingScreen message={loadingMessage} />;
  }
  
  return (
    <RestyleThemeProvider theme={theme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
    </RestyleThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <ConvexAuthProvider
      client={convex}
      storage={
        Platform.OS === "android" || Platform.OS === "ios"
          ? secureStorage
          : undefined
      }
    >
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </ConvexAuthProvider>
  );
}