window.initSidebar = function() {
    console.log('Initializing sidebar functionality');
    
    const elements = {
        sidebar: document.getElementById('sidebar'),
        overlay: document.getElementById('overlay'),
        toggleButton: document.getElementById('toggleButton'),
        handle: document.getElementById('sidebar-handle'),
        pageWrap: document.querySelector('.page_wrap'),
        sidebarWrap: document.querySelector('.sidebar_wrap') // Add sidebar wrap reference
    };
    
    const MOBILE_BREAKPOINT = 478;
    const ANIMATION_DURATION = 300;
    let rangeSliderInitialized = false;
    let touchStartY = 0;
    let touchCurrentY = 0;
    let startHeight = 0;
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
        
        // Reset any transform and states
        elements.sidebar.style.transform = '';
        elements.overlay.style.opacity = '';
        elements.sidebarWrap.style.height = '';
        isFullHeight = false;
        
        elements.sidebar.classList.toggle('is-open');
        elements.overlay.classList.toggle('is-open');
        
        if (window.innerWidth <= MOBILE_BREAKPOINT) {
            if (elements.sidebar.classList.contains('is-open')) {
                elements.pageWrap.style.overflow = 'hidden';
                document.body.style.overflow = 'hidden';
            } else {
                elements.pageWrap.style.overflow = '';
                document.body.style.overflow = '';
            }
        }
        
        if (elements.sidebar.classList.contains('is-open')) {
            setTimeout(initializeRangeSlider, ANIMATION_DURATION);
        }
    }
    
    function handleTouchStart(e) {
        if (window.innerWidth > MOBILE_BREAKPOINT) return;
        
        touchStartY = e.touches[0].clientY;
        startHeight = elements.sidebarWrap.offsetHeight;
        isDragging = true;
        elements.sidebar.style.transition = 'none';
        elements.overlay.style.transition = 'opacity 0.15s ease';
        elements.sidebarWrap.style.transition = 'none';
    }
    
    function handleTouchMove(e) {
        if (!isDragging) return;
        
        touchCurrentY = e.touches[0].clientY;
        const deltaY = touchCurrentY - touchStartY;
        
        if (deltaY < 0) {
            // Dragging upward
            const fullHeight = window.innerHeight;
            const currentHeight = startHeight - deltaY;
            const height = Math.min(currentHeight, fullHeight);
            elements.sidebarWrap.style.height = `${height}px`;
            
            // Adjust overlay opacity based on height
            const opacity = 0.6 + (0.4 * (height / fullHeight));
            elements.overlay.style.opacity = opacity;
        } else {
            // Dragging downward
            if (isFullHeight) {
                // If currently full height, first return to mid position
                const fullHeight = window.innerHeight;
                const defaultHeight = 35 * 16; // 35rem in pixels
                const currentHeight = fullHeight - deltaY;
                
                if (currentHeight < defaultHeight) {
                    elements.sidebarWrap.style.height = `${defaultHeight}px`;
                    isFullHeight = false;
                } else {
                    elements.sidebarWrap.style.height = `${currentHeight}px`;
                }
            } else {
                // Normal downward drag for closing
                elements.sidebar.style.transform = `translateY(${deltaY * 0.4}px)`;
                elements.overlay.style.opacity = 1 - Math.min(deltaY / 200, 1);
            }
        }
    }
    
    function handleTouchEnd() {
        if (!isDragging) return;
        isDragging = false;
        
        const deltaY = touchCurrentY - touchStartY;
        elements.sidebar.style.transition = '';
        elements.overlay.style.transition = '';
        elements.sidebarWrap.style.transition = 'height 0.3s ease';
        
        if (deltaY < 0) {
            // Was dragging upward
            const currentHeight = elements.sidebarWrap.offsetHeight;
            const fullHeight = window.innerHeight;
            const defaultHeight = 35 * 16; // 35rem in pixels
            
            // If dragged more than halfway to full height, snap to full
            if (currentHeight > (defaultHeight + fullHeight) / 2) {
                elements.sidebarWrap.style.height = `${fullHeight}px`;
                isFullHeight = true;
            } else {
                elements.sidebarWrap.style.height = `${defaultHeight}px`;
                isFullHeight = false;
            }
        } else {
            // Was dragging downward
            if (isFullHeight) {
                const currentHeight = elements.sidebarWrap.offsetHeight;
                const defaultHeight = 35 * 16;
                
                // If dragged more than halfway to default height, snap to default
                if (currentHeight < (window.innerHeight + defaultHeight) / 2) {
                    elements.sidebarWrap.style.height = `${defaultHeight}px`;
                    isFullHeight = false;
                } else {
                    elements.sidebarWrap.style.height = `${window.innerHeight}px`;
                }
            } else if (deltaY > 100) {
                // Close if dragged down enough
                toggleSidebar();
            } else {
                // Reset position
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
    
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            elements.sidebar.style.transform = '';
            elements.overlay.style.opacity = '';
            elements.sidebarWrap.style.height = '';
            isFullHeight = false;
            
            if (window.innerWidth > MOBILE_BREAKPOINT) {
                elements.pageWrap.style.overflow = '';
            }
        }, 250);
    }, { passive: true });
    
    if (elements.handle) {
        elements.handle.addEventListener('touchstart', handleTouchStart);
        document.addEventListener('touchmove', handleTouchMove, { passive: true });
        document.addEventListener('touchend', handleTouchEnd);
    }
};
