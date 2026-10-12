# MEMORY.md

Memoria del proyecto: acuerdos y decisiones tomados con Francisco que no se deducen del código ni del historial de git. Cualquier agente de IA debe leer este archivo junto con [CLAUDE.md](CLAUDE.md) antes de trabajar, y agregar aquí cada acuerdo nuevo en el momento en que se toma.

- Lo que describe **cómo funciona el código** va en `CLAUDE.md`, no aquí.
- Lo que describe **qué cambió** va en `CHANGELOG.md`, no aquí.
- Aquí va lo acordado: reglas de trabajo, decisiones y temas pendientes de decidir. Cada entrada lleva la fecha en que se acordó.

## Reglas de trabajo

- **Cuenta de GitHub (2026-10-12):** este repositorio solo se sube (commit, push, PR) con la cuenta de GitHub [Iyov](https://github.com/Iyov) (`francisco.barrientos@usach.cl`). En el equipo hay otras identidades configuradas que no deben usarse aquí. Antes de subir, verificar que `git config user.email` sea ese correo y que la credencial activa sea la de `Iyov` (`git config credential.https://github.com.username` y `gh auth status`); si no corresponden, detenerse y avisar en vez de subir con otra cuenta.
- **Commit y push con cada cambio terminado (2026-10-12):** cada cambio que queda terminado se commitea y se sube a GitHub (`main`) con la cuenta Iyov, sin esperar a que se pida. Un commit por cambio, verificando la identidad antes y haciendo `git pull --rebase` primero, porque el bot de Instagram también commitea a `main`. Cada push a `main` despliega el sitio.
- **Orden de trabajo (2026-10-12):** primero se actualiza la documentación; las inconsistencias detectadas se revisan después, una por una, y ninguna se corrige sin acordarlo antes.

## Versionado de caché

- **Un solo esquema en todas partes (2026-10-12):** la versión de los archivos es siempre `?v=AAAA-MM-DD_N` (ej. `?v=2026-10-12_1`), el mismo valor en todo el sitio, sin excepciones: HTML, JS, JSON, service worker y lo que escribe el bot de Instagram. Si hay más cambios el mismo día, se enumeran con el correlativo (`_2`, `_3`, ...); un día nuevo parte en `_1`. Francisco lo pidió expresamente porque el bot usaba `AAAA-MM-DD_HHMM` y había referencias con versiones viejas o sin versión.
- **Cada cambio lleva su bump (2026-10-12):** todo cambio a un archivo que sirve el sitio termina con `python api/bump_version.py` y con `--check` pasando, antes del commit. La versión no se edita a mano.
- **La regla se hace cumplir, no solo se documenta (2026-10-12):** Francisco preguntó si los agentes siempre la leen antes de implementar; como leerla no garantiza cumplirla, se acordó un control automático en dos puntos: un hook `pre-commit` (se activa por equipo con `git config core.hooksPath .githooks`) y una verificación en el despliegue que no publica si se modificó el sitio sin subir la versión. Cuando se cree el agente de front-end, la regla debe ir también en su definición.

## Decisiones sobre la documentación

- **Idioma (2026-10-12):** toda la documentación del proyecto se escribe en español.
- **Fuente única (2026-10-12):** `CLAUDE.md` es la guía técnica de referencia. `AGENTS.md` es un resumen que apunta a ella; las reglas se editan en `CLAUDE.md` y en `AGENTS.md` solo se ajusta el resumen.
- **Memoria consolidada aquí (2026-10-12):** todo lo que se vaya acordando se registra en este archivo, para que esté disponible para cualquier agente y no solo en la memoria privada de una herramienta.
- **Documentos históricos (2026-10-12):** los documentos antiguos de `docs/` y `SECURITY.md` no se reescriben; se les agrega una nota de vigencia y `docs/README.md` indica cuáles siguen siendo válidos.
- **Versión del changelog (2026-10-12):** los cambios posteriores a la 2.1.0 están en `CHANGELOG.md` bajo "[Sin publicar]". El número de versión lo decide Francisco; hasta entonces no se toca el badge de versión de `README.md`.

## Trabajo acordado para más adelante

Francisco lo pedirá cuando corresponda; no empezarlo antes.

- **Rediseñar el anuncio del local del Persa Bio Bio (2026-10-12).** El sitio debe comunicar que hay un nuevo local (@DoubleImpactStore, Persa Bio Bio), pero la implementación actual (agosto de 2026: bloque `store-announcement` y textos repartidos por el sitio) quedó fea y a Francisco no le gustó. Hay que rehacerla mejor.
- **Agente especialista en front-end (2026-10-12).** Se agregará un agente dedicado al front-end; será el encargado del rediseño anterior.
- **SDD (2026-10-12).** Se escribirá una especificación bien hecha para que las funcionalidades nuevas y los arreglos se hagan de forma profesional, especificando antes de implementar. Reemplaza la decisión anterior de "sin SDD".

## Pendientes por decidir

Las cinco inconsistencias detectadas el 2026-10-12 están cerradas (ver "Resueltos"). Queda una decisión abierta:

- **Headers de seguridad en Cloudflare.** El sitio no envía HSTS, X-Frame-Options, Referrer-Policy ni Permissions-Policy. Solo se pueden agregar desde el panel de Cloudflare, no desde el repositorio. Falta que Francisco decida si los configura.


## Resueltos

1. **Los posts de Instagram no se desplegaban solos (resuelto 2026-10-12).** Los commits de `github-actions[bot]` no disparan `deploy-pages.yml`; había 32 sin publicar desde el 2026-09-04. Decisión: `update_instagram.yml` lanza el despliegue con `gh workflow run deploy-pages.yml` después de pushear, solo cuando hubo cambios. Se descartó disparar el despliegue con `workflow_run` porque desplegaría cada 12 horas aunque no hubiera posts nuevos. Falta confirmarlo en la primera ejecución del bot que traiga cambios.
2. **`npm run build` vacía `js/app.min.js` (descartado 2026-10-12: era un falso hallazgo).** `js/app.js` no está vacío: pesa 7.717 bytes en una sola línea, y se leyó mal un conteo de 0 líneas como 0 bytes. Minificarlo reproduce `js/app.min.js` byte a byte, así que no había nada que corregir en el código; solo se retiró la advertencia de `CLAUDE.md`, `AGENTS.md` y `README.md`. Tras este error se auditó el resto de lo documentado ese día y se corrigieron tres afirmaciones más (CSP "en cada HTML", `generate_cache_version.py` "no modifica nada" y el motivo por el que hay que cambiar `CACHE_VERSION`).
3. **La FAQ contradecía al resto del sitio (resuelto 2026-10-12).** `faq-answer-5` decía que no hay showroom físico. Decisión de Francisco: debe indicar el local del Persa Bio Bio. Se cambió el texto en `index.html`, `js/modules/ui.js` (ES y EN) y la FAQ de `README.md`, usando la dirección y el horario que el sitio ya publicaba (sábados, domingos y festivos, 11:00 a 18:00). Es solo una corrección de texto: el rediseño de cómo se anuncia el local está en "Trabajo acordado para más adelante".
4. **`sitemap.xml` listaba páginas `noindex` (resuelto 2026-10-12).** Se quitaron `old.html`, `ps3` y las dos páginas de seguridad; quedan solo `/` y `/productos`. De paso se cambió `/productos.html` por la URL canónica `/productos`. Regla que queda: una página `noindex` no va en el sitemap. El sitemap no lleva `?v=`, así que este cambio no requirió bump de versión.
5. **Los headers de `.htaccess` no aplicaban en GitHub Pages (resuelto 2026-10-12).** Decisión: se eliminaron `.htaccess` y `.htaccess.development`, porque daban una falsa sensación de protección, y `SECURITY.md` ya no los presenta como activos. Se agregó CSP por `<meta>` a `old.html` (la misma del sitio más `youtube-nocookie.com` para su video), probada en navegador sin violaciones. `ps3.html` queda sin CSP a propósito: solo redirige a un sitio externo. Se comprobó que el sitio está detrás de Cloudflare y que hoy no envía ningún header de seguridad propio.
