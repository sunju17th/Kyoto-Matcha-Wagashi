/**
 * Komorebi Teahouse - API Service Layer
 * ES6 Module for handling REST API calls with AbortController Timeout & Smart Mock Fallback
 */

const API_BASE_URL = 'http://localhost:5000/api';
const TIMEOUT_MS = 3000; // 3 seconds timeout

/* ==========================================================================
   MOCK DATA FOR FALLBACK (Khi Backend chưa chạy hoặc quá hạn 3s)
   ========================================================================== */
const MOCK_MENU = [
  {
    _id: 'mock-1',
    name: 'Matcha Uji Nghi Thức',
    jpName: '宇治抹茶 (Uji Matcha)',
    category: 'matcha',
    price: 1200,
    description: 'Trà matcha cao cấp nhập khẩu từ Uji, Kyoto. Pha chế theo chuẩn phong cách Trà đạo truyền thống với hương thơm umami đậm đà và vị chát dịu hậu ngọt.',
    imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=1000&auto=format&fit=crop',
    isSeasonal: false,
    isAvailable: true,
    allergens: []
  },
  {
    _id: 'mock-2',
    name: 'Matcha Latte Kem Bọt Hojicha',
    jpName: 'ほうじ茶フォーム抹茶ラテ',
    category: 'matcha',
    price: 950,
    description: 'Sự hòa quyện hoàn hảo giữa Matcha Uji tươi mát và lớp kem bọt trà nướng Hojicha thơm lừng béo ngậy.',
    imageUrl: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?q=80&w=1000&auto=format&fit=crop',
    isSeasonal: false,
    isAvailable: true,
    allergens: ['Sữa']
  },
  {
    _id: 'mock-3',
    name: 'Bánh Wagashi Hoa Anh Đào',
    jpName: '桜練り切り (Sakura Nerikiri)',
    category: 'wagashi',
    price: 800,
    description: 'Bánh Wagashi nghệ thuật thủ công làm từ nhân đậu trắng ngọt thanh bọc bột ngựu mềm mịn, tạo hình cánh hoa anh đào rực rỡ.',
    imageUrl: 'https://images.unsplash.com/photo-1582716401301-822ccde50c20?q=80&w=1000&auto=format&fit=crop',
    isSeasonal: true,
    isAvailable: true,
    allergens: ['Đậu nành']
  },
  {
    _id: 'mock-4',
    name: 'Mochi Dâu Tây Matcha',
    jpName: '苺抹茶大福 (Ichigo Matcha Daifuku)',
    category: 'wagashi',
    price: 750,
    description: 'Bánh Mochi dẻo mịn ôm trọn quả dâu tây tươi mọng nước cùng lớp nhân kem sô-cô-la matcha bùi béo.',
    imageUrl: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=1000&auto=format&fit=crop',
    isSeasonal: false,
    isAvailable: true,
    allergens: ['Sữa', 'Đậu nành']
  },
  {
    _id: 'mock-5',
    name: 'Set Trà Đạo Komorebi Hoàng Gia',
    jpName: '木漏れ日 抹茶茶道セット',
    category: 'tea-set',
    price: 3500,
    description: 'Trải nghiệm Trà đạo trọn vẹn gồm 1 tô Matcha Uji tự pha bằng chasen tại bàn, 2 viên Wagashi cao cấp và mứt gừng ngâm mật ong.',
    imageUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?q=80&w=1000&auto=format&fit=crop',
    isSeasonal: false,
    isAvailable: true,
    allergens: ['Đậu nành', 'Bột mì']
  },
  {
    _id: 'mock-6',
    name: 'Trà Sencha Hữu Cơ Shizuoka',
    jpName: '静岡有機煎茶 (Shizuoka Sencha)',
    category: 'tea-set',
    price: 1500,
    description: 'Trà xanh Sencha lá nguyên bản thu hoạch đợt đầu xuân tại vùng núi Shizuoka, nước trà xanh trong ngọc bích thơm thanh khiết.',
    imageUrl: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?q=80&w=1000&auto=format&fit=crop',
    isSeasonal: false,
    isAvailable: true,
    allergens: []
  },
  {
    _id: 'mock-7',
    name: 'Bánh Thạch Yokan Hạt Dẻ Mùa Thu',
    jpName: '栗羊羹 (Kuri Yokan)',
    category: 'seasonal',
    price: 850,
    description: 'Bánh Yokan thạch đậu đỏ truyền thống kết hợp cùng hạt dẻ nướng nguyên hạt ngâm đường thanh dịu.',
    imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=1000&auto=format&fit=crop',
    isSeasonal: true,
    isAvailable: true,
    allergens: ['Đậu nành']
  },
  {
    _id: 'mock-8',
    name: 'Parfait Matcha Đặt Riêng Kyoto',
    jpName: '京都抹茶パフェ (Kyoto Matcha Parfait)',
    category: 'seasonal',
    price: 1800,
    description: 'Ly tráng miệng Parfait nhiều tầng phong phú: kem tươi Matcha Uji, viên dango dẻo, thạch Hojicha và xôi đậu đỏ Azuki.',
    imageUrl: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=1000&auto=format&fit=crop',
    isSeasonal: true,
    isAvailable: true,
    allergens: ['Sữa', 'Bột mì', 'Trứng', 'Đậu nành']
  }
];

const MOCK_NEWS = [
  {
    _id: 'news-1',
    title: 'Lớp Học Pha Chế Matcha Cùng Nghệ Nhân Trà Đạo Kyoto',
    tag: 'event',
    content: 'Đăng ký ngay workshop hướng dẫn đánh bọt Matcha bằng chasen và nghệ thuật thưởng thức Wagashi chuẩn phong cách Chado Kyoto vào mỗi cuối tuần tại Komorebi Teahouse. Số lượng chỗ có hạn!',
    publishedAt: '2026-09-25T14:00:00.000Z'
  },
  {
    _id: 'news-2',
    title: 'Thực Đơn Mùa Mới: Trà Hojicha Nướng & Bánh Yokan Hạt Dẻ',
    tag: 'seasonal',
    content: 'Gió lạnh đầu mùa đã về, Komorebi trân trọng giới thiệu thực đơn mùa thu ấm áp với trà Hojicha nướng thủ công và bánh Yokan hạt dẻ bùi ngọt được sản xuất giới hạn.',
    publishedAt: '2026-09-22T10:00:00.000Z'
  },
  {
    _id: 'news-3',
    title: 'Lễ Hội Trà Xuân & Ra Mắt Bộ Sản Phẩm Wagashi Sakura 2026',
    tag: 'event',
    content: 'Chào mừng mùa hoa anh đào nở rộ, Komorebi Teahouse tổ chức sự kiện thưởng trà đặc biệt với các dòng bánh Wagashi hoa anh đào giới hạn sản xuất thủ công.',
    publishedAt: '2026-09-15T09:30:00.000Z'
  },
  {
    _id: 'news-4',
    title: 'Khai Trương Trải Nghiệm Trà Đạo Kyoto Giữa Lòng Thành Phố',
    tag: 'info',
    content: 'Komorebi Teahouse chính thức mở cửa chào đón quý khách yêu thích văn hóa trà đạo Nhật Bản. Hãy đến và tận hưởng không gian kiến trúc Zen thanh bình cùng chén trà Uji thanh mát.',
    publishedAt: '2026-09-01T08:00:00.000Z'
  }
];

/* ==========================================================================
   HELPER FETCH WITH TIMEOUT
   ========================================================================== */
async function fetchWithTimeout(url, options = {}, timeout = TIMEOUT_MS) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

/* ==========================================================================
   EXPORTED API FUNCTIONS
   ========================================================================== */

/**
 * Lấy danh sách thực đơn (hỗ trợ lọc theo category và sắp xếp theo price)
 */
export async function fetchMenu(category = '', sort = '') {
  let url = `${API_BASE_URL}/menu`;
  const params = new URLSearchParams();
  if (category && category !== 'all') params.append('category', category);
  if (sort) params.append('sort', sort);
  if (params.toString()) url += `?${params.toString()}`;

  try {
    const result = await fetchWithTimeout(url);
    if (result && result.success && Array.isArray(result.data)) {
      return result.data;
    }
    throw new Error('Dữ liệu API trả về không đúng cấu trúc');
  } catch (error) {
    console.warn(`⚡ [Fallback Mode] Không thể kết nối API Server (${error.message}). Đang sử dụng dữ liệu Mock cho Thực đơn.`);
    
    // Lọc theo category trên dữ liệu Mock
    let filteredMenu = [...MOCK_MENU];
    if (category && category !== 'all') {
      filteredMenu = filteredMenu.filter(item => item.category === category);
    }
    
    // Sắp xếp theo sort trên dữ liệu Mock
    if (sort === 'price_asc') {
      filteredMenu.sort((a, b) => a.price - b.price);
    } else if (sort === 'price_desc') {
      filteredMenu.sort((a, b) => b.price - a.price);
    }

    return filteredMenu;
  }
}

/**
 * Lấy danh sách tin tức mới nhất
 */
export async function fetchNews(limit = 5) {
  const url = `${API_BASE_URL}/news?limit=${limit}`;

  try {
    const result = await fetchWithTimeout(url);
    if (result && result.success && Array.isArray(result.data)) {
      return result.data;
    }
    throw new Error('Dữ liệu API Tin tức trả về không đúng cấu trúc');
  } catch (error) {
    console.warn(`⚡ [Fallback Mode] Không thể kết nối API Server (${error.message}). Đang sử dụng dữ liệu Mock cho Tin tức.`);
    return MOCK_NEWS.slice(0, limit);
  }
}

/**
 * Kiểm tra danh sách khung giờ trống theo ngày
 */
export async function checkAvailableSlots(dateStr) {
  const url = `${API_BASE_URL}/reservations/slots?date=${dateStr}`;

  try {
    const result = await fetchWithTimeout(url);
    if (result && result.success && Array.isArray(result.slots)) {
      return result.slots;
    }
    throw new Error('Dữ liệu khung giờ trả về không hợp lệ');
  } catch (error) {
    console.warn(`⚡ [Fallback Mode] Không thể kết nối API Server (${error.message}). Đang sinh khung giờ Mock cho ngày ${dateStr}.`);
    
    // Dữ liệu Mock: giả định 15:00 là isFull (nếu đúng ngày ví dụ) để demo tính năng
    const slots = ['11:00', '13:00', '15:00', '17:00', '19:00'].map(slot => ({
      timeSlot: slot,
      bookedCount: slot === '15:00' ? 3 : 1,
      maxLimit: 3,
      isFull: slot === '15:00'
    }));

    return slots;
  }
}

/**
 * Gửi đơn đặt bàn mới
 */
export async function createReservation(reservationData) {
  const url = `${API_BASE_URL}/reservations`;

  try {
    const result = await fetchWithTimeout(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(reservationData)
    });

    if (result && result.success) {
      return result.data;
    }
    throw new Error(result.message || 'Tạo đơn đặt bàn thất bại');
  } catch (error) {
    console.warn(`⚡ [Fallback Mode] Không thể gửi tới Backend (${error.message}). Đang tự động sinh mã Đặt bàn Mock.`);
    
    // Giả lập delay 500ms tạo cảm giác gọi API thật
    await new Promise(res => setTimeout(res, 500));

    const cleanDate = (reservationData.date || '2026-09-29').replace(/-/g, '');
    const randomSuffix = Math.random().toString(36).substring(2, 5).toUpperCase();
    const mockReservationCode = `RES-${cleanDate}-${randomSuffix}`;

    return {
      _id: `mock-res-${Date.now()}`,
      reservationCode: mockReservationCode,
      ...reservationData,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };
  }
}
