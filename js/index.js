// ========== INICIALIZACIÓN ==========
document.addEventListener('DOMContentLoaded', function() {
    loadSiglas().then(() => {
        initTheme();
        initLanguage();
        initProgressBar();
        initNavActive();
        initBackToTop();
        initMobileMenu();
        initFAQ();
        initBlogDialogs();
        if (typeof lazyInitProducts === 'function') lazyInitProducts();
        loadEfemerides();
        applySavedSettings();
    });
});
