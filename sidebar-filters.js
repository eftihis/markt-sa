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
        
        elements.sidebar.style.transform = '';
        elements.overlay.style.opacity = '';
        elements.sidebarWrap.style.height = '';
        
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
        console.log('Touch start');
        if (window.innerWidth > MOBILE_BREAKPOINT) return;
        
        touchStartY = e.touches[0].clientY;
        isDragging = true;
        elements.sidebar.style.transition = 'none';
        elements.sidebarWrap.style.transition = 'none';
    }
    
    function handleTouchMove(e) {
        if (!isDragging) return;
        
        touchCurrentY = e.touches[0].clientY;
        const deltaY = touchCurrentY - touchStartY;
        
        console.log('Touch move:', {
            deltaY,
            isOpen: elements.sidebar.classList.contains('is-open'),
            currentHeight: elements.sidebarWrap.offsetHeight,
            windowHeight: window.innerHeight
        });
        
        if (deltaY < 0 && elements.sidebar.classList.contains('is-open')) {
            console.log('Attempting upward drag');
            const currentHeight = elements.sidebarWrap.offsetHeight;
            const newHeight = Math.min(currentHeight - deltaY, window.innerHeight);
            console.log('New height:', newHeight);
            elements.sidebarWrap.style.height = `${newHeight}px`;
        } else if (deltaY > 0) {
            const resistance = 0.4;
            elements.sidebar.style.transform = `translateY(${deltaY * resistance}px)`;
            elements.overlay.style.opacity = `${1 - Math.min(deltaY / 200, 1)}`;
        }
    }
    
    function handleTouchEnd() {
        if (!isDragging) return;
        isDragging = false;
        
        const deltaY = touchCurrentY - touchStartY;
        elements.sidebar.style.transition = '';
        elements.sidebarWrap.style.transition = 'height 0.3s ease';
        
        console.log('Touch end:', { deltaY });
        
        if (deltaY < 0) {
            const currentHeight = elements.sidebarWrap.offsetHeight;
            const defaultHeight = parseInt(getComputedStyle(elements.sidebarWrap).height);
            
            console.log('End heights:', {
                current: currentHeight,
                default: defaultHeight,
                window: window.innerHeight
            });
            
            if (currentHeight > (defaultHeight + window.innerHeight) / 2) {
                elements.sidebarWrap.style.height = `${window.innerHeight}px`;
            } else {
                elements.sidebarWrap.style.height = '';
            }
        } else if (deltaY > 100) {
            toggleSidebar();
        } else {
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
