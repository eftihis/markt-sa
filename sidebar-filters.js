window.initSidebar = function() {
    console.log('Initializing sidebar functionality');
    
    const elements = {
        sidebar: document.getElementById('sidebar'),
        overlay: document.getElementById('overlay'),
        toggleButton: document.getElementById('toggleButton'),
        wrapper: document.getElementById('parent-wrapper'),
        pageWrap: document.querySelector('.page_wrap'),
        handle: document.getElementById('sidebar-handle') // Updated ID
    };
    
    const ANIMATION_DURATION = 300;
    let rangeSliderInitialized = false;
    let mobileInitialized = false;
    let desktopInitialized = false;
    let touchStartY = 0;
    let touchCurrentY = 0;
    let isDragging = false;
    
    function initializeRangeSlider() {
        if (window.innerWidth < 992 && mobileInitialized) return;
        if (window.innerWidth >= 992 && desktopInitialized) return;
        
        if (!rangeSliderInitialized) {
            const script = document.createElement('script');
            script.src = "https://cdn.jsdelivr.net/npm/@finsweet/attributes-rangeslider@1/rangeslider.js";
            document.body.appendChild(script);
            rangeSliderInitialized = true;
        } else {
            reinitializeRangeSlider();
        }
        
        if (window.innerWidth < 992) {
            mobileInitialized = true;
        } else {
            desktopInitialized = true;
        }
    }
    
    function reinitializeRangeSlider() {
        if (!elements.sidebar.classList.contains('is-open')) return;

        if (window.FsAttributes && window.FsAttributes.rangeslider) {
            window.FsAttributes.rangeslider.destroy();
            window.FsAttributes.rangeslider.init();
        }
    }
    
    function toggleSidebar() {
        console.log('Toggling sidebar');
        
        // Reset any transform before toggling
        elements.sidebar.style.transform = '';
        elements.overlay.style.opacity = '';
        
        elements.sidebar.classList.toggle('is-open');
        elements.overlay.classList.toggle('is-open');
        elements.wrapper.classList.toggle('is-open');
        
        if (window.innerWidth < 992) {
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
    
    // Touch event handlers
    function handleTouchStart(e) {
        if (window.innerWidth >= 992) return;
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
        console.log('Toggle clicked');
        e.preventDefault();
        e.stopPropagation();
        toggleSidebar();
    });
    
    elements.overlay.addEventListener('click', () => {
        toggleSidebar();
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && window.innerWidth >= 992) {
            toggleSidebar();
        }
    });
    
    // Touch event listeners for the handle
    if (elements.handle) {
        elements.handle.addEventListener('touchstart', handleTouchStart);
        document.addEventListener('touchmove', handleTouchMove, { passive: true });
        document.addEventListener('touchend', handleTouchEnd);
    }
    
    console.log('Sidebar initialization complete');
};
console.log('Sidebar script loaded');
