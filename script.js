/* ===================================
   PORTFOLIO WEBSITE - JAVASCRIPT
   Alan Timothy Lie Hans Santoso
   Civil Engineer & Doctoral Researcher
   =================================== */

// ===================================
// PHOTO GALLERY SCROLL (Main Involvement Section)
// ===================================
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

// ===================================
// PROJECT PHOTO GALLERY (1x3 Grid System)
// ===================================
const projectCarouselState = {};

function scrollProjectPhotos(wrapperId, direction) {
    const wrapper = document.getElementById(wrapperId);
    if (!wrapper) return;

    const items = wrapper.querySelectorAll('.project-collage-item');
    if (items.length === 0) return;

    const isMobile = window.innerWidth <= 768;
    
    if (!projectCarouselState[wrapperId]) {
        projectCarouselState[wrapperId] = {
            currentIndex: 0,
            itemWidth: items[0].offsetWidth
        };
    }

    let currentIndex = projectCarouselState[wrapperId].currentIndex;
    let itemWidth = projectCarouselState[wrapperId].itemWidth;
    
    // Update item width in case of window resize
    itemWidth = items[0].offsetWidth;
    projectCarouselState[wrapperId].itemWidth = itemWidth;

    if (isMobile) {
        // Mobile: Scroll by 1 item
        currentIndex += direction;
        
        // Wrap around for mobile
        if (currentIndex < 0) {
            currentIndex = items.length - 1;
        } else if (currentIndex >= items.length) {
            currentIndex = 0;
        }
        
        wrapper.scrollTo({
            left: currentIndex * itemWidth,
            behavior: 'smooth'
        });
    } else {
        // Desktop/Tablet: Scroll by 3 items (one column)
        const containerWidth = wrapper.clientWidth;
        const itemsPerView = 3;
        const maxColumns = Math.ceil(items.length / itemsPerView);
        
        // Calculate current column
        let currentColumn = Math.round(wrapper.scrollLeft / containerWidth);
        currentColumn += direction;
        
        // Wrap around for desktop/tablet
        if (currentColumn < 0) {
            currentColumn = maxColumns - 1;
        } else if (currentColumn >= maxColumns) {
            currentColumn = 0;
        }
        
        wrapper.scrollTo({
            left: currentColumn * containerWidth,
            behavior: 'smooth'
        });
        
        // Update state with current column
        projectCarouselState[wrapperId].currentColumn = currentColumn;
    }

    projectCarouselState[wrapperId].currentIndex = currentIndex;
    
    // Update button visibility
    updateProjectScrollButtons(wrapperId);
}

// Update scroll button visibility for project galleries
function updateProjectScrollButtons(wrapperId) {
    const wrapper = document.getElementById(wrapperId);
    if (!wrapper) return;
    
    const leftBtn = wrapper.parentElement.querySelector('.scroll-btn-left');
    const rightBtn = wrapper.parentElement.querySelector('.scroll-btn-right');
    const items = wrapper.querySelectorAll('.project-collage-item');
    
    if (!leftBtn || !rightBtn) return;
    
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        // Mobile logic
        const currentIndex = projectCarouselState[wrapperId]?.currentIndex || 0;
        const maxIndex = items.length - 1;
        
        // Show/hide left button
        if (currentIndex <= 0) {
            leftBtn.style.opacity = '0.3';
            leftBtn.style.pointerEvents = 'none';
        } else {
            leftBtn.style.opacity = '1';
            leftBtn.style.pointerEvents = 'auto';
        }
        
        // Show/hide right button
        if (currentIndex >= maxIndex) {
            rightBtn.style.opacity = '0.3';
            rightBtn.style.pointerEvents = 'none';
        } else {
            rightBtn.style.opacity = '1';
            rightBtn.style.pointerEvents = 'auto';
        }
    } else {
        // Desktop/Tablet logic
        const containerWidth = wrapper.clientWidth;
        const itemsPerView = 3;
        const maxColumns = Math.ceil(items.length / itemsPerView);
        const currentScroll = wrapper.scrollLeft;
        const maxScroll = wrapper.scrollWidth - containerWidth;
        
        // Show/hide left button
        if (currentScroll <= 10) {
            leftBtn.style.opacity = '0.3';
            leftBtn.style.pointerEvents = 'none';
        } else {
            leftBtn.style.opacity = '1';
            leftBtn.style.pointerEvents = 'auto';
        }
        
        // Show/hide right button
        if (currentScroll >= maxScroll - 10) {
            rightBtn.style.opacity = '0.3';
            rightBtn.style.pointerEvents = 'none';
        } else {
            rightBtn.style.opacity = '1';
            rightBtn.style.pointerEvents = 'auto';
        }
    }
}

// Initialize all project galleries
function initializeProjectGalleries() {
    const galleries = document.querySelectorAll('.project-gallery .photo-collage-wrapper');
    
    galleries.forEach(wrapper => {
        const wrapperId = wrapper.id;
        const items = wrapper.querySelectorAll('.project-collage-item');
        
        // Initialize state for this gallery
        if (!projectCarouselState[wrapperId]) {
            projectCarouselState[wrapperId] = {
                currentIndex: 0,
                currentColumn: 0,
                itemWidth: items[0]?.offsetWidth || 250
            };
        }
        
        // Set initial scroll position
        wrapper.scrollLeft = 0;
        
        // Update button visibility
        updateProjectScrollButtons(wrapperId);
        
        // Add scroll event listener
        wrapper.addEventListener('scroll', () => {
            updateProjectScrollButtons(wrapperId);
        });
    });
}

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // ===================================
    // INITIALIZE PROJECT GALLERIES
    // ===================================
    initializeProjectGalleries();
    
    // Update galleries on window resize
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            initializeProjectGalleries();
        }, 250);
    });

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
        copyToClipboard,
        scrollProjectPhotos,
        updateProjectScrollButtons
    };
}
