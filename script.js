/* ===================================
   PORTFOLIO WEBSITE - JAVASCRIPT
   Alan Timothy Lie Hans Santoso
   Civil Engineer & Doctoral Researcher
   =================================== */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {

    // ===================================
    // SMOOTH SCROLLING FOR ANCHOR LINKS
    // ===================================
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');

    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            // Only handle internal links (not just "#")
            if (href !== '#' && href.length > 1) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // ===================================
    // SCROLL ANIMATIONS
    // ===================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observerCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Elements to animate on scroll
    const animateElements = document.querySelectorAll(
        '.project-block, .experience-item, .involvement-item, .achievement-card, .research-grid'
    );

    animateElements.forEach(element => {
        // Set initial state
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';

        // Observe element
        observer.observe(element);
    });

    // ===================================
    // SCROLL INDICATOR FADE
    // ===================================
    const scrollIndicator = document.querySelector('.scroll-indicator');

    if (scrollIndicator) {
        window.addEventListener('scroll', function() {
            const scrollPosition = window.scrollY;
            const opacity = Math.max(1 - scrollPosition / 500, 0);
            scrollIndicator.style.opacity = opacity;
        });
    }

    // ===================================
    // TYPING EFFECT FOR HERO TAGLINE (Optional Enhancement)
    // ===================================
    function typeWriter(element, text, speed = 50) {
        let i = 0;
        element.textContent = '';
        element.style.opacity = '1';

        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }

        type();
    }

    // Uncomment below to enable typing effect on hero tagline
    /*
    const heroTagline = document.querySelector('.hero-tagline');
    if (heroTagline) {
        const originalText = heroTagline.textContent;
        heroTagline.style.opacity = '0';
        setTimeout(() => {
            typeWriter(heroTagline, originalText, 30);
        }, 500);
    }
    */

    // ===================================
    // COUNTER ANIMATION FOR RESULTS
    // ===================================
    function animateCounter(element, target, duration = 2000) {
        const start = 0;
        const increment = target / (duration / 16); // 60 FPS
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 16);
    }

    // Animate counters when they come into view
    const resultNumbers = document.querySelectorAll('.result-number');

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('counted');
                const text = entry.target.textContent.trim();
                const number = parseInt(text);

                if (!isNaN(number) && number > 0) {
                    entry.target.textContent = '0';
                    animateCounter(entry.target, number);
                }
            }
        });
    }, { threshold: 0.5 });

    resultNumbers.forEach(number => {
        counterObserver.observe(number);
    });

    // ===================================
    // LAZY LOADING IMAGES
    // ===================================
    const images = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => {
        imageObserver.observe(img);
    });

    // ===================================
    // PARALLAX EFFECT (Subtle)
    // ===================================
    window.addEventListener('scroll', function() {
        const scrolled = window.scrollY;
        const parallaxElements = document.querySelectorAll('.project-image img');

        parallaxElements.forEach(element => {
            const speed = 0.3;
            const yPos = -(scrolled * speed);
            // Only apply if element is in viewport
            const rect = element.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                element.style.transform = `translateY(${yPos}px)`;
            }
        });
    });

    // ===================================
    // NAVIGATION HIGHLIGHT (if you add a navbar)
    // ===================================
    function highlightNavigation() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('nav a[href^="#"]');

        window.addEventListener('scroll', () => {
            let current = '';

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (scrollY >= (sectionTop - 200)) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
    }

    // Uncomment if you add navigation menu
    // highlightNavigation();

    // ===================================
    // SKILLS TAG ANIMATION
    // ===================================
    const skillTags = document.querySelectorAll('.skill-tag');

    skillTags.forEach((tag, index) => {
        tag.style.animationDelay = `${index * 0.05}s`;
        tag.style.animation = 'fadeInScale 0.5s ease forwards';
    });

    // Add CSS animation dynamically
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInScale {
            from {
                opacity: 0;
                transform: scale(0.8);
            }
            to {
                opacity: 1;
                transform: scale(1);
            }
        }
    `;
    document.head.appendChild(style);

    // ===================================
    // MOBILE MENU TOGGLE (if you add mobile nav)
    // ===================================
    function setupMobileMenu() {
        const menuButton = document.querySelector('.mobile-menu-button');
        const mobileMenu = document.querySelector('.mobile-menu');

        if (menuButton && mobileMenu) {
            menuButton.addEventListener('click', function() {
                mobileMenu.classList.toggle('active');
                this.classList.toggle('active');
            });

            // Close menu when clicking a link
            const mobileLinks = mobileMenu.querySelectorAll('a');
            mobileLinks.forEach(link => {
                link.addEventListener('click', function() {
                    mobileMenu.classList.remove('active');
                    menuButton.classList.remove('active');
                });
            });
        }
    }

    // setupMobileMenu(); // Uncomment if you add mobile navigation

    // ===================================
    // CONSOLE MESSAGE
    // ===================================
    console.log('%c Portfolio Website ', 'background: #1A2332; color: #F5F5F0; font-size: 16px; padding: 10px;');
    console.log('%c Alan Timothy Lie Hans Santoso ', 'background: #8B6F47; color: #F5F5F0; font-size: 14px; padding: 8px;');
    console.log('%c Civil Engineer & Doctoral Researcher ', 'color: #2C3E50; font-size: 12px;');

    // ===================================
    // PERFORMANCE OPTIMIZATION
    // ===================================
    // Debounce scroll events
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Apply debounce to scroll-heavy functions if needed
    // Example: window.addEventListener('scroll', debounce(yourFunction, 100));

    // ===================================
    // FORM VALIDATION (if you add contact form)
    // ===================================
    function setupFormValidation() {
        const form = document.querySelector('.contact-form');

        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();

                // Get form fields
                const name = form.querySelector('input[name="name"]').value.trim();
                const email = form.querySelector('input[name="email"]').value.trim();
                const message = form.querySelector('textarea[name="message"]').value.trim();

                // Simple validation
                if (!name || !email || !message) {
                    alert('Please fill in all fields');
                    return;
                }

                // Email validation
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    alert('Please enter a valid email address');
                    return;
                }

                // If validation passes, submit form or send via AJAX
                console.log('Form submitted:', { name, email, message });
                alert('Thank you for your message! I will get back to you soon.');
                form.reset();
            });
        }
    }

    // setupFormValidation(); // Uncomment if you add a contact form

    // ===================================
    // LOADING STATE MANAGEMENT
    // ===================================
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');

        // Remove any loading screens
        const loader = document.querySelector('.page-loader');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }
    });

    // ===================================
    // ACCESSIBILITY IMPROVEMENTS
    // ===================================
    // Add skip to main content link
    const skipLink = document.createElement('a');
    skipLink.href = '#hero';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Skip to main content';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 0;
        background: var(--warm-brown);
        color: white;
        padding: 8px;
        text-decoration: none;
        z-index: 100;
    `;
    skipLink.addEventListener('focus', function() {
        this.style.top = '0';
    });
    skipLink.addEventListener('blur', function() {
        this.style.top = '-40px';
    });
    document.body.insertBefore(skipLink, document.body.firstChild);

    // ===================================
    // DARK MODE TOGGLE (Optional)
    // ===================================
    function setupDarkModeToggle() {
        const darkModeToggle = document.querySelector('.dark-mode-toggle');

        if (darkModeToggle) {
            // Check for saved preference
            const darkMode = localStorage.getItem('darkMode');
            if (darkMode === 'enabled') {
                document.body.classList.add('dark-mode');
            }

            darkModeToggle.addEventListener('click', function() {
                document.body.classList.toggle('dark-mode');

                // Save preference
                if (document.body.classList.contains('dark-mode')) {
                    localStorage.setItem('darkMode', 'enabled');
                } else {
                    localStorage.setItem('darkMode', null);
                }
            });
        }
    }

    // setupDarkModeToggle(); // Uncomment if you add dark mode toggle

});

// ===================================
// UTILITY FUNCTIONS
// ===================================

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Smooth scroll to top
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Copy text to clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        console.log('Text copied to clipboard');
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
}

// Export functions if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        isInViewport,
        scrollToTop,
        copyToClipboard
    };
}
