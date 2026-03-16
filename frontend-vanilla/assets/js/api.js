// frontend-vanilla/assets/js/api.js

const API_BASE_URL = 'http://localhost:4000/api';

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
        window.location.href = 'dashboard.html';
    }
}

// Universal fetch wrapper with automatic JWT token attachment
async function fetchAPI(endpoint, options = {}) {
    const token = getToken();

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers
        });

        const data = await response.json();

        // Handle auto-logout on unauthorized
        if (response.status === 401) {
            localStorage.removeItem('nazar_token');
            if (!window.location.href.includes('index.html')) {
                window.location.href = 'index.html';
            }
            throw new Error('Session expired');
        }

        if (!response.ok) {
            throw new Error(data.error || 'API Request failed');
        }

        return data;
    } catch (error) {
        console.error(`API Error on ${endpoint}:`, error);
        throw error;
    }
}

// Expose to global window object
window.api = {
    fetch: fetchAPI,
    getToken,
    requireAuth,
    redirectIfAuth
};
