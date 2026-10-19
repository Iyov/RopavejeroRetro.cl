# Especificaciones (SDD)

Este proyecto trabaja con **desarrollo guiado por especificación**: primero se escribe qué debe hacer el sitio, después se implementa, y un test automático comprueba cada requisito. Nada se da por terminado sin su requisito y su test.

## Qué hay aquí

| Carpeta | Contenido |
|---------|-----------|
| [`base/`](base/) | La especificación vigente del sitio: qué hace hoy cada funcionalidad. Es la fuente de verdad del comportamiento. |
| [`cambios/`](cambios/) | Una especificación por cada cambio en curso o ya entregado (funcionalidad nueva o arreglo). |
| [`_plantilla.md`](_plantilla.md) | Plantilla para especificar un cambio. |

## Requisitos e identificadores

Cada requisito de `base/` es una línea con un identificador único, `PREFIJO-NNN`:

```markdown
- **PRD-013** — La búsqueda filtra por nombre o plataforma, sin distinguir mayúsculas, 300 ms después de dejar de escribir.
```

- El identificador **no se reutiliza ni se renumera**. Si un requisito deja de existir, se elimina la línea y sus tests; el número queda libre para siempre.
- Un requisito describe un **comportamiento observable** (qué ve el visitante, qué archivo se escribe), no cómo está programado.
- Los prefijos están en la tabla de más abajo. Un área nueva estrena prefijo nuevo.

## Trazabilidad

El test de cada requisito lleva su identificador entre corchetes en el nombre (JavaScript) o en el docstring (Python):

```js
test('[PRD-013] la búsqueda filtra por nombre o plataforma...', async () => { ... });
```

```python
def test_same_day_increments_the_counter():
    """[VER-001] El mismo día, el correlativo sube en uno."""
```

`tests/js/trazabilidad.test.js` falla si:

- un requisito de `specs/base/` no tiene ningún test;
- un test cita un identificador que no existe en la especificación;
- hay identificadores duplicados;
- un requisito marcado como pendiente no tiene su test en `todo`, o al revés;
- un pendiente (`PEND-NN`) no está descrito en [`MEMORY.md`](../MEMORY.md).

Para ver la matriz completa requisito → tests:

```bash
npm run trace
```

## Requisitos que el sitio todavía no cumple

Cuando un test destapa un defecto, **no se corrige sin acordarlo con Francisco** (regla de `MEMORY.md`). Se deja así:

1. El requisito se escribe como **debería** funcionar y se marca al final con `⚠ PEND-NN`.
2. Su test se escribe igual, con `{ todo: 'PEND-NN: motivo' }`. Se ejecuta en cada corrida, pero su fallo no rompe la suite.
3. `PEND-NN` se describe en "Pendientes por decidir" de `MEMORY.md`.

Al corregir el defecto se quitan las tres marcas en el mismo commit. Un test en `todo` que ya pasa es una marca olvidada: hay que quitarla.

## Flujo de trabajo para cualquier cambio

1. **Especificar.** Copiar `_plantilla.md` a `cambios/AAAA-MM-DD-nombre-corto.md` y completarla: problema, requisitos nuevos o modificados (con sus identificadores), qué queda fuera, cómo se va a comprobar.
2. **Acordar.** Francisco aprueba la especificación antes de escribir código.
3. **Tests primero.** Se escriben los tests de los requisitos nuevos o modificados y se comprueba que fallan por la razón esperada.
4. **Implementar.** Se implementa hasta que esos tests pasan, sin acomodar los tests a la implementación.
5. **Verificar.** El orquestador corre la suite completa (`npm test`) y revisa que no se rompió nada en otra parte.
6. **Integrar la especificación.** Los requisitos del cambio pasan a `base/` (se agregan, modifican o eliminan líneas) y el archivo de `cambios/` queda como registro, con su estado en "Entregado".
7. **Cerrar.** Regenerar minificados si corresponde, bump de versión de caché, `CHANGELOG.md`, commit y push.

Quién ejecuta los pasos 3 y 4 depende del tamaño del cambio: los chicos y medianos los hace el orquestador completo en la sesión principal; en los grandes (un rediseño, una página o un módulo nuevo, varias áreas a la vez) los tests los escribe el agente `tester` y la implementación la hace el agente `frontend`. El criterio está en [.claude/agents/orquestador.md](../.claude/agents/orquestador.md).

Un arreglo pequeño sigue el mismo flujo; solo que su especificación cabe en pocas líneas.

## Comandos

```bash
npm test            # todo: JavaScript + Python
npm run test:js     # node --test sobre tests/js/
npm run test:py     # pytest sobre tests/
npm run trace       # matriz de trazabilidad requisito -> tests
npm run test:coverage   # tests de JavaScript + porcentaje de líneas del sitio que ejecutan
```

Un solo archivo o un solo test:

```bash
node --test tests/js/productos.test.js
node --test --test-name-pattern="PRD-013" tests/js/productos.test.js
python -m pytest tests/test_bump_version.py -k same_day
```

## Áreas de la especificación base

| Prefijo | Área | Especificación | Tests |
|---------|------|----------------|-------|
| `UTL` | Utilidades (sanitizar, validar, ordenar) | [01-utilidades.md](base/01-utilidades.md) | `tests/js/utils.test.js` |
| `CCH` | Caché de productos | [02-cache-productos.md](base/02-cache-productos.md) | `tests/js/cache-logger-siglas.test.js` |
| `LOG` | Logs según ambiente | [03-logger.md](base/03-logger.md) | `tests/js/cache-logger-siglas.test.js` |
| `SIG` | Siglas de productos | [04-siglas.md](base/04-siglas.md) | `tests/js/cache-logger-siglas.test.js` |
| `THM` `NAV` `FAQ` `BLG` | Tema, navegación, FAQ y blog | [05-interfaz.md](base/05-interfaz.md) | `tests/js/ui.test.js` |
| `I18N` | Idioma español / inglés | [06-idioma.md](base/06-idioma.md) | `tests/js/ui.test.js` |
| `PRD` | Catálogo de productos | [07-catalogo.md](base/07-catalogo.md) | `tests/js/productos.test.js` |
| `IGF` | Posts de Instagram en el sitio | [08-instagram.md](base/08-instagram.md) | `tests/js/instagram-efemerides.test.js` |
| `EFE` | Efemérides del día | [09-efemerides.md](base/09-efemerides.md) | `tests/js/instagram-efemerides.test.js` |
| `ANL` | Analytics resiliente y CSP | [10-analytics.md](base/10-analytics.md) | `tests/js/analytics-seo.test.js` |
| `SEO` | GTM, eventos e indexación | [11-seo.md](base/11-seo.md) | `tests/js/analytics-seo.test.js` |
| `SW` | Service worker | [12-service-worker.md](base/12-service-worker.md) | `tests/js/service-worker.test.js` |
| `SITE` | Integridad entre archivos | [13-integridad-sitio.md](base/13-integridad-sitio.md) | `tests/js/sitio.test.js` |
| `LEG` | Páginas legacy (`old.html`, `ps3.html`) | [14-paginas-legacy.md](base/14-paginas-legacy.md) | `tests/js/sitio.test.js` |
| `VER` | Versión de caché | [15-version-cache.md](base/15-version-cache.md) | `tests/test_bump_version.py` |
| `BOT` | Bot de Instagram | [16-bot-instagram.md](base/16-bot-instagram.md) | `tests/test_update_instagram.py` |
| `LOC` | Local físico (@DoubleImpactStore) | [17-local.md](base/17-local.md) | `tests/js/local.test.js` |
| `TST` | Testimonios de clientes | [18-testimonios.md](base/18-testimonios.md) | `tests/js/testimonios.test.js` |

## Qué no cubren los tests

Los tests del front-end corren en [jsdom](https://github.com/jsdom/jsdom): cargan los HTML reales y ejecutan los scripts reales, pero **no dibujan la página**. Quedan fuera, y se revisan a mano en el navegador:

- El aspecto visual: CSS, diseño responsive, colores de cada tema, animaciones.
- Lo que depende de un navegador real: instalación como PWA, comportamiento sin conexión de punta a punta, carga diferida con el `IntersectionObserver` real.
- Servicios externos reales: la hoja de Google, la Graph API de Instagram, GTM/GA4. Se simulan con datos de la misma forma que los reales.
- `watcher.js` y los scripts antiguos de `docs/`: son herramientas de desarrollo, no parte del sitio.
