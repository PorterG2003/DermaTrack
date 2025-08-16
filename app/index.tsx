import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { GlassCard, Box, Text } from "./components/Glass";

export default function Index() {
  const tasks = useQuery(api.tasks.get);
  return (
    <LinearGradient
      colors={["#0B0C10", "#0B0C10"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <Box flex={1} padding="l">
          <Box flex={1} justifyContent="center" alignItems="center" gap="l">
            <Text variant="heading">Tasks</Text>
            <GlassCard style={{ width: '90%' }}>
              <Box gap="m">
                {tasks?.map(({ _id, text }) => (
                  <Text key={_id} variant="title">
                    {text}
                  </Text>
                ))}
                {!tasks && (
                  <Text variant="subtitle">Loading…</Text>
                )}
              </Box>
            </GlassCard>
          </Box>
        </Box>
      </SafeAreaView>
    </LinearGradient>
  );
}