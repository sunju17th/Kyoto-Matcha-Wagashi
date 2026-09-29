/**
 * Komorebi Teahouse - UI Rendering & Form Controller
 * ES6 Module for DOM manipulation, templates, modal controls, and reservation stepper
 */

/* ==========================================================================
   1. MENU & SKELETON RENDERING
   ========================================================================== */

/**
 * Hiển thị thẻ Skeleton Loader khi đang chờ tải dữ liệu API
 */
export function renderSkeletons(container, count = 6) {
  if (!container) return;
  container.innerHTML = '';
  const template = document.getElementById('skeleton-card-template');
  if (!template) return;

  for (let i = 0; i < count; i++) {
    const clone = template.content.cloneNode(true);
    container.appendChild(clone);
  }
}

/**
 * Định dạng số tiền Yên Nhật (¥1,200)
 */
export function formatYen(amount) {
  if (typeof amount !== 'number') return '¥0';
  return `¥${amount.toLocaleString('ja-JP')}`;
}

/**
 * Hiển thị danh sách món ăn từ mảng items vào container Grid
 */
export function renderMenu(container, items) {
  if (!container) return;
  container.innerHTML = '';

  if (!items || items.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
        <p style="font-family: var(--font-serif); font-size: 1.2rem; color: var(--color-text-muted);">
          該当するメニューが見つかりませんでした。<br>
          (Không tìm thấy món ăn nào phù hợp với bộ lọc hiện tại.)
        </p>
      </div>
    `;
    return;
  }

  const template = document.getElementById('menu-card-template');
  if (!template) return;

  items.forEach(item => {
    const clone = template.content.cloneNode(true);
    const cardEl = clone.querySelector('.c-menu-card');

    // Hình ảnh & Alt text
    const imgEl = clone.querySelector('.c-menu-card__image');
    imgEl.src = item.imageUrl || 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=1000&auto=format&fit=crop';
    imgEl.alt = item.name;

    // Tag Seasonal
    if (item.isSeasonal) {
      const tagEl = clone.querySelector('.c-menu-card__tag');
      if (tagEl) tagEl.style.display = 'inline-block';
    }

    // Tên tiếng Nhật & Tiếng Việt
    const jpNameEl = clone.querySelector('.c-menu-card__jp-name');
    if (jpNameEl) jpNameEl.textContent = item.jpName || '';

    const titleEl = clone.querySelector('.c-menu-card__title');
    if (titleEl) titleEl.textContent = item.name;

    // Mô tả
    const descEl = clone.querySelector('.c-menu-card__desc');
    if (descEl) descEl.textContent = item.description || '';

    // Giá tiền Yên Nhật
    const priceEl = clone.querySelector('.c-menu-card__price');
    if (priceEl) priceEl.textContent = formatYen(item.price);

    // Thông tin Dị ứng (Allergens)
    const allergensContainer = clone.querySelector('.c-menu-card__allergens');
    if (allergensContainer) {
      allergensContainer.innerHTML = '';
      if (Array.isArray(item.allergens) && item.allergens.length > 0) {
        item.allergens.forEach(allergen => {
          const badge = document.createElement('span');
          badge.className = 'c-allergen-badge';
          badge.textContent = `⚠️ ${allergen}`;
          allergensContainer.appendChild(badge);
        });
      }
    }

    // Xử lý khi sản phẩm hết hàng (isAvailable === false)
    if (item.isAvailable === false) {
      cardEl.style.opacity = '0.6';
      const btnEl = clone.querySelector('.c-btn');
      if (btnEl) {
        btnEl.textContent = '売り切れ (Hết hàng)';
        btnEl.classList.add('c-btn--disabled');
        btnEl.removeAttribute('href');
        btnEl.setAttribute('aria-disabled', 'true');
      }
    }

    container.appendChild(clone);
  });
}

/* ==========================================================================
   2. NEWS LIST & MODAL RENDERING
   ========================================================================== */

/**
 * Định dạng Date YYYY.MM.DD
 */
export function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
}

/**
 * Lấy class CSS tương ứng cho Tag tin tức
 */

export function getNewsTagClass(tag) {
  switch (tag) {
    case 'info':
      return 'c-tag--info';
    case 'event':
      return 'c-tag--event';
    case 'seasonal':
      return 'c-tag--seasonal';
    default:
      return 'c-tag--info';
  }
}

/**
 * Render danh sách tin tức
 */
export function renderNews(container, newsList) {
  if (!container) return;
  container.innerHTML = '';

  if (!newsList || newsList.length === 0) {
    container.innerHTML = `<p style="padding: 24px; text-align: center; color: var(--color-text-muted);">お知らせはありません。(Chưa có thông báo mới)</p>`;
    return;
  }

  newsList.forEach(news => {
    const article = document.createElement('article');
    article.className = 'c-news-card';
    article.setAttribute('data-news-id', news._id);

    const tagClass = getNewsTagClass(news.tag);
    const tagText = (news.tag || 'info').toUpperCase();

    article.innerHTML = `
      <time class="c-news-card__date" datetime="${news.publishedAt}">${formatDate(news.publishedAt)}</time>
      <span class="c-tag ${tagClass}">${tagText}</span>
      <h3 class="c-news-card__title">${news.title}</h3>
      <span class="c-news-card__arrow">→</span>
    `;

    // Sự kiện mở Modal chi tiết khi nhấp vào tin tức
    article.addEventListener('click', () => {
      openNewsModal(news);
    });

    container.appendChild(article);
  });
}

/**
 * Điều khiển mở Modal tin tức
 */
export function openNewsModal(news) {
  const modal = document.getElementById('news-modal');
  if (!modal) return;

  const dateEl = document.getElementById('modal-news-date');
  const tagEl = document.getElementById('modal-news-tag');
  const titleEl = document.getElementById('modal-news-title');
  const contentEl = document.getElementById('modal-news-content');

  if (dateEl) dateEl.textContent = formatDate(news.publishedAt);
  if (tagEl) {
    tagEl.className = `c-tag ${getNewsTagClass(news.tag)}`;
    tagEl.textContent = (news.tag || 'info').toUpperCase();
  }
  if (titleEl) titleEl.textContent = news.title;
  if (contentEl) contentEl.textContent = news.content;

  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden'; // Khóa scroll trang web
}

/**
 * Điều khiển đóng Modal tin tức
 */
export function closeNewsModal() {
  const modal = document.getElementById('news-modal');
  if (!modal) return;

  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = ''; // Mở lại scroll
}

/* ==========================================================================
   3. STEPPER RESERVATION FORM CONTROLLER
   ========================================================================== */

/**
 * Cập nhật danh sách Slot nút bấm (Disable nếu isFull)
 */
export function updateTimeSlotsUI(slotsData) {
  const container = document.getElementById('time-slot-container');
  if (!container) return;

  const slotBtns = container.querySelectorAll('.c-slot-btn');
  slotBtns.forEach(btn => {
    const slotTime = btn.getAttribute('data-slot');
    const slotInfo = slotsData.find(s => s.timeSlot === slotTime);

    if (slotInfo && slotInfo.isFull) {
      btn.classList.add('is-full');
      btn.disabled = true;
      const badge = btn.querySelector('.c-slot-badge');
      if (badge) {
        badge.textContent = '満席 (Đã đầy)';
        badge.style.backgroundColor = 'var(--color-alert-red)';
        badge.style.color = '#FFFFFF';
      }
    } else {
      btn.classList.remove('is-full');
      btn.disabled = false;
      const badge = btn.querySelector('.c-slot-badge');
      if (badge) {
        badge.textContent = 'Còn chỗ';
        badge.style.backgroundColor = '';
        badge.style.color = '';
      }
    }
  });
}

/**
 * Chuyển đổi trạng thái Stepper Bar (Step 1, Step 2, Step 3)
 */
export function setStepperState(currentStep) {
  const step1Node = document.getElementById('step-node-1');
  const step2Node = document.getElementById('step-node-2');
  const step3Node = document.getElementById('step-node-3');

  // Reset classes
  [step1Node, step2Node, step3Node].forEach(node => {
    if (node) node.className = 'c-stepper__step';
  });

  if (currentStep === 1) {
    if (step1Node) step1Node.classList.add('is-active');
  } else if (currentStep === 2) {
    if (step1Node) step1Node.classList.add('is-complete');
    if (step2Node) step2Node.classList.add('is-active');
  } else if (currentStep === 3) {
    if (step1Node) step1Node.classList.add('is-complete');
    if (step2Node) step2Node.classList.add('is-complete');
    if (step3Node) step3Node.classList.add('is-active');
  }
}

/**
 * Chuyển từ Step 1 sang Step 2 (Xác nhận dữ liệu)
 */
export function showStep2Review(formData) {
  // Validate thông tin
  if (!formData.customerName || !formData.phone || !formData.email || !formData.date || !formData.timeSlot) {
    alert('Vui lòng nhập đầy đủ các thông tin bắt buộc và chọn khung giờ đặt bàn!');
    return false;
  }

  // Đổ dữ liệu vào bảng Review ở Step 2
  const reviewName = document.getElementById('review-name');
  const reviewPhone = document.getElementById('review-phone');
  const reviewEmail = document.getElementById('review-email');
  const reviewDate = document.getElementById('review-date');
  const reviewSlot = document.getElementById('review-slot');
  const reviewGuests = document.getElementById('review-guests');
  const reviewSeating = document.getElementById('review-seating');
  const reviewNote = document.getElementById('review-note');

  const seatingTypeMap = {
    counter: 'Counter Bar (カウンター席)',
    table: 'Table Seating (テーブル席)',
    tatami: 'Tatami Room (畳個室)'
  };

  if (reviewName) reviewName.textContent = formData.customerName;
  if (reviewPhone) reviewPhone.textContent = formData.phone;
  if (reviewEmail) reviewEmail.textContent = formData.email;
  if (reviewDate) reviewDate.textContent = formData.date;
  if (reviewSlot) reviewSlot.textContent = formData.timeSlot;
  if (reviewGuests) reviewGuests.textContent = `${formData.guests} 名様 (${formData.guests} Người)`;
  if (reviewSeating) reviewSeating.textContent = seatingTypeMap[formData.seatingType] || formData.seatingType;
  if (reviewNote) reviewNote.textContent = formData.note || '(Không có)';

  // Ẩn view Step 1, Hiện view Step 2
  const step1View = document.getElementById('step-1-view');
  const step2View = document.getElementById('step-2-view');
  const step3View = document.getElementById('step-3-view');

  if (step1View) step1View.style.display = 'none';
  if (step2View) step2View.style.display = 'block';
  if (step3View) step3View.style.display = 'none';

  setStepperState(2);
  return true;
}

/**
 * Quay lại Step 1 để sửa thông tin
 */
export function showStep1Form() {
  const step1View = document.getElementById('step-1-view');
  const step2View = document.getElementById('step-2-view');
  const step3View = document.getElementById('step-3-view');

  if (step1View) step1View.style.display = 'block';
  if (step2View) step2View.style.display = 'none';
  if (step3View) step3View.style.display = 'none';

  setStepperState(1);
}

/**
 * Chuyển sang Step 3 sau khi đặt thành công (Hiển thị mã reservationCode)
 */
export function showStep3Success(reservationResult) {
  const codeEl = document.getElementById('success-code');
  if (codeEl && reservationResult.reservationCode) {
    codeEl.textContent = reservationResult.reservationCode;
  }

  const step1View = document.getElementById('step-1-view');
  const step2View = document.getElementById('step-2-view');
  const step3View = document.getElementById('step-3-view');

  if (step1View) step1View.style.display = 'none';
  if (step2View) step2View.style.display = 'none';
  if (step3View) step3View.style.display = 'block';

  setStepperState(3);
}
