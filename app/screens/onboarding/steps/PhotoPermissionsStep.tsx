import React, { useState } from 'react';
import { TouchableOpacity, Alert, ScrollView, View } from 'react-native';
import { Box, Text } from '../../../components';
import { useThemeContext } from '../../../../src/theme/ThemeContext';
import * as ImagePicker from 'expo-image-picker';
import { OnboardingButton } from '../../../components/onboarding';

interface PhotoPermissionsStepProps {
  step: any;
  currentIndex: number;
  totalSteps: number;
  onNext: () => void;
  onPrevious: () => void;
  onGoToStep: (index: number) => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

export function PhotoPermissionsStep({
  onNext,
  isFirstStep,
  isLastStep,
  onPrevious
}: PhotoPermissionsStepProps) {
  const { theme } = useThemeContext();
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);
  
  const requestCameraPermission = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status === 'granted') {
        setPermissionGranted(true);
        Alert.alert(
          'Permission Granted! 📸',
          'You can now take photos to track your skin health.',
          [{ text: 'Continue', onPress: onNext }]
        );
      } else {
        setPermissionGranted(false);
        Alert.alert(
          'Camera Permission Required',
          'DermaTrack needs camera access to help you track your skin. Please enable it in your device settings.',
          [
            { text: 'Settings', onPress: () => ImagePicker.requestCameraPermissionsAsync() },
            { text: 'Skip for Now', onPress: onNext, style: 'cancel' }
          ]
        );
      }
    } catch (error) {
      console.error('Error requesting camera permission:', error);
      setPermissionGranted(false);
    }
  };
  
  const skipPermissions = () => {
    Alert.alert(
      'Skip Permissions?',
      'You can always enable camera access later in settings. Some features may be limited.',
      [
        { text: 'Skip for Now', onPress: onNext, style: 'cancel' },
        { text: 'Try Again', onPress: requestCameraPermission }
      ]
    );
  };
  
  // User can proceed if they've made a decision (either granted permission or chose to skip)
  const canProceed = permissionGranted !== null;
  
  return (
    <ScrollView 
      style={{ flex: 1 }} 
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <Box flex={1} justifyContent="flex-start" alignItems="center" padding="l" paddingTop="xl">
        {/* Step Title */}
        <Text 
          variant="heading" 
          color="textPrimary" 
          textAlign="center"
          marginBottom="m"
        >
          Camera Access
        </Text>
        
        {/* Step Subtitle */}
        <Text 
          variant="subtitle" 
          color="textSecondary" 
          textAlign="center"
          marginBottom="xl"
          paddingHorizontal="l"
        >
          DermaTrack needs camera access to help you take photos and track changes in your skin over time.
        </Text>
        
        {/* Camera Icon */}
        <Box 
          width={140} 
          height={140} 
          borderRadius="xl"
          backgroundColor="backgroundMuted"
          borderWidth={1}
          borderColor="glassBorder"
          justifyContent="center"
          alignItems="center"
          marginBottom="xl"
          style={{
            shadowColor: theme.colors.primary,
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.3,
            shadowRadius: 16,
            elevation: 8,
          }}
        >
          <Text variant="title" color="primary" fontSize={64} height={140} lineHeight={140}>
            📸
          </Text>
        </Box>
        
        {/* Permission Benefits */}
        <Box 
          backgroundColor="backgroundMuted"
          borderRadius="l"
          padding="l"
          marginBottom="xl"
          borderWidth={1}
          borderColor="glassBorder"
          width="100%"
        >
          <Text 
            variant="subtitle" 
            color="textPrimary" 
            textAlign="center"
            marginBottom="m"
          >
            ✨ What you can do with camera access:
          </Text>
          
          <Box marginBottom="s">
            <Text variant="caption" color="textSecondary" textAlign="center">
              📱 Take photos of skin concerns
            </Text>
          </Box>
          
          <Box marginBottom="s">
            <Text variant="caption" color="textSecondary" textAlign="center">
              📊 Track progress over time
            </Text>
          </Box>
          
          <Box marginBottom="s">
            <Text variant="caption" color="textSecondary" textAlign="center">
              🔍 Compare before and after
            </Text>
          </Box>
          
          <Box>
            <Text variant="caption" color="textSecondary" textAlign="center">
              📈 Monitor healing and changes
            </Text>
          </Box>
        </Box>
        
        {/* Permission Buttons */}
        <Box width="100%" marginBottom="l">
          <TouchableOpacity onPress={requestCameraPermission} style={{ marginBottom: theme.spacing.m }}>
            <Box 
              width="100%"
              backgroundColor="primary"
              borderRadius="l"
              padding="m"
              alignItems="center"
              justifyContent="center"
              style={{
                shadowColor: theme.colors.primary,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 4,
              }}
            >
              <Text variant="title" color="white" fontWeight="600">
                Allow Camera Access
              </Text>
            </Box>
          </TouchableOpacity>
        </Box>
        
        {/* Privacy Note */}
        <Box 
          backgroundColor="backgroundMuted"
          borderRadius="m"
          padding="m"
          borderWidth={1}
          borderColor="glassBorder"
          width="100%"
          marginBottom="xl"
        >
          <Text 
            variant="caption" 
            color="textSecondary" 
            textAlign="center"
          >
            🔒 Your photos are stored locally on your device and never shared without your permission.
          </Text>
        </Box>

        {/* Navigation Buttons - integrated into content */}
        <View style={{
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: theme.spacing.l,
          marginTop: theme.spacing.xl
        }}>
          {!isFirstStep && (
            <View style={{ flex: 1, marginRight: theme.spacing.s }}>
              <OnboardingButton
                title="Back"
                onPress={onPrevious}
                variant="secondary"
              />
            </View>
          )}
          
          <View style={{ flex: 1, marginLeft: isFirstStep ? 0 : theme.spacing.s }}>
            <OnboardingButton
              title={isLastStep ? "Get Started" : "Next"}
              onPress={onNext}
              variant="primary"
              disabled={!canProceed}
            />
          </View>
        </View>
      </Box>
    </ScrollView>
  );
}
