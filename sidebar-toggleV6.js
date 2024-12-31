window.initSidebar = function() {
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
    let touchStartY = 0;
    let touchCurrentY = 0;
    let isDragging = false;
    
    // Scroll Lock Utility
    const scrollLock = {
        scrollPosition: 0,
        
        enable() {
            // Store current scroll position
            this.scrollPosition = window.pageYOffset;
            
            // Add styles to prevent content shift
            const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
            
            document.body.style.position = 'fixed';
            document.body.style.top = `-${this.scrollPosition}px`;
            document.body.style.width = '100%';
            document.body.style.paddingRight = `${scrollBarWidth}px`;
            
            // iOS-specific fix
            if (/iPhone|iPad|iPod/.test(navigator.platform)) {
                document.body.style.height = '100vh';
                document.body.style.overflow = 'hidden';
            }
        },
        
        disable() {
            // Remove styles
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            document.body.style.paddingRight = '';
            document.body.style.height = '';
            document.body.style.overflow = '';
            
            // Restore scroll position
            window.scrollTo(0, this.scrollPosition);
        }
    };
    
    function toggleSidebar() {
        // Reset any transform before toggling
        elements.sidebar.style.transform = '';
        elements.overlay.style.opacity = '';
        
        elements.sidebar.classList.toggle('is-toggled');
        elements.overlay.classList.toggle('is-toggled');
        elements.parentWrap.classList.toggle('is-toggled');
        
        // Handle mobile scroll lock (under 478px)
        if (window.innerWidth <= MOBILE_BREAKPOINT) {
            if (elements.sidebar.classList.contains('is-toggled')) {
                scrollLock.enable();
            } else {
                scrollLock.disable();
            }
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
        if (e.key === 'Escape' && !elements.sidebar.classList.contains('is-toggled')) {
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
                scrollLock.disable();
            }
        }, 250);
    }, { passive: true });
    
    // Touch event listeners for the handle
    if (elements.handle) {
        elements.handle.addEventListener('touchstart', handleTouchStart);
        document.addEventListener('touchmove', handleTouchMove, { passive: true });
        document.addEventListener('touchend', handleTouchEnd);
    }

    // Simulate toggle click after initialization if above mobile breakpoint
    if (window.innerWidth > MOBILE_BREAKPOINT) {
        setTimeout(() => {
            elements.toggleButton.click();
        }, 100); // Small delay to ensure DOM is ready 
    }
};
