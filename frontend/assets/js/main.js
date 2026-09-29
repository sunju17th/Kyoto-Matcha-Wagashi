/**
 * Komorebi Teahouse - Main Application Entry Point
 * ES6 Modules initialization, event handling, and state management
 */

import { fetchMenu, fetchNews, checkAvailableSlots, createReservation } from './api.js';
import {
  renderSkeletons,
  renderMenu,
  renderNews,
  closeNewsModal,
  updateTimeSlotsUI,
  showStep2Review,
  showStep1Form,
  showStep3Success
} from './ui.js';

// State Management
const appState = {
  activeCategory: 'all',
  activeSort: '',
  selectedSlot: '',
  formData: {}
};

document.addEventListener('DOMContentLoaded', async () => {
  console.log('🍵 [Komorebi Teahouse] Application Initialized');

  // 1. Khởi tạo giá trị mặc định cho Date Picker (Hôm nay)
  initDatePicker();

  // 2. Tải danh sách Thực đơn & Tin tức ban đầu
  initMenuData();
  initNewsData();

  // 3. Đăng ký các Sự kiện Giao diện (Event Listeners)
  setupHeaderEvents();
  setupCategoryEvents();
  setupSortEvents();
  setupModalEvents();
  setupReservationEvents();
});

/* ==========================================================================
   1. DATE PICKER INITIALIZATION
   ========================================================================== */
function initDatePicker() {
  const dateInput = document.getElementById('date');
  if (!dateInput) return;

  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const todayStr = `${year}-${month}-${day}`;

  dateInput.value = todayStr;
  dateInput.min = todayStr; // Không cho phép chọn ngày quá quứ trong quá khứ

  // Tải danh sách Slot trống của ngày hôm nay
  loadTimeSlots(todayStr);
}

async function loadTimeSlots(dateStr) {
  const slots = await checkAvailableSlots(dateStr);
  updateTimeSlotsUI(slots);
}

/* ==========================================================================
   2. DATA FETCHING INITIALIZERS
   ========================================================================== */
async function initMenuData() {
  const menuContainer = document.getElementById('menu-grid');
  renderSkeletons(menuContainer, 6);

  const items = await fetchMenu(appState.activeCategory, appState.activeSort);
  renderMenu(menuContainer, items);
}

async function initNewsData() {
  const newsContainer = document.getElementById('news-list');
  const newsList = await fetchNews(4);
  renderNews(newsContainer, newsList);
}

/* ==========================================================================
   3. EVENT LISTENERS SETUP
   ========================================================================== */

/**
 * Header Scroll & Hamburger Toggle Events
 */
function setupHeaderEvents() {
  const header = document.getElementById('header');
  const hamburger = document.getElementById('hamburger-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.c-nav__link');

  // Sticky Header scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header?.classList.add('is-scrolled');
    } else {
      header?.classList.remove('is-scrolled');
    }
  });

  // Mobile Hamburger Toggle
  hamburger?.addEventListener('click', () => {
    const isOpen = navMenu?.classList.toggle('is-open');
    hamburger.classList.toggle('is-active');
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  // Đóng Mobile Nav khi nhấp vào bất kỳ Link nào
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu?.classList.remove('is-open');
      hamburger?.classList.remove('is-active');
      hamburger?.setAttribute('aria-expanded', 'false');
    });
  });
}

/**
 * Tab Lọc Danh mục Menu
 */
function setupCategoryEvents() {
  const tabsContainer = document.getElementById('category-tabs');
  if (!tabsContainer) return;

  const tabBtns = tabsContainer.querySelectorAll('.c-tabs__btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', async () => {
      // Toggle Active Tab class
      tabBtns.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');

      // Update state & re-fetch
      appState.activeCategory = btn.getAttribute('data-category') || 'all';
      await initMenuData();
    });
  });
}

/**
 * Dropdown Sắp xếp Giá
 */
function setupSortEvents() {
  const sortSelect = document.getElementById('price-sort');
  if (!sortSelect) return;

  sortSelect.addEventListener('change', async (e) => {
    appState.activeSort = e.target.value;
    await initMenuData();
  });
}

/**
 * Event Listener cho Modal Tin Tức
 */
function setupModalEvents() {
  const modalCloseBtn = document.getElementById('news-modal-close');
  const modalBackdrop = document.getElementById('news-modal-backdrop');

  modalCloseBtn?.addEventListener('click', closeNewsModal);
  modalBackdrop?.addEventListener('click', closeNewsModal);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeNewsModal();
    }
  });
}

/**
 * Quản lý Sự kiện Form Đặt Bàn (Stepper Form 3 Bước)
 */
function setupReservationEvents() {
  const form = document.getElementById('reservation-form');
  const dateInput = document.getElementById('date');
  const timeSlotContainer = document.getElementById('time-slot-container');
  const selectedTimeSlotInput = document.getElementById('selectedTimeSlot');

  const btnToStep2 = document.getElementById('btn-to-step-2');
  const btnBackToStep1 = document.getElementById('btn-back-to-step-1');
  const btnReset = document.getElementById('btn-reset-reservation');

  // 1. Sự kiện thay đổi Ngày -> Gọi API kiểm tra Khung giờ trống
  dateInput?.addEventListener('change', (e) => {
    const newDate = e.target.value;
    if (newDate) {
      loadTimeSlots(newDate);
      // Reset chọn slot khi đổi ngày
      appState.selectedSlot = '';
      if (selectedTimeSlotInput) selectedTimeSlotInput.value = '';
      timeSlotContainer?.querySelectorAll('.c-slot-btn').forEach(b => b.classList.remove('is-selected'));
    }
  });

  // 2. Sự kiện chọn Khung giờ (TimeSlot Button)
  timeSlotContainer?.querySelectorAll('.c-slot-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.disabled || btn.classList.contains('is-full')) return;

      timeSlotContainer.querySelectorAll('.c-slot-btn').forEach(b => b.classList.remove('is-selected'));
      btn.classList.add('is-selected');

      const slotVal = btn.getAttribute('data-slot');
      appState.selectedSlot = slotVal;
      if (selectedTimeSlotInput) selectedTimeSlotInput.value = slotVal;
    });
  });

  // 3. Bấm nút Chuyển từ Step 1 sang Step 2
  btnToStep2?.addEventListener('click', () => {
    const customerName = document.getElementById('customerName')?.value.trim();
    const phone = document.getElementById('phone')?.value.trim();
    const email = document.getElementById('email')?.value.trim();
    const date = dateInput?.value;
    const timeSlot = selectedTimeSlotInput?.value;
    const guests = document.getElementById('guests')?.value;
    const seatingType = form?.querySelector('input[name="seatingType"]:checked')?.value;
    const note = document.getElementById('note')?.value.trim();

    appState.formData = {
      customerName,
      phone,
      email,
      date,
      timeSlot,
      guests,
      seatingType,
      note
    };

    showStep2Review(appState.formData);
  });

  // 4. Bấm nút Quay lại Step 1
  btnBackToStep1?.addEventListener('click', () => {
    showStep1Form();
  });

  // 5. Submit Form ở Step 2 -> Gửi API tạo Đơn đặt bàn & Chuyển sang Step 3
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = document.getElementById('btn-submit-reservation');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = '予約中... (Đang xử lý...)';
    }

    try {
      const result = await createReservation(appState.formData);
      showStep3Success(result);
    } catch (error) {
      alert(`Đã có lỗi xảy ra: ${error.message}`);
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = '予約を確定する (Xác nhận đặt)';
      }
    }
  });

  // 6. Bấm nút Tạo Đơn Đặt Bàn Mới ở Step 3
  btnReset?.addEventListener('click', () => {
    form.reset();
    initDatePicker();
    showStep1Form();
  });
}
