import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Test mutations and queries
export const createTest = mutation({
  args: {
    userId: v.string(),
    name: v.string(),
    description: v.optional(v.string()),
    formStructure: v.object({
      questions: v.array(v.object({
        id: v.string(),
        type: v.union(v.literal("rating"), v.literal("yesNo"), v.literal("text"), v.literal("scale")),
        question: v.string(),
        required: v.boolean(),
        options: v.optional(v.array(v.string())),
      })),
    }),
  },
  handler: async (ctx, args) => {
    // TODO: Add authentication check here
    // const identity = await ctx.auth.getUserIdentity();
    // if (!identity) {
    //   throw new Error("Not authenticated");
    // }
    
    const testId = await ctx.db.insert("tests", {
      userId: args.userId,
      name: args.name,
      description: args.description,
      formStructure: args.formStructure,
      startDate: Date.now(),
      endDate: undefined,
      isActive: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    
    return testId;
  },
});

export const getTestsByUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("tests")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

export const getActiveTest = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("tests")
      .withIndex("by_userId_active", (q) => 
        q.eq("userId", args.userId).eq("isActive", true)
      )
      .first();
  },
});

export const endTest = mutation({
  args: { testId: v.id("tests") },
  handler: async (ctx, args) => {
    // TODO: Add authentication check here
    
    await ctx.db.patch(args.testId, {
      isActive: false,
      endDate: Date.now(),
      updatedAt: Date.now(),
    });
    
    return { success: true };
  },
});

export const updateTest = mutation({
  args: {
    testId: v.id("tests"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    formStructure: v.optional(v.object({
      questions: v.array(v.object({
        id: v.string(),
        type: v.union(v.literal("rating"), v.literal("yesNo"), v.literal("text"), v.literal("scale")),
        question: v.string(),
        required: v.boolean(),
        options: v.optional(v.array(v.string())),
      })),
    })),
  },
  handler: async (ctx, args) => {
    // TODO: Add authentication check here
    
    const updates: any = { updatedAt: Date.now() };
    if (args.name !== undefined) updates.name = args.name;
    if (args.description !== undefined) updates.description = args.description;
    if (args.formStructure !== undefined) updates.formStructure = args.formStructure;
    
    await ctx.db.patch(args.testId, updates);
    
    return { success: true };
  },
});

// Test template functions
export const getTestTemplates = query({
  args: { category: v.optional(v.union(
    v.literal("product"), 
    v.literal("routine"), 
    v.literal("lifestyle"), 
    v.literal("ingredient")
  )) },
  handler: async (ctx, args) => {
    if (args.category) {
      return await ctx.db
        .query("testTemplates")
        .withIndex("by_category", (q) => q.eq("category", args.category!))
        .filter((q) => q.eq(q.field("isActive"), true))
        .collect();
    }
    
    return await ctx.db
      .query("testTemplates")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .collect();
  },
});

export const createTestFromTemplate = mutation({
  args: {
    userId: v.string(),
    templateId: v.id("testTemplates"),
    customName: v.optional(v.string()), // Allow user to customize the name
    customDescription: v.optional(v.string()), // Allow user to customize the description
  },
  handler: async (ctx, args) => {
    // TODO: Add authentication check here
    
    // Get the template
    const template = await ctx.db.get(args.templateId);
    if (!template) {
      throw new Error("Template not found");
    }
    
    // Create a new test instance from the template
    const testId = await ctx.db.insert("tests", {
      userId: args.userId,
      name: args.customName || template.name,
      description: args.customDescription || template.description,
      formStructure: template.formStructure, // Copy the form structure
      startDate: Date.now(),
      endDate: undefined,
      isActive: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    
    return testId;
  },
});

// Setup function to create initial test templates (run once)
export const setupTestTemplates = mutation({
  handler: async (ctx) => {
    // TODO: Add admin authentication check here
    
    // Dermatrack — At-Home Single-Variable Tests
    // Principle: each test changes ONE thing; keep everything else the same.
    const templates = [
      // 1) Start Retinoid (Every Other Night)
      {
        name: "Start Retinoid (Every Other Night)",
        description: "Add a retinoid EoN. Keep all other products/schedule the same.",
        category: "routine" as const,
        formStructure: {
          questions: [
            { id: "appliedAsPlanned", type: "yesNo" as const, question: "Applied retinoid tonight as planned?", required: true },
            { id: "irritation", type: "rating" as const, question: "Irritation today?", required: true, options: ["None", "Mild", "Moderate", "Severe"] },
            { id: "acneSeverity", type: "rating" as const, question: "Acne severity today?", required: true, options: ["None", "Mild", "Moderate", "Severe"] },
          ],
        },
        duration: 28,
        isActive: true,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },

      // 2) BPO Strength Step-Up (2.5% → 5%)
      {
        name: "BPO Strength Step-Up (2.5% → 5%)",
        description: "Use a higher BPO strength. Don't change anything else.",
        category: "ingredient" as const,
        formStructure: {
          questions: [
            { id: "usedAsPlanned", type: "yesNo" as const, question: "Used the higher strength today?", required: true },
            { id: "irritation", type: "rating" as const, question: "Irritation today?", required: true, options: ["None", "Mild", "Moderate", "Severe"] },
            { id: "acneSeverity", type: "rating" as const, question: "Acne severity?", required: true, options: ["None", "Mild", "Moderate", "Severe"] },
          ],
        },
        duration: 21,
        isActive: true,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },

      // 3) Pause Acids (AHA/BHA)
      {
        name: "Pause Acids (AHA/BHA)",
        description: "Stop all acids. Keep everything else the same.",
        category: "routine" as const,
        formStructure: {
          questions: [
            { id: "pausedAsPlanned", type: "yesNo" as const, question: "Avoided acids today?", required: true },
            { id: "stingingToday", type: "yesNo" as const, question: "Stinging/redness today?", required: true },
            { id: "acneSeverity", type: "rating" as const, question: "Acne severity?", required: true, options: ["None", "Mild", "Moderate", "Severe"] },
          ],
        },
        duration: 14,
        isActive: true,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },

      // 4) Cleanser Swap (Gentle, pH-Balanced)
      {
        name: "Cleanser Swap (Gentle, pH-Balanced)",
        description: "Use a gentle pH-balanced cleanser only. No other changes.",
        category: "product" as const,
        formStructure: {
          questions: [
            { id: "usedNewCleanser", type: "yesNo" as const, question: "Used the gentle cleanser today?", required: true },
            { id: "tightness", type: "scale" as const, question: "Skin tightness after wash", required: true, options: ["None", "Mild", "Moderate", "Severe"] },
            { id: "dryness", type: "scale" as const, question: "Dryness today", required: false, options: ["None", "Mild", "Moderate", "Severe"] },
          ],
        },
        duration: 14,
        isActive: true,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },

      // 5) Moisturizer Boost (Add Occlusive at Night)
      {
        name: "Moisturizer Boost (Add Occlusive PM)",
        description: "Add a simple occlusive layer at night. No other changes.",
        category: "product" as const,
        formStructure: {
          questions: [
            { id: "appliedAsPlanned", type: "yesNo" as const, question: "Added occlusive tonight?", required: true },
            { id: "morningDryness", type: "scale" as const, question: "Morning dryness", required: true, options: ["None", "Mild", "Moderate", "Severe"] },
            { id: "comfort", type: "rating" as const, question: "Skin comfort today?", required: false, options: ["Poor", "Fair", "Good", "Very Good", "Excellent"] },
          ],
        },
        duration: 14,
        isActive: true,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },

      // 6) Midday Sunscreen Reapply
      {
        name: "Midday Sunscreen Reapply",
        description: "Keep your usual SPF. Add one midday reapply only.",
        category: "lifestyle" as const,
        formStructure: {
          questions: [
            { id: "reapplied", type: "yesNo" as const, question: "Reapplied midday today?", required: true },
            { id: "timeOutside", type: "scale" as const, question: "Outdoor time total", required: true, options: ["<1h", "1–3h", "3–5h", "5h+"] },
            { id: "sunburn", type: "yesNo" as const, question: "Any sunburn/redness?", required: true },
          ],
        },
        duration: 14,
        isActive: true,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },

      // 7) Low-GI Focus (Reduce High-GI Foods)
      {
        name: "Low-GI Focus (Reduce High-GI Foods)",
        description: "Reduce higher-GI foods. Keep everything else the same.",
        category: "lifestyle" as const,
        formStructure: {
          questions: [
            { id: "keptLowGI", type: "yesNo" as const, question: "Kept meals lower-GI today?", required: true },
            { id: "acneSeverity", type: "rating" as const, question: "Acne severity?", required: true, options: ["None", "Mild", "Moderate", "Severe"] },
            { id: "newBreakouts", type: "yesNo" as const, question: "New breakouts since yesterday?", required: true },
          ],
        },
        duration: 28,
        isActive: true,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },

      // 8) Dairy Pause
      {
        name: "Dairy Pause",
        description: "Avoid dairy. Keep the rest of your routine and diet steady.",
        category: "lifestyle" as const,
        formStructure: {
          questions: [
            { id: "avoidedDairy", type: "yesNo" as const, question: "Avoided dairy today?", required: true },
            { id: "acneSeverity", type: "rating" as const, question: "Acne severity?", required: true, options: ["None", "Mild", "Moderate", "Severe"] },
            { id: "newBreakouts", type: "yesNo" as const, question: "New breakouts today?", required: true },
          ],
        },
        duration: 28,
        isActive: false, // enable only if relevant
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },

      // 9) Fragrance-Free Leave-Ons
      {
        name: "Fragrance-Free Leave-Ons",
        description: "Use only fragrance-free leave-on products. No other changes.",
        category: "routine" as const,
        formStructure: {
          questions: [
            { id: "stuckToPlan", type: "yesNo" as const, question: "Used fragrance-free leave-ons only?", required: true },
            { id: "rednessToday", type: "yesNo" as const, question: "Redness/itching today?", required: true },
            { id: "comfort", type: "rating" as const, question: "Skin comfort today?", required: false, options: ["Poor", "Fair", "Good", "Very Good", "Excellent"] },
          ],
        },
        duration: 14,
        isActive: true,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },

      // 10) Post-Workout Cleanse Shift
      {
        name: "Post-Workout Cleanse Shift",
        description: "Cleanse within 30 min after workouts. Change nothing else.",
        category: "lifestyle" as const,
        formStructure: {
          questions: [
            { id: "cleansedAfterWorkout", type: "yesNo" as const, question: "Cleansed right after workouts today?", required: true },
            { id: "newBreakouts", type: "yesNo" as const, question: "New breakouts (face/chest/back)?", required: true },
            { id: "acneSeverity", type: "rating" as const, question: "Acne severity?", required: true, options: ["None", "Mild", "Moderate", "Severe"] },
          ],
        },
        duration: 21,
        isActive: false, // enable for users who exercise often
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
    ];

    // Insert all templates
    const templateIds = [];
    for (const template of templates) {
      const id = await ctx.db.insert("testTemplates", template);
      templateIds.push(id);
    }

    return { 
      success: true, 
      message: `Created ${templateIds.length} test templates`,
      templateIds 
    };
  },
});
