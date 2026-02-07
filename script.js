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
// PROJECT PHOTO GALLERY (1x3 Horizontal Grid)
// ===================================
const projectGalleryState = {};

function scrollProjectPhotos(wrapperId, direction) {
    const wrapper = document.getElementById(wrapperId);
    if (!wrapper) return;

    const isMobile = window.innerWidth <= 768;
    const containerWidth = wrapper.clientWidth;
    
    if (isMobile) {
        // Mobile: Scroll by 1 item (100% width)
        const itemWidth = wrapper.querySelector('.project-collage-item')?.offsetWidth || containerWidth;
        const scrollAmount = itemWidth + 20; // Add gap/margin
        wrapper.scrollLeft += direction * scrollAmount;
    } else {
        // Desktop/Tablet: Scroll by 3 items (100% width of visible area)
        wrapper.scrollLeft += direction * containerWidth;
    }
    
    // Update button visibility after scroll
    setTimeout(() => updateProjectScrollButtons(wrapperId), 300);
}

// Update scroll button visibility for project galleries
function updateProjectScrollButtons(wrapperId) {
    const wrapper = document.getElementById(wrapperId);
    if (!wrapper) return;
    
    const leftBtn = wrapper.parentElement.querySelector('.scroll-btn-left');
    const rightBtn = wrapper.parentElement.querySelector('.scroll-btn-right');
    
    if (!leftBtn || !rightBtn) return;
    
    const currentScroll = wrapper.scrollLeft;
    const maxScroll = wrapper.scrollWidth - wrapper.clientWidth;
    
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

// Initialize all project galleries
function initializeProjectGalleries() {
    const galleries = document.querySelectorAll('.project-gallery .photo-collage-wrapper');
    
    galleries.forEach(wrapper => {
        const wrapperId = wrapper.id;
        
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
