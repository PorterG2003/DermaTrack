import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";

// Create or get user signals
export const storeUserSignals = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Called storeUserSignals without authentication present");
    }

    const userId = identity.subject.split('|')[0];

    // Get the user from Convex Auth's built-in users table
    const user = await ctx.db.get(userId as Id<"users">);
    
    if (!user) {
      throw new Error("User not found in built-in users table");
    }

    // Check if we already have signals for this user
    const existingSignals = await ctx.db
      .query("userSignals")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .first();

    if (existingSignals) {
      return existingSignals._id;
    }

    // Create new signals record
    return await ctx.db.insert("userSignals", {
      userId: user._id,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

// Get current user's signals
export const getUserSignals = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const userId = identity.subject.split('|')[0];
    const user = await ctx.db.get(userId as Id<"users">);

    if (!user) return null;

    return await ctx.db
      .query("userSignals")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .first();
  },
});

// Update user signals
export const updateUserSignals = mutation({
  args: {
    // Hormones & medical context
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
    preMenstrualFlareDays: v.optional(v.number()),
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

    // Distribution & symptom clues
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
    allBumpsLookSame: v.optional(v.boolean()),
    comedonesPresent: v.optional(v.boolean()),

    // Skin-type signals
    middayShineTzone: v.optional(v.boolean()),
    middayShineCheeks: v.optional(v.boolean()),
    feelsTightAfterCleanse: v.optional(v.boolean()),
    visibleFlakingDaysPerWeek: v.optional(v.number()),
    blottingSheetsPerDay: v.optional(v.number()),
    moisturizerReapplyPerDay: v.optional(v.number()),
    stingsWithBasicMoisturizer: v.optional(v.boolean()),
    historyOfEczemaOrDermatitis: v.optional(v.boolean()),

    // Friction / heat / sweat
    maskHoursPerDay: v.optional(v.number()),
    helmetHoursPerWeek: v.optional(v.number()),
    chinstrapOrGearHoursPerWeek: v.optional(v.number()),
    sweatyWorkoutsPerWeek: v.optional(v.number()),
    showerSoonAfterSweat: v.optional(v.boolean()),

    // Routine & product exposures
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

    // Pillowcase-related
    pillowcaseChangesPerWeek: v.optional(v.number()),
    laundryDetergentFragranced: v.optional(v.boolean()),
    sleepWithLeaveInHairProducts: v.optional(v.boolean()),

    // Diet levers
    sugaryDrinksPerDay: v.optional(v.number()),
    whiteCarbServingsPerDay: v.optional(v.number()),
    dairyServingsPerDay: v.optional(v.number()),
    mostlySkimDairy: v.optional(v.boolean()),
    wheyProteinUse: v.optional(v.boolean()),

    // Medication trigger gate
    hasPotentialMedTrigger: v.optional(v.boolean()),

    // Environment & lifestyle
    hotHumidExposure: v.optional(
      v.union(v.literal("low"), v.literal("medium"), v.literal("high"))
    ),
    saunaSteamSessionsPerWeek: v.optional(v.number()),
    sleepHoursAvg: v.optional(v.number()),
    stressNow_0to10: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const userId = identity.subject.split('|')[0];
    const user = await ctx.db.get(userId as Id<"users">);

    if (!user) {
      throw new Error("User not found");
    }

    // Get or create user signals
    let signals = await ctx.db
      .query("userSignals")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .first();

    if (!signals) {
      // Create new signals record
      const signalsId = await ctx.db.insert("userSignals", {
        userId: user._id,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      signals = await ctx.db.get(signalsId);
    }

    if (!signals) {
      throw new Error("Failed to create or get user signals");
    }

    // Update the signals
    return await ctx.db.patch(signals._id, {
      ...args,
      updatedAt: Date.now(),
    });
  },
});
