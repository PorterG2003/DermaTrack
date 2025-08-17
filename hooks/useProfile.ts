import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";

export interface Profile {
  gender?: 'male' | 'female';
  dateOfBirth?: number;
  skinType?: 'oily' | 'dry' | 'combination' | 'normal' | 'sensitive';
  primaryConcerns?: ('acne' | 'blackheads' | 'whiteheads' | 'cysticAcne' | 'acneScars' | 'acneMarks')[];
  goals?: ('clearAcne' | 'preventBreakouts' | 'reduceScars' | 'buildRoutine' | 'trackProgress')[];
  cameraPermission?: boolean;
  notificationPreference?: 'daily' | 'weekly' | 'important' | 'none';
}

export function useProfile() {
  const profile = useQuery(api.userProfiles.getProfile);
  const upsertProfile = useMutation(api.userProfiles.upsertProfile);
  const completeOnboarding = useMutation(api.userProfiles.completeOnboarding);
  const resetOnboarding = useMutation(api.userProfiles.resetOnboarding);

  // Debug logging
  console.log('🔍 useProfile hook:', { profile, profileType: typeof profile, isNull: profile === null, isUndefined: profile === undefined });

  // Provide a default profile object to prevent null reference errors
  const safeProfile: Profile = profile || {
    gender: undefined,
    dateOfBirth: undefined,
    skinType: undefined,
    primaryConcerns: undefined,
    goals: undefined,
    cameraPermission: undefined,
    notificationPreference: undefined,
  };
  
  const isOnboardingComplete = profile?.onboardingCompleted ?? false;
  const isLoading = profile === undefined;

  const updateProfile = async (data: Partial<Profile>) => {
    await upsertProfile(data);
  };

  const markOnboardingComplete = async () => {
    await completeOnboarding();
  };

  const resetOnboardingData = async () => {
    await resetOnboarding();
  };

  return {
    profile: safeProfile,
    isOnboardingComplete,
    isLoading,
    updateProfile,
    markOnboardingComplete,
    resetOnboarding: resetOnboardingData,
  };
}

// Hook to get user photos
export function useUserPhotos() {
  const profile = useQuery(api.userProfiles.getProfile);
  const photos = useQuery(api.userProfiles.getPhotosByUser, 
    profile?.userId ? { userId: profile.userId } : "skip"
  );

  return {
    photos: photos || [],
    isLoading: photos === undefined,
    userId: profile?.userId,
  };
}
