import React from 'react';
import { View, ViewStyle } from 'react-native';
import { useThemeContext } from '../../theme/ThemeContext';

type SpacerSize = 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl' | 'xxxl';

interface SpacerProps {
  size?: SpacerSize;
  horizontal?: boolean;
  style?: ViewStyle;
}

export function Spacer({ size = 'm', horizontal = false, style }: SpacerProps) {
  const { theme } = useThemeContext();
  
  const spacingValue = theme.spacing[size];
  
  const spacerStyle: ViewStyle = horizontal 
    ? { width: spacingValue }
    : { height: spacingValue };
  
  return <View style={[spacerStyle, style]} />;
}
