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

            // Simulate API call / processing
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalContent = submitBtn.innerHTML;

            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
            submitBtn.style.opacity = '0.8';

            setTimeout(() => {
                // Success state
                form.style.display = 'none';
                successMessage.style.display = 'block';

                // Reset button for next time (hidden though)
                submitBtn.innerHTML = originalContent;
                submitBtn.style.opacity = '1';

                // Scroll to top of card if needed
                successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 1500);
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
