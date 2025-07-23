const redis = require('redis');

let redisClient = null;

const createRedisClient = async () => {
  if (redisClient) return redisClient;

  const client = redis.createClient({
    socket: {
      host: process.env.REDIS_HOST || '127.0.0.1',
      port: process.env.REDIS_PORT || 6379
    }
  });

  try {
    console.log('Redis 연결 시도');
    await client.connect();
    console.log('Redis 연결 성공');
    redisClient = client;
    return client;
  } catch (err) {
    console.error('Redis 연결 실패:', err);
    throw err;
  }
};

const getRedisClient = () => redisClient;

module.exports = {
  redis,
  createRedisClient,
  getRedisClient
};
