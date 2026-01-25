import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function GET(request: Request) {
  // Security: Only allow Vercel Cron to trigger this
  // Vercel automatically sends this header when running a cron job
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    // Write a timestamp to a key.
    const timestamp = new Date().toISOString();
    await redis.set('system:keep-alive', timestamp);

    return NextResponse.json({ success: true, timestamp });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Redis connection failed' },
      { status: 500 },
    );
  }
}
