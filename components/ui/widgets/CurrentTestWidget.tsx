import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { useThemeContext } from '../../../theme/ThemeContext';
import { Box, Text } from '../index';

interface CurrentTestWidgetProps {
  testName?: string;
  testDescription?: string;
  daysRemaining?: number;
  onStartTest?: () => void;
  onViewTest?: () => void;
}

export default function CurrentTestWidget({ 
  testName, 
  testDescription, 
  daysRemaining, 
  onStartTest, 
  onViewTest 
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
      <Box flexDirection="row" justifyContent="space-between" alignItems="flex-start" marginBottom="l">
        <Box flex={1}>
          <Box flexDirection="row" alignItems="center" marginBottom="m">
            <Ionicons name="flask" size={16} color={theme.colors.textPrimary} style={{ marginRight: 6 }} />
            <Text variant="subtitle" color="textPrimary">
              Current Test
            </Text>
          </Box>
          <Text variant="title" color="textPrimary" marginBottom="s">
            {testName}
          </Text>
          <Text variant="subtitle" color="textSecondary" marginBottom="m">
            {testDescription}
          </Text>
        </Box>
        
        <TouchableOpacity onPress={onViewTest}>
          <Box
            backgroundColor="primary"
            paddingHorizontal="m"
            paddingVertical="s"
            borderRadius="m"
          >
            <Ionicons name="eye" size={16} color={theme.colors.white} />
          </Box>
        </TouchableOpacity>
      </Box>

      {daysRemaining !== undefined && (
        <Box 
          backgroundColor="primary" 
          paddingHorizontal="m" 
          paddingVertical="s" 
          borderRadius="m"
          alignSelf="flex-start"
          marginBottom="l"
        >
          <Text variant="caption" color="white" fontWeight="600">
            {daysRemaining} days remaining
          </Text>
        </Box>
      )}

      <TouchableOpacity onPress={onViewTest}>
        <Box
          backgroundColor="backgroundMuted"
          paddingHorizontal="l"
          paddingVertical="m"
          borderRadius="m"
          borderWidth={1}
          borderColor="glassBorder"
          alignItems="center"
        >
          <Text variant="subtitle" color="textPrimary">
            View Test Details
          </Text>
        </Box>
      </TouchableOpacity>
    </Box>
  );
}
