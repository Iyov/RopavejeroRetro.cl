"""Prepara las publicaciones de una venta online: fotos en 3:4 y texto de cada post.

Uso:
    python -E -P preparar_posts.py "<carpeta de fotos>" "<plan.json>" "<carpeta de salida>"

La carpeta de salida debe quedar dentro del repo (ej. .cache/venta): la herramienta
file_upload de Claude in Chrome solo sube archivos de ahí. .cache/ está en .gitignore.

plan.json es una lista de posts, en el orden en que se publican:

    [
      {"carpeta": "4499",
       "productos": [["4499", "College Football USA 96 (L)", "Genesis", 5]],
       "fotos": ["20261120_103729~2.jpg", "20261120_103906.jpg"]},
      {"carpeta": "portatiles", "titulo": "Portátiles Sueltos | 20/Nov/26",
       "productos": [["4506", "Jeopardy! (L)", "GameGear", 6], null,
                     ["4517", "Herbie Fully Loaded (L)", "GBA", 6]],
       "fotos": ["20261120_111120.jpg"]}
    ]

- Un post con un solo producto y sin "titulo" usa la línea del producto como título.
- Un post de grupo lleva "titulo" y la lista va en la descripción; null deja una
  línea en blanco (para separar plataformas).
- "siglas" es opcional: si falta, se deducen de los paréntesis y las plataformas.

Cada foto se convierte a 1080x1440 (3:4, lo más alto que Instagram muestra sin
recortar): se detecta el producto por sus bordes y se recorta un 3:4 con margen,
con el producto completo y al centro. Si no cabe, los costados se rellenan con el
mismo fondo difuminado. Las fotos se guardan como 01_..., 02_... (sin "~", que
file_upload rechaza) y el texto en caption.txt. Al final escribe resumen.txt con
todos los textos y contacto.jpg con todas las fotos preparadas, para revisarlas.
"""
import json
import os
import re
import sys

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageOps

LEYENDA = "[❌]: VENDIDO\n[R]: RESERVADO\n[✅]: DISPONIBLE"
HASHTAG = "#RopavejeroRetroWeb"
SIGLAS = {
    "CIB": "Caja, Juego, Manual", "CIB+": "Caja, Juego, Manual, Inserto(s)",
    "MM": "Sin Manual", "L": "Loose: Suelto: Solo Juego", "BL": "Black Label",
    "GH": "Greatest Hits", "PH": "Platinum Hits", "PC": "Players Choice",
    "C/M": "Con Mapa", "GotY": "Game of the Year", "S": "Sealed: Sellado de Fábrica",
    "CR": "Caja Repro", "PAL": "Europeo", "2D": "Dos Discos", "CE": "Collector's Edition",
    "M": "Manual", "WD": "Daño de Agua / Water Damaged", "SF": "Sun Fade / Daño Solar",
}
PLATAFORMAS = {
    "3DS": "Nintendo 3DS", "DS": "Nintendo DS", "GBA": "GameBoy Advance",
    "GBC": "GameBoy Color", "PS3": "PlayStation 3",
}


def bbox(imagen):
    """Caja aproximada del producto: filas y columnas con muchos bordes."""
    chica = imagen.convert("L")
    chica.thumbnail((400, 400))
    escala = imagen.width / chica.width
    a = np.asarray(chica.filter(ImageFilter.GaussianBlur(1.5)), dtype=float)
    g = np.hypot(np.diff(a, axis=0)[:, :-1], np.diff(a, axis=1)[:-1, :])
    m = g > max(6, np.percentile(g, 85))
    filas, cols = m.sum(1), m.sum(0)
    f = np.where(filas > 0.05 * filas.max())[0]
    c = np.where(cols > 0.05 * cols.max())[0]
    return [int(v * escala) for v in (c[0], f[0], c[-1], f[-1])]


def a_tres_cuartos(imagen):
    W, H = imagen.size
    CW, CH = int(max(W, H * 3 / 4)), int(max(H, W * 4 / 3))
    lienzo = imagen.resize((CW, CH)).filter(ImageFilter.GaussianBlur(60))
    ox, oy = (CW - W) // 2, (CH - H) // 2
    lienzo.paste(imagen, (ox, oy))
    x0, y0, x1, y1 = bbox(imagen)
    x0, x1, y0, y1 = x0 + ox, x1 + ox, y0 + oy, y1 + oy
    cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
    h = min(max((y1 - y0) * 1.2, (x1 - x0) * 1.2 * 4 / 3, CH * 0.45), CH)
    w = h * 3 / 4
    L = min(max(cx - w / 2, 0), CW - w)
    T = min(max(cy - h / 2, 0), CH - h)
    L = max(min(L, x0), x1 - w)   # nunca cortar el producto
    T = max(min(T, y0), y1 - h)
    L = min(max(L, 0), CW - w)
    T = min(max(T, 0), CH - h)
    return lienzo.crop((int(L), int(T), int(L + w), int(T + h))).resize((1080, 1440), Image.LANCZOS)


def linea(producto):
    id_, nombre, plataforma, precio = producto
    return f"[✅] {id_} {nombre} [{plataforma}] ${precio}K"


def siglas_de(productos):
    vistas = []
    for p in productos:
        if not p:
            continue
        for grupo in re.findall(r"\(([^)]*)\)", p[1]):
            for s in grupo.split("-"):
                s = s.strip()
                if s in SIGLAS and s not in vistas:
                    vistas.append(s)
        if p[2] in PLATAFORMAS and p[2] not in vistas:
            vistas.append(p[2])
    return vistas


def texto(post):
    productos = post["productos"]
    if post.get("titulo"):
        cuerpo = post["titulo"] + "\n" + "\n".join(linea(p) if p else "" for p in productos) + "\n\n"
    else:
        cuerpo = linea(productos[0]) + "\n\n"
    siglas = post.get("siglas") or siglas_de(productos)
    nota = ""
    if siglas:
        nota = "\n\nSiglas:\n" + "\n".join(f"{s}: {SIGLAS.get(s) or PLATAFORMAS[s]}" for s in siglas)
    return cuerpo + LEYENDA + nota + "\n\n" + HASHTAG


def main(origen, plan, destino):
    posts = json.load(open(plan, encoding="utf-8"))
    resumen, miniaturas = [], []
    for post in posts:
        carpeta = os.path.join(destino, post["carpeta"])
        os.makedirs(carpeta, exist_ok=True)
        for i, foto in enumerate(post["fotos"], 1):
            imagen = ImageOps.exif_transpose(Image.open(os.path.join(origen, foto))).convert("RGB")
            nombre = f"{i:02d}_{os.path.splitext(foto)[0].replace('~', '-')}.jpg"
            lista = a_tres_cuartos(imagen)
            lista.save(os.path.join(carpeta, nombre), quality=90)
            miniaturas.append((post["carpeta"], lista.resize((240, 320))))
        t = texto(post)
        open(os.path.join(carpeta, "caption.txt"), "w", encoding="utf-8").write(t)
        resumen.append(f"=== {post['carpeta']} ({len(post['fotos'])} fotos)\n{t}\n")
    open(os.path.join(destino, "resumen.txt"), "w", encoding="utf-8").write("\n".join(resumen))
    columnas = 10
    filas = (len(miniaturas) + columnas - 1) // columnas
    hoja = Image.new("RGB", (240 * columnas, 320 * filas), "black")
    dibujo = ImageDraw.Draw(hoja)
    try:
        fuente = ImageFont.truetype("arial.ttf", 26)
    except OSError:
        fuente = ImageFont.load_default()
    for i, (etiqueta, mini) in enumerate(miniaturas):
        x, y = (i % columnas) * 240, (i // columnas) * 320
        hoja.paste(mini, (x, y))
        dibujo.text((x + 6, y + 6), etiqueta, fill="red", font=fuente)
    hoja.save(os.path.join(destino, "contacto.jpg"), quality=80)
    print(f"{len(posts)} posts, {len(miniaturas)} fotos")


if __name__ == "__main__":
    main(*sys.argv[1:4])
