document.addEventListener("DOMContentLoaded", () => {

    // ─── Intersection Observer (fade-in) ───────────────────────────
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                obs.unobserve(entry.target);
            }
        });
    }, { root: null, rootMargin: '0px', threshold: 0.12 });

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

    // ─── Sticky Nav – background on scroll ─────────────────────────
    const nav = document.getElementById('site-nav');

    function updateNav() {
        if (window.scrollY > 40) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    }
    window.addEventListener('scroll', updateNav, { passive: true });
    updateNav();

    // ─── Active nav link on scroll ─────────────────────────────────
    const sections = document.querySelectorAll('section[id], header[id]');
    const navLinks  = document.querySelectorAll('.nav-link[data-section]');

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => {
                    link.classList.toggle(
                        'active',
                        link.dataset.section === entry.target.id
                    );
                });
            }
        });
    }, { root: null, rootMargin: '-40% 0px -40% 0px', threshold: 0 });

    sections.forEach(s => sectionObserver.observe(s));

    // ─── Smooth scroll for all anchor links ────────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (!target) return;
            e.preventDefault();
            const navH = nav ? nav.offsetHeight : 72;
            const top  = target.getBoundingClientRect().top + window.scrollY - navH;
            window.scrollTo({ top, behavior: 'smooth' });

            // close mobile menu if open
            navLinks_el.classList.remove('open');
            toggleBtn.setAttribute('aria-expanded', 'false');
        });
    });

    // ─── Mobile hamburger menu ──────────────────────────────────────
    const toggleBtn  = document.getElementById('nav-toggle');
    const navLinks_el = document.getElementById('nav-links');

    toggleBtn.addEventListener('click', () => {
        const isOpen = navLinks_el.classList.toggle('open');
        toggleBtn.setAttribute('aria-expanded', String(isOpen));
    });

    // ─── Contact form – demo submit ────────────────────────────────
    const form    = document.getElementById('booking-form');
    const success = document.getElementById('form-success');
    const submitBtn = document.getElementById('form-submit-btn');

    if (form) {
        form.addEventListener('submit', e => {
            e.preventDefault();

            // Basic validation
            const required = form.querySelectorAll('[required]');
            let valid = true;
            required.forEach(field => {
                if (!field.value.trim()) {
                    field.style.borderColor = '#c0392b';
                    valid = false;
                } else {
                    field.style.borderColor = '';
                }
            });

            if (!valid) return;

            // Simulate send
            submitBtn.disabled = true;
            submitBtn.querySelector('.btn-text').textContent = 'Sending…';

            setTimeout(() => {
                form.reset();
                submitBtn.disabled = false;
                submitBtn.querySelector('.btn-text').textContent = 'Send Inquiry';
                success.removeAttribute('hidden');
                success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 1200);
        });

        // Clear red border on input
        form.querySelectorAll('input, select, textarea').forEach(field => {
            field.addEventListener('input', () => { field.style.borderColor = ''; });
        });
    }

});
