const { Image, Post } = require('./model'); // Image, Post 모델 import
const moment = require('moment'); // 날짜 비교를 위해 moment 사용 (설치 필요: npm install moment)

const Main = async (req, res) => {
  try {
    // Image 모델에서 임의의 데이터 하나 가져오기
    const image = await Image.findOne();

    // 오늘 날짜의 00:00:00 ~ 23:59:59 범위 구하기
    const startOfDay = moment().startOf('day').toDate();
    const endOfDay = moment().endOf('day').toDate();

    // Post 모델에서 timestamp가 오늘인 모든 글 가져오기
    const posts = await Post.find({
      timestamp: { $gte: startOfDay, $lte: endOfDay }
    });

    res.send({ image, posts });
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
// redis 에 맞게 수정할 필요
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

// 우승자 숨기기
const hideWinner = async (req, res) => {
  // 실제 DB 업데이트 로직은 추후 구현
  res.redirect('/');
};

module.exports = {
  Main,
  createPost,
  likePost,
  hideWinner
};
