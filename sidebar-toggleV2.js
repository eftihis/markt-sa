window.initSidebar = function() {
    console.log('Initializing sidebar functionality');
    
    const elements = {
        sidebar: document.getElementById('sidebar'),
        parentWrap: document.getElementById('parent-wrapper'),
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
    let scrollPosition = 0;
    
    function lockScroll() {
        // Store current scroll position
        scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add styles to prevent scroll and maintain position
        const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
        
        document.body.style.cssText = `
            overflow: hidden;
            position: fixed;
            top: -${scrollPosition}px;
            left: 0;
            right: 0;
            bottom: 0;
            padding-right: ${scrollBarWidth}px;
        `;
        
        elements.pageWrap.style.overflow = 'hidden';
    }
    
    function unlockScroll() {
        // Remove all scroll-locking styles
        document.body.style.cssText = '';
        elements.pageWrap.style.overflow = '';
        
        // Restore scroll position
        window.scrollTo(0, scrollPosition);
    }
    
    function initializeRangeSlider() {
        if (rangeSliderInitialized) return;
        
        const script = document.createElement('script');
        script.src = "https://cdn.jsdelivr.net/npm/@finsweet/attributes-rangeslider@1/rangeslider.js";
        document.body.appendChild(script);
        rangeSliderInitialized = true;
    }
    
    function toggleSidebar() {
        console.log('Toggling sidebar');
        
        // Reset any transform before toggling
        elements.sidebar.style.transform = '';
        elements.overlay.style.opacity = '';
        
        const isOpening = !elements.sidebar.classList.contains('is-open');
        
        elements.sidebar.classList.toggle('is-open');
        elements.overlay.classList.toggle('is-open');
        elements.parentWrap.classList.toggle('is-open');
        
        // Handle scroll lock
        if (window.innerWidth <= MOBILE_BREAKPOINT) {
            if (isOpening) {
                lockScroll();
            } else {
                unlockScroll();
            }
        }
        
        // Initialize range slider on first open
        if (isOpening) {
            setTimeout(initializeRangeSlider, ANIMATION_DURATION);
        }
    }
    
    // Touch event handlers for swipe
    function handleTouchStart(e) {
        touchStartY = e.touches[0].clientY;
        isDragging = true;
        elements.sidebar.style.transition = 'none';
        elements.overlay.style.transition = 'opacity 0.15s ease';
    }
    
    function handleTouchMove(e) {
        if (!isDragging) return;
        
        touchCurrentY = e.touches[0].clientY;
        const deltaY = touchCurrentY - touchStartY;
        
        // Only allow dragging downward
        if (deltaY < 0) return;
        
        // Add resistance to the drag
        const resistance = 0.4;
        const transform = `translateY(${deltaY * resistance}px)`;
        elements.sidebar.style.transform = transform;
        
        // Adjust overlay opacity based on drag distance
        const maxDrag = 200;
        const opacity = 1 - Math.min(deltaY / maxDrag, 1);
        elements.overlay.style.opacity = opacity;
    }
    
    function handleTouchEnd() {
        if (!isDragging) return;
        isDragging = false;
        
        const deltaY = touchCurrentY - touchStartY;
        elements.sidebar.style.transition = '';
        
        // If dragged more than 100px down, close the sidebar
        if (deltaY > 100) {
            toggleSidebar();
        } else {
            // Reset position with animation
            elements.sidebar.style.transform = '';
            elements.overlay.style.opacity = '';
        }
        
        touchStartY = 0;
        touchCurrentY = 0;
    }
    
    // Event Listeners
    elements.toggleButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleSidebar();
    });
    
    elements.overlay.addEventListener('click', toggleSidebar);
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && elements.sidebar.classList.contains('is-open')) {
            toggleSidebar();
        }
    });
    
    // Handle resize events
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Reset sidebar position and styles on resize
            elements.sidebar.style.transform = '';
            elements.overlay.style.opacity = '';
            
            // Reset scroll lock if we resize above mobile breakpoint
            if (window.innerWidth > MOBILE_BREAKPOINT && elements.sidebar.classList.contains('is-open')) {
                unlockScroll();
            }
        }, 250);
    }, { passive: true });
    
    // Touch event listeners for the handle
    if (elements.handle) {
        elements.handle.addEventListener('touchstart', handleTouchStart);
        document.addEventListener('touchmove', handleTouchMove, { passive: true });
        document.addEventListener('touchend', handleTouchEnd);
    }
};