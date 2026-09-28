const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem');

/**
 * @route   GET /api/menu
 * @desc    Lấy danh sách menu, hỗ trợ lọc theo category và sắp xếp theo giá
 * @access  Public
 */
router.get('/', async (req, res, next) => {
  try {
    const { category, sort } = req.query;
    
    // Tạo filter query
    const filter = {};
    if (category) {
      const validCategories = ['matcha', 'wagashi', 'tea-set', 'seasonal'];
      if (validCategories.includes(category.toLowerCase())) {
        filter.category = category.toLowerCase();
      }
    }

    // Xử lý sắp xếp
    let sortOptions = { createdAt: -1 }; // Mặc định món mới lên trước
    if (sort === 'price_asc') {
      sortOptions = { price: 1 };
    } else if (sort === 'price_desc') {
      sortOptions = { price: -1 };
    }

    const items = await MenuItem.find(filter).sort(sortOptions);

    return res.status(200).json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/menu/:id
 * @desc    Lấy chi tiết 1 món ăn/đồ uống theo ID
 * @access  Public
 */
router.get('/:id', async (req, res, next) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy món ăn với ID này'
      });
    }
    return res.status(200).json({
      success: true,
      data: item
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
