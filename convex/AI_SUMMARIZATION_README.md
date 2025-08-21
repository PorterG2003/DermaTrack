# AI Summarization Feature

This feature automatically generates AI-powered summaries for each completed test check-in using OpenAI's GPT-4o-mini model.

## How It Works

1. **Automatic Generation**: When a user completes a check-in with test answers, the system automatically triggers an AI summary generation
2. **Context-Aware**: The AI considers the user's profile (skin type, concerns, goals) when generating summaries
3. **Stored Permanently**: Summaries are saved to the database and displayed in the check-in history

## Implementation Details

### Database Schema Changes
- Added `summary` field to the `testCheckins` table in `convex/schema.ts`

### New Files
- `convex/aiSummarization.ts` - Contains the AI summarization logic and OpenAI API integration

### Modified Files
- `convex/checkIns.ts` - Updated to automatically trigger summary generation
- `screens/check-in/CheckInHistoryScreen.tsx` - Added summary display

## API Configuration

The feature uses the `OPEN_API_SECRET` environment variable for OpenAI API access.

## Features

- **Smart Prompts**: Contextual prompts that include user profile data and test information
- **Cost Control**: Uses GPT-4o-mini model with token limits (300 max tokens)
- **Error Handling**: Graceful fallback if AI generation fails
- **Asynchronous Processing**: Summaries are generated in the background without blocking user interactions

## Summary Content

Each AI summary includes:
- Key observations from the check-in answers
- Notable patterns or changes
- Insights based on user's skin type and goals
- Brief recommendations when applicable

## Usage

Summaries are automatically generated and displayed when:
1. A user completes a check-in with test answers
2. All required questions are answered
3. The check-in is saved to the database

Users can view summaries in the Check-In History screen, where they appear below the test answers for each completed check-in.

## Cost Considerations

- Uses GPT-4o-mini (most cost-effective model)
- Limited to 300 tokens per summary
- One summary per check-in (limited by the app's one-check-in-per-day rule)
- Summaries are generated only when check-ins are completed

## Future Enhancements

- User preference controls for summary style
- Summary regeneration options
- Trend analysis across multiple check-ins
- Customizable prompt templates
