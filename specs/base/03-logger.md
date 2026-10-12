# 03 · Logs según ambiente

- **Código:** `js/modules/logger.js`
- **Tests:** `tests/js/cache-logger-siglas.test.js`

## Requisitos

- **LOG-001** — Fuera de `localhost` y `127.0.0.1`, `console.log` y `console.info` no escriben nada; `console.warn` y `console.error` siguen activos. Las funciones originales quedan en `window.__console_log_original` y `window.__console_info_original` para depurar.
- **LOG-002** — En `localhost` y `127.0.0.1` todos los niveles de log se mantienen activos.
