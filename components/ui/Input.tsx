import React, { useState } from 'react';
import { TextInput, TextInputProps, View, Text, ViewStyle, TextStyle } from 'react-native';
import { useThemeContext } from '../../theme/ThemeContext';

type InputVariant = 'default' | 'glass' | 'outline';
type InputSize = 'small' | 'medium' | 'large';

interface InputProps extends Omit<TextInputProps, 'style'> {
  variant?: InputVariant;
  size?: InputSize;
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  errorStyle?: TextStyle;
}

export function Input({ 
  variant = 'default', 
  size = 'medium', 
  label,
  error,
  containerStyle,
  inputStyle,
  labelStyle,
  errorStyle,
  ...props 
}: InputProps) {
  const { theme } = useThemeContext();
  const [isFocused, setIsFocused] = useState(false);
  
  const getContainerStyles = (): ViewStyle => {
    const baseStyles: ViewStyle = {
      marginBottom: theme.spacing.m,
    };

    return {
      ...baseStyles,
      ...containerStyle,
    };
  };

  const getInputStyles = (): ViewStyle => {
    const baseStyles: ViewStyle = {
      borderWidth: 1,
      borderRadius: theme.borderRadii.m,
      paddingHorizontal: theme.spacing.m,
    };

    // Size variants
    const sizeStyles: Record<InputSize, ViewStyle> = {
      small: { 
        paddingVertical: theme.spacing.s,
        minHeight: 36,
      },
      medium: { 
        paddingVertical: theme.spacing.m,
        minHeight: 44,
      },
      large: { 
        paddingVertical: theme.spacing.l,
        minHeight: 52,
      },
    };

    // Variant styles
    const variantStyles: Record<InputVariant, ViewStyle> = {
      default: {
        backgroundColor: theme.colors.backgroundMuted,
        borderColor: theme.colors.glassBorder,
      },
      glass: {
        backgroundColor: theme.colors.backgroundMuted,
        borderColor: isFocused ? theme.colors.primary : theme.colors.glassBorder,
        shadowColor: theme.colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
      },
      outline: {
        backgroundColor: 'transparent',
        borderColor: isFocused ? theme.colors.primary : theme.colors.glassBorder,
      },
    };

    const focusStyles: ViewStyle = isFocused ? {
      borderColor: theme.colors.primary,
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    } : {};

    const errorStyles: ViewStyle = error ? {
      borderColor: '#EF4444',
    } : {};

    return {
      ...baseStyles,
      ...sizeStyles[size],
      ...variantStyles[variant],
      ...focusStyles,
      ...errorStyles,
    };
  };

  const getLabelStyles = (): TextStyle => ({
    color: theme.colors.textSecondary,
    fontSize: 14,
    fontWeight: '500',
    marginBottom: theme.spacing.xs,
    ...labelStyle,
  });

  const getTextStyles = (): TextStyle => {
    const sizeTextStyles: Record<InputSize, TextStyle> = {
      small: { fontSize: 14 },
      medium: { fontSize: 16 },
      large: { fontSize: 18 },
    };

    return {
      color: theme.colors.textPrimary,
      ...sizeTextStyles[size],
    };
  };

  const getErrorStyles = (): TextStyle => ({
    color: '#EF4444',
    fontSize: 12,
    marginTop: theme.spacing.xs,
    ...errorStyle,
  });

  return (
    <View style={getContainerStyles()}>
      {label && <Text style={getLabelStyles()}>{label}</Text>}
      <TextInput
        style={[getInputStyles() as any, getTextStyles(), inputStyle]}
        placeholderTextColor={theme.colors.textMuted}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
      {error && <Text style={getErrorStyles()}>{error}</Text>}
    </View>
  );
}
