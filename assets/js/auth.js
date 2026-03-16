// frontend-vanilla/assets/js/auth.js

// Auth state elements
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const authError = document.getElementById('auth-error');
const toggleToRegister = document.getElementById('toggle-register');
const toggleToLogin = document.getElementById('toggle-login');

// Toggle between Login / Register forms
if (toggleToRegister && toggleToLogin) {
    toggleToRegister.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
        authError.classList.add('hidden');
        authError.textContent = '';
    });

    toggleToLogin.addEventListener('click', (e) => {
        e.preventDefault();
        registerForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
        authError.classList.add('hidden');
        authError.textContent = '';
    });
}

function showAuthError(message) {
    if (authError) {
        authError.textContent = message;
        authError.classList.remove('hidden');
    } else {
        alert(message);
    }
}

// Handle Login Form Submission
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        authError.classList.add('hidden');

        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        try {
            const data = await window.api.fetch('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password })
            });

            // Save token and redirect
            localStorage.setItem('nazar_token', data.token);
            window.location.href = 'app.html';

        } catch (error) {
            showAuthError(error.message || 'Login failed. Check your credentials.');
        }
    });
}

// Handle Register Form Submission
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        authError.classList.add('hidden');

        const email = document.getElementById('reg-email').value;
        const password = document.getElementById('reg-password').value;
        const name = document.getElementById('reg-name').value;
        const role = document.getElementById('reg-role').value;

        try {
            const data = await window.api.fetch('/auth/register', {
                method: 'POST',
                body: JSON.stringify({ email, password, name, role })
            });

            // Save token and redirect
            localStorage.setItem('nazar_token', data.token);
            window.location.href = 'app.html';

        } catch (error) {
            showAuthError(error.message || 'Registration failed.');
        }
    });
}
