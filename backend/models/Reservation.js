const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema(
  {
    reservationCode: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    customerName: {
      type: String,
      required: [true, 'Tên khách hàng không được để trống'],
      trim: true
    },
    phone: {
      type: String,
      required: [true, 'Số điện thoại không được để trống'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email không được để trống'],
      trim: true,
      lowercase: true
    },
    date: {
      type: String,
      required: [true, 'Ngày đặt bàn không được để trống (YYYY-MM-DD)'],
      trim: true,
      match: [/^\d{4}-\d{2}-\d{2}$/, 'Định dạng ngày phải là YYYY-MM-DD']
    },
    timeSlot: {
      type: String,
      required: [true, 'Khung giờ không được để trống'],
      enum: {
        values: ['11:00', '13:00', '15:00', '17:00', '19:00'],
        message: 'Khung giờ hợp lệ: 11:00, 13:00, 15:00, 17:00, 19:00'
      }
    },
    guests: {
      type: Number,
      required: [true, 'Số lượng khách không được để trống'],
      min: [1, 'Số lượng khách tối thiểu là 1 người'],
      max: [10, 'Số lượng khách tối đa là 10 người']
    },
    seatingType: {
      type: String,
      required: [true, 'Vị trí ngồi không được để trống'],
      enum: {
        values: ['counter', 'table', 'tatami'],
        message: 'Vị trí ngồi hợp lệ: counter, table, tatami'
      }
    },
    note: {
      type: String,
      default: '',
      trim: true
    },
    status: {
      type: String,
      enum: ['confirmed', 'cancelled', 'completed'],
      default: 'confirmed'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Reservation', reservationSchema);
