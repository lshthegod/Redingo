const { Image, Post } = require('./model'); // Image, Post 모델 import
const moment = require('moment-timezone'); // 날짜 비교를 위해 moment 사용

const Main = async (req, res) => {
  try {
    // 오늘 이미지 하나
    const image = await Image.findOne();

    // 오늘 범위: 서울 기준
    const startOfDay = moment().tz('Asia/Seoul').startOf('day').toDate();
    const endOfDay = moment().tz('Asia/Seoul').endOf('day').toDate();

    // 오늘의 글들 (최신순 정렬)
    let posts = await Post.find({
      timestamp: { $gte: startOfDay, $lte: endOfDay }
    }).sort({ timestamp: -1 });

    // 좋아요 순 상위 3개
    const postsTop3 = [...posts]
      .sort((a, b) => b.likes - a.likes)
      .slice(0, 3);

    // 어제 범위
    const startOfYesterday = moment().tz('Asia/Seoul').subtract(1, 'days').startOf('day').toDate();
    const endOfYesterday = moment().tz('Asia/Seoul').subtract(1, 'days').endOf('day').toDate();

    // 어제의 좋아요 가장 많은 글 1개
    const yesterdayTopPost = await Post.findOne({
      timestamp: { $gte: startOfYesterday, $lte: endOfYesterday }
    }).sort({ likes: -1 });

    res.send({ image, posts, postsTop3, yesterdayTopPost });
  } catch (err) {
    console.error('데이터 조회 실패:', err);
    res.status(500).send('서버 오류');
  }
};

// 게시글 생성
const createPost = async (req, res) => {
  const { text } = req.body; // body에서 text 추출
  try {
    const newPost = new Post({ text }); // text 필드로 Post 생성
    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    console.error('게시글 생성 실패:', err);
    res.status(500).send('서버 오류');
  }
};

// 투표하기
const likePost = async (req, res) => {
  const postId = req.params.id;
  try {
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $inc: { likes: 1 } },
      { new: true }
    );
    if (!updatedPost) {
      return res.status(404).send('존재하지 않는 게시물');
    }
    res.status(200).json({ likes: updatedPost.likes });
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
