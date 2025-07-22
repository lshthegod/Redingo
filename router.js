const express = require('express');
const router = express.Router();
const controller = require('./controller');

// 메인 페이지
router.get('/', controller.Main);

// 글 작성
router.post('/posts', controller.createPost);

// 투표하기
router.post('/posts/:id', controller.likePost);

module.exports = router;