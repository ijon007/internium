"use server";

import { randomBytes } from "node:crypto";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { api } from "@internium/backend/convex/_generated/api";
import { fetchMutation, fetchQuery } from "convex/nextjs";
import type { FunctionArgs } from "convex/server";

type Profile = NonNullable<
  FunctionArgs<typeof api.users.updateAccount>["profile"]
>;
type AccountId = FunctionArgs<typeof api.users.managedAccount>["id"];

async function adminContext() {
  const session = await auth();
  const token =
    session.userId && (await session.getToken({ template: "convex" }));
  if (!token) throw new Error("Administrator access required");
  const options = { token };
  const admin = await fetchQuery(api.users.current, {}, options);
  if (admin?.role !== "admin" || admin.status === "inactive") {
    throw new Error("Administrator access required");
  }
  return { admin, options, clerk: await clerkClient() };
}

function normalizedProfile(profile: Profile) {
  const name = profile.name.trim();
  const email = profile.email.trim().toLowerCase();
  if (
    !name ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    email.length > 254
  ) {
    throw new Error("A name and valid email are required");
  }
  return {
    name,
    email,
    role: profile.role,
    className: profile.role === "student" ? profile.className : undefined,
    company:
      profile.role === "business-mentor" ? profile.company?.trim() : undefined,
  };
}

function temporaryPassword() {
  return `T9!${randomBytes(24).toString("base64url")}`;
}

export async function addManagedUser(draft: Profile, invitation: boolean) {
  const { clerk, options } = await adminContext();
  const profile = normalizedProfile(draft);

  if (invitation) {
    const existing = await clerk.users.getUserList({
      emailAddress: [profile.email],
      limit: 1,
    });
    if (existing.data.length)
      throw new Error("That email already has a Clerk account");
    await fetchMutation(api.users.provision, profile, options);
    await clerk.invitations.createInvitation({ emailAddress: profile.email });
    return null;
  }

  const password = temporaryPassword();
  const user = await clerk.users.createUser({
    emailAddress: [profile.email],
    password,
  });
  try {
    await clerk.users.setPasswordCompromised(user.id);
    await fetchMutation(
      api.users.provision,
      { ...profile, clerkId: user.id },
      options,
    );
  } catch (error) {
    await clerk.users.deleteUser(user.id);
    throw error;
  }
  return { email: profile.email, password };
}

export async function editManagedUser(id: AccountId, draft: Profile) {
  const { admin, clerk, options } = await adminContext();
  const profile = normalizedProfile(draft);
  const account = await fetchQuery(api.users.managedAccount, { id }, options);
  if (!account?.role || (id === admin._id && profile.role !== "admin")) {
    throw new Error("Account cannot be edited");
  }

  const clerkUser = await clerk.users.getUser(account.clerkId);
  const address = clerkUser.emailAddresses.find(
    ({ emailAddress }) => emailAddress.toLowerCase() === profile.email,
  );
  let requiresVerification = false;
  if (address?.id !== clerkUser.primaryEmailAddressId || !address) {
    if (address?.verification?.status === "verified") {
      await clerk.emailAddresses.updateEmailAddress(address.id, {
        primary: true,
      });
    } else {
      if (!address) {
        await clerk.emailAddresses.createEmailAddress({
          userId: account.clerkId,
          emailAddress: profile.email,
        });
      }
      requiresVerification = true;
    }
  }
  await fetchMutation(api.users.updateAccount, { id, profile }, options);
  return { requiresVerification };
}

export async function setManagedUserStatus(
  id: AccountId,
  status: "active" | "inactive",
) {
  const { admin, clerk, options } = await adminContext();
  const account = await fetchQuery(api.users.managedAccount, { id }, options);
  if (!account?.role || id === admin._id)
    throw new Error("Account cannot be changed");
  if (status === "inactive") {
    await fetchMutation(api.users.updateAccount, { id, status }, options);
    await clerk.users.banUser(account.clerkId);
  } else {
    await clerk.users.unbanUser(account.clerkId);
    await fetchMutation(api.users.updateAccount, { id, status }, options);
  }
}

export async function resetManagedPassword(id: AccountId) {
  const { clerk, options } = await adminContext();
  const account = await fetchQuery(api.users.managedAccount, { id }, options);
  if (!account?.role || account.status === "inactive")
    throw new Error("Account cannot be reset");
  const password = temporaryPassword();
  const clerkUser = await clerk.users.updateUser(account.clerkId, {
    password,
    signOutOfOtherSessions: true,
  });
  await clerk.users.setPasswordCompromised(account.clerkId);
  return {
    email: clerkUser.primaryEmailAddress?.emailAddress ?? account.email,
    password,
  };
}
