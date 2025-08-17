import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { useState, useEffect } from "react";

export interface OnboardingData {
  gender?: 'male' | 'female';
  dateOfBirth?: number; // Unix timestamp for DOB
  skinType?: 'oily' | 'dry' | 'combination' | 'normal' | 'sensitive';
  primaryConcerns?: string[];
  goals?: string[];
  cameraPermission?: boolean;
  notificationPreference?: 'daily' | 'weekly' | 'important' | 'none';
  onboardingCompleted?: boolean;
}

export function useOnboardingData() {
  const [localData, setLocalData] = useState<OnboardingData>({});
  
  // Convex queries and mutations
  const profile = useQuery(api.userProfiles.getProfile);
  const upsertProfile = useMutation(api.userProfiles.upsertProfile);
  const completeOnboarding = useMutation(api.userProfiles.completeOnboarding);
  const isOnboardingCompleted = useQuery(api.userProfiles.isOnboardingCompleted);

  // Load profile data when available
  useEffect(() => {
    if (profile) {
      setLocalData({
        gender: profile.gender,
        dateOfBirth: profile.dateOfBirth,
        skinType: profile.skinType,
        primaryConcerns: profile.primaryConcerns,
        goals: profile.goals,
        cameraPermission: profile.cameraPermission,
        notificationPreference: profile.notificationPreference,
        onboardingCompleted: profile.onboardingCompleted,
      });
    }
  }, [profile]);

  // Update local data and save to Convex
  const updateOnboardingData = async (data: Partial<OnboardingData>) => {
    const newData = { ...localData, ...data };
    setLocalData(newData);
    
    try {
      await upsertProfile(newData as any);
    } catch (error) {
      console.error('Error saving onboarding data:', error);
      // Revert local data on error
      setLocalData(localData);
      throw error;
    }
  };

  // Mark onboarding as completed
  const markOnboardingComplete = async () => {
    try {
      await completeOnboarding();
      setLocalData(prev => ({ ...prev, onboardingCompleted: true }));
    } catch (error) {
      console.error('Error completing onboarding:', error);
      throw error;
    }
  };

  // Reset onboarding data
  const resetOnboarding = async () => {
    try {
      await upsertProfile({ onboardingCompleted: false });
      setLocalData(prev => ({ ...prev, onboardingCompleted: false }));
    } catch (error) {
      console.error('Error resetting onboarding:', error);
      throw error;
    }
  };

  return {
    onboardingData: localData,
    updateOnboardingData,
    markOnboardingComplete,
    resetOnboarding,
    isOnboardingComplete: isOnboardingCompleted ?? false,
    isLoading: profile === undefined,
  };
}
