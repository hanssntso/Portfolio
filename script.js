/* ===================================
   PORTFOLIO WEBSITE - JAVASCRIPT
   Alan Timothy Lie Hans Santoso
   Civil Engineer & Doctoral Researcher
   =================================== */

// ===================================
// GLOBAL VARIABLES
// ===================================
const projectCarouselState = {};
let researchCurrentIndex = 0;

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
// PROJECT PHOTO GALLERY CAROUSEL
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
// RESEARCH PHOTO CAROUSEL
// ===================================
function scrollResearchPhotos(direction) {
    const wrapper = document.getElementById('research-photos');
    if (!wrapper) return;

    const strip = wrapper.querySelector('.research-photo-collage');
    const items = wrapper.querySelectorAll('.collage-item');
    if (!strip || items.length === 0) return;

    researchCurrentIndex += direction;

    // Wrap around
    if (researchCurrentIndex < 0) {
        researchCurrentIndex = items.length - 1;
    }
    if (researchCurrentIndex >= items.length) {
        researchCurrentIndex = 0;
    }

    const itemWidth = items[0].offsetWidth;
    strip.style.transform = 'translateX(-' + (researchCurrentIndex * itemWidth) + 'px)';
}

// ===================================
// DOM CONTENT LOADED
// ===================================
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
    // INITIALIZE PROJECT CAROUSELS
    // ===================================
    // Initialize all project carousels to start at first image
    const projectWrappers = document.querySelectorAll('[id$="-challenge-photos"]');
    projectWrappers.forEach(wrapper => {
        const wrapperId = wrapper.id;
        projectCarouselState[wrapperId] = 0;
        wrapper.scrollLeft = 0;
    });

    // Initialize research carousel
    const researchWrapper = document.getElementById('research-photos');
    if (researchWrapper) {
        researchCurrentIndex = 0;
        const strip = researchWrapper.querySelector('.research-photo-collage');
        if (strip) {
            strip.style.transform = 'translateX(0)';
        }
    }

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
    // ENSURE BUTTONS ARE VISIBLE ON SMALL DEVICES
    // ===================================
    function ensureButtonsVisible() {
        const allScrollButtons = document.querySelectorAll('.scroll-btn');
        allScrollButtons.forEach(button => {
            button.style.display = 'flex';
            button.style.visibility = 'visible';
            button.style.opacity = '1';
        });
    }

    // Run on load and resize
    ensureButtonsVisible();
    window.addEventListener('resize', ensureButtonsVisible);

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

// Export functions if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        isInViewport,
        scrollToTop,
        copyToClipboard,
        debounce
    };
}
