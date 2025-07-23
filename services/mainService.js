const { Post, Image } = require('../models/index');
const moment = require('moment-timezone');
const { getRedisClient } = require('../database/redis');

// 오늘의 글
async function getTodayPosts() {
  const redis = getRedisClient();
  const start = moment().tz('Asia/Seoul').startOf('day').toDate();
  const end = moment().tz('Asia/Seoul').endOf('day').toDate();

  let cache = redis ? await redis.get('posts:today') : null;
  if (cache) return JSON.parse(cache);

  const posts = await Post.find({ timestamp: { $gte: start, $lte: end } }).sort({ timestamp: -1 });
  if (redis) await redis.set('posts:today', JSON.stringify(posts), { EX: 300 });
  return posts;
}

// 좋아요 상위 3개
function getTop3(posts) {
  return [...posts].sort((a, b) => b.likes - a.likes).slice(0, 3);
}

// 오늘의 이미지
async function getTodayImage() {
  const redis = getRedisClient();
  const start = moment().tz('Asia/Seoul').startOf('day').toDate();
  const end = moment().tz('Asia/Seoul').endOf('day').toDate();

  let cache = redis ? await redis.get('image:today') : null;
  if (cache) return JSON.parse(cache);

  let image = await Image.findOne({ timestamp: { $gte: start, $lte: end } });
  if (!image) {
    image = await Image.findOne({ timestamp: { $exists: false } });
    if (image) {
      image.timestamp = start;
      await image.save();
    }
  }

  if (redis && image) await redis.set('image:today', JSON.stringify(image), { EX: 86400 });
  return image;
}

// 어제의 최고 글
async function getYesterdayTopPost() {
  const redis = getRedisClient();
  const start = moment().tz('Asia/Seoul').subtract(1, 'days').startOf('day').toDate();
  const end = moment().tz('Asia/Seoul').subtract(1, 'days').endOf('day').toDate();

  let cache = redis ? await redis.get('yesterdayTopPost') : null;
  if (cache) return JSON.parse(cache);

  const post = await Post.findOne({ timestamp: { $gte: start, $lte: end } }).sort({ likes: -1 });
  if (redis && post) await redis.set('yesterdayTopPost', JSON.stringify(post), { EX: 86400 });
  return post;
}

// 어제의 이미지
async function getYesterdayImage() {
  const redis = getRedisClient();
  const start = moment().tz('Asia/Seoul').subtract(1, 'days').startOf('day').toDate();
  const end = moment().tz('Asia/Seoul').subtract(1, 'days').endOf('day').toDate();

  let cache = redis ? await redis.get('yesterdayImage') : null;
  if (cache) return JSON.parse(cache);

  const image = await Image.findOne({ timestamp: { $gte: start, $lte: end } });
  if (redis && image) await redis.set('yesterdayImage', JSON.stringify(image), { EX: 86400 });
  return image;
}

module.exports = {
  getTodayPosts,
  getTop3,
  getTodayImage,
  getYesterdayTopPost,
  getYesterdayImage
};
