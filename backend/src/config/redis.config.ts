import Redis from "ioredis";

export const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
    
  retryStrategy: (times) => {
    if (times >= 5) {
      console.error("Redis retry limit reached. No more attempts.");
      return null; 
    }
    const delay = 3000;
    console.warn(
      `Redis reconnect attempt #${times}, retrying in ${delay}ms...`
    );
    return delay;
  },
});

// Handle connection errors
redis.on('error', (err) => {
    console.error('Redis Client Error', err);
});


redis.on('connect', () => {
    console.log('Connected to Redis');
});
