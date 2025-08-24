import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";

// Get current user's medications
export const getUserMedications = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const userId = identity.subject.split('|')[0];
    const user = await ctx.db.get(userId as Id<"users">);

    if (!user) return null;

    return await ctx.db
      .query("userMedications")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .collect();
  },
});

// Add a new medication
export const addMedication = mutation({
  args: {
    name: v.string(),
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
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const userId = identity.subject.split('|')[0];
    const user = await ctx.db.get(userId as Id<"users">);

    if (!user) {
      throw new Error("User not found");
    }

    return await ctx.db.insert("userMedications", {
      userId: user._id,
      ...args,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

// Update a medication
export const updateMedication = mutation({
  args: {
    medicationId: v.id("userMedications"),
    name: v.optional(v.string()),
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
    currentlyTaking: v.optional(v.boolean()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const { medicationId, ...updateData } = args;

    // Verify the medication belongs to the current user
    const medication = await ctx.db.get(medicationId);
    if (!medication) {
      throw new Error("Medication not found");
    }

    const userId = identity.subject.split('|')[0];
    const user = await ctx.db.get(userId as Id<"users">);

    if (!user || medication.userId !== user._id) {
      throw new Error("Not authorized to update this medication");
    }

    return await ctx.db.patch(medicationId, {
      ...updateData,
      updatedAt: Date.now(),
    });
  },
});

// Delete a medication
export const deleteMedication = mutation({
  args: {
    medicationId: v.id("userMedications"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    // Verify the medication belongs to the current user
    const medication = await ctx.db.get(args.medicationId);
    if (!medication) {
      throw new Error("Medication not found");
    }

    const userId = identity.subject.split('|')[0];
    const user = await ctx.db.get(userId as Id<"users">);

    if (!user || medication.userId !== user._id) {
      throw new Error("Not authorized to delete this medication");
    }

    return await ctx.db.delete(args.medicationId);
  },
});
