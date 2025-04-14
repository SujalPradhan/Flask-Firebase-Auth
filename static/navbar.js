// Navbar functionality - mainly for mobile menu toggling
document.addEventListener('DOMContentLoaded', function() {
    // Get hamburger menu and navbar menu elements
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const navbarMenu = document.querySelector('.navbar-menu');
    
    // Toggle menu when hamburger is clicked
    if (hamburgerMenu) {
        hamburgerMenu.addEventListener('click', function() {
            hamburgerMenu.classList.toggle('active');
            navbarMenu.classList.toggle('active');
            // Prevent scrolling when menu is open
            document.body.classList.toggle('no-scroll');
        });
    }
    
    // Close menu when clicking on a menu item (for mobile)
    const navItems = document.querySelectorAll('.navbar-item');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                hamburgerMenu.classList.remove('active');
                navbarMenu.classList.remove('active');
                document.body.classList.remove('no-scroll');
            }
        });
    });
    
    // Change navbar style on scroll
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.padding = '5px 0';
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 15px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.padding = '10px 0';
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }
    });
    
    // Add additional CSS for no scrolling
    const style = document.createElement('style');
    style.textContent = `
        .no-scroll {
            overflow: hidden;
        }
    `;
    document.head.appendChild(style);
});