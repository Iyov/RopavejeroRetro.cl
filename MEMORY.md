# MEMORY.md

Memoria del proyecto: acuerdos y decisiones tomados con Francisco que no se deducen del código ni del historial de git. Cualquier agente de IA debe leer este archivo junto con [CLAUDE.md](CLAUDE.md) antes de trabajar, y agregar aquí cada acuerdo nuevo en el momento en que se toma.

- Lo que describe **cómo funciona el código** va en `CLAUDE.md`, no aquí.
- Lo que describe **qué cambió** va en `CHANGELOG.md`, no aquí.
- Aquí va lo acordado: reglas de trabajo, decisiones y temas pendientes de decidir. Cada entrada lleva la fecha en que se acordó.

## Reglas de trabajo

- **Cuenta de GitHub (2026-10-12):** este repositorio solo se sube (commit, push, PR) con la cuenta de GitHub [Iyov](https://github.com/Iyov) (`francisco.barrientos@usach.cl`). En el equipo hay otras identidades configuradas que no deben usarse aquí. Antes de subir, verificar que `git config user.email` sea ese correo y que la credencial activa sea la de `Iyov` (`git config credential.https://github.com.username` y `gh auth status`); si no corresponden, detenerse y avisar en vez de subir con otra cuenta.
- **Commit y push con cada cambio terminado (2026-10-12):** cada cambio que queda terminado se commitea y se sube a GitHub (`main`) con la cuenta Iyov, sin esperar a que se pida. Un commit por cambio, verificando la identidad antes y haciendo `git pull --rebase` primero, porque el bot de Instagram también commitea a `main`. Cada push a `main` despliega el sitio.
- **Orden de trabajo (2026-10-12):** primero se actualiza la documentación; las inconsistencias detectadas se revisan después, una por una, y ninguna se corrige sin acordarlo antes.

## Decisiones sobre la documentación

- **Idioma (2026-10-12):** toda la documentación del proyecto se escribe en español.
- **Fuente única (2026-10-12):** `CLAUDE.md` es la guía técnica de referencia. `AGENTS.md` es un resumen que apunta a ella; las reglas se editan en `CLAUDE.md` y en `AGENTS.md` solo se ajusta el resumen.
- **Memoria consolidada aquí (2026-10-12):** todo lo que se vaya acordando se registra en este archivo, para que esté disponible para cualquier agente y no solo en la memoria privada de una herramienta.
- **Documentos históricos (2026-10-12):** los documentos antiguos de `docs/` y `SECURITY.md` no se reescriben; se les agrega una nota de vigencia y `docs/README.md` indica cuáles siguen siendo válidos.
- **Versión del changelog (2026-10-12):** los cambios posteriores a la 2.1.0 están en `CHANGELOG.md` bajo "[Sin publicar]". El número de versión lo decide Francisco; hasta entonces no se toca el badge de versión de `README.md`.
- **Sin SDD (2026-10-12):** no existe ninguna especificación (SDD) en el repositorio y no se creó una a partir del código. Se escribirá cuando haya una funcionalidad concreta que especificar.

## Pendientes por decidir

Inconsistencias detectadas el 2026-10-12 al revisar el proyecto completo. Están documentadas pero sin corregir. Al resolver una, mover aquí la decisión tomada y registrar el cambio en `CHANGELOG.md`.

2. **`npm run build` vacía `js/app.min.js`.** `js/app.js` tiene 0 bytes y `minify:js` sobrescribe el minificado que usa `old.html`. Opciones: sacar `app.js` del script de minificación o recuperar el fuente.
3. **La FAQ contradice al resto del sitio.** `faq-answer-5` (en `index.html` y `js/modules/ui.js`, ES y EN) dice que no hay showroom físico, mientras el sitio anuncia el local @DoubleImpactStore en Persa Bio Bio. El mismo texto está copiado en la FAQ de `README.md`.
4. **`sitemap.xml` lista páginas `noindex`:** `old.html`, `ps3` y las dos páginas de seguridad.
5. **Los headers de seguridad de `.htaccess` no aplican en GitHub Pages.** La única CSP efectiva es la del `<meta>` de cada HTML. Falta decidir si `.htaccess` y `.htaccess.development` se conservan.

## Resueltos

1. **Los posts de Instagram no se desplegaban solos (resuelto 2026-10-12).** Los commits de `github-actions[bot]` no disparan `deploy-pages.yml`; había 32 sin publicar desde el 2026-09-04. Decisión: `update_instagram.yml` lanza el despliegue con `gh workflow run deploy-pages.yml` después de pushear, solo cuando hubo cambios. Se descartó disparar el despliegue con `workflow_run` porque desplegaría cada 12 horas aunque no hubiera posts nuevos. Falta confirmarlo en la primera ejecución del bot que traiga cambios.
