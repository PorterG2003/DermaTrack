import { ConvexProvider, ConvexReactClient } from "convex/react";
import { Stack } from "expo-router";
import { ThemeProvider } from "@shopify/restyle";
import { theme } from "./theme";

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
});

export default function RootLayout() {
  return (
    <ConvexProvider client={convex}>
      <ThemeProvider theme={theme}>
        <Stack>
          <Stack.Screen name="index" />
        </Stack>
      </ThemeProvider>
    </ConvexProvider>
  );
}