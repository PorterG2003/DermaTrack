import { useAction, useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';

interface SummarizationData {
  testName: string;
  testDescription?: string;
  userSignals?: {
    areasAffected?: string[];
    itchy?: boolean;
    allBumpsLookSame?: boolean;
    comedonesPresent?: boolean;
    middayShineTzone?: boolean;
    middayShineCheeks?: boolean;
    feelsTightAfterCleanse?: boolean;
    visibleFlakingDaysPerWeek?: number;
    usesMoisturizerDaily?: boolean;
    usesSunscreenDaily?: boolean;
    hotHumidExposure?: string;
    stressNow_0to10?: number;
  };
  answers: Array<{
    question: string;
    answer: string | number | boolean;
    questionType: string;
  }>;
  checkInDate: string;
}

export function useAISummarization() {
  const generateSummary = useAction(api.aiSummarization.generateCheckInSummary);
  const updateSummary = useMutation(api.aiSummarization.updateTestCheckInSummary);

  const generateAndSaveSummary = async (
    testCheckinId: string,
    summarizationData: SummarizationData
  ) => {
    try {
      // Generate the summary using the action
      const summaryResult = await generateSummary({ summarizationData });
      
      if (summaryResult.success && summaryResult.summary) {
        // Update the test check-in with the generated summary
        await updateSummary({
          testCheckinId: testCheckinId as any, // Type assertion needed due to Convex ID types
          summary: summaryResult.summary,
        });
        
        return { success: true, summary: summaryResult.summary };
      } else {
        console.warn('AI summarization failed:', summaryResult.error);
        return { success: false, error: summaryResult.error };
      }
    } catch (error) {
      console.error('Failed to generate and save AI summary:', error);
      return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
  };

  return { generateAndSaveSummary };
}
