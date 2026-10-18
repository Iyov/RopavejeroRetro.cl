"""Recorta una zona de la foto original (a resolución completa) para leer una etiqueta dudosa.

Uso:
    python -E -P recortar.py "<foto original>" "<salida.jpg>" x0,y0,x1,y1

Las coordenadas son fracciones del ancho y alto (0 a 1), después de aplicar la
orientación EXIF. Ejemplo: 0.6,0.55,0.9,0.7
"""
import sys

from PIL import Image, ImageOps


def main(origen, salida, caja):
    imagen = ImageOps.exif_transpose(Image.open(origen))
    ancho, alto = imagen.size
    x0, y0, x1, y1 = (float(v) for v in caja.split(","))
    recorte = imagen.crop((int(x0 * ancho), int(y0 * alto), int(x1 * ancho), int(y1 * alto)))
    recorte.save(salida, quality=90)


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2], sys.argv[3])
