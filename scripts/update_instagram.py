import os
import json
import requests
import re
from datetime import datetime

# CONFIGURACIÓN
ACCESS_TOKEN = os.getenv('INSTAGRAM_TOKEN')
HASHTAG_FILTER = '#RopavejeroRetroWeb'
JS_FILE_PATH = 'js/instagram_posts.js'
IMAGE_DIR = 'img/'

def fetch_instagram_media():
    """Obtiene los posts recientes del usuario."""
    url = f"https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,timestamp&access_token={ACCESS_TOKEN}"
    response = requests.get(url)
    if response.status_code != 200:
        print(f"Error al conectar con Instagram: {response.text}")
        return []
    return response.json().get('data', [])

def download_image(url, post_id):
    """Descarga la imagen si no existe localmente."""
    img_name = f"IG_{post_id}.jpeg"
    img_path = os.path.join(IMAGE_DIR, img_name)
    
    if not os.path.exists(img_path):
        response = requests.get(url)
        if response.status_code == 200:
            with open(img_path, 'wb') as f:
                f.write(response.content)
            print(f"Imagen descargada: {img_name}")
        else:
            print(f"Error al descargar imagen {post_id}")
    return img_name

def process_posts(media_list):
    """Filtra y procesa los posts con el hashtag especificado."""
    selected_posts = []
    for post in media_list:
        caption = post.get('caption', '')
        if HASHTAG_FILTER.lower() in caption.lower():
            # Limpiar el hashtag del texto
            clean_caption = caption.replace(HASHTAG_FILTER, '').replace(HASHTAG_FILTER.lower(), '').strip()
            
            # Dividir en título (primera línea) y descripción (resto)
            lines = clean_caption.split('\n', 1)
            title = lines[0] if lines else "Nuevo Post"
            description = lines[1] if len(lines) > 1 else ""
            
            # Formatear fecha
            date_str = post['timestamp'][:10] # YYYY-MM-DD
            
            # Descargar imagen
            img_filename = download_image(post['media_url'], post['id'])
            
            selected_posts.append({
                'id': f"ig_auto_{post['id']}",
                'image': f"img/{img_filename}",
                'title': title,
                'description': description,
                'link': post['permalink'],
                'media_type': post['media_type'],
                'date': date_str
            })
    return selected_posts

def update_js_file(new_posts):
    """Actualiza el archivo js/instagram_posts.js con los nuevos datos."""
    if not new_posts:
        print("No se encontraron posts nuevos con el hashtag.")
        return

    # Leer el archivo actual para no perder lo que ya hay (opcional)
    # Por ahora vamos a REEMPLAZAR con los de Instagram que tengan el hashtag
    # o podrías mezclarlos si quisieras.
    
    content = "// ========== DATOS DE POSTS DE INSTAGRAM AUTOMATIZADOS ==========\n"
    content += f"// Última actualización: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n"
    content += "const INSTAGRAM_POSTS_DATA = " + json.dumps(new_posts, indent=4, ensure_ascii=False) + ";\n\n"
    content += "// Función para obtener los posts de Instagram\n"
    content += "function getInstagramPostsData() {\n    return INSTAGRAM_POSTS_DATA;\n}"

    with open(JS_FILE_PATH, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Archivo {JS_FILE_PATH} actualizado con {len(new_posts)} posts.")

if __name__ == "__main__":
    if not ACCESS_TOKEN:
        print("Error: No se encontró INSTAGRAM_TOKEN en las variables de entorno.")
    else:
        media = fetch_instagram_media()
        processed = process_posts(media)
        update_js_file(processed)
