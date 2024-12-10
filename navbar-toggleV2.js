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

    function toggleNav() {
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
            }, 150 + index * 50); // Add 50ms stagger for each link
        });

        // Stagger menu links
        elements.menuLinks.forEach((line, index) => {
            setTimeout(() => {
                line.classList.toggle('is-open');
            }, 150 + index * 50); // Add 50ms stagger for each link
        });

        // Handle page scroll
        if (elements.navMenu.classList.contains('is-open')) {
            elements.pageWrap.style.overflow = 'hidden';
            document.body.style.overflow = 'hidden';
        } else {
            elements.pageWrap.style.overflow = '';
            document.body.style.overflow = '';
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
