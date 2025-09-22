// Base de datos de posts de Instagram
const instagramPosts = [
    {
        image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1350&q=80",
        title: "Nintendo 64 Edition",
        description: "¡Miren esta belleza de Nintendo 64 que acaba de llegar! Color original y en perfecto estado. ¿Quién quiere jugar Mario Kart?",
        link: "https://www.instagram.com/p/Cr8dXKGM4V7/"
    },
    {
        image: "https://images.unsplash.com/photo-1588032786041-5cf5868c77d2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1350&q=80",
        title: "PlayStation 2 Collection",
        description: "Lote de PlayStation 2 con 15 juegos incluidos. Perfecto para coleccionistas. Todos probados y funcionando.",
        link: "https://www.instagram.com/p/Cr5tJ9OsnL2/"
    },
    {
        image: "https://images.unsplash.com/photo-1607853554432-64b57b5245cc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1350&q=80",
        title: "GameBoy Advance SP",
        description: "GameBoy Advance SP en color azul. Pantalla perfecta y batería renovada. Incluye cartucho de Pokémon Esmeralda.",
        link: "https://www.instagram.com/p/Cr2kLpJM9X1/"
    },
    {
        image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1350&q=80",
        title: "Sega Genesis Bundle",
        description: "Pack Sega Genesis con 2 controles y 5 juegos: Sonic 2, Mortal Kombat, Street Fighter y más. ¡No te lo pierdas!",
        link: "https://www.instagram.com/p/CrxHJKLsT5A/"
    }
];

// Función para cargar posts de Instagram
function loadInstagramPosts() {
    const postsContainer = document.getElementById('instagram-posts');
    postsContainer.innerHTML = '';
    
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

// Función para cargar efemérides
async function loadEphemeris() {
    try {
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
        "faq": "Preguntas Frecuentes",
        "hero-title": "@Ropavejero.Retro | Todo lo Retro en un solo lugar",
        "hero-text": "Consolas, juegos y accesorios retro originales americanos. Revive la nostalgia de los videojuegos clásicos.",
        "instagram-button": "Ir a Instagram",
        "featured": "Posts de Instagram",
        "view-post": "Ver Post",
        "ephemeris": "Efeméride del día",
        "about-text-1": "Ropavejero Retro es una tienda especializada en videojuegos retro originales americanos. Nuestra pasión por los videojuegos clásicos nos impulsa a buscar y ofrecer los mejores productos para los amantes de la nostalgia gaming.",
        "about-text-2": "Desde consolas clásicas como NES, SNES, PlayStation 1 y Sega Genesis, hasta juegos y accesorios originales, todo cuidadosamente revisado y garantizado. Trabajamos directamente con proveedores en Estados Unidos para asegurar la autenticidad de nuestros productos.",
        "about-text-3": "Nuestro objetivo es que revivas aquellos maravillosos momentos de tu infancia con la misma calidad y emoción de entonces.",
        "faq-question-1": "¿Qué tipos de productos venden?",
        "faq-answer-1": "Vendemos consolas, juegos y accesorios retro originales americanos. Trabajamos con marcas como Nintendo (NES, SNES, N64, Gamecube, GameBoy, Wii, DS, 3DS), PlayStation (PS1, PS2, PSP, PS3, PS4), Sega (Genesis, GameGear, Dreamcast), Xbox (Classic, 360, One) y Atari.",
        "faq-question-2": "¿Los productos son originales y en qué estado están?",
        "faq-answer-2": "Todos nuestros productos son 100% originales americanos. Revisamos cada artículo minuciosamente y garantizamos su funcionamiento. El estado varía desde productos como nuevos hasta usados en buen estado, siempre especificando claramente las condiciones en cada listing.",
        "faq-question-3": "¿Realizan envíos a todo Chile?",
        "faq-answer-3": "Sí, realizamos envíos a todo Chile a través de Starken y Chilexpress. El costo de envío varía según la ubicación y el peso del paquete. Para compras sobre $50.000 el envío es gratuito dentro de Santiago.",
        "faq-question-4": "¿Ofrecen garantía en sus productos?",
        "faq-answer-4": "Todos nuestros productos incluyen 30 días de garantía por defectos de funcionamiento. Para consolas reacondicionadas por nosotros, ofrecemos 90 días de garantía. La garantía cubre problemas técnicos pero no daños físicos por mal uso.",
        "faq-question-5": "¿Puedo ver los productos antes de comprar?",
        "faq-answer-5": "Actualmente no tenemos showroom físico, pero puedes agendar una cita para ver productos específicos en nuestras oficinas en Santiago. También publicamos videos demostrativos de todos nuestros productos en Instagram y YouTube.",
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
        "faq": "FAQ",
        "hero-title": "@Ropavejero.Retro | Everything Retro in One Place",
        "hero-text": "Original American retro consoles, games and accessories. Relive the nostalgia of classic video games.",
        "instagram-button": "Go to Instagram",
        "featured": "Instagram Posts",
        "view-post": "View Post",
        "ephemeris": "Today in Gaming History",
        "about-text-1": "Ropavejero Retro is a store specialized in original American retro video games. Our passion for classic video games drives us to seek and offer the best products for nostalgia gaming lovers.",
        "about-text-2": "From classic consoles like NES, SNES, PlayStation 1 and Sega Genesis, to original games and accessories, all carefully reviewed and guaranteed. We work directly with suppliers in the United States to ensure the authenticity of our products.",
        "about-text-3": "Our goal is for you to relive those wonderful moments of your childhood with the same quality and excitement as back then.",
        "faq-question-1": "What types of products do you sell?",
        "faq-answer-1": "We sell original American retro consoles, games and accessories. We work with brands like Nintendo (NES, SNES, N64, Gamecube, GameBoy, Wii, DS, 3DS), PlayStation (PS1, PS2, PSP, PS3, PS4), Sega (Genesis, GameGear, Dreamcast), Xbox (Classic, 360, One) and Atari.",
        "faq-question-2": "Are the products original and what condition are they in?",
        "faq-answer-2": "All our products are 100% original American. We meticulously review each item and guarantee its operation. The condition ranges from like-new products to used in good condition, always clearly specifying the conditions in each listing.",
        "faq-question-3": "Do you ship throughout Chile?",
        "faq-answer-3": "Yes, we ship throughout Chile via Starken and Chilexpress. The shipping cost varies depending on the location and weight of the package. For purchases over $50,000, shipping is free within Santiago.",
        "faq-question-4": "Do you offer warranty on your products?",
        "faq-answer-4": "All our products include 30 days warranty for operational defects. For consoles refurbished by us, we offer 90 days warranty. The warranty covers technical problems but not physical damage from misuse.",
        "faq-question-5": "Can I see the products before buying?",
        "faq-answer-5": "We currently don't have a physical showroom, but you can schedule an appointment to see specific products at our offices in Santiago. We also post demo videos of all our products on Instagram and YouTube.",
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

// Funcionalidad para el menú móvil
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mainNav = document.getElementById('mainNav');

mobileMenuBtn.addEventListener('click', () => {
    mainNav.classList.toggle('active');
    mobileMenuBtn.innerHTML = mainNav.classList.contains('active') ? 
        '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
});

// Progress bar functionality
window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    document.getElementById('progressBar').style.width = scrolled + '%';
    
    // Show/hide back to top button
    const backToTop = document.getElementById('backToTop');
    if (winScroll > 300) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
});

// Back to top functionality
document.getElementById('backToTop').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Logo click to top
document.getElementById('logoTop').addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// FAQ functionality
document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
        const answer = question.nextElementSibling;
        const isOpen = answer.classList.contains('open');
        
        // Close all answers
        document.querySelectorAll('.faq-answer').forEach(ans => {
            ans.classList.remove('open');
        });
        document.querySelectorAll('.faq-question').forEach(q => {
            q.classList.remove('active');
        });
        
        // Open clicked answer if it was closed
        if (!isOpen) {
            answer.classList.add('open');
            question.classList.add('active');
        }
    });
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
            loadEphemeris();
        }
    });
});

// Formatear fecha
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

// Actualizar fecha
function updateCurrentDate(lang) {
    document.getElementById('current-date').textContent = formatDate(lang);
}

// Actualizar efemérides
function updateEphemeris(lang, ephemerisData) {
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayKey = month + day;
    
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

// Traducir página
function translatePage(lang) {
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });
    
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

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    if (currentLang && currentLang !== 'es') {
        translatePage(currentLang);
    }
    updateCurrentDate(currentLang);
    loadEphemeris();
    loadInstagramPosts();
    
    document.querySelector(`.language-select[data-lang="${currentLang}"]`).style.fontWeight = 'bold';
    document.querySelector(`.language-select[data-lang="${currentLang}"]`).style.backgroundColor = 'var(--accent)';
    document.querySelector(`.language-select[data-lang="${currentLang}"]`).style.color = 'var(--secondary)';

    // Smooth scroll con ajuste para el header fijo
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                if (window.innerWidth <= 768) {
                    mainNav.classList.remove('active');
                    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                }
            }
        });
    });
});

// Ajustar menú en redimensionamiento
window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
        mainNav.classList.remove('active');
        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    }
});