type RateLimitEntry = {
  count: number;
  resetAt: number;
};

type RateLimitConfig = {
  maxRequests: number;
  windowMs: number;
};

const rateLimitStore = new Map<string, RateLimitEntry>();

export function getClientIp(requestHeaders: Headers): string {
  const forwardedFor = requestHeaders.get('x-forwarded-for');
  if (forwardedFor) {
    const firstIp = forwardedFor.split(',')[0]?.trim();
    if (firstIp) {
      return firstIp;
    }
  }

  const realIp = requestHeaders.get('x-real-ip');
  if (realIp) {
    return realIp;
  }

  return 'unknown';
}

export function checkRateLimit(
  key: string,
  { maxRequests, windowMs }: RateLimitConfig
) {
  const now = Date.now();

  const existing = rateLimitStore.get(key);

  if (!existing || now > existing.resetAt) {
    rateLimitStore.set(key, {
      count: 1,
      resetAt: now + windowMs,
    });

    return {
      allowed: true,
      remaining: maxRequests - 1,
      resetAt: now + windowMs,
    };
  }

  if (existing.count >= maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: existing.resetAt,
    };
  }

  existing.count += 1;
  rateLimitStore.set(key, existing);

  return {
    allowed: true,
    remaining: maxRequests - existing.count,
    resetAt: existing.resetAt,
  };
}
