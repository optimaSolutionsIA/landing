document.addEventListener('DOMContentLoaded', () => {
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

    // Form Handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Simulation of sending
            const btn = contactForm.querySelector('button[type="submit"]');
            const originalText = btn.innerText;

            btn.innerText = 'Enviando...';
            btn.disabled = true;

            setTimeout(() => {
                alert('¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.');
                contactForm.reset();
                btn.innerText = originalText;
                btn.disabled = false;

                console.log('Form submission simulated');
            }, 1500);
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
