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

    // Detect saved language or use default
    try {
        var saved = localStorage.getItem('portfolio-lang');
        if (saved) currentLang = saved;
    } catch (e) {}

    /**
     * Load a language JSON file. Returns cached data if available.
     */
    function loadLang(lang, callback) {
        if (langCache[lang]) {
            callback(langCache[lang]);
            return;
        }

        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'lang/' + lang + '.json', true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    try {
                        langCache[lang] = JSON.parse(xhr.responseText);
                    } catch (e) {
                        console.warn('i18n: Failed to parse ' + lang + '.json');
                        langCache[lang] = {};
                    }
                } else {
                    console.warn('i18n: Could not load ' + lang + '.json');
                    langCache[lang] = {};
                }
                callback(langCache[lang]);
            }
        };
        xhr.send();
    }

    /**
     * Apply translations to all elements with data-i18n attribute.
     */
    function applyTranslations(data) {
        var elements = document.querySelectorAll('[data-i18n]');
        for (var i = 0; i < elements.length; i++) {
            var el = elements[i];
            var key = el.getAttribute('data-i18n');
            if (data[key] !== undefined) {
                // Check if element is an input with placeholder
                if (el.tagName === 'INPUT' && el.hasAttribute('placeholder')) {
                    el.setAttribute('placeholder', data[key]);
                } else {
                    el.textContent = data[key];
                }
            }
        }

        // Update html lang attribute
        document.documentElement.lang = currentLang;
    }

    /**
     * Switch to a new language.
     */
    function switchLanguage(lang) {
        currentLang = lang;

        try {
            localStorage.setItem('portfolio-lang', lang);
        } catch (e) {}

        loadLang(lang, function(data) {
            applyTranslations(data);
            updateActiveFlagDisplay(lang);
            closeLangDropdown();
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

        if (currentLang !== defaultLang) {
            loadLang(currentLang, applyTranslations);
        }
    });

    // Expose globally
    window.switchLanguage = switchLanguage;
    window.toggleLangDropdown = toggleLangDropdown;
})();
