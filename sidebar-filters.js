console.log('Sidebar filters script loaded');

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM Content Loaded');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');
  const toggleButton = document.getElementById('toggleButton');
  const wrapper = document.getElementById('parent-wrapper');
  const pageWrap = document.querySelector('.page_wrap');

  let rangeSliderInitialized = false;
  let mobileInitialized = false;
  let desktopInitialized = false;
  function initializeRangeSlider() {
    // Only initialize once for each screen size
    if (window.innerWidth < 992 && mobileInitialized) return;
    if (window.innerWidth >= 992 && desktopInitialized) return;
    if (!rangeSliderInitialized) {
      const script = document.createElement('script');
      script.src = "https://cdn.jsdelivr.net/npm/@finsweet/attributes-rangeslider@1/rangeslider.js";
      document.body.appendChild(script);
      rangeSliderInitialized = true;
    } else {
      if (window.FsAttributes && window.FsAttributes.rangeslider) {
        window.FsAttributes.rangeslider.init();
      }
    }
    // Mark as initialized for current screen size
    if (window.innerWidth < 992) {
      mobileInitialized = true;
    } else {
      desktopInitialized = true;
    }
  }
  function toggleSidebar() {
    sidebar.classList.toggle('is-open');
    overlay.classList.toggle('is-open');
    wrapper.classList.toggle('is-open');
    // Handle scroll lock only on tablet and below
    if (window.innerWidth < 992) {
      if (sidebar.classList.contains('is-open')) {
        pageWrap.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';
      } else {
        pageWrap.style.overflow = '';
        document.body.style.overflow = '';
      }
    }
    // Initialize range slider only if not already initialized for this screen size
    if (sidebar.classList.contains('is-open')) {
      setTimeout(initializeRangeSlider, 300);
    }
  }
  toggleButton.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSidebar();
  }); 

  overlay.addEventListener('click', toggleSidebar);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && window.innerWidth >= 992) {
      toggleSidebar();
    }
  });
});
