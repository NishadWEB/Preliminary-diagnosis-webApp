// Password toggle functionality
const togglePassword = document.getElementById("togglePassword");
const toggleConfirmPassword = document.getElementById("toggleConfirmPassword");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");
const form = document.getElementById("registerForm");
const submitBtn = document.getElementById("submitBtn");
const successMessage = document.getElementById("successMessage");
const email = document.getElementById('email');

// Create failure message element
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

// Eye icon SVG for visible password
const eyeIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
    </svg>
  `;

// Eye slash icon for hidden password
const eyeSlashIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
    </svg>
  `;

// Toggle password visibility
function setupPasswordToggle(toggleButton, passwordField) {
  toggleButton.addEventListener("click", function () {
    const type =
      passwordField.getAttribute("type") === "password" ? "text" : "password";
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

// Initialize password toggles
setupPasswordToggle(togglePassword, password);
setupPasswordToggle(toggleConfirmPassword, confirmPassword);

// Password confirmation validation
function validatePassword() {
  if (password.value !== confirmPassword.value) {
    confirmPassword.setCustomValidity("Passwords don't match");
    confirmPassword.style.borderColor = "#ff6b6b";
    return false;
  } else {
    confirmPassword.setCustomValidity("");
    confirmPassword.style.borderColor = "#7BC47F";
    return true;
  }
}

// Real-time validation as user types
password.addEventListener("input", validatePassword);
confirmPassword.addEventListener("input", validatePassword);

// Form submission
form.addEventListener("submit", function (event) {
  console.log('inside event handler (client side)');
  event.preventDefault();

  

  // Hide any previous error messages
  hideFailureMessage();

  // Validate form before submission
  if (!form.checkValidity()) {
    // Trigger browser's native validation UI
    form.reportValidity();
    return;
  }

  // Check password match one more time before submission
  if (!validatePassword()) {
    confirmPassword.focus();
    return;
  }

  // Show loading state
  const originalText = submitBtn.innerHTML;
  submitBtn.innerHTML = '<span class="btn-icon">⏳</span> Creating Account...';
  submitBtn.disabled = true;

  // SEND FORM DATA TO SERVER AND CHECK IF PATIENT EXIST!
  const patientData = {
    email: email.value.trim(),
    password: password.value
  };

  console.log('input pass is : ', patientData.password);
  
  createPatient(patientData, originalText);
});

async function createPatient(patientData, originalText) {
  try {
    console.log('inside try block (client side)');

    const response = await fetch("/auth/register/patient", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(patientData)
    });

    console.log('response recived(client side)');

    const data = await response.json();
    console.log('data fetched (client side): ', data);

    if (response.ok) {
      // Success case
      showSuccessAnimation();
    } else {
      // Failure case - show error message
      showFailureMessage("Registration failed. User Already Exists !!!.");
      resetSubmitButton(originalText);
    }
  } catch (error) {
    console.error("Error:(client side)", error);
    showFailureMessage("Network error. Please check your connection and try again.");
    resetSubmitButton(originalText);
  }
}

function resetSubmitButton(originalText) {
  submitBtn.innerHTML = originalText;
  submitBtn.disabled = false;

  form.reset();
}

function showFailureMessage(message) {
  failureMessage.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: center; gap: 10px;">
      <span style="font-size: 1.2rem;">❌</span>
      <span>${message}</span>
    </div>
  `;
  failureMessage.style.display = "block";
  
  // Auto-hide after 5 seconds
  setTimeout(() => {
    hideFailureMessage();
  }, 5000);
}

function hideFailureMessage() {
  failureMessage.style.display = "none";
}

function showSuccessAnimation() {
  // Hide form and show success message
  form.style.display = "none";
  successMessage.style.display = "block";
  
  // Add fade-in animation
  successMessage.style.animation = "fadeIn 0.5s ease-in";

  // Redirect after 3 seconds
  setTimeout(() => {
    const role = form.getAttribute("action");
    console.log('role is : ', role );
    window.location.href = `/auth/login/${role}`;
  }, 3000);
}

// Add CSS for fade-in animation
const style = document.createElement("style");
style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .error-message {
      animation: fadeIn 0.3s ease-in;
    }
    .failure-message {
      animation: fadeIn 0.3s ease-in;
    }
  `;
document.head.appendChild(style);