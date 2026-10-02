const express = require('express');
const router = express.Router();
const News = require('../models/News');

/**
 * @route   GET /api/news
 * @desc    Lấy danh sách tin tức mới nhất, có hỗ trợ giới hạn số lượng ?limit=5
 * @access  Public
 */
router.get('/', async (req, res, next) => {
  try {
    const limitQuery = parseInt(req.query.limit, 10);
    const limit = !isNaN(limitQuery) && limitQuery > 0 ? limitQuery : 5;

    const newsList = await News.find()
      .sort({ publishedAt: -1 })
      .limit(limit);

    return res.status(200).json({
      success: true,
      count: newsList.length,
      data: newsList
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/news/:id
 * @desc    Lấy chi tiết 1 tin tức theo ID
 * @access  Public
 */
router.get('/:id', async (req, res, next) => {
  try {
    const newsItem = await News.findById(req.params.id);
    if (!newsItem) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy tin tức với ID này'
      });
    }
    return res.status(200).json({
      success: true,
      data: newsItem
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
