// Career Page Logic

document.addEventListener('DOMContentLoaded', () => {

    // File upload name display
    const fileInput = document.getElementById('resume');
    const fileNameDisplay = document.getElementById('file-name');

    if (fileInput) {
        fileInput.addEventListener('change', function () {
            if (this.files && this.files.length > 0) {
                fileNameDisplay.textContent = this.files[0].name;
                fileNameDisplay.style.color = '#0a3d2e';
            } else {
                fileNameDisplay.textContent = 'No file chosen';
                fileNameDisplay.style.color = '#777';
            }
        });
    }

    // Form submission handling
    const form = document.getElementById('careerForm');
    const successMessage = document.getElementById('successMessage');

    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            const formData = new FormData(form);
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalContent = submitBtn.innerHTML;

            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.7';

            const ports = [8001, 8000]; // Try 8001 first (since 8000 is often blocked), then fallback to 8000
            let currentPortIndex = 0;
            const scriptVersion = "2.1"; // Updated port fallback logic

            const trySubmit = (port) => {
                const apiUrl = `http://localhost:${port}/api/join-team`;
                
                fetch(apiUrl, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                })
                .then(response => {
                    if (!response.ok) {
                        return response.json().then(err => { throw err; });
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.success) {
                        // Success state
                        form.style.display = 'none';
                        successMessage.style.display = 'block';
                        successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    } else {
                        alert('Submission failed: ' + (data.message || 'Unknown error'));
                    }
                })
                .catch(error => {
                    console.error(`Error on port ${port}:`, error);
                    
                    if (currentPortIndex < ports.length - 1) {
                        currentPortIndex++;
                        console.log(`Retrying on port ${ports[currentPortIndex]}...`);
                        trySubmit(ports[currentPortIndex]);
                    } else {
                        let detailedError = error.message || 'Network error or CORS issue.';
                        if (error.errors) {
                            detailedError = Object.values(error.errors).flat().join('\n');
                        }
                        alert(`Something went wrong (Script v${scriptVersion})!\n\nDetails: ${detailedError}\n\nAttempted URL: ${apiUrl}\n\nPlease check if your Laravel server is running and you have refreshed the page (Ctrl + F5).`);
                    }
                })
                .finally(() => {
                    if (currentPortIndex === ports.length - 1 || form.style.display === 'none') {
                        submitBtn.innerHTML = originalContent;
                        submitBtn.disabled = false;
                        submitBtn.style.opacity = '1';
                    }
                });
            };

            trySubmit(ports[currentPortIndex]);
        });
    }
});

function resetForm() {
    const form = document.getElementById('careerForm');
    const successMessage = document.getElementById('successMessage');

    // Reset inputs
    form.reset();
    document.getElementById('file-name').textContent = 'No file chosen';

    // Toggle visibility
    successMessage.style.display = 'none';
    form.style.display = 'block';
}
