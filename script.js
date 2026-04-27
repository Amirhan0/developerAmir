(() => {
    'use strict';

    // ============================
    // INIT ICONS
    // ============================
    const initIcons = () => {
        if (window.lucide && typeof window.lucide.createIcons === 'function') {
            window.lucide.createIcons();
        }
    };

    // ============================
    // HEADER HIDE ON SCROLL DOWN
    // ============================
    const initHeader = () => {
        const header = document.querySelector('.header');
        if (!header) return;

        let lastY = window.scrollY;
        const threshold = 80;

        const onScroll = () => {
            const y = window.scrollY;
            const diff = y - lastY;

            if (y < threshold) {
                header.classList.remove('is-hidden');
            } else if (diff > 6) {
                header.classList.add('is-hidden');
            } else if (diff < -6) {
                header.classList.remove('is-hidden');
            }

            lastY = y;
        };

        window.addEventListener('scroll', onScroll, { passive: true });
    };

    // ============================
    // REVEAL ON SCROLL
    // ============================
    const initReveal = () => {
        const targets = document.querySelectorAll(
            '.hero__title .line, .hero__roles, .hero__desc, .hero__actions, .hero__meta, ' +
            '.section__head, .works__intro, .work, .about__stats, .about__quote, .about__text, ' +
            '.stack__col, .contact__label, .contact__title, .contact__desc, ' +
            '.contact__primary, .contact__socials'
        );

        targets.forEach((el, i) => {
            el.classList.add('reveal');
            if (i % 3 === 1) el.classList.add('reveal--delay-1');
            if (i % 3 === 2) el.classList.add('reveal--delay-2');
        });

        if (!('IntersectionObserver' in window)) {
            targets.forEach((el) => el.classList.add('is-visible'));
            return;
        }

        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        io.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
        );

        targets.forEach((el) => io.observe(el));
    };

    // ============================
    // COUNTERS
    // ============================
    const initCounters = () => {
        const nums = document.querySelectorAll('.stat__num');
        if (!nums.length) return;

        const animate = (el) => {
            const target = parseInt(el.dataset.count, 10);
            if (!Number.isFinite(target)) return;

            const duration = 1400;
            const start = performance.now();

            const step = (now) => {
                const progress = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                el.textContent = Math.floor(eased * target);

                if (progress < 1) {
                    requestAnimationFrame(step);
                }
            };

            requestAnimationFrame(step);
        };

        if (!('IntersectionObserver' in window)) {
            nums.forEach(animate);
            return;
        }

        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        animate(entry.target);
                        io.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.5 }
        );

        nums.forEach((el) => io.observe(el));
    };

    // ============================
    // SMOOTH ANCHOR SCROLL
    // ============================
    const initSmoothAnchors = () => {
        const links = document.querySelectorAll('a[href^="#"]');
        links.forEach((link) => {
            link.addEventListener('click', (e) => {
                const id = link.getAttribute('href');
                if (!id || id === '#') return;

                const target = document.querySelector(id);
                if (!target) return;

                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        });
    };

    // ============================
    // MAGNETIC BUTTONS (subtle)
    // ============================
    const initMagnetic = () => {
        const items = document.querySelectorAll('.btn, .work__link, .to-top, .contact__primary');
        if (matchMedia('(hover: none)').matches) return;

        items.forEach((el) => {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                el.style.transform = `translate(${x * 0.12}px, ${y * 0.12}px)`;
            });
            el.addEventListener('mouseleave', () => {
                el.style.transform = '';
            });
        });
    };

    // ============================
    // YEAR UPDATE (optional)
    // ============================
    const initYear = () => {
        const el = document.querySelector('[data-year]');
        if (el) el.textContent = new Date().getFullYear();
    };

    // ============================
    // RUN
    // ============================
    document.addEventListener('DOMContentLoaded', () => {
        initIcons();
        initHeader();
        initReveal();
        initCounters();
        initSmoothAnchors();
        initMagnetic();
        initYear();
    });
})();
