import { NextRequest, NextResponse } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

export const config = {
  matcher: '/api/:path*',
};

// Construct the limiter defensively: Redis.fromEnv() throws when the Upstash
// env vars are missing, and we don't want that to crash every /api/* request at
// module load. If it can't be built we fall back to null and fail open below.
function createRatelimit(): Ratelimit | null {
  try {
    return new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(2, '30 s'),
      analytics: true,
      prefix: '@upstash/ratelimit',
    });
  } catch (error) {
    console.error('Failed to initialise rate limiter, disabling it:', error);
    return null;
  }
}

export const ratelimit = createRatelimit();

export default async function proxy(request: NextRequest) {
  // Get the User's IP to use as the unique identifier
  let ip = '127.0.0.1';
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');

  if (forwardedFor) {
    ip = forwardedFor.split(',')[0].trim();
  } else if (realIp) {
    ip = realIp.trim();
  }

  // Rate Limit check. Fail open: if the limiter couldn't be initialised, or the
  // call itself errors (e.g. Upstash is unreachable), we allow the request
  // through so a limiter outage can't take down the contact and proefles forms.
  if (!ratelimit) {
    return NextResponse.next();
  }

  let success: boolean;
  let limit: number;
  let reset: number;
  let remaining: number;

  try {
    ({ success, limit, reset, remaining } = await ratelimit.limit(ip));
  } catch (error) {
    console.error('Rate limiter unavailable, allowing request:', error);
    return NextResponse.next();
  }

  const res = success
    ? NextResponse.next()
    : NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });

  // Add standard Rate Limit headers so the client knows their status
  res.headers.set('X-RateLimit-Limit', limit.toString());
  res.headers.set('X-RateLimit-Remaining', remaining.toString());
  res.headers.set('X-RateLimit-Reset', reset.toString());

  return res;
}
