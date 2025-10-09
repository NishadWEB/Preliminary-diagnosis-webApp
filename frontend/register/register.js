const form = document.getElementById("registerForm");
const submitBtn = document.getElementById("submitBtn");
const successMessage = document.getElementById("successMessage");

// Add toggle buttons to password fields
const passwordInputs = document.querySelectorAll('input[type="password"]');

passwordInputs.forEach((input) => {
  // Create container for password input and toggle button
  const container = document.createElement("div");
  container.className = "password-container";

  // Wrap the input in the container
  input.parentNode.insertBefore(container, input);
  container.appendChild(input);

  // Create toggle button
  const toggleButton = document.createElement("button");
  toggleButton.type = "button";
  toggleButton.className = "toggle-password";
  toggleButton.innerHTML = "👁️"; // Eye icon
  toggleButton.setAttribute("aria-label", "Show password");

  // Add toggle button to container
  container.appendChild(toggleButton);

  // Add click event to toggle password visibility
  toggleButton.addEventListener("click", function () {
    const type =
      input.getAttribute("type") === "password" ? "text" : "password";
    input.setAttribute("type", type);

    // Update button icon and aria-label
    if (type === "text") {
      this.innerHTML = "🙈"; // Closed eye icon
      this.setAttribute("aria-label", "Hide password");
    } else {
      this.innerHTML = "👁️"; // Open eye icon
      this.setAttribute("aria-label", "Show password");
    }
  });
});

// Password confirmation validation
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");

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
form.addEventListener("submit", function (e) {
  e.preventDefault();

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

  // Prepare form data
  const formData = new FormData(form);

  // Convert FormData to JSON
  const jsonData = {};
  for (const [key, value] of formData.entries()) {
    jsonData[key] = value;
  }
});

function resetSubmitButton(originalText) {
  submitBtn.innerHTML = originalText;
  submitBtn.disabled = false;
}

function showError(message) {
  // Create or update error message display
  let errorDiv = document.querySelector(".error-message");
  if (!errorDiv) {
    errorDiv = document.createElement("div");
    errorDiv.className = "error-message";
    errorDiv.style.cssText = `
                background-color: #ffebee;
                border: 1px solid #ffcdd2;
                color: #c62828;
                padding: 12px;
                border-radius: 8px;
                margin-bottom: 20px;
                text-align: center;
            `;
    form.insertBefore(errorDiv, form.firstChild);
  }
  errorDiv.textContent = message;

  // Auto-remove error message after 5 seconds
  setTimeout(() => {
    if (errorDiv && errorDiv.parentNode) {
      errorDiv.remove();
    }
  }, 5000);
}

function showSuccessAnimation() {
  // Hide form and show success message
  form.style.display = "none";
  successMessage.style.display = "block";

  // Add fade-in animation
  successMessage.style.animation = "fadeIn 0.5s ease-in";

  // Redirect after 3 seconds
  setTimeout(() => {
    const role = "<%= locals.role === 'patient' ? 'Patient' : 'Doctor' %>";
    window.location.href = `/auth/login${role}`;
  }, 3000);
}

// Check if there's a success parameter in URL (for backend success)
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get("success") === "true") {
  showSuccessAnimation();
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
    `;
document.head.appendChild(style);
