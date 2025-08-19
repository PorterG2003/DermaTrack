import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
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

  // User check-ins
  checkIns: defineTable({
    userId: v.string(), // OAuth subject (string, not Convex ID)
    createdAt: v.number(), // Timestamp of check-in
    testId: v.optional(v.id("tests")), // Reference to current test (if any)
    completed: v.boolean(), // Whether this check-in was completed
    
    // Photo references - store the actual photo IDs
    leftPhotoId: v.optional(v.id("photos")), // Reference to left photo
    centerPhotoId: v.optional(v.id("photos")), // Reference to center photo  
    rightPhotoId: v.optional(v.id("photos")), // Reference to right photo
  })
    .index("by_userId", ["userId"])
    .index("by_userId_date", ["userId", "createdAt"])
    .index("by_userId_completed", ["userId", "completed"]),

  // User tests/experiments
  tests: defineTable({
    userId: v.string(), // OAuth subject (string, not Convex ID)
    name: v.string(), // e.g., "New Product Test", "Routine Change Test"
    description: v.optional(v.string()), // Optional description of the test
    formStructure: v.object({
      questions: v.array(v.object({
        id: v.string(),
        type: v.union(v.literal("rating"), v.literal("yesNo"), v.literal("text"), v.literal("scale")),
        question: v.string(),
        required: v.boolean(),
        options: v.optional(v.array(v.string())), // For rating scales or multiple choice
      })),
    }),
    startDate: v.number(), // Unix timestamp when test started
    endDate: v.optional(v.number()), // Unix timestamp when test ended (optional)
    isActive: v.boolean(), // Whether the test is currently running
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_userId_active", ["userId", "isActive"])
    .index("by_userId_date", ["userId", "startDate"]),

  // Test templates for users to choose from
  testTemplates: defineTable({
    name: v.string(), // e.g., "New Product Test", "Routine Change Test"
    description: v.string(), // Description of what this test tracks
    category: v.union(
      v.literal("product"), 
      v.literal("routine"), 
      v.literal("lifestyle"), 
      v.literal("ingredient")
    ),
    formStructure: v.object({
      questions: v.array(v.object({
        id: v.string(),
        type: v.union(v.literal("rating"), v.literal("yesNo"), v.literal("text"), v.literal("scale")),
        question: v.string(),
        required: v.boolean(),
        options: v.optional(v.array(v.string())), // For rating scales or multiple choice
      })),
    }),
    duration: v.number(), // Recommended test duration in days
    isActive: v.boolean(), // Whether this template is available for selection
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_category", ["category"])
    .index("by_active", ["isActive"]),
});

export default schema;