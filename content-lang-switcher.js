/* ===================================
   CONTENT LANGUAGE SWITCHER
   Alan Timothy Lie Hans Santoso

   Adds a separate, self-contained
   language switcher at the top of the
   blog reader (content) view.

   Does NOT modify any existing code.
   All class names use "content-lang-"
   prefix to avoid conflicts.
   =================================== */

(function() {
    'use strict';

    // Supported languages (same as navbar)
    var LANGS = [
        { code: 'en', flag: '\uD83C\uDDFA\uD83C\uDDF8', label: 'English' },
        { code: 'id', flag: '\uD83C\uDDEE\uD83C\uDDE9', label: 'Bahasa Indonesia' },
        { code: 'th', flag: '\uD83C\uDDF9\uD83C\uDDED', label: '\u0E20\u0E32\u0E29\u0E32\u0E44\u0E17\u0E22' }
    ];

    /**
     * Get the current active language code.
     */
    function getActiveLang() {
        return (typeof getCurrentLang === 'function') ? getCurrentLang() : 'en';
    }

    /**
     * Get the flag emoji for a language code.
     */
    function getFlagForLang(langCode) {
        for (var i = 0; i < LANGS.length; i++) {
            if (LANGS[i].code === langCode) return LANGS[i].flag;
        }
        return LANGS[0].flag;
    }

    /**
     * Build the complete HTML for the content language switcher.
     */
    function buildSwitcherHTML() {
        var currentLang = getActiveLang();
        var currentFlag = getFlagForLang(currentLang);

        var optionsHtml = '';
        for (var i = 0; i < LANGS.length; i++) {
            var lang = LANGS[i];
            var activeClass = (lang.code === currentLang) ? ' content-lang-option-active' : '';
            optionsHtml +=
                '<button class="content-lang-option' + activeClass + '" data-lang="' + lang.code + '">' +
                    '<span class="content-lang-flag-small">' + lang.flag + '</span> ' + lang.label +
                '</button>';
        }

        return (
            '<div class="content-lang-switcher-wrapper">' +
                '<span class="content-lang-label">Language</span>' +
                '<button class="content-lang-switcher-btn" aria-label="Change content language">' +
                    '<span class="content-active-flag">' + currentFlag + '</span>' +
                '</button>' +
                '<div class="content-lang-dropdown">' +
                    optionsHtml +
                '</div>' +
            '</div>'
        );
    }

    /**
     * Inject the language switcher into the blog reader view.
     * Placed between the back button and the article content.
     */
    function injectSwitcher() {
        var reader = document.getElementById('blog-reader');
        if (!reader) return;

        // Prevent duplicate injection
        if (reader.querySelector('.content-lang-switcher-container')) return;

        var container = reader.querySelector('.container');
        if (!container) return;

        var article = document.getElementById('blog-content');

        // Create the switcher container div
        var switcherDiv = document.createElement('div');
        switcherDiv.className = 'content-lang-switcher-container';
        switcherDiv.innerHTML = buildSwitcherHTML();

        // Insert right before the article element
        if (article) {
            container.insertBefore(switcherDiv, article);
        } else {
            container.appendChild(switcherDiv);
        }

        // Attach click handlers
        attachSwitcherEvents(switcherDiv);
    }

    /**
     * Attach event listeners to the injected switcher.
     */
    function attachSwitcherEvents(switcherDiv) {
        var btn = switcherDiv.querySelector('.content-lang-switcher-btn');
        var dropdown = switcherDiv.querySelector('.content-lang-dropdown');
        var options = switcherDiv.querySelectorAll('.content-lang-option');

        // Toggle the dropdown on button click
        if (btn && dropdown) {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                dropdown.classList.toggle('open');
            });
        }

        // Handle language option clicks
        for (var i = 0; i < options.length; i++) {
            options[i].addEventListener('click', function(e) {
                e.stopPropagation();
                var lang = this.getAttribute('data-lang');

                // Use the existing global switchLanguage() from i18n.js
                if (typeof switchLanguage === 'function') {
                    switchLanguage(lang);
                }

                // Close the dropdown
                if (dropdown) {
                    dropdown.classList.remove('open');
                }
            });
        }

        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (switcherDiv && !switcherDiv.contains(e.target)) {
                if (dropdown) dropdown.classList.remove('open');
            }
        });
    }

    /**
     * Update the active flag display and active option highlight
     * when the language changes (keeps content switcher in sync
     * with the navbar switcher).
     */
    function updateSwitcherDisplay(lang) {
        // Update the flag on the circular button
        var flagEl = document.querySelector('.content-active-flag');
        if (flagEl) {
            flagEl.textContent = getFlagForLang(lang);
        }

        // Update the "Language" label to match current lang
        var labelEl = document.querySelector('.content-lang-label');
        if (labelEl) {
            var labels = { en: 'Language', id: 'Bahasa', th: '\u0E20\u0E32\u0E29\u0E32' };
            labelEl.textContent = labels[lang] || labels['en'];
        }

        // Highlight the active option in the dropdown
        var options = document.querySelectorAll('.content-lang-option');
        for (var i = 0; i < options.length; i++) {
            var optionLang = options[i].getAttribute('data-lang');
            if (optionLang === lang) {
                options[i].classList.add('content-lang-option-active');
            } else {
                options[i].classList.remove('content-lang-option-active');
            }
        }
    }

    // --- Initialization ---

    document.addEventListener('DOMContentLoaded', function() {
        // Inject the switcher into the blog reader
        injectSwitcher();

        // Set display to match current language
        updateSwitcherDisplay(getActiveLang());

        // Register for language change notifications (keeps in sync with navbar)
        if (typeof onLanguageChange === 'function') {
            onLanguageChange(function(lang) {
                updateSwitcherDisplay(lang);
            });
        }
    });

})();
