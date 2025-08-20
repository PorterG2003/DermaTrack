import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { useThemeContext } from '../../../theme/ThemeContext';
import { Box, Text } from '../index';

interface StreakWidgetProps {
  streakCount?: number; // Current streak count
  onCheckIn?: () => void; // Callback for check-in action
  isTodayCompleted?: boolean; // Whether today's check-in is already completed
}

export default function StreakWidget({ 
  streakCount = 0, 
  onCheckIn,
  isTodayCompleted = false 
}: StreakWidgetProps) {
  const { theme } = useThemeContext();

  // Calculate fire size based on streak count
  // Tiny at 0, grows to max size at 21, stays same size after 21
  const getFireSize = (count: number) => {
    if (count === 0) return 24; // Tiny fire
    if (count >= 21) return 80; // Max size
    // Linear interpolation from 24 to 80 for counts 1-21
    return 24 + ((count - 1) * (80 - 24)) / 20;
  };

  const fireSize = getFireSize(streakCount);

  // Fire emoji with dynamic sizing
  const renderFire = () => {
    return (
      <Ionicons 
        name="flame" 
        size={fireSize} 
        color={theme.colors.primary} 
      />
    );
  };

  const handleCheckIn = () => {
    if (onCheckIn && !isTodayCompleted) {
      onCheckIn();
    }
  };

  return (
    <Box 
      backgroundColor="backgroundMuted" 
      padding="xl" 
      borderRadius="m"
      borderWidth={1}
      borderColor="glassBorder"
      alignItems="center"
    >
      <Text variant="subtitle" color="textPrimary" marginBottom="m">
        Current Streak
      </Text>
      
      {/* Fire visual */}
      <Box marginBottom="l" alignItems="center">
        {renderFire()}
      </Box>
      
      {/* Streak number */}
      <Text 
        variant="heading" 
        color="primary" 
        marginBottom="xl" 
        textAlign="center"
        style={{ fontSize: 32, fontWeight: 'bold' }}
      >
        {streakCount}
      </Text>
      
      {/* Check-in button */}
      <TouchableOpacity
        onPress={handleCheckIn}
        disabled={isTodayCompleted}
        style={{
          backgroundColor: isTodayCompleted ? theme.colors.backgroundMuted : theme.colors.primary,
          paddingHorizontal: 28,
          paddingVertical: 14,
          borderRadius: 24,
          opacity: isTodayCompleted ? 0.6 : 1,
        }}
      >
        <Text 
          variant="subtitle" 
          color={isTodayCompleted ? "textSecondary" : "white"}
          textAlign="center"
        >
          {isTodayCompleted ? "Today's Check-in Completed" : "Complete Today's Check-in"}
        </Text>
      </TouchableOpacity>
    </Box>
  );
}
