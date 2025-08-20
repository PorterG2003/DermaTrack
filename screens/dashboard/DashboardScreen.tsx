import { useQuery } from 'convex/react';
import React, { useMemo } from 'react';
import { ScrollView } from 'react-native';
import { Box, CurrentTestWidget, StreakWidget, Text } from '../../components';
import { api } from '../../convex/_generated/api';
import { useProfile, useUserPhotos } from '../../hooks/useProfile';
import { useThemeContext } from '../../theme/ThemeContext';

interface DashboardScreenProps {
  onStartTest?: () => void;
  onStartTestCheckIn?: () => void;
}

export default function DashboardScreen({ onStartTest, onStartTestCheckIn }: DashboardScreenProps) {
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

  const handleCompleteCheckIn = () => {
    // Navigate to check-in flow with test questions
    onStartTestCheckIn?.();
  };

  const handleCheckIn = () => {
    // TODO: Handle daily check-in
    console.log('Daily check-in completed');
  };

  // Check if today's check-in is completed
  const isTodayCompleted = useMemo(() => {
    if (!recentCheckIns || recentCheckIns.length === 0) {
      console.log('No recent check-ins found');
      return false;
    }
    
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000 - 1); // End of today
    
    console.log('Checking for check-ins between:', todayStart.toISOString(), 'and', todayEnd.toISOString());
    console.log('Recent check-ins:', recentCheckIns.map(c => ({
      id: c._id,
      createdAt: new Date(c.createdAt).toISOString(),
      userId: c.userId
    })));
    
    const hasTodayCheckIn = recentCheckIns.some(checkIn => {
      const checkInTime = checkIn.createdAt;
      return checkInTime >= todayStart.getTime() && checkInTime <= todayEnd.getTime();
    });
    
    console.log('Has today check-in:', hasTodayCheckIn);
    return hasTodayCheckIn;
  }, [recentCheckIns]);

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
          isTodayCompleted={isTodayCompleted}
          onStartTest={handleStartTest}
          onCompleteCheckIn={handleCompleteCheckIn}
        />
      </Box>
    </ScrollView>
  );
}
