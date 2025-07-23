const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
  url: String,
  timestamp: Date
}, {
  versionKey: false
});

const Image = mongoose.model('Image', ImageSchema);
module.exports = Image;