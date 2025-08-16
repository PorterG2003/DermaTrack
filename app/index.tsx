import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeContext } from "../src/theme/ThemeContext";
import { View } from "react-native";
import { Showcase } from "./components/ui/Showcase";

export default function Index() {
  const { theme } = useThemeContext();
  
  // Debug logging
  console.log('Index - theme received:', theme);
  console.log('Index - gradients:', theme.gradients);
  console.log('Index - background colors:', theme.gradients.background.colors);
  
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
          <Showcase />
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}