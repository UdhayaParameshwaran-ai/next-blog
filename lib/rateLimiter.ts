import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export async function rateLimit(
  key: string,
  limit: number,
  windowSeconds: number
) {
  const current = await redis.incr(key);

  if (current === 1) {
    await redis.expire(key, windowSeconds);
  }

  if (current > limit) {
    throw new Error("Too many sign-in attempts. Please try again later.");
  }
}
