const { getRedisClient } = require('../database/redis');

async function clearRedisCache() {
  const redis = getRedisClient();
  if (!redis) return;

  try {
    const keys = await redis.keys('*');
    if (keys.length > 0) {
      await redis.del(keys);
      console.log('00:00 전체 캐시 리셋 완료');
    }
  } catch (err) {
    console.error('Redis 캐시 리셋 실패:', err);
    throw err;
  }
}

module.exports = { clearRedisCache };
