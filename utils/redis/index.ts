import { createClient } from "redis";

let redisClient: ReturnType<typeof createClient>;

export const getRedisClient = async () => {
  if (redisClient) return redisClient;
  redisClient = createClient({
    username: "default",
    password: process.env.REDIS_PASSWORD!,
    socket: {
      host: "redis-17187.c294.ap-northeast-1-2.ec2.redns.redis-cloud.com",
      port: 17187,
    },
  });
  redisClient.on("error", (err) => {
    console.error("Redis error:", err);
  });
  await redisClient.connect();
  return redisClient;
};

export const closeRedisClient = async () => {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
  }
};
