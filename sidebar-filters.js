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
    let trackWidths = new Map(); // Store track widths
    
    function captureTrackWidths() {
        const wrappers = document.querySelectorAll('[fs-rangeslider-element="wrapper"]');
        wrappers.forEach(wrapper => {
            const track = wrapper.querySelector('[fs-rangeslider-element="track"]');
            if (track) {
                // Store the computed width
                const width = track.getBoundingClientRect().width;
                trackWidths.set(track, width);
                
                // Store the current handle values and positions
                const handles = wrapper.querySelectorAll('[fs-rangeslider-element="handle"]');
                const values = Array.from(handles).map(handle => {
                    const valuenow = handle.getAttribute('aria-valuenow');
                    return valuenow ? parseFloat(valuenow) : null;
                });
                trackWidths.set(wrapper, {width, values});
            }
        });
    }
    
    function restoreTrackWidths() {
        const wrappers = document.querySelectorAll('[fs-rangeslider-element="wrapper"]');
        wrappers.forEach(wrapper => {
            const storedData = trackWidths.get(wrapper);
            if (storedData) {
                const track = wrapper.querySelector('[fs-rangeslider-element="track"]');
                if (track) {
                    // Force the track to maintain its width
                    track.style.width = `${storedData.width}px`;
                    
                    // Restore handle positions
                    const handles = wrapper.querySelectorAll('[fs-rangeslider-element="handle"]');
                    handles.forEach((handle, index) => {
                        if (storedData.values[index] !== null) {
                            handle.setAttribute('aria-valuenow', storedData.values[index]);
                        }
                    });
                }
            }
        });
    }
    
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
        
        // Capture current widths and positions before destroying
        captureTrackWidths();
        
        setTimeout(() => {
            if (window.FsAttributes && window.FsAttributes.rangeslider) {
                window.FsAttributes.rangeslider.destroy();
                
                // Restore widths before reinitializing
                restoreTrackWidths();
                
                // Force a reflow
                elements.sidebar.offsetHeight;
                
                window.FsAttributes.rangeslider.init();
            }
        }, ANIMATION_DURATION);
    }
    
    function handleResize() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if (elements.sidebar.classList.contains('is-open')) {
                // Clear stored widths on resize
                trackWidths.clear();
                reinitializeRangeSlider();
            }
        }, ANIMATION_DURATION);
    }
    
    function handleScroll() {
        if (window.innerWidth < 992 && elements.sidebar.classList.contains('is-open')) {
            clearTimeout(scrollTimeout);
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
            // Clear stored widths on toggle
            trackWidths.clear();
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
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    
    console.log('Sidebar initialization complete');
};
console.log('Sidebar script loaded');
