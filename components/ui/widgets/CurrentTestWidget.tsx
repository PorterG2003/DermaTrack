import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { useThemeContext } from '../../../theme/ThemeContext';
import { Box, Text } from '../index';

interface CurrentTestWidgetProps {
  testName?: string;
  testDescription?: string;
  daysRemaining?: number;
  isTodayCompleted?: boolean;
  onStartTest?: () => void;
  onCompleteCheckIn?: () => void;
}

export default function CurrentTestWidget({ 
  testName, 
  testDescription, 
  daysRemaining, 
  isTodayCompleted = false,
  onStartTest, 
  onCompleteCheckIn 
}: CurrentTestWidgetProps) {
  const { theme } = useThemeContext();

  const hasActiveTest = testName && testDescription;

  if (!hasActiveTest) {
    return (
      <Box 
        backgroundColor="backgroundMuted" 
        padding="xl" 
        borderRadius="m"
        borderWidth={1}
        borderColor="glassBorder"
      >
        <Box flexDirection="row" alignItems="center" marginBottom="m">
          <Ionicons name="flask" size={16} color={theme.colors.textPrimary} style={{ marginRight: 6 }} />
          <Text variant="subtitle" color="textPrimary">
            Current Test
          </Text>
        </Box>
        <Text variant="subtitle" color="textSecondary" marginBottom="xl">
          No active test running
        </Text>
        
        <TouchableOpacity onPress={onStartTest}>
          <Box
            backgroundColor="primary"
            paddingHorizontal="l"
            paddingVertical="m"
            borderRadius="m"
            alignItems="center"
          >
            <Text variant="subtitle" color="white">
              Start a New Test
            </Text>
          </Box>
        </TouchableOpacity>
      </Box>
    );
  }

  return (
    <Box 
      backgroundColor="backgroundMuted" 
      padding="xl"
      borderRadius="m"
      borderWidth={1}
      borderColor="glassBorder"
    >
      {/* Header with icon and days remaining */}
      <Box flexDirection="row" justifyContent="space-between" alignItems="center" marginBottom="l">
        <Box flexDirection="row" alignItems="center">
          <Ionicons name="flask" size={16} color={theme.colors.textPrimary} style={{ marginRight: 6 }} />
          <Text variant="subtitle" color="textPrimary">
            Current Test
          </Text>
        </Box>
        
        {daysRemaining !== undefined && (
          <Box 
            backgroundColor="backgroundMuted"
            paddingHorizontal="s" 
            paddingVertical="xs" 
            borderRadius="s"
            borderWidth={1}
            borderColor="glassBorder"
          >
            <Text variant="caption" color="textSecondary" fontWeight="600">
              {daysRemaining} days left
            </Text>
          </Box>
        )}
      </Box>

      {/* Test content */}
      <Box marginBottom="xl">
        <Text variant="title" color="textPrimary" marginBottom="s">
          {testName}
        </Text>
        <Text variant="subtitle" color="textSecondary">
          {testDescription}
        </Text>
      </Box>
    </Box>
  );
}
