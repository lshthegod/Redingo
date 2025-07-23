require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ========== Middleware ==========
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ========== View Engine ==========
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// ========== Database ==========
const db = require('./database');

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
