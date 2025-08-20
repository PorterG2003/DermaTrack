import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Check-in mutations and queries
export const createCheckIn = mutation({
  args: {
    userId: v.string(),
    testId: v.optional(v.id("tests")),
    leftPhotoId: v.optional(v.id("photos")),
    centerPhotoId: v.optional(v.id("photos")),
    rightPhotoId: v.optional(v.id("photos")),
  },
  handler: async (ctx, args) => {
    // TODO: Add authentication check here
    // const identity = await ctx.auth.getUserIdentity();
    // if (!identity) {
    //   throw new Error("Not authenticated");
    // }
    
    const checkInId = await ctx.db.insert("checkIns", {
      userId: args.userId,
      createdAt: Date.now(),
      testId: args.testId,
      completed: true, // If we're creating it, it's completed
      leftPhotoId: args.leftPhotoId,
      centerPhotoId: args.centerPhotoId,
      rightPhotoId: args.rightPhotoId,
    });
    
    return checkInId;
  },
});

// Create a check-in with test answers in one operation
export const createCheckInWithTestAnswers = mutation({
  args: {
    userId: v.string(),
    testId: v.id("tests"),
    leftPhotoId: v.optional(v.id("photos")),
    centerPhotoId: v.optional(v.id("photos")),
    rightPhotoId: v.optional(v.id("photos")),
    testAnswers: v.array(v.object({
      questionId: v.string(),
      answer: v.union(v.string(), v.number(), v.boolean()),
      questionType: v.union(v.literal("rating"), v.literal("yesNo"), v.literal("text"), v.literal("scale")),
    })),
  },
  handler: async (ctx, args) => {
    // TODO: Add authentication check here
    // const identity = await ctx.auth.getUserIdentity();
    // if (!identity) {
    //   throw new Error("Not authenticated");
    // }
    
    // Create the check-in first
    const checkInId = await ctx.db.insert("checkIns", {
      userId: args.userId,
      createdAt: Date.now(),
      testId: args.testId,
      completed: true,
      leftPhotoId: args.leftPhotoId,
      centerPhotoId: args.centerPhotoId,
      rightPhotoId: args.rightPhotoId,
    });

    // Get the test to validate required questions
    const test = await ctx.db.get(args.testId);
    if (!test) {
      throw new Error("Test not found");
    }

    // Check if all required questions are answered
    const requiredQuestions = test.formStructure.questions.filter(q => q.required);
    const answeredQuestionIds = new Set(args.testAnswers.map(a => a.questionId));
    const allRequiredAnswered = requiredQuestions.every(q => answeredQuestionIds.has(q.id));

    // Create the test check-in
    const testCheckinId = await ctx.db.insert("testCheckins", {
      checkInId: checkInId,
      testId: args.testId,
      userId: args.userId,
      answers: args.testAnswers.map(answer => ({
        ...answer,
        answeredAt: Date.now(),
      })),
      completed: allRequiredAnswered,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    
    return {
      checkInId,
      testCheckinId,
    };
  },
});

export const getCheckInsByUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("checkIns")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

export const getRecentCheckIns = query({
  args: { userId: v.string(), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit || 7;
    return await ctx.db
      .query("checkIns")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .order("desc")
      .take(limit);
  },
});

// Get check-ins with their associated test answers
export const getCheckInsWithTestAnswers = query({
  args: { userId: v.string(), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit || 10;
    const checkIns = await ctx.db
      .query("checkIns")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .order("desc")
      .take(limit);

    // For each check-in, fetch its associated test answers if it has a test
    const checkInsWithAnswers = await Promise.all(
      checkIns.map(async (checkIn) => {
        if (checkIn.testId) {
          const testCheckin = await ctx.db
            .query("testCheckins")
            .withIndex("by_checkInId", (q) => q.eq("checkInId", checkIn._id))
            .first();
          
          return {
            ...checkIn,
            testAnswers: testCheckin || null,
          };
        }
        return {
          ...checkIn,
          testAnswers: null,
        };
      })
    );

    return checkInsWithAnswers;
  },
});
