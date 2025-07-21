const mongoose = require('mongoose');
const redis = require('redis');

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

// Redis 연결 함수
const createRedisClient = async () => {
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
    return client;
  } catch (err) {
    console.error('Redis 연결 실패:', err);
    throw err;
  }
};

module.exports = {
  mongoose,
  connectMongo,
  redis,
  createRedisClient
}; 