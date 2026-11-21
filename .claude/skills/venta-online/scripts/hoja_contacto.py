"""Arma hojas de contacto numeradas con las fotos de una venta, para revisarlas sin abrirlas una a una.

Uso:
    python -E -P hoja_contacto.py "<carpeta de fotos>" "<carpeta de salida>" [desde]

Toma los .jpg de la carpeta en orden de nombre (el nombre del celular es la hora:
20261120_103729.jpg) y guarda hojas de 12 fotos (hoja1.jpg, hoja2.jpg...), con la
orientación EXIF aplicada y una etiqueta "<n> <hora>" en cada miniatura. Con
"desde" (ej. 20261120_18) solo incluye las fotos cuyo nombre es igual o posterior:
sirve para revisar solo las fotos nuevas que Francisco agregó después.
"""
import os
import sys

from PIL import Image, ImageDraw, ImageFont, ImageOps

ANCHO, ALTO, COLUMNAS, FILAS = 390, 693, 4, 3


def main(origen, destino, desde=""):
    os.makedirs(destino, exist_ok=True)
    fotos = sorted(f for f in os.listdir(origen) if f.lower().endswith(".jpg") and f >= desde)
    try:
        fuente = ImageFont.truetype("arial.ttf", 30)
    except OSError:
        fuente = ImageFont.load_default()
    por_hoja = COLUMNAS * FILAS
    for inicio in range(0, len(fotos), por_hoja):
        hoja = Image.new("RGB", (ANCHO * COLUMNAS, ALTO * FILAS), "black")
        dibujo = ImageDraw.Draw(hoja)
        for i, nombre in enumerate(fotos[inicio:inicio + por_hoja]):
            imagen = ImageOps.exif_transpose(Image.open(os.path.join(origen, nombre)))
            imagen.thumbnail((ANCHO - 6, ALTO - 6))
            x, y = (i % COLUMNAS) * ANCHO, (i // COLUMNAS) * ALTO
            hoja.paste(imagen.convert("RGB"), (x + 3, y + 3))
            etiqueta = f"{inicio + i + 1} {os.path.splitext(nombre)[0].split('_', 1)[-1]}"
            dibujo.rectangle([x + 3, y + 3, x + 300, y + 42], fill="yellow")
            dibujo.text((x + 8, y + 6), etiqueta, fill="black", font=fuente)
        hoja.save(os.path.join(destino, f"hoja{inicio // por_hoja + 1}.jpg"), quality=80)
    print(f"{len(fotos)} fotos")


if __name__ == "__main__":
    main(*sys.argv[1:4])
