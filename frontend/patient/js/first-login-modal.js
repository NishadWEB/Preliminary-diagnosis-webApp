// First Login Modal Functionality
document.addEventListener('DOMContentLoaded', function() {
    const firstLoginModal = document.getElementById('firstLoginModal');
    const firstLoginForm = document.getElementById('firstLoginForm');
    const submitProfileBtn = document.getElementById('submitProfileBtn');
    const formMessage = document.getElementById('formMessage');
    const contentContainer = document.getElementById('contentContainer');

    console.log('🚀 Modal elements loaded:', {
        firstLoginModal: !!firstLoginModal,
        firstLoginForm: !!firstLoginForm,
        contentContainer: !!contentContainer
    });

    // Add error message elements to required fields
    function initializeErrorMessages() {
        const requiredFields = firstLoginForm.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = 'This field is required';
            field.parentNode.appendChild(errorDiv);
        });
    }

    // Form validation
    function validateForm() {
        let isValid = true;
        const requiredFields = firstLoginForm.querySelectorAll('[required]');
        
        // Clear previous errors
        requiredFields.forEach(field => {
            field.parentNode.classList.remove('error');
        });

        // Check required fields
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.parentNode.classList.add('error');
                isValid = false;
            }
        });

        // Specific validations
        const phoneNumber = document.getElementById('phoneNumber').value.trim();
        const dateOfBirth = document.getElementById('dateOfBirth').value;
        const phoneRegex = /^[+]?[0-9\s\-\(\)]{10,}$/;

        if (phoneNumber && !phoneRegex.test(phoneNumber)) {
            document.getElementById('phoneNumber').parentNode.classList.add('error');
            document.getElementById('phoneNumber').parentNode.querySelector('.error-message').textContent = 'Please enter a valid phone number';
            isValid = false;
        }

        if (dateOfBirth) {
            const dob = new Date(dateOfBirth);
            const today = new Date();
            if (dob >= today) {
                document.getElementById('dateOfBirth').parentNode.classList.add('error');
                document.getElementById('dateOfBirth').parentNode.querySelector('.error-message').textContent = 'Date of birth must be in the past';
                isValid = false;
            }
        }

        return isValid;
    }

    // Real-time validation
    function setupRealTimeValidation() {
        const formInputs = firstLoginForm.querySelectorAll('input, select, textarea');
        
        formInputs.forEach(input => {
            input.addEventListener('blur', function() {
                if (this.hasAttribute('required') && !this.value.trim()) {
                    this.parentNode.classList.add('error');
                } else {
                    this.parentNode.classList.remove('error');
                }
            });

            input.addEventListener('input', function() {
                // Remove error when user starts typing
                this.parentNode.classList.remove('error');
                
                // Hide form message when user interacts
                if (formMessage.style.display !== 'none') {
                    formMessage.style.display = 'none';
                }
            });
        });
    }

    // Remove blur and hide modal
    function removeBlurAndModal() {
        console.log('🔄 Removing blur and modal...');
        
        if (contentContainer) {
            console.log('📝 Removing blurred class from contentContainer');
            contentContainer.classList.remove('blurred');
        } else {
            console.log('❌ contentContainer not found');
        }
        
        if (firstLoginModal) {
            console.log('📝 Removing active class from modal');
            firstLoginModal.classList.remove('active');
        } else {
            console.log('❌ firstLoginModal not found');
        }
        
        // Force reflow to ensure CSS changes apply
        void contentContainer?.offsetWidth;
    }

    // Handle form submission
    firstLoginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (!validateForm()) {
            // Focus on first error field
            const firstError = firstLoginForm.querySelector('.error input, .error select');
            if (firstError) {
                firstError.focus();
            }
            return;
        }

        // Disable submit button and show loading state
        submitProfileBtn.disabled = true;
        submitProfileBtn.classList.add('loading');
        
        const btnText = submitProfileBtn.querySelector('.btn-text');
        if (btnText) {
            btnText.textContent = 'Saving...';
        }

        try {
            const formData = new FormData(firstLoginForm);
            const data = {
                patientId: formData.get('patientId'),
                fullName: formData.get('fullName'),
                phoneNumber: formData.get('phoneNumber'),
                dateOfBirth: formData.get('dateOfBirth'),
                gender: formData.get('gender'),
                address: formData.get('address'),
                emergencyContact: formData.get('emergencyContact')
            };

            console.log('📤 Sending data to server:', data);

            const response = await fetch('/patient/profile/personal-info', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            console.log('📥 Server response:', result);

            if (result.success) {
                submitProfileBtn.classList.add('success');
                if (btnText) {
                    btnText.textContent = 'Success!';
                }
                
                console.log('✅ Form submitted successfully, removing blur...');
                
                // ✅ REMOVE BLUR AND MODAL IMMEDIATELY
                removeBlurAndModal();
                
                // Wait a bit to see the success state, then redirect
                setTimeout(() => {
                    console.log('🔄 Redirecting to:', result.redirectUrl || `/patient/profile?patientId=${data.patientId}`);
                    window.location.href = result.redirectUrl || `/patient/profile?patientId=${data.patientId}`;
                }, 1500);
                
            } else {
                console.log('❌ Form submission failed');
                submitProfileBtn.classList.add('error');
                if (btnText) {
                    btnText.textContent = 'Failed - Try Again';
                }
                
                // Re-enable button after delay
                setTimeout(() => {
                    submitProfileBtn.disabled = false;
                    submitProfileBtn.classList.remove('loading', 'error');
                    if (btnText) {
                        btnText.textContent = 'Complete Profile';
                    }
                }, 2000);
            }

        } catch (error) {
            console.error('❌ Error saving profile:', error);
            submitProfileBtn.classList.add('error');
            if (btnText) {
                btnText.textContent = 'Network Error';
            }
            
            // Re-enable button after delay
            setTimeout(() => {
                submitProfileBtn.disabled = false;
                submitProfileBtn.classList.remove('loading', 'error');
                if (btnText) {
                    btnText.textContent = 'Complete Profile';
                }
            }, 2000);
        }
    });

    // Set maximum date for date of birth (today)
    const dateOfBirthInput = document.getElementById('dateOfBirth');
    if (dateOfBirthInput) {
        const today = new Date().toISOString().split('T')[0];
        dateOfBirthInput.max = today;
    }

    // Initialize the modal
    function initializeModal() {
        initializeErrorMessages();
        setupRealTimeValidation();
        console.log('✅ First login modal initialized');
    }

    // Start initialization
    initializeModal();
});