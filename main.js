document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggle
    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;
    const saveTheme = localStorage.getItem('theme');
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

    // Set initial theme
    const currentTheme = saveTheme || systemTheme;
    if (currentTheme === 'light') {
        html.setAttribute('data-theme', 'light');
        themeToggle.innerText = '☀️';
    } else {
        html.removeAttribute('data-theme');
        themeToggle.innerText = '🌙';
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            if (html.hasAttribute('data-theme')) {
                html.removeAttribute('data-theme');
                localStorage.setItem('theme', 'dark');
                themeToggle.innerText = '🌙';
            } else {
                html.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
                themeToggle.innerText = '☀️';
            }
        });
    }

    // Scroll Animation Observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.fade-in-up, .fade-in-on-scroll');
    animatedElements.forEach(el => observer.observe(el));

    // Toast Function
    function showToast(message, type = 'success') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;

        const icon = type === 'success' ? '✓' : '✕';

        toast.innerHTML = `
            <span class="toast-icon">${icon}</span>
            <span>${message}</span>
        `;

        container.appendChild(toast);

        // Remove after animation (5s total)
        setTimeout(() => {
            toast.remove();
        }, 5000);
    }

    // Form Handling with Formspree
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const btn = contactForm.querySelector('button[type="submit"]');
            const originalText = btn.innerText;
            const formData = new FormData(contactForm);

            // IMPORTANT: Create a .env file with VITE_FORMSPREE_URL=https://formspree.io/f/YOUR_ID
            const formspreeUrl = import.meta.env.VITE_FORMSPREE_URL || 'https://formspree.io/f/YOUR_FORM_ID';

            btn.innerText = 'Enviando...';
            btn.disabled = true;

            try {
                const response = await fetch(formspreeUrl, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    showToast('¡Mensaje enviado correctamente!', 'success');
                    contactForm.reset();
                } else {
                    const data = await response.json();
                    if (data.errors) {
                        showToast('Error: ' + data.errors.map(error => error.message).join(", "), 'error');
                    } else {
                        showToast('Hubo un problema al enviar el mensaje.', 'error');
                    }
                }
            } catch (error) {
                // If the URL is "YOUR_FORM_ID", it returns 404, we catch it here mostly
                if (formspreeUrl.includes('YOUR_FORM_ID')) {
                    showToast('Falta configurar el ID de Formspree en el código.', 'error');
                } else {
                    showToast('Error de conexión. Inténtalo de nuevo.', 'error');
                }
            } finally {
                btn.innerText = originalText;
                btn.disabled = false;
            }
        });
    }

    // Mobile Menu Toggle (Basic implementation)
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navList = document.querySelector('.nav-list');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            if (navList.style.display === 'flex') {
                navList.style.display = 'none';
            } else {
                navList.style.display = 'flex';
                navList.style.flexDirection = 'column';
                navList.style.position = 'absolute';
                navList.style.top = '70px';
                navList.style.left = '0';
                navList.style.width = '100%';
                navList.style.background = 'rgba(5,5,5,0.95)';
                navList.style.padding = '20px';
                navList.style.borderBottom = '1px solid var(--border-color)';
            }
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
                // Close mobile menu if open
                if (window.innerWidth <= 768 && navList.style.display === 'flex') {
                    navList.style.display = 'none';
                }
            }
        });
    });
});
