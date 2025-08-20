import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Test check-in mutations and queries

// Create a new test check-in with answers
export const createTestCheckin = mutation({
  args: {
    checkInId: v.optional(v.id("checkIns")), // Optional for standalone test questions
    testId: v.id("tests"),
    userId: v.string(),
    answers: v.array(v.object({
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

    // Get the test to validate required questions
    const test = await ctx.db.get(args.testId);
    if (!test) {
      throw new Error("Test not found");
    }

    // Check if all required questions are answered
    const requiredQuestions = test.formStructure.questions.filter(q => q.required);
    const answeredQuestionIds = new Set(args.answers.map(a => a.questionId));
    const allRequiredAnswered = requiredQuestions.every(q => answeredQuestionIds.has(q.id));

    const testCheckinId = await ctx.db.insert("testCheckins", {
      checkInId: args.checkInId, // This can be undefined for standalone test questions
      testId: args.testId,
      userId: args.userId,
      answers: args.answers.map(answer => ({
        ...answer,
        answeredAt: Date.now(),
      })),
      completed: allRequiredAnswered,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return testCheckinId;
  },
});

// Update an existing test check-in
export const updateTestCheckin = mutation({
  args: {
    testCheckinId: v.id("testCheckins"),
    answers: v.array(v.object({
      questionId: v.string(),
      answer: v.union(v.string(), v.number(), v.boolean()),
      questionType: v.union(v.literal("rating"), v.literal("yesNo"), v.literal("text"), v.literal("scale")),
    })),
  },
  handler: async (ctx, args) => {
    // TODO: Add authentication check here

    const existingCheckin = await ctx.db.get(args.testCheckinId);
    if (!existingCheckin) {
      throw new Error("Test check-in not found");
    }

    // Get the test to validate required questions
    const test = await ctx.db.get(existingCheckin.testId);
    if (!test) {
      throw new Error("Test not found");
    }

    // Check if all required questions are answered
    const requiredQuestions = test.formStructure.questions.filter(q => q.required);
    const answeredQuestionIds = new Set(args.answers.map(a => a.questionId));
    const allRequiredAnswered = requiredQuestions.every(q => answeredQuestionIds.has(q.id));

    await ctx.db.patch(args.testCheckinId, {
      answers: args.answers.map(answer => ({
        ...answer,
        answeredAt: Date.now(),
      })),
      completed: allRequiredAnswered,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

// Get test check-in by ID
export const getTestCheckin = query({
  args: { testCheckinId: v.id("testCheckins") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.testCheckinId);
  },
});

// Get test check-in by check-in ID
export const getTestCheckinByCheckIn = query({
  args: { checkInId: v.id("checkIns") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("testCheckins")
      .withIndex("by_checkInId", (q) => q.eq("checkInId", args.checkInId))
      .first();
  },
});

// Get all test check-ins for a specific test
export const getTestCheckinsByTest = query({
  args: { testId: v.id("tests") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("testCheckins")
      .withIndex("by_testId", (q) => q.eq("testId", args.testId))
      .order("desc")
      .collect();
  },
});

// Get test check-ins for a user
export const getTestCheckinsByUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("testCheckins")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

// Get test check-ins for a user and specific test
export const getTestCheckinsByUserAndTest = query({
  args: { userId: v.string(), testId: v.id("tests") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("testCheckins")
      .withIndex("by_userId_testId", (q) => 
        q.eq("userId", args.userId).eq("testId", args.testId)
      )
      .order("desc")
      .collect();
  },
});

// Get recent test check-ins for a user
export const getRecentTestCheckins = query({
  args: { userId: v.string(), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit || 10;
    return await ctx.db
      .query("testCheckins")
      .withIndex("by_userId_date", (q) => q.eq("userId", args.userId))
      .order("desc")
      .take(limit);
  },
});

// Delete a test check-in
export const deleteTestCheckin = mutation({
  args: { testCheckinId: v.id("testCheckins") },
  handler: async (ctx, args) => {
    // TODO: Add authentication check here
    
    await ctx.db.delete(args.testCheckinId);
    return { success: true };
  },
});
