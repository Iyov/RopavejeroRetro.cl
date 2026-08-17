// ========== MÓDULO: PRODUCTS ==========

// ========== PRODUCTOS - SEGURO ==========
// Variables globales para productos
let allProducts = [];
let filteredProducts = [];
let currentPage = 1;
const productsPerPage = 25;
let selectedPlatforms = new Set(['all']); // Plataformas seleccionadas
let searchTimeout = null; // Para debounce de búsqueda

function getProductsUrlState() {
    const params = new URLSearchParams(window.location.search);
    const search = params.get('q') || '';
    const sort = params.get('sort') || 'id-asc';
    const page = Math.max(parseInt(params.get('page') || '1', 10) || 1, 1);
    const platforms = (params.get('platform') || '')
        .split(',')
        .map(value => decodeURIComponent(value.trim()))
        .filter(Boolean);

    return {
        search,
        sort: ['id-asc', 'price-asc', 'price-desc', 'name-asc', 'name-desc', 'platform-asc'].includes(sort) ? sort : 'id-asc',
        page,
        platforms
    };
}

function replaceProductsUrlState() {
    if (window.location.pathname !== '/productos' && !window.location.pathname.endsWith('/productos.html')) {
        return;
    }

    const searchValue = (document.getElementById('searchFilter')?.value || '').trim();
    const sortValue = document.getElementById('sortFilter')?.value || 'id-asc';
    const params = new URLSearchParams();

    if (searchValue) {
        params.set('q', searchValue);
    }

    if (sortValue !== 'id-asc') {
        params.set('sort', sortValue);
    }

    if (!selectedPlatforms.has('all')) {
        params.set('platform', Array.from(selectedPlatforms).sort().join(','));
    }

    if (currentPage > 1) {
        params.set('page', String(currentPage));
    }

    const nextUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ''}`;
    window.history.replaceState({}, '', nextUrl);
}

function applyProductsUrlState() {
    const state = getProductsUrlState();
    const searchFilter = document.getElementById('searchFilter');
    const sortFilter = document.getElementById('sortFilter');

    if (searchFilter) {
        searchFilter.value = state.search;
    }

    if (sortFilter) {
        sortFilter.value = state.sort;
    }

    currentPage = state.page;
    window._pendingProductsPlatforms = state.platforms;
}

function initProducts() {
    // Evitar inicialización doble
    if (window._productsInitialized) return;
    window._productsInitialized = true;

    const searchFilter = document.getElementById('searchFilter');
    const sortFilter = document.getElementById('sortFilter');
    const clearFiltersBtn = document.getElementById('clearFilters');
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    
    applyProductsUrlState();

    // Cargar productos
    loadProducts();
    
    // Event listeners para filtros (con debounce en búsqueda)
    searchFilter.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            filterProducts();
            
            // analytics removed: no local search tracking
            const searchTerm = searchFilter.value.trim();
        }, 300); // Espera 300ms después de dejar de escribir
    });
    sortFilter.addEventListener('change', () => {
        filterProducts();
    });
    clearFiltersBtn.addEventListener('click', clearFilters);
    
    // Event listeners para paginación
    prevPageBtn.addEventListener('click', () => changePage(-1));
    nextPageBtn.addEventListener('click', () => changePage(1));
    
    // Inicializar filtro múltiple de plataformas
    initMultiSelectPlatform();
} // fin initProducts

// Inicialización 'lazy' de productos: usa IntersectionObserver con fallback
function lazyInitProducts() {
    const productsSection = document.getElementById('productos');
    if (!productsSection) {
        // Si no existe la sección, inicializar tras un corto timeout
        setTimeout(() => { if (!window._productsInitialized) initProducts(); }, 1000);
        return;
    }

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    initProducts();
                    obs.disconnect();
                }
            });
        }, { rootMargin: '400px' });
        observer.observe(productsSection);

        // Safety fallback: for very slow viewports, inicializar después de 3s
        setTimeout(() => { if (!window._productsInitialized) { initProducts(); observer.disconnect(); } }, 3000);
    } else {
        setTimeout(() => { if (!window._productsInitialized) initProducts(); }, 1500);
    }
} 

// Inicializar filtro múltiple de plataformas
function initMultiSelectPlatform() {
    const platformDisplay = document.getElementById('platformDisplay');
    const platformDropdown = document.getElementById('platformDropdown');
    const platformSearchInput = document.getElementById('platformSearchInput');
    
    // Toggle dropdown
    platformDisplay.addEventListener('click', function(e) {
        e.stopPropagation();
        const isActive = platformDropdown.classList.toggle('active');
        platformDisplay.classList.toggle('active');
        platformDisplay.parentElement.setAttribute('aria-expanded', isActive);
        
        // Enfocar el campo de búsqueda cuando se abre el dropdown
        if (platformDropdown.classList.contains('active')) {
            setTimeout(() => {
                platformSearchInput.focus();
            }, 100);
        }
    });
    
    // Cerrar dropdown al hacer clic fuera
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.multi-select-container')) {
            platformDropdown.classList.remove('active');
            platformDisplay.classList.remove('active');
            platformDisplay.parentElement.setAttribute('aria-expanded', 'false');
            // Limpiar búsqueda al cerrar
            platformSearchInput.value = '';
            filterPlatformOptions('');
        }
    });
    
    // Prevenir que el dropdown se cierre al hacer clic dentro
    platformDropdown.addEventListener('click', function(e) {
        e.stopPropagation();
    });
    
    // Funcionalidad de búsqueda
    platformSearchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        filterPlatformOptions(searchTerm);
    });
    
    // Prevenir que el campo de búsqueda cierre el dropdown al hacer clic
    platformSearchInput.addEventListener('click', function(e) {
        e.stopPropagation();
    });
}

// Cargar productos desde Google Sheets - SEGURO
async function loadProducts() {
    const tableBody = document.getElementById('productsTableBody');
    const productsCounter = document.getElementById('productsCounter');
    
    // Intentar cargar desde caché primero
    const cachedProducts = getCachedProducts();
    if (cachedProducts && Array.isArray(cachedProducts) && cachedProducts.length > 0) {
        console.info('📦 Cargando productos desde caché');
        allProducts = cachedProducts;
        filteredProducts = [...cachedProducts];
        updatePlatformFilter(cachedProducts);
        filterProducts();
        return;
    }
    
    // Si no hay caché, cargar desde Google Sheets con reintentos
    let retryCount = 0;
    
    while (retryCount < CACHE_CONFIG.MAX_RETRIES) {
        try {
            console.info(`🔄 Cargando productos desde Google Sheets (intento ${retryCount + 1}/${CACHE_CONFIG.MAX_RETRIES})`);
            
            // URL de tu Google Sheet (formato CSV) - ID fijo
            const sheetId = '1ZDQQFeCeL3gw2qgO5_xusTKP0GiY94XVTnR_Amphbek';
            const sheetUrl = `https://docs.google.com/spreadsheets/d/${encodeURIComponent(sheetId)}/gviz/tq?tqx=out:csv&headers=1&tq=${encodeURIComponent('SELECT *')}`;
            
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 segundos timeout
            
            const response = await fetch(sheetUrl, {
                method: 'GET',
                headers: {
                    'Accept': 'text/csv',
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache'
                },
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const csvData = await response.text();
            
            // Validar que el CSV no esté vacío
            if (!csvData || csvData.trim().length === 0) {
                throw new Error('CSV data is empty');
            }
            
            // Parsear CSV de forma segura
            const products = parseCSVSecure(csvData);
            
            // Validar que tengamos productos
            if (!Array.isArray(products) || products.length === 0) {
                throw new Error('No valid products found');
            }
            
            // Guardar productos globalmente y en caché
            allProducts = products;
            filteredProducts = [...products];
            setCachedProducts(products);
            
            // Actualizar filtro de plataformas
            updatePlatformFilter(products);

            filterProducts();
            
            console.info(`✅ ${products.length} productos cargados exitosamente`);
            return; // Éxito, salir del bucle
            
        } catch (error) {
            retryCount++;
            console.warn(`❌ Error cargando productos (intento ${retryCount}):`, error.message);
            
            if (retryCount < CACHE_CONFIG.MAX_RETRIES) {
                console.info(`⏳ Reintentando en ${CACHE_CONFIG.RETRY_DELAY/1000} segundos...`);
                await new Promise(resolve => setTimeout(resolve, CACHE_CONFIG.RETRY_DELAY));
            } else {
                // Todos los intentos fallaron
                console.error('💥 Todos los intentos de carga fallaron');
                showLoadingError();
            }
        }
    }
}

// Función para mostrar error de carga
function showLoadingError() {
    const tableBody = document.getElementById('productsTableBody');
    const mobileCards = document.getElementById('mobileCards');
    const currentLang = localStorage.getItem('language') || 'es';
    
    const errorMsg = currentLang === 'es' ? 
        'No se pudieron cargar los productos. Verifica tu conexión a internet.' : 
        'Could not load products. Check your internet connection.';
    
    const retryMsg = currentLang === 'es' ? 'Reintentar' : 'Retry';
    
    const errorHtml = `
        <div style="text-align: center; padding: 40px; color: var(--danger-color);">
            <i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 15px;"></i>
            <p style="font-size: 1.1rem; margin-bottom: 10px;">${errorMsg}</p>
            <button onclick="location.reload()" class="btn btn-primary" style="margin-top: 15px;">
                <i class="fas fa-redo"></i> ${retryMsg}
            </button>
        </div>
    `;
    
    tableBody.innerHTML = `<tr><td colspan="7">${errorHtml}</td></tr>`;
    mobileCards.innerHTML = errorHtml;
}

// Parsear CSV a objetos - SEGURO
function parseCSVSecure(csvText) {
    if (typeof csvText !== 'string') {
        throw new Error('Invalid CSV data type');
    }
    
    const lines = csvText.split('\n');
    
    if (lines.length < 2) {
        throw new Error('CSV must have at least header and one data row');
    }
    
    // Saltar la primera línea (encabezados)
    const dataLines = lines.slice(1);
    const products = [];
    
    dataLines.forEach((line, index) => {
        if (line.trim() === '') return;
        
        try {
            // Manejar comas dentro de comillas de forma segura
            const values = [];
            let currentValue = '';
            let insideQuotes = false;
            
            for (let i = 0; i < line.length; i++) {
                const char = line[i];
                
                if (char === '"') {
                    insideQuotes = !insideQuotes;
                } else if (char === ',' && !insideQuotes) {
                    values.push(currentValue.trim());
                    currentValue = '';
                } else {
                    currentValue += char;
                }
            }
            
            // Agregar el último valor
            values.push(currentValue.trim());
            
            // Validar que tengamos suficientes columnas
            if (values.length < 8) {
                console.warn(`Row ${index + 2} has insufficient columns, skipping`);
                return;
            }
            
            // Crear objeto producto con validación
            const rawProduct = {
                Num: values[0] || '',
                Product: values[1] || '',
                Platform: values[2] || '',
                Sale: values[3] || 'X',
                Neto: values[4] || 'X',
                Stock: values[5] || '0',
                Link: values[6] || '',
                Sold: values[7] || ''  // Cambiado: dejar vacío en lugar de '0'
            };
            
            // Validar y sanitizar producto
            const product = validateProductData(rawProduct);
            
            // Debug temporal: solo en desarrollo
            if (window.location.hostname === 'localhost' && product && product.Num <= 5) {
                console.log(`Producto #${product.Num}: Sold original="${rawProduct.Sold}", Sold procesado=${product.Sold}`);
            }
            
            if (product && product.Num > 0) {
                products.push(product);
            }
            
        } catch (rowError) {
            console.warn(`Error parsing row ${index + 2}:`, rowError);
        }
    });
    
    return products;
}

// Renderizar tabla de productos - SEGURO
function renderProductsTable() {
    const tableBody = document.getElementById('productsTableBody');
    const mobileCards = document.getElementById('mobileCards');
    const currentLang = localStorage.getItem('language') || 'es';
    
    if (filteredProducts.length === 0) {
        const noProductsMsg = currentLang === 'es' ? 'No hay productos disponibles.' : 'No products available.';
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="loading-cell">
                    ${sanitizeHTML(noProductsMsg)}
                </td>
            </tr>
        `;
        mobileCards.innerHTML = `
            <div class="loading-card">
                ${sanitizeHTML(noProductsMsg)}
            </div>
        `;
        updatePaginationButtons();
        return;
    }
    
    // Calcular índices para paginación
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const productsToShow = filteredProducts.slice(startIndex, endIndex);
    
    let tableHtml = '';
    let cardsHtml = '';
    
    productsToShow.forEach(product => {
        // Validar y sanitizar producto
        const safeProduct = validateProductData(product);
        if (!safeProduct || !safeProduct.Num) return;
        
        const statusClass = safeProduct.Sold == 1 ? 'status-sold' : 'status-available';
        const statusIcon = safeProduct.Sold == 1 ? '[❌]' : '[✅]';
        
        // Extraer siglas del producto
        const siglas = extractSiglas(safeProduct.Product);
        const hasSiglas = siglas.length > 0;
        const siglasTooltip = hasSiglas ? createSiglasTooltip(siglas) : '';
        
        // HTML para tabla (desktop)
        tableHtml += `
            <tr data-product-id="${safeProduct.Num}">
                <td><span class="status-badge ${statusClass}">${statusIcon}</span></td>
                <td>${safeProduct.Num}</td>
                <td class="${hasSiglas ? 'has-siglas-tooltip' : ''}" ${hasSiglas ? 'data-has-siglas="true"' : ''}>
                    ${safeProduct.Product}
                    ${hasSiglas ? `<div class="siglas-tooltip-container">${siglasTooltip}</div>` : ''}
                </td>
                <td>${safeProduct.Platform}</td>
                <td>${safeProduct.Neto !== 'X' ? safeProduct.Neto : '0'}</td>
                <td><span class="stock-badge">${safeProduct.Stock}</span></td>
                <td class="actions-cell">
                    <button class="btn btn-primary btn-small view-product-btn" 
                            data-product-id="${safeProduct.Num}" 
                            aria-label="Ver detalles de ${safeProduct.Product}"
                            title="Ver detalles">
                        <i class="fas fa-eye" aria-hidden="true"></i>
                    </button>
                    <button class="btn btn-primary btn-small link-product-btn" 
                            data-product-link="${safeProduct.Link}"
                            aria-label="Ver ${safeProduct.Product} en Instagram"
                            title="Ver en Instagram">
                        <i class="fab fa-instagram" aria-hidden="true"></i>
                    </button>
                </td>
            </tr>
        `;
        
        // HTML para tarjetas (móvil)
        const priceText = currentLang === 'es' ? 'Precio' : 'Price';
        const platformText = currentLang === 'es' ? 'Plataforma' : 'Platform';
        const stockText = currentLang === 'es' ? 'Stock' : 'Stock';
        const statusTextLabel = currentLang === 'es' ? 'Estado' : 'Status';
        const viewDetailsText = currentLang === 'es' ? 'Ver detalles' : 'View details';
        const viewInstagramText = currentLang === 'es' ? 'Ver en Instagram' : 'View on Instagram';
        const siglasTitle = currentLang === 'es' ? 'Siglas' : 'Abbreviations';
        
        cardsHtml += `
            <div class="product-card" data-product-id="${safeProduct.Num}">
                <div class="product-card-header">
                    <div class="product-card-status">
                        <span class="status-badge ${statusClass}">${statusIcon}</span>
                    </div>
                    <div class="product-card-number">#${safeProduct.Num}</div>
                    <h3 class="product-card-title">
                        ${safeProduct.Product}
                    </h3>
                </div>
                <div class="product-card-body">
                    <div class="product-card-field">
                        <div class="product-card-label">${platformText}</div>
                        <div class="product-card-value">${safeProduct.Platform}</div>
                    </div>
                    <div class="product-card-field">
                        <div class="product-card-label">${priceText}</div>
                        <div class="product-card-value product-card-price">${safeProduct.Neto !== 'X' ? safeProduct.Neto : '0'}</div>
                    </div>
                    <div class="product-card-field">
                        <div class="product-card-label">${stockText}</div>
                        <div class="product-card-value">
                            <span class="stock-badge">${safeProduct.Stock}</span>
                        </div>
                    </div>
                    ${hasSiglas ? `
                    <div class="product-card-siglas">
                        <div class="product-card-siglas-title">${siglasTitle}:</div>
                        <div class="product-card-siglas-list">
                            ${siglas.map(({ sigla, descripcion }) => 
                                `<div class="product-card-sigla-item"><strong>${sigla}:</strong> ${descripcion}</div>`
                            ).join('')}
                        </div>
                    </div>
                    ` : ''}
                </div>
                <div class="product-card-actions">
                    <button class="btn btn-primary btn-small view-product-btn" 
                            data-product-id="${safeProduct.Num}" 
                            aria-label="Ver ${safeProduct.Product}"
                            title="${viewDetailsText}">
                        <i class="fas fa-eye" aria-hidden="true"></i>
                        <span>${viewDetailsText}</span>
                    </button>
                    <button class="btn btn-primary btn-small link-product-btn" 
                            data-product-link="${safeProduct.Link}" 
                            aria-label="Ver ${safeProduct.Product} en Instagram"
                            title="${viewInstagramText}">
                        <i class="fab fa-instagram" aria-hidden="true"></i>
                        <span>Instagram</span>
                    </button>
                </div>
            </div>
        `;
    });
    
    tableBody.innerHTML = tableHtml;
    mobileCards.innerHTML = cardsHtml;
    
    // Agregar event listeners a los botones de ver detalles (tanto tabla como tarjetas)
    document.querySelectorAll('.view-product-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-product-id'));
            const product = allProducts.find(p => p.Num === productId);
            if (product) {
                showProductModal(product);
                

            }
        });
    });

    document.querySelectorAll('.link-product-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const productLink = this.getAttribute('data-product-link');
            const safeURL = sanitizeURL(getLinkProductInstagram(productLink));
            if (safeURL !== '#') {
                window.open(safeURL, '_blank', 'noopener,noreferrer');
                

            }
        });
    });
    
    // Actualizar paginación
    updatePagination();
    updatePaginationButtons();
    
    // Traducir elementos
    setLanguage(currentLang);
}

// Actualizar plataformas disponibles basado en búsqueda actual
function updateAvailablePlatforms(filteredProducts) {
    const platformDropdown = document.getElementById('platformDropdown');
    const platformDisplay = document.getElementById('platformDisplay');
    const searchFilter = document.getElementById('searchFilter').value.toLowerCase();
    const availablePlatforms = new Set();
    
    // Obtener plataformas de productos filtrados
    filteredProducts.forEach(product => {
        if (product.Platform && product.Platform.trim() !== '') {
            availablePlatforms.add(product.Platform.trim());
        }
    });
    
    // Agregar clase visual si hay filtrado activo
    if (searchFilter) {
        platformDisplay.classList.add('filtered');
    } else {
        platformDisplay.classList.remove('filtered');
    }
    
    // Obtener todas las opciones de plataforma (excepto "Todas")
    const platformOptions = platformDropdown.querySelectorAll('.multi-select-option:not([data-value="all"])');
    
    // Si no hay búsqueda activa, mostrar todas las plataformas
    if (!searchFilter) {
        platformOptions.forEach(option => {
            option.style.display = 'flex';
            option.classList.remove('filtered-out');
            option.classList.add('available');
        });
        
        // Si no hay plataformas seleccionadas o solo hay inválidas, resetear a "Todas"
        const validSelected = Array.from(selectedPlatforms).filter(p => p === 'all' || availablePlatforms.has(p));
        if (validSelected.length === 0 || (validSelected.length === 1 && validSelected[0] !== 'all' && !availablePlatforms.has(validSelected[0]))) {
            selectedPlatforms.clear();
            selectedPlatforms.add('all');
            document.getElementById('platform-all').checked = true;
            
            // Desmarcar todos los demás checkboxes
            platformOptions.forEach(option => {
                const checkbox = option.querySelector('input[type="checkbox"]');
                if (checkbox) checkbox.checked = false;
            });
        }
    } else {
        // Si hay búsqueda activa, filtrar plataformas
        platformOptions.forEach(option => {
            const platform = option.getAttribute('data-value');
            const checkbox = option.querySelector('input[type="checkbox"]');
            
            if (availablePlatforms.has(platform)) {
                // Mostrar opción si la plataforma tiene productos
                option.style.display = 'flex';
                option.classList.remove('filtered-out');
                option.classList.add('available');
            } else {
                // Ocultar opción si no hay productos de esta plataforma
                option.style.display = 'none';
                option.classList.add('filtered-out');
                option.classList.remove('available');
                
                // Si la plataforma oculta estaba seleccionada, deseleccionarla
                if (checkbox.checked) {
                    checkbox.checked = false;
                    selectedPlatforms.delete(platform);
                }
            }
        });
        
        // Si no hay plataformas seleccionadas después del filtrado, seleccionar "Todas"
        const remainingSelected = Array.from(selectedPlatforms).filter(p => p === 'all' || availablePlatforms.has(p));
        if (remainingSelected.length === 0 || (remainingSelected.length === 1 && remainingSelected[0] !== 'all')) {
            selectedPlatforms.clear();
            selectedPlatforms.add('all');
            document.getElementById('platform-all').checked = true;
        }
    }
    
    // Actualizar la visualización
    updatePlatformDisplay();
    
    // Mostrar/ocultar mensaje si no hay plataformas disponibles
    updatePlatformDropdownMessage(availablePlatforms.size);
}

// Actualizar mensaje del dropdown cuando no hay plataformas disponibles
function updatePlatformDropdownMessage(availablePlatformsCount) {
    const platformDropdown = document.getElementById('platformDropdown');
    const currentLang = localStorage.getItem('language') || 'es';
    
    // Remover mensaje existente
    const existingMessage = platformDropdown.querySelector('.no-platforms-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Si no hay plataformas disponibles (excepto "Todas"), mostrar mensaje
    if (availablePlatformsCount === 0) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'no-platforms-message multi-select-option';
        messageDiv.style.fontStyle = 'italic';
        messageDiv.style.color = 'var(--text-secondary)';
        messageDiv.style.justifyContent = 'center';
        messageDiv.textContent = currentLang === 'es' ? 
            'No hay plataformas para esta búsqueda' : 
            'No platforms for this search';
        
        platformDropdown.appendChild(messageDiv);
    }
}

// Filtrar opciones de plataforma basado en búsqueda
function filterPlatformOptions(searchTerm) {
    const platformDropdown = document.getElementById('platformDropdown');
    const platformOptions = platformDropdown.querySelectorAll('.multi-select-option:not([data-value="all"])');
    const currentLang = localStorage.getItem('language') || 'es';
    
    let visibleCount = 0;
    
    // Remover mensaje de "no hay resultados" existente
    const existingNoResults = platformDropdown.querySelector('.no-search-results');
    if (existingNoResults) {
        existingNoResults.remove();
    }
    
    platformOptions.forEach(option => {
        const platform = option.getAttribute('data-value');
        const label = option.querySelector('label').textContent;
        
        // Verificar si la plataforma coincide con la búsqueda
        const matchesSearch = searchTerm === '' || 
                             platform.toLowerCase().includes(searchTerm) || 
                             label.toLowerCase().includes(searchTerm);
        
        if (matchesSearch) {
            option.classList.remove('search-hidden');
            visibleCount++;
        } else {
            option.classList.add('search-hidden');
        }
    });
    
    // Mostrar mensaje si no hay resultados
    if (visibleCount === 0 && searchTerm !== '') {
        const noResultsDiv = document.createElement('div');
        noResultsDiv.className = 'no-search-results';
        noResultsDiv.textContent = currentLang === 'es' ? 
            `No se encontraron plataformas que contengan "${searchTerm}"` : 
            `No platforms found containing "${searchTerm}"`;
        
        // Insertar después del campo de búsqueda
        const searchContainer = platformDropdown.querySelector('.platform-search-container');
        searchContainer.insertAdjacentElement('afterend', noResultsDiv);
    }
}

// Actualizar filtro de plataformas - MULTI-SELECT INICIAL CON BÚSQUEDA
function updatePlatformFilter(products) {
    const platformDropdown = document.getElementById('platformDropdown');
    const platforms = new Set();
    
    products.forEach(product => {
        if (product.Platform && product.Platform.trim() !== '') {
            platforms.add(product.Platform.trim());
        }
    });
    
    // Limpiar opciones excepto "Todas" y el campo de búsqueda
    const allOption = platformDropdown.querySelector('[data-value="all"]');
    const searchContainer = platformDropdown.querySelector('.platform-search-container');
    platformDropdown.innerHTML = '';
    platformDropdown.appendChild(searchContainer);
    platformDropdown.appendChild(allOption);
    
    // Agregar plataformas únicas ordenadas alfabéticamente
    Array.from(platforms).sort((a, b) => a.localeCompare(b)).forEach(platform => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'multi-select-option';
        optionDiv.setAttribute('data-value', platform);
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `platform-${platform.replace(/\s+/g, '-').toLowerCase()}`;
        checkbox.value = platform;
        
        const label = document.createElement('label');
        label.setAttribute('for', checkbox.id);
        label.textContent = platform;
        
        optionDiv.appendChild(checkbox);
        optionDiv.appendChild(label);
        platformDropdown.appendChild(optionDiv);
        
        // Event listener para cada checkbox
        checkbox.addEventListener('change', handlePlatformSelection);
    });
    
    // Event listener para "Todas"
    const allCheckbox = platformDropdown.querySelector('#platform-all');
    if (allCheckbox) {
        // Remover listeners existentes para evitar duplicados
        allCheckbox.removeEventListener('change', handleAllPlatformsSelection);
        allCheckbox.addEventListener('change', handleAllPlatformsSelection);
    }

    if (Array.isArray(window._pendingProductsPlatforms) && window._pendingProductsPlatforms.length > 0) {
        selectedPlatforms.clear();

        window._pendingProductsPlatforms.forEach(platform => {
            const checkbox = platformDropdown.querySelector(`input[value="${platform}"]`);
            if (checkbox) {
                checkbox.checked = true;
                selectedPlatforms.add(platform);
            }
        });

        if (selectedPlatforms.size === 0) {
            selectedPlatforms.add('all');
            if (allCheckbox) {
                allCheckbox.checked = true;
            }
        } else if (allCheckbox) {
            allCheckbox.checked = false;
        }

        window._pendingProductsPlatforms = [];
        updatePlatformDisplay();
    }
}

// Manejar selección de plataforma individual
function handlePlatformSelection(e) {
    const platform = e.target.value;
    const isChecked = e.target.checked;
    const allCheckbox = document.getElementById('platform-all');
    
    if (isChecked) {
        selectedPlatforms.add(platform);
        // Si se selecciona una plataforma específica, desmarcar "Todas"
        if (selectedPlatforms.has('all')) {
            selectedPlatforms.delete('all');
            allCheckbox.checked = false;
        }
    } else {
        selectedPlatforms.delete(platform);
        // Si no hay plataformas seleccionadas, marcar "Todas"
        if (selectedPlatforms.size === 0) {
            selectedPlatforms.add('all');
            allCheckbox.checked = true;
        }
    }
    
    updatePlatformDisplay();
    filterProducts();
    replaceProductsUrlState();
}

// Manejar selección de "Todas las plataformas"
function handleAllPlatformsSelection(e) {
    const isChecked = e.target.checked;
    const platformDropdown = document.getElementById('platformDropdown');
    const allCheckboxes = platformDropdown.querySelectorAll('input[type="checkbox"]:not(#platform-all)');
    
    if (isChecked) {
        // Desmarcar todas las plataformas específicas
        allCheckboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
        selectedPlatforms.clear();
        selectedPlatforms.add('all');
    } else {
        // Si se desmarca "Todas" y no hay otras seleccionadas, volver a marcar "Todas"
        if (selectedPlatforms.size <= 1) {
            e.target.checked = true;
            return;
        }
        selectedPlatforms.delete('all');
    }
    
    updatePlatformDisplay();
    filterProducts();
}

// Actualizar la visualización del filtro de plataformas
function updatePlatformDisplay() {
    const platformDisplay = document.getElementById('platformDisplay');
    const placeholder = platformDisplay.querySelector('.placeholder');
    const currentLang = localStorage.getItem('language') || 'es';
    
    // Limpiar tags existentes
    const existingTags = platformDisplay.querySelectorAll('.platform-tag');
    existingTags.forEach(tag => tag.remove());
    
    if (selectedPlatforms.has('all') || selectedPlatforms.size === 0) {
        placeholder.textContent = currentLang === 'es' ? 'Todas' : 'All';
        placeholder.style.display = 'block';
    } else {
        placeholder.style.display = 'none';
        
        // Crear tags para plataformas seleccionadas
        const tagsContainer = document.createElement('div');
        tagsContainer.className = 'selected-platforms';
        
        const selectedArray = Array.from(selectedPlatforms).filter(p => p !== 'all');
        
        // Mostrar hasta 3 tags, después mostrar contador
        const maxTags = 3;
        const tagsToShow = selectedArray.slice(0, maxTags);
        const remainingCount = selectedArray.length - maxTags;
        
        tagsToShow.forEach(platform => {
            const tag = document.createElement('span');
            tag.className = 'platform-tag';
            tag.innerHTML = `
                ${sanitizeHTML(platform)}
                <span class="remove" data-platform="${platform}">×</span>
            `;
            
            // Event listener para remover tag
            const removeBtn = tag.querySelector('.remove');
            removeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                removePlatformSelection(platform);
            });
            
            tagsContainer.appendChild(tag);
        });
        
        // Si hay más plataformas seleccionadas, mostrar contador
        if (remainingCount > 0) {
            const counterTag = document.createElement('span');
            counterTag.className = 'platform-tag counter-tag';
            counterTag.textContent = `+${remainingCount}`;
            counterTag.title = selectedArray.slice(maxTags).join(', ');
            tagsContainer.appendChild(counterTag);
        }
        
        platformDisplay.insertBefore(tagsContainer, platformDisplay.querySelector('i'));
    }
}

// Remover selección de plataforma
function removePlatformSelection(platform) {
    selectedPlatforms.delete(platform);
    
    // Desmarcar checkbox correspondiente
    const checkbox = document.querySelector(`input[value="${platform}"]`);
    if (checkbox) {
        checkbox.checked = false;
    }
    
    // Si no hay plataformas seleccionadas, marcar "Todas"
    if (selectedPlatforms.size === 0) {
        selectedPlatforms.add('all');
        document.getElementById('platform-all').checked = true;
    }
    
    updatePlatformDisplay();
    filterProducts();
}

// Filtrar productos - MULTI-SELECT CON FILTRADO DINÁMICO
function filterProducts() {
    const searchFilter = document.getElementById('searchFilter').value.toLowerCase();
    const sortFilter = document.getElementById('sortFilter').value;
    
    // Primero filtrar por búsqueda de texto para obtener productos relevantes
    let searchFilteredProducts = allProducts.filter(product => {
        // Filtrar por búsqueda de texto
        if (searchFilter) {
            const searchText = searchFilter.toLowerCase();
            const productText = (product.Product || '').toLowerCase();
            const platformText = (product.Platform || '').toLowerCase();
            
            if (!productText.includes(searchText) && !platformText.includes(searchText)) {
                return false;
            }
        }
        return true;
    });
    
    // Actualizar las plataformas disponibles basado en la búsqueda
    updateAvailablePlatforms(searchFilteredProducts);
    
    // Ahora aplicar el filtro de plataformas a los productos ya filtrados
    filteredProducts = searchFilteredProducts.filter(product => {
        // Filtrar por plataforma (múltiple)
        if (!selectedPlatforms.has('all')) {
            if (!selectedPlatforms.has(product.Platform)) {
                return false;
            }
        }
        
        return true;
    });

    filteredProducts = sortProducts(filteredProducts, sortFilter);
    
    // Resetear a página 1
    const requestedPage = currentPage;
    const totalPages = Math.max(Math.ceil(filteredProducts.length / productsPerPage), 1);

    currentPage = Math.min(requestedPage, totalPages);

    // Renderizar productos filtrados
    renderProductsTable();
    
    // Actualizar contador
    updateProductsCounter();
    replaceProductsUrlState();
}

// Limpiar filtros - MULTI-SELECT CON RESET DE PLATAFORMAS Y BÚSQUEDA
function clearFilters() {
    // Limpiar búsqueda
    document.getElementById('searchFilter').value = '';
    
    // Restaurar orden por defecto
    document.getElementById('sortFilter').value = 'id-asc';
    
    // Limpiar búsqueda de plataformas
    const platformSearchInput = document.getElementById('platformSearchInput');
    if (platformSearchInput) {
        platformSearchInput.value = '';
        filterPlatformOptions('');
    }
    
    // Limpiar plataformas
    selectedPlatforms.clear();
    selectedPlatforms.add('all');
    
    // Desmarcar todos los checkboxes excepto "Todas"
    const platformDropdown = document.getElementById('platformDropdown');
    const allCheckboxes = platformDropdown.querySelectorAll('input[type="checkbox"]');
    allCheckboxes.forEach(checkbox => {
        checkbox.checked = checkbox.id === 'platform-all';
    });
    
    // Mostrar todas las opciones de plataforma
    const platformOptions = platformDropdown.querySelectorAll('.multi-select-option:not([data-value="all"])');
    platformOptions.forEach(option => {
        option.style.display = 'flex';
        option.classList.remove('search-hidden');
    });
    
    // Remover mensaje de "no hay plataformas"
    const existingMessage = platformDropdown.querySelector('.no-platforms-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Remover mensaje de "no hay resultados de búsqueda"
    const existingNoResults = platformDropdown.querySelector('.no-search-results');
    if (existingNoResults) {
        existingNoResults.remove();
    }
    
    // Actualizar display
    updatePlatformDisplay();
    
    // Aplicar filtros
    filterProducts();
}

function updateProductsCounter() {
    const productsCounter = document.getElementById('productsCounter');
    if (!productsCounter) return;
    const currentLang = localStorage.getItem('language') || 'es';
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    
    const text = currentLang === 'es' 
        ? `Mostrando ${Math.min(filteredProducts.length, productsPerPage)} de ${filteredProducts.length} productos`
        : `Showing ${Math.min(filteredProducts.length, productsPerPage)} of ${filteredProducts.length} products`;
    
    productsCounter.textContent = text;
    productsCounter.dataset.count = Math.min(filteredProducts.length, productsPerPage);
    productsCounter.dataset.total = filteredProducts.length;
}

// Actualizar paginación
function updatePagination() {
    const currentPageElement = document.getElementById('currentPage');
    const totalPagesElement = document.getElementById('totalPages');
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    
    currentPageElement.textContent = currentPage;
    totalPagesElement.textContent = totalPages;
}

// Actualizar botones de paginación
function updatePaginationButtons() {
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    
    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = currentPage === totalPages || totalPages === 0;
}

// Cambiar página
function changePage(direction) {
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    const newPage = currentPage + direction;
    
    if (newPage >= 1 && newPage <= totalPages) {
        currentPage = newPage;
        renderProductsTable();
        
        // Scroll suave a la sección de productos
        const productosSection = document.getElementById('productos');
        if (productosSection) {
            productosSection.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        }
    }
}

// Mostrar modal de producto - SEGURO
function showProductModal(product) {
    const modalOverlay = document.getElementById('productModalOverlay');
    const modalContent = document.getElementById('productModalContent');
    const currentLang = localStorage.getItem('language') || 'es';
    
    // Validar y sanitizar producto
    const safeProduct = validateProductData(product);
    if (!safeProduct) {
        console.error('Invalid product data for modal');
        return;
    }
    
    const statusClass = safeProduct.Sold == 1 ? 'status-sold' : 'status-available';
    const statusIcon = safeProduct.Sold == 1 ? '[❌]' : '[✅]';
    
    // Extraer siglas del producto
    const siglas = extractSiglas(safeProduct.Product);
    const hasSiglas = siglas.length > 0;
    
    // Crear contenido del modal de forma segura
    const modalHeader = document.createElement('div');
    modalHeader.className = 'modal-header';
    
    const statusBadge = document.createElement('span');
    statusBadge.className = `status-badge ${statusClass}`;
    statusBadge.textContent = statusIcon;
    statusBadge.style.fontSize = '24px';
    statusBadge.style.marginRight = '10px';
    statusBadge.setAttribute('aria-label', safeProduct.Sold == 1 ? 'Producto vendido' : 'Producto disponible');
    
    const productTitle = document.createElement('h3');
    productTitle.textContent = safeProduct.Product;
    productTitle.id = 'product-modal-title'; // Para aria-labelledby
    
    modalHeader.appendChild(statusBadge);
    modalHeader.appendChild(productTitle);
    
    const modalDetails = document.createElement('div');
    modalDetails.className = 'modal-details';
    
    // Crear elementos de detalles de forma segura
    const details = [
        { label: currentLang === 'es' ? 'Número' : 'Number', value: safeProduct.Num },
        { label: currentLang === 'es' ? 'Producto' : 'Product', value: safeProduct.Product },
        { label: currentLang === 'es' ? 'Plataforma' : 'Platform', value: safeProduct.Platform },
        { label: currentLang === 'es' ? 'Precio de Venta' : 'Sale Price', value: safeProduct.Neto !== 'X' ? safeProduct.Neto : '0' },
        { label: currentLang === 'es' ? 'Stock' : 'Stock', value: safeProduct.Stock }
    ];
    
    details.forEach(detail => {
        const detailItem = document.createElement('div');
        detailItem.className = 'detail-item';
        
        const label = document.createElement('label');
        label.textContent = detail.label;
        
        const span = document.createElement('span');
        span.textContent = detail.value;
        
        detailItem.appendChild(label);
        detailItem.appendChild(span);
        modalDetails.appendChild(detailItem);
    });
    
    // Agregar sección de siglas si existen
    if (hasSiglas) {
        const siglasInfo = document.createElement('div');
        siglasInfo.className = 'siglas-info';
        
        const siglasTitle = document.createElement('div');
        siglasTitle.className = 'siglas-info-title';
        siglasTitle.textContent = currentLang === 'es' ? '📋 Siglas del Producto:' : '📋 Product Abbreviations:';
        
        const siglasList = document.createElement('div');
        siglasList.className = 'siglas-list';
        
        siglas.forEach(({ sigla, descripcion }) => {
            const siglaDetail = document.createElement('div');
            siglaDetail.className = 'sigla-detail';
            siglaDetail.innerHTML = `<strong>${sigla}:</strong> ${descripcion}`;
            siglasList.appendChild(siglaDetail);
        });
        
        siglasInfo.appendChild(siglasTitle);
        siglasInfo.appendChild(siglasList);
        modalDetails.appendChild(siglasInfo);
    }
    
    // Agregar link de Instagram mejorado
    const instagramLink = getLinkProductInstagram(safeProduct.Link);
    if (instagramLink && instagramLink !== '#') {
        const linkContainer = document.createElement('div');
        linkContainer.style.marginTop = '15px';
        
        const link = document.createElement('a');
        link.href = sanitizeURL(instagramLink);
        link.className = 'modal-instagram-link';
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.innerHTML = `
            <i class="fab fa-instagram"></i>
            <span>${currentLang === 'es' ? 'Ver en Instagram' : 'View on Instagram'}</span>
        `;
        
        linkContainer.appendChild(link);
        modalDetails.appendChild(linkContainer);
    }
    
    const modalActions = document.createElement('div');
    modalActions.className = 'modal-actions';
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'btn btn-secondary';
    closeBtn.id = 'modalCloseBtn';
    closeBtn.textContent = currentLang === 'es' ? 'Cerrar' : 'Close';
    
    modalActions.appendChild(closeBtn);
    
    // Limpiar y agregar contenido
    modalContent.innerHTML = '';
    modalContent.appendChild(modalHeader);
    modalContent.appendChild(modalDetails);
    modalContent.appendChild(modalActions);
    
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Focus en el botón de cerrar
    setTimeout(() => {
        const closeButton = document.getElementById('productModalClose');
        if (closeButton) closeButton.focus();
    }, 100);
    
    // Event listeners para cerrar modal (usando once: true para evitar duplicados)
    const closeModal = () => {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
        // Remover listener de escape
        document.removeEventListener('keydown', escapeHandler);
    };
    
    // Handler para tecla Escape
    const escapeHandler = (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    };
    
    // Agregar listener de Escape
    document.addEventListener('keydown', escapeHandler);
    
    closeBtn.addEventListener('click', closeModal, { once: true });
    
    const modalCloseBtn = document.getElementById('productModalClose');
    if (modalCloseBtn) {
        // Remover listener anterior si existe
        const newModalCloseBtn = modalCloseBtn.cloneNode(true);
        modalCloseBtn.parentNode.replaceChild(newModalCloseBtn, modalCloseBtn);
        newModalCloseBtn.addEventListener('click', closeModal, { once: true });
    }
    
    // Usar AbortController para poder cancelar el listener
    const controller = new AbortController();
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal();
            controller.abort();
        }
    }, { signal: controller.signal });
}

// Obtener Link de producto en Instagram
function getLinkProductInstagram(productLink) {
    if (productLink) {
        productLink = "https://www.instagram.com/p/" + productLink + "/";
    } else {
        productLink = "https://www.instagram.com/ropavejero.retro/";
    }
    return productLink;
}

// Alias para closeProductModal (compatibilidad con posibles llamadas externas)
function openProductModal(product) {
    showProductModal(product);
}

function closeProductModal() {
    const modalOverlay = document.getElementById('productModalOverlay');
    if (modalOverlay) {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}
