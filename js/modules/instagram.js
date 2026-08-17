// ========== MÓDULO: INSTAGRAM ==========

// ========== POSTS DE INSTAGRAM ==========

// CONSOLE_ALIASES se carga desde js/console_aliases.json
let CONSOLE_ALIASES = {};

async function loadConsoleAliases() {
    try {
        const response = await fetch(`js/console_aliases.json?v=2026-08-17_1`);
        if (!response.ok) throw new Error('No se pudo cargar console_aliases.json');
        CONSOLE_ALIASES = await response.json();
        console.info('✅ Console aliases cargados correctamente');
    } catch (e) {
        console.warn('⚠️ Error cargando console_aliases.json, usando fallback:', e);
        // Fallback con estructura { label, aliases }
        CONSOLE_ALIASES = {
            'PS1':     { label: 'PS1',      aliases: ['[PS1]'] },
            'PS2':     { label: 'PS2',      aliases: ['[PS2]'] },
            'PS3':     { label: 'PS3',      aliases: ['[PS3]'] },
            'PS4':     { label: 'PS4',      aliases: ['[PS4]'] },
            'NES':     { label: 'NES',      aliases: ['[NES]'] },
            'SNES':    { label: 'SNES',     aliases: ['[SNES]'] },
            'N64':     { label: 'N64',      aliases: ['[N64]'] },
            'GCN':     { label: 'GameCube', aliases: ['[GCN]'] },
            'Wii':     { label: 'Wii',      aliases: ['[Wii]'] },
            'Xbox':    { label: 'Xbox OG',  aliases: ['[Xbox]'] },
            'X360':    { label: 'Xbox 360', aliases: ['[X360]'] },
            'Genesis': { label: 'Genesis',  aliases: ['[Genesis]'] },
            'GB':      { label: 'GameBoy',  aliases: ['[GB]'] },
            'GBC':     { label: 'GBC',      aliases: ['[GBC]'] },
            'GBA':     { label: 'GBA',      aliases: ['[GBA]'] },
            'DS':      { label: 'DS',       aliases: ['[DS]'] },
            '3DS':     { label: '3DS',      aliases: ['[3DS]'] },
            'PSP':     { label: 'PSP',      aliases: ['[PSP]'] },
            'DVD':     { label: 'DVD/VHS',  aliases: ['[DVD]'] }
        };
    }
}

// Construir los botones de filtro dinámicamente desde CONSOLE_ALIASES
function buildFilterButtons() {
    const filters = document.getElementById('instagramFilters');
    if (!filters) return;

    // Eliminar botones previos excepto el "Todas"
    filters.querySelectorAll('.ig-filter-btn:not([data-console="all"])').forEach(b => b.remove());

    for (const [key, entry] of Object.entries(CONSOLE_ALIASES)) {
        const label = (typeof entry === 'object' && entry.label) ? entry.label : key;
        const btn = document.createElement('button');
        btn.className = 'ig-filter-btn';
        btn.dataset.console = key;
        btn.textContent = label;
        filters.appendChild(btn);
    }
}

function detectConsole(post) {
    const text = (post.title + ' ' + post.description).toUpperCase();
    for (const [key, entry] of Object.entries(CONSOLE_ALIASES)) {
        // Soporta tanto { label, aliases } como ['alias1', 'alias2'] (legacy)
        const aliases = Array.isArray(entry) ? entry : (entry.aliases || []);
        for (const alias of aliases) {
            if (text.includes(alias.toUpperCase())) return key;
        }
    }
    return null;
}

// Almacena todos los posts cargados para poder re-filtrar sin volver a leer
let _allInstagramPosts = [];

function initInstagramFilters() {
    const filters = document.getElementById('instagramFilters');
    if (!filters) return;

    filters.addEventListener('click', function(e) {
        const btn = e.target.closest('.ig-filter-btn');
        if (!btn) return;

        // Marcar activo
        filters.querySelectorAll('.ig-filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const selected = btn.dataset.console;
        if (selected === 'all') {
            renderInstagramPosts(_allInstagramPosts);
        } else {
            const filtered = _allInstagramPosts.filter(p => detectConsole(p) === selected);
            renderInstagramPosts(filtered, true);
        }
    });
}

async function loadInstagramPosts() {
    const instagramGrid = document.getElementById('instagramGrid');
    
    if (!instagramGrid) {
        console.warn('Instagram grid element not found');
        return;
    }
    
    // Mostrar loading
    instagramGrid.innerHTML = `
        <div class="instagram-loading">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Cargando posts de Instagram...</p>
        </div>
    `;
    
    try {
        if (window.location.hostname === 'localhost') {
            console.info('📋 Cargando posts de Instagram simulados');
        }
        const simulatedPosts = getSimulatedInstagramPosts();
        if (window.location.hostname === 'localhost') {
            console.debug('📸 Posts simulados cargados:', simulatedPosts.length);
        }
        _allInstagramPosts = simulatedPosts;
        await loadConsoleAliases();
        buildFilterButtons();
        initInstagramFilters();
        renderInstagramPosts(simulatedPosts);
        
    } catch (error) {
        console.error('Error loading Instagram posts:', error);
        showInstagramError();
    }
}


// Función para renderizar posts de Instagram
function renderInstagramPosts(posts, isFiltered = false) {
    const instagramGrid = document.getElementById('instagramGrid');
    
    if (!posts || posts.length === 0) {
        if (isFiltered) {
            const lang = localStorage.getItem('language') || 'es';
            instagramGrid.innerHTML = `
                <div class="instagram-no-results" style="grid-column:1/-1;text-align:center;padding:40px;color:var(--text-secondary);">
                    <i class="fas fa-gamepad" style="font-size:2.5rem;margin-bottom:15px;opacity:0.4;display:block;"></i>
                    <p>${lang === 'es' ? 'No hay posts para esta consola.' : 'No posts for this console.'}</p>
                </div>`;
            return;
        }
        showInstagramError();
        return;
    }
    
    instagramGrid.innerHTML = '';
    
    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'instagram-card';
        
        // Sanitizar datos
        const safeTitle = sanitizeHTML(post.title || 'Post de Instagram');
        const safeDescription = sanitizeHTML(post.description || '');
        
        // Para imágenes, verificar si es una ruta local o URL externa
        let safeImage = '';
        if (post.image) {
            if (post.image.startsWith('img/') || post.image.startsWith('./img/') || post.image.startsWith('../img/')) {
                // Es una ruta local, usarla directamente
                safeImage = post.image.replace('../img/', 'img/').replace('./img/', 'img/');
            } else {
                // Es una URL externa, sanitizarla
                safeImage = sanitizeURL(post.image) || 'img/RopavejeroLogo_256.png';
            }
        } else {
            safeImage = 'img/RopavejeroLogo_256.png';
        }
        
        const safeLink = sanitizeURL(post.link || '');
        
        if (window.location.hostname === 'localhost') {
            console.debug(`📸 Renderizando post: ${post.title?.substring(0, 30)}... con imagen: ${safeImage}`);
        }
        
        // Construir <picture> responsive (WebP local) cuando la imagen es local (img/...)
        let imageHtml = '';
        if (safeImage && safeImage.startsWith('img/')) {
            // eliminar query string si existe
            const imageNoQuery = safeImage.split('?')[0];
            const baseName = imageNoQuery.replace(/\.(jpe?g|png)$/i, '');
            const webpSrcset = `${baseName}-400.webp 400w, ${baseName}-800.webp 800w, ${baseName}-1200.webp 1200w`;
            imageHtml = `
                <picture>
                    <source type="image/webp" srcset="${webpSrcset}" sizes="(max-width:600px) 400px, (max-width:1000px) 800px, 1200px">
                    <img src="${safeImage}" alt="${safeTitle}" loading="lazy" decoding="async" onerror="this.onerror=null; this.src='img/RopavejeroLogo_256.png'; this.alt='Imagen no disponible'; console.warn('Error cargando imagen:', '${safeImage}');">
                </picture>
            `;
        } else {
            imageHtml = `<img src="${safeImage}" alt="${safeTitle}" loading="lazy" decoding="async" onerror="this.onerror=null; this.src='img/RopavejeroLogo_256.png'; this.alt='Imagen no disponible'; console.warn('Error cargando imagen:', '${safeImage}');">`;
        }
        
        postElement.innerHTML = `
            <div class="instagram-image">
                ${imageHtml}
                ${post.media_type === 'VIDEO' ? '<div class="video-indicator"><i class="fas fa-play"></i></div>' : ''}
            </div>
            <div class="instagram-content">
                <h3>${safeTitle}</h3>
                <div class="post-meta">
                    ${post.date ? `<div class="post-date">${formatInstagramDate(post.date)}</div>` : ''}
                    ${post.likes != null ? `<div class="post-likes"><i class="fas fa-heart"></i> ${post.likes.toLocaleString()}</div>` : ''}
                </div>
                <p>${safeDescription}</p>
                <div class="instagram-actions">
                    <a href="${safeLink}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
                        <i class="fab fa-instagram"></i>
                        Ver Post
                    </a>
                </div>
            </div>
        `;
        
        instagramGrid.appendChild(postElement);
    });
}



// Función para mostrar error de Instagram
function showInstagramError() {
    const instagramGrid = document.getElementById('instagramGrid');
    const currentLang = localStorage.getItem('language') || 'es';
    
    const errorMsg = currentLang === 'es' ? 
        'No se pudieron cargar los posts de Instagram.' : 
        'Could not load Instagram posts.';
    
    const visitMsg = currentLang === 'es' ? 
        'Visita nuestro Instagram' : 
        'Visit our Instagram';
    
    instagramGrid.innerHTML = `
        <div class="instagram-error">
            <i class="fab fa-instagram" style="font-size: 3rem; color: var(--instagram-error-color); margin-bottom: 15px;"></i>
            <p>${errorMsg}</p>
            <a href="https://www.instagram.com/ropavejero.retro/" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
                <i class="fab fa-instagram"></i>
                ${visitMsg}
            </a>
        </div>
    `;
}

// Datos simulados como fallback
function getSimulatedInstagramPosts() {
    // Usar datos del archivo externo si está disponible
    if (typeof getInstagramPostsData === 'function') {
        return getInstagramPostsData();
    }
    
    // Fallback en caso de que el archivo no se cargue
    console.warn('Archivo instagram_posts.js no cargado, usando datos de respaldo');
    return [
        {
            id: 'fallback_1',
            image: "img/RopavejeroLogo_256.png",
            title: "Post de Instagram",
            description: "No se pudieron cargar los posts de Instagram.",
            link: "https://www.instagram.com/ropavejero.retro/",
            media_type: 'IMAGE',
            date: new Date().toISOString().split('T')[0]
        }
    ];
}

// Función para formatear fecha de Instagram
function formatInstagramDate(dateString) {
    try {
        // Crear fecha agregando la hora para evitar problemas de zona horaria
        const date = new Date(dateString + 'T12:00:00');
        const now = new Date();
        
        // Normalizar las fechas para comparar solo días (sin horas)
        const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const nowOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        
        const diffTime = nowOnly.getTime() - dateOnly.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        const currentLang = localStorage.getItem('language') || 'es';
        
        if (diffDays === 0) {
            return currentLang === 'es' ? 'Hoy' : 'Today';
        } else if (diffDays === 1) {
            return currentLang === 'es' ? 'Hace 1 día' : '1 day ago';
        } else if (diffDays > 0 && diffDays < 7) {
            return currentLang === 'es' ? `Hace ${diffDays} días` : `${diffDays} days ago`;
        } else if (diffDays > 0 && diffDays < 30) {
            const weeks = Math.floor(diffDays / 7);
            if (currentLang === 'es') {
                return `Hace ${weeks} semana${weeks > 1 ? 's' : ''}`;
            } else {
                return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
            }
        } else if (diffDays < 0) {
            // Fecha futura
            const futureDays = Math.abs(diffDays);
            if (futureDays === 1) {
                return currentLang === 'es' ? 'Mañana' : 'Tomorrow';
            } else if (futureDays < 7) {
                return currentLang === 'es' ? `En ${futureDays} días` : `In ${futureDays} days`;
            } else {
                const options = { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                };
                return date.toLocaleDateString(currentLang === 'es' ? 'es-ES' : 'en-US', options);
            }
        } else {
            // Fecha muy antigua, mostrar fecha completa
            const options = { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
            };
            return date.toLocaleDateString(currentLang === 'es' ? 'es-ES' : 'en-US', options);
        }
    } catch (error) {
        console.warn('Error formatting date:', error);
        return '';
    }
}

// Alias para getInstagramLink (compatibilidad con posibles llamadas externas)
function getInstagramLink(postLink) {
    return sanitizeURL(postLink || 'https://www.instagram.com/ropavejero.retro/');
}
