// ========== MÓDULO: EFEMERIDES ==========

// ========== EFEMÉRIDES - SEGURO ==========
function loadEfemerides() {
    const currentDateElement = document.getElementById('currentDate');
    const efemeridesCard = document.getElementById('efemeridesCard');

    if (!efemeridesCard) return;
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const dateKey = `${month}/${day}`;
    
    // Formatear fecha para mostrar
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const currentLang = localStorage.getItem('language') || 'es';
    const formattedDate = now.toLocaleDateString(currentLang === 'es' ? 'es-ES' : 'en-US', options);
    
    if (currentDateElement) {
        currentDateElement.textContent = formattedDate;
    }
    
    // Cargar efemérides desde el archivo JSON de forma segura
    fetch('js/efemerides.json', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
        },
        signal: AbortSignal.timeout(5000) // Timeout de 5 segundos
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Validar estructura de datos
            if (!data || !Array.isArray(data.efemerides)) {
                throw new Error('Invalid efemerides data structure');
            }

            if (!efemeridesCard) return;
            const efemeridesArr = data.efemerides;
            const efemerideHoy = efemeridesArr.find(item => item.date === dateKey);
            
            const langKey = currentLang === 'es' ? 'ES' : 'EN';
            
            if (efemerideHoy && efemerideHoy[langKey]) {
                const info = efemerideHoy[langKey];
                
                // Validar y sanitizar datos
                const safeTitle = sanitizeHTML(info.title || '');
                const safeText = sanitizeHTML(info.text || '');
                const safeDet = sanitizeHTML(info.det || '');
                
                // Crear elementos de forma segura
                const headerDiv = document.createElement('div');
                headerDiv.className = 'efemerides-header';
                
                const badge = document.createElement('span');
                badge.className = 'efemerides-badge';
                badge.textContent = currentLang === 'es' ? 'Efeméride del día' : 'Today\'s Anniversary';
                
                const title = document.createElement('h3');
                title.textContent = safeTitle;
                
                const text = document.createElement('p');
                text.textContent = safeText;
                
                const detail = document.createElement('p');
                detail.textContent = safeDet;
                
                headerDiv.appendChild(badge);
                headerDiv.appendChild(title);
                headerDiv.appendChild(text);
                headerDiv.appendChild(detail);
                
                efemeridesCard.innerHTML = '';
                efemeridesCard.appendChild(headerDiv);
            } else {
                // Mensaje predeterminado
                const headerDiv = document.createElement('div');
                headerDiv.className = 'efemerides-header';
                
                const badge = document.createElement('span');
                badge.className = 'efemerides-badge';
                badge.textContent = currentLang === 'es' ? 'Efeméride del día' : 'Today\'s Anniversary';
                
                const title = document.createElement('h3');
                title.textContent = currentLang === 'es' ? 
                    'Hoy no hay efemérides registradas.' : 
                    'No anniversaries recorded for today.';
                
                const text = document.createElement('p');
                text.textContent = currentLang === 'es' ? 
                    '¡Disfruta de tus juegos retro!' : 
                    'Enjoy your retro games!';
                
                headerDiv.appendChild(badge);
                headerDiv.appendChild(title);
                headerDiv.appendChild(text);
                
                efemeridesCard.innerHTML = '';
                efemeridesCard.appendChild(headerDiv);
            }
        })
        .catch(error => {
            const errorMessage = handleSecureError(error, 'efemerides');
            
            if (!efemeridesCard) return;

            const headerDiv = document.createElement('div');
            headerDiv.className = 'efemerides-header';
            
            const badge = document.createElement('span');
            badge.className = 'efemerides-badge';
            badge.textContent = currentLang === 'es' ? 'Efeméride del día' : 'Today\'s Anniversary';
            
            const title = document.createElement('h3');
            title.textContent = errorMessage;
            
            headerDiv.appendChild(badge);
            headerDiv.appendChild(title);
            
            efemeridesCard.innerHTML = '';
            efemeridesCard.appendChild(headerDiv);
        });
}
