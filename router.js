const express = require('express');
const router = express.Router();
const mainController = require('./controllers/mainController');
const postController = require('./controllers/postController');

// 메인 페이지
router.get('/', mainController.Main);

// 글 작성
router.post('/posts', postController.createPost);

// 투표하기
router.post('/posts/:id', postController.likePost);

module.exports = router;