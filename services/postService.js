const { Post } = require('../models/index');
const { getRedisClient } = require('../database/redis');
const { getTodayPosts } = require('./mainService');

// 새 게시글 저장
async function saveNewPost(text) {
  const newPost = new Post({ text });
  await newPost.save();
  return newPost;
}

// Redis 캐시에 새 게시글 추가
async function updateTodayPostCache(newPost) {
  const redis = getRedisClient();
  if (!redis) return;

  const postsCache = await redis.get('posts:today');
  let posts = postsCache ? JSON.parse(postsCache) : [];
  posts.unshift(newPost); // 최신 글을 앞에 추가
  await redis.set('posts:today', JSON.stringify(posts), { EX: 300 });
}

// Redis 캐시에서 좋아요 수 증가
async function increaseLikesInCache(postId) {
  const redis = getRedisClient();
  if (!redis) return 0;

  const postsCache = await redis.get('posts:today');
  let posts = postsCache ? JSON.parse(postsCache) : [];
  let likes = 0;

  const updatedPosts = posts.map(post => {
    if (post._id === postId) {
      post.likes = (post.likes || 0) + 1;
      likes = post.likes;
    }
    return post;
  });

  await redis.set('posts:today', JSON.stringify(updatedPosts), { EX: 300 });
  return likes;
}

// Redis likes → MongoDB 동기화 함수
async function syncRedis2Mongo() {
  const redis = getRedisClient();
  if (!redis) return;

  try {
    const posts = await getTodayPosts();
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
}
module.exports = {
  saveNewPost,
  updateTodayPostCache,
  increaseLikesInCache,
  syncRedis2Mongo
};