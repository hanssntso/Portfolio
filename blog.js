/* ===================================
   BLOG PAGE - JAVASCRIPT
   Alan Timothy Lie Hans Santoso

   Uses Firebase Realtime Database for
   global likes & views tracking.
   =================================== */

// ===================================
// STATE
// ===================================
var currentPage = 1;
var currentBlogId = null;
var searchQuery = '';
var statsCache = {};          // Local cache of Firebase stats
var activeStatsListener = null; // Active Firebase listener reference

// ===================================
// INITIALIZATION
// ===================================
document.addEventListener('DOMContentLoaded', function() {
    // Attach event listeners
    document.getElementById('blog-back-btn').addEventListener('click', closeBlogReader);
    document.getElementById('blog-like-btn').addEventListener('click', toggleLike);

    // Search bar
    var searchInput = document.getElementById('blog-search');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            searchQuery = this.value.trim().toLowerCase();
            currentPage = 1;
            renderBlogListing();
        });
    }

    // Load all stats from Firebase, then render
    loadAllStats(function() {
        // Check URL hash for deep-linking to a specific blog post
        var hash = window.location.hash;
        if (hash && hash.startsWith('#post-')) {
            var slug = hash.substring(6);
            var post = blogPosts.find(function(p) { return p.slug === slug; });
            if (post) {
                openBlog(post.id);
                return;
            }
        }

        renderBlogListing();
    });
});

// ===================================
// FIREBASE STATS FUNCTIONS
// ===================================

/**
 * Check if Firebase is properly configured (not placeholder values).
 */
function isFirebaseConfigured() {
    try {
        return typeof db !== 'undefined' &&
               typeof firebaseConfig !== 'undefined' &&
               firebaseConfig.apiKey &&
               firebaseConfig.apiKey.indexOf('YOUR_') === -1 &&
               firebaseConfig.databaseURL &&
               firebaseConfig.databaseURL.indexOf('YOUR_') === -1;
    } catch (e) {
        return false;
    }
}

/**
 * Load all blog stats from Firebase once, then call callback.
 * Falls back to empty stats if Firebase is unavailable or not configured.
 */
function loadAllStats(callback) {
    // Skip Firebase if not configured (placeholder values)
    if (!isFirebaseConfigured()) {
        console.warn('Firebase not configured yet. Using default stats (0). See firebase-config.js for setup instructions.');
        if (callback) callback();
        return;
    }

    // Safety timeout: if Firebase hasn't responded in 5 seconds, render anyway
    var called = false;
    var timeout = setTimeout(function() {
        if (!called) {
            called = true;
            console.warn('Firebase timed out, using default stats');
            if (callback) callback();
        }
    }, 5000);

    try {
        db.ref('blog-stats').once('value', function(snapshot) {
            if (called) return;
            called = true;
            clearTimeout(timeout);

            var data = snapshot.val();
            if (data) {
                for (var key in data) {
                    if (data.hasOwnProperty(key)) {
                        statsCache[key] = {
                            views: data[key].views || 0,
                            likes: data[key].likes || 0
                        };
                    }
                }
            }
            if (callback) callback();
        }, function(error) {
            if (called) return;
            called = true;
            clearTimeout(timeout);
            console.warn('Firebase read failed, using default stats:', error.message);
            if (callback) callback();
        });
    } catch (e) {
        if (!called) {
            called = true;
            clearTimeout(timeout);
            console.warn('Firebase not available, using default stats');
            if (callback) callback();
        }
    }
}

/**
 * Get stats for a post (from local cache).
 */
function getStats(id) {
    return statsCache[id] || { views: 0, likes: 0 };
}

/**
 * Increment view count in Firebase using a transaction (atomic).
 * Only counts one view per browser session per post.
 */
function incrementView(id) {
    var sessionKey = 'blog-viewed-' + id;

    try {
        if (sessionStorage.getItem(sessionKey)) return;
    } catch (e) {
        // sessionStorage unavailable
    }

    if (isFirebaseConfigured()) {
        try {
            db.ref('blog-stats/' + id + '/views').transaction(function(currentViews) {
                return (currentViews || 0) + 1;
            }, function(error, committed, snapshot) {
                if (!error && committed) {
                    if (!statsCache[id]) statsCache[id] = { views: 0, likes: 0 };
                    statsCache[id].views = snapshot.val();
                    updateBlogStats(id);
                }
            });
        } catch (e) {
            console.warn('Firebase transaction failed for views');
        }
    }

    try {
        sessionStorage.setItem(sessionKey, 'true');
    } catch (e) {
        // Ignore
    }
}

/**
 * Toggle like in Firebase using a transaction (atomic).
 * Uses localStorage to track if this browser has already liked.
 */
function toggleLike() {
    if (!currentBlogId) return;

    var likeKey = 'blog-liked-' + currentBlogId;
    var isLiked = false;

    try {
        isLiked = !!localStorage.getItem(likeKey);
    } catch (e) {
        // Ignore
    }

    var delta = isLiked ? -1 : 1;

    if (isFirebaseConfigured()) {
        try {
            db.ref('blog-stats/' + currentBlogId + '/likes').transaction(function(currentLikes) {
                var newVal = (currentLikes || 0) + delta;
                return newVal < 0 ? 0 : newVal;
            }, function(error, committed, snapshot) {
                if (!error && committed) {
                    if (!statsCache[currentBlogId]) statsCache[currentBlogId] = { views: 0, likes: 0 };
                    statsCache[currentBlogId].likes = snapshot.val();
                    updateBlogStats(currentBlogId);
                }
            });
        } catch (e) {
            console.warn('Firebase transaction failed for likes');
        }
    }

    // Toggle local "has liked" state
    if (isLiked) {
        try { localStorage.removeItem(likeKey); } catch (e) {}
    } else {
        try { localStorage.setItem(likeKey, 'true'); } catch (e) {}
    }

    updateLikeButton(currentBlogId);
}

/**
 * Start real-time listener for a specific post's stats.
 */
function startStatsListener(id) {
    stopStatsListener();

    if (!isFirebaseConfigured()) return;

    try {
        var ref = db.ref('blog-stats/' + id);
        activeStatsListener = ref;

        ref.on('value', function(snapshot) {
            var data = snapshot.val() || { views: 0, likes: 0 };
            statsCache[id] = {
                views: data.views || 0,
                likes: data.likes || 0
            };
            updateBlogStats(id);
        });
    } catch (e) {
        console.warn('Firebase listener failed');
    }
}

/**
 * Stop the active real-time listener.
 */
function stopStatsListener() {
    if (activeStatsListener) {
        try {
            activeStatsListener.off();
        } catch (e) {
            // Ignore
        }
        activeStatsListener = null;
    }
}

// ===================================
// UI UPDATE FUNCTIONS
// ===================================

function updateBlogStats(id) {
    var stats = getStats(id);
    var viewsEl = document.querySelector('#blog-views .stat-count');
    var likesEl = document.querySelector('#blog-likes-count .stat-count');
    if (viewsEl) viewsEl.textContent = stats.views;
    if (likesEl) likesEl.textContent = stats.likes;
}

function updateLikeButton(id) {
    var btn = document.getElementById('blog-like-btn');
    var isLiked = false;

    try {
        isLiked = !!localStorage.getItem('blog-liked-' + id);
    } catch (e) {
        // Ignore
    }

    if (isLiked) {
        btn.classList.add('liked');
        btn.innerHTML = '&#9829; Liked';
    } else {
        btn.classList.remove('liked');
        btn.innerHTML = '&#9825; Like';
    }
}

// ===================================
// FILTERED POSTS
// ===================================
function getFilteredPosts() {
    var filtered = blogPosts.slice();

    if (searchQuery) {
        filtered = filtered.filter(function(post) {
            var title = (post.title || '').toLowerCase();
            var summary = (post.summary || '').toLowerCase();
            var tags = (post.tags || []).join(' ').toLowerCase();
            return title.indexOf(searchQuery) !== -1 ||
                   summary.indexOf(searchQuery) !== -1 ||
                   tags.indexOf(searchQuery) !== -1;
        });
    }

    // Sort by date descending (newest first)
    filtered.sort(function(a, b) {
        return new Date(b.date) - new Date(a.date);
    });

    return filtered;
}

// ===================================
// BLOG LISTING
// ===================================
function renderBlogListing() {
    var grid = document.getElementById('blog-grid');
    var navTop = document.getElementById('blog-nav-top');
    var paginationBottom = document.getElementById('blog-pagination-bottom');

    var filtered = getFilteredPosts();

    // Empty state when no blog posts match
    if (filtered.length === 0) {
        grid.innerHTML =
            '<div class="blog-empty">' +
                '<div class="blog-empty-icon">&#128221;</div>' +
                '<h3>No Blog Posts Found</h3>' +
                '<p>' + (searchQuery ? 'No posts match your search. Try a different keyword.' : 'Blog posts will appear here once published. Stay tuned!') + '</p>' +
            '</div>';
        navTop.innerHTML = '';
        paginationBottom.innerHTML = '';
        return;
    }

    // Pagination calculations
    var totalPages = Math.ceil(filtered.length / BLOGS_PER_PAGE);
    if (currentPage > totalPages) currentPage = totalPages;
    var startIndex = (currentPage - 1) * BLOGS_PER_PAGE;
    var endIndex = startIndex + BLOGS_PER_PAGE;
    var pageBlogs = filtered.slice(startIndex, endIndex);

    // Render blog cards
    var cardsHtml = '';
    for (var i = 0; i < pageBlogs.length; i++) {
        cardsHtml += renderBlogCard(pageBlogs[i]);
    }
    grid.innerHTML = cardsHtml;

    // Render top nav (Prev/Next only)
    navTop.innerHTML = renderTopNav(totalPages);

    // Render bottom pagination (full, centered)
    paginationBottom.innerHTML = renderPagination(totalPages);

    // Reset scroll area to top
    var scrollArea = document.getElementById('blog-scroll-area');
    if (scrollArea) scrollArea.scrollTop = 0;

    // Animate cards on appear
    animateBlogCards();
}

/**
 * Top navigation: same format as bottom (Prev / 1 / 2 / Next), left-aligned.
 */
function renderTopNav(totalPages) {
    if (totalPages <= 1) return '';

    var html = '';

    html += '<button class="page-btn' + (currentPage === 1 ? ' disabled' : '') + '" onclick="goToPage(' + (currentPage - 1) + ')">&larr; Prev</button>';

    for (var p = 1; p <= totalPages; p++) {
        html += '<button class="page-btn' + (p === currentPage ? ' active' : '') + '" onclick="goToPage(' + p + ')">' + p + '</button>';
    }

    html += '<button class="page-btn' + (currentPage === totalPages ? ' disabled' : '') + '" onclick="goToPage(' + (currentPage + 1) + ')">Next &rarr;</button>';

    return html;
}

/**
 * Bottom pagination: full page numbers (centered).
 */
function renderPagination(totalPages) {
    if (totalPages <= 1) return '';

    var html = '';

    // Previous button
    html += '<button class="page-btn' + (currentPage === 1 ? ' disabled' : '') + '" onclick="goToPage(' + (currentPage - 1) + ')">&larr; Prev</button>';

    // Page number buttons
    for (var p = 1; p <= totalPages; p++) {
        html += '<button class="page-btn' + (p === currentPage ? ' active' : '') + '" onclick="goToPage(' + p + ')">' + p + '</button>';
    }

    // Next button
    html += '<button class="page-btn' + (currentPage === totalPages ? ' disabled' : '') + '" onclick="goToPage(' + (currentPage + 1) + ')">Next &rarr;</button>';

    return html;
}

function renderBlogCard(post) {
    var stats = getStats(post.id);
    var dateFormatted = formatDate(post.date);

    // Thumbnail: use specified thumbnail, or show placeholder
    var thumbnailHtml;
    if (post.thumbnail) {
        thumbnailHtml = '<img src="' + post.thumbnail + '" alt="' + escapeHtml(post.title || 'Blog post') + '">';
    } else {
        thumbnailHtml = '<div class="blog-card-placeholder">&#128196;</div>';
    }

    // Tags
    var tagsHtml = '';
    if (post.tags && post.tags.length > 0) {
        for (var t = 0; t < post.tags.length; t++) {
            tagsHtml += '<span class="blog-tag">' + escapeHtml(post.tags[t]) + '</span>';
        }
    }

    return (
        '<div class="blog-card" onclick="openBlog(' + post.id + ')">' +
            '<div class="blog-card-thumbnail">' + thumbnailHtml + '</div>' +
            '<div class="blog-card-body">' +
                '<div class="blog-card-date">' + dateFormatted + '</div>' +
                '<h3 class="blog-card-title">' + escapeHtml(post.title || 'Untitled') + '</h3>' +
                '<p class="blog-card-summary">' + escapeHtml(post.summary || '') + '</p>' +
                '<div class="blog-card-footer">' +
                    '<div class="blog-card-tags">' + tagsHtml + '</div>' +
                    '<div class="blog-card-stats">' +
                        '<span>&#128065; ' + stats.views + '</span>' +
                        '<span>&#9829; ' + stats.likes + '</span>' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</div>'
    );
}

function animateBlogCards() {
    var cards = document.querySelectorAll('.blog-card');
    for (var i = 0; i < cards.length; i++) {
        (function(card, index) {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            card.style.transitionDelay = (index * 0.08) + 's';

            requestAnimationFrame(function() {
                requestAnimationFrame(function() {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                });
            });
        })(cards[i], i);
    }
}

// ===================================
// PAGINATION
// ===================================
function goToPage(page) {
    var filtered = getFilteredPosts();
    var totalPages = Math.ceil(filtered.length / BLOGS_PER_PAGE);
    if (page < 1 || page > totalPages) return;

    currentPage = page;
    renderBlogListing();

    // Scroll the page to top of blog area
    var scrollArea = document.getElementById('blog-scroll-area');
    if (scrollArea) scrollArea.scrollTop = 0;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===================================
// BLOG READER
// ===================================
function openBlog(id) {
    var post = blogPosts.find(function(p) { return p.id === id; });
    if (!post) return;

    currentBlogId = id;

    // Increment view count (once per session per post)
    incrementView(id);

    // Start real-time stats listener for this post
    startStatsListener(id);

    // Update URL hash for deep-linking
    window.location.hash = 'post-' + post.slug;

    // Toggle views
    document.getElementById('blog-listing').style.display = 'none';
    document.getElementById('blog-reader').style.display = 'block';

    // Load blog content
    var article = document.getElementById('blog-content');
    var dateFormatted = formatDate(post.date);

    // Build tags HTML
    var tagsHtml = '';
    if (post.tags && post.tags.length > 0) {
        tagsHtml = '<div class="blog-article-tags">';
        for (var t = 0; t < post.tags.length; t++) {
            tagsHtml += '<span class="blog-tag">' + escapeHtml(post.tags[t]) + '</span>';
        }
        tagsHtml += '</div>';
    }

    // Build header HTML
    var headerHtml =
        '<div class="blog-article-header">' +
            '<h1>' + escapeHtml(post.title || 'Untitled') + '</h1>' +
            '<p class="blog-article-date">' + dateFormatted + '</p>' +
            tagsHtml +
        '</div>';

    // Try to fetch blog content file
    if (post.contentFile) {
        fetchBlogContent(post, article, headerHtml);
    } else {
        article.innerHTML = headerHtml +
            '<div class="blog-article-body">' +
                '<p>This blog post is being prepared. Please check back later.</p>' +
            '</div>';
    }

    // Update engagement display
    updateBlogStats(id);
    updateLikeButton(id);

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function fetchBlogContent(post, article, headerHtml) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', post.contentFile, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                article.innerHTML = headerHtml +
                    '<div class="blog-article-body">' + xhr.responseText + '</div>';
            } else {
                article.innerHTML = headerHtml +
                    '<div class="blog-article-body">' +
                        '<p>Content is being prepared. Please check back later.</p>' +
                    '</div>';
            }
        }
    };
    xhr.send();
}

function closeBlogReader() {
    // Stop real-time listener
    stopStatsListener();

    document.getElementById('blog-listing').style.display = 'block';
    document.getElementById('blog-reader').style.display = 'none';
    window.location.hash = '';
    currentBlogId = null;
    renderBlogListing();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===================================
// UTILITY FUNCTIONS
// ===================================
function formatDate(dateStr) {
    var months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    var date = new Date(dateStr);
    return months[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
}

function escapeHtml(text) {
    if (!text) return '';
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(text));
    return div.innerHTML;
}
