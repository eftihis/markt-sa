document.addEventListener('DOMContentLoaded', () => {
  // Cache selectors using const for better performance
  const elements = {
    navButton: document.querySelector('.nav_button'),
    navMenu: document.querySelector('.nav_menu_wrap'),
    overlay: document.querySelector('.navbar_overlay'),
    pageWrap: document.querySelector('.page_wrap'),
    mainWrap: document.querySelector('.main_wrap'),
    hamburgerLines: document.querySelectorAll('.hamburger_7_line'),
    menuLinksWrap: document.querySelectorAll('.nav_item_wrap'),
    menuLinks: document.querySelectorAll('.nav_item')
  };

  // Use WeakMap to store animation timeouts
  const timeouts = new WeakMap();

  // Constants
  const ANIMATION_BASE_DELAY = 150;
  const ANIMATION_STAGGER = 50;
  const CLASSES = {
    OPEN: 'is-open',
    SHRUNK: 'is-shrunk'
  };

  // Use requestAnimationFrame for smoother animations
  function toggleElementClass(element, className) {
    requestAnimationFrame(() => {
      element.classList.toggle(className);
    });
  }

  // Clear existing timeouts before setting new ones
  function clearElementTimeouts(elements) {
    elements.forEach(element => {
      const timeout = timeouts.get(element);
      if (timeout) {
        clearTimeout(timeout);
        timeouts.delete(element);
      }
    });
  }

  function setStaggeredAnimations(elements, className) {
    clearElementTimeouts(elements);
    
    elements.forEach((element, index) => {
      const timeout = setTimeout(() => {
        toggleElementClass(element, className);
        timeouts.delete(element);
      }, ANIMATION_BASE_DELAY + (index * ANIMATION_STAGGER));
      
      timeouts.set(element, timeout);
    });
  }

  function toggleNav() {
    const isOpening = !elements.navMenu.classList.contains(CLASSES.OPEN);

    // Toggle main elements
    toggleElementClass(elements.navMenu, CLASSES.OPEN);
    toggleElementClass(elements.overlay, CLASSES.OPEN);
    toggleElementClass(elements.mainWrap, CLASSES.SHRUNK);

    // Toggle hamburger lines
    elements.hamburgerLines.forEach(line => {
      toggleElementClass(line, CLASSES.OPEN);
    });

    // Handle staggered animations
    setStaggeredAnimations(elements.menuLinksWrap, CLASSES.OPEN);
    setStaggeredAnimations(elements.menuLinks, CLASSES.OPEN);

    // Handle scroll
    const scrollState = isOpening ? 'hidden' : '';
    elements.pageWrap.style.overflow = scrollState;
    document.body.style.overflow = scrollState;
  }

  // Event delegation for better performance
  function handleClick(e) {
    e.preventDefault();
    e.stopPropagation();
    toggleNav();
  }

  // Event Listeners with passive option where applicable
  elements.navButton.addEventListener('click', handleClick);
  elements.overlay.addEventListener('click', handleClick);

  // Use passive event listener for better scroll performance
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && elements.navMenu.classList.contains(CLASSES.OPEN)) {
      toggleNav();
    }
  }, { passive: true });
});
