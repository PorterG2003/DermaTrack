import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const schema = defineSchema({
  ...authTables,
  
  // User profiles - stores our custom profile data
  userProfiles: defineTable({
    userId: v.id("users"), // Reference to Convex Auth's built-in users table
    
    // Our custom profile fields
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
  })
    .index("by_userId", ["userId"]),
  
  // User acne progress photos
  photos: defineTable({
    userId: v.id("users"), // Reference the users table (Convex ID)
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
    userId: v.id("users"), // Reference the users table (Convex ID)
    createdAt: v.number(), // Timestamp of check-in
    testId: v.optional(v.id("tests")), // Reference to current test (if any)
    testCheckinId: v.optional(v.id("testCheckins")), // Reference to test check-in data
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
    userId: v.id("users"), // Reference the users table (Convex ID)
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
    duration: v.number(), // Test duration in days (copied from template)
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

  // Test check-in answers - stores responses to test questions for each check-in
  testCheckins: defineTable({
    testId: v.id("tests"), // Reference to the test
    userId: v.id("users"), // Reference the users table (Convex ID)
    answers: v.array(v.object({
      questionId: v.string(), // Matches the question ID from the test form structure
      answer: v.union(
        v.string(), // For text, yesNo, and scale responses
        v.number(), // For rating responses
        v.boolean() // For yesNo responses (alternative to string)
      ),
      questionType: v.union(v.literal("rating"), v.literal("yesNo"), v.literal("text"), v.literal("scale")),
      answeredAt: v.number(), // Timestamp when this answer was provided
    })),
    summary: v.optional(v.string()), // AI-generated summary of the check-in
    completed: v.boolean(), // Whether all required questions were answered
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_userId_testId", ["userId", "testId"])
    .index("by_userId_date", ["userId", "createdAt"]),
});

export default schema;