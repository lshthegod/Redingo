const { Image, Post } = require('./model'); // Image, Post 모델 import
const moment = require('moment-timezone'); // 날짜 비교를 위해 moment 사용
const { getRedisClient } = require('./database');

const Main = async (req, res) => {
  try {
    const redis = getRedisClient();
    // 오늘 날짜 범위: 서울 기준
    const startOfDay = moment().tz('Asia/Seoul').startOf('day').toDate();
    const endOfDay = moment().tz('Asia/Seoul').endOf('day').toDate();

    // Redis에서 오늘의 posts, image, 어제의 우승글/이미지 캐시 조회
    let [postsCache, imageCache, yesterdayTopPostCache, yesterdayImageCache] = await Promise.all([
      redis ? redis.get('posts:today') : null,
      redis ? redis.get('image:today') : null,
      redis ? redis.get('yesterdayTopPost') : null,
      redis ? redis.get('yesterdayImage') : null
    ]);

    let posts, postsTop3, image, yesterdayTopPost, yesterdayImage;

    // 오늘의 글들 (최신순 정렬)
    if (postsCache) {
      posts = JSON.parse(postsCache);
    } else {
      posts = await Post.find({
        timestamp: { $gte: startOfDay, $lte: endOfDay }
      }).sort({ timestamp: -1 });
      if (redis) await redis.set('posts:today', JSON.stringify(posts), { EX: 300 });
    }

    // 좋아요 순 상위 3개 (posts:today에서 추출)
    postsTop3 = [...posts].sort((a, b) => b.likes - a.likes).slice(0, 3);

    // 오늘 날짜의 이미지를 먼저 찾음
    if (imageCache) {
      image = JSON.parse(imageCache);
    } else {
      image = await Image.findOne({ timestamp: { $gte: startOfDay, $lte: endOfDay } });
      if (!image) {
        image = await Image.findOne({ timestamp: { $exists: false } });
        if (image) {
          image.timestamp = startOfDay;
          await image.save();
        }
      }
      if (redis && image) await redis.set('image:today', JSON.stringify(image), { EX: 300 });
    }

    // 어제 범위
    const startOfYesterday = moment().tz('Asia/Seoul').subtract(1, 'days').startOf('day').toDate();
    const endOfYesterday = moment().tz('Asia/Seoul').subtract(1, 'days').endOf('day').toDate();

    // 어제의 좋아요 가장 많은 글 1개
    if (yesterdayTopPostCache) {
      yesterdayTopPost = JSON.parse(yesterdayTopPostCache);
    } else {
      yesterdayTopPost = await Post.findOne({
        timestamp: { $gte: startOfYesterday, $lte: endOfYesterday }
      }).sort({ likes: -1 });
      if (redis && yesterdayTopPost) await redis.set('yesterdayTopPost', JSON.stringify(yesterdayTopPost), { EX: 86400 });
    }

    // 어제의 우승 글의 timestamp와 일치하는 이미지 찾기
    if (yesterdayImageCache) {
      yesterdayImage = JSON.parse(yesterdayImageCache);
    } else {
      if (yesterdayTopPost) {
        yesterdayImage = await Image.findOne({
          timestamp: {
            $gte: startOfYesterday,
            $lte: endOfYesterday
          }
        });
        if (redis && yesterdayImage) await redis.set('yesterdayImage', JSON.stringify(yesterdayImage), { EX: 86400 });
      }
    }

    res.render('main', {
      image,
      posts,
      postsTop3,
      yesterdayTopPost,
      yesterdayImage
    });
  } catch (err) {
    console.error('데이터 조회 실패:', err);
    res.status(500).send('서버 오류');
  }
};

// 게시글 생성
const createPost = async (req, res) => {
  const { text } = req.body; // body에서 text 추출
  const redis = getRedisClient();
  try {
    const newPost = new Post({ text }); // text 필드로 Post 생성
    await newPost.save();
    // posts:today Redis 캐시 갱신 (맨 앞에 추가)
    if (redis) {
      const postsCache = await redis.get('posts:today');
      let posts = postsCache ? JSON.parse(postsCache) : [];
      posts.unshift(newPost); // 최신 글을 맨 앞에 추가
      await redis.set('posts:today', JSON.stringify(posts), { EX: 300 });
    }
    res.status(201).json(newPost);
  } catch (err) {
    console.error('게시글 생성 실패:', err);
    res.status(500).send('서버 오류');
  }
};

// 투표하기
const likePost = async (req, res) => {
  const postId = req.params.id;
  const redis = getRedisClient();
  try {
    let likes = 0;
    if (redis) {
      // posts:today 캐시에서 해당 post의 likes를 1 증가
      const postsCache = await redis.get('posts:today');
      let posts = postsCache ? JSON.parse(postsCache) : [];
      let updated = false;
      posts = posts.map(post => {
        if (post._id === postId) {
          post.likes = (post.likes || 0) + 1;
          likes = post.likes;
          updated = true;
        }
        return post;
      });
      if (updated) {
        await redis.set('posts:today', JSON.stringify(posts), { EX: 300 });
      }
    }
    // 클라이언트에 즉시 응답
    console.log(`${postId} 좋아요 수: ${likes}`);
    res.status(200).json({ likes });
    // MongoDB likes 동기화는 별도 백그라운드에서 처리(여기서는 하지 않음)
  } catch (err) {
    console.error('좋아요 증가 실패:', err);
    res.status(500).send('서버 오류');
  }
};

module.exports = {
  Main,
  createPost,
  likePost
};
