const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Tên món ăn không được để trống'],
      trim: true
    },
    jpName: {
      type: String,
      required: [true, 'Tên tiếng Nhật không được để trống'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Danh mục không được để trống'],
      enum: {
        values: ['matcha', 'wagashi', 'tea-set', 'seasonal'],
        message: 'Danh mục phải là: matcha, wagashi, tea-set, hoặc seasonal'
      }
    },
    price: {
      type: Number,
      required: [true, 'Giá tiền không được để trống'],
      min: [0, 'Giá tiền phải lớn hơn hoặc bằng 0']
    },
    description: {
      type: String,
      required: [true, 'Mô tả không được để trống'],
      trim: true
    },
    imageUrl: {
      type: String,
      required: [true, 'Đường dẫn ảnh không được để trống'],
      trim: true
    },
    isSeasonal: {
      type: Boolean,
      default: false
    },
    isAvailable: {
      type: Boolean,
      default: true
    },
    allergens: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('MenuItem', menuItemSchema);
