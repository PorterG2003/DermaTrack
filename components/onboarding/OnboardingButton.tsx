import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Box, Text } from '../ui';
import { useThemeContext } from '../../theme/ThemeContext';

interface OnboardingButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
  loading?: boolean;
}

export function OnboardingButton({ 
  title, 
  onPress, 
  variant = 'primary',
  disabled = false,
  loading = false
}: OnboardingButtonProps) {
  const { theme } = useThemeContext();
  
  const getButtonStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: theme.colors.primary,
          borderColor: theme.colors.primary,
        };
      case 'secondary':
        return {
          backgroundColor: 'transparent',
          borderColor: theme.colors.glassBorder,
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          borderColor: 'transparent',
        };
      default:
        return {
          backgroundColor: theme.colors.primary,
          borderColor: theme.colors.primary,
        };
    }
  };
  
  const getTextColor = () => {
    switch (variant) {
      case 'primary':
        return theme.colors.white;
      case 'secondary':
        return theme.colors.textPrimary;
      case 'ghost':
        return theme.colors.textSecondary;
      default:
        return theme.colors.white;
    }
  };
  
  const buttonStyles = getButtonStyles();
  const textColor = getTextColor();
  
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={{
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <Box
        paddingHorizontal="l"
        paddingVertical="m"
        borderRadius="l"
        borderWidth={1}
        alignItems="center"
        justifyContent="center"
        minHeight={48}
        style={buttonStyles}
      >
        {loading ? (
          <Text variant="subtitle" color="white" style={{ color: textColor }}>
            Loading...
          </Text>
        ) : (
          <Text variant="subtitle" color="white" style={{ color: textColor }}>
            {title}
          </Text>
        )}
      </Box>
    </TouchableOpacity>
  );
}
