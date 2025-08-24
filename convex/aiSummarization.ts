import { v } from "convex/values";
import { action, mutation } from "./_generated/server";

// Types for the summarization data
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

export const updateTestCheckInSummary = mutation({
  args: {
    testCheckinId: v.id("testCheckins"),
    summary: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.testCheckinId, {
      summary: args.summary,
      updatedAt: Date.now(),
    });
    
    console.log("✅ AI Summarization: Successfully saved summary to database", { 
      testCheckinId: args.testCheckinId,
      summaryLength: args.summary.length 
    });
    
    return { success: true };
  },
});

export const generateCheckInSummary = action({
  args: {
    summarizationData: v.object({
      testName: v.string(),
      testDescription: v.optional(v.string()),
      userSignals: v.optional(v.object({
        areasAffected: v.optional(v.array(v.string())),
        itchy: v.optional(v.boolean()),
        allBumpsLookSame: v.optional(v.boolean()),
        comedonesPresent: v.optional(v.boolean()),
        middayShineTzone: v.optional(v.boolean()),
        middayShineCheeks: v.optional(v.boolean()),
        feelsTightAfterCleanse: v.optional(v.boolean()),
        visibleFlakingDaysPerWeek: v.optional(v.number()),
        usesMoisturizerDaily: v.optional(v.boolean()),
        usesSunscreenDaily: v.optional(v.boolean()),
        hotHumidExposure: v.optional(v.string()),
        stressNow_0to10: v.optional(v.number()),
      })),
      answers: v.array(v.object({
        question: v.string(),
        answer: v.union(v.string(), v.number(), v.boolean()),
        questionType: v.string(),
      })),
      checkInDate: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    try {
      // Generate summary using OpenAI
      console.log("🚀 AI Summarization: Starting summary generation");
      const summary = await generateOpenAISummary(args.summarizationData);
      
      console.log("✅ AI Summarization: Successfully generated summary", { 
        summaryLength: summary.length 
      });

      return { success: true, summary };
    } catch (error) {
      console.error("❌ AI Summarization: Failed to generate summary", { 
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      
      return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
  },
});

async function generateOpenAISummary(data: SummarizationData): Promise<string> {
  const apiKey = process.env.OPEN_API_SECRET;
  console.log("🔍 AI Summarization: Checking API key...", { 
    hasApiKey: !!apiKey, 
    apiKeyLength: apiKey?.length || 0 
  });
  
  if (!apiKey) {
    console.error("❌ AI Summarization: OPEN_API_SECRET environment variable is not set");
    throw new Error("OpenAI API key not configured. Please set OPEN_API_SECRET in your Convex environment variables.");
  }

  console.log("✅ AI Summarization: API key found, proceeding with OpenAI request...");
  
  const prompt = createSummarizationPrompt(data);
  
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
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
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("❌ AI Summarization: OpenAI API error", { 
        status: response.status, 
        statusText: response.statusText,
        error: errorData 
      });
      throw new Error(`OpenAI API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const result = await response.json();
    console.log("✅ AI Summarization: Successfully generated summary", { 
      model: result.model,
      usage: result.usage 
    });
    return result.choices[0]?.message?.content || "Unable to generate summary";
  } catch (error) {
    console.error("❌ AI Summarization: Fetch error", error);
    throw error;
  }
}

function createSummarizationPrompt(data: SummarizationData): string {
  const { testName, testDescription, userSignals, answers, checkInDate } = data;
  
  let prompt = `Analyze this skin care check-in and provide a helpful summary in markdown format:\n\n`;
  prompt += `**Test:** ${testName}\n`;
  if (testDescription) {
    prompt += `**Description:** ${testDescription}\n`;
  }
  prompt += `**Date:** ${checkInDate}\n\n`;
  
  if (userSignals) {
    prompt += `**User Context:**\n`;
    if (userSignals.areasAffected?.length) {
      prompt += `- Areas affected: ${userSignals.areasAffected.join(", ")}\n`;
    }
    if (userSignals.itchy !== undefined) {
      prompt += `- Itchy: ${userSignals.itchy ? "Yes" : "No"}\n`;
    }
    if (userSignals.allBumpsLookSame !== undefined) {
      prompt += `- All bumps look same: ${userSignals.allBumpsLookSame ? "Yes" : "No"}\n`;
    }
    if (userSignals.comedonesPresent !== undefined) {
      prompt += `- Comedones present: ${userSignals.comedonesPresent ? "Yes" : "No"}\n`;
    }
    if (userSignals.middayShineTzone !== undefined) {
      prompt += `- Midday shine (T-zone): ${userSignals.middayShineTzone ? "Yes" : "No"}\n`;
    }
    if (userSignals.middayShineCheeks !== undefined) {
      prompt += `- Midday shine (cheeks): ${userSignals.middayShineCheeks ? "Yes" : "No"}\n`;
    }
    if (userSignals.feelsTightAfterCleanse !== undefined) {
      prompt += `- Feels tight after cleanse: ${userSignals.feelsTightAfterCleanse ? "Yes" : "No"}\n`;
    }
    if (userSignals.visibleFlakingDaysPerWeek !== undefined) {
      prompt += `- Visible flaking (days/week): ${userSignals.visibleFlakingDaysPerWeek}\n`;
    }
    if (userSignals.usesMoisturizerDaily !== undefined) {
      prompt += `- Uses moisturizer daily: ${userSignals.usesMoisturizerDaily ? "Yes" : "No"}\n`;
    }
    if (userSignals.usesSunscreenDaily !== undefined) {
      prompt += `- Uses sunscreen daily: ${userSignals.usesSunscreenDaily ? "Yes" : "No"}\n`;
    }
    if (userSignals.hotHumidExposure) {
      prompt += `- Hot/humid exposure: ${userSignals.hotHumidExposure}\n`;
    }
    if (userSignals.stressNow_0to10 !== undefined) {
      prompt += `- Current stress level (0-10): ${userSignals.stressNow_0to10}\n`;
    }
    prompt += `\n`;
  }
  
  prompt += `**Check-in Answers:**\n`;
  
  answers.forEach((answer, index) => {
    prompt += `${index + 1}. **${answer.question}**\n   Answer: ${answer.answer}\n`;
  });
  
  prompt += `\nPlease provide a concise summary in markdown format that includes:\n\n`;
  prompt += `## Key Observations\n`;
  prompt += `- [Your observations here]\n\n`;
  prompt += `## Patterns & Changes\n`;
  prompt += `- [Any notable patterns or changes]\n\n`;
  prompt += `## Personalized Insights\n`;
  prompt += `- [Relevant insights based on user context and signals]\n\n`;
  prompt += `## Recommendations\n`;
  prompt += `- [Brief actionable advice if applicable]\n\n`;
  prompt += `Keep the summary under 200 words and focus on what's most relevant to this specific check-in. Use markdown formatting for better readability.`;
  
  return prompt;
}
