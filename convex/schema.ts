import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

const schema = defineSchema({
  ...authTables,
  
  // User profiles with onboarding data
  userProfiles: defineTable({
    userId: v.string(), // OAuth subject (string, not Convex ID)
    // Basic info
    gender: v.optional(v.union(v.literal("male"), v.literal("female"))),
    dateOfBirth: v.optional(v.number()), // Unix timestamp for DOB
    skinType: v.optional(v.union(
      v.literal("oily"), 
      v.literal("dry"), 
      v.literal("combination"), 
      v.literal("normal"), 
      v.literal("sensitive")
    )),
    
    // Preferences
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
    
    // Permissions and settings
    cameraPermission: v.optional(v.boolean()),
    notificationPreference: v.optional(v.union(
      v.literal("daily"), 
      v.literal("weekly"), 
      v.literal("important"), 
      v.literal("none")
    )),
    
    // Metadata
    onboardingCompleted: v.optional(v.boolean()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_onboardingCompleted", ["onboardingCompleted"]),

  // User acne progress photos
  photos: defineTable({
    userId: v.string(), // OAuth subject (string, not Convex ID)
    storageId: v.id("_storage"), // Reference to Convex storage
    photoType: v.union(
      v.literal("left"), 
      v.literal("center"), 
      v.literal("right")
    ),
    sessionId: v.string(), // Groups photos taken in same session
    createdAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_sessionId", ["sessionId"])
    .index("by_userId_photoType", ["userId", "photoType"]),
});

export default schema;