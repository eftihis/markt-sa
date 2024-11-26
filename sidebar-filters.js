window.initSidebar = function() {
    console.log('Initializing sidebar functionality');
    
    const elements = {
        sidebar: document.getElementById('sidebar'),
        overlay: document.getElementById('overlay'),
        toggleButton: document.getElementById('toggleButton'),
        wrapper: document.getElementById('parent-wrapper'),
        pageWrap: document.querySelector('.page_wrap')
    };
    
    const ANIMATION_DURATION = 300;
    let rangeSliderInitialized = false;
    let mobileInitialized = false;
    let desktopInitialized = false;
    let resizeTimeout;
    let scrollTimeout;
    
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
        // Only reinitialize if sidebar is open
        if (!elements.sidebar.classList.contains('is-open')) return;

        // Force layout recalculation
        elements.sidebar.style.display = 'none';
        elements.sidebar.offsetHeight; // Force reflow
        elements.sidebar.style.display = '';

        setTimeout(() => {
            if (window.FsAttributes && window.FsAttributes.rangeslider) {
                // Get all range slider wrappers
                const wrappers = document.querySelectorAll('[fs-rangeslider-element="wrapper"]');
                wrappers.forEach(wrapper => {
                    // Force track width recalculation
                    const track = wrapper.querySelector('[fs-rangeslider-element="track"]');
                    if (track) {
                        const width = track.clientWidth;
                        track.style.width = `${width}px`;
                    }
                });

                window.FsAttributes.rangeslider.destroy();
                window.FsAttributes.rangeslider.init();
            }
        }, ANIMATION_DURATION);
    }
    
    function handleResize() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if (elements.sidebar.classList.contains('is-open')) {
                reinitializeRangeSlider();
            }
        }, ANIMATION_DURATION);
    }
    
    function handleScroll() {
        if (window.innerWidth < 992 && elements.sidebar.classList.contains('is-open')) {
            clearTimeout(scrollTimeout);
            // Use requestAnimationFrame to ensure smooth handling
            scrollTimeout = requestAnimationFrame(() => {
                reinitializeRangeSlider();
            });
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
            setTimeout(initializeRangeSlider, ANIMATION_DURATION);
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
    
    // Add scroll and resize listeners with improved handling
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    
    console.log('Sidebar initialization complete');
};
console.log('Sidebar script loaded');
