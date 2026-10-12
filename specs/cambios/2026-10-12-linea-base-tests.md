# Línea base de especificación y tests

- **Estado:** Entregado
- **Fecha:** 2026-10-12
- **Tipo:** Funcionalidad nueva (herramientas de desarrollo; no cambia el sitio publicado)

## Problema

El sitio solo tenía 7 tests, todos de los scripts Python. Nada comprobaba el front-end: un cambio en un módulo podía romper otra parte del sitio sin que nadie lo notara hasta verlo publicado. Tampoco había una descripción escrita de qué debe hacer cada funcionalidad.

## Resultado esperado

Cada funcionalidad que el sitio tiene hoy queda descrita como requisito y comprobada por un test automático. Antes de publicar un cambio, `npm test` dice si algo se rompió.

## Requisitos

Todos los de [`../base/`](../base/) nacen con este cambio. No se modificó el comportamiento del sitio: los requisitos describen lo que el código ya hacía.

## Fuera de alcance

- Corregir los defectos que los tests destaparon. Quedaron como `PEND-06` a `PEND-16` en `MEMORY.md`, con su test en `todo`, a la espera de que Francisco decida.
- Tests visuales o en un navegador real (ver "Qué no cubren los tests" en [`../README.md`](../README.md)).
- Bloquear el despliegue cuando fallan los tests (`PEND-17`).

## Archivos que se tocan

- `specs/` — proceso SDD, plantilla y especificación base.
- `tests/js/` — tests del front-end con `node:test` y `jsdom`.
- `tests/test_bump_version.py`, `tests/test_update_instagram.py` — ampliados.
- `.claude/agents/` — agentes `orquestador`, `frontend` y `tester`.
- `.github/workflows/tests.yml` — corre los tests en cada push y pull request.
- `package.json` — `jsdom` como dependencia de desarrollo y scripts `test`, `test:js`, `test:py`, `trace`.

## Cómo se comprueba

`npm test` pasa completo y `npm run trace` muestra cada requisito con al menos un test.

## Decisiones

- **`node:test` + `jsdom` en vez de un framework de tests o un navegador real.** El sitio no tiene bundler ni dependencias de ejecución; `node:test` viene con Node y `jsdom` es la única dependencia nueva. Los tests cargan los HTML y scripts reales, sin modificarlos. Un navegador real (Playwright) cubriría además lo visual, pero suma una descarga de más de 100 MB y tests más lentos; se puede agregar después para esa capa.
- **Los scripts se evalúan como globales, igual que en el navegador.** Los módulos no son ES modules; el arnés (`tests/js/helpers/pagina.js`) los carga en el mismo contexto y en el mismo orden que declaran los HTML, así que un error de orden de carga también se detecta.
- **Los defectos encontrados no se corrigieron.** Regla de `MEMORY.md`: ninguna inconsistencia se corrige sin acordarla antes.
