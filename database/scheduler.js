const cron = require('node-cron');
const { Post } = require('../models/index');
const { getRedisClient } = require('./redis');

// 매분마다 Redis likes → MongoDB 동기화
cron.schedule('* * * * *', async () => {
  const redis = getRedisClient();
  if (!redis) return;

  try {
    const posts = await Post.find({}, '_id');
    for (const post of posts) {
      const redisLikes = await redis.get(`post:likes:${post._id}`);
      if (redisLikes !== null) {
        await Post.findByIdAndUpdate(post._id, { likes: parseInt(redisLikes, 10) });
      }
    }
    console.log('Redis likes → MongoDB 동기화 완료');
  } catch (err) {
    console.error('동기화 실패:', err);
  }
});

// 매일 00:00에 Redis 전체 캐시 리셋
cron.schedule('0 0 * * *', async () => {
  const redis = getRedisClient();
  if (!redis) return;

  try {
    const keys = await redis.keys('*');
    if (keys.length > 0) {
      await redis.del(keys);
      console.log('00:00 전체 캐시 리셋 완료');
    }
  } catch (err) {
    console.error('리셋 실패:', err);
  }
});
