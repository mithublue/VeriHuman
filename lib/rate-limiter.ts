import { prisma } from '@/lib/prisma';

export interface RateLimitResult {
    allowed: boolean;
    remaining: number;
    resetIn: number; // seconds
    queueWait: number; // seconds
    message?: string;
}

export async function checkRateLimit(
    userId: string,
    action: 'humanize' | 'detect',
    tier: 'free' | 'pro' | 'enterprise' = 'free'
): Promise<RateLimitResult> {

    // Enterprise = higher limits (still reasonable for free APIs)
    if (tier === 'enterprise') {
        return {
            allowed: true,
            remaining: 100,
            resetIn: 0,
            queueWait: 0
        };
    }

    // Conservative limits for free API tiers
    const limits = {
        free: {
            perMinute: 1,      // Only 1 request per minute
            perHour: 10,       // 10 requests per hour max
            cooldown: 30,      // 30 seconds between requests
            queueWait: 5       // 5 second queue wait
        },
        pro: {
            perMinute: 3,      // 3 requests per minute
            perHour: 30,       // 30 requests per hour
            cooldown: 10,      // 10 seconds between requests
            queueWait: 2       // 2 second queue wait
        }
    };

    const limit = limits[tier];
    const now = new Date();
    const oneMinuteAgo = new Date(now.getTime() - 60 * 1000);
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    // Check per-minute limit (most important for free APIs)
    const minuteCount = await prisma.rateLimit.count({
        where: {
            userId,
            action,
            timestamp: { gte: oneMinuteAgo }
        }
    });

    if (minuteCount >= limit.perMinute) {
        const oldestRequest = await prisma.rateLimit.findFirst({
            where: { userId, action, timestamp: { gte: oneMinuteAgo } },
            orderBy: { timestamp: 'asc' }
        });

        const resetIn = oldestRequest
            ? Math.ceil((oldestRequest.timestamp.getTime() + 60 * 1000 - now.getTime()) / 1000)
            : 60;

        return {
            allowed: false,
            remaining: 0,
            resetIn,
            queueWait: 0,
            message: `Rate limit: ${limit.perMinute} request per minute. Please wait ${resetIn} seconds.`
        };
    }

    // Check hourly limit
    const hourlyCount = await prisma.rateLimit.count({
        where: {
            userId,
            action,
            timestamp: { gte: oneHourAgo }
        }
    });

    if (hourlyCount >= limit.perHour) {
        const oldestRequest = await prisma.rateLimit.findFirst({
            where: { userId, action, timestamp: { gte: oneHourAgo } },
            orderBy: { timestamp: 'asc' }
        });

        const resetIn = oldestRequest
            ? Math.ceil((oldestRequest.timestamp.getTime() + 60 * 60 * 1000 - now.getTime()) / 1000)
            : 3600;

        return {
            allowed: false,
            remaining: 0,
            resetIn,
            queueWait: 0,
            message: `Hourly limit reached (${limit.perHour}/hour). Try again in ${Math.ceil(resetIn / 60)} minutes.`
        };
    }

    // Check cooldown (30 seconds between requests for free tier)
    const lastRequest = await prisma.rateLimit.findFirst({
        where: { userId, action },
        orderBy: { timestamp: 'desc' }
    });

    if (lastRequest) {
        const timeSinceLastRequest = (now.getTime() - lastRequest.timestamp.getTime()) / 1000;

        if (timeSinceLastRequest < limit.cooldown) {
            const waitTime = Math.ceil(limit.cooldown - timeSinceLastRequest);
            return {
                allowed: false,
                remaining: limit.perHour - hourlyCount,
                resetIn: waitTime,
                queueWait: 0,
                message: `Please wait ${waitTime} seconds before next request (${limit.cooldown}s cooldown).`
            };
        }
    }

    // Record this request
    await prisma.rateLimit.create({
        data: {
            userId,
            action,
            timestamp: now
        }
    });

    return {
        allowed: true,
        remaining: limit.perHour - hourlyCount - 1,
        resetIn: 3600,
        queueWait: limit.queueWait
    };
}

// Track API usage for analytics
export async function trackApiUsage(
    userId: string,
    action: 'humanize' | 'detect',
    provider: string,
    wordCount: number,
    success: boolean
) {
    await prisma.apiUsage.create({
        data: {
            userId,
            action,
            provider,
            wordCount,
            success,
            timestamp: new Date()
        }
    });
}

// Clean up old rate limit records (run periodically)
export async function cleanupOldRateLimits() {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    await prisma.rateLimit.deleteMany({
        where: {
            timestamp: { lt: oneDayAgo }
        }
    });
}
