/* ===================================
   PORTFOLIO WEBSITE - JAVASCRIPT
   Alan Timothy Lie Hans Santoso
   Civil Engineer & Doctoral Researcher
   =================================== */

// ===================================
// GLOBAL VARIABLES
// ===================================
let researchCurrentIndex = 0;

// ===================================
// PHOTO GALLERY SCROLL FUNCTIONS
// Untuk semua carousel: research, project sections, involvement, achievements
// ===================================

// Function untuk leadership section (involvement)
function scrollPhotos(direction) {
    const wrapper = document.getElementById('photoCollage');
    if (wrapper) {
        const scrollAmount = wrapper.clientWidth * 0.8;
        wrapper.scrollBy({
            left: direction * scrollAmount,
            behavior: 'smooth'
        });
    }
}

// Function untuk research carousel (KMITL) - transform based
function scrollResearchPhotos(direction) {
    const wrapper = document.getElementById('research-photos');
    if (!wrapper) return;

    const strip = wrapper.querySelector('.project-photo-collage');
    const items = wrapper.querySelectorAll('.project-collage-item');
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

// Function untuk project carousels (ministry, transport, highway) - scroll based
function scrollProjectPhotos(wrapperId, direction) {
    const wrapper = document.getElementById(wrapperId);
    if (!wrapper) return;

    const items = wrapper.querySelectorAll('.collage-item');
    if (items.length === 0) return;

    const itemWidth = items[0].offsetWidth + 10; // Include margin
    const scrollAmount = itemWidth;

    wrapper.scrollBy({
        left: direction * scrollAmount,
        behavior: 'smooth'
    });
}

// Function untuk achievement section
function scrollAchievementPhotos(direction) {
    const wrapper = document.getElementById('achievement-photoCollage');
    if (wrapper) {
        const scrollAmount = wrapper.clientWidth * 0.8;
        wrapper.scrollBy({
            left: direction * scrollAmount,
            behavior: 'smooth'
        });
    }
}

// ===================================
// DOM CONTENT LOADED - INITIALIZATION
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
    // INITIALIZE ALL CAROUSELS
    // ===================================
    
    // Initialize semua carousel dengan smooth scrolling
    const allCarousels = document.querySelectorAll('.photo-collage-wrapper');
    
    allCarousels.forEach(carousel => {
        // Pastikan carousel bisa discroll dengan smooth
        carousel.style.scrollBehavior = 'smooth';
        
        // Tambahkan event listener untuk mouse wheel
        carousel.addEventListener('wheel', function(e) {
            e.preventDefault();
            this.scrollLeft += e.deltaY;
        });
        
        // Tambahkan touch event untuk mobile
        let isDragging = false;
        let startX;
        let scrollLeft;
        
        carousel.addEventListener('touchstart', (e) => {
            isDragging = true;
            startX = e.touches[0].pageX - carousel.offsetLeft;
            scrollLeft = carousel.scrollLeft;
        });
        
        carousel.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const x = e.touches[0].pageX - carousel.offsetLeft;
            const walk = (x - startX) * 2;
            carousel.scrollLeft = scrollLeft - walk;
        });
        
        carousel.addEventListener('touchend', () => {
            isDragging = false;
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
        
        /* Loading state untuk images */
        .collage-item img {
            background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
            background-size: 200% 100%;
            animation: loading 1.5s infinite;
        }
        
        @keyframes loading {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
        }
        
        /* Fokus state untuk carousels */
        .photo-collage-wrapper:focus {
            outline: 2px solid var(--warm-brown);
            outline-offset: 2px;
        }
    `;
    document.head.appendChild(style);

    // ===================================
    // KEYBOARD NAVIGATION FOR CAROUSELS
    // ===================================
    document.addEventListener('keydown', function(e) {
        const activeCarousel = document.querySelector('.photo-collage-wrapper:focus-within');
        if (activeCarousel) {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                activeCarousel.scrollBy({ left: -300, behavior: 'smooth' });
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                activeCarousel.scrollBy({ left: 300, behavior: 'smooth' });
            }
        }
    });

    // ===================================
    // CAROUSEL BUTTON VISIBILITY
    // ===================================
    
    // Show scroll buttons on hover untuk desktop
    if (window.innerWidth > 768) {
        const carouselContainers = document.querySelectorAll('.photo-collage-container');
        
        carouselContainers.forEach(container => {
            const scrollButtons = container.querySelectorAll('.scroll-btn');
            
            container.addEventListener('mouseenter', function() {
                scrollButtons.forEach(btn => btn.style.opacity = '1');
            });
            
            container.addEventListener('mouseleave', function() {
                scrollButtons.forEach(btn => btn.style.opacity = '0.7');
            });
            
            // Set initial opacity
            scrollButtons.forEach(btn => btn.style.opacity = '0.7');
        });
    }
    
    // Auto-hide scroll buttons untuk mobile setelah 3 detik
    if (window.innerWidth <= 768) {
        const mobileScrollButtons = document.querySelectorAll('.scroll-btn');
        
        // Show buttons initially
        mobileScrollButtons.forEach(btn => btn.style.opacity = '1');
        
        // Set timeout untuk hide buttons
        setTimeout(() => {
            mobileScrollButtons.forEach(btn => {
                if (!btn.matches(':hover')) {
                    btn.style.opacity = '0.7';
                }
            });
        }, 3000);
        
        // Show buttons on tap/hover
        mobileScrollButtons.forEach(btn => {
            btn.addEventListener('touchstart', function() {
                this.style.opacity = '1';
            });
            
            btn.addEventListener('mouseenter', function() {
                this.style.opacity = '1';
            });
            
            btn.addEventListener('mouseleave', function() {
                this.style.opacity = '0.7';
            });
        });
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
