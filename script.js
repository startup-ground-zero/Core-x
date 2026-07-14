// ============================================
// CORE X — Premium Website JavaScript
// Features: Preloader, Hero Slideshow, Scroll Reveal,
// Counters, Lightbox, Language Toggle, Cookie Bar,
// Back-to-Top, Smooth Scroll, Mobile Menu
// ============================================

document.addEventListener('DOMContentLoaded', () => {

    // --- Preloader ---
    const preloader = document.getElementById('preloader');
    const dismissPreloader = () => {
        preloader.classList.add('hidden');
        document.body.classList.remove('no-scroll');
    };
    window.addEventListener('load', () => {
        setTimeout(dismissPreloader, 600);
    });
    // Fallback if load already fired
    if (document.readyState === 'complete') {
        setTimeout(dismissPreloader, 600);
    }
    document.body.classList.add('no-scroll');

    // --- Navbar Scroll Effect ---
    const navbar = document.getElementById('navbar');
    const langToggle = document.getElementById('lang-toggle');

    const handleScroll = () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
            langToggle.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
            langToggle.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleScroll);

    // --- Mobile Navigation Toggle ---
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // --- Hero Slideshow ---
    const slides = document.querySelectorAll('.hero-slide');
    let currentSlide = 0;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (slides.length > 1 && !prefersReducedMotion) {
        setInterval(() => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }, 5000);
    }

    // --- Scroll Reveal ---
    const revealElements = document.querySelectorAll('.reveal, .reveal-grid');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // --- Counter Animation ---
    const counters = document.querySelectorAll('.counter');
    let countersFired = false;

    const animateCounters = () => {
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const suffix = counter.getAttribute('data-suffix') || '';
            const duration = 2000;
            const start = 0;
            const increment = target / (duration / 16);
            let current = start;

            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.textContent = Math.floor(current) + suffix;
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target + suffix;
                }
            };
            updateCounter();
        });
    };

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !countersFired) {
                countersFired = true;
                animateCounters();
                counterObserver.disconnect();
            }
        });
    }, { threshold: 0.5 });

    if (counters.length > 0) {
        counterObserver.observe(counters[0].closest('.about-stats'));
    }

    // --- Lightbox ---
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = lightbox.querySelector('.lightbox-img');
    const lightboxClose = lightbox.querySelector('.lightbox-close');
    const galleryItems = document.querySelectorAll('[data-lightbox]');

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const imgSrc = item.getAttribute('data-lightbox');
            lightboxImg.src = imgSrc;
            lightbox.classList.add('active');
            document.body.classList.add('no-scroll');
        });
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.classList.remove('no-scroll');
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });

    // --- Language Toggle ---
    const langBtns = document.querySelectorAll('.lang-btn');
    let currentLang = localStorage.getItem('corex-lang') || 'en';

    function setLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('corex-lang', lang);

        langBtns.forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
        });

        // Update text content
        document.querySelectorAll('[data-' + lang + ']').forEach(el => {
            const text = el.getAttribute('data-' + lang);
            if (text) el.textContent = text;
        });

        // Update placeholders
        document.querySelectorAll('[data-placeholder-' + lang + ']').forEach(el => {
            const placeholder = el.getAttribute('data-placeholder-' + lang);
            if (placeholder) el.placeholder = placeholder;
        });

        // Update accessible labels without replacing icon content
        document.querySelectorAll('[data-aria-' + lang + ']').forEach(el => {
            const label = el.getAttribute('data-aria-' + lang);
            if (label) el.setAttribute('aria-label', label);
        });

        updateScheduleLabels(lang);

        // Update html lang attribute
        document.documentElement.lang = lang === 'el' ? 'el' : 'en';
    }

    function updateScheduleLabels(lang) {
        const table = document.querySelector('.schedule-table');
        if (!table) return;

        const labels = Array.from(table.querySelectorAll('thead th')).map(th => th.getAttribute('data-' + lang) || th.textContent.trim());
        table.querySelectorAll('tbody tr').forEach(row => {
            Array.from(row.children).forEach((cell, index) => {
                if (labels[index]) cell.setAttribute('data-label', labels[index]);
            });
        });
    }

    langBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            setLanguage(btn.getAttribute('data-lang'));
        });
    });

    // Apply saved language on load
    if (currentLang !== 'en') {
        setLanguage(currentLang);
    } else {
        updateScheduleLabels(currentLang);
    }

    // --- Smooth Scroll ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Contact Form Handling ---
    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Honeypot check
            const honeypot = contactForm.querySelector('input[name="website"]');
            if (honeypot && honeypot.value !== '') {
                return; // Bot detected
            }

            const btn = contactForm.querySelector('button[type="submit"]');
            const btnText = btn.querySelector('.btn-text');
            const originalText = btnText.textContent;

            btn.classList.add('loading');
            btn.disabled = true;

            setTimeout(() => {
                btn.classList.remove('loading');
                btnText.textContent = currentLang === 'el' ? 'Εστάλη!' : 'Message Sent!';
                btn.style.background = '#4CAF50';
                contactForm.reset();

                setTimeout(() => {
                    btnText.textContent = originalText;
                    btn.style.background = '';
                    btn.disabled = false;
                }, 3000);
            }, 1500);
        });
    }

    // --- Cookie Bar ---
    const cookieBar = document.getElementById('cookie-bar');
    const cookieAccept = document.getElementById('cookie-accept');

    if (!localStorage.getItem('corex-cookies-accepted')) {
        setTimeout(() => {
            cookieBar.classList.add('visible');
        }, 2500);
    }

    cookieAccept.addEventListener('click', () => {
        localStorage.setItem('corex-cookies-accepted', 'true');
        cookieBar.classList.remove('visible');
        if (typeof loadGA === 'function') loadGA();
    });

    // --- Back to Top ---
    const backToTop = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 600) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // --- Active Nav Link on Scroll ---
    const sections = document.querySelectorAll('section[id]');

    const highlightNav = () => {
        const scrollPos = window.scrollY + 150;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            const link = document.querySelector(`.nav-link[href="#${id}"]`);

            if (link) {
                if (scrollPos >= top && scrollPos < top + height) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            }
        });
    };

    window.addEventListener('scroll', highlightNav);
});
