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
