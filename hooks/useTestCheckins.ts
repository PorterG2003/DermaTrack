import { useMutation, useQuery } from 'convex/react';
import { api } from '../convex/_generated/api';

export interface TestAnswer {
  questionId: string;
  answer: string | number | boolean;
  questionType: 'rating' | 'yesNo' | 'text' | 'scale';
}

export interface TestCheckin {
  _id: string;
  checkInId: string;
  testId: string;
  userId: string;
  answers: Array<{
    questionId: string;
    answer: string | number | boolean;
    questionType: 'rating' | 'yesNo' | 'text' | 'scale';
    answeredAt: number;
  }>;
  completed: boolean;
  createdAt: number;
  updatedAt: number;
}

export function useTestCheckins() {
  // Mutations
  const createTestCheckin = useMutation(api.testCheckins.createTestCheckin);
  const updateTestCheckin = useMutation(api.testCheckins.updateTestCheckin);
  const deleteTestCheckin = useMutation(api.testCheckins.deleteTestCheckin);
  const createCheckInWithTestAnswers = useMutation(api.checkIns.createCheckInWithTestAnswers);

  // Queries
  const getTestCheckin = (testCheckinId: string) => 
    useQuery(api.testCheckins.getTestCheckin, { testCheckinId });
  
  const getTestCheckinByCheckIn = (checkInId: string) => 
    useQuery(api.testCheckins.getTestCheckinByCheckIn, { checkInId });
  
  const getTestCheckinsByTest = (testId: string) => 
    useQuery(api.testCheckins.getTestCheckinsByTest, { testId });
  
  const getTestCheckinsByUser = (userId: string) => 
    useQuery(api.testCheckins.getTestCheckinsByUser, { userId });
  
  const getTestCheckinsByUserAndTest = (userId: string, testId: string) => 
    useQuery(api.testCheckins.getTestCheckinsByUserAndTest, { userId, testId });
  
  const getRecentTestCheckins = (userId: string, limit?: number) => 
    useQuery(api.testCheckins.getRecentTestCheckins, { userId, limit });

  // Helper function to create a check-in with test answers
  const submitCheckInWithAnswers = async (
    userId: string,
    testId: string,
    answers: TestAnswer[],
    photoIds?: {
      leftPhotoId?: string;
      centerPhotoId?: string;
      rightPhotoId?: string;
    }
  ) => {
    try {
      const result = await createCheckInWithTestAnswers({
        userId,
        testId,
        testAnswers: answers,
        ...photoIds,
      });
      
      return result;
    } catch (error) {
      console.error('Error creating check-in with test answers:', error);
      throw error;
    }
  };

  // Helper function to update test check-in answers
  const updateTestAnswers = async (
    testCheckinId: string,
    answers: TestAnswer[]
  ) => {
    try {
      const result = await updateTestCheckin({
        testCheckinId,
        answers,
      });
      
      return result;
    } catch (error) {
      console.error('Error updating test answers:', error);
      throw error;
    }
  };

  return {
    // Mutations
    createTestCheckin,
    updateTestCheckin,
    deleteTestCheckin,
    createCheckInWithTestAnswers,
    
    // Queries
    getTestCheckin,
    getTestCheckinByCheckIn,
    getTestCheckinsByTest,
    getTestCheckinsByUser,
    getTestCheckinsByUserAndTest,
    getRecentTestCheckins,
    
    // Helper functions
    submitCheckInWithAnswers,
    updateTestAnswers,
  };
}
