// Base de datos de posts de Instagram (simulados ya que no tenemos acceso directo a la API)
const instagramPosts = [
    {
        image: "https://scontent.fscl25-1.fna.fbcdn.net/v/t51.82787-15/524886551_18054340481605513_6298096200081234582_n.webp?stp=dst-jpg_tt6&_nc_cat=104&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeGvQSrQlNMU7vVFE0Z9sBTcH7I7g41Sa1sfsjuDjVJrW-E2bJBoMWpBNJnSdQq7sF3BfAfpt9whqX9JWtAPMYf8&_nc_ohc=Qw2CxLk4laYQ7kNvwFA7jSU&_nc_oc=Adn4ezzDNcMGkfM3-oD7kcojWbbLlhOTPWg7oUjmtyTXcCpjAd7KEOUXN7r0DbcpZ5M&_nc_zt=23&_nc_ht=scontent.fscl25-1.fna&_nc_gid=3m-RBxfyXuSpUdxZJYEcJg&oh=00_AfaqWyus4jSkbXVHUluvK1k76GvKfDMJg0rNYrhPJJh0SA&oe=68C00EFC",
        title: "[❌] 3267 Sega Genesis v1",
        description: `- Sega Genesis v1 NTSC U/C original americana sin piquetes.
- Mod para salida RCA 3 colores y VGA azul.
- Control Genesis original.
- Transformador de 110V, requiere minwa 110-220V.
- Cable AV RCA alt.
- Mantención y limpieza profunda a consola y control.

[❌]: VENDIDO`,
        link: "https://www.instagram.com/p/DMtnxS2sVZI/"
    },
    {
        image: "https://scontent.fscl25-1.fna.fbcdn.net/v/t51.82787-15/514765819_18051282014605513_3506785830495703064_n.webp?stp=dst-jpg_tt6&_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeEPw2GqAl_33MwAWnUGq8ur0ofU0_l4zN7Sh9TT-XjM3gxu6f-jB6G2fGoh6cKrUK-grcGdx4WH1qDxobTkbILP&_nc_ohc=xKKFSMX8sIAQ7kNvwHmtJ_O&_nc_oc=AdlvraGCFLal7hxmPdxBEdK38hV81qS9ozfTSpU2x8WLW8wZnf0tC2fjczVZaxMxXnI&_nc_zt=23&_nc_ht=scontent.fscl25-1.fna&_nc_gid=6cokiaw6u5CFDbT9bPVIoA&oh=00_Afb3nOWJi68gPEzdTqpkGLTYSPJ3Aiy9iYD3HFBNWqvgsw&oe=68C01C08",
        title: "[✅] 3172 Mario's Time Machine (CIB-Poster) [SNES] $90K",
        description: `- Caja Mario TM NTSC U/C original americana impecable estado.
- Juego original impecable estado.
- Caja interna, dust cover.
- Manual y Poster original.
- Protector PET de regalo.

[✅]: DISPONIBLE`,
        link: "https://www.instagram.com/p/DLljA0wsCbf/"
    },
    {
        image: "https://scontent.fscl25-1.fna.fbcdn.net/v/t51.82787-15/514853449_18051281216605513_4866799882973063812_n.webp?stp=dst-jpg_tt6&_nc_cat=103&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeEdzrzN73mCe9AxTf6hE9PfDwqiF6kELRUPCqIXqQQtFYCPXqmwrh6Zaw-AJHhyMCQSVpCgGTqnreH8pEXdW_r7&_nc_ohc=W97aLdOEooIQ7kNvwEilWpu&_nc_oc=AdlbjjJXLjf59z7qrEHh4HHNQqpvbGlKBKB7rk_Igl4kryNd40rc9FCvWcO-d8HlDUU&_nc_zt=23&_nc_ht=scontent.fscl25-1.fna&_nc_gid=YtWeKoffVeg1je0q99CqEg&oh=00_Afa908bLZyLcAkCoVGB5cWoHNsmJp84LjfstsQmEYOlebg&oe=68C033ED",
        title: "[❌] 3171 Donkey Kong Country 2 (CIB) [SNES]",
        description: `- Caja DKC 2 NTSC U/C original americana impecable estado.
- Juego original impecable estado.
- Caja interna, dust cover.
- Manual original.
- Protector PET de regalo.

[❌]: VENDIDO`,
        link: "https://www.instagram.com/p/DLlhoaOsxNi/"
    },
    {
        image: "../img/RopavejeroLogo_256.png",
        title: "@Ropavejero.Retro on Instagram",
        description: "Este es link a nuestro Instagram donde publicamos todas nuestras novedades, productos y ofertas. ¡Síguenos para no perderte nada!",
        link: "https://www.instagram.com/ropavejero.retro/"
    }
];

// Función para cargar posts de Instagram
function loadInstagramPosts() {
    const postsContainer = document.getElementById('instagram-posts');
    postsContainer.innerHTML = ''; // Limpiar contenedor
    
    instagramPosts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'product-card';
        postElement.innerHTML = `
            <div class="product-img">
                <img src="${post.image}" alt="${post.title}">
            </div>
            <div class="product-info">
                <h3>${post.title}</h3>
                <p>${post.description}</p>
                <a href="${post.link}" target="_blank" class="btn-instagram">
                    <i class="fab fa-instagram"></i> <span data-translate="view-post">Ver Post</span>
                </a>
            </div>
        `;
        postsContainer.appendChild(postElement);
    });
}

// Función para cargar efemérides desde un archivo JSON
async function loadEphemeris() {
    try {
        // En un caso real, cargaríamos desde un archivo JSON externo
        const response = await fetch('js/efemerides.json');
        const ephemerisData = await response.json();
        
        // Simulamos la carga de un archivo JSON
        //const ephemerisData = '';

        updateEphemeris(currentLang, ephemerisData);
    } catch (error) {
        console.error('Error al cargar las efemérides:', error);
        document.getElementById('ephemeris-text').textContent = 
            currentLang === 'es' 
            ? "Error al cargar las efemérides." 
            : "Error loading ephemeris.";
    }
}

// Traducciones
const translations = {
    "es": {
        "home": "Home",
        "about": "Nosotros",
        "contact": "Contacto",
        "hero-title": "@Ropavejero.Retro | Todo lo Retro en un solo lugar",
        "hero-text": "Consolas, juegos y accesorios retro originales americanos. Revive la nostalgia de los videojuegos clásicos.",
        "shop-now": "Ir a Instagram",
        "featured": "Posts de Instagram",
        "view-post": "Ver Post",
        "ephemeris": "Efeméride del día",
        "about-text-1": "@Ropavejero.Retro es una tienda especializada en videojuegos retro originales americanos. Nuestra pasión por los videojuegos clásicos nos impulsa a buscar y ofrecer los mejores productos para los amantes de la nostalgia gaming.",
        "about-text-2": "Desde consolas clásicas como NES, SNES, PlayStation 1 y Sega Genesis, hasta juegos y accesorios originales, todo cuidadosamente revisado y garantizado. Trabajamos directamente con proveedores en Estados Unidos para asegurar la autenticidad de nuestros productos.",
        "about-text-3": "Nuestro objetivo es que revivas aquellos maravillosos momentos de tu infancia con la misma calidad y emoción de entonces.",
        "contact-text": "Puedes encontrarnos en nuestras redes sociales o contactarnos directamente a través de los siguientes medios:",
        "instagram": "Instagram",
        "tiktok": "TikTok",
        "youtube": "YouTube",
        "website": "Sitio Web",
        "facebook": "Facebook",
        "twitter": "Twitter",
        "whatsapp": "WhatsApp",
        "excel": "Excel",
        "brands": "Marcas",
        "about-us": "Acerca de nosotros",
        "about-text": "Especialistas en videojuegos retro originales americanos. Revive tu infancia con nosotros.",
        "quick-links": "Enlaces Rápidos",
        "address": "Santiago, Chile",
        "rights": "Todos los derechos reservados"
    },
    "en": {
        "home": "Home",
        "about": "About Us",
        "contact": "Contact",
        "hero-title": "@Ropavejero.Retro | Everything Retro in one place",
        "hero-text": "Original American retro consoles, games and accessories. Relive the nostalgia of classic video games.",
        "shop-now": "Go to Instagram",
        "featured": "Instagram Posts",
        "view-post": "View Post",
        "ephemeris": "Today in gaming history",
        "about-text-1": "@Ropavejero.Retro is a store specialized in original American retro video games. Our passion for classic video games drives us to seek and offer the best products for nostalgia gaming lovers.",
        "about-text-2": "From classic consoles like NES, SNES, PlayStation 1 and Sega Genesis, to original games and accessories, all carefully reviewed and guaranteed. We work directly with suppliers in the United States to ensure the authenticity of our products.",
        "about-text-3": "Our goal is for you to relive those wonderful moments of your childhood with the same quality and excitement as back then.",
        "contact-text": "You can find us on our social networks or contact us directly through the following means:",
        "instagram": "Instagram",
        "tiktok": "TikTok",
        "youtube": "YouTube",
        "website": "Website",
        "facebook": "Facebook",
        "twitter": "Twitter",
        "whatsapp": "WhatsApp",
        "excel": "Excel",
        "brands": "Brands",
        "about-us": "About us",
        "about-text": "Specialists in original American retro video games. Relive your childhood with us.",
        "quick-links": "Quick Links",
        "address": "Santiago, Chile",
        "rights": "All rights reserved"
    }
};

// Formatear fecha en español o inglés
function formatDate(lang) {
    const today = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    
    return today.toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-US', options);
}

// Actualizar la fecha actual
function updateCurrentDate(lang) {
    document.getElementById('current-date').textContent = formatDate(lang);
}

// Funcionalidad para el menú móvil
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mainNav = document.getElementById('mainNav');

mobileMenuBtn.addEventListener('click', () => {
    mainNav.classList.toggle('active');
    mobileMenuBtn.innerHTML = mainNav.classList.contains('active') ? 
        '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
});

// Funcionalidad para cambiar de tema
const themeToggle = document.querySelector('.theme-toggle');
themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    if (currentTheme === 'dark') {
        document.documentElement.removeAttribute('data-theme');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        localStorage.setItem('theme', 'light');
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        localStorage.setItem('theme', 'dark');
    }
});

// Cargar tema guardado
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
}

// Funcionalidad para cambiar idioma
const languageButtons = document.querySelectorAll('.language-select');
let currentLang = localStorage.getItem('language') || 'es';

languageButtons.forEach(button => {
    button.addEventListener('click', () => {
        const lang = button.getAttribute('data-lang');
        if (lang !== currentLang) {
            currentLang = lang;
            translatePage(lang);
            localStorage.setItem('language', lang);
            updateCurrentDate(lang);
            loadEphemeris(); // Recargar efemérides con el nuevo idioma
        }
    });
});

// Cargar idioma guardado
if (currentLang && currentLang !== 'es') {
    translatePage(currentLang);
}

// Traducir página
function translatePage(lang) {
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[lang][key]) {
            if (element.classList.contains('nav-text')) {
                element.textContent = translations[lang][key];
            } else {
                element.textContent = translations[lang][key];
            }
        }
    });
    
    // Actualizar botones de idioma
    document.querySelectorAll('.language-select').forEach(btn => {
        if (btn.getAttribute('data-lang') === lang) {
            btn.style.fontWeight = 'bold';
            btn.style.backgroundColor = 'var(--accent)';
            btn.style.color = 'var(--secondary)';
        } else {
            btn.style.fontWeight = 'normal';
            btn.style.backgroundColor = 'var(--secondary)';
            btn.style.color = 'var(--primary)';
        }
    });
}

// Actualizar efeméride según el día y el idioma
function updateEphemeris(lang, ephemerisData) {
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayKey = month + day;
    
    // Buscar efeméride para hoy
    let ephemerisText = lang === 'es' 
        ? "Hoy no hay efemérides registradas." 
        : "No ephemeris recorded for today.";
    
    for (const item of ephemerisData[lang]) {
        if (item.date === todayKey) {
            ephemerisText = item.text;
            break;
        }
    }
    
    document.getElementById('ephemeris-text').textContent = ephemerisText;
}

// Inicializar efeméride y fecha
updateCurrentDate(currentLang);
loadEphemeris();

// Inicializar botones de idioma
document.querySelector(`.language-select[data-lang="${currentLang}"]`).style.fontWeight = 'bold';
document.querySelector(`.language-select[data-lang="${currentLang}"]`).style.backgroundColor = 'var(--accent)';
document.querySelector(`.language-select[data-lang="${currentLang}"]`).style.color = 'var(--secondary)';

// Cargar posts de Instagram
loadInstagramPosts();

// Smooth scroll para los enlaces del menú
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
            
            // Cerrar menú móvil después de hacer clic
            if (window.innerWidth <= 768) {
                mainNav.classList.remove('active');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            }
        }
    });
});

// Ajustar menú en redimensionamiento de ventana
window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
        mainNav.classList.remove('active');
        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    }
});