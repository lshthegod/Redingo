const mongoose = require('mongoose');

// Image 스키마 및 모델
const ImageSchema = new mongoose.Schema({
  url: String,
  timestamp: { type: Date, default: Date.now }
});
const Image = mongoose.model('Image', ImageSchema);

// Post 스키마 및 모델
const PostSchema = new mongoose.Schema({
  text: String,
  timestamp: { type: Date, default: Date.now },
  likes: { type: Number, default: 0 }
});

const Post = mongoose.model('Post', PostSchema);

module.exports = { Post, Image };