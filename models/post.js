const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  text: String,
  timestamp: { type: Date, default: Date.now },
  likes: { type: Number, default: 0 }
}, {
  versionKey: false
});

const Post = mongoose.model('Post', PostSchema);
module.exports = Post;