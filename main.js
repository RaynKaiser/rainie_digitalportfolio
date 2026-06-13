/* ================================================
   RAINIE — Portfolio · Main JavaScript
   ================================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ─── Matrix Rain Background ───
    const canvas = document.getElementById('matrix-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let w, h, columns, drops;
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()<>{}[]|/\\~`';
        const fontSize = 14;

        function resize() {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
            columns = Math.floor(w / fontSize);
            drops = Array.from({ length: columns }, () => Math.random() * -100);
        }

        function draw() {
            ctx.fillStyle = 'rgba(15, 23, 42, 0.05)';
            ctx.fillRect(0, 0, w, h);
            ctx.fillStyle = '#818cf8';
            ctx.font = `${fontSize}px 'Fira Code', monospace`;

            for (let i = 0; i < drops.length; i++) {
                const char = chars[Math.floor(Math.random() * chars.length)];
                const x = i * fontSize;
                const y = drops[i] * fontSize;
                ctx.globalAlpha = Math.random() * 0.4 + 0.1;
                ctx.fillText(char, x, y);

                if (y > h && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
            ctx.globalAlpha = 1;
            requestAnimationFrame(draw);
        }

        resize();
        draw();
        window.addEventListener('resize', resize);
    }

    // ─── Typed Tagline ───
    const taglines = [
        'AI Solutions Architect',
        'Data-Driven Developer',
        'Python & SQL Specialist',
        'Quality Assurance Expert',
        'Creative Problem Solver',
    ];
    const typedEl = document.getElementById('typed-tagline');
    if (typedEl) {
        let taglineIdx = 0;
        let charIdx = 0;
        let isDeleting = false;
        let typeDelay = 100;

        function typeLoop() {
            const current = taglines[taglineIdx];
            if (isDeleting) {
                typedEl.textContent = current.substring(0, charIdx - 1);
                charIdx--;
                typeDelay = 50;
            } else {
                typedEl.textContent = current.substring(0, charIdx + 1);
                charIdx++;
                typeDelay = 100;
            }

            if (!isDeleting && charIdx === current.length) {
                typeDelay = 2000;
                isDeleting = true;
            } else if (isDeleting && charIdx === 0) {
                isDeleting = false;
                taglineIdx = (taglineIdx + 1) % taglines.length;
                typeDelay = 400;
            }

            setTimeout(typeLoop, typeDelay);
        }

        // Start after initial delay so terminal "loads"
        setTimeout(typeLoop, 1200);
    }

    // ─── Navbar Scroll Effect ───
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('.section, .hero-section');
    const navLinks = document.querySelectorAll('.nav-link');

    function onScroll() {
        // Scrolled state
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active link
        let current = '';
        sections.forEach(section => {
            const top = section.offsetTop - 120;
            if (window.scrollY >= top) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.dataset.section === current) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // ─── Mobile Nav Toggle ───
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('open');
            // Animate hamburger
            navToggle.classList.toggle('active');
        });

        // Close on link click
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('open');
                navToggle.classList.remove('active');
            });
        });
    }

    // ─── Scroll Reveal ───
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    revealElements.forEach(el => revealObserver.observe(el));

    // ─── Stat Counter Animation ───
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
    const statObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = parseInt(el.dataset.target, 10);
                    animateCounter(el, target);
                    statObserver.unobserve(el);
                }
            });
        },
        { threshold: 0.5 }
    );

    statNumbers.forEach(el => statObserver.observe(el));

    function animateCounter(el, target) {
        const duration = 1500;
        const start = performance.now();
        function step(now) {
            const progress = Math.min((now - start) / duration, 1);
            // ease-out
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(eased * target);
            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                el.textContent = target;
            }
        }
        requestAnimationFrame(step);
    }

    // ─── Skill Bar Fill on Scroll ───
    const skillFills = document.querySelectorAll('.skill-fill');
    const skillObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const level = entry.target.dataset.level;
                    entry.target.style.width = level + '%';
                    skillObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.3 }
    );

    skillFills.forEach(el => skillObserver.observe(el));

    // ─── Subtle Card Tilt Effect ───
    const tiltCards = document.querySelectorAll('[data-tilt]');
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            card.style.transform = `
        perspective(600px)
        rotateY(${x * 6}deg)
        rotateX(${-y * 6}deg)
        translateY(-4px)
      `;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    // ─── Contact Form (Actual Formsubmit Handler) ───
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('.btn-submit');
            const original = btn.innerHTML;
            btn.innerHTML = '<span class="code-fn">sending</span><span class="code-paren">...</span>';
            btn.disabled = true;
            btn.style.opacity = '0.7';

            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());

            fetch("https://formsubmit.co/ajax/rainietan09022006@gmail.com", {
                method: "POST",
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(result => {
                btn.innerHTML = '<span class="code-fn" style="color: #34d399;">✓ messageSent</span><span class="code-paren">()</span>';
                setTimeout(() => {
                    btn.innerHTML = original;
                    btn.disabled = false;
                    btn.style.opacity = '1';
                    contactForm.reset();
                }, 2500);
            })
            .catch(error => {
                console.error(error);
                btn.innerHTML = '<span class="code-fn" style="color: #f87171;">✗ error</span><span class="code-paren">()</span>';
                setTimeout(() => {
                    btn.innerHTML = original;
                    btn.disabled = false;
                    btn.style.opacity = '1';
                }, 2500);
            });
        });
    }

    // ─── Smooth Scroll for anchor links ───
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ─── Modal ESC Key Close ───
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const modal = document.querySelector('.project-modal.active');
            if (modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    });

});
