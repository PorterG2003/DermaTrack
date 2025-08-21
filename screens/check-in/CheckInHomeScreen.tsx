import { Ionicons } from '@expo/vector-icons';
import { useQuery } from 'convex/react';
import React from 'react';
import { ScrollView } from 'react-native';
import { Box, Button, Text } from '../../components';
import { api } from '../../convex/_generated/api';
import { useProfile, useUserPhotos } from '../../hooks/useProfile';
import { useThemeContext } from '../../theme/ThemeContext';

interface CheckInHomeScreenProps {
  onStartCheckIn?: () => void;
  onViewAllCheckIns?: () => void;
}

export default function CheckInHomeScreen({ onStartCheckIn, onViewAllCheckIns }: CheckInHomeScreenProps) {
  const { theme } = useThemeContext();
  const { profile } = useProfile();
  const { userId } = useUserPhotos();
  
  // Fetch recent check-ins to determine today's status
  const recentCheckIns = useQuery(api.checkIns.getRecentCheckIns, 
    userId ? { userId, limit: 30 } : "skip"
  );

  // Fetch check-ins with test answers for detailed view
  const checkInsWithAnswers = useQuery(api.checkIns.getCheckInsWithTestAnswers, 
    userId ? { userId, limit: 30 } : "skip"
  );

  // Check if today's check-in is completed
  const isTodayCompleted = React.useMemo(() => {
    if (!recentCheckIns || recentCheckIns.length === 0) return false;
    
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000 - 1);
    
    return recentCheckIns.some(checkIn => {
      const checkInTime = checkIn.createdAt;
      return checkInTime >= todayStart.getTime() && checkInTime <= todayEnd.getTime();
    });
  }, [recentCheckIns]);

  // Get today's date for display
  const today = new Date();
  const todayFormatted = today.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const handleCheckIn = () => {
    // For now, we'll use the test check-in flow
    // In the future, this could be a simple daily check-in or photo check-in
    onStartCheckIn?.();
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
          Daily Check-in
        </Text>
        <Text variant="subtitle" color="textSecondary">
          Track your daily skin health progress
        </Text>
      </Box>

      {/* Today's Check-in Status Widget */}
      <Box 
        backgroundColor="backgroundMuted" 
        padding="xl" 
        borderRadius="m"
        borderWidth={1}
        borderColor="glassBorder"
        marginBottom="xl"
        alignItems="center"
      >
        {isTodayCompleted ? (
          <Box alignItems="center">
            <Box 
              backgroundColor="primary"
              alignItems="center"
              justifyContent="center"
              marginBottom="m"
              style={{ width: 60, height: 60, borderRadius: 30 }}
            >
              <Text variant="title" color="white">✓</Text>
            </Box>
            <Text variant="title" color="primary" marginBottom="s">
              Check-in Complete!
            </Text>
            <Text variant="subtitle" color="textSecondary" textAlign="center">
              Great job staying on track today
            </Text>
          </Box>
        ) : (
          <Box alignItems="center">
            <Text variant="title" color="textPrimary" marginBottom="s">
              Ready to Check-in?
            </Text>
            <Text variant="subtitle" color="textSecondary" textAlign="center" marginBottom="l">
              Complete today's check-in to track your progress
            </Text>
            
            <Button 
              onPress={handleCheckIn}
              variant="primary"
            >
              <Text variant="subtitle" color="white">
                Start Today's Check-in
              </Text>
            </Button>
          </Box>
        )}
      </Box>

      {/* Last Check-in */}
      <Box marginBottom="xl">
        
        {checkInsWithAnswers && checkInsWithAnswers.length > 1 ? (
          <Box
            backgroundColor="backgroundMuted"
            padding="xl"
            borderRadius="m"
            borderWidth={1}
            borderColor="glassBorder"
          >
            {/* Header with icon, title, and time badge */}
            <Box flexDirection="row" alignItems="center" justifyContent="space-between" marginBottom="m">
              <Box flexDirection="row" alignItems="center">
                <Ionicons 
                  name="checkmark-circle" 
                  size={20} 
                  color={theme.colors.textPrimary}
                  style={{ marginRight: 8 }}
                />
                <Text variant="subtitle" color="textPrimary">
                  Last Check-in
                </Text>
              </Box>
              <Box 
                backgroundColor="backgroundMuted"
                borderWidth={1}
                borderColor="glassBorder"
                paddingHorizontal="s"
                paddingVertical="xs"
                borderRadius="s"
              >
                <Text variant="caption" color="textSecondary" style={{ fontSize: 10 }}>
                  {(() => {
                    const lastCheckIn = checkInsWithAnswers[1];
                    const checkInDate = new Date(lastCheckIn.createdAt);
                    const now = new Date();
                    const daysDiff = Math.floor((now.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
                    
                    if (daysDiff === 0) return 'Today';
                    if (daysDiff === 1) return 'Yesterday';
                    if (daysDiff < 7) return `${daysDiff} days ago`;
                    if (daysDiff < 30) {
                      const weeks = Math.floor(daysDiff / 7);
                      return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
                    }
                    const months = Math.floor(daysDiff / 30);
                    return `${months} month${months > 1 ? 's' : ''} ago`;
                  })()}
                </Text>
              </Box>
            </Box>
            
            {/* Main content - date and time */}
            <Text variant="title" color="textPrimary" marginBottom="s">
              {(() => {
                const lastCheckIn = checkInsWithAnswers[1];
                const checkInDate = new Date(lastCheckIn.createdAt);
                return checkInDate.toLocaleDateString('en-US', { 
                  weekday: 'long',
                  month: 'long', 
                  day: 'numeric',
                  year: 'numeric'
                });
              })()}
            </Text>
            
            <Text variant="subtitle" color="textSecondary" marginBottom="m">
              {(() => {
                const lastCheckIn = checkInsWithAnswers[1];
                const checkInDate = new Date(lastCheckIn.createdAt);
                return checkInDate.toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                });
              })()}
            </Text>
            
            {/* Test answers overview */}
            {checkInsWithAnswers[1].testAnswers && (
              <Text variant="subtitle" color="textSecondary" marginBottom="l">
                {checkInsWithAnswers[1].testAnswers.answers.length} questions answered
              </Text>
            )}
            
                         {/* View All Button */}
             <Box
               backgroundColor="background"
               style={{
                 backgroundColor: 'transparent',
                 marginLeft: 'auto',
               }}
               onTouchEnd={onViewAllCheckIns}
             >
               <Box flexDirection="row" alignItems="center">
                 <Text variant="caption" fontWeight="600" style={{ color: theme.colors.primary }}>
                   View All
                 </Text>
                 <Ionicons 
                   name="chevron-forward" 
                   size={14} 
                   color={theme.colors.primary}
                   style={{ marginLeft: 4 }}
                 />
               </Box>
              </Box>
          </Box>
        ) : (
          <Box 
            backgroundColor="backgroundMuted"
            padding="l"
            borderRadius="m"
            borderWidth={1}
            borderColor="glassBorder"
            alignItems="center"
          >
            <Text variant="subtitle" color="textSecondary" textAlign="center">
              No previous check-ins yet. Complete your first check-in to start tracking!
            </Text>
          </Box>
        )}
      </Box>

      {/* Summary Section */}
      <Box 
        backgroundColor="backgroundMuted"
        padding="l"
        borderRadius="m"
        borderWidth={1}
        borderColor="glassBorder"
      >
        <Text variant="title" color="textPrimary" marginBottom="m">
          Summary
        </Text>
        
        <Box flexDirection="row" justifyContent="space-between" marginBottom="s">
          <Text variant="subtitle" color="textSecondary">Total Check-ins:</Text>
          <Text variant="subtitle" color="textPrimary">
            {recentCheckIns ? recentCheckIns.length : 0}
          </Text>
        </Box>
        
        <Box flexDirection="row" justifyContent="space-between" marginBottom="s">
          <Text variant="subtitle" color="textSecondary">This Week:</Text>
          <Text variant="subtitle" color="textPrimary">
            {recentCheckIns ? recentCheckIns.filter(checkIn => {
              const checkInDate = new Date(checkIn.createdAt);
              const weekAgo = new Date();
              weekAgo.setDate(weekAgo.getDate() - 7);
              return checkInDate >= weekAgo;
            }).length : 0}
          </Text>
        </Box>
        
        <Box flexDirection="row" justifyContent="space-between">
          <Text variant="subtitle" color="textSecondary">This Month:</Text>
          <Text variant="subtitle" color="textPrimary">
            {recentCheckIns ? recentCheckIns.filter(checkIn => {
              const checkInDate = new Date(checkIn.createdAt);
              const monthAgo = new Date();
              monthAgo.setMonth(monthAgo.getMonth() - 1);
              return checkInDate >= monthAgo;
            }).length : 0}
          </Text>
        </Box>
      </Box>
    </ScrollView>
  );
}
