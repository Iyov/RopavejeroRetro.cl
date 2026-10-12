// ========== INICIALIZACIÓN ==========
document.addEventListener('DOMContentLoaded', function() {
    // Los módulos de siglas, catálogo y efemérides no se cargan en todas las páginas
    // (404 y páginas de seguridad solo cargan ui.js): sus funciones van protegidas
    const siglasListas = typeof loadSiglas === 'function' ? loadSiglas() : Promise.resolve();

    siglasListas.then(() => {
        initTheme();
        initLanguage();
        initProgressBar();
        initNavActive();
        initBackToTop();
        initMobileMenu();
        initFAQ();
        initBlogDialogs();
        if (typeof lazyInitProducts === 'function') lazyInitProducts();
        if (typeof loadEfemerides === 'function') loadEfemerides();
        applySavedSettings();
    });
});
