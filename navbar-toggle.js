document.addEventListener('DOMContentLoaded', () => {
    // Use object destructuring for cleaner element selection
    const {
        navButton,
        navMenu,
        overlay,
        pageWrap,
        mainWrap,
        hamburgerLines,
        menuLinksWrap,
        menuLinks
    } = {
        navButton: document.querySelector('.nav_button'),
        navMenu: document.querySelector('.nav_menu_wrap'),
        overlay: document.querySelector('.navbar_overlay'),
        pageWrap: document.querySelector('.page_wrap'),
        mainWrap: document.querySelector('.main_wrap'),
        hamburgerLines: document.querySelectorAll('.hamburger_7_line'),
        menuLinksWrap: document.querySelectorAll('.nav_item_wrap'),
        menuLinks: document.querySelectorAll('.nav_item')
    };

    // Create a single function to handle animation timing
    const animateElement = (element, isOpen, delay) => {
        requestAnimationFrame(() => {
            setTimeout(() => {
                element.classList.toggle('is-open', isOpen);
            }, delay);
        });
    };

    // Use a single source of truth for menu state
    let isMenuOpen = false;

    // Improve scroll locking with better cross-browser support
    const scrollLock = {
        enable() {
            document.body.style.position = 'fixed';
            document.body.style.top = `-${window.scrollY}px`;
            document.body.style.width = '100%';
        },
        disable() {
            const top = document.body.style.top;
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            window.scrollTo(0, Math.abs(parseInt(top)));
        }
    };

    function toggleNav() {
        isMenuOpen = !isMenuOpen;

        // Batch DOM operations
        requestAnimationFrame(() => {
            navMenu.classList.toggle('is-open', isMenuOpen);
            overlay.classList.toggle('is-open', isMenuOpen);
            mainWrap.classList.toggle('is-shrunk', isMenuOpen);

            // Use forEach with index for better performance than multiple querySelectors
            hamburgerLines.forEach(line => animateElement(line, isMenuOpen, 0));
            
            menuLinksWrap.forEach((link, index) => 
                animateElement(link, isMenuOpen, 150 + index * 50)
            );
            
            menuLinks.forEach((link, index) => 
                animateElement(link, isMenuOpen, 150 + index * 50)
            );

            // Improved scroll locking
            if (isMenuOpen) {
                scrollLock.enable();
            } else {
                scrollLock.disable();
            }
        });
    }

    // Event delegation for better performance
    const handleClick = (e) => {
        if (e.target.closest('.nav_button') || 
            (e.target.closest('.navbar_overlay') && isMenuOpen)) {
            e.preventDefault();
            e.stopPropagation();
            toggleNav();
        }
    };

    // Use passive event listeners where possible
    document.addEventListener('click', handleClick);
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isMenuOpen) {
            toggleNav();
        }
    }, { passive: true });

    // Cleanup function
    return () => {
        document.removeEventListener('click', handleClick);
        document.removeEventListener('keydown', handleClick);
    };
});
