import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

export interface Profile {
  _id: string;
  email?: string;
  name?: string;
  image?: string;
  gender?: 'male' | 'female';
  dateOfBirth?: number;
  skinType?: 'oily' | 'dry' | 'combination' | 'normal' | 'sensitive';
  primaryConcerns?: ('acne' | 'blackheads' | 'whiteheads' | 'cysticAcne' | 'acneScars' | 'acneMarks')[];
  goals?: ('clearAcne' | 'preventBreakouts' | 'reduceScars' | 'buildRoutine' | 'trackProgress')[];
  cameraPermission?: boolean;
  notificationPreference?: 'daily' | 'weekly' | 'important' | 'none';
  onboardingCompleted?: boolean;
}

export function useProfile() {
  const profile = useQuery(api.userProfiles.getProfile);
  const updateProfile = useMutation(api.userProfiles.updateProfile);
  const completeOnboarding = useMutation(api.userProfiles.completeOnboarding);
  const resetOnboarding = useMutation(api.userProfiles.resetOnboarding);

  const isOnboardingComplete = profile?.onboardingCompleted ?? false;
  const isLoading = profile === undefined;

  const updateProfileData = async (data: Partial<Profile>) => {
    await updateProfile(data);
  };

  const markOnboardingComplete = async () => {
    await completeOnboarding();
  };

  const resetOnboardingData = async () => {
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
