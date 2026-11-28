import { v } from "convex/values";
import { internal } from "./_generated/api";
import {
  internalAction,
  internalMutation,
  internalQuery,
  mutation,
  query,
} from "./_generated/server";
import { getAccount, recordActivity, requireAdmin } from "./users";

const MAX_RUN_MS = 5 * 60 * 1000;

export const history = query({
  args: {},
  handler: async (ctx) => {
    const { user } = await getAccount(ctx);
    if (user?.role !== "admin" || user.status === "inactive") return [];
    const backups = await ctx.db.query("backups").order("desc").take(50);
    return backups.map(({ _id, _creationTime, status, bytes }) => ({
      id: _id,
      at: new Date(_creationTime).toISOString(),
      status,
      bytes,
    }));
  },
});

export const start = mutation({
  args: {},
  handler: async (ctx) => {
    const admin = await requireAdmin(ctx);
    const running = await ctx.db
      .query("backups")
      .withIndex("by_status", (q) => q.eq("status", "running"))
      .first();
    if (running) return running._id;

    const id = await ctx.db.insert("backups", {
      status: "running",
      requestedBy: admin._id,
    });
    await ctx.scheduler.runAfter(0, internal.backups.run, { id });
    await ctx.scheduler.runAfter(MAX_RUN_MS, internal.backups.fail, { id });
    return id;
  },
});

export const download = query({
  args: { id: v.id("backups") },
  handler: async (ctx, { id }) => {
    const { user } = await getAccount(ctx);
    if (user?.role !== "admin" || user.status === "inactive") return null;
    const backup = await ctx.db.get(id);
    if (backup?.status !== "complete" || !backup.storageId) return null;
    const url = await ctx.storage.getUrl(backup.storageId);
    if (!url) return null;
    return { url, at: backup._creationTime };
  },
});

export const snapshot = internalQuery({
  args: { id: v.id("backups") },
  handler: async (ctx, { id }) => {
    const backup = await ctx.db.get(id);
    if (backup?.status !== "running") return null;
    const [users, invitations, adminActivity] = await Promise.all([
      ctx.db.query("users").collect(),
      ctx.db.query("invitations").collect(),
      ctx.db.query("adminActivity").collect(),
    ]);
    return {
      formatVersion: 1,
      createdAt: new Date().toISOString(),
      tables: { users, invitations, adminActivity },
    };
  },
});

export const run = internalAction({
  args: { id: v.id("backups") },
  handler: async (ctx, { id }) => {
    try {
      const snapshot = await ctx.runQuery(internal.backups.snapshot, { id });
      if (!snapshot) return;
      const archive = new Blob([JSON.stringify(snapshot)], {
        type: "application/json",
      });
      const storageId = await ctx.storage.store(archive);
      await ctx.runMutation(internal.backups.complete, {
        id,
        storageId,
        bytes: archive.size,
      });
    } catch {
      await ctx.runMutation(internal.backups.fail, { id });
    }
  },
});

export const complete = internalMutation({
  args: { id: v.id("backups"), storageId: v.id("_storage"), bytes: v.number() },
  handler: async (ctx, { id, storageId, bytes }) => {
    const backup = await ctx.db.get(id);
    if (backup?.status !== "running") {
      if (backup?.storageId !== storageId) await ctx.storage.delete(storageId);
      return;
    }
    await ctx.db.patch(id, { status: "complete", storageId, bytes });
    const admin = await ctx.db.get(backup.requestedBy);
    if (admin)
      await recordActivity(ctx, admin, "ran-backup", "Manual snapshot");
  },
});

export const fail = internalMutation({
  args: { id: v.id("backups") },
  handler: async (ctx, { id }) => {
    const backup = await ctx.db.get(id);
    if (backup?.status === "running")
      await ctx.db.patch(id, { status: "failed" });
  },
});
