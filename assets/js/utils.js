// Theme Toggle Logic
function toggleTheme() {
    const isLight = document.body.classList.toggle('light');
    const themeBtn = document.getElementById('themeBtn');
    if (themeBtn) themeBtn.textContent = isLight ? '☀️' : '🌙';
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
}

// Initial Theme Load
(function () {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light');
        window.addEventListener('DOMContentLoaded', () => {
            const themeBtn = document.getElementById('themeBtn');
            if (themeBtn) themeBtn.textContent = '☀️';
        });
    }
})();

// Scroll Reveal Logic
document.addEventListener('DOMContentLoaded', () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
});

// Mobile Menu Logic
function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    if (navLinks) navLinks.classList.toggle('show');
}
