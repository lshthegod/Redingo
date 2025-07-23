const express = require('express');
const router = express.Router();
const { createPost, likePost } = require('../controllers/postController');

// 글 작성
router.post('/posts', createPost);

// 투표하기
router.post('/posts/:id', likePost);

module.exports = router;
