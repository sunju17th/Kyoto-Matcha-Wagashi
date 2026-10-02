const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Tiêu đề tin tức không được để trống'],
      trim: true
    },
    tag: {
      type: String,
      required: [true, 'Phân loại tin tức không được để trống'],
      enum: {
        values: ['info', 'event', 'seasonal'],
        message: 'Thẻ phân loại phải là: info, event, hoặc seasonal'
      }
    },
    content: {
      type: String,
      required: [true, 'Nội dung tin tức không được để trống'],
      trim: true
    },
    publishedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('News', newsSchema);
