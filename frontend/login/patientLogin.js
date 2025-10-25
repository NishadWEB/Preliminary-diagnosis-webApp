// Login functionality
const togglePassword = document.getElementById("togglePassword");
const password = document.getElementById("password");
const form = document.getElementById("loginForm");
const submitBtn = document.getElementById("submitBtn");
const email = document.getElementById('email');

// Create success message element (similar to register page)
const successMessage = document.createElement("div");
successMessage.className = "success-message";
successMessage.style.cssText = `
    text-align: center;
    padding: 2rem;
    background: #E8F5E9;
    border-radius: 10px;
    border: 1px solid #A5D6A7;
    margin-bottom: 1.5rem;
    display: none;
`;
successMessage.innerHTML = `
    <div class="success-icon">✅</div>
    <h3>Login Successful!</h3>
    <p>Redirecting to your dashboard...</p>
`;
form.parentNode.insertBefore(successMessage, form);

// Create failure message element (similar to register page)
const failureMessage = document.createElement("div");
failureMessage.className = "failure-message";
failureMessage.style.cssText = `
    background-color: #ffebee;
    border: 1px solid #ffcdd2;
    color: #c62828;
    padding: 12px;
    border-radius: 8px;
    margin-bottom: 20px;
    text-align: center;
    display: none;
`;
form.insertBefore(failureMessage, form.firstChild);

// Eye icon SVG for visible password (same as register)
const eyeIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
    </svg>
`;

// Eye slash icon for hidden password (same as register)
const eyeSlashIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
    </svg>
`;

// Toggle password visibility (same pattern as register)
function setupPasswordToggle(toggleButton, passwordField) {
    toggleButton.addEventListener("click", function () {
        const type = passwordField.getAttribute("type") === "password" ? "text" : "password";
        passwordField.setAttribute("type", type);

        // Update button icon
        if (type === "text") {
            this.innerHTML = eyeSlashIcon;
            this.setAttribute("aria-label", "Hide password");
        } else {
            this.innerHTML = eyeIcon;
            this.setAttribute("aria-label", "Show password");
        }
    });
}

// Initialize password toggle
setupPasswordToggle(togglePassword, password);

// Form validation (similar to register but without password confirmation)
function validateForm() {
    if (!email.validity.valid) {
        email.style.borderColor = "#ff6b6b";
        return false;
    } else {
        email.style.borderColor = "#7BC47F";
    }

    if (!password.validity.valid) {
        password.style.borderColor = "#ff6b6b";
        return false;
    } else {
        password.style.borderColor = "#7BC47F";
    }

    return true;
}

// Real-time validation as user types (similar to register)
// email.addEventListener("input", validateForm);
password.addEventListener("input", validateForm);

// Form submission (same pattern as register)
form.addEventListener("submit", function (event) {
    console.log('inside login event handler (client side)');
    event.preventDefault();

    // Hide any previous error messages
    hideFailureMessage();

    // Validate form before submission
    if (!validateForm()) {
        // Trigger browser's native validation UI
        form.reportValidity();
        return;
    }

    // Show loading state (same as register)
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="btn-icon">⏳</span> Signing In...';
    submitBtn.disabled = true;

    // SEND LOGIN DATA TO SERVER
    const loginData = {
        p_email: email.value.trim(),
        p_password: password.value
    };

    console.log('Login attempt for:', loginData.email);
    
    authenticatePatient(loginData, originalText);
});

// API call function (same pattern as register)
async function authenticatePatient(loginData, originalText) {
    try {
        console.log('inside login try block (client side)');

        const response = await fetch("/auth/login/patient", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(loginData)
        });

        console.log('login response received (client side)');

        const data = await response.json();
        console.log('login data fetched (client side): ', data);

        if (response.ok) {
            // Success case - show success animation (same as register)
            showSuccessAnimation();
        } else {
            // Failure case - show error message (same as register)
            showFailureMessage("Login failed. Invalid email or password.");
            resetSubmitButton(originalText);
        }
    } catch (error) {
        console.error("Login Error:(client side)", error);
        showFailureMessage("Network error. Please check your connection and try again.");
        resetSubmitButton(originalText);
    }
}

// Reset submit button (same as register)
function resetSubmitButton(originalText) {
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
}

// Show failure message (same as register)
function showFailureMessage(message) {
    failureMessage.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: center; gap: 10px;">
            <span style="font-size: 1.2rem;">❌</span>
            <span>${message}</span>
        </div>
    `;
    failureMessage.style.display = "block";
    
    // Auto-hide after 5 seconds (same as register)
    setTimeout(() => {
        hideFailureMessage();
    }, 5000);
}

// Hide failure message (same as register)
function hideFailureMessage() {
    failureMessage.style.display = "none";
}

// Show success animation (same pattern as register)
function showSuccessAnimation() {
    // Hide form and show success message
    form.style.display = "none";
    successMessage.style.display = "block";

    // Add fade-in animation
    successMessage.style.animation = "fadeIn 0.5s ease-in";

    // Redirect after 2 seconds (similar to register but to dashboard)
    setTimeout(() => {
        const role = form.getAttribute("action");
        console.log('Login successful, redirecting to dashboard for role:', role);
        window.location.href = '/patient/dashboard';
    }, 2000);
}

// Add CSS for fade-in animation (same as register)
const style = document.createElement("style");
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    .success-message {
        animation: fadeIn 0.5s ease-in;
    }
    .failure-message {
        animation: fadeIn 0.3s ease-in;
    }
    
    /* Success message specific styles */
    .success-icon {
        font-size: 3rem;
        margin-bottom: 1rem;
    }
    
    .success-message h3 {
        color: #2E7D32;
        margin-bottom: 0.5rem;
    }
    
    .success-message p {
        color: #4C7A65;
    }
`;
document.head.appendChild(style);

// Auto-focus on email field when page loads (enhanced UX)
document.addEventListener('DOMContentLoaded', function() {
    email.focus();
});

// Enter key submission (enhanced UX)
form.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        form.dispatchEvent(new Event('submit'));
    }
});