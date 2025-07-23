require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ========== Database ==========
const { connectMongo } = require('./database/mongo');
const { createRedisClient } = require('./database/redis');
require('./database/scheduler');

// ========== Middleware ==========
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ========== View Engine ==========
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// ========== Router ==========
const router = require('./routes/index');
app.use(router);

// ========== Server ==========
async function startServer() {
  try {
    // MongoDB 연결
    await connectMongo();

    // Redis 연결
    await createRedisClient();

    // 서버 실행
    app.listen(PORT, () => {
      console.log(`서버 실행 중: http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('서버 시작 실패:', err);
    process.exit(1);
  }
}

startServer();