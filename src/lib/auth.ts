import { auth, currentUser } from '@clerk/nextjs/server';
import { prisma } from './db';
import type { User, HandymanProfile } from '@prisma/client';

export type UserWithProfile = User & { handymanProfile: HandymanProfile | null };

/** Returns the DB User row for the currently authenticated Clerk session, or null. */
export async function getCurrentUser(): Promise<UserWithProfile | null> {
  const { userId } = await auth();
  if (!userId) return null;
  return prisma.user.findUnique({
    where: { clerkId: userId },
    include: { handymanProfile: true },
  });
}

/** Like getCurrentUser() but throws 401 if not authenticated. */
export async function requireUser(): Promise<UserWithProfile> {
  const user = await getCurrentUser();
  if (!user) throw new Error('Unauthorized');
  return user;
}

/** Convenience: returns just the role, or null if not authenticated. */
export async function getCurrentRole() {
  const user = await getCurrentUser();
  return user?.role ?? null;
}
