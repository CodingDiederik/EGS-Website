import { NextRequest, NextResponse } from 'next/server';
import { ratelimit } from '@/lib/ratelimit';

export const config = {
  // Only run the middleware on API routes
  matcher: '/api/:path*',
};

export default async function proxy(request: NextRequest) {
  // Get the User's IP to use as the unique identifier
  let ip = '127.0.0.1';
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');

  if (forwardedFor) {
    // The first one is the client.
    ip = forwardedFor.split(',')[0].trim();
  } else if (realIp) {
    ip = realIp.trim();
  }

  // Rate Limit check
  const { success, limit, reset, remaining } = await ratelimit.limit(ip);

  const res = success
    ? NextResponse.next()
    : NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });

  // Add standard Rate Limit headers so the client knows their status
  res.headers.set('X-RateLimit-Limit', limit.toString());
  res.headers.set('X-RateLimit-Remaining', remaining.toString());
  res.headers.set('X-RateLimit-Reset', reset.toString());

  return res;
}
