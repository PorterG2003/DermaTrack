import { useQuery } from 'convex/react';
import React from 'react';
import { ScrollView } from 'react-native';
import { Box, CheckInWidget, CurrentTestWidget, Text } from '../../components';
import { api } from '../../convex/_generated/api';
import { useProfile, useUserPhotos } from '../../hooks/useProfile';

export default function DashboardScreen() {
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

  // Calculate completed days for the streak
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
    // TODO: Navigate to test selection screen
    console.log('Start new test');
  };

  const handleViewTest = () => {
    // TODO: Navigate to test details screen
    console.log('View test details');
  };

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
      <Box marginBottom="l">
        <Text variant="title" color="textPrimary">
          Dashboard
        </Text>
        <Text variant="subtitle" color="textSecondary" marginTop="xs">
          Track your skin health journey
        </Text>
      </Box>

      {/* 7-Day Check-in Widget */}
      <CheckInWidget completedDays={completedDays} />

      {/* Current Test Widget */}
      <CurrentTestWidget
        testName={activeTest?.name}
        testDescription={activeTest?.description}
        daysRemaining={getDaysRemaining()}
        onStartTest={handleStartTest}
        onViewTest={handleViewTest}
      />

      {/* Today's Check-in Widget */}
      <Box 
        backgroundColor="backgroundMuted" 
        padding="l" 
        borderRadius="m"
        borderWidth={1}
        borderColor="glassBorder"
        marginBottom="m"
      >
        <Text variant="subtitle" color="textPrimary" marginBottom="s">
          ✅ Today's Check-in
        </Text>
        <Text variant="subtitle" color="textSecondary">
          Coming soon: Complete your daily skin tracking
        </Text>
      </Box>
    </ScrollView>
  );
}
