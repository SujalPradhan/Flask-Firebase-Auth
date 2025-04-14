// Portfolio Interactions
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // Don't prevent default for login button
            if (targetId === '#' && this.id === 'login-button') {
                e.preventDefault();
                openLoginModal();
                return;
            }
            
            e.preventDefault();
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Login Modal Functionality
    const loginModal = document.getElementById('login-modal');
    const loginBtn = document.getElementById('login-button');
    const closeModalBtn = document.querySelector('.close-modal');

    // Function to open the login modal
    function openLoginModal() {
        if (loginModal) {
            loginModal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        }
    }

    // Function to close the login modal
    function closeLoginModal() {
        if (loginModal) {
            loginModal.style.display = 'none';
            document.body.style.overflow = ''; // Enable scrolling
        }
    }

    // Event listeners for login modal
    if (loginBtn) {
        loginBtn.addEventListener('click', openLoginModal);
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeLoginModal);
    }

    // Close modal when clicking outside of it
    window.addEventListener('click', function(e) {
        if (e.target === loginModal) {
            closeLoginModal();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && loginModal.style.display === 'block') {
            closeLoginModal();
        }
    });

    // Handle contact form submission
    const contactForm = document.querySelector('.contact-form');
    const sendMessageBtn = document.getElementById('send-message-btn');
    
    if (sendMessageBtn) {
        sendMessageBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const nameInput = document.getElementById('name-input');
            const emailInput = document.getElementById('email-input');
            const messageInput = document.getElementById('message-input');
            
            // Simple validation
            if (!nameInput.value || !emailInput.value || !messageInput.value) {
                alert('Please fill in all fields');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailInput.value)) {
                alert('Please enter a valid email address');
                return;
            }
            
            // In a real implementation, you would send this data to your server
            // For now, just show a success message
            alert('Message sent! Thank you for contacting me.');
            
            // Clear form
            nameInput.value = '';
            emailInput.value = '';
            messageInput.value = '';
        });
    }

    // Add scroll animations
    const sections = document.querySelectorAll('section');
    
    // Function to check if element is in viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.bottom >= 0 &&
            rect.left <= (window.innerWidth || document.documentElement.clientWidth) &&
            rect.right >= 0
        );
    }
    
    // Add fade-in animation when scrolling
    function handleScrollAnimations() {
        sections.forEach(section => {
            if (isInViewport(section) && !section.classList.contains('animated')) {
                section.classList.add('animated');
                section.style.opacity = 1;
                section.style.transform = 'translateY(0)';
            }
        });
    }
    
    // Initialize section styles - but make them visible by default
    sections.forEach(section => {
        if (section.id !== 'hero') { // Don't animate hero section
            // Set initial opacity to 1 instead of 0 to ensure visibility
            section.style.opacity = 1;
            section.style.transform = 'translateY(0)';
            section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        }
    });
    
    // Check for animations on scroll
    window.addEventListener('scroll', handleScrollAnimations);
    
    // Check once on load
    handleScrollAnimations();

    // Check if user is already logged in 
    const checkAuthStatus = () => {
        const userLoggedIn = document.cookie.includes('session=');
        if (userLoggedIn) {
            if (loginBtn) {
                loginBtn.innerText = 'Dashboard';
                loginBtn.href = '/dashboard';
                // Remove the event listener that opens the login modal
                loginBtn.removeEventListener('click', openLoginModal);
            }
        }
    };

    // Run auth check on page load
    checkAuthStatus();
});