"""Reduce las fotos de ventas de una feria para leerlas sin cargar imágenes de 12 MP.

Uso:
    python -E -P reducir_fotos.py "<carpeta de la feria>" "<carpeta de salida>"

Recorre solo las subcarpetas de vendedores (las que no empiezan con "_", hoy
"Fco" e "Ivette") y guarda cada foto como "<Vendedor>_<archivo>.jpg", con el
lado mayor en 1600 px y la orientación EXIF ya aplicada.
"""
import os
import sys

from PIL import Image, ImageOps

EXTENSIONES = (".jpg", ".jpeg", ".png", ".webp")


def main(origen, destino):
    os.makedirs(destino, exist_ok=True)
    for vendedor in sorted(os.listdir(origen)):
        carpeta = os.path.join(origen, vendedor)
        if not os.path.isdir(carpeta) or vendedor.startswith("_"):
            continue
        for archivo in sorted(os.listdir(carpeta)):
            if not archivo.lower().endswith(EXTENSIONES):
                continue
            imagen = ImageOps.exif_transpose(Image.open(os.path.join(carpeta, archivo)))
            imagen.thumbnail((1600, 1600))
            nombre = f"{vendedor}_{os.path.splitext(archivo)[0]}.jpg"
            imagen.convert("RGB").save(os.path.join(destino, nombre), quality=85)
            print(vendedor, archivo, imagen.size)


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
