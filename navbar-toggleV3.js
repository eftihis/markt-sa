document.addEventListener('DOMContentLoaded', () => {
    const elements = {
        navButton: document.querySelector('.nav_button'),
        navMenu: document.querySelector('.nav_menu_wrap'),
        overlay: document.querySelector('.navbar_overlay'),
        pageWrap: document.querySelector('.page_wrap'),
        mainWrap: document.querySelector('.main_wrap'),
        hamburgerLines: document.querySelectorAll('.hamburger_7_line'),
        menuLinksWrap: document.querySelectorAll('.nav_item_wrap'),
        menuLinks: document.querySelectorAll('.nav_item')
    };

    // Scroll Lock Utility
    const scrollLock = {
        scrollPosition: 0,
        
        enable() {
            // Store current scroll position
            this.scrollPosition = window.pageYOffset;
            
            // Add styles to prevent content shift
            const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
            
            document.body.style.position = 'fixed';
            document.body.style.top = `-${this.scrollPosition}px`;
            document.body.style.width = '100%';
            document.body.style.paddingRight = `${scrollBarWidth}px`;
            
            // iOS-specific fix
            if (/iPhone|iPad|iPod/.test(navigator.platform)) {
                document.body.style.height = '100vh';
                document.body.style.overflow = 'hidden';
            }
        },
        
        disable() {
            // Remove styles
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            document.body.style.paddingRight = '';
            document.body.style.height = '';
            document.body.style.overflow = '';
            
            // Restore scroll position
            window.scrollTo(0, this.scrollPosition);
        }
    };

    // Keep these ARIA attributes
    if (elements.navButton) {
        elements.navButton.setAttribute('aria-expanded', 'false');
        elements.navButton.setAttribute('aria-controls', 'nav-menu');
        elements.navButton.setAttribute('aria-label', 'Toggle navigation menu');
    }
    if (elements.navMenu) {
        elements.navMenu.id = 'nav-menu';
    }

    function toggleNav() {
        const isOpen = elements.navMenu.classList.contains('is-open');
        elements.navButton.setAttribute('aria-expanded', (!isOpen).toString());
        
        // Toggle classes
        elements.navMenu.classList.toggle('is-open');
        elements.overlay.classList.toggle('is-open');
        elements.mainWrap.classList.toggle('is-shrunk');

        // Toggle hamburger lines
        elements.hamburgerLines.forEach(line => {
            line.classList.toggle('is-open');
        });

        // Stagger menu links wrap
        elements.menuLinksWrap.forEach((line, index) => {
            setTimeout(() => {
                line.classList.toggle('is-open');
            }, 150 + index * 50);
        });

        // Stagger menu links
        elements.menuLinks.forEach((line, index) => {
            setTimeout(() => {
                line.classList.toggle('is-open');
            }, 150 + index * 50);
        });

        // Use improved scroll lock
        if (elements.navMenu.classList.contains('is-open')) {
            scrollLock.enable();
        } else {
            scrollLock.disable();
        }
    }

    // Event Listeners
    elements.navButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleNav();
    });

    // Close menu when clicking overlay
    elements.overlay.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleNav();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && elements.navMenu.classList.contains('is-open')) {
            toggleNav();
        }
    });
});
