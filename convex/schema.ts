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

  // --- User Signals (actionable facts only) ---
  userSignals: defineTable({
    userId: v.id("users"),

    // Hormones & medical context (routing only)
    sexAtBirth: v.optional(
      v.union(
        v.literal("female"),
        v.literal("male"),
        v.literal("intersex"),
        v.literal("unknown")
      )
    ),
    menstruates: v.optional(v.boolean()),
    cycleRegular: v.optional(v.boolean()),
    preMenstrualFlareDays: v.optional(v.number()), // e.g., 3 days before period
    contraception: v.optional(
      v.union(
        v.literal("none"),
        v.literal("combined_ocp"),
        v.literal("progestin_only"),
        v.literal("hormonal_iud"),
        v.literal("copper_iud"),
        v.literal("implant"),
        v.literal("ring"),
        v.literal("patch"),
        v.literal("other")
      )
    ),
    pregnancyStatus: v.optional(
      v.union(
        v.literal("none"),
        v.literal("pregnant"),
        v.literal("postpartum"),
        v.literal("breastfeeding")
      )
    ),
    pcosDiagnosed: v.optional(v.boolean()),
    familyHistoryAcne: v.optional(v.boolean()),

    // Distribution & symptom clues (raw, not labels)
    areasAffected: v.optional(
      v.array(
        v.union(
          v.literal("forehead"),
          v.literal("hairline"),
          v.literal("temples"),
          v.literal("cheeks"),
          v.literal("jawline"),
          v.literal("chin"),
          v.literal("neck"),
          v.literal("chest"),
          v.literal("back"),
          v.literal("shoulders")
        )
      )
    ),
    itchy: v.optional(v.boolean()),
    allBumpsLookSame: v.optional(v.boolean()), // "monomorphic" clue
    comedonesPresent: v.optional(v.boolean()), // any black/whiteheads seen?

    // Skin-type signals (raw, actionable)
    middayShineTzone: v.optional(v.boolean()),
    middayShineCheeks: v.optional(v.boolean()),
    feelsTightAfterCleanse: v.optional(v.boolean()),
    visibleFlakingDaysPerWeek: v.optional(v.number()), // 0–7
    blottingSheetsPerDay: v.optional(v.number()),      // 0..n
    moisturizerReapplyPerDay: v.optional(v.number()),  // 0..n
    stingsWithBasicMoisturizer: v.optional(v.boolean()),
    historyOfEczemaOrDermatitis: v.optional(v.boolean()),

    // Friction / heat / sweat
    maskHoursPerDay: v.optional(v.number()),
    helmetHoursPerWeek: v.optional(v.number()),
    chinstrapOrGearHoursPerWeek: v.optional(v.number()),
    sweatyWorkoutsPerWeek: v.optional(v.number()),
    showerSoonAfterSweat: v.optional(v.boolean()),

    // Routine & product exposures (swappable behaviors)
    waterTemp: v.optional(
      v.union(v.literal("cool"), v.literal("lukewarm"), v.literal("hot"))
    ),
    cleansesPerDay: v.optional(v.number()),
    usesScrubsOrBrushes: v.optional(v.boolean()),
    fragranceInSkincare: v.optional(v.boolean()),
    fragranceInHaircare: v.optional(v.boolean()),
    hairOilsOrPomades: v.optional(v.boolean()),
    hairTouchesForehead: v.optional(v.boolean()),
    usesMoisturizerDaily: v.optional(v.boolean()),
    usesSunscreenDaily: v.optional(v.boolean()),

    // Pillowcase-related (per constraints: no material/position fields)
    pillowcaseChangesPerWeek: v.optional(v.number()), // 0, 1, 2, ...
    laundryDetergentFragranced: v.optional(v.boolean()),
    sleepWithLeaveInHairProducts: v.optional(v.boolean()),

    // Diet levers (for time-boxed trials)
    sugaryDrinksPerDay: v.optional(v.number()),
    whiteCarbServingsPerDay: v.optional(v.number()),
    dairyServingsPerDay: v.optional(v.number()),
    mostlySkimDairy: v.optional(v.boolean()),
    wheyProteinUse: v.optional(v.boolean()),

    // Medication trigger gate (details live in userMedications)
    hasPotentialMedTrigger: v.optional(v.boolean()),

    // Environment & lifestyle
    hotHumidExposure: v.optional(
      v.union(v.literal("low"), v.literal("medium"), v.literal("high"))
    ),
    saunaSteamSessionsPerWeek: v.optional(v.number()),
    sleepHoursAvg: v.optional(v.number()),
    stressNow_0to10: v.optional(v.number()),

    // housekeeping
    createdAt: v.number(), // Date.now()
    updatedAt: v.number(), // Date.now()
  })
    .index("by_userId", ["userId"]),

  // --- Medications & supplements (normalized) ---
  userMedications: defineTable({
    userId: v.id("users"),
    name: v.string(), // free text
    category: v.optional(
      v.union(
        v.literal("corticosteroid"),
        v.literal("androgen_testosterone"),
        v.literal("lithium"),
        v.literal("isoniazid"),
        v.literal("phenytoin"),
        v.literal("egfr_inhibitor"),
        v.literal("b12_high_dose"),
        v.literal("other")
      )
    ),
    dose: v.optional(v.string()),
    startedAt: v.optional(v.number()),
    stoppedAt: v.optional(v.number()),
    currentlyTaking: v.boolean(),
    notes: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_userId", ["userId"]),

  // --- Routine products (raw ingredients; analysis elsewhere) ---
  userRoutineProducts: defineTable({
    userId: v.id("users"),
    role: v.union(
      v.literal("cleanser"),
      v.literal("moisturizer"),
      v.literal("treatment"),
      v.literal("serum"),
      v.literal("sunscreen"),
      v.literal("makeup"),
      v.literal("hair_product"),
      v.literal("other")
    ),
    name: v.optional(v.string()),
    leaveOn: v.optional(v.boolean()),
    ingredientList: v.optional(v.array(v.string())), // raw strings
    fragranced: v.optional(v.boolean()),
    startedAt: v.optional(v.number()),
    active: v.boolean(),
    notes: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
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