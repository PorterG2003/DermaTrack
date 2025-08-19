import React from 'react';
import { View, ViewStyle } from 'react-native';
import { useThemeContext } from '../../../theme/ThemeContext';

type DividerVariant = 'solid' | 'dashed' | 'glass';
type DividerSize = 'thin' | 'normal' | 'thick';

interface DividerProps {
  variant?: DividerVariant;
  size?: DividerSize;
  style?: ViewStyle;
  margin?: 'none' | 'small' | 'normal' | 'large';
}

export function Divider({ 
  variant = 'solid', 
  size = 'normal', 
  style,
  margin = 'normal',
}: DividerProps) {
  const { theme } = useThemeContext();
  
  const getDividerStyles = (): ViewStyle => {
    const baseStyles: ViewStyle = {
      alignSelf: 'stretch',
    };

    // Size variants
    const sizeStyles: Record<DividerSize, ViewStyle> = {
      thin: { height: 1 },
      normal: { height: 2 },
      thick: { height: 4 },
    };

    // Variant styles
    const variantStyles: Record<DividerVariant, ViewStyle> = {
      solid: {
        backgroundColor: theme.colors.glassBorder,
      },
      dashed: {
        backgroundColor: 'transparent',
        borderStyle: 'dashed',
        borderWidth: 1,
        borderColor: theme.colors.glassBorder,
      },
      glass: {
        backgroundColor: theme.colors.backgroundMuted,
        shadowColor: theme.colors.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
      },
    };

    // Margin variants
    const marginStyles: Record<string, ViewStyle> = {
      none: {},
      small: { marginVertical: theme.spacing.s },
      normal: { marginVertical: theme.spacing.m },
      large: { marginVertical: theme.spacing.l },
    };

    return {
      ...baseStyles,
      ...sizeStyles[size],
      ...variantStyles[variant],
      ...marginStyles[margin],
    };
  };

  return <View style={[getDividerStyles(), style]} />;
}
