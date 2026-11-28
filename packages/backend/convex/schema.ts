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
    phone: v.optional(v.string()),
    createdAt: v.number(),
    role: v.optional(role),
    className: v.optional(v.string()),
    company: v.optional(v.string()),
    status: v.optional(v.union(v.literal("active"), v.literal("inactive"))),
    requestedAt: v.optional(v.number()),
  })
    .index("by_clerk_id", ["clerkId"])
    .index("by_role", ["role"]),
  adminActivity: defineTable({
    actor: v.string(),
    actorId: v.id("users"),
    action: v.union(
      v.literal("created-user"),
      v.literal("changed-role"),
      v.literal("reset-password"),
      v.literal("deactivated-user"),
      v.literal("reactivated-user"),
      v.literal("updated-user"),
      v.literal("invited-user"),
      v.literal("approved-request"),
      v.literal("ran-backup"),
    ),
    target: v.string(),
  }),
  backups: defineTable({
    status: v.union(
      v.literal("running"),
      v.literal("complete"),
      v.literal("failed"),
    ),
    requestedBy: v.id("users"),
    storageId: v.optional(v.id("_storage")),
    bytes: v.optional(v.number()),
  }).index("by_status", ["status"]),
  invitations: defineTable({
    email: v.string(),
    role,
    name: v.optional(v.string()),
    className: v.optional(v.string()),
    company: v.optional(v.string()),
  }).index("by_email", ["email"]),
});
