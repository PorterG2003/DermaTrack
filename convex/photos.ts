import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";

// Generate a Convex storage upload URL for photos
export const generatePhotoUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    
    return await ctx.storage.generateUploadUrl();
  },
});

// Save photo metadata to the database
export const savePhoto = mutation({
  args: {
    storageId: v.id("_storage"),
    photoType: v.union(v.literal("left"), v.literal("center"), v.literal("right")),
    sessionId: v.string(),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    console.log('🔍 savePhoto: Starting mutation with args:', {
      storageId: args.storageId,
      photoType: args.photoType,
      sessionId: args.sessionId,
      userId: args.userId,
      userIdType: typeof args.userId
    });

    const identity = await ctx.auth.getUserIdentity();
    console.log('🔍 savePhoto: Authentication identity:', {
      hasIdentity: !!identity,
      identitySubject: identity?.subject,
      identityEmail: identity?.email,
      identityName: identity?.name
    });

    if (!identity) {
      console.error('❌ savePhoto: No authentication identity found');
      throw new Error("Not authenticated");
    }

    // Extract the user ID from the subject (first part before the first |)
    const extractedUserId = identity.subject.split('|')[0];
    console.log('🔍 savePhoto: Extracted user ID from identity:', {
      fullSubject: identity.subject,
      extractedUserId,
      extractedUserIdType: typeof extractedUserId
    });

    // Verify the user owns this userId
    const user = await ctx.db.get(extractedUserId as Id<"users">);

    console.log('🔍 savePhoto: Database user lookup result:', {
      hasUser: !!user,
      userFromDb: user ? {
        _id: user._id,
        email: user.email,
        name: user.name
      } : null,
      searchedUserId: extractedUserId
    });

    if (!user) {
      console.error('❌ savePhoto: User not found in database for email:', identity.email);
      throw new Error("User not found");
    }

    console.log('🔍 savePhoto: User ID comparison:', {
      argsUserId: args.userId,
      argsUserIdType: typeof args.userId,
      userFromDbId: user._id,
      userFromDbIdType: typeof user._id,
      areEqual: user._id === args.userId,
      comparisonResult: user._id !== args.userId
    });

    if (!user || user._id !== args.userId) {
      console.error('❌ savePhoto: Unauthorized - User ID mismatch:', {
        argsUserId: args.userId,
        userFromDbId: user._id,
        identitySubject: identity.subject,
        extractedUserId
      });
      throw new Error("Unauthorized");
    }

    console.log('✅ savePhoto: Authorization successful, inserting photo...');
    
    const photoId = await ctx.db.insert("photos", {
      userId: args.userId,
      storageId: args.storageId,
      photoType: args.photoType,
      sessionId: args.sessionId,
      createdAt: Date.now(),
    });

    console.log('✅ savePhoto: Photo saved successfully with ID:', photoId);
    
    return photoId;
  },
});

// Get photos by session ID
export const getPhotosBySession = query({
  args: { sessionId: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    return await ctx.db
      .query("photos")
      .withIndex("by_sessionId", (q) => q.eq("sessionId", args.sessionId))
      .order("asc")
      .collect();
  },
});

// Get photos by user ID
export const getPhotosByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Verify the user owns this userId
    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", identity.email))
      .first();

    if (!user || user._id !== args.userId) {
      throw new Error("Unauthorized");
    }

    return await ctx.db
      .query("photos")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

// Delete a photo
export const deletePhoto = mutation({
  args: { photoId: v.id("photos") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Get the photo to verify ownership
    const photo = await ctx.db.get(args.photoId);
    if (!photo) {
      throw new Error("Photo not found");
    }

    // Verify the user owns this photo
    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", identity.email))
      .first();

    if (!user || user._id !== photo.userId) {
      throw new Error("Unauthorized");
    }

    // Delete the photo
    await ctx.db.delete(args.photoId);
    
    return { success: true };
  },
});

// Get recent photos for a user
export const getRecentPhotos = query({
  args: { userId: v.id("users"), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Verify the user owns this userId
    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", identity.email))
      .first();

    if (!user || user._id !== args.userId) {
      throw new Error("Unauthorized");
    }

    const limit = args.limit || 10;
    return await ctx.db
      .query("photos")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .order("desc")
      .take(limit);
  },
});
