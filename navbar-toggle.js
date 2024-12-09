document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded');
    
    const elements = {
        navButton: document.querySelector('.nav_button'),
        navMenu: document.querySelector('.nav_menu_wrap'),
        overlay: document.querySelector('.navbar_overlay'),
        pageWrap: document.querySelector('.page_wrap'),
        mainWrap: document.querySelector('.main_wrap'),
        hamburgerLines: document.querySelectorAll('.hamburger_7_line')
    };
    
    // Log all found elements
    console.log('Elements found:', {
        navButton: elements.navButton,
        navMenu: elements.navMenu,
        overlay: elements.overlay,
        pageWrap: elements.pageWrap,
        mainWrap: elements.mainWrap,
        hamburgerLinesCount: elements.hamburgerLines.length,
        hamburgerLines: [...elements.hamburgerLines]
    });
    
    function toggleNav() {
        console.log('Toggle function called');
        
        // Toggle classes
        elements.navMenu.classList.toggle('is-open');
        console.log('Nav menu is-open:', elements.navMenu.classList.contains('is-open'));
        
        elements.overlay.classList.toggle('is-open');
        console.log('Overlay is-open:', elements.overlay.classList.contains('is-open'));
        
        elements.mainWrap.classList.toggle('is-shrunk');
        console.log('Main wrap is-shrunk:', elements.mainWrap.classList.contains('is-shrunk'));
        
        // Toggle hamburger lines
        elements.hamburgerLines.forEach((line, index) => {
            line.classList.toggle('is-open');
            console.log(`Hamburger line ${index} is-open:`, line.classList.contains('is-open'));
        });
        
        // Log scroll state
        if (elements.navMenu.classList.contains('is-open')) {
            elements.pageWrap.style.overflow = 'hidden';
            document.body.style.overflow = 'hidden';
            console.log('Page scroll disabled');
        } else {
            elements.pageWrap.style.overflow = '';
            document.body.style.overflow = '';
            console.log('Page scroll enabled');
        }
    }
    
    // Event Listeners
    elements.navButton.addEventListener('click', (e) => {
        console.log('Nav button clicked');
        e.preventDefault();
        e.stopPropagation();
        toggleNav();
    });
    
    // Close menu when clicking overlay
    elements.overlay.addEventListener('click', (e) => {
        console.log('Overlay clicked');
        e.preventDefault();
        e.stopPropagation();
        toggleNav();
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && elements.navMenu.classList.contains('is-open')) {
            console.log('Escape pressed while menu open');
            toggleNav();
        }
    });
    
    console.log('All event listeners attached');
});
