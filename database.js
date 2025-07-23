const mongoose = require('mongoose');
const redis = require('redis');
const cron = require('node-cron');
const { Post } = require('./model');

// MongoDB 연결 함수
const connectMongo = async () => {
  try {
    console.log('MongoDB 연결 시도');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB 연결 성공');
  } catch (err) {
    console.error('MongoDB 연결 실패:', err);
    throw err;
  }
};

let redisClient = null;

// Redis 연결 함수
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

// Redis likes -> MongoDB 동기화 작업 (1분마다)
cron.schedule('* * * * *', async () => {
  if (!redisClient) return;
  try {
    const posts = await Post.find({}, '_id');
    for (const post of posts) {
      const redisLikes = await redisClient.get(`post:likes:${post._id}`);
      if (redisLikes !== null) {
        await Post.findByIdAndUpdate(post._id, { likes: parseInt(redisLikes, 10) });
      }
    }
    console.log('Redis likes → MongoDB 동기화 완료');
  } catch (err) {
    console.error('Redis likes → MongoDB 동기화 실패:', err);
  }
});

// 매일 00:00에 Redis의 모든 키를 삭제 (전체 캐시 리셋)
cron.schedule('0 0 * * *', async () => {
  if (!redisClient) return;
  try {
    const keys = await redisClient.keys('*');
    if (keys.length > 0) {
      await redisClient.del(keys);
      console.log('매일 00:00 Redis 전체 캐시 리셋 완료');
    }
  } catch (err) {
    console.error('00:00 Redis 전체 캐시 리셋 실패:', err);
  }
});

module.exports = {
  mongoose,
  connectMongo,
  redis,
  createRedisClient,
  getRedisClient
}; 