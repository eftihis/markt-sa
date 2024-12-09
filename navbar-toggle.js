document.addEventListener('DOMContentLoaded', () => {
    const elements = {
        navButton: document.querySelector('.nav_button'),
        navMenu: document.querySelector('.nav_menu_wrap'),
        overlay: document.querySelector('.navbar_overlay'),
        pageWrap: document.querySelector('.page_wrap'),
        mainWrap: document.querySelector('.main_wrap'),
        hamburgerLines: document.querySelectorAll('.hamburger_7_line')
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
