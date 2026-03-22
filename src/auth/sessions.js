import session from 'express-session';
import { RedisStore } from 'connect-redis';
import { createClient } from 'redis';

const redisClient = createClient({
	socket: {
		host: process.env.REDIS_HOST || 'localhost',
		port: Number(process.env.REDIS_PORT || 6379)
	}
});

redisClient.on('error', (err) => console.error('Redis client error:', err));

await redisClient.connect();

const sessionMiddleware = session({
	store: new RedisStore({ client: redisClient }),
	secret: process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: false,
	cookie: {
		httpOnly: true,
		secure: false,
		maxAge: 1000 * 60 * 60 * 24   // 24 hours
	}
});

export { redisClient, sessionMiddleware };
