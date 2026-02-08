// Login Logic

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const errorMsg = document.getElementById('errorMsg');
    const loginBtn = document.querySelector('.login-btn');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const username = usernameInput.value.trim();
            const password = passwordInput.value.trim();

            // Simple client-side validation for demo
            if (username === 'admin' && password === 'admin') {
                // Success
                errorMsg.style.display = 'none';

                // Animate button
                loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Authenticating...';
                loginBtn.style.opacity = '0.8';

                setTimeout(() => {
                    window.location.href = 'admin.html';
                }, 1000);
            } else {
                // Failure
                errorMsg.style.display = 'flex';
                passwordInput.value = '';
                passwordInput.focus();
            }
        });

        // Hide error on input
        [usernameInput, passwordInput].forEach(input => {
            input.addEventListener('input', () => {
                errorMsg.style.display = 'none';
            });
        });
    }
});
