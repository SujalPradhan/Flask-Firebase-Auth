// Landing page script
document.addEventListener('DOMContentLoaded', function() {
    // Login Modal Functionality
    const loginModal = document.getElementById('login-modal');
    const loginBtn = document.getElementById('login-button');
    const closeModalBtn = document.querySelector('.close-modal');
    const signInBtn = document.getElementById('sign-in-btn');
    const signInWithGoogleBtn = document.getElementById('sign-in-with-google-btn');

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
        if (e.key === 'Escape' && loginModal && loginModal.style.display === 'block') {
            closeLoginModal();
        }
    });

    // Check if user is already logged in 
    const checkAuthStatus = () => {
        const userLoggedIn = document.cookie.includes('session=');
        if (userLoggedIn) {
            window.location.href = '/portfolio';
        }
    };

    // Run auth check on page load
    checkAuthStatus();
});