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

  // Fetch today's test check-in for the active test
  const todayTestCheckIn = useQuery(api.testCheckins.getTestCheckinsByUserAndTest, 
    userId && activeTest ? { 
      userId, 
      testId: activeTest._id
    } : "skip"
  );

  // Calculate streak count from consecutive days of check-ins
  const completedDays = useMemo(() => {
    if (!recentCheckIns || recentCheckIns.length === 0) return 0;
    
    // Sort check-ins by date (newest first, then reverse to get oldest first)
    const sortedCheckIns = [...recentCheckIns].sort((a, b) => a.createdAt - b.createdAt);
    
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Start of today
    
    // Check each day backwards from today
    for (let i = 0; i < 30; i++) { // Check up to 30 days back
      const checkInDate = new Date(currentDate);
      checkInDate.setDate(currentDate.getDate() - i);
      
      // Check if there's a check-in for this date
      const hasCheckInForDate = sortedCheckIns.some(checkIn => {
        const checkInDateObj = new Date(checkIn.createdAt);
        const checkInStartOfDay = new Date(checkInDateObj.getFullYear(), checkInDateObj.getMonth(), checkInDateObj.getDate());
        return checkInStartOfDay.getTime() === checkInDate.getTime();
      });
      
      if (hasCheckInForDate) {
        streak++;
      } else {
        // Streak broken, stop counting
        break;
      }
    }
    
    console.log('Streak calculation:', { 
      totalCheckIns: recentCheckIns.length, 
      streak, 
      checkInDates: sortedCheckIns.map(c => new Date(c.createdAt).toISOString().split('T')[0])
    });
    
    return streak;
  }, [recentCheckIns]);

  // Calculate days remaining for active test
  const getDaysRemaining = () => {
    if (!activeTest || !activeTest.startDate) return undefined;
    
    const startDate = new Date(activeTest.startDate);
    const now = new Date();
    const daysElapsed = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // Use the test's duration field if available
    if (activeTest.duration) {
      return Math.max(0, activeTest.duration - daysElapsed);
    }
    
    // If no duration field, fall back to endDate calculation
    if (activeTest.endDate) {
      const endDate = new Date(activeTest.endDate);
      const totalDuration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      return Math.max(0, totalDuration - daysElapsed);
    }
    
    // Fallback to default duration for backward compatibility
    const defaultDuration = 14;
    return Math.max(0, defaultDuration - daysElapsed);
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

  // Check if today's test check-in is completed for the active test
  const isTodayCompleted = useMemo(() => {
    if (!todayTestCheckIn || todayTestCheckIn.length === 0) {
      console.log('No test check-ins found for today');
      return false;
    }
    
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000 - 1); // End of today
    
    console.log('Checking for test check-ins between:', todayStart.toISOString(), 'and', todayEnd.toISOString());
    console.log('Test check-ins:', todayTestCheckIn.map(tc => ({
      id: tc._id,
      createdAt: new Date(tc.createdAt).toISOString(),
      testId: tc.testId,
      completed: tc.completed
    })));
    
    const hasTodayTestCheckIn = todayTestCheckIn.some(testCheckIn => {
      const checkInTime = testCheckIn.createdAt;
      return checkInTime >= todayStart.getTime() && checkInTime <= todayEnd.getTime();
    });
    
    console.log('Has today test check-in:', hasTodayTestCheckIn);
    return hasTodayTestCheckIn;
  }, [todayTestCheckIn]);

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
