const cron = require('node-cron');
const { getRedisClient } = require('./redis');
const { syncRedis2Mongo } = require('../services/postService');
const { clearRedisCache } = require('../services/redisService');

// 매분마다 Redis likes → MongoDB 동기화
cron.schedule('* * * * *', syncRedis2Mongo);

// 매일 00:00에 Redis 동기화 + 캐시 리셋
cron.schedule('0 0 * * *', async () => {
  try {
    await syncRedis2Mongo();
    await clearRedisCache();
  } catch (err) {
    console.error('00:00 동기화/리셋 실패:', err);
  }
});
