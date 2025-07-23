const mongoose = require('mongoose');

const connectMongo = async () => {
  try {
    console.log('MongoDB 연결 시도');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB 연결 성공');
  } catch (err) {
    console.error('MongoDB 연결 실패:', err);
    throw err;
  }
};

module.exports = { mongoose, connectMongo };
