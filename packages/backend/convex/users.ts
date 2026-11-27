import { v } from "convex/values";
import {
  type MutationCtx,
  mutation,
  type QueryCtx,
  query,
} from "./_generated/server";
import { role } from "./schema";

async function getAccount(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  const user = identity
    ? await ctx.db
        .query("users")
        .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
        .unique()
    : null;
  return { identity, user };
}

async function requireAdmin(ctx: QueryCtx | MutationCtx) {
  const { user } = await getAccount(ctx);
  if (user?.role !== "admin" || user.status === "inactive")
    throw new Error("Administrator access required");
}

export const store = mutation({
  args: {},
  handler: async (ctx) => {
    const { identity, user } = await getAccount(ctx);
    if (!identity) throw new Error("Not authenticated");

    const email = identity.email?.trim().toLowerCase() ?? "";
    let assignedRole = user?.role;
    let name = user?.name ?? identity.name;
    let className = user?.className;
    let company = user?.company;
    if (!assignedRole && email && identity.emailVerified === true) {
      const bootstrapEmail =
        process.env.INTERNIUM_BOOTSTRAP_ADMIN_EMAIL?.trim().toLowerCase();
      if (email === bootstrapEmail) {
        const admin = await ctx.db
          .query("users")
          .withIndex("by_role", (q) => q.eq("role", "admin"))
          .first();
        if (!admin) assignedRole = "admin";
      }
      if (!assignedRole) {
        const invitation = await ctx.db
          .query("invitations")
          .withIndex("by_email", (q) => q.eq("email", email))
          .unique();
        if (invitation) {
          assignedRole = invitation.role;
          name = invitation.name ?? name;
          className = invitation.className;
          company = invitation.company;
          await ctx.db.delete(invitation._id);
        }
      }
    }

    const profile = {
      email: user?.role ? user.email : email,
      name,
      className,
      company,
      imageUrl: identity.pictureUrl,
      role: assignedRole,
    };
    if (user) {
      await ctx.db.patch(user._id, profile);
      return user._id;
    }
    return await ctx.db.insert("users", {
      ...profile,
      clerkId: identity.subject,
      createdAt: Date.now(),
    });
  },
});

export const current = query({
  args: {},
  handler: async (ctx) => (await getAccount(ctx)).user,
});

export const requestAccess = mutation({
  args: {},
  handler: async (ctx) => {
    const { identity, user } = await getAccount(ctx);
    if (!user || identity?.emailVerified !== true || !identity.email) {
      throw new Error("A verified email is required");
    }
    if (!user.role && user.requestedAt === undefined) {
      await ctx.db.patch(user._id, { requestedAt: Date.now() });
    }
  },
});

export const accessQueue = query({
  args: {},
  handler: async (ctx) => {
    const { user } = await getAccount(ctx);
    if (user?.role !== "admin" || user.status === "inactive") return null;
    const users = await ctx.db
      .query("users")
      .withIndex("by_role", (q) => q.eq("role", undefined))
      .collect();
    return {
      requests: users.filter((user) => user.requestedAt !== undefined),
      invitations: await ctx.db.query("invitations").collect(),
    };
  },
});

export const invite = mutation({
  args: { entries: v.array(v.object({ email: v.string(), role })) },
  handler: async (ctx, { entries }) => {
    await requireAdmin(ctx);
    if (entries.length < 1 || entries.length > 100)
      throw new Error("Enter 1 to 100 invitations");
    const seen = new Set<string>();
    for (const entry of entries) {
      const email = entry.email.trim().toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
        throw new Error("Enter valid email addresses");
      }
      if (seen.has(email))
        throw new Error("Each email can appear only once per batch");
      seen.add(email);
      const invitation = await ctx.db
        .query("invitations")
        .withIndex("by_email", (q) => q.eq("email", email))
        .unique();
      if (invitation) await ctx.db.patch(invitation._id, { role: entry.role });
      else await ctx.db.insert("invitations", { email, role: entry.role });
    }
  },
});

export const approve = mutation({
  args: { userId: v.id("users"), role },
  handler: async (ctx, { userId, role }) => {
    await requireAdmin(ctx);
    const user = await ctx.db.get(userId);
    if (!user || user.role || user.requestedAt === undefined) {
      throw new Error("This account has no pending request");
    }
    await ctx.db.patch(userId, { role, requestedAt: undefined });
  },
});

const profileFields = {
  name: v.string(),
  email: v.string(),
  role,
  className: v.optional(v.string()),
  company: v.optional(v.string()),
};
const status = v.union(v.literal("active"), v.literal("inactive"));

export const directory = query({
  args: {},
  handler: async (ctx) => {
    const { user } = await getAccount(ctx);
    if (user?.role !== "admin" || user.status === "inactive") return null;
    const accounts = await ctx.db.query("users").order("desc").collect();
    return accounts.flatMap((account) =>
      account.role
        ? [
            {
              id: account._id,
              name: account.name || account.email,
              email: account.email,
              role: account.role,
              status: account.status ?? ("active" as const),
              createdAt: account.createdAt,
              className: account.className,
              company: account.company,
            },
          ]
        : [],
    );
  },
});

export const managedAccount = query({
  args: { id: v.id("users") },
  handler: async (ctx, { id }) => {
    await requireAdmin(ctx);
    return await ctx.db.get(id);
  },
});

export const provision = mutation({
  args: { ...profileFields, clerkId: v.optional(v.string()) },
  handler: async (ctx, { clerkId, ...profile }) => {
    await requireAdmin(ctx);
    const email = normalizeEmail(profile.email);
    if (clerkId) {
      const existing = await ctx.db
        .query("users")
        .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
        .unique();
      if (existing) {
        await ctx.db.patch(existing._id, { ...profile, email });
      } else {
        await ctx.db.insert("users", {
          ...profile,
          email,
          clerkId,
          createdAt: Date.now(),
        });
      }
      const invitation = await ctx.db
        .query("invitations")
        .withIndex("by_email", (q) => q.eq("email", email))
        .unique();
      if (invitation) await ctx.db.delete(invitation._id);
      return;
    }
    const invitation = await ctx.db
      .query("invitations")
      .withIndex("by_email", (q) => q.eq("email", email))
      .unique();
    if (invitation) await ctx.db.patch(invitation._id, { ...profile, email });
    else await ctx.db.insert("invitations", { ...profile, email });
  },
});

export const updateAccount = mutation({
  args: {
    id: v.id("users"),
    profile: v.optional(v.object(profileFields)),
    role: v.optional(role),
    status: v.optional(status),
  },
  handler: async (ctx, { id, profile, role: nextRole, status: nextStatus }) => {
    await requireAdmin(ctx);
    const { user: self } = await getAccount(ctx);
    const user = await ctx.db.get(id);
    if (!user?.role) throw new Error("Account not found");
    const targetRole = profile?.role ?? nextRole ?? user.role;
    if (
      id === self?._id &&
      (targetRole !== "admin" || nextStatus === "inactive")
    ) {
      throw new Error(
        "You cannot deactivate or remove administrator access from your own account",
      );
    }
    if (profile) {
      await ctx.db.patch(id, {
        ...profile,
        email: normalizeEmail(profile.email),
        className: profile.role === "student" ? profile.className : undefined,
        company:
          profile.role === "business-mentor" ? profile.company : undefined,
        role: targetRole,
      });
    } else {
      await ctx.db.patch(id, {
        role: targetRole,
        status: nextStatus ?? user.status,
        className: targetRole === "student" ? user.className : undefined,
        company: targetRole === "business-mentor" ? user.company : undefined,
      });
    }
  },
});

function normalizeEmail(value: string) {
  const email = value.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    throw new Error("Enter a valid email address");
  }
  return email;
}
