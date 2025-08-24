import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";

// Get current user's routine products
export const getUserRoutineProducts = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const userId = identity.subject.split('|')[0];
    const user = await ctx.db.get(userId as Id<"users">);

    if (!user) return null;

    return await ctx.db
      .query("userRoutineProducts")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .collect();
  },
});

// Add a new routine product
export const addRoutineProduct = mutation({
  args: {
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
    ingredientList: v.optional(v.array(v.string())),
    fragranced: v.optional(v.boolean()),
    startedAt: v.optional(v.number()),
    active: v.boolean(),
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

    return await ctx.db.insert("userRoutineProducts", {
      userId: user._id,
      ...args,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

// Update a routine product
export const updateRoutineProduct = mutation({
  args: {
    productId: v.id("userRoutineProducts"),
    role: v.optional(
      v.union(
        v.literal("cleanser"),
        v.literal("moisturizer"),
        v.literal("treatment"),
        v.literal("serum"),
        v.literal("sunscreen"),
        v.literal("makeup"),
        v.literal("hair_product"),
        v.literal("other")
      )
    ),
    name: v.optional(v.string()),
    leaveOn: v.optional(v.boolean()),
    ingredientList: v.optional(v.array(v.string())),
    fragranced: v.optional(v.boolean()),
    startedAt: v.optional(v.number()),
    active: v.optional(v.boolean()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const { productId, ...updateData } = args;

    // Verify the product belongs to the current user
    const product = await ctx.db.get(productId);
    if (!product) {
      throw new Error("Product not found");
    }

    const userId = identity.subject.split('|')[0];
    const user = await ctx.db.get(userId as Id<"users">);

    if (!user || product.userId !== user._id) {
      throw new Error("Not authorized to update this product");
    }

    return await ctx.db.patch(productId, {
      ...updateData,
      updatedAt: Date.now(),
    });
  },
});

// Delete a routine product
export const deleteRoutineProduct = mutation({
  args: {
    productId: v.id("userRoutineProducts"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    // Verify the product belongs to the current user
    const product = await ctx.db.get(args.productId);
    if (!product) {
      throw new Error("Product not found");
    }

    const userId = identity.subject.split('|')[0];
    const user = await ctx.db.get(userId as Id<"users">);

    if (!user || product.userId !== user._id) {
      throw new Error("Not authorized to delete this product");
    }

    return await ctx.db.delete(args.productId);
  },
});
