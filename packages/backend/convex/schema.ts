import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const role = v.union(
  v.literal("admin"),
  v.literal("coordinator"),
  v.literal("teacher"),
  v.literal("student"),
  v.literal("business-mentor"),
);

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    createdAt: v.number(),
    role: v.optional(role),
    className: v.optional(v.string()),
    company: v.optional(v.string()),
    status: v.optional(v.union(v.literal("active"), v.literal("inactive"))),
    requestedAt: v.optional(v.number()),
  })
    .index("by_clerk_id", ["clerkId"])
    .index("by_role", ["role"]),
  invitations: defineTable({
    email: v.string(),
    role,
    name: v.optional(v.string()),
    className: v.optional(v.string()),
    company: v.optional(v.string()),
  }).index("by_email", ["email"]),
});
