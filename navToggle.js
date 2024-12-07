document.addEventListener('DOMContentLoaded', () => {
    const navBtn = document.querySelector('.nav_button');
    const elements = document.querySelectorAll('.nav_menu_wrap, .nav_open_wrap, .nav_close_wrap, .navbar_overlay');
    
    let isMenuOpen = false;
    
    const toggleClasses = () => {
        isMenuOpen = !isMenuOpen;
        
        elements.forEach(element => {
            if (isMenuOpen) {
                element.classList.add('is-open');
            } else {
                element.classList.remove('is-open');
            }
        });
    };
    
    navBtn.addEventListener('click', toggleClasses);
    
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && isMenuOpen) {
            isMenuOpen = false;
            elements.forEach(element => {
                element.classList.remove('is-open');
            });
        }
    });
});
