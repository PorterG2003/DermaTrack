import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, TouchableOpacity, View } from 'react-native';
import { Box, Text } from '../../../components';
import { Button } from '../../../components/ui/buttons/Button';
import { Profile } from '../../../hooks/useProfile';
import { useThemeContext } from '../../../theme/ThemeContext';

interface PhotoPermissionsStepProps {
  step: any;
  currentIndex: number;
  totalSteps: number;
  onNext: () => void;
  onPrevious: () => void;
  onGoToStep: (index: number) => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  profile: Profile;
  updateProfile: (data: Partial<Profile>) => Promise<void>;
}

export function PhotoPermissionsStep({
  onNext,
  isFirstStep,
  isLastStep,
  onPrevious,
  profile,
  updateProfile
}: PhotoPermissionsStepProps) {
  const { theme } = useThemeContext();
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);
  
  // Load existing data when component mounts
  useEffect(() => {
    if (profile.cameraPermission !== undefined) {
      setPermissionGranted(profile.cameraPermission);
    }
  }, [profile.cameraPermission]);
  
  const requestCameraPermission = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status === 'granted') {
        setPermissionGranted(true);
        // Save to onboarding data
        await updateProfile({ cameraPermission: true });
        Alert.alert(
          'Permission Granted!',
          'You can now take photos to track your skin health.',
          [{ text: 'Continue', onPress: onNext }]
        );
      } else {
        setPermissionGranted(false);
        // Save to onboarding data
        await updateProfile({ cameraPermission: false });
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
      await updateProfile({ cameraPermission: false });
    }
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
          Track Your Acne Progress
        </Text>
        
        {/* Step Subtitle */}
        <Text 
          variant="subtitle" 
          color="textSecondary" 
          textAlign="center"
          marginBottom="xl"
          paddingHorizontal="l"
        >
          DermaTrack needs camera access to help you take photos and track changes in your acne over time.
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
            <Ionicons name="camera" size={24} color={theme.colors.primary} />
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
              <Box flexDirection="row" alignItems="center" justifyContent="center">
                <Ionicons name="phone-portrait" size={14} color={theme.colors.textSecondary} style={{ marginRight: 6 }} />
                <Text variant="caption" color="textSecondary" textAlign="center">
                  Take photos of acne breakouts
                </Text>
              </Box>
            </Box>
          
                      <Box marginBottom="s">
              <Box flexDirection="row" alignItems="center" justifyContent="center">
                <Ionicons name="analytics" size={14} color={theme.colors.textSecondary} style={{ marginRight: 6 }} />
                <Text variant="caption" color="textSecondary" textAlign="center">
                  Track acne improvement over time
                </Text>
              </Box>
            </Box>
          
                      <Box marginBottom="s">
              <Box flexDirection="row" alignItems="center" justifyContent="center">
                <Ionicons name="search" size={14} color={theme.colors.textSecondary} style={{ marginRight: 6 }} />
                <Text variant="caption" color="textSecondary" textAlign="center">
                  Compare before and after results
                </Text>
              </Box>
            </Box>
          
          <Box>
            <Text variant="caption" color="textSecondary" textAlign="center">
              📈 Monitor treatment effectiveness
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
            🔒 Your acne photos are stored locally on your device and never shared without your permission.
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
              <Button
                variant="glass"
                size="medium"
                style={{ width: '100%' }}
                onPress={onPrevious}
              >
                Back
              </Button>
            </View>
          )}
          
          <View style={{ flex: 1, marginLeft: isFirstStep ? 0 : theme.spacing.s }}>
            <Button
              variant="glass"
              size="medium"
              style={{ width: '100%' }}
              onPress={onNext}
              disabled={!canProceed}
            >
              {isLastStep ? "Get Started" : "Next"}
            </Button>
          </View>
        </View>
      </Box>
    </ScrollView>
  );
}
