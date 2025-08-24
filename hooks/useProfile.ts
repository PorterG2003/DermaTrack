import { useMutation, useQuery } from "convex/react";
import React from "react";
import { api } from "../convex/_generated/api";

export interface Profile {
  _id: string;
  email?: string;
  name?: string;
  image?: string;
  gender?: 'male' | 'female';
  dateOfBirth?: number;
  cameraPermission?: boolean;
  notificationPreference?: 'daily' | 'weekly' | 'important' | 'none';
  onboardingCompleted?: boolean;
}

export function useProfile() {
  console.log('🔍 useProfile: Hook called');
  
  const profile = useQuery(api.userProfiles.getProfile);
  const updateProfile = useMutation(api.userProfiles.updateProfile);
  const completeOnboarding = useMutation(api.userProfiles.completeOnboarding);
  const resetOnboarding = useMutation(api.userProfiles.resetOnboarding);

  console.log('📊 useProfile: Query results', {
    profile,
    hasProfile: !!profile,
    profileId: profile?._id,
    profileIdType: typeof profile?._id,
    onboardingCompleted: profile?.onboardingCompleted,
    hasUpdateProfile: !!updateProfile,
    hasCompleteOnboarding: !!completeOnboarding,
    hasResetOnboarding: !!resetOnboarding
  });

  // Log profile details when it changes
  React.useEffect(() => {
    if (profile) {
      console.log('🔍 useProfile: Profile data details:', {
        _id: profile._id,
        _idType: typeof profile._id,
        email: profile.email,
        name: profile.name,
        userId: profile.userId,
        userIdType: typeof profile.userId
      });
    }
  }, [profile]);

  const isOnboardingComplete = profile?.onboardingCompleted ?? false;
  const isLoading = profile === undefined;

  console.log('✅ useProfile: Computed values', {
    isOnboardingComplete,
    isLoading
  });

  const updateProfileData = async (data: Partial<Profile>) => {
    console.log('📝 useProfile: updateProfileData called', { data });
    await updateProfile(data);
  };

  const markOnboardingComplete = async () => {
    console.log('🏁 useProfile: markOnboardingComplete called');
    await completeOnboarding();
  };

  const resetOnboardingData = async () => {
    console.log('🔄 useProfile: resetOnboardingData called');
    await resetOnboarding();
  };

  return {
    profile,
    isOnboardingComplete,
    isLoading,
    updateProfile: updateProfileData,
    markOnboardingComplete,
    resetOnboarding: resetOnboardingData,
  };
}
