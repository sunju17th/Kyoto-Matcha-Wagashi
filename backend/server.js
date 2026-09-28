const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const menuRoutes = require('./routes/menuRoutes');
const newsRoutes = require('./routes/newsRoutes');
const reservationRoutes = require('./routes/reservationRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/komorebi_teahouse';

// ----------------------------------------------------
// Middleware Cấu hình CORS và Body Parser
// ----------------------------------------------------
const corsOptions = {
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ----------------------------------------------------
// Kết nối MongoDB Mongoose
// ----------------------------------------------------
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('🍃 [MongoDB] Kết nối cơ sở dữ liệu Komorebi Teahouse thành công!');
  })
  .catch((err) => {
    console.error('❌ [MongoDB] Lỗi kết nối cơ sở dữ liệu:', err.message);
  });

// ----------------------------------------------------
// Routes
// ----------------------------------------------------
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to Komorebi Teahouse (木漏れ日) API Backend Service 🍵🍡',
    version: '1.0.0',
    endpoints: {
      menu: '/api/menu',
      news: '/api/news',
      reservations: '/api/reservations',
      reservationSlots: '/api/reservations/slots?date=YYYY-MM-DD'
    }
  });
});

app.use('/api/menu', menuRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/reservations', reservationRoutes);

// ----------------------------------------------------
// Handling 404 Not Found
// ----------------------------------------------------
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Đường dẫn API không tồn tại: ${req.originalUrl}`
  });
});

// ----------------------------------------------------
// Global Error Handler Middleware
// ----------------------------------------------------
app.use((err, req, res, next) => {
  console.error('🔥 [Server Error]:', err.stack || err);

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val) => val.message);
    return res.status(400).json({
      success: false,
      message: 'Dữ liệu không hợp lệ',
      errors: messages
    });
  }

  // Mongoose Duplicate Key Error
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: 'Dữ liệu trùng lặp (Duplicate Field Value)',
      error: err.keyValue
    });
  }

  // Mongoose CastError (Invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: `Định dạng ID không hợp lệ: ${err.value}`
    });
  }

  // Generic Internal Server Error
  return res.status(500).json({
    success: false,
    message: err.message || 'Lỗi hệ thống máy chủ (Internal Server Error)'
  });
});

// ----------------------------------------------------
// Khởi chạy Server
// ----------------------------------------------------
app.listen(PORT, () => {
  console.log(`🚀 [Server] Komorebi Teahouse Backend đang chạy tại http://localhost:${PORT}`);
});
