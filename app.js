require('dotenv').config();
const express = require('express');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 3000;

// ========== Middleware ==========
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ========== Database ==========
const db = require('./database');
const Post = require('./model');

// MongoDB
db.connectMongo();

// Redis
db.createRedisClient();

// ========== Router ==========
const router = require('./router');
app.use(router);

// ========== Server ==========
app.listen(PORT, () => {
  console.log(`서버 실행 중: http://localhost:${PORT}`);
});
