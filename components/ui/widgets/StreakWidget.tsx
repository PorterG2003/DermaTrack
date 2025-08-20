import React from 'react';
import Svg, { Path } from 'react-native-svg';
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
    if (count === 0) return 50; // Tiny fire
    if (count >= 60) return 120; // Max size
    // Linear interpolation from 24 to 80 for counts 1-21
    return 60 + ((count - 1) * (120 - 60)) / 59;
  };

  const fireSize = getFireSize(streakCount);

  // Custom fire icon with dynamic sizing and fire orange color
  const renderFire = () => {
    return (
      <Svg width={fireSize} height={fireSize * 1.25} viewBox="0 0 100 125">
        <Path
          fill={theme.colors.fireOrange}
          fillRule="evenodd"
          clipRule="evenodd"
          d="M84.531,55.57c0.001,0.016,0,0.03,0,0.045  c0.041,22.971-15.763,35.989-37.086,35.989c-18.32,0-27.559-9.191-32.731-22.172c0.047-0.021-0.665-2.624-0.647-4.622  c0.086-9.845,4.943-15.495,11.56-22.418c2.885-3.02,7.941-6.526,8.838-15.464c1.094-10.901-6.892-17.661-7.417-20.327  c13.074-0.234,22.452,4.297,30.225,13.288c4.191,4.846,6.377,9.183,14.279,23.67c0.956,1.769,1.186,2.097,1.003,1.723  c0.053-0.34,2.936-6.571-1.003-14.658c-0.935-1.606-1.855-3.354-1.855-3.696c0-0.042,0.011-0.082,0.014-0.124  c-0.143-1.698,1.167-1.888,1.842-1.724c7.168,4.505,12.317,14.184,12.91,28.541c0.035,0.323,0.062,0.659,0.069,1.024  c0.007,0.308-0.001,0.605,0,0.909C84.531,55.561,84.531,55.565,84.531,55.57z M30.489,17.958c1.08,2.079,3.302,10.471-0.932,16.683  c-1.833,2.689-3.262,4.285-6.851,7.503c-6.757,6.058-8.529,12.567-9.087,11.324c-0.974-2.167-0.79-12.475,1.879-16.792  c2.112-3.417,3.749-4.954,6.772-8.202c4.164-4.474,3.791-6.213,5.054-11.541C27.8,14.924,28.625,14.369,30.489,17.958z"
        />
      </Svg>
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
      paddingBottom="none"
      borderRadius="m"
      borderWidth={1}
      borderColor="glassBorder"
      alignItems="center"
    >
      <Text variant="subtitle" color="textPrimary" marginBottom="m">
        Current Streak
      </Text>
      
      {/* Fire icon positioned behind the number */}
      <Box marginBottom="xl" alignItems="center" position="relative">
        {/* Fire icon as background */}
        <Box position="absolute" alignItems="center" justifyContent="center">
          {renderFire()}
        </Box>
        
        {/* Streak number positioned on top */}
        <Text 
          variant="heading" 
          color="white" 
          textAlign="center"
          style={{ fontSize: 24, fontWeight: 'bold', lineHeight: getFireSize(streakCount)*1.2 }}
        >
          {streakCount}
        </Text>
      </Box>
    </Box>
  );
}
