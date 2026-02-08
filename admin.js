// Admin Dashboard Interactions

document.addEventListener('DOMContentLoaded', () => {

    // Upload Area Interaction
    const uploadArea = document.querySelector('.upload-area');

    if (uploadArea) {
        uploadArea.addEventListener('click', () => {
            alert('This would open the file picker in a real application.');
        });

        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = '#2ecc71';
            uploadArea.style.background = 'rgba(46, 204, 113, 0.05)';
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.style.borderColor = '#ddd';
            uploadArea.style.background = 'transparent';
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = '#2ecc71';
            uploadArea.querySelector('span').textContent = 'Photo Added!';
            uploadArea.querySelector('i').className = 'fas fa-check-circle';
        });
    }

    // Quick Add Form
    const activityForm = document.getElementById('activityForm');
    if (activityForm) {
        activityForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = activityForm.querySelector('button');
            const originalText = btn.innerHTML;

            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Publishing...';

            setTimeout(() => {
                btn.innerHTML = '<i class="fas fa-check"></i> Published!';
                btn.classList.add('success');
                activityForm.reset();
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.classList.remove('success');
                }, 2000);
            }, 1000);
        });
    }

    // Action Buttons
    const buttons = document.querySelectorAll('.action-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', function (e) {
            // Prevent default if it's following a link (unless specifically handled)
            if (this.getAttribute('type') !== 'submit') {
                const text = this.textContent.trim();
                console.log(`Clicked action: ${text}`);

                // Visual feedback
                this.style.transform = 'scale(0.95)';
                setTimeout(() => this.style.transform = 'scale(1)', 100);
            }
        });
    });
});
