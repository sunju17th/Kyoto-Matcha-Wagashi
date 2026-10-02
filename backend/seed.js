const mongoose = require('mongoose');
require('dotenv').config();

const MenuItem = require('./models/MenuItem');
const News = require('./models/News');
const Reservation = require('./models/Reservation');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/komorebi_teahouse';

const sampleMenuItems = [
  {
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

const sampleNews = [
  {
    title: 'Khai Trương Trải Nghiệm Trà Đạo Kyoto Giữa Lòng Thành Phố',
    tag: 'info',
    content: 'Komorebi Teahouse chính thức mở cửa chào đón quý khách yêu thích văn hóa trà đạo Nhật Bản. Hãy đến và tận hưởng không gian kiến trúc Zen thanh bình cùng chén trà Uji thanh mát.',
    publishedAt: new Date('2026-09-01T08:00:00Z')
  },
  {
    title: 'Lễ Hội Trà Xuân & Ra Mắt Bộ Sản Phẩm Wagashi Sakura 2026',
    tag: 'event',
    content: 'Chào mừng mùa hoa anh đào nở rộ, Komorebi Teahouse tổ chức sự kiện thưởng trà đặc biệt với các dòng bánh Wagashi hoa anh đào giới hạn sản xuất thủ công.',
    publishedAt: new Date('2026-09-15T09:30:00Z')
  },
  {
    title: 'Thực Đơn Mùa Mới: Trà Hojicha Nướng & Bánh Yokan Hạt Dẻ',
    tag: 'seasonal',
    content: 'Gió lạnh đầu mùa đã về, Komorebi trân trọng giới thiệu thực đơn mùa thu ấm áp với trà Hojicha nướng thủ công và bánh Yokan hạt dẻ bùi ngọt.',
    publishedAt: new Date('2026-09-22T10:00:00Z')
  },
  {
    title: 'Lớp Học Pha Chế Matcha Cùng Nghệ Nhân Trà Đạo Kyoto',
    tag: 'event',
    content: 'Đăng ký ngay workshop hướng dẫn đánh bọt Matcha bằng chasen và nghệ thuật thưởng thức Wagashi chuẩn phong cách Chado Kyoto vào mỗi cuối tuần.',
    publishedAt: new Date('2026-09-25T14:00:00Z')
  }
];

async function seedDatabase() {
  try {
    console.log('🔄 Đang kết nối tới MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Đã kết nối thành công tới MongoDB!');

    console.log('🧹 Đang làm sạch dữ liệu cũ...');
    await MenuItem.deleteMany({});
    await News.deleteMany({});
    await Reservation.deleteMany({});

    console.log('🌱 Đang chèn dữ liệu thực đơn mẫu...');
    const insertedMenu = await MenuItem.insertMany(sampleMenuItems);
    console.log(`✅ Đã thêm ${insertedMenu.length} món ăn/đồ uống vào cơ sở dữ liệu.`);

    console.log('🌱 Đang chèn dữ liệu tin tức mẫu...');
    const insertedNews = await News.insertMany(sampleNews);
    console.log(`✅ Đã thêm ${insertedNews.length} tin tức vào cơ sở dữ liệu.`);

    console.log('🎉 Khởi tạo dữ liệu mẫu (Seeding) hoàn tất thành công!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi khi nạp dữ liệu seed:', error);
    process.exit(1);
  }
}

seedDatabase();
