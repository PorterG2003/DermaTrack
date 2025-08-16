import React from 'react';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { createBox, createText } from '@shopify/restyle';
import { useThemeContext } from '../../../src/theme';
import { ViewStyle } from 'react-native';

const Box = createBox<ReturnType<typeof useThemeContext>['theme']>();
const Text = createText<ReturnType<typeof useThemeContext>['theme']>();

type GlassProps = {
  children?: React.ReactNode;
  intensity?: number;
  tint?: 'light' | 'dark' | 'default';
  border?: boolean;
  padding?: keyof ReturnType<typeof useThemeContext>['theme']['spacing'];
  radius?: keyof ReturnType<typeof useThemeContext>['theme']['borderRadii'];
  style?: ViewStyle | ViewStyle[];
};

export function GlassCard({
  children,
  intensity = 50,
  tint = 'dark',
  border = true,
  padding = 'l',
  radius = 'xl',
  style,
}: GlassProps) {
  const { theme } = useThemeContext();
  return (
    <Box borderRadius={radius} overflow="hidden" style={style}>
      <BlurView intensity={intensity} tint={tint} style={{ width: '100%', height: '100%' }}>
        <LinearGradient
          colors={['rgba(255,255,255,0.10)', 'rgba(255,255,255,0.05)', 'rgba(255,255,255,0.02)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ width: '100%', height: '100%' }}
        >
          <Box
            padding={padding}
            style={
              border
                ? {
                    borderWidth: 1,
                    borderColor: theme.colors.glassBorder,
                    // Inner highlight border (top-left) for liquid-glass effect
                    borderTopColor: theme.colors.glassBorderStrong,
                    borderLeftColor: theme.colors.glassBorderStrong,
                  }
                : undefined
            }
          >
            {children}
          </Box>
        </LinearGradient>
      </BlurView>
    </Box>
  );
}

export { Box, Text };
