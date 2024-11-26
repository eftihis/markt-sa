console.log('Sidebar code starting');

document.addEventListener('DOMContentLoaded', () => {
    console.log('Checking elements:');
    
    // Check each element
    const elements = {
        sidebar: document.getElementById('sidebar'),
        overlay: document.getElementById('overlay'),
        toggleButton: document.getElementById('toggleButton'),
        wrapper: document.getElementById('parent-wrapper'),
        pageWrap: document.querySelector('.page_wrap')
    };

    // Log what we found
    console.log('Elements found:', {
        sidebar: elements.sidebar ? 'Found' : 'Missing',
        overlay: elements.overlay ? 'Found' : 'Missing',
        toggleButton: elements.toggleButton ? 'Found' : 'Missing',
        wrapper: elements.wrapper ? 'Found' : 'Missing',
        pageWrap: elements.pageWrap ? 'Found' : 'Missing'
    });

    // Only continue if all elements exist
    if (!elements.sidebar || !elements.overlay || !elements.toggleButton || 
        !elements.wrapper || !elements.pageWrap) {
        console.log('Missing required elements - cannot initialize sidebar');
        return;
    }

    let rangeSliderInitialized = false;
    let mobileInitialized = false;
    let desktopInitialized = false;

    function initializeRangeSlider() {
        console.log('Initializing range slider');
        // Only initialize once for each screen size
        if (window.innerWidth < 992 && mobileInitialized) return;
        if (window.innerWidth >= 992 && desktopInitialized) return;

        if (!rangeSliderInitialized) {
            console.log('Loading rangeslider script');
            const script = document.createElement('script');
            script.src = "https://cdn.jsdelivr.net/npm/@finsweet/attributes-rangeslider@1/rangeslider.js";
            document.body.appendChild(script);
            rangeSliderInitialized = true;
        } else {
            console.log('Reinitializing existing rangeslider');
            if (window.FsAttributes && window.FsAttributes.rangeslider) {
                window.FsAttributes.rangeslider.init();
            }
        }
        // Mark as initialized for current screen size
        if (window.innerWidth < 992) {
            mobileInitialized = true;
        } else {
            desktopInitialized = true;
        }
    }

    function toggleSidebar() {
        console.log('Toggling sidebar');
        elements.sidebar.classList.toggle('is-open');
        elements.overlay.classList.toggle('is-open');
        elements.wrapper.classList.toggle('is-open');

        // Handle scroll lock only on tablet and below
        if (window.innerWidth < 992) {
            if (elements.sidebar.classList.contains('is-open')) {
                elements.pageWrap.style.overflow = 'hidden';
                document.body.style.overflow = 'hidden';
            } else {
                elements.pageWrap.style.overflow = '';
                document.body.style.overflow = '';
            }
        }

        // Initialize range slider only if not already initialized for this screen size
        if (elements.sidebar.classList.contains('is-open')) {
            setTimeout(initializeRangeSlider, 300);
        }
    }

    // Event Listeners
    elements.toggleButton.addEventListener('click', (e) => {
        console.log('Toggle button clicked');
        e.preventDefault();
        e.stopPropagation();
        toggleSidebar();
    });

    elements.overlay.addEventListener('click', () => {
        console.log('Overlay clicked');
        toggleSidebar();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && window.innerWidth >= 992) {
            console.log('Escape pressed');
            toggleSidebar();
        }
    });

    console.log('Sidebar initialization complete');
});
