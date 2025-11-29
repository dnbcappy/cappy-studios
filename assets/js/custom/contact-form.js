/**
 * Contact Form Handler
 * Handles form submission to Firebase Cloud Function
 */

document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');

    if (!contactForm) return;

    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const submitButton = contactForm.querySelector('input[type="submit"]');
        const originalButtonText = submitButton.value;

        // Disable form during submission
        submitButton.disabled = true;
        submitButton.value = 'Sending...';

        // Get form data
        const formData = {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value.trim()
        };

        try {
            // Send to Firebase Cloud Function
            const response = await fetch('https://submitcontactform-cgelub3v5a-uc.a.run.app', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (result.success) {
                // Show success message
                showMessage('success', result.message || 'Message sent successfully!');
                contactForm.reset();
            } else {
                // Show error message
                showMessage('error', result.message || 'Failed to send message. Please try again.');
            }

        } catch (error) {
            console.error('Error submitting form:', error);
            showMessage('error', 'An error occurred. Please try emailing directly at cappystudios.dev@gmail.com');
        } finally {
            // Re-enable form
            submitButton.disabled = false;
            submitButton.value = originalButtonText;
        }
    });

    /**
     * Display feedback message to user
     */
    function showMessage(type, message) {
        // Remove any existing messages
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create new message element
        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message form-message-${type}`;
        messageDiv.style.cssText = `
            padding: 1rem 1.5rem;
            margin: 1rem 0;
            border-radius: 8px;
            font-size: 0.95rem;
            animation: slideIn 0.3s ease-out;
            ${type === 'success'
                ? 'background: rgba(16, 185, 129, 0.1); border-left: 4px solid #10b981; color: #059669;'
                : 'background: rgba(239, 68, 68, 0.1); border-left: 4px solid #ef4444; color: #dc2626;'}
        `;
        messageDiv.textContent = message;

        // Insert message before form
        contactForm.parentNode.insertBefore(messageDiv, contactForm);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            messageDiv.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => messageDiv.remove(), 300);
        }, 5000);
    }
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes slideOut {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(-10px);
        }
    }
`;
document.head.appendChild(style);
