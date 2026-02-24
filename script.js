/* ===================================
   PORTFOLIO WEBSITE - JAVASCRIPT
   Alan Timothy Lie Hans Santoso
   Civil Engineer & Doctoral Researcher
   =================================== */

// ===================================
// GLOBAL VARIABLES
// ===================================
const projectCarouselState = {};

// ===================================
// PHOTO GALLERY SCROLL FUNCTIONS
// ===================================
function scrollPhotos(wrapperId, direction) {
    const wrapper = document.getElementById(wrapperId);
    if (wrapper) {
        const scrollAmount = wrapper.clientWidth * 0.8;
        wrapper.scrollBy({
            left: direction * scrollAmount,
            behavior: 'smooth'
        });
    }
}

// ===================================
// PROJECT & RESEARCH PHOTO GALLERY CAROUSEL
// ===================================
function scrollProjectPhotos(wrapperId, direction) {
    const wrapper = document.getElementById(wrapperId);
    if (!wrapper) return;

    const items = wrapper.querySelectorAll('.collage-item');
    if (items.length === 0) return;

    if (!(wrapperId in projectCarouselState)) {
        projectCarouselState[wrapperId] = 0;
    }

    projectCarouselState[wrapperId] += direction;

    // Wrap around
    if (projectCarouselState[wrapperId] < 0) {
        projectCarouselState[wrapperId] = items.length - 1;
    }
    if (projectCarouselState[wrapperId] >= items.length) {
        projectCarouselState[wrapperId] = 0;
    }

    const currentIndex = projectCarouselState[wrapperId];
    const itemWidth = items[0].offsetWidth;

    wrapper.scrollTo({
        left: currentIndex * itemWidth,
        behavior: 'smooth'
    });
}

// ===================================
// DOM CONTENT LOADED
// ===================================
document.addEventListener('DOMContentLoaded', function() {

    // ===================================
    // NAVIGATION MENU
    // ===================================
    const mainNav = document.getElementById('main-nav');
    const navLinks = document.querySelectorAll('.nav-link:not(.nav-link-disabled)');

    // Navigation scroll background effect
    function updateNavBackground() {
        if (window.scrollY > 50) {
            mainNav.classList.add('nav-scrolled');
        } else {
            mainNav.classList.remove('nav-scrolled');
        }
    }

    // Track active section on scroll
    const navSections = [
        { id: 'hero', link: document.querySelector('.nav-link[href="#hero"]') },
        { id: 'project-ministry', link: document.querySelector('.nav-link[href="#project-ministry"]') },
        { id: 'skills', link: document.querySelector('.nav-link[href="#skills"]') },
        { id: 'involvement', link: document.querySelector('.nav-link[href="#involvement"]') },
        { id: 'contact', link: document.querySelector('.nav-link[href="#contact"]') }
    ];

    function updateActiveNav() {
        const scrollPosition = window.scrollY + 100;

        // Check from bottom to top to find the current section
        for (let i = navSections.length - 1; i >= 0; i--) {
            const section = document.getElementById(navSections[i].id);
            if (section && section.offsetTop <= scrollPosition) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (navSections[i].link) {
                    navSections[i].link.classList.add('active');
                }
                break;
            }
        }
    }

    window.addEventListener('scroll', function() {
        updateNavBackground();
        updateActiveNav();
    });

    // Initialize nav state
    updateNavBackground();
    updateActiveNav();

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
    // COUNTER ANIMATION FOR RESULTS
    // ===================================
    function animateCounter(element, target, suffix = '', duration = 2000) {
        const start = 0;
        const increment = target / (duration / 16); // 60 FPS
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target + suffix;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current) + suffix;
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
                const suffix = text.includes('%') ? '%' : '';

                if (!isNaN(number) && number > 0) {
                    entry.target.textContent = '0' + suffix;
                    animateCounter(entry.target, number, suffix);
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
    // INITIALIZE ALL CAROUSELS
    // ===================================
    // Initialize project and research carousels to start at first image
    const allCarousels = document.querySelectorAll(
        '[id$="-challenge-photos"], #research-photos, #involvement-photos, #achievements-photos'
    );
    
    allCarousels.forEach(wrapper => {
        const wrapperId = wrapper.id;
        projectCarouselState[wrapperId] = 0;
        wrapper.scrollLeft = 0;
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
        transition: top 0.3s;
    `;
    skipLink.addEventListener('focus', function() {
        this.style.top = '0';
    });
    skipLink.addEventListener('blur', function() {
        this.style.top = '-40px';
    });
    document.body.insertBefore(skipLink, document.body.firstChild);

    // ===================================
    // CONSOLE MESSAGE
    // ===================================
    console.log('%c Portfolio Website ', 'background: #1A2332; color: #F5F5F0; font-size: 16px; padding: 10px;');
    console.log('%c Alan Timothy Lie Hans Santoso ', 'background: #8B6F47; color: #F5F5F0; font-size: 14px; padding: 8px;');
    console.log('%c Civil Engineer & Doctoral Researcher ', 'color: #2C3E50; font-size: 12px;');
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

// Debounce function for performance optimization
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
