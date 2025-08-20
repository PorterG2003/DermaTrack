import { Ionicons } from '@expo/vector-icons';
import { useQuery } from 'convex/react';
import React from 'react';
import { ScrollView } from 'react-native';
import { Box, CurrentTestWidget, StreakWidget, Text } from '../../components';
import { api } from '../../convex/_generated/api';
import { useProfile, useUserPhotos } from '../../hooks/useProfile';
import { useThemeContext } from '../../theme/ThemeContext';

interface DashboardScreenProps {
  onStartTest?: () => void;
}

export default function DashboardScreen({ onStartTest }: DashboardScreenProps) {
  const { theme } = useThemeContext();
  const { profile } = useProfile();
  const { userId } = useUserPhotos();
  
  // Fetch user's active test
  const activeTest = useQuery(api.tests.getActiveTest, 
    userId ? { userId } : "skip"
  );
  
  // Fetch recent check-ins to calculate streak
  const recentCheckIns = useQuery(api.checkIns.getRecentCheckIns, 
    userId ? { userId, limit: 7 } : "skip"
  );

  // Calculate streak count from recent check-ins
  const completedDays = recentCheckIns ? recentCheckIns.length : 0;

  // Calculate days remaining for active test (default to 14 days if no duration)
  const getDaysRemaining = () => {
    if (!activeTest || !activeTest.startDate) return undefined;
    const startDate = new Date(activeTest.startDate);
    const now = new Date();
    const daysElapsed = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const daysRemaining = Math.max(0, 14 - daysElapsed); // Default to 14 days
    return daysRemaining;
  };

  const handleStartTest = () => {
    onStartTest?.();
  };

  const handleViewTest = () => {
    // TODO: Navigate to test details screen
    console.log('View test details');
  };

  const handleCheckIn = () => {
    // TODO: Handle daily check-in
    console.log('Daily check-in completed');
  };

  return (
    <ScrollView 
      style={{ flex: 1 }} 
      contentContainerStyle={{ padding: 20, paddingBottom: 120 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header Section */}
      <Box marginBottom="xl">
        <Text variant="title" color="textPrimary" marginBottom="xs">
          Dashboard
        </Text>
        <Text variant="subtitle" color="textSecondary">
          Track your skin health journey
        </Text>
      </Box>

      {/* Streak Widget */}
      <Box marginBottom="xl">
        <StreakWidget 
          streakCount={completedDays}
          onCheckIn={handleCheckIn}
          isTodayCompleted={completedDays >= 7}
        />
      </Box>

      {/* Current Test Widget */}
      <Box marginBottom="xl">
        <CurrentTestWidget
          testName={activeTest?.name}
          testDescription={activeTest?.description}
          daysRemaining={getDaysRemaining()}
          onStartTest={handleStartTest}
          onViewTest={handleViewTest}
        />
      </Box>

      {/* Today's Check-in Widget */}
      <Box 
        backgroundColor="backgroundMuted" 
        padding="xl" 
        borderRadius="m"
        borderWidth={1}
        borderColor="glassBorder"
        marginBottom="l"
      >
        <Box flexDirection="row" alignItems="center" marginBottom="m">
          <Ionicons name="checkmark-circle" size={16} color={theme.colors.textPrimary} style={{ marginRight: 6 }} />
          <Text variant="subtitle" color="textPrimary">
            Today's Check-in
          </Text>
        </Box>
        <Text variant="subtitle" color="textSecondary">
          Coming soon: Complete your daily skin tracking
        </Text>
      </Box>
    </ScrollView>
  );
}
