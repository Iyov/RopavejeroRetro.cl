// ========== MÓDULO: SIGLAS ==========

// ========== FUNCIONES DE SIGLAS ==========
// Cargar siglas desde JSON
async function loadSiglas() {
    try {
        const response = await fetch('js/siglas.json?v=2026-08-17_1');
        if (!response.ok) {
            throw new Error('Error loading siglas');
        }
        siglasData = await response.json();
        console.info('✅ Siglas cargadas correctamente');
        return siglasData;
    } catch (error) {
        console.error('Error cargando siglas:', error);
        return {};
    }
}

// Extraer siglas de un texto de producto
function extractSiglas(productText) {
    if (!productText || typeof productText !== 'string') return [];

    const foundSiglas = [];
    const foundSiglasSet = new Set(); // Para evitar duplicados
    const currentLang = localStorage.getItem('language') || 'es';

    // Ordenar siglas por longitud descendente para detectar primero las más largas
    // Esto evita que "CIB" se detecte cuando el texto dice "CIB+"
    const sortedSiglas = Object.entries(siglasData).sort((a, b) => b[0].length - a[0].length);

    // Buscar cada sigla en el texto
    for (const [sigla, value] of sortedSiglas) {
        // Resolver descripción según idioma activo
        const descripcion = (typeof value === 'object' && value !== null)
            ? (value[currentLang] || value['es'] || '')
            : value;

        // Escapar caracteres especiales en la sigla para regex
        const escapedSigla = sigla.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        // Buscar la sigla como palabra completa con diferentes delimitadores
        const patterns = [
            // Entre paréntesis: (BL-CIB) o (BL)
            new RegExp(`\\((?:[^)]*-)?${escapedSigla}(?:-[^)]*)?\\)`, 'i'),
            // Entre corchetes: [BL-CIB] o [BL]
            new RegExp(`\\[(?:[^\\]]*-)?${escapedSigla}(?:-[^\\]]*)?\\]`, 'i'),
            // Con guiones: -BL- o BL-CIB
            new RegExp(`(?:^|\\s|-)${escapedSigla}(?:-|\\s|$)`, 'i'),
            // Palabra completa con límites
            new RegExp(`\\b${escapedSigla}\\b(?!\\+)`, 'i')
        ];

        if (patterns.some(pattern => pattern.test(productText)) && !foundSiglasSet.has(sigla)) {
            foundSiglas.push({ sigla, descripcion });
            foundSiglasSet.add(sigla);
        }
    }

    return foundSiglas;
}

// Crear HTML para tooltip de siglas
function createSiglasTooltip(siglas) {
    if (!siglas || siglas.length === 0) return '';
    
    const items = siglas.map(item => 
        `<div class="sigla-item">
            <strong>${item.sigla}:</strong> ${item.descripcion}
        </div>`
    ).join('');
    
    return `<div class="siglas-tooltip">${items}</div>`;
}
