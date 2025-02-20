import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const get = query(async ({ db }) => {
  return await db.query("animes").collect();
});

export const add = mutation({
  args: {
    title: v.string(),
    rating: v.optional(v.number()),
    isRecommendation: v.boolean(),
    inProgress: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("animes", args);
  },
});

export const moveToWatched = mutation({
  args: {
    id: v.id("animes"),
    rating: v.optional(v.number()),
    inProgress: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      isRecommendation: false,
      rating: args.rating,
      inProgress: args.inProgress || false,
    });
  },
});
