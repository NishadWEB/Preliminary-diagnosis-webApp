// Logout Modal Functionality
document.addEventListener('DOMContentLoaded', function() {
    const logoutBtn = document.getElementById('logoutBtn');
    const logoutModal = document.getElementById('logoutModal');
    const closeLogoutModal = document.getElementById('closeLogoutModal');
    const cancelLogout = document.getElementById('cancelLogout');
    const confirmLogout = document.getElementById('confirmLogout');
    const contentContainer = document.getElementById('contentContainer');

    console.log('🚀 Logout modal elements:', {
        logoutBtn: !!logoutBtn,
        logoutModal: !!logoutModal,
        confirmLogout: !!confirmLogout
    });

    // Show logout modal
    function showLogoutModal() {
        console.log('🎯 Showing logout confirmation modal');
        
        if (contentContainer) {
            contentContainer.classList.add('blurred');
        }
        if (logoutModal) {
            logoutModal.classList.add('active');
        }
    }

    // Hide logout modal
    function hideLogoutModal() {
        console.log('🎯 Hiding logout modal');
        if (contentContainer) {
            contentContainer.classList.remove('blurred');
        }
        if (logoutModal) {
            logoutModal.classList.remove('active');
        }
    }

    // Handle logout confirmation
    function handleLogout() {
        console.log('🚪 User confirmed logout');
        
        // Show loading state
        if (confirmLogout) {
            confirmLogout.disabled = true;
            confirmLogout.innerHTML = 'Logging out...';
        }
        
        // Simulate logout process
        setTimeout(() => {
            console.log('✅ Logout successful, redirecting to home page');
            
            // Redirect to home page after successful logout
            window.location.replace("/patient/logout");
        }, 1000);
    }

    // Event listeners
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showLogoutModal();
        });
    }

    if (closeLogoutModal) {
        closeLogoutModal.addEventListener('click', hideLogoutModal);
    }

    if (cancelLogout) {
        cancelLogout.addEventListener('click', hideLogoutModal);
    }

    if (confirmLogout) {
        confirmLogout.addEventListener('click', handleLogout);
    }

    // Close modal when clicking outside
    if (logoutModal) {
        logoutModal.addEventListener('click', function(e) {
            if (e.target === logoutModal) {
                hideLogoutModal();
            }
        });
    }

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && logoutModal && logoutModal.classList.contains('active')) {
            hideLogoutModal();
        }
    });

    console.log('✅ Logout modal initialized');
});