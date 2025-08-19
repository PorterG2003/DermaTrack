import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { useThemeContext } from '../../../theme/ThemeContext';
import { Box, Text } from '../index';

interface CheckInWidgetProps {
  completedDays?: number; // Number of completed check-ins (0-7)
}

export default function CheckInWidget({ completedDays = 0 }: CheckInWidgetProps) {
  const { theme } = useThemeContext();

  // Create array of 7 days (past 7 days, current day is day 7)
  const weekData = Array.from({ length: 7 }, (_, index) => {
    const dayNumber = index + 1;
    const isCompleted = dayNumber <= completedDays;
    const isCurrentDay = dayNumber === 7;
    const isMissed = !isCompleted && dayNumber < 7; // Missed days (not current day)
    
    return {
      dayNumber,
      isCompleted,
      isCurrentDay,
      isMissed,
    };
  });

  const isTodayCompleted = completedDays >= 7;

  return (
    <Box 
      backgroundColor="backgroundMuted" 
      padding="l" 
      borderRadius="m"
      borderWidth={1}
      borderColor="glassBorder"
    >
      <Text variant="subtitle" color="textPrimary" marginBottom="s">
        Current Check-In Streak
      </Text>
      
      <Text variant="heading" color="primary" marginBottom="m" textAlign="center">
        {completedDays}
      </Text>
      
      <Box flexDirection="row" justifyContent="space-between" alignItems="center">
        {weekData.map((dayData) => (
          <Box key={dayData.dayNumber} alignItems="center">
            <Text variant="caption" color="textSecondary" marginBottom="s">
              {dayData.dayNumber}
            </Text>
            
            <Box
              width={32}
              height={32}
              borderRadius="pill"
              backgroundColor={dayData.isCompleted ? 'primary' : 'backgroundMuted'}
              borderWidth={2}
              borderColor="glassBorder"
              justifyContent="center"
              alignItems="center"
              style={[
                dayData.isCurrentDay && {
                  borderColor: theme.colors.primary,
                  borderWidth: 3,
                },
                dayData.isMissed && {
                  borderColor: '#ff6b6b',
                  borderWidth: 2,
                }
              ]}
            >
              {dayData.isCompleted && (
                <Ionicons 
                  name="checkmark" 
                  size={18} 
                  color={theme.colors.white} 
                />
              )}
            </Box>
          </Box>
        ))}
      </Box>
      
      <TouchableOpacity
        onPress={() => {
          if (!isTodayCompleted) {
            // Handle check-in completion
            console.log('Complete today\'s check-in');
          }
        }}
        disabled={isTodayCompleted}
        style={{
          marginTop: 16,
          backgroundColor: isTodayCompleted ? theme.colors.backgroundMuted : theme.colors.primary,
          paddingHorizontal: 24,
          paddingVertical: 12,
          borderRadius: 24,
          opacity: isTodayCompleted ? 0.6 : 1,
        }}
      >
        <Text 
          variant="subtitle" 
          color={isTodayCompleted ? "textSecondary" : "white"}
          textAlign="center"
        >
          {isTodayCompleted ? "Today's Check-in Already Completed" : "Complete Today's Check-in"}
        </Text>
      </TouchableOpacity>
    </Box>
  );
}
