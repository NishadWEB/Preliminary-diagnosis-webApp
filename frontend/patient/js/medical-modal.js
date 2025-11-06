// Medical Modal Functionality
document.addEventListener('DOMContentLoaded', function() {
    const medicalModal = document.getElementById('medicalModal');
    const medicalForm = document.getElementById('medicalForm');
    const submitMedicalBtn = document.getElementById('submitMedicalBtn');
    const medicalFormMessage = document.getElementById('medicalFormMessage');
    const closeMedicalModal = document.getElementById('closeMedicalModal');
    const cancelMedical = document.getElementById('cancelMedical');
    const contentContainer = document.getElementById('contentContainer');

    console.log('🚀 Medical modal elements:', {
        medicalModal: !!medicalModal,
        medicalForm: !!medicalForm,
        submitMedicalBtn: !!submitMedicalBtn
    });

    // Show medical modal
    function showMedicalModal() {
        console.log('🎯 Showing medical modal');
        
        // Get data from modal attributes
        if (medicalModal) {
            const bloodType = medicalModal.dataset.bloodType;
            const allergies = medicalModal.dataset.allergies;
            const height = medicalModal.dataset.height;
            const weight = medicalModal.dataset.weight;
            const chronicConditions = medicalModal.dataset.chronicConditions;
            
            console.log('Medical info from attributes:', { 
                bloodType, 
                allergies, 
                height, 
                weight, 
                chronicConditions 
            });
            
            // Pre-fill form fields
            if (bloodType) {
                document.getElementById('bloodType').value = bloodType;
            }
            if (allergies) {
                document.getElementById('allergies').value = allergies;
            }
            if (height) {
                document.getElementById('height').value = height;
            }
            if (weight) {
                document.getElementById('weight').value = weight;
            }
            if (chronicConditions) {
                document.getElementById('chronicConditions').value = chronicConditions;
            }
        }

        if (contentContainer) {
            contentContainer.classList.add('blurred');
        }
        if (medicalModal) {
            medicalModal.classList.add('active');
        }
    }

    // Hide medical modal
    function hideMedicalModal() {
        console.log('🎯 Hiding medical modal');
        if (contentContainer) {
            contentContainer.classList.remove('blurred');
        }
        if (medicalModal) {
            medicalModal.classList.remove('active');
        }
        if (medicalFormMessage) {
            medicalFormMessage.style.display = 'none';
        }
    }

    // Show message function
    function showMedicalMessage(message, type) {
        if (medicalFormMessage) {
            medicalFormMessage.textContent = message;
            medicalFormMessage.className = `form-message ${type}`;
            medicalFormMessage.style.display = 'block';
        }
    }

    // Handle form submission
    if (medicalForm) {
        medicalForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            console.log('📝 Medical form submitted');
            
            // Disable submit button and show loading state
            if (submitMedicalBtn) {
                submitMedicalBtn.disabled = true;
                submitMedicalBtn.classList.add('loading');
                
                const btnText = submitMedicalBtn.querySelector('.btn-text');
                if (btnText) {
                    btnText.textContent = 'Saving...';
                }
            }

            try {
                const formData = new FormData(medicalForm);
                const data = {
                    patientId: formData.get('patientId'),
                    bloodType: formData.get('bloodType'),
                    allergies: formData.get('allergies'),
                    height: formData.get('height'),
                    weight: formData.get('weight'),
                    chronicConditions: formData.get('chronicConditions')
                };

                console.log('📤 Sending medical data to server:', data);

                const response = await fetch('/patient/profile/medical-info', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });

                const result = await response.json();
                console.log('📥 Medical server response:', result);

                if (result.success) {
                    if (submitMedicalBtn) {
                        submitMedicalBtn.classList.add('success');
                        const btnText = submitMedicalBtn.querySelector('.btn-text');
                        if (btnText) {
                            btnText.textContent = 'Success!';
                        }
                    }
                    
                    showMedicalMessage('Medical information updated successfully!', 'success');
                    
                    // Redirect after success
                    setTimeout(() => {
                        hideMedicalModal();
                        window.location.href = result.redirectUrl || `/patient/profile?patientId=${data.patientId}`;
                    }, 1500);
                    
                } else {
                    if (submitMedicalBtn) {
                        submitMedicalBtn.classList.add('error');
                        const btnText = submitMedicalBtn.querySelector('.btn-text');
                        if (btnText) {
                            btnText.textContent = 'Failed - Try Again';
                        }
                    }
                    
                    showMedicalMessage(result.message || 'Failed to save medical information', 'error');
                    
                    // Re-enable button after delay
                    setTimeout(() => {
                        if (submitMedicalBtn) {
                            submitMedicalBtn.disabled = false;
                            submitMedicalBtn.classList.remove('loading', 'error');
                            const btnText = submitMedicalBtn.querySelector('.btn-text');
                            if (btnText) {
                                btnText.textContent = 'Save Medical Info';
                            }
                        }
                    }, 2000);
                }

            } catch (error) {
                console.error('❌ Error saving medical info:', error);
                if (submitMedicalBtn) {
                    submitMedicalBtn.classList.add('error');
                    const btnText = submitMedicalBtn.querySelector('.btn-text');
                    if (btnText) {
                        btnText.textContent = 'Network Error';
                    }
                }
                
                showMedicalMessage('Network error. Please check your connection and try again.', 'error');
                
                // Re-enable button after delay
                setTimeout(() => {
                    if (submitMedicalBtn) {
                        submitMedicalBtn.disabled = false;
                        submitMedicalBtn.classList.remove('loading', 'error');
                        const btnText = submitMedicalBtn.querySelector('.btn-text');
                        if (btnText) {
                            btnText.textContent = 'Save Medical Info';
                        }
                    }
                }, 2000);
            }
        });
    }

    // Event listeners for modal controls
    if (closeMedicalModal) {
        closeMedicalModal.addEventListener('click', hideMedicalModal);
    }
    if (cancelMedical) {
        cancelMedical.addEventListener('click', hideMedicalModal);
    }

    // Close modal when clicking outside
    if (medicalModal) {
        medicalModal.addEventListener('click', function(e) {
            if (e.target === medicalModal) {
                hideMedicalModal();
            }
        });
    }

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && medicalModal && medicalModal.classList.contains('active')) {
            hideMedicalModal();
        }
    });

    // Make showMedicalModal globally available
    window.showMedicalModal = showMedicalModal;

    console.log('✅ Medical modal initialized - showMedicalModal is available');
});