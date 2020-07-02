import { Request, Response, NextFunction } from 'express';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import redis from 'redis';
import AppError from '@shared/errors/AppError';

const redisClient = redis.createClient({
	host: process.env.REDIS_HOST,
	port: Number(process.env.REDIS_PORT),
	password: process.env.REDIS_PASS || undefined,
});

const rateLimiterRedis = new RateLimiterRedis({
	storeClient: redisClient,
	keyPrefix: 'rateLimite',
	points: 5, // 5 requests
	duration: 1, // per 1 second by IP
	blockDuration: 10,
});
export default async function rateLimiter(
	request: Request,
	response: Response,
	next: NextFunction,
): Promise<void> {
	try {
		await rateLimiterRedis.consume(request.ip);
		next();
	} catch {
		throw new AppError('Too many requests', 429);
	}
}
