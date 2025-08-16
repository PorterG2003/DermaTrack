import React from 'react';
import { View, ViewStyle } from 'react-native';
import { useThemeContext } from '../../../src/theme/ThemeContext';

type ContainerVariant = 'default' | 'glass' | 'card' | 'section';
type ContainerSize = 'compact' | 'normal' | 'spacious';

interface ContainerProps {
  variant?: ContainerVariant;
  size?: ContainerSize;
  children: React.ReactNode;
  style?: ViewStyle;
  fullWidth?: boolean;
  centerContent?: boolean;
}

export function Container({ 
  variant = 'default', 
  size = 'normal', 
  children, 
  style,
  fullWidth = false,
  centerContent = false,
}: ContainerProps) {
  const { theme } = useThemeContext();
  
  const getContainerStyles = (): ViewStyle => {
    const baseStyles: ViewStyle = {
      width: fullWidth ? '100%' : 'auto',
    };

    // Size variants
    const sizeStyles: Record<ContainerSize, ViewStyle> = {
      compact: { padding: theme.spacing.m },
      normal: { padding: theme.spacing.l },
      spacious: { padding: theme.spacing.xl },
    };

    // Variant styles
    const variantStyles: Record<ContainerVariant, ViewStyle> = {
      default: {
        backgroundColor: 'transparent',
      },
      glass: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderWidth: 1,
        borderColor: theme.colors.glassBorder,
        borderRadius: theme.borderRadii.l,
        shadowColor: theme.colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
      },
      card: {
        backgroundColor: theme.colors.backgroundMuted,
        borderRadius: theme.borderRadii.xl,
        shadowColor: theme.colors.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
      },
      section: {
        backgroundColor: 'transparent',
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.glassBorder,
      },
    };

    const contentStyles: ViewStyle = centerContent ? {
      alignItems: 'center',
      justifyContent: 'center',
    } : {};

    return {
      ...baseStyles,
      ...sizeStyles[size],
      ...variantStyles[variant],
      ...contentStyles,
    };
  };

  return (
    <View style={[getContainerStyles(), style]}>
      {children}
    </View>
  );
}
