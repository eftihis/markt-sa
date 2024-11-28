window.initSidebar = function() {
    console.log('Initializing sidebar functionality');
    
    const elements = {
        sidebar: document.getElementById('sidebar'),
        overlay: document.getElementById('overlay'),
        toggleButton: document.getElementById('toggleButton'),
        handle: document.getElementById('sidebar-handle'),
        pageWrap: document.querySelector('.page_wrap'),
        sidebarWrap: document.querySelector('.sidebar_wrap')
    };
    
    const MOBILE_BREAKPOINT = 478;
    const ANIMATION_DURATION = 200;
    const DEFAULT_HEIGHT = 35 * 16; // 35rem in pixels
    let rangeSliderInitialized = false;
    let touchStartY = 0;
    let touchCurrentY = 0;
    let isDragging = false;
    let isFullHeight = false;
    
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
        elements.sidebarWrap.style.height = '';
        isFullHeight = false;
        
        elements.sidebar.classList.toggle('is-open');
        elements.overlay.classList.toggle('is-open');
        
        // Handle mobile scroll lock (under 478px)
        if (window.innerWidth <= MOBILE_BREAKPOINT) {
            if (elements.sidebar.classList.contains('is-open')) {
                elements.pageWrap.style.overflow = 'clip';
                document.body.style.overflow = 'hidden';
            } else {
                elements.pageWrap.style.overflow = '';
                document.body.style.overflow = '';
            }
        }
        
        // Initialize range slider on first open
        if (elements.sidebar.classList.contains('is-open')) {
            setTimeout(initializeRangeSlider, ANIMATION_DURATION);
        }
    }
    
    function handleTouchStart(e) {
        touchStartY = e.touches[0].clientY;
        isDragging = true;
        elements.sidebar.style.transition = 'none';
        elements.sidebarWrap.style.transition = 'none';
        elements.overlay.style.transition = 'opacity 0.15s ease';
    }
    
    function handleTouchMove(e) {
        if (!isDragging) return;
        
        touchCurrentY = e.touches[0].clientY;
        const deltaY = touchCurrentY - touchStartY;
        
        if (deltaY < 0 && elements.sidebar.classList.contains('is-open')) {
            // Make upward drag less sensitive
            const resistance = 0.3; // Add resistance to upward movement
            const currentHeight = isFullHeight ? window.innerHeight : DEFAULT_HEIGHT;
            const newHeight = Math.min(currentHeight - (deltaY * resistance), window.innerHeight);
            elements.sidebarWrap.style.height = `${newHeight}px`;

            // Adjust overlay opacity based on height
            const maxHeight = window.innerHeight;
            const opacity = 0.6 + (0.4 * (newHeight / maxHeight));
            elements.overlay.style.opacity = opacity;
        } else if (deltaY > 0) {
            if (isFullHeight) {
                // If at full height, first return to default height
                const resistance = 0.3; // Add resistance to downward movement too
                const fullHeight = window.innerHeight;
                const currentHeight = fullHeight - (deltaY * resistance);
                
                if (currentHeight < DEFAULT_HEIGHT) {
                    elements.sidebarWrap.style.height = `${DEFAULT_HEIGHT}px`;
                    isFullHeight = false;
                } else {
                    elements.sidebarWrap.style.height = `${currentHeight}px`;
                }
                // Prevent closing while transitioning from full height
                return;
            } else {
                // Normal downward drag for closing
                const resistance = 0.4;
                elements.sidebar.style.transform = `translateY(${deltaY * resistance}px)`;
                elements.overlay.style.opacity = 1 - Math.min(deltaY / 200, 1);
            }
        }
    }
    
    function handleTouchEnd() {
        if (!isDragging) return;
        isDragging = false;
        
        const deltaY = touchCurrentY - touchStartY;
        elements.sidebar.style.transition = '';
        elements.sidebarWrap.style.transition = 'height 0.3s ease';
        
        if (deltaY < 0) {
            // Was dragging upward
            const currentHeight = elements.sidebarWrap.offsetHeight;
            
            // Require more dragging to snap to full height (75% instead of 50%)
            if (currentHeight > (DEFAULT_HEIGHT + (window.innerHeight - DEFAULT_HEIGHT) * 0.75)) {
                elements.sidebarWrap.style.height = `${window.innerHeight}px`;
                isFullHeight = true;
            } else {
                elements.sidebarWrap.style.height = '';
                isFullHeight = false;
            }
        } else if (deltaY > 0) {
            if (isFullHeight) {
                // If dragged down from full height
                const currentHeight = elements.sidebarWrap.offsetHeight;
                // Require less dragging to snap to default (25% instead of 50%)
                if (currentHeight < (window.innerHeight - (window.innerHeight - DEFAULT_HEIGHT) * 0.25)) {
                    elements.sidebarWrap.style.height = '';
                    isFullHeight = false;
                } else {
                    elements.sidebarWrap.style.height = `${window.innerHeight}px`;
                }
            } else if (deltaY > 100) {
                toggleSidebar();
            } else {
                elements.sidebar.style.transform = '';
                elements.overlay.style.opacity = '';
            }
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
            if (isFullHeight) {
                elements.sidebarWrap.style.height = `${window.innerHeight}px`;
            } else {
                elements.sidebarWrap.style.height = '';
            }
            elements.sidebar.style.transform = '';
            elements.overlay.style.opacity = '';
            
            // Reset pageWrap overflow if we resize above mobile breakpoint
            if (window.innerWidth > MOBILE_BREAKPOINT) {
                elements.pageWrap.style.overflow = '';
                isFullHeight = false;
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
