        // Navbar functionality
        const hamburger = document.getElementById('hamburger');
        const navLinks = document.getElementById('navLinks');

        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            navLinks.classList.toggle('show');
            hamburger.classList.toggle('active');
        });

        // Update chatbot button to include patientId
        document.getElementById('chatbotBtn').onclick = function() {
            window.location.href = '/patient/chatbot?patientId=' + patientId;
        };

        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 1185) {
                if (!e.target.closest('nav')) {
                    navLinks.classList.remove('show');
                    hamburger.classList.remove('active');
                }
            }
        });

        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 1185) {
                    navLinks.classList.remove('show');
                    hamburger.classList.remove('active');
                }
            });
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 1185) {
                navLinks.classList.remove('show');
                hamburger.classList.remove('active');
            }
        });