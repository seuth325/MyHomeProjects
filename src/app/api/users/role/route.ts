import { auth, currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { role } = await req.json();
  if (role !== 'HOMEOWNER' && role !== 'HANDYMAN') {
    return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
  }

  // Upsert the user so this works even when the Clerk webhook hasn't fired yet
  // (e.g. in local dev without ngrok)
  const clerkUser = await currentUser();
  const email = clerkUser?.emailAddresses?.[0]?.emailAddress ?? '';
  const name = [clerkUser?.firstName, clerkUser?.lastName].filter(Boolean).join(' ') || 'New User';

  const user = await prisma.user.upsert({
    where: { clerkId: userId },
    update: { role },
    create: { clerkId: userId, email, name, role },
  });

  // Ensure a blank HandymanProfile exists for handymen
  if (role === 'HANDYMAN') {
    await prisma.handymanProfile.upsert({
      where: { userId: user.id },
      update: {},
      create: { userId: user.id, skills: [], serviceRadius: 25 },
    });
  }

  return NextResponse.json(user);
}
