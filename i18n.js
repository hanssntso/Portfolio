/* ===================================
   i18n - INTERNATIONALIZATION ENGINE
   Alan Timothy Lie Hans Santoso

   JSON-based language switcher.
   Add data-i18n="key" to any element
   to make it translatable.
   =================================== */

(function() {
    'use strict';

    var langCache = {};
    var currentLang = 'en';
    var defaultLang = 'en';
    var langChangeCallbacks = [];

    // Detect saved language or use default
    try {
        var saved = localStorage.getItem('portfolio-lang');
        if (saved) currentLang = saved;
    } catch (e) {}

    /**
     * Load a language JSON file. Returns cached data if available.
     * Uses fetch() for reliability, with XHR fallback.
     */
    function loadLang(lang, callback) {
        if (langCache[lang]) {
            callback(langCache[lang]);
            return;
        }

        // Append timestamp to bypass CDN cache (GitHub Pages / Fastly)
        var url = 'lang/' + lang + '.json?_=' + Date.now();

        if (typeof fetch === 'function') {
            fetch(url)
                .then(function(response) {
                    if (!response.ok) throw new Error('HTTP ' + response.status);
                    return response.json();
                })
                .then(function(data) {
                    langCache[lang] = data;
                    callback(data);
                })
                .catch(function(error) {
                    console.warn('i18n: fetch failed for ' + lang + '.json:', error.message);
                    // Fallback to XHR
                    loadLangXHR(lang, callback);
                });
        } else {
            loadLangXHR(lang, callback);
        }
    }

    /**
     * XHR fallback for loading language files.
     */
    function loadLangXHR(lang, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'lang/' + lang + '.json?_=' + Date.now(), true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200 || xhr.status === 0) {
                    try {
                        langCache[lang] = JSON.parse(xhr.responseText);
                    } catch (e) {
                        console.warn('i18n: Failed to parse ' + lang + '.json');
                        langCache[lang] = {};
                    }
                } else {
                    console.warn('i18n: Could not load ' + lang + '.json (HTTP ' + xhr.status + ')');
                    langCache[lang] = {};
                }
                callback(langCache[lang]);
            }
        };
        xhr.send();
    }

    /**
     * Apply translations to all elements with data-i18n attribute.
     * Each element is wrapped in try-catch to prevent one failure
     * from stopping the entire translation process.
     */
    function applyTranslations(data) {
        if (!data || typeof data !== 'object') return;

        var elements = document.querySelectorAll('[data-i18n]');
        for (var i = 0; i < elements.length; i++) {
            try {
                var el = elements[i];
                var key = el.getAttribute('data-i18n');
                if (data[key] !== undefined) {
                    if (el.tagName === 'INPUT' && el.hasAttribute('placeholder')) {
                        el.setAttribute('placeholder', data[key]);
                    } else {
                        el.textContent = data[key];
                    }
                }
            } catch (e) {
                // Continue with next element even if one fails
            }
        }

        // Update html lang attribute
        document.documentElement.lang = currentLang;
    }

    /**
     * Notify all registered language change callbacks.
     */
    function notifyLangChange(lang, data) {
        for (var i = 0; i < langChangeCallbacks.length; i++) {
            try {
                langChangeCallbacks[i](lang, data);
            } catch (e) {
                console.warn('i18n: Language change callback error:', e.message);
            }
        }
    }

    /**
     * Switch to a new language.
     */
    function switchLanguage(lang) {
        currentLang = lang;

        try {
            localStorage.setItem('portfolio-lang', lang);
        } catch (e) {}

        // Clear cache for this language to force fresh load
        delete langCache[lang];

        loadLang(lang, function(data) {
            applyTranslations(data);
            updateActiveFlagDisplay(lang);
            closeLangDropdown();
            notifyLangChange(lang, data);

            // Re-apply after callbacks to ensure nothing overwrote translations
            setTimeout(function() {
                applyTranslations(data);
            }, 100);
        });
    }

    /**
     * Update the flag circle to show the active language flag.
     */
    function updateActiveFlagDisplay(lang) {
        var flagEl = document.getElementById('active-flag');
        if (!flagEl) return;

        var flags = { en: '🇺🇸', id: '🇮🇩', th: '🇹🇭' };
        flagEl.textContent = flags[lang] || flags[defaultLang];
    }

    /**
     * Toggle the language dropdown open/closed.
     */
    function toggleLangDropdown(e) {
        if (e) e.stopPropagation();
        var dropdown = document.getElementById('lang-dropdown');
        if (!dropdown) return;
        dropdown.classList.toggle('open');
    }

    function closeLangDropdown() {
        var dropdown = document.getElementById('lang-dropdown');
        if (dropdown) dropdown.classList.remove('open');
    }

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        var wrapper = document.querySelector('.lang-switcher-wrapper');
        if (wrapper && !wrapper.contains(e.target)) {
            closeLangDropdown();
        }
    });

    // Apply saved language on page load
    document.addEventListener('DOMContentLoaded', function() {
        updateActiveFlagDisplay(currentLang);

        // Always load translation data (even for English)
        // so getLangData() returns data for all languages
        loadLang(currentLang, function(data) {
            if (currentLang !== defaultLang) {
                applyTranslations(data);

                // Re-apply after other scripts finish to ensure
                // all elements (including those at page bottom) are translated
                setTimeout(function() {
                    applyTranslations(data);
                }, 200);
            }
            notifyLangChange(currentLang, data);
        });
    });

    // Expose globally
    window.switchLanguage = switchLanguage;
    window.toggleLangDropdown = toggleLangDropdown;
    window.getCurrentLang = function() { return currentLang; };
    window.getLangData = function() { return langCache[currentLang] || {}; };
    window.onLanguageChange = function(callback) { langChangeCallbacks.push(callback); };
})();
