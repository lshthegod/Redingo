const express = require('express');
const router = express.Router();
const { Main } = require('../controllers/mainController');

// 메인 페이지
router.get('/', Main);

module.exports = router;
