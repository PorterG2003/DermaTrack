import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";

// Create or get user profile when they first sign in
export const storeUser = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    console.log('🔍 storeUser.identity:', identity);
    if (!identity) {
      throw new Error("Called storeUser without authentication present");
    }

    // Extract the user ID from the subject (first part before the first |)
    const userId = identity.subject.split('|')[0];
    console.log('🔍 Extracted userId from subject:', userId);

    // Get the user from Convex Auth's built-in users table
    const user = await ctx.db.get(userId as Id<"users">);
    
    if (!user) {
      throw new Error("User not found in built-in users table");
    }

    // Check if we already have a profile for this user
    const existingProfile = await ctx.db
      .query("userProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .first();

    if (existingProfile) {
      // Profile already exists, return it
      return existingProfile._id;
    }

    // Create a new profile for this user
    return await ctx.db.insert("userProfiles", {
      userId: user._id,
      onboardingCompleted: false,
    });
  },
});

// Get current user's profile
export const getProfile = query({
  args: {},
  handler: async (ctx) => {
    console.log('🔍 getProfile: Query started');
    
    const identity = await ctx.auth.getUserIdentity();
    console.log('🔍 getProfile: Authentication identity:', {
      hasIdentity: !!identity,
      identitySubject: identity?.subject,
      identityEmail: identity?.email,
      identityName: identity?.name
    });
    
    if (!identity) {
      console.log('❌ getProfile: No authentication identity found');
      return null;
    }

    // Extract the user ID from the subject (first part before the first |)
    const userId = identity.subject.split('|')[0];
    console.log('🔍 getProfile: Extracted user ID from identity:', {
      fullSubject: identity.subject,
      extractedUserId: userId,
      extractedUserIdType: typeof userId
    });

    // Get the user from Convex Auth's built-in users table
    const user = await ctx.db.get(userId as Id<"users">);
    console.log('🔍 getProfile: Built-in user lookup result:', {
      hasUser: !!user,
      userFromDb: user ? {
        _id: user._id,
        email: user.email,
        name: user.name
      } : null,
      searchedUserId: userId
    });

    if (!user) {
      console.log('❌ getProfile: User not found in built-in users table');
      return null;
    }

    // Get the user's profile
    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .first();

    console.log('🔍 getProfile: User profile lookup result:', {
      hasProfile: !!profile,
      profileFromDb: profile ? {
        _id: profile._id,
        userId: profile.userId,
        onboardingCompleted: profile.onboardingCompleted
      } : null,
      searchedUserId: user._id
    });

    if (!profile) {
      console.log('❌ getProfile: User profile not found');
      return null;
    }

    // Return combined data
    const result = {
      ...profile,
      _id: user._id, // Use the built-in user ID for compatibility
      name: user.name,
      email: user.email,
      image: user.image,
    };
    
    console.log('✅ getProfile: Returning combined profile data:', {
      finalId: result._id,
      finalIdType: typeof result._id,
      profileUserId: result.userId,
      profileUserIdType: typeof result.userId
    });
    
    return result;
  },
});

// Update user profile
export const updateProfile = mutation({
  args: {
    gender: v.optional(v.union(v.literal("male"), v.literal("female"))),
    dateOfBirth: v.optional(v.number()),
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

    // Extract the user ID from the subject (first part before the first |)
    const userId = identity.subject.split('|')[0];

    // Get the user from Convex Auth's built-in users table
    const user = await ctx.db.get(userId as Id<"users">);

    if (!user) {
      throw new Error("User not found");
    }

    // Get the user's profile
    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .first();

    if (!profile) {
      throw new Error("User profile not found");
    }

    // Update the profile
    return await ctx.db.patch(profile._id, args);
  },
});

// Mark onboarding as completed
export const completeOnboarding = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    // Extract the user ID from the subject (first part before the first |)
    const userId = identity.subject.split('|')[0];

    // Get the user from Convex Auth's built-in users table
    const user = await ctx.db.get(userId as Id<"users">);

    if (!user) {
      throw new Error("User not found");
    }

    // Get the user's profile
    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .first();

    if (!profile) {
      throw new Error("User profile not found");
    }

    // Mark onboarding as completed
    return await ctx.db.patch(profile._id, {
      onboardingCompleted: true,
    });
  },
});

// Check if onboarding is completed
export const isOnboardingCompleted = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return false;

    // Extract the user ID from the subject (first part before the first |)
    const userId = identity.subject.split('|')[0];

    // Get the user from Convex Auth's built-in users table
    const user = await ctx.db.get(userId as Id<"users">);

    if (!user) return false;

    // Get the user's profile
    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
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

    // Extract the user ID from the subject (first part before the first |)
    const userId = identity.subject.split('|')[0];

    // Get the user from Convex Auth's built-in users table
    const user = await ctx.db.get(userId as Id<"users">);

    if (!user) {
      throw new Error("User not found");
    }

    // Get the user's profile
    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .first();

    if (!profile) {
      throw new Error("User profile not found");
    }

    // Reset onboarding
    return await ctx.db.patch(profile._id, {
      onboardingCompleted: false,
    });
  },
});
