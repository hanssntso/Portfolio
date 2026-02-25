/* ===================================
   BLOG PAGE - JAVASCRIPT
   Alan Timothy Lie Hans Santoso

   Uses Firebase Realtime Database for
   global likes & views tracking.
   Falls back to localStorage when
   Firebase is unavailable.

   Supports multilingual blog content
   via i18n integration.
   =================================== */

// ===================================
// STATE
// ===================================
var currentPage = 1;
var currentBlogId = null;
var searchQuery = '';
var statsCache = {};
var activeStatsListener = null;
var firebaseConnected = false;

// ===================================
// i18n HELPER
// ===================================

/**
 * Get translated text for a given i18n key.
 * Falls back to the provided default (English) text.
 */
function getI18nText(key, fallback) {
    var lang = (typeof getCurrentLang === 'function') ? getCurrentLang() : 'en';
    if (lang === 'en') return fallback;
    if (typeof getLangData === 'function') {
        var data = getLangData();
        if (data[key] !== undefined) return data[key];
    }
    return fallback;
}

/**
 * Get translated blog post metadata (title or summary).
 * Checks for optional titleI18n/summaryI18n objects in blog data,
 * then falls back to the English default.
 *
 * To add translations, add to blog-data.js entries:
 *   titleI18n: { id: "Indonesian title", th: "Thai title" },
 *   summaryI18n: { id: "Indonesian summary", th: "Thai summary" }
 */
function getBlogText(post, field) {
    var lang = (typeof getCurrentLang === 'function') ? getCurrentLang() : 'en';
    if (lang === 'en') return post[field];
    var i18nField = field + 'I18n';
    if (post[i18nField] && post[i18nField][lang]) {
        return post[i18nField][lang];
    }
    return post[field];
}

// ===================================
// LOCAL STATS (FALLBACK)
// ===================================

/**
 * Get stats from localStorage (fallback when Firebase is unavailable).
 */
function getLocalStats(id) {
    try {
        var stored = localStorage.getItem('blog-local-stats-' + id);
        if (stored) return JSON.parse(stored);
    } catch (e) {}
    return { views: 0, likes: 0 };
}

/**
 * Save stats to localStorage.
 */
function saveLocalStats(id, stats) {
    try {
        localStorage.setItem('blog-local-stats-' + id, JSON.stringify(stats));
    } catch (e) {}
}

/**
 * Get the best available stats for a post.
 * Uses Firebase stats when available, merges with local fallback.
 */
function getStats(id) {
    var fb = statsCache[id] || { views: 0, likes: 0 };
    var local = getLocalStats(id);
    return {
        views: Math.max(fb.views, local.views),
        likes: Math.max(fb.likes, local.likes)
    };
}

// ===================================
// INITIALIZATION
// ===================================
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('blog-back-btn').addEventListener('click', closeBlogReader);
    document.getElementById('blog-like-btn').addEventListener('click', toggleLike);

    var searchInput = document.getElementById('blog-search');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            searchQuery = this.value.trim().toLowerCase();
            currentPage = 1;
            renderBlogListing();
        });
    }

    // Register language change callback to re-render blog content
    if (typeof onLanguageChange === 'function') {
        onLanguageChange(function(lang, data) {
            if (currentBlogId) {
                // Re-open the current blog post with the new language
                openBlog(currentBlogId);
            } else {
                renderBlogListing();
            }
        });
    }

    // Check URL hash for deep-linking
    var hash = window.location.hash;
    if (hash && hash.startsWith('#post-')) {
        var slug = hash.substring(6);
        var post = blogPosts.find(function(p) { return p.slug === slug; });
        if (post) {
            openBlog(post.id);
        } else {
            renderBlogListing();
        }
    } else {
        // Render immediately with local stats (no waiting for Firebase)
        renderBlogListing();
    }

    // Then load Firebase stats in background and refresh numbers
    loadAllStatsInBackground();
});

// ===================================
// FIREBASE HELPER
// ===================================

function isFirebaseReady() {
    return typeof db !== 'undefined' && db !== null;
}

// ===================================
// FIREBASE STATS - BACKGROUND LOAD
// ===================================

/**
 * Load stats from Firebase in the background.
 * Page is already rendered — this just updates the numbers.
 */
function loadAllStatsInBackground() {
    if (!isFirebaseReady()) {
        console.warn('[Blog] Firebase not initialized — using local stats only');
        return;
    }

    // Safety timeout: give up after 8 seconds
    var done = false;
    var timeout = setTimeout(function() {
        if (!done) {
            done = true;
            console.warn('[Blog] Firebase timed out after 8s');
            console.warn('[Blog] Possible causes:');
            console.warn('  1. Firebase Realtime Database rules deny read access');
            console.warn('  2. Test mode rules have expired (they expire after 30 days)');
            console.warn('  3. Network/CORS issue');
            console.warn('[Blog] Using local stats as fallback');
        }
    }, 8000);

    try {
        db.ref('blog-stats').once('value', function(snapshot) {
            if (done) return;
            done = true;
            clearTimeout(timeout);
            firebaseConnected = true;

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
            // Refresh the card stats numbers on the page
            refreshCardStats();

            // If reading a blog post, update its stats too
            if (currentBlogId) {
                updateBlogStats(currentBlogId);
            }
        }, function(error) {
            if (done) return;
            done = true;
            clearTimeout(timeout);
            console.warn('[Blog] Firebase read failed:', error.message);
            console.warn('[Blog] Go to Firebase Console > Realtime Database > Rules');
            console.warn('[Blog] Set rules to allow read/write for blog-stats path');
            console.warn('[Blog] Using local stats as fallback');
        });
    } catch (e) {
        if (!done) {
            done = true;
            clearTimeout(timeout);
        }
        console.warn('[Blog] Firebase error:', e.message);
    }
}

/**
 * Refresh the stats numbers shown on all visible blog cards
 * without re-rendering the entire listing.
 */
function refreshCardStats() {
    var cards = document.querySelectorAll('.blog-card');
    for (var i = 0; i < cards.length; i++) {
        var card = cards[i];
        var onclickAttr = card.getAttribute('onclick');
        if (!onclickAttr) continue;

        // Extract post ID from onclick="openBlog(5)"
        var match = onclickAttr.match(/openBlog\((\d+)\)/);
        if (!match) continue;

        var postId = match[1];
        var stats = getStats(postId);
        var statsEl = card.querySelector('.blog-card-stats');
        if (statsEl) {
            statsEl.innerHTML =
                '<span>&#128065; ' + stats.views + '</span>' +
                '<span>&#9829; ' + stats.likes + '</span>';
        }
    }
}

// ===================================
// VIEW COUNT
// ===================================

function incrementView(id) {
    var sessionKey = 'blog-viewed-' + id;

    try {
        if (sessionStorage.getItem(sessionKey)) return;
    } catch (e) {
        // sessionStorage unavailable
    }

    // Always update local stats (works without Firebase)
    var local = getLocalStats(id);
    local.views = local.views + 1;
    saveLocalStats(id, local);

    // Also try Firebase for global tracking
    if (isFirebaseReady()) {
        try {
            db.ref('blog-stats/' + id + '/views').transaction(function(currentViews) {
                return (currentViews || 0) + 1;
            }, function(error, committed, snapshot) {
                if (error) {
                    console.warn('[Blog] Firebase views write failed:', error.message);
                    // Local stats already updated above, so UI still works
                    updateBlogStats(id);
                    refreshCardStats();
                    return;
                }
                if (committed) {
                    firebaseConnected = true;
                    if (!statsCache[id]) statsCache[id] = { views: 0, likes: 0 };
                    statsCache[id].views = snapshot.val();
                    updateBlogStats(id);
                    refreshCardStats();
                }
            });
        } catch (e) {
            console.warn('[Blog] Firebase views transaction failed:', e.message);
        }
    } else {
        // No Firebase — just update UI with local stats
        updateBlogStats(id);
        refreshCardStats();
    }

    try {
        sessionStorage.setItem(sessionKey, 'true');
    } catch (e) {
        // Ignore
    }
}

// ===================================
// LIKE TOGGLE
// ===================================

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

    // Always update local stats
    var local = getLocalStats(currentBlogId);
    local.likes = Math.max(0, local.likes + delta);
    saveLocalStats(currentBlogId, local);

    // Also try Firebase for global tracking
    if (isFirebaseReady()) {
        try {
            db.ref('blog-stats/' + currentBlogId + '/likes').transaction(function(currentLikes) {
                var newVal = (currentLikes || 0) + delta;
                return newVal < 0 ? 0 : newVal;
            }, function(error, committed, snapshot) {
                if (error) {
                    console.warn('[Blog] Firebase likes write failed:', error.message);
                    updateBlogStats(currentBlogId);
                    refreshCardStats();
                    return;
                }
                if (committed) {
                    firebaseConnected = true;
                    if (!statsCache[currentBlogId]) statsCache[currentBlogId] = { views: 0, likes: 0 };
                    statsCache[currentBlogId].likes = snapshot.val();
                    updateBlogStats(currentBlogId);
                    refreshCardStats();
                }
            });
        } catch (e) {
            console.warn('[Blog] Firebase likes transaction failed:', e.message);
        }
    } else {
        // No Firebase — update UI with local stats
        updateBlogStats(currentBlogId);
        refreshCardStats();
    }

    // Toggle local "has liked" state
    if (isLiked) {
        try { localStorage.removeItem(likeKey); } catch (e) {}
    } else {
        try { localStorage.setItem(likeKey, 'true'); } catch (e) {}
    }

    updateLikeButton(currentBlogId);
}

// ===================================
// REAL-TIME LISTENER (READER VIEW)
// ===================================

function startStatsListener(id) {
    stopStatsListener();

    if (!isFirebaseReady()) return;

    try {
        var ref = db.ref('blog-stats/' + id);
        activeStatsListener = ref;

        ref.on('value', function(snapshot) {
            var data = snapshot.val() || { views: 0, likes: 0 };
            firebaseConnected = true;
            statsCache[id] = {
                views: data.views || 0,
                likes: data.likes || 0
            };
            updateBlogStats(id);
        }, function(error) {
            console.warn('[Blog] Firebase listener error for post ' + id + ':', error.message);
        });
    } catch (e) {
        console.warn('[Blog] Firebase listener failed:', e.message);
    }
}

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
        btn.innerHTML = '&#9829; ' + getI18nText('blog.liked', 'Liked');
    } else {
        btn.classList.remove('liked');
        btn.innerHTML = '&#9825; ' + getI18nText('blog.like', 'Like');
    }
}

// ===================================
// FILTERED POSTS
// ===================================
function getFilteredPosts() {
    var filtered = blogPosts.slice();

    if (searchQuery) {
        filtered = filtered.filter(function(post) {
            var title = (getBlogText(post, 'title') || '').toLowerCase();
            var summary = (getBlogText(post, 'summary') || '').toLowerCase();
            var tags = (post.tags || []).join(' ').toLowerCase();
            return title.indexOf(searchQuery) !== -1 ||
                   summary.indexOf(searchQuery) !== -1 ||
                   tags.indexOf(searchQuery) !== -1;
        });
    }

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

    if (filtered.length === 0) {
        var noPostsTitle = getI18nText('blog.noPostsTitle', 'No Blog Posts Found');
        var noPostsMsg = searchQuery
            ? getI18nText('blog.noPostsSearch', 'No posts match your search. Try a different keyword.')
            : getI18nText('blog.noPostsDefault', 'Blog posts will appear here once published. Stay tuned!');

        grid.innerHTML =
            '<div class="blog-empty">' +
                '<div class="blog-empty-icon">&#128221;</div>' +
                '<h3>' + noPostsTitle + '</h3>' +
                '<p>' + noPostsMsg + '</p>' +
            '</div>';
        navTop.innerHTML = '';
        paginationBottom.innerHTML = '';
        return;
    }

    var totalPages = Math.ceil(filtered.length / BLOGS_PER_PAGE);
    if (currentPage > totalPages) currentPage = totalPages;
    var startIndex = (currentPage - 1) * BLOGS_PER_PAGE;
    var endIndex = startIndex + BLOGS_PER_PAGE;
    var pageBlogs = filtered.slice(startIndex, endIndex);

    var cardsHtml = '';
    for (var i = 0; i < pageBlogs.length; i++) {
        cardsHtml += renderBlogCard(pageBlogs[i]);
    }
    grid.innerHTML = cardsHtml;

    // Top: full pagination, left-aligned
    navTop.innerHTML = renderPaginationButtons(totalPages);

    // Bottom: full pagination, centered
    paginationBottom.innerHTML = renderPaginationButtons(totalPages);

    var scrollArea = document.getElementById('blog-scroll-area');
    if (scrollArea) scrollArea.scrollTop = 0;

    animateBlogCards();
}

/**
 * Pagination buttons: Prev / 1 / 2 / ... / Next
 * Uses i18n translations for Prev/Next text.
 */
function renderPaginationButtons(totalPages) {
    if (totalPages <= 1) return '';

    var prevText = getI18nText('blog.prevBtn', '\u2190 Prev');
    var nextText = getI18nText('blog.nextBtn', 'Next \u2192');

    var html = '';

    html += '<button class="page-btn' + (currentPage === 1 ? ' disabled' : '') + '" onclick="goToPage(' + (currentPage - 1) + ')">' + escapeHtml(prevText) + '</button>';

    for (var p = 1; p <= totalPages; p++) {
        html += '<button class="page-btn' + (p === currentPage ? ' active' : '') + '" onclick="goToPage(' + p + ')">' + p + '</button>';
    }

    html += '<button class="page-btn' + (currentPage === totalPages ? ' disabled' : '') + '" onclick="goToPage(' + (currentPage + 1) + ')">' + escapeHtml(nextText) + '</button>';

    return html;
}

function renderBlogCard(post) {
    var stats = getStats(post.id);
    var dateFormatted = formatDate(post.date);
    var title = getBlogText(post, 'title');
    var summary = getBlogText(post, 'summary');

    var thumbnailHtml;
    if (post.thumbnail) {
        thumbnailHtml = '<img src="' + post.thumbnail + '" alt="' + escapeHtml(title || 'Blog post') + '">';
    } else {
        thumbnailHtml = '<div class="blog-card-placeholder">&#128196;</div>';
    }

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
                '<h3 class="blog-card-title">' + escapeHtml(title || 'Untitled') + '</h3>' +
                '<p class="blog-card-summary">' + escapeHtml(summary || '') + '</p>' +
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

    incrementView(id);
    startStatsListener(id);

    window.location.hash = 'post-' + post.slug;

    document.getElementById('blog-listing').style.display = 'none';
    document.getElementById('blog-reader').style.display = 'block';

    var article = document.getElementById('blog-content');
    var title = getBlogText(post, 'title');
    var dateFormatted = formatDate(post.date);

    var tagsHtml = '';
    if (post.tags && post.tags.length > 0) {
        tagsHtml = '<div class="blog-article-tags">';
        for (var t = 0; t < post.tags.length; t++) {
            tagsHtml += '<span class="blog-tag">' + escapeHtml(post.tags[t]) + '</span>';
        }
        tagsHtml += '</div>';
    }

    var headerHtml =
        '<div class="blog-article-header">' +
            '<h1>' + escapeHtml(title || 'Untitled') + '</h1>' +
            '<p class="blog-article-date">' + dateFormatted + '</p>' +
            tagsHtml +
        '</div>';

    if (post.contentFile) {
        fetchBlogContent(post, article, headerHtml);
    } else {
        article.innerHTML = headerHtml +
            '<div class="blog-article-body">' +
                '<p>' + getI18nText('blog.contentPreparing', 'This blog post is being prepared. Please check back later.') + '</p>' +
            '</div>';
    }

    updateBlogStats(id);
    updateLikeButton(id);

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===================================
// MULTILINGUAL CONTENT LOADING
// ===================================

/**
 * Fetch blog content with multilingual support.
 *
 * For a post with contentFile "blogs/content-1.html":
 *   - English: loads "blogs/content-1.html"
 *   - Indonesian: tries "blogs/content-1-id.html", falls back to English
 *   - Thai: tries "blogs/content-1-th.html", falls back to English
 *
 * To add a translation, simply create the file:
 *   blogs/content-1-id.html   (Indonesian version)
 *   blogs/content-1-th.html   (Thai version)
 */
function fetchBlogContent(post, article, headerHtml) {
    var lang = (typeof getCurrentLang === 'function') ? getCurrentLang() : 'en';
    var basePath = post.contentFile;

    if (lang !== 'en') {
        // Try language-specific file: blogs/content-1.html -> blogs/content-1-id.html
        var langPath = basePath.replace('.html', '-' + lang + '.html');
        fetchContentFile(langPath, function(success, content) {
            if (success) {
                article.innerHTML = headerHtml +
                    '<div class="blog-article-body">' + content + '</div>';
            } else {
                // Fallback to English
                loadDefaultContent(post, article, headerHtml);
            }
        });
    } else {
        loadDefaultContent(post, article, headerHtml);
    }
}

/**
 * Load the default (English) content file.
 */
function loadDefaultContent(post, article, headerHtml) {
    fetchContentFile(post.contentFile, function(success, content) {
        if (success) {
            article.innerHTML = headerHtml +
                '<div class="blog-article-body">' + content + '</div>';
        } else {
            article.innerHTML = headerHtml +
                '<div class="blog-article-body">' +
                    '<p>' + getI18nText('blog.contentPreparing', 'This blog post is being prepared. Please check back later.') + '</p>' +
                '</div>';
        }
    });
}

/**
 * Fetch an HTML content file via XHR.
 * Calls callback(success, responseText).
 */
function fetchContentFile(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if ((xhr.status === 200 || xhr.status === 0) && xhr.responseText.trim()) {
                callback(true, xhr.responseText);
            } else {
                callback(false, '');
            }
        }
    };
    xhr.send();
}

function closeBlogReader() {
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
