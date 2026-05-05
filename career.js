// Career Page Logic

document.addEventListener('DOMContentLoaded', () => {
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

    const form = document.getElementById('careerForm');
    const successMessage = document.getElementById('successMessage');

    if (form) {
        form.addEventListener('submit', async function (e) {
            e.preventDefault();

            const formData = new FormData(form);
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalContent = submitBtn.innerHTML;

            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.7';

            try {
                const data = await window.VitaNovaApi.postForm('/join-team', formData);

                if (data.success) {
                    form.style.display = 'none';
                    successMessage.style.display = 'block';
                    successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    window.VitaNovaUI?.toastSuccess(data.message || 'Application submitted successfully.');
                } else {
                    window.VitaNovaUI?.toastError(data.message || 'Submission failed.');
                }
            } catch (error) {
                let detailedError = error.message || 'Network error.';
                if (error.data && error.data.errors) {
                    detailedError = Object.values(error.data.errors).flat().join('\n');
                }
                window.VitaNovaUI?.toastError(detailedError);
            } finally {
                submitBtn.innerHTML = originalContent;
                submitBtn.disabled = false;
                submitBtn.style.opacity = '1';
            }
        });
    }
});

function resetForm() {
    const form = document.getElementById('careerForm');
    const successMessage = document.getElementById('successMessage');

    form.reset();
    document.getElementById('file-name').textContent = 'No file chosen';
    successMessage.style.display = 'none';
    form.style.display = 'block';
}
