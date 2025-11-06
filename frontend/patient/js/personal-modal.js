// Personal Modal Functionality
document.addEventListener('DOMContentLoaded', function() {
    const personalModal = document.getElementById('personalModal');
    const personalForm = document.getElementById('personalForm');
    const submitPersonalBtn = document.getElementById('submitPersonalBtn');
    const personalFormMessage = document.getElementById('personalFormMessage');
    const closePersonalModal = document.getElementById('closePersonalModal');
    const cancelPersonal = document.getElementById('cancelPersonal');
    const contentContainer = document.getElementById('contentContainer');

    console.log('🚀 Personal modal elements:', {
        personalModal: !!personalModal,
        personalForm: !!personalForm,
        submitPersonalBtn: !!submitPersonalBtn
    });

    // Show personal modal
    function showPersonalModal() {
        console.log('🎯 Showing personal modal');
        
        // Get data from modal attributes
        if (personalModal) {
            const fullName = personalModal.dataset.fullName;
            const phoneNumber = personalModal.dataset.phoneNumber;
            const dateOfBirth = personalModal.dataset.dateOfBirth;
            const gender = personalModal.dataset.gender;
            const address = personalModal.dataset.address;
            const emergencyContact = personalModal.dataset.emergencyContact;
            
            console.log('Personal info from attributes:', { 
                fullName, 
                phoneNumber, 
                dateOfBirth, 
                gender, 
                address, 
                emergencyContact 
            });
            
            // Pre-fill form fields
            if (fullName) document.getElementById('editFullName').value = fullName;
            if (phoneNumber) document.getElementById('editPhoneNumber').value = phoneNumber;
            if (dateOfBirth) document.getElementById('editDateOfBirth').value = dateOfBirth;
            if (gender) document.getElementById('editGender').value = gender;
            if (address) document.getElementById('editAddress').value = address;
            if (emergencyContact) document.getElementById('editEmergencyContact').value = emergencyContact;
        }

        // Set maximum date for date of birth (today)
        const dateOfBirthInput = document.getElementById('editDateOfBirth');
        if (dateOfBirthInput) {
            const today = new Date().toISOString().split('T')[0];
            dateOfBirthInput.max = today;
        }

        if (contentContainer) {
            contentContainer.classList.add('blurred');
        }
        if (personalModal) {
            personalModal.classList.add('active');
        }
    }

    // Hide personal modal
    function hidePersonalModal() {
        console.log('🎯 Hiding personal modal');
        if (contentContainer) {
            contentContainer.classList.remove('blurred');
        }
        if (personalModal) {
            personalModal.classList.remove('active');
        }
        if (personalFormMessage) {
            personalFormMessage.style.display = 'none';
        }
    }

    // Show message function
    function showPersonalMessage(message, type) {
        if (personalFormMessage) {
            personalFormMessage.textContent = message;
            personalFormMessage.className = `form-message ${type}`;
            personalFormMessage.style.display = 'block';
        }
    }

    // Form validation
    function validatePersonalForm() {
        const fullName = document.getElementById('editFullName').value.trim();
        const phoneNumber = document.getElementById('editPhoneNumber').value.trim();
        const dateOfBirth = document.getElementById('editDateOfBirth').value;
        const gender = document.getElementById('editGender').value;

        if (!fullName) {
            showPersonalMessage('Please enter your full name', 'error');
            return false;
        }

        if (!phoneNumber) {
            showPersonalMessage('Please enter your phone number', 'error');
            return false;
        }

        if (!dateOfBirth) {
            showPersonalMessage('Please select your date of birth', 'error');
            return false;
        }

        if (!gender) {
            showPersonalMessage('Please select your gender', 'error');
            return false;
        }

        // Validate phone number format
        const phoneRegex = /^[+]?[0-9\s\-\(\)]{10,}$/;
        if (!phoneRegex.test(phoneNumber)) {
            showPersonalMessage('Please enter a valid phone number', 'error');
            return false;
        }

        // Validate date of birth
        const dob = new Date(dateOfBirth);
        const today = new Date();
        if (dob >= today) {
            showPersonalMessage('Date of birth must be in the past', 'error');
            return false;
        }

        return true;
    }

    // Handle form submission
    if (personalForm) {
        personalForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            console.log('📝 Personal form submitted');
            
            if (!validatePersonalForm()) {
                return;
            }
            
            // Disable submit button and show loading state
            if (submitPersonalBtn) {
                submitPersonalBtn.disabled = true;
                submitPersonalBtn.classList.add('loading');
                
                const btnText = submitPersonalBtn.querySelector('.btn-text');
                if (btnText) {
                    btnText.textContent = 'Updating...';
                }
            }

            try {
                const formData = new FormData(personalForm);
                const data = {
                    patientId: formData.get('patientId'),
                    fullName: formData.get('fullName'),
                    phoneNumber: formData.get('phoneNumber'),
                    dateOfBirth: formData.get('dateOfBirth'),
                    gender: formData.get('gender'),
                    address: formData.get('address'),
                    emergencyContact: formData.get('emergencyContact')
                };

                console.log('📤 Sending personal data to server:', data);

                const response = await fetch('/patient/profile/update-personal-info', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });

                const result = await response.json();
                console.log('📥 Personal server response:', result);

                if (result.success) {
                    if (submitPersonalBtn) {
                        submitPersonalBtn.classList.add('success');
                        const btnText = submitPersonalBtn.querySelector('.btn-text');
                        if (btnText) {
                            btnText.textContent = 'Success!';
                        }
                    }
                    
                    showPersonalMessage('Personal information updated successfully!', 'success');
                    
                    // Redirect after success
                    setTimeout(() => {
                        hidePersonalModal();
                        window.location.href = result.redirectUrl || `/patient/profile?patientId=${data.patientId}`;
                    }, 1500);
                    
                } else {
                    if (submitPersonalBtn) {
                        submitPersonalBtn.classList.add('error');
                        const btnText = submitPersonalBtn.querySelector('.btn-text');
                        if (btnText) {
                            btnText.textContent = 'Failed - Try Again';
                        }
                    }
                    
                    showPersonalMessage(result.message || 'Failed to update personal information', 'error');
                    
                    // Re-enable button after delay
                    setTimeout(() => {
                        if (submitPersonalBtn) {
                            submitPersonalBtn.disabled = false;
                            submitPersonalBtn.classList.remove('loading', 'error');
                            const btnText = submitPersonalBtn.querySelector('.btn-text');
                            if (btnText) {
                                btnText.textContent = 'Update Personal Info';
                            }
                        }
                    }, 2000);
                }

            } catch (error) {
                console.error('❌ Error updating personal info:', error);
                if (submitPersonalBtn) {
                    submitPersonalBtn.classList.add('error');
                    const btnText = submitPersonalBtn.querySelector('.btn-text');
                    if (btnText) {
                        btnText.textContent = 'Network Error';
                    }
                }
                
                showPersonalMessage('Network error. Please check your connection and try again.', 'error');
                
                // Re-enable button after delay
                setTimeout(() => {
                    if (submitPersonalBtn) {
                        submitPersonalBtn.disabled = false;
                        submitPersonalBtn.classList.remove('loading', 'error');
                        const btnText = submitPersonalBtn.querySelector('.btn-text');
                        if (btnText) {
                            btnText.textContent = 'Update Personal Info';
                        }
                    }
                }, 2000);
            }
        });
    }

    // Event listeners for modal controls
    if (closePersonalModal) {
        closePersonalModal.addEventListener('click', hidePersonalModal);
    }
    if (cancelPersonal) {
        cancelPersonal.addEventListener('click', hidePersonalModal);
    }

    // Close modal when clicking outside
    if (personalModal) {
        personalModal.addEventListener('click', function(e) {
            if (e.target === personalModal) {
                hidePersonalModal();
            }
        });
    }

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && personalModal && personalModal.classList.contains('active')) {
            hidePersonalModal();
        }
    });

    // Make showPersonalModal globally available
    window.showPersonalModal = showPersonalModal;

    console.log('✅ Personal modal initialized - showPersonalModal is available');
});