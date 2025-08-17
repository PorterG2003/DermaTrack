import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ONBOARDING_COMPLETE_KEY = 'onboarding_complete';

export function useOnboarding() {
  const [isOnboardingComplete, setIsOnboardingComplete] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    checkOnboardingStatus();
  }, []);
  
  const checkOnboardingStatus = async () => {
    try {
      const status = await AsyncStorage.getItem(ONBOARDING_COMPLETE_KEY);
      setIsOnboardingComplete(status === 'true');
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      setIsOnboardingComplete(false);
    } finally {
      setIsLoading(false);
    }
  };
  
  const markOnboardingComplete = async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_COMPLETE_KEY, 'true');
      setIsOnboardingComplete(true);
    } catch (error) {
      console.error('Error marking onboarding complete:', error);
    }
  };
  
  const resetOnboarding = async () => {
    try {
      await AsyncStorage.removeItem(ONBOARDING_COMPLETE_KEY);
      setIsOnboardingComplete(false);
    } catch (error) {
      console.error('Error resetting onboarding:', error);
    }
  };
  
  return {
    isOnboardingComplete,
    isLoading,
    markOnboardingComplete,
    resetOnboarding,
  };
}
