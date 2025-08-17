import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  withSequence,
  interpolate,
  Easing 
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeContext } from '../../theme/ThemeContext';

interface LoadingScreenProps {
  message?: string;
}

export function LoadingScreen({ message = 'Loading...' }: LoadingScreenProps) {
  const { theme } = useThemeContext();
  
  // Animation values
  const rotation = useSharedValue(0);
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);

  useEffect(() => {
    // Start animations
    opacity.value = withTiming(1, { duration: 500 });
    
    rotation.value = withRepeat(
      withTiming(360, { 
        duration: 2000, 
        easing: Easing.linear 
      }),
      -1
    );
    
    scale.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 1000 }),
        withTiming(0.8, { duration: 1000 })
      ),
      -1,
      true
    );
  }, []);

  // Animated styles
  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const spinnerStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${rotation.value}deg` },
      { scale: scale.value },
    ],
  }));

  const pulseStyle = useAnimatedStyle(() => {
    const pulseOpacity = interpolate(
      scale.value,
      [0.8, 1.2],
      [0.3, 0.8]
    );
    
    return {
      opacity: pulseOpacity,
      transform: [{ scale: scale.value * 1.5 }],
    };
  });

  return (
    <LinearGradient
      colors={theme.gradients.background.colors as [string, string, string, string, string, string, string, string, string, string, string, string, string, string, string]}
      locations={theme.gradients.background.locations as [number, number, number, number, number, number, number, number, number, number, number, number, number, number, number]}
      start={theme.gradients.background.start}
      end={theme.gradients.background.end}
      style={{ flex: 1 }}
    >
      <Animated.View style={[
        {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'transparent',
        },
        containerStyle
      ]}>
        
        {/* Main spinner */}
        <Animated.View style={[
          {
            width: 80,
            height: 80,
            borderRadius: 40,
            borderWidth: 4,
            borderColor: 'transparent',
            borderTopColor: theme.colors.primary,
            borderRightColor: theme.colors.secondary,
          },
          spinnerStyle
        ]} />
        
        {/* Loading text */}
        <Text style={{
          marginTop: 40,
          color: theme.colors.textPrimary,
          fontSize: 18,
          fontWeight: '600',
          textAlign: 'center',
        }}>
          {message}
        </Text>
        
        {/* Subtitle */}
        <Text style={{
          marginTop: 8,
          color: theme.colors.textSecondary,
          fontSize: 14,
          textAlign: 'center',
        }}>
          Please wait while we prepare everything for you
        </Text>
      </Animated.View>
    </LinearGradient>
  );
}
