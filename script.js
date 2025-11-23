console.log("Website Loaded");

// Formspree Configuration
// IMPORTANT: Replace YOUR_FORM_ID in booknow.html with your Formspree form ID
// Get your form ID from: https://formspree.io/forms

// Booking Form Handler
document.addEventListener('DOMContentLoaded', function() {
    const bookingForm = document.getElementById('bookingForm');
    const submitBtn = bookingForm ? bookingForm.querySelector('.submit-btn') : null;
    const replyToField = bookingForm ? bookingForm.querySelector('input[name="_replyto"]') : null;
    
    if (bookingForm) {
        // Update _replyto field with user's email when they type it
        const emailInput = document.getElementById('email');
        if (emailInput && replyToField) {
            emailInput.addEventListener('input', function() {
                replyToField.value = this.value;
            });
        }
        
        bookingForm.addEventListener('submit', function(e) {
            // Get form values for validation
            const formData = {
                name: document.getElementById('name').value.trim(),
                email: document.getElementById('email').value.trim(),
                phone: document.getElementById('phone').value.trim(),
                service: document.getElementById('service').value,
                date: document.getElementById('date').value,
                time: document.getElementById('time').value
            };
            
            // Validation
            if (!formData.name || !formData.email || !formData.phone || !formData.service || !formData.date || !formData.time) {
                e.preventDefault();
                showMessage('Please fill in all required fields.', 'error');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                e.preventDefault();
                showMessage('Please enter a valid email address.', 'error');
                return;
            }
            
            // Show loading state
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Sending...';
            }
            
            // Format date and time for better display in email
            const dateInput = document.getElementById('date');
            const timeInput = document.getElementById('time');
            
            if (dateInput && dateInput.value) {
                // Add a formatted date field
                const formattedDate = formatDate(dateInput.value);
                let hiddenDateField = bookingForm.querySelector('input[name="formatted_date"]');
                if (!hiddenDateField) {
                    hiddenDateField = document.createElement('input');
                    hiddenDateField.type = 'hidden';
                    hiddenDateField.name = 'formatted_date';
                    bookingForm.appendChild(hiddenDateField);
                }
                hiddenDateField.value = formattedDate;
            }
            
            if (timeInput && timeInput.value) {
                // Add a formatted time field
                const formattedTime = formatTime(timeInput.value);
                let hiddenTimeField = bookingForm.querySelector('input[name="formatted_time"]');
                if (!hiddenTimeField) {
                    hiddenTimeField = document.createElement('input');
                    hiddenTimeField.type = 'hidden';
                    hiddenTimeField.name = 'formatted_time';
                    bookingForm.appendChild(hiddenTimeField);
                }
                hiddenTimeField.value = formattedTime;
            }
            
            // Form will submit normally to Formspree
            // Show success message after a short delay (Formspree will handle the redirect)
            setTimeout(function() {
                showMessage('Thank you! Your booking request has been submitted. We will contact you soon to confirm your appointment.', 'success');
            }, 500);
        });
        
        // Handle Formspree success/error responses
        // Check if we're returning from Formspree redirect
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('submitted') === 'true') {
            showMessage('Thank you! Your booking request has been submitted. We will contact you soon to confirm your appointment.', 'success');
            // Clean up URL
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }
    
    // Set minimum date to today
    const dateInput = document.getElementById('date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }
});

// Helper function to format date
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Helper function to format time
function formatTime(timeString) {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
}

// Show message to user
function showMessage(message, type) {
    // Remove existing message if any
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message ${type}`;
    messageDiv.textContent = message;
    
    // Insert message before submit button
    const submitBtn = document.querySelector('.submit-btn');
    if (submitBtn && submitBtn.parentNode) {
        submitBtn.parentNode.insertBefore(messageDiv, submitBtn);
        
        // Auto-remove success messages after 5 seconds
        if (type === 'success') {
            setTimeout(function() {
                messageDiv.remove();
            }, 5000);
        }
    } else {
        // Fallback: use alert
        alert(message);
    }
}