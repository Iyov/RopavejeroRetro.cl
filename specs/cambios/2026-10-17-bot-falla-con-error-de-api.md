# El bot de Instagram falla de forma visible ante un error de la API

- **Estado:** Entregado
- **Fecha:** 2026-10-17
- **Tipo:** Cambio de comportamiento

## Problema

El token de Instagram expiró el 2026-10-04 y el bot pasó 13 días sin traer posts sin que nadie se enterara. El script detecta el error y lo imprime, pero termina con código 0: cada ejecución del workflow sale en verde y GitHub no avisa. Además, si el error llega en una página posterior a la primera, el bot sigue con los posts que alcanzó a leer y borraría del sitio los que no leyó.

## Resultado esperado

Ante cualquier error de la API, o si falta el token, la ejecución del workflow queda fallida (en rojo) y GitHub manda el aviso de falla. El sitio no cambia: no se toca ningún archivo hasta que la API responda bien.

## Requisitos

### Nuevos

- **BOT-016** — Si falta `INSTAGRAM_TOKEN`, el bot avisa y termina con error, sin tocar ningún archivo.

### Modificados

- **BOT-003** — Ante un error de la API, en cualquier página, el bot se detiene sin tocar ningún archivo, avisa si el problema es el token y termina con error, para que la ejecución del workflow quede fallida. *(Antes: Ante un error de la API el bot se detiene, avisa si el problema es el token y no devuelve posts.)*

## Fuera de alcance

- Renovar el token: lo hace Francisco en Meta y en los secretos del repositorio.
- Renovar el token de forma automática antes de que expire.
- Notificaciones por otro canal que no sea el aviso de falla de GitHub.

## Archivos que se tocan

- `api/update_instagram.py` — `fetch_instagram_media()` lanza `InstagramAPIError` en vez de devolver una lista vacía o parcial; `main()` devuelve el código de salida.
- `tests/test_update_instagram.py` — tests de `BOT-003` y `BOT-016`.

No toca archivos del sitio, así que no lleva bump de versión.

## Cómo se comprueba

- `tests/test_update_instagram.py`: error en la primera página y en una página posterior (token expirado, error genérico y respuesta no JSON), `main()` con error de API y sin token devuelve un código distinto de 0 y no llama a `update_files()`, y con la API respondiendo bien devuelve 0.
- En GitHub: la siguiente ejecución programada con el token vencido debe quedar en rojo.

## Decisiones

- Se detiene ante cualquier error de la API, no solo el del token: un error genérico también deja al sitio sin posts nuevos y conviene saberlo. Si GitHub o Instagram fallan de forma pasajera, la ejecución siguiente (12 horas después) lo vuelve a intentar.
- El paso de commit del workflow no se ejecuta cuando el script falla, que es el comportamiento por defecto de GitHub Actions; no hace falta cambiar el workflow.
