import React from 'react';
import Svg, { Path, Circle, Ellipse } from 'react-native-svg';
import { useThemeContext } from '../../theme/ThemeContext';

interface FaceSilhouetteProps {
  angle?: 'left' | 'center' | 'right';
  size?: number;
  color?: string;
  opacity?: number;
}

export function FaceSilhouette({ 
  angle = 'center', 
  size = 200, 
  color,
  opacity = 0.3 
}: FaceSilhouetteProps) {
  const { theme } = useThemeContext();
  const silhouetteColor = color || theme.colors.primary;
  // Calculate face positioning based on angle
  const getFacePosition = () => {
    switch (angle) {
      case 'right': return { x: size * 0.6, y: size * 0.5 };
      case 'left': return { x: size * 0.4, y: size * 0.5 };
      default: return { x: size * 0.5, y: size * 0.5 };
    }
  };

  const facePosition = getFacePosition();

  return (
    <Svg width={size} height={size} style={{ opacity }}>
      {/* Head outline */}
      <Path
        d={`
          M ${size * 0.3} ${size * 0.2}
          Q ${size * 0.5} ${size * 0.1} ${size * 0.7} ${size * 0.2}
          Q ${size * 0.8} ${size * 0.3} ${size * 0.8} ${size * 0.4}
          Q ${size * 0.8} ${size * 0.7} ${size * 0.75} ${size * 0.8}
          Q ${size * 0.7} ${size * 0.85} ${size * 0.65} ${size * 0.9}
          Q ${size * 0.6} ${size * 0.95} ${size * 0.5} ${size * 0.95}
          Q ${size * 0.4} ${size * 0.95} ${size * 0.35} ${size * 0.9}
          Q ${size * 0.3} ${size * 0.85} ${size * 0.25} ${size * 0.8}
          Q ${size * 0.2} ${size * 0.7} ${size * 0.2} ${size * 0.4}
          Q ${size * 0.2} ${size * 0.3} ${size * 0.3} ${size * 0.2}
          Z
        `}
        fill="none"
        stroke={silhouetteColor}
        strokeWidth={2}
      />

      {/* Eyes */}
      <Circle
        cx={facePosition.x - size * 0.08}
        cy={facePosition.y - size * 0.1}
        r={size * 0.02}
        fill={silhouetteColor}
      />
      <Circle
        cx={facePosition.x + size * 0.08}
        cy={facePosition.y - size * 0.1}
        r={size * 0.02}
        fill={silhouetteColor}
      />

      {/* Nose */}
      <Path
        d={`
          M ${facePosition.x} ${facePosition.y - size * 0.05}
          L ${facePosition.x} ${facePosition.y + size * 0.05}
        `}
        stroke={silhouetteColor}
        strokeWidth={1.5}
      />

      {/* Mouth */}
      <Ellipse
        cx={facePosition.x}
        cy={facePosition.y + size * 0.15}
        rx={size * 0.06}
        ry={size * 0.03}
        fill="none"
        stroke={silhouetteColor}
        strokeWidth={1.5}
      />

      {/* Positioning guide text */}
      <Path
        d={`
          M ${size * 0.1} ${size * 0.1}
          L ${size * 0.9} ${size * 0.1}
          M ${size * 0.1} ${size * 0.9}
          L ${size * 0.9} ${size * 0.9}
          M ${size * 0.1} ${size * 0.1}
          L ${size * 0.1} ${size * 0.9}
          M ${size * 0.9} ${size * 0.1}
          L ${size * 0.9} ${size * 0.9}
        `}
        stroke={silhouetteColor}
        strokeWidth={1}
        strokeDasharray="5,5"
        opacity={0.5}
      />
    </Svg>
  );
}
