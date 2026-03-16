// frontend-vanilla/assets/js/api.js

// Use dynamic URL: check localStorage, then window variable, then default to localhost
const API_BASE_URL = localStorage.getItem('NAZAR_API_URL') ||
    window.NAZAR_API_URL ||
    `http://${window.location.hostname}:4000/api`;

// Helper function to get auth token
function getToken() {
    return localStorage.getItem('nazar_token');
}

// Ensure the user is authenticated, else redirect to login
function requireAuth() {
    const token = getToken();
    if (!token) {
        window.location.href = 'index.html';
        return false;
    }
    return true;
}

// Redirect to dashboard if already logged in
function redirectIfAuth() {
    const token = getToken();
    if (token) {
        window.location.href = 'app.html';
    }
}

// Universal fetch wrapper - MOCKED for local-only vanilla version
async function fetchAPI(endpoint, options = {}) {
    console.warn(`API call to ${endpoint} ignored in local-only mode.`);
    return {}; // Return empty object to prevent errors
}

// Expose to global window object
window.api = {
    fetch: fetchAPI,
    getToken,
    requireAuth,
    redirectIfAuth
};
