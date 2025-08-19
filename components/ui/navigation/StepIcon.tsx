import React from 'react';
import { Image, View } from 'react-native';
import { useThemeContext } from '../../../theme/ThemeContext';
import { Text } from '../index';

interface StepIconProps {
  icon: string | React.ReactNode;
  size?: 'small' | 'medium' | 'large';
  variant?: 'emoji' | 'image';
  imageSource?: any;
}

export function StepIcon({ 
  icon, 
  size = 'medium', 
  variant = 'emoji',
  imageSource 
}: StepIconProps) {
  const { theme } = useThemeContext();
  
  const sizeMap = {
    small: { container: 80, icon: 60, fontSize: 32, lineHeight: 80 },
    medium: { container: 120, icon: 80, fontSize: 48, lineHeight: 120 },
    large: { container: 140, icon: 120, fontSize: 64, lineHeight: 140 },
  };
  
  const dimensions = sizeMap[size];
  
  return (
    <View style={{
      width: dimensions.container,
      height: dimensions.container,
      borderRadius: theme.borderRadii.xl,
      backgroundColor: theme.colors.backgroundMuted,
      borderWidth: 1,
      borderColor: theme.colors.glassBorder,
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      marginBottom: theme.spacing.xl,
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.3,
      shadowRadius: 16,
      elevation: 8,
      overflow: 'hidden',
    }}>
      {variant === 'emoji' ? (
        <Text 
          variant="title" 
          color="primary" 
          fontSize={dimensions.fontSize} 
          height={dimensions.lineHeight} 
          lineHeight={dimensions.lineHeight}
        >
          {icon}
        </Text>
      ) : (
        <Image
          source={imageSource}
          style={{
            width: dimensions.icon,
            height: dimensions.icon,
            borderRadius: theme.borderRadii.l,
          }}
          resizeMode="contain"
        />
      )}
    </View>
  );
}
