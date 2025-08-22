import { useMutation } from 'convex/react';
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import React, { useRef, useState } from 'react';
import { Alert, Dimensions, Image, TouchableOpacity, View } from 'react-native';
import { FaceSilhouette, Text } from '../../components';
import { OnboardingButton } from '../../components/onboarding';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';
import { useThemeContext } from '../../theme/ThemeContext';

interface ImageCaptureScreenProps {
  onPhotoTaken?: (photoUri: string) => void;
  onPhotosComplete?: (photoIds: { leftPhotoId?: Id<"photos">; centerPhotoId?: Id<"photos">; rightPhotoId?: Id<"photos"> }) => void;
  onBack?: () => void;
  userId?: string;
}

export function ImageCaptureScreen({ onPhotoTaken, onPhotosComplete, onBack, userId }: ImageCaptureScreenProps) {
  const { theme } = useThemeContext();
  const [cameraType, setCameraType] = useState<CameraType>('front');
  const [permission, requestPermission] = useCameraPermissions();
  const [currentPhotoStep, setCurrentPhotoStep] = useState<'left' | 'center' | 'right'>('left');
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [isReviewing, setIsReviewing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [photoIds, setPhotoIds] = useState<{ leftPhotoId?: Id<"photos">; centerPhotoId?: Id<"photos">; rightPhotoId?: Id<"photos"> }>({});
  
  // Camera ref for taking photos
  const cameraRef = useRef<CameraView>(null);
  
  // Convex mutations
  const generateUploadUrl = useMutation(api.userProfiles.generatePhotoUploadUrl);
  const savePhoto = useMutation(api.userProfiles.savePhoto);
  
  // Generate a unique session ID for this photo session
  const sessionId = React.useMemo(() => `session-${Date.now()}`, []);
  
  // Get screen dimensions for silhouette sizing
  const screenWidth = Dimensions.get('window').width;
  const silhouetteSize = screenWidth; // 80% of screen width

  const takePicture = async () => {
    if (!cameraRef.current) {
      Alert.alert('Error', 'Camera not ready. Please try again.');
      return;
    }

    try {
      setIsUploading(true);
      
      // Take the actual photo using the camera
      const photo = await cameraRef.current.takePictureAsync({
        quality: 1,
        base64: false,
      });
      
      console.log('Photo taken:', photo.uri);
      setCapturedPhoto(photo.uri);
      setIsReviewing(true);
      setIsUploading(false);
    } catch (error) {
      console.error('Error taking picture:', error);
      Alert.alert('Error', 'Failed to take picture. Please try again.');
      setIsUploading(false);
    }
  };

  const retakePhoto = () => {
    setCapturedPhoto(null);
    setIsReviewing(false);
  };

  const confirmPhoto = async () => {
    if (!capturedPhoto || !userId) return;
    
    try {
      setIsUploading(true);
      
      // Step 1: Generate upload URL
      const uploadUrl = await generateUploadUrl();
      
      // Step 2: Upload the photo to Convex storage
      // Convert the photo URI to a blob for upload
      const response = await fetch(capturedPhoto);
      const photoBlob = await response.blob();
      
      const uploadResult = await fetch(uploadUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'image/jpeg' },
        body: photoBlob,
      });
      
      if (!uploadResult.ok) {
        throw new Error('Failed to upload photo');
      }
      
      const { storageId } = await uploadResult.json();
      
      // Step 3: Save photo reference to database
      const photoId = await savePhoto({
        storageId,
        photoType: currentPhotoStep,
        sessionId,
        userId,
      });
      
      console.log('Photo saved successfully:', { photoId, photoType: currentPhotoStep });
      
      // Store the photo ID
      setPhotoIds(prev => ({
        ...prev,
        [currentPhotoStep === 'left' ? 'leftPhotoId' : currentPhotoStep === 'center' ? 'centerPhotoId' : 'rightPhotoId']: photoId
      }));
      
      if (onPhotoTaken) {
        onPhotoTaken(capturedPhoto);
      }
      
      // Move to next step or finish
      if (currentPhotoStep === 'right') {
        // All photos taken, return the photo IDs
        if (onPhotosComplete) {
          const finalPhotoIds = {
            ...photoIds,
            rightPhotoId: photoId
          };
          onPhotosComplete(finalPhotoIds);
        } else if (onPhotoTaken) {
          onPhotoTaken('all-photos-complete');
        }
      } else {
        // Move to next photo step
        setCurrentPhotoStep(currentPhotoStep === 'left' ? 'center' : 'right');
        setCapturedPhoto(null);
        setIsReviewing(false);
      }
    } catch (error) {
      console.error('Error confirming photo:', error);
      Alert.alert('Error', 'Failed to save photo. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const flipCamera = () => {
    setCameraType(current => 
      current === 'back' ? 'front' : 'back'
    );
  };

  const getStepInstructions = () => {
    switch (currentPhotoStep) {
      case 'left':
        return 'Turn your head 45° to the LEFT and position your face within the guide';
      case 'center':
        return 'Face STRAIGHT AHEAD and position your face within the guide';
      case 'right':
        return 'Turn your head 45° to the RIGHT and position your face within the guide';
      default:
        return 'Position your face within the guide';
    }
  };

  const getStepTitle = () => {
    switch (currentPhotoStep) {
      case 'left':
        return 'Left Side Photo';
      case 'center':
        return 'Center Photo';
      case 'right':
        return 'Right Side Photo';
      default:
        return 'Take Photo';
    }
  };

  const getQualityCheckText = () => {
    return 'Is this photo clear, without obstructions, and properly positioned?';
  };

  if (!permission) {
    // Camera permissions are still loading
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text variant="title" color="textPrimary">Loading camera permissions...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: theme.spacing.l }}>
        <Text variant="heading" color="textPrimary" textAlign="center" marginBottom="m">
          Camera Access Required
        </Text>
        <Text variant="subtitle" color="textSecondary" textAlign="center" marginBottom="xl">
          DermaTrack needs camera access to help you track your acne progress. Please enable it in your device settings.
        </Text>
        <OnboardingButton
          title="Grant Permission"
          onPress={requestPermission}
          variant="primary"
        />
      </View>
    );
  }

  // Show photo review if we have a captured photo
  if (isReviewing && capturedPhoto) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
        {/* Photo Review Header */}
        <View style={{
          backgroundColor: theme.colors.backgroundMuted,
          padding: theme.spacing.l,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.glassBorder,
        }}>
          <Text variant="heading" color="textPrimary" textAlign="center">
            Review {getStepTitle()}
          </Text>
        </View>

        {/* Photo Display */}
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: theme.spacing.l }}>
          <View style={{
            width: '90%',
            height: '60%',
            backgroundColor: theme.colors.backgroundMuted,
            borderRadius: theme.borderRadii.l,
            borderWidth: 1,
            borderColor: theme.colors.glassBorder,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: theme.spacing.xl,
            overflow: 'hidden',
          }}>
            {/* Display the actual captured photo */}
            <Image 
              source={{ uri: capturedPhoto }} 
              style={{
                width: '100%',
                height: '100%',
                borderRadius: theme.borderRadii.l,
              }}
              resizeMode="cover"
            />
          </View>

          {/* Quality Check Question */}
          <View style={{
            backgroundColor: theme.colors.backgroundMuted,
            padding: theme.spacing.l,
            borderRadius: theme.borderRadii.m,
            borderWidth: 1,
            borderColor: theme.colors.glassBorder,
            marginBottom: theme.spacing.xl,
            width: '90%',
          }}>
            <Text variant="subtitle" color="textPrimary" textAlign="center">
              {getQualityCheckText()}
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={{
            flexDirection: 'row',
            gap: theme.spacing.m,
            width: '90%',
          }}>
            <View style={{ flex: 1 }}>
              <OnboardingButton
                title="Retake"
                onPress={retakePhoto}
                variant="secondary"
                disabled={isUploading}
              />
            </View>
            <View style={{ flex: 1 }}>
              <OnboardingButton
                title={currentPhotoStep === 'right' ? 'Finish' : 'Next Photo'}
                onPress={confirmPhoto}
                variant="primary"
                disabled={isUploading}
                loading={isUploading}
              />
            </View>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      {/* Camera View */}
      <View style={{ flex: 1 }}>
        <CameraView 
          ref={cameraRef}
          style={{ flex: 1 }}
          facing={cameraType}
        >
          {/* Face Silhouette Overlay */}
          <View style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: 'flex-start',
            alignItems: 'center',
            padding: theme.spacing.xl,
          }}>
            {/* Step Title */}
            <View style={{
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              paddingHorizontal: theme.spacing.l,
              paddingVertical: theme.spacing.m,
              borderRadius: theme.borderRadii.m,
              marginBottom: theme.spacing.m,
            }}>
              <Text variant="title" color="white" textAlign="center">
                {getStepTitle()}
              </Text>
            </View>

            {/* Instructions */}
            <View style={{
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              paddingHorizontal: theme.spacing.l,
              paddingVertical: theme.spacing.m,
              borderRadius: theme.borderRadii.m,
              marginBottom: theme.spacing.xl,
              maxWidth: '80%',
            }}>
              <Text variant="subtitle" color="white" textAlign="center">
                {getStepInstructions()}
              </Text>
            </View>

            {/* Face Silhouette Guide - Absolutely positioned in center */}
            <View style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: [{ translateX: -silhouetteSize * 0.45 }, { translateY: -silhouetteSize * 0.45 }],
            }}>
              <FaceSilhouette 
                angle={currentPhotoStep} 
                size={silhouetteSize} 
                color="white" 
                opacity={0.8}
              />
            </View>

            {/* Progress Indicator - Bottom section */}
            <View style={{
              position: 'absolute',
              bottom: theme.spacing.xl,
              alignItems: 'center',
              width: '100%',
            }}>
              {/* Progress Indicator */}
              <View style={{
                flexDirection: 'row',
                justifyContent: 'center',
              }}>
                {(['left', 'center', 'right'] as const).map((step) => (
                  <View
                    key={step}
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: 6,
                      backgroundColor: step === currentPhotoStep ? 'white' : 'rgba(255, 255, 255, 0.3)',
                      marginHorizontal: 4,
                      borderWidth: 1,
                      borderColor: 'white',
                    }}
                  />
                ))}
              </View>
            </View>
          </View>

          {/* Camera Controls Overlay */}
          <View style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: theme.spacing.l,
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
          }}>
            {/* Camera Controls */}
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: theme.spacing.m,
            }}>
              {/* Flip Camera Button */}
              <TouchableOpacity
                onPress={flipCamera}
                style={{
                  backgroundColor: theme.colors.backgroundMuted,
                  padding: theme.spacing.m,
                  borderRadius: theme.borderRadii.m,
                  borderWidth: 1,
                  borderColor: theme.colors.glassBorder,
                }}
              >
                <Text variant="title" color="textPrimary">🔄</Text>
              </TouchableOpacity>

              {/* Take Picture Button */}
              <TouchableOpacity
                onPress={takePicture}
                disabled={isUploading}
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  backgroundColor: isUploading ? theme.colors.textSecondary : theme.colors.primary,
                  borderWidth: 4,
                  borderColor: theme.colors.backgroundMuted,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <View style={{
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                  backgroundColor: theme.colors.backgroundMuted,
                }} />
              </TouchableOpacity>

              {/* Back Button */}
              <TouchableOpacity
                onPress={onBack}
                style={{
                  backgroundColor: theme.colors.backgroundMuted,
                  padding: theme.spacing.m,
                  borderRadius: theme.borderRadii.m,
                  borderWidth: 1,
                  borderColor: theme.colors.glassBorder,
                }}
              >
                <Text variant="title" color="textPrimary">✕</Text>
              </TouchableOpacity>
            </View>
          </View>
        </CameraView>
      </View>
    </View>
  );
}
