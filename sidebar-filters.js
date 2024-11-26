console.log('Sidebar code starting - DEBUG VERSION');

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded - Starting element check');
    
    // Check each element individually and log details
    const sidebar = document.getElementById('sidebar');
    console.log('Sidebar element:', sidebar);

    const overlay = document.getElementById('overlay');
    console.log('Overlay element:', overlay);

    const toggleButton = document.getElementById('toggleButton');
    console.log('Toggle button:', toggleButton);

    const wrapper = document.getElementById('parent-wrapper');
    console.log('Wrapper:', wrapper);

    const pageWrap = document.querySelector('.page_wrap');
    console.log('Page wrap:', pageWrap);

    // Exit if any elements are missing
    if (!sidebar || !overlay || !toggleButton || !wrapper || !pageWrap) {
        console.error('Missing required elements - cannot initialize sidebar');
        console.log('Required elements status:', {
            sidebar: !!sidebar,
            overlay: !!overlay,
            toggleButton: !!toggleButton,
            wrapper: !!wrapper,
            pageWrap: !!pageWrap
        });
        return;
    }

    console.log('All elements found - initializing functionality');

    let rangeSliderInitialized = false;
    let mobileInitialized = false;
    let desktopInitialized = false;

    function initializeRangeSlider() {
        console.log('Initializing range slider');
        console.log('Window width:', window.innerWidth);
        console.log('Mobile initialized:', mobileInitialized);
        console.log('Desktop initialized:', desktopInitialized);

        // Only initialize once for each screen size
        if (window.innerWidth < 992 && mobileInitialized) {
            console.log('Mobile already initialized - skipping');
            return;
        }
        if (window.innerWidth >= 992 && desktopInitialized) {
            console.log('Desktop already initialized - skipping');
            return;
        }

        if (!rangeSliderInitialized) {
            console.log('Loading rangeslider script for first time');
            const script = document.createElement('script');
            script.src = "https://cdn.jsdelivr.net/npm/@finsweet/attributes-rangeslider@1/rangeslider.js";
            script.onload = () => console.log('Rangeslider script loaded successfully');
            script.onerror = (e) => console.error('Error loading rangeslider script:', e);
            document.body.appendChild(script);
            rangeSliderInitialized = true;
        } else {
            console.log('Reinitializing existing rangeslider');
            if (window.FsAttributes && window.FsAttributes.rangeslider) {
                console.log('FsAttributes found, initializing rangeslider');
                window.FsAttributes.rangeslider.init();
            } else {
                console.warn('FsAttributes or rangeslider not found');
            }
        }

        // Mark as initialized for current screen size
        if (window.innerWidth < 992) {
            console.log('Marking mobile as initialized');
            mobileInitialized = true;
        } else {
            console.log('Marking desktop as initialized');
            desktopInitialized = true;
        }
    }

    function toggleSidebar() {
        console.log('Toggle sidebar called');
        console.log('Current sidebar state:', {
            isOpen: sidebar.classList.contains('is-open'),
            windowWidth: window.innerWidth
        });

        sidebar.classList.toggle('is-open');
        overlay.classList.toggle('is-open');
        wrapper.classList.toggle('is-open');

        // Handle scroll lock only on tablet and below
        if (window.innerWidth < 992) {
            console.log('Handling mobile scroll lock');
            if (sidebar.classList.contains('is-open')) {
                pageWrap.style.overflow = 'hidden';
                document.body.style.overflow = 'hidden';
                console.log('Scroll locked');
            } else {
                pageWrap.style.overflow = '';
                document.body.style.overflow = '';
                console.log('Scroll unlocked');
            }
        }

        // Initialize range slider only if not already initialized for this screen size
        if (sidebar.classList.contains('is-open')) {
            console.log('Sidebar opened - initializing range slider after delay');
            setTimeout(() => {
                console.log('Delayed range slider initialization starting');
                initializeRangeSlider();
            }, 300);
        }

        console.log('Sidebar toggle complete');
    }

    // Event Listeners
    console.log('Setting up event listeners');

    toggleButton.addEventListener('click', (e) => {
        console.log('Toggle button clicked');
        e.preventDefault();
        e.stopPropagation();
        toggleSidebar();
    });

    overlay.addEventListener('click', () => {
        console.log('Overlay clicked');
        toggleSidebar();
    });

    document.addEventListener('keydown', (e) => {
        console.log('Key pressed:', e.key);
        if (e.key === 'Escape' && window.innerWidth >= 992) {
            console.log('Escape pressed on desktop - toggling sidebar');
            toggleSidebar();
        }
    });

    console.log('Sidebar initialization complete');
});

// Log any global errors
window.onerror = function(msg, url, lineNo, columnNo, error) {
    console.error('Global error:', {
        message: msg,
        url: url,
        line: lineNo,
        column: columnNo,
        error: error
    });
    return false;
};

console.log('Script loaded completely');
