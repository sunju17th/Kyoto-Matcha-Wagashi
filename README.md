# 🍵 Komorebi Teahouse (木漏れ日) — Kyoto Matcha & Traditional Wagashi Web App

[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-239120?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-v4.19-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![HTML5](https://img.shields.io/badge/HTML5-Semantic-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-BEM_Architecture-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://en.bem.info/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6_Modules-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![JIS X 8341-3](https://img.shields.io/badge/Accessibility-JIS_X_8341--3_/_WCAG_AA-4A7061?style=for-the-badge)](https://www.w3.org/WAI/standards-guidelines/wcag/)

> **Komorebi Teahouse (木漏れ日)** là dự án Website Quán Trà Đạo & Bánh Ngọt Truyền Thống Kyoto (Nhật Bản) được phát triển chuẩn Full-stack từ P0 Setup đến P9 Release. Website được xây dựng theo tiêu chuẩn chất lượng khắt khe của các công ty Outsourcing Nhật Bản (**納品基準 - JIS X 8341-3 / WCAG 2.1 AA**), tối ưu hóa trải nghiệm người dùng Wabi-Sabi và tích hợp sẵn quy trình lập trình thời đại AI.

---

## 🌟 Tính Năng Nổi Bật (Key Features)

### 🎨 1. Thiết Kế Phong Cách Wabi-Sabi / Modern Ryokan
- **Bảng màu Nhật Bản truyền thống**: Xanh Matcha trầm (`#2C4A3E`), Nền giấy Washi kem ấm (`#F8F5EE`), Đen mực Sumi (`#1F1F1F`), Vàng đồng (`#C5A059`) và Đỏ茜 (`#B83B2A`).
- **Typography Nhật Bản**: Kết hợp Google Fonts `Noto Serif JP` (Tiêu đề nghệ thuật) & `Noto Sans JP` (Nội dung).
- **Thư pháp dọc (Vertical Calligraphy)**: Sử dụng thuộc tính CSS `writing-mode: vertical-rl` biểu diễn câu slogan chuẩn phong cách Kyoto: `「伝統の技と四季の彩りが織りなす京都の至福」`.

### 🌐 2. Hệ Thống Đa Ngôn Ngữ (Dual-Language i18n System)
- Chuyển đổi linh hoạt giữa **🇯🇵 Tiếng Nhật (日本語)** & **🇻🇳 Tiếng Việt**.
- Tự động lưu ngôn ngữ đã chọn vào `localStorage`.
- Dịch đồng bộ toàn bộ Menu, Tin tức, Form đặt bàn và các thông báo trạng thái (*"売り切れ"* ↔ *"Hết hàng"*, *"予約する"* ↔ *"Đặt hàng"*).

### 🏛️ 3. Quy Tắc Kiến Trúc CSS BEM & Layer Prefixes
- Đặt tên Class theo chuẩn Nhật Bản:
  - `.l-`: Layout Layer (`.l-header`, `.l-container`, `.l-main`, `.l-footer`, `.l-grid`)
  - `.c-`: Component Layer (`.c-logo`, `.c-nav`, `.c-btn`, `.c-tag`, `.c-menu-card`, `.c-stepper`, `.c-modal`)
  - `.p-`: Page/Section Layer (`.p-hero`, `.p-about`, `.p-news`, `.p-menu`, `.p-reservation`)
- **Tối ưu Text Overflow**: Khóa chân Card bằng `margin-top: auto` và sử dụng `-webkit-line-clamp` cắt chữ 2-3 dòng giúp các ô thực đơn luôn thẳng hàng 100%.

### ♿ 4. Tiêu Chuẩn Truy Cập Accessibility (JIS X 8341-3 / WCAG 2.1 AA)
- Đảm bảo tỉ lệ tương phản màu chữ (`--color-gold-text: #8A6529`) đạt **4.68:1** (Vượt chuẩn WCAG AA 4.5:1).
- Hỗ trợ đầy đủ bộ thuộc tính WAI-ARIA (`role="dialog"`, `role="tablist"`, `role="tab"`, `aria-expanded`, `aria-selected`).
- Viền Focus cao (`:focus-visible`) phục vụ điều hướng bằng bàn phím (Phím Tab / Esc đóng Modal).

### 🍵 5. Thực Đơn Động & Skeleton Loader
- Bộ lọc Tab danh mục: Matcha, Wagashi, Tea Set, Món theo mùa.
- Ô chọn Sắp xếp theo Giá (Tăng dần / Giảm dần).
- Hiệu ứng nhấp nháy chờ tải dữ liệu **Skeleton Loader** sử dụng CSS `@keyframes shimmer`.

### 📅 6. Quy Trình Đặt Bàn 3 Bước Chuẩn Nhật (3-Step Reservation Form)
- **Step 1 (情報入力 - Nhập thông tin)**: Chọn ngày, chọn vị trí ngồi (Counter / Table / Tatami), chọn khung giờ (`11:00`, `13:00`, `15:00`, `17:00`, `19:00`).
- **Kiểm tra slot trống linh hoạt (Slot Capacity Check)**: Tự động khóa nút khung giờ khi có từ 3 đơn trở lên (`isFull: true`).
- **Step 2 (内容確認 - Xác nhận nội dung)**: Hiển thị bảng tổng hợp thông tin trước khi gửi.
- **Step 3 (予約完了 - Hoàn tất)**: Sinh mã đặt bàn tự động dạng `RES-YYYYMMDD-XXX` và lưu vào MongoDB.

### 🛡️ 7. Cơ Chế Fallback Thông Minh (Smart Mock Fallback)
- Sử dụng `AbortController` với Timeout 3 giây.
- Nếu Server Backend hoặc MongoDB chưa bật, Frontend tự động fallback sang dữ liệu Mock giúp bản Demo **luôn chạy mượt mà 100% khi xem trực tiếp**.

---

## 🛠️ Công Nghệ Sử Dụng (Tech Stack)

| Tầng (Layer) | Công nghệ / Thư viện | Mô tả |
| :--- | :--- | :--- |
| **Backend** | Node.js, Express.js | RESTful API Server, CORS Middleware, Static File Serving |
| **Database** | MongoDB, Mongoose | Schema Modeling: `MenuItem`, `News`, `Reservation` |
| **Frontend** | HTML5, CSS3, ES6 JS Modules | Semantic HTML, Vanilla BEM CSS, Modular JS (`api.js`, `ui.js`, `main.js`, `i18n.js`) |
| **Standards** | JIS X 8341-3 / WCAG AA | Tiêu chuẩn chất lượng dự án Nhật Bản & Accessibility |

---

## 📁 Cấu Trúc Thư Mục Dự Án (Project Structure)

```
Kyoto-Matcha-Wagashi/
├── backend/
│   ├── config/             # Cấu hình kết nối DB
│   ├── models/             # Mongoose Models
│   │   ├── MenuItem.js     # Schema thực đơn
│   │   ├── News.js         # Schema tin tức
│   │   └── Reservation.js  # Schema đơn đặt bàn
│   ├── routes/             # REST API Express Routes
│   │   ├── menuRoutes.js   # GET /api/menu (?category, ?sort)
│   │   ├── newsRoutes.js   # GET /api/news (?limit)
│   │   └── reservationRoutes.js # GET slots & POST reservations
│   ├── .env                # Biến môi trường
│   ├── seed.js             # Script khởi tạo 8 món ăn & 4 tin tức mẫu
│   ├── server.js           # Express Entry Point
│   └── package.json
│
├── frontend/
│   ├── assets/
│   │   ├── css/
│   │   │   └── style.css   # BEM Styling system & JIS X 8341-3 colors
│   │   └── js/
│   │       ├── api.js      # REST API Service & AbortController Timeout Fallback
│   │       ├── i18n.js     # Từ điển & Quản lý Đa ngôn ngữ (JP / VI)
│   │       ├── ui.js       # Dynamic DOM Render, Modal & Form Stepper Controller
│   │       └── main.js     # Event listeners & App Initialization
│   └── index.html          # Semantic HTML5 document
│
├── README.md               # Tài liệu dự án
└── .gitignore
```

---

## 🔌 Danh Sách REST API Endpoints

### 1. Thực Đơn (Menu API)
- `GET /api/menu`: Lấy danh sách món ăn.
  - Query parameters: `?category=matcha|wagashi|tea-set|seasonal`, `?sort=price_asc|price_desc`.
- `GET /api/menu/:id`: Lấy chi tiết món ăn theo ID.

### 2. Tin Tức (News API)
- `GET /api/news`: Lấy tin tức mới nhất.
  - Query parameter: `?limit=5` (Mặc định 5 bài).
- `GET /api/news/:id`: Lấy chi tiết tin tức theo ID.

### 3. Đặt Bàn (Reservation API)
- `GET /api/reservations/slots?date=YYYY-MM-DD`: Kiểm tra danh sách khung giờ còn chỗ hay đã đầy (`isFull: true` khi count >= 3).
- `POST /api/reservations`: Đặt bàn mới (Validate dữ liệu, kiểm tra slot trống, sinh mã `RES-YYYYMMDD-XXX`).

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Ứng Dụng (Getting Started)

### Yêu cầu tiên quyết:
- **Node.js**: v18.0.0 trở lên
- **MongoDB**: Đã cài đặt và khởi chạy trên máy local (`mongodb://127.0.0.1:27017`) hoặc Mongo Atlas.

### Các bước thực hiện:

1. **Clone Repository:**
   ```bash
   git clone https://github.com/sunju17th/Kyoto-Matcha-Wagashi.git
   cd Kyoto-Matcha-Wagashi
   ```

2. **Cài đặt dependencies cho Backend:**
   ```bash
   cd backend
   npm install
   ```

3. **Khởi tạo dữ liệu mẫu (Seeding Database):**
   ```bash
   npm run seed
   ```
   *Script sẽ chèn 8 món ăn chuẩn Nhật (tên tiếng Nhật thật, hình ảnh Unsplash sắc nét, thông tin dị ứng) và 4 thông báo tin tức vào MongoDB.*

4. **Khởi chạy Backend Server:**
   ```bash
   # Chế độ Development (Nodemon tự làm mới):
   npm run dev

   # Hoặc chế độ Production:
   npm start
   ```

5. **Trải nghiệm ứng dụng:**
   Mở trình duyệt bất kỳ và truy cập địa chỉ:
   👉 **`http://localhost:5000`**

*(Giao diện Frontend sẽ tự động tải trực tiếp từ Server Backend Express, kết nối API MongoDB và cho phép chuyển đổi ngôn ngữ JP/VI ngay lập tức!)*

---

## ⚖️ Giấy Phép & Tác Giả (License & Author)

- **Author**: Komorebi Development Team
- **License**: ISC License

---
*Dự án được xây dựng phục vụ cho mục đích học tập, thực hành quy trình lập trình giao diện chuẩn Nhật Bản (Japanese Outsourcing Standard) và ứng dụng AI trong quy trình phát triển Phần mềm.*