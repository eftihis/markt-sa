window.initSidebar = function() {
    console.log('Initializing sidebar functionality');
    
    const elements = {
        sidebar: document.getElementById('sidebar'),
        overlay: document.getElementById('overlay'),
        toggleButton: document.getElementById('toggleButton'),
        wrapper: document.getElementById('parent-wrapper'),
        pageWrap: document.querySelector('.page_wrap')
    };
    
    let rangeSliderInitialized = false;
    let mobileInitialized = false;
    let desktopInitialized = false;
    let resizeTimeout;
    
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
        if (window.FsAttributes && window.FsAttributes.rangeslider) {
            // Force recalculation of slider dimensions
            window.FsAttributes.rangeslider.destroy();
            window.FsAttributes.rangeslider.init();
        }
    }
    
    // Debounced resize handler
    function handleResize() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if (elements.sidebar.classList.contains('is-open')) {
                reinitializeRangeSlider();
            }
        }, 250);
    }
    
    // Handle scroll events
    function handleScroll() {
        if (window.innerWidth < 992 && elements.sidebar.classList.contains('is-open')) {
            reinitializeRangeSlider();
        }
    }
    
    function toggleSidebar() {
        console.log('Toggling sidebar');
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
            setTimeout(initializeRangeSlider, 300);
        }
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
    
    // Add scroll and resize listeners
    const debouncedScroll = debounce(handleScroll, 100);
    window.addEventListener('scroll', debouncedScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    
    // Utility function for debouncing
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    console.log('Sidebar initialization complete');
};
console.log('Sidebar script loaded');
