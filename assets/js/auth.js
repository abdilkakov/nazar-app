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
        const email = document.getElementById('login-email').value;

        // Mock login
        localStorage.setItem('nazar_token', 'local-token-' + Date.now());
        localStorage.setItem('nazar_user', email.split('@')[0]);
        window.location.href = 'app.html';
    });
}

// Handle Register Form Submission
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('reg-email').value;
        const name = document.getElementById('reg-name').value;

        // Mock registration
        localStorage.setItem('nazar_token', 'local-token-' + Date.now());
        localStorage.setItem('nazar_user', name || email.split('@')[0]);
        window.location.href = 'app.html';
    });
}
