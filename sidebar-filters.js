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
    const ANIMATION_DURATION = 300;
    let rangeSliderInitialized = false;
    let touchStartY = 0;
    let touchCurrentY = 0;
    let isDragging = false;
    
    function initializeRangeSlider() {
        if (rangeSliderInitialized) return;
        
        const script = document.createElement('script');
        script.src = "https://cdn.jsdelivr.net/npm/@finsweet/attributes-rangeslider@1/rangeslider.js";
        document.body.appendChild(script);
        rangeSliderInitialized = true;
    }
    
    function toggleSidebar() {
        console.log('Toggling sidebar');
        
        // Reset any transform and heights
        elements.sidebar.style.transform = '';
        elements.overlay.style.opacity = '';
        elements.sidebarWrap.style.height = ''; // Reset to CSS default (35rem)
        
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
        isDragging = true;
        
        // Remove transitions for smooth dragging
        elements.sidebarWrap.style.transition = 'none';
    }
    
    function handleTouchMove(e) {
        if (!isDragging) return;
        
        touchCurrentY = e.touches[0].clientY;
        const deltaY = touchCurrentY - touchStartY;
        
        if (deltaY < 0 && elements.sidebar.classList.contains('is-open')) {
            // Dragging upward when sidebar is open
            const currentHeight = elements.sidebarWrap.offsetHeight;
            const newHeight = Math.min(currentHeight - deltaY, window.innerHeight);
            elements.sidebarWrap.style.height = `${newHeight}px`;
        } else if (deltaY > 0) {
            // Dragging downward
            const resistance = 0.4;
            const transform = `translateY(${deltaY * resistance}px)`;
            elements.sidebar.style.transform = transform;
            
            const maxDrag = 200;
            const opacity = 1 - Math.min(deltaY / maxDrag, 1);
            elements.overlay.style.opacity = opacity;
        }
    }
    
    function handleTouchEnd() {
        if (!isDragging) return;
        isDragging = false;
        
        const deltaY = touchCurrentY - touchStartY;
        
        // Reset transitions
        elements.sidebarWrap.style.transition = '';
        
        if (deltaY < 0) {
            // Was dragging upward
            const currentHeight = elements.sidebarWrap.offsetHeight;
            const defaultHeight = parseInt(getComputedStyle(elements.sidebarWrap).height);
            
            // If dragged more than halfway to full height, snap to full
            if (currentHeight > (defaultHeight + window.innerHeight) / 2) {
                elements.sidebarWrap.style.height = `${window.innerHeight}px`;
            } else {
                elements.sidebarWrap.style.height = ''; // Reset to default (35rem)
            }
        } else if (deltaY > 100) {
            toggleSidebar();
        } else {
            // Reset position
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
    
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            elements.sidebar.style.transform = '';
            elements.overlay.style.opacity = '';
            elements.sidebarWrap.style.height = '';
            
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
