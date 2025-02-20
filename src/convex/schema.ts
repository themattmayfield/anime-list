import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  animes: defineTable({
    title: v.string(),
    rating: v.optional(v.number()),
    isRecommendation: v.boolean(),
    inProgress: v.optional(v.boolean()),
  }),
});
