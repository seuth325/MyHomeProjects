import { headers } from 'next/headers';
import { Webhook } from 'svix';
import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

interface ClerkEmailAddress {
  email_address: string;
  id: string;
}

interface ClerkUserEvent {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email_addresses: ClerkEmailAddress[];
}

export async function POST(req: Request) {
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return new NextResponse('Webhook secret not configured', { status: 500 });
  }

  const headerPayload = await headers();
  const svixId        = headerPayload.get('svix-id');
  const svixTimestamp = headerPayload.get('svix-timestamp');
  const svixSignature = headerPayload.get('svix-signature');

  if (!svixId || !svixTimestamp || !svixSignature) {
    return new NextResponse('Missing svix headers', { status: 400 });
  }

  const payload = await req.text();
  const wh = new Webhook(webhookSecret);

  let evt: { type: string; data: ClerkUserEvent };
  try {
    evt = wh.verify(payload, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    }) as { type: string; data: ClerkUserEvent };
  } catch {
    return new NextResponse('Invalid signature', { status: 400 });
  }

  const { type, data } = evt;
  const primaryEmail = data.email_addresses?.[0]?.email_address ?? '';
  const fullName = [data.first_name, data.last_name].filter(Boolean).join(' ') || 'New User';

  try {
    if (type === 'user.created') {
      await prisma.user.create({
        data: {
          clerkId: data.id,
          email: primaryEmail,
          name: fullName,
          role: 'HOMEOWNER', // updated via /api/users/role after onboarding
        },
      });
    }

    if (type === 'user.updated') {
      await prisma.user.update({
        where: { clerkId: data.id },
        data: { email: primaryEmail, name: fullName },
      });
    }

    if (type === 'user.deleted') {
      await prisma.user.deleteMany({ where: { clerkId: data.id } });
    }
  } catch (err) {
    console.error('Clerk webhook DB error:', err);
    return new NextResponse('Database error', { status: 500 });
  }

  return new NextResponse('OK', { status: 200 });
}
