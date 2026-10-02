const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation');

const ALLOWED_TIME_SLOTS = ['11:00', '13:00', '15:00', '17:00', '19:00'];
const MAX_RESERVATIONS_PER_SLOT = 3;

/**
 * Helper sinh mã đặt bàn định dạng RES-YYYYMMDD-XXX
 */
const generateReservationCode = (dateStr) => {
  const cleanDate = dateStr.replace(/-/g, '');
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let randomSuffix = '';
  for (let i = 0; i < 3; i++) {
    randomSuffix += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return `RES-${cleanDate}-${randomSuffix}`;
};

/**
 * @route   GET /api/reservations/slots?date=YYYY-MM-DD
 * @desc    Đếm số đơn đặt bàn trong ngày theo từng timeSlot, trả về trạng thái isFull nếu từ 3 đơn trở lên
 * @access  Public
 */
router.get('/slots', async (req, res, next) => {
  try {
    const { date } = req.query;

    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp tham số date đúng định dạng YYYY-MM-DD'
      });
    }

    // Đếm số đơn đặt bàn đã xác nhận trong ngày theo từng khung giờ
    const counts = await Reservation.aggregate([
      {
        $match: {
          date: date,
          status: { $ne: 'cancelled' }
        }
      },
      {
        $group: {
          _id: '$timeSlot',
          count: { $sum: 1 }
        }
      }
    ]);

    const countMap = {};
    counts.forEach((item) => {
      countMap[item._id] = item.count;
    });

    const slots = ALLOWED_TIME_SLOTS.map((slot) => {
      const bookedCount = countMap[slot] || 0;
      return {
        timeSlot: slot,
        bookedCount: bookedCount,
        maxLimit: MAX_RESERVATIONS_PER_SLOT,
        isFull: bookedCount >= MAX_RESERVATIONS_PER_SLOT
      };
    });

    return res.status(200).json({
      success: true,
      date: date,
      slots: slots
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/reservations
 * @desc    Tạo đơn đặt bàn mới kèm kiểm tra validate và kiểm tra slot isFull
 * @access  Public
 */
router.post('/', async (req, res, next) => {
  try {
    const {
      customerName,
      phone,
      email,
      date,
      timeSlot,
      guests,
      seatingType,
      note
    } = req.body;

    // Validate bắt buộc nhập
    if (!customerName || !phone || !email || !date || !timeSlot || guests === undefined || !seatingType) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng điền đầy đủ các thông tin bắt buộc (customerName, phone, email, date, timeSlot, guests, seatingType)'
      });
    }

    // Validate định dạng date YYYY-MM-DD
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({
        success: false,
        message: 'Định dạng ngày đặt bàn không hợp lệ. Sử dụng YYYY-MM-DD'
      });
    }

    // Validate timeSlot
    if (!ALLOWED_TIME_SLOTS.includes(timeSlot)) {
      return res.status(400).json({
        success: false,
        message: `Khung giờ không hợp lệ. Vui lòng chọn một trong: ${ALLOWED_TIME_SLOTS.join(', ')}`
      });
    }

    // Validate guests (1-10)
    const guestsNum = Number(guests);
    if (isNaN(guestsNum) || guestsNum < 1 || guestsNum > 10) {
      return res.status(400).json({
        success: false,
        message: 'Số lượng khách phải từ 1 đến 10 người'
      });
    }

    // Validate seatingType
    const validSeating = ['counter', 'table', 'tatami'];
    if (!validSeating.includes(seatingType)) {
      return res.status(400).json({
        success: false,
        message: 'Vị trí ngồi không hợp lệ. Chọn: counter, table, hoặc tatami'
      });
    }

    // Kiểm tra số lượng đơn đã đặt trong khung giờ đó
    const existingCount = await Reservation.countDocuments({
      date: date,
      timeSlot: timeSlot,
      status: { $ne: 'cancelled' }
    });

    if (existingCount >= MAX_RESERVATIONS_PER_SLOT) {
      return res.status(400).json({
        success: false,
        message: `Khung giờ ${timeSlot} ngày ${date} đã đầy (tối đa ${MAX_RESERVATIONS_PER_SLOT} đơn). Vui lòng chọn khung giờ khác.`
      });
    }

    // Sinh mã reservationCode độc nhất
    let reservationCode = generateReservationCode(date);
    let codeExists = await Reservation.findOne({ reservationCode });
    while (codeExists) {
      reservationCode = generateReservationCode(date);
      codeExists = await Reservation.findOne({ reservationCode });
    }

    // Tạo reservation
    const newReservation = await Reservation.create({
      reservationCode,
      customerName,
      phone,
      email,
      date,
      timeSlot,
      guests: guestsNum,
      seatingType,
      note: note || '',
      status: 'confirmed'
    });

    return res.status(201).json({
      success: true,
      message: 'Đặt bàn thành công!',
      data: newReservation
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/reservations
 * @desc    Lấy tất cả danh sách đặt bàn (Phục vụ cho quản trị viên/xem lại)
 * @access  Public
 */
router.get('/', async (req, res, next) => {
  try {
    const reservations = await Reservation.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: reservations.length,
      data: reservations
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
