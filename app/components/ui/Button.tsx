import React from 'react';
import { TouchableOpacity, TouchableOpacityProps, Text, ViewStyle, TextStyle } from 'react-native';
import { useThemeContext } from '../../../src/theme/ThemeContext';

type ButtonVariant = 'primary' | 'secondary' | 'glass' | 'outline';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps extends TouchableOpacityProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Button({ 
  variant = 'primary', 
  size = 'medium', 
  children, 
  style, 
  textStyle,
  ...props 
}: ButtonProps) {
  const { theme } = useThemeContext();
  
  const getButtonStyles = (): ViewStyle => {
    const baseStyles: ViewStyle = {
      borderRadius: theme.borderRadii.m,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
    };

    // Size variants
    const sizeStyles: Record<ButtonSize, ViewStyle> = {
      small: { paddingHorizontal: 16, paddingVertical: 8, minHeight: 36 },
      medium: { paddingHorizontal: 24, paddingVertical: 12, minHeight: 44 },
      large: { paddingHorizontal: 32, paddingVertical: 16, minHeight: 52 },
    };

    // Variant styles
    const variantStyles: Record<ButtonVariant, ViewStyle> = {
      primary: {
        backgroundColor: theme.colors.primary,
        shadowColor: theme.colors.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 6,
      },
      secondary: {
        backgroundColor: theme.colors.secondary,
        shadowColor: theme.colors.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 6,
      },
      glass: {
        backgroundColor: theme.colors.backgroundMuted,
        borderWidth: 1,
        borderColor: theme.colors.glassBorder,
        shadowColor: theme.colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      },
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: theme.colors.primary,
      },
    };

    return {
      ...baseStyles,
      ...sizeStyles[size],
      ...variantStyles[variant],
    };
  };

  const getTextStyles = (): TextStyle => {
    const baseTextStyles: TextStyle = {
      fontWeight: '600',
      textAlign: 'center',
    };

    const sizeTextStyles: Record<ButtonSize, TextStyle> = {
      small: { fontSize: 14 },
      medium: { fontSize: 16 },
      large: { fontSize: 18 },
    };

    const variantTextStyles: Record<ButtonVariant, TextStyle> = {
      primary: { color: theme.colors.white },
      secondary: { color: theme.colors.black },
      glass: { color: theme.colors.textPrimary },
      outline: { color: theme.colors.primary },
    };

    return {
      ...baseTextStyles,
      ...sizeTextStyles[size],
      ...variantTextStyles[variant],
    };
  };

  return (
    <TouchableOpacity
      style={[getButtonStyles(), style]}
      activeOpacity={0.8}
      {...props}
    >
      <Text style={[getTextStyles(), textStyle]}>
        {children}
      </Text>
    </TouchableOpacity>
  );
}
