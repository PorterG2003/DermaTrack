import React from 'react';
import { TouchableOpacity } from 'react-native';
import { useThemeContext } from '../../../theme/ThemeContext';
import { Box, Text } from '../index';

interface GuideButtonProps {
  onNext: () => void;
  onPrevious?: () => void;
  isFirstStep?: boolean;
  isLastStep?: boolean;
  canProceed?: boolean;
  nextText?: string;
  previousText?: string;
  nextDisabled?: boolean;
  previousDisabled?: boolean;
  showPrevious?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
}

export function GuideButton({
  onNext,
  onPrevious,
  isFirstStep = false,
  isLastStep = false,
  canProceed = true,
  nextText,
  previousText,
  nextDisabled = false,
  previousDisabled = false,
  showPrevious = true,
  variant = 'primary',
  size = 'medium'
}: GuideButtonProps) {
  const { theme } = useThemeContext();

  // Default button text based on step position
  const getNextText = () => {
    if (nextText) return nextText;
    if (isLastStep) return 'Complete';
    return 'Next';
  };

  const getPreviousText = () => {
    if (previousText) return previousText;
    return 'Previous';
  };

  // Button styling based on variant
  const getButtonStyle = (isNext: boolean) => {
    const isDisabled = isNext ? nextDisabled || !canProceed : previousDisabled;
    
    if (variant === 'outline') {
      return {
        backgroundColor: 'background',
        borderWidth: 1,
        borderColor: isDisabled ? 'glassBorder' : 'primary',
      };
    }
    
    if (variant === 'secondary') {
      return {
        backgroundColor: isDisabled ? 'backgroundMuted' : 'background',
        borderWidth: 1,
        borderColor: 'glassBorder',
      };
    }
    
    // Primary variant
    return {
      backgroundColor: isDisabled ? 'backgroundMuted' : 'primary',
      borderWidth: 0,
    };
  };

  // Text color based on variant and state
  const getTextColor = (isNext: boolean) => {
    const isDisabled = isNext ? nextDisabled || !canProceed : previousDisabled;
    
    if (variant === 'outline') {
      return isDisabled ? 'textSecondary' : 'primary';
    }
    
    if (variant === 'secondary') {
      return isDisabled ? 'textSecondary' : 'textPrimary';
    }
    
    // Primary variant
    return isDisabled ? 'textSecondary' : 'white';
  };

  // Padding based on size
  const getPadding = () => {
    switch (size) {
      case 'small':
        return { paddingHorizontal: 'm' as const, paddingVertical: 's' as const };
      case 'large':
        return { paddingHorizontal: 'xl' as const, paddingVertical: 'l' as const };
      default:
        return { paddingHorizontal: 'l' as const, paddingVertical: 'm' as const };
    }
  };

  const padding = getPadding();

  return (
    <Box flexDirection="row" justifyContent="space-between" alignItems="center">
      {/* Previous Button */}
      {showPrevious && !isFirstStep && (
        <TouchableOpacity 
          onPress={onPrevious} 
          disabled={previousDisabled}
          style={{ flex: 1, marginRight: theme.spacing.s }}
        >
          <Box
            {...padding}
            borderRadius="m"
            alignItems="center"
            opacity={previousDisabled ? 0.6 : 1}
            backgroundColor={variant === 'outline' ? 'background' : variant === 'secondary' ? 'background' : 'backgroundMuted'}
            borderWidth={variant === 'outline' || variant === 'secondary' ? 1 : 0}
            borderColor={variant === 'outline' ? (previousDisabled ? 'glassBorder' : 'primary') : 'glassBorder'}
          >
            <Text 
              variant="subtitle" 
              color={getTextColor(false)}
            >
              {getPreviousText()}
            </Text>
          </Box>
        </TouchableOpacity>
      )}

      {/* Next Button */}
      <TouchableOpacity 
        onPress={onNext} 
        disabled={nextDisabled || !canProceed}
        style={{ 
          flex: showPrevious && !isFirstStep ? 1 : undefined,
          marginLeft: showPrevious && !isFirstStep ? theme.spacing.s : 0
        }}
      >
        <Box
          {...padding}
          borderRadius="m"
          alignItems="center"
          opacity={(nextDisabled || !canProceed) ? 0.6 : 1}
          backgroundColor={variant === 'outline' ? 'background' : variant === 'secondary' ? 'background' : 'primary'}
          borderWidth={variant === 'outline' || variant === 'secondary' ? 1 : 0}
          borderColor={variant === 'outline' ? ((nextDisabled || !canProceed) ? 'glassBorder' : 'primary') : 'glassBorder'}
        >
          <Text 
            variant="subtitle" 
            color={getTextColor(true)}
          >
            {getNextText()}
          </Text>
        </Box>
      </TouchableOpacity>
    </Box>
  );
}
