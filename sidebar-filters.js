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

        // For mobile/tablet: temporarily change positioning to allow correct calculations
        if (window.innerWidth < 992) {
            const scrollTop = window.pageYOffset;
            elements.sidebar.style.position = 'absolute';
            elements.sidebar.style.top = `${scrollTop}px`;
            
            // Force reflow
            elements.sidebar.offsetHeight;
        }

        if (window.FsAttributes && window.FsAttributes.rangeslider) {
            window.FsAttributes.rangeslider.destroy();
            window.FsAttributes.rangeslider.init();
            
            // Restore fixed positioning after initialization
            if (window.innerWidth < 992) {
                elements.sidebar.style.position = 'fixed';
                elements.sidebar.style.top = '0';
            }
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
    
    console.log('Sidebar initialization complete');
};
console.log('Sidebar script loaded');
