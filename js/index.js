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
                    <i class="fab fa-instagram"></i> Ver Post
                </a>
            </div>
        `;
        postsContainer.appendChild(postElement);
    });
}

// Base de datos de efemérides
const ephemerisData = {
    "es": [
        { date: "0101", text: "Hoy en 1970: Se funda la empresa ASK, que luego se convertiría en Square Enix." },
        { date: "0102", text: "Hoy en 1993: Se lanza 'Star Fox' para SNES, con gráficos 3D revolucionarios." },
        { date: "0923", text: "Hoy en 1999: Sega lanza Dreamcast en Norteamérica, su última consola." },
        { date: "1105", text: "Hoy en 2006: Nintendo lanza la Wii, revolucionando los juegos con su mando motion-sensitive." },
        { date: "1127", text: "Hoy en 2005: Xbox 360 hace su debut, comenzando la séptima generación de consolas." },
        { date: "1203", text: "Hoy en 1994: Sony lanza PlayStation en Japón, cambiando la industria para siempre." },
        { date: "1228", text: "Hoy en 1983: Nintendo crea la franquicia Mario Bros con el lanzamiento del juego arcade." }
    ],
    "en": [
        { date: "0101", text: "Today in 1970: The company ASK was founded, which would later become Square Enix." },
        { date: "0102", text: "Today in 1993: 'Star Fox' was launched for SNES, with revolutionary 3D graphics." },
        { date: "0923", text: "Today in 1999: Sega launches Dreamcast in North America, their last console." },
        { date: "1105", text: "Today in 2006: Nintendo launches the Wii, revolutionizing gaming with its motion-sensitive controller." },
        { date: "1127", text: "Today in 2005: Xbox 360 makes its debut, starting the seventh generation of consoles." },
        { date: "1203", text: "Today in 1994: Sony launches PlayStation in Japan, changing the industry forever." },
        { date: "1228", text: "Today in 1983: Nintendo creates the Mario Bros franchise with the launch of the arcade game." }
    ]
};

// Traducciones
const translations = {
    "es": {
        "home": "Inicio",
        "products": "Productos",
        "consoles": "Consolas",
        "games": "Juegos",
        "accessories": "Accesorios",
        "collectibles": "Coleccionables",
        "brands": "Marcas",
        "about": "Nosotros",
        "contact": "Contacto",
        "hero-title": "Todo lo retro en un solo lugar",
        "hero-text": "Consolas, juegos y accesorios retro originales americanos. Revive la nostalgia de los videojuegos clásicos.",
        "shop-now": "Comprar ahora",
        "featured": "Posts de Instagram",
        "nes-desc": "Consola clásica con 2 controles y juego Super Mario Bros.",
        "ps2-desc": "Consola PS2 con 2 mandos y 5 juegos incluidos.",
        "zelda-title": "The Legend of Zelda",
        "zelda-desc": "Juego original para NES en perfecto estado.",
        "headset-title": "Audífonos Gaming",
        "headset-desc": "Audífonos para PlayStation 4, Xbox One y PC.",
        "add-cart": "Añadir al carrito",
        "ephemeris": "Efeméride del día",
        "follow-us": "Síguenos",
        "about-us": "Acerca de nosotros",
        "about-text": "Especialistas en videojuegos retro originales americanos. Revive tu infancia con nosotros.",
        "links": "Enlaces rápidos",
        "address": "Santiago, Chile",
        "rights": "Todos los derechos reservados"
    },
    "en": {
        "home": "Home",
        "products": "Products",
        "consoles": "Consoles",
        "games": "Games",
        "accessories": "Accessories",
        "collectibles": "Collectibles",
        "brands": "Brands",
        "about": "About Us",
        "contact": "Contact",
        "hero-title": "Everything retro in one place",
        "hero-text": "Original American retro consoles, games and accessories. Relive the nostalgia of classic video games.",
        "shop-now": "Shop now",
        "featured": "Instagram's Posts",
        "nes-desc": "Classic console with 2 controllers and Super Mario Bros game.",
        "ps2-desc": "PS2 console with 2 controllers and 5 games included.",
        "zelda-title": "The Legend of Zelda",
        "zelda-desc": "Original game for NES in perfect condition.",
        "headset-title": "Gaming Headset",
        "headset-desc": "Headset for PlayStation 4, Xbox One and PC.",
        "add-cart": "Add to cart",
        "ephemeris": "Today in gaming history",
        "follow-us": "Follow us",
        "about-us": "About us",
        "about-text": "Specialists in original American retro video games. Relive your childhood with us.",
        "links": "Quick links",
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

// Funcionalidad para submenús en móviles
if (window.innerWidth <= 768) {
    document.querySelectorAll('nav > ul > li').forEach(item => {
        item.addEventListener('click', function(e) {
            if (e.target.tagName === 'A' && this.querySelector('.submenu')) {
                e.preventDefault();
                this.classList.toggle('active');
            }
        });
    });
}

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
            updateEphemeris(lang);
            updateCurrentDate(lang);
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
            element.textContent = translations[lang][key];
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
function updateEphemeris(lang) {
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
updateEphemeris(currentLang);
updateCurrentDate(currentLang);

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