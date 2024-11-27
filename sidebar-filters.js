window.initSidebar = function() {
    console.log('Initializing sidebar functionality');
    
    const elements = {
        sidebar: document.getElementById('sidebar'),
        overlay: document.getElementById('overlay'),
        toggleButton: document.getElementById('toggleButton'),
        handle: document.getElementById('sidebar-handle'),
        pageWrap: document.querySelector('.page_wrap')
    };
    
    const MOBILE_BREAKPOINT = 478;
    const ANIMATION_DURATION = 300;
    let rangeSliderInitialized = false;
    let touchStartY = 0;
    let touchCurrentY = 0;
    let isDragging = false;
    
    // Store initial scroll position
    let scrollPosition = 0;
    
    function lockScroll() {
        // Store current scroll position
        scrollPosition = window.pageYOffset;
        // Apply fixed positioning to maintain scroll position
        elements.pageWrap.style.position = 'fixed';
        elements.pageWrap.style.top = `-${scrollPosition}px`;
        elements.pageWrap.style.left = '0';
        elements.pageWrap.style.right = '0';
        elements.pageWrap.style.overflow = 'hidden';
    }
    
    function unlockScroll() {
        // Remove fixed positioning
        elements.pageWrap.style.position = '';
        elements.pageWrap.style.top = '';
        elements.pageWrap.style.left = '';
        elements.pageWrap.style.right = '';
        elements.pageWrap.style.overflow = '';
        // Restore scroll position
        window.scrollTo(0, scrollPosition);
    }

    function toggleSidebar() {
        console.log('Toggling sidebar');
        
        // Reset any transform before toggling
        elements.sidebar.style.transform = '';
        elements.overlay.style.opacity = '';
        
        elements.sidebar.classList.toggle('is-open');
        elements.overlay.classList.toggle('is-open');
        
        // Handle mobile scroll lock (under 478px)
        if (window.innerWidth <= MOBILE_BREAKPOINT) {
            if (elements.sidebar.classList.contains('is-open')) {
                lockScroll();
            } else {
                unlockScroll();
            }
        }
        
        // Initialize range slider on first open
        if (elements.sidebar.classList.contains('is-open')) {
            setTimeout(initializeRangeSlider, ANIMATION_DURATION);
        }
    }
    
    // Rest of the code remains the same...
    
    // Update resize handler to properly handle scroll locking
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Reset sidebar position and styles on resize
            elements.sidebar.style.transform = '';
            elements.overlay.style.opacity = '';
            
            // Reset pageWrap styles if we resize above mobile breakpoint
            if (window.innerWidth > MOBILE_BREAKPOINT) {
                unlockScroll();
            } else if (elements.sidebar.classList.contains('is-open')) {
                // Re-apply scroll lock if sidebar is open and we're below breakpoint
                lockScroll();
            }
        }, 250);
    }, { passive: true });
    
    // Original event listeners remain the same...
};
