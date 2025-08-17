import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get user profile
export const getProfile = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    console.log('🔍 getProfile query:', { 
      hasIdentity: !!identity, 
      identitySubject: identity?.subject,
      identityEmail: identity?.email 
    });
    
    if (!identity) {
      console.log('🔍 getProfile: No identity found, returning null');
      return null;
    }

    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .first();

    console.log('🔍 getProfile: Profile found:', { 
      hasProfile: !!profile, 
      profileId: profile?._id,
      profileUserId: profile?.userId 
    });

    return profile;
  },
});

// Create or update user profile
export const upsertProfile = mutation({
  args: {
    gender: v.optional(v.union(v.literal("male"), v.literal("female"))),
    dateOfBirth: v.optional(v.number()), // Unix timestamp for DOB
    skinType: v.optional(v.union(
      v.literal("oily"), 
      v.literal("dry"), 
      v.literal("combination"), 
      v.literal("normal"), 
      v.literal("sensitive")
    )),
    primaryConcerns: v.optional(v.array(v.union(
      v.literal("acne"), 
      v.literal("blackheads"), 
      v.literal("whiteheads"), 
      v.literal("cysticAcne"), 
      v.literal("acneScars"), 
      v.literal("acneMarks")
    ))),
    goals: v.optional(v.array(v.union(
      v.literal("clearAcne"), 
      v.literal("preventBreakouts"), 
      v.literal("reduceScars"), 
      v.literal("buildRoutine"), 
      v.literal("trackProgress")
    ))),
    cameraPermission: v.optional(v.boolean()),
    notificationPreference: v.optional(v.union(
      v.literal("daily"), 
      v.literal("weekly"), 
      v.literal("important"), 
      v.literal("none")
    )),
    onboardingCompleted: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const existingProfile = await ctx.db
      .query("userProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .first();

    const now = Date.now();

    if (existingProfile) {
      // Update existing profile
      return await ctx.db.patch(existingProfile._id, {
        ...args,
        updatedAt: now,
      });
    } else {
      // Create new profile
      return await ctx.db.insert("userProfiles", {
        userId: identity.subject,
        ...args,
        createdAt: now,
        updatedAt: now,
      });
    }
  },
});

// Mark onboarding as completed
export const completeOnboarding = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .first();

    if (profile) {
      return await ctx.db.patch(profile._id, {
        onboardingCompleted: true,
        updatedAt: Date.now(),
      });
    } else {
      // Create profile if it doesn't exist
      return await ctx.db.insert("userProfiles", {
        userId: identity.subject,
        onboardingCompleted: true,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }
  },
});

// Check if onboarding is completed
export const isOnboardingCompleted = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return false;

    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .first();

    return profile?.onboardingCompleted ?? false;
  },
});

// Reset onboarding progress
export const resetOnboarding = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .first();

    if (profile) {
      return await ctx.db.patch(profile._id, {
        onboardingCompleted: false,
        updatedAt: Date.now(),
      });
    } else {
      throw new Error("Profile not found");
    }
  },
});

// Photo upload mutations
export const generatePhotoUploadUrl = mutation({
  handler: async (ctx) => {
    // TODO: Add authentication check here
    // const identity = await ctx.auth.getUserIdentity();
    // if (!identity) {
    //   throw new Error("Not authenticated");
    // }
    
    return await ctx.storage.generateUploadUrl();
  },
});

export const savePhoto = mutation({
  args: {
    storageId: v.id("_storage"),
    photoType: v.union(v.literal("left"), v.literal("center"), v.literal("right")),
    sessionId: v.string(),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    // TODO: Add authentication check here
    // const identity = await ctx.auth.getUserIdentity();
    // if (!identity) {
    //   throw new Error("Not authenticated");
    // }
    
    const photoId = await ctx.db.insert("photos", {
      userId: args.userId,
      storageId: args.storageId,
      photoType: args.photoType,
      sessionId: args.sessionId,
      createdAt: Date.now(),
    });
    
    return photoId;
  },
});

export const getPhotosBySession = query({
  args: { sessionId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("photos")
      .withIndex("by_sessionId", (q) => q.eq("sessionId", args.sessionId))
      .order("asc")
      .collect();
  },
});

export const getPhotosByUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("photos")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});
