import { v } from "convex/values";
import { mutation } from "./_generated/server";

// Types for the summarization data
interface SummarizationData {
  testName: string;
  testDescription?: string;
  userProfile: {
    skinType?: string;
    primaryConcerns?: string[];
    goals?: string[];
  };
  answers: Array<{
    question: string;
    answer: string | number | boolean;
    questionType: string;
  }>;
  checkInDate: string;
}

export const generateCheckInSummary = mutation({
  args: {
    testCheckinId: v.id("testCheckins"),
  },
  handler: async (ctx, args) => {
    // Get the test check-in data
    const testCheckin = await ctx.db.get(args.testCheckinId);
    if (!testCheckin) {
      throw new Error("Test check-in not found");
    }

    // Get the associated test
    const test = await ctx.db.get(testCheckin.testId);
    if (!test) {
      throw new Error("Test not found");
    }

    // Get user profile for context
    const userProfile = await ctx.db
      .query("userProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", testCheckin.userId))
      .first();

    // Prepare data for summarization
    const summarizationData: SummarizationData = {
      testName: test.name,
      testDescription: test.description,
      userProfile: {
        skinType: userProfile?.skinType,
        primaryConcerns: userProfile?.primaryConcerns,
        goals: userProfile?.goals,
      },
      answers: testCheckin.answers.map(answer => {
        const question = test.formStructure.questions.find(q => q.id === answer.questionId);
        return {
          question: question?.question || "Unknown question",
          answer: answer.answer,
          questionType: answer.questionType,
        };
      }),
      checkInDate: new Date(testCheckin.createdAt).toLocaleDateString(),
    };

    try {
      // Generate summary using OpenAI
      const summary = await generateOpenAISummary(summarizationData);
      
      // Update the test check-in with the summary
      await ctx.db.patch(args.testCheckinId, {
        summary,
        updatedAt: Date.now(),
      });

      return { success: true, summary };
    } catch (error) {
      console.error("Error generating summary:", error);
      throw new Error("Failed to generate summary");
    }
  },
});

async function generateOpenAISummary(data: SummarizationData): Promise<string> {
  const apiKey = process.env.OPEN_API_SECRET;
  if (!apiKey) {
    throw new Error("OpenAI API key not configured");
  }

  const prompt = createSummarizationPrompt(data);
  
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini", // Using the most cost-effective model
      messages: [
        {
          role: "system",
          content: "You are a dermatology assistant that analyzes skin care check-ins and provides helpful insights. Be concise but informative, focusing on trends, patterns, and actionable advice."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 300, // Limit response length for cost control
      temperature: 0.7, // Balanced creativity and consistency
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`OpenAI API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
  }

  const result = await response.json();
  return result.choices[0]?.message?.content || "Unable to generate summary";
}

function createSummarizationPrompt(data: SummarizationData): string {
  const { testName, testDescription, userProfile, answers, checkInDate } = data;
  
  let prompt = `Analyze this skin care check-in and provide a helpful summary:\n\n`;
  prompt += `Test: ${testName}\n`;
  if (testDescription) {
    prompt += `Description: ${testDescription}\n`;
  }
  prompt += `Date: ${checkInDate}\n\n`;
  
  if (userProfile.skinType) {
    prompt += `User Skin Type: ${userProfile.skinType}\n`;
  }
  if (userProfile.primaryConcerns?.length) {
    prompt += `Primary Concerns: ${userProfile.primaryConcerns.join(", ")}\n`;
  }
  if (userProfile.goals?.length) {
    prompt += `Goals: ${userProfile.goals.join(", ")}\n`;
  }
  prompt += `\nCheck-in Answers:\n`;
  
  answers.forEach((answer, index) => {
    prompt += `${index + 1}. ${answer.question}\n   Answer: ${answer.answer}\n`;
  });
  
  prompt += `\nPlease provide a concise summary that includes:\n`;
  prompt += `- Key observations from the answers\n`;
  prompt += `- Any notable patterns or changes\n`;
  prompt += `- Relevant insights based on the user's skin type and goals\n`;
  prompt += `- Brief recommendations if applicable\n`;
  prompt += `\nKeep the summary under 200 words and focus on what's most relevant to this specific check-in.`;
  
  return prompt;
}
