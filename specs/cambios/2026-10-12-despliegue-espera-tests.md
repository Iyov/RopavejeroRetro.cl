# El despliegue espera a los tests

- **Estado:** Entregado
- **Fecha:** 2026-10-12
- **Tipo:** Cambio de comportamiento (flujo de despliegue; no cambia el sitio)
- **Pendiente relacionado:** PEND-17 (acordado con Francisco el 2026-10-12)

## Problema

Los tests corren en cada push, pero el despliegue publica igual aunque fallen: un cambio roto llega al sitio y recién después alguien ve el aviso.

## Resultado esperado

Un push a `main` solo se publica si la suite completa pasa. Los posts que trae el bot de Instagram se siguen publicando sin depender de la suite.

## Requisitos

### Nuevos

- **SITE-020** — En un push a `main`, el despliegue corre la suite completa y publica solo si pasa. El despliegue lanzado a mano o por el bot de Instagram (`workflow_dispatch`) no corre la suite y publica directamente. La suite se define una sola vez, en `tests.yml`, que el despliegue reutiliza.

## Fuera de alcance

- Probar los commits del bot de Instagram antes de publicarlos: solo cambian datos de posts e imágenes, y `SITE-015` exige que su despliegue no se rompa.
- Proteger la rama `main` en GitHub (exigir pull request).

## Archivos que se tocan

- `.github/workflows/tests.yml` — pasa a ser reutilizable (`workflow_call`); deja de dispararse por push a `main`, porque ahí lo llama el despliegue. Sigue corriendo en pull requests y a mano.
- `.github/workflows/deploy-pages.yml` — job `tests` en los push, y `deploy` espera su resultado.

No son archivos del sitio: no hay bump de versión.

## Cómo se comprueba

- Test automático `SITE-020` en `tests/js/sitio.test.js`, sobre el contenido de los dos workflows.
- En GitHub, tras el push de este cambio: el workflow "Deploy to GitHub Pages" muestra el job de tests antes del de despliegue, y publica.

## Decisiones

- **Por qué el bot no se bloquea.** Si GitHub falla al instalar dependencias, o un test resulta inestable, los posts de Instagram dejarían de publicarse sin que nadie hubiera tocado el código. El bot solo regenera datos con un script que tiene sus propios tests.
- **Salida de emergencia.** Lanzar "Deploy to GitHub Pages" a mano desde la pestaña Actions publica sin correr la suite. Sirve si la suite queda en rojo por una causa ajena al sitio; la verificación de versión de caché se ejecuta igual.
- **Costo.** Cada push tarda alrededor de un minuto más en publicarse, lo que demora la suite.
