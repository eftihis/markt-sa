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
        
        // Toggle classes for all elements that need them
        elements.sidebar.classList.toggle('is-open');
        elements.overlay.classList.toggle('is-open');
        elements.pageWrap.classList.toggle('is-open');
        
        // Handle mobile scroll lock (under 478px)
        if (window.innerWidth <= MOBILE_BREAKPOINT) {
            if (elements.pageWrap.classList.contains('is-open')) {
                elements.pageWrap.style.overflow = 'hidden';
            } else {
                elements.pageWrap.style.overflow = '';
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
        elements.sidebar
