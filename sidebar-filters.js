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
    let scrollPosition = 0;
    
    function initializeRangeSlider() {
        if (rangeSliderInitialized) return;
        
        const script = document.createElement('script');
        script.src = "https://cdn.jsdelivr.net/npm/@finsweet/attributes-rangeslider@1/rangeslider.js";
        document.body.appendChild(script);
        rangeSliderInitialized = true;
    }
    
    function lockScroll() {
        // Store current scroll position
        scrollPosition = window.pageYOffset;
        
        // Add styles to prevent scroll
        const scrollLockStyles = {
            overflow: 'hidden',
            position: 'fixed',
            top: `-${scrollPosition}px`,
            width: '100%'
        };
        
        // Apply styles to both body and pageWrap
        Object.assign(document.body.style, scrollLockStyles);
        Object.assign(elements.pageWrap.style, {
            overflow: 'hidden',
            position: 'relative'
        });
        
        // Prevent touchmove on document when sidebar is open
        document.addEventListener('touchmove', preventScroll, { passive: false });
    }
    
    function unlockScroll() {
        // Remove scroll lock styles
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        elements.pageWrap.style.overflow = '';
        elements.pageWrap.style.position = '';
        
        // Restore scroll position
        window.scrollTo(0, scrollPosition);
        
        // Remove touchmove prevention
        document.removeEventListener('touchmove', preventScroll);
    }
    
    function preventScroll(e) {
        // Allow scrolling within the sidebar
        if (elements.sidebar.contains(e.target)) return;
        e.preventDefault();
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
            if (window.innerWidth > MOBILE_BREAKPOINT) {
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
