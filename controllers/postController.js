const {
    saveNewPost,
    updateTodayPostCache,
    increaseLikesInCache
  } = require('../services/postService');
  
  // 🔹 게시글 생성 컨트롤러
  const createPost = async (req, res) => {
    const { text } = req.body;
    try {
      const newPost = await saveNewPost(text);
      await updateTodayPostCache(newPost);
      res.status(201).json(newPost);
    } catch (err) {
      console.error('게시글 생성 실패:', err);
      res.status(500).send('서버 오류');
    }
  };
  
  // 🔹 좋아요 증가 컨트롤러
  const likePost = async (req, res) => {
    const postId = req.params.id;
    try {
      const likes = await increaseLikesInCache(postId);
      console.log(`${postId} 좋아요 수: ${likes}`);
      res.status(200).json({ likes });
    } catch (err) {
      console.error('좋아요 증가 실패:', err);
      res.status(500).send('서버 오류');
    }
  };
  
  module.exports = {
    createPost,
    likePost
  };