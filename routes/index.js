const express = require('express');
const router = express.Router();

const mainRouter = require('./mainRouter');
const postRouter = require('./postRouter');

// 메인 라우터
router.use('/', mainRouter);

// 게시글 관련 라우터
router.use('/', postRouter);

module.exports = router;
