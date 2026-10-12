"""Tests de api/update_instagram.py. Spec: specs/base/16-bot-instagram.md

Ningún test usa la red ni el token real: las llamadas a Instagram se simulan y los
archivos se escriben en un directorio temporal.
"""
import importlib.util
import io
import json
import re
import sys
from pathlib import Path

import pytest
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

spec = importlib.util.spec_from_file_location("update_instagram", ROOT / "api" / "update_instagram.py")
update_instagram = importlib.util.module_from_spec(spec)
spec.loader.exec_module(update_instagram)

HASHTAG = "#RopavejeroRetroWeb"


class FakeResponse:
    def __init__(self, payload=None, status_code=200, content=b"", content_type="application/json"):
        self._payload = payload
        self.status_code = status_code
        self.content = content
        self.headers = {"content-type": content_type}
        self.text = json.dumps(payload) if payload is not None else ""

    def json(self):
        return self._payload


def media(post_id, caption, media_type="IMAGE", **extra):
    return {
        "id": post_id,
        "caption": caption,
        "media_type": media_type,
        "media_url": f"https://cdn.example/{post_id}.jpg",
        "permalink": f"https://www.instagram.com/p/{post_id}/",
        "timestamp": "2026-10-12T15:30:00+0000",
        "like_count": 5,
        **extra,
    }


def post(post_id, title="Título", likes=1, description="Descripción"):
    return {
        "id": f"ig_auto_{post_id}",
        "image": f"img/IG_{post_id}.jpeg",
        "title": title,
        "description": description,
        "link": f"https://www.instagram.com/p/{post_id}/",
        "media_type": "IMAGE",
        "date": "2026-10-12",
        "likes": likes,
    }


def jpeg_bytes(width, height):
    buffer = io.BytesIO()
    Image.new("RGB", (width, height), (200, 30, 30)).save(buffer, "JPEG")
    return buffer.getvalue()


@pytest.fixture(autouse=True)
def fake_token(monkeypatch):
    """El módulo lee el token real de .env al importarse: los tests usan siempre uno de prueba."""
    monkeypatch.setattr(update_instagram, "ACCESS_TOKEN", "token-de-prueba")


@pytest.fixture
def no_network(monkeypatch):
    """Cualquier acceso real a la red hace fallar el test."""
    def blocked(*args, **kwargs):
        raise AssertionError(f"acceso a la red no simulado: {args}")
    monkeypatch.setattr(update_instagram.requests, "get", blocked)


@pytest.fixture
def site(tmp_path, monkeypatch, no_network):
    """Copia mínima del sitio en un directorio temporal, usada como directorio de trabajo."""
    (tmp_path / "js" / "modules").mkdir(parents=True)
    (tmp_path / "img").mkdir()
    (tmp_path / "index.html").write_text(
        "<script>s.src = 'js/instagram_posts.min.js?v=2020-01-01_1';</script>\n", encoding="utf-8")
    (tmp_path / "service-worker.js").write_text(
        "const CACHE_VERSION = 'ropavejero-v2020-01-01_1';\n"
        "const STATIC_RESOURCES = [\n    '/',\n    '/index.html'\n];\n\n"
        "const INSTAGRAM_IMAGES = [\n    '/img/IG_viejo.jpeg'\n];\n\n"
        "const EXCLUDED_URLS = [\n    'docs.google.com'\n];\n",
        encoding="utf-8",
    )
    monkeypatch.chdir(tmp_path)
    return tmp_path


def create_images(site, post_id):
    for suffix in (".jpeg", "-400.webp", "-800.webp", "-1200.webp"):
        (site / "img" / f"IG_{post_id}{suffix}").write_bytes(b"x")


# ---------- Errores de la API ----------

def test_detects_expired_instagram_token():
    """[BOT-001] Un OAuthException con código 190 se reconoce como token expirado."""
    payload = {
        "error": {
            "message": "Error validating access token: Session has expired on Friday, 10-Jul-26 15:28:44 PDT.",
            "type": "OAuthException",
            "code": 190,
        }
    }

    result = update_instagram.detect_instagram_error(payload)

    assert result["is_expired_token"] is True
    assert "token" in result["message"].lower()


def test_classifies_other_instagram_errors():
    """[BOT-001] Los errores que mencionan el token se tratan como token inválido; el resto, como error genérico."""
    by_message = update_instagram.detect_instagram_error({"error": {"message": "Invalid OAuth access token.", "code": 100}})
    assert by_message == {"is_expired_token": True, "message": "Invalid OAuth access token."}

    rate_limit = update_instagram.detect_instagram_error({"error": {"message": "Application request limit reached", "code": 4}})
    assert rate_limit == {"is_expired_token": False, "message": "Application request limit reached"}

    for empty in ({}, {"error": {}}, None, "texto", []):
        assert update_instagram.detect_instagram_error(empty) == {
            "is_expired_token": False, "message": "Error inesperado al consultar Instagram."}


# ---------- Descarga de posts ----------

def test_fetch_follows_pagination(monkeypatch):
    """[BOT-002] Los posts se piden a la Graph API siguiendo la paginación hasta el final."""
    pages = {
        "first": FakeResponse({"data": [{"id": "1"}, {"id": "2"}], "paging": {"next": "https://graph.instagram.com/next"}}),
        "https://graph.instagram.com/next": FakeResponse({"data": [{"id": "3"}]}),
    }
    requested = []

    def fake_get(url):
        requested.append(url)
        return pages["first"] if len(requested) == 1 else pages[url]

    monkeypatch.setattr(update_instagram.requests, "get", fake_get)

    result = update_instagram.fetch_instagram_media()

    assert [item["id"] for item in result] == ["1", "2", "3"]
    assert len(requested) == 2
    assert requested[0].startswith("https://graph.instagram.com/me/media?fields=")
    assert "children{media_url,media_type}" in requested[0]
    assert "access_token=token-de-prueba" in requested[0]


def test_fetch_respects_the_post_limit(monkeypatch):
    """[BOT-002] Nunca se devuelven más posts que el máximo configurado."""
    page = FakeResponse({"data": [{"id": str(i)} for i in range(4)], "paging": {"next": "https://graph.instagram.com/next"}})
    calls = []
    monkeypatch.setattr(update_instagram.requests, "get", lambda url: calls.append(url) or page)
    monkeypatch.setattr(update_instagram, "MAX_POSTS", 6)

    assert len(update_instagram.fetch_instagram_media()) == 6
    assert len(calls) == 2


def test_fetch_stops_on_api_errors(monkeypatch, capsys):
    """[BOT-003] Ante un error de la API se detiene, avisa si es el token y no devuelve posts."""
    expired = {"error": {"message": "Session has expired", "type": "OAuthException", "code": 190}}

    monkeypatch.setattr(update_instagram.requests, "get", lambda url: FakeResponse(expired, status_code=400))
    assert update_instagram.fetch_instagram_media() == []
    assert "El token de Instagram ha expirado" in capsys.readouterr().out

    monkeypatch.setattr(update_instagram.requests, "get", lambda url: FakeResponse(expired, status_code=200))
    assert update_instagram.fetch_instagram_media() == []
    assert "El token de Instagram ha expirado" in capsys.readouterr().out

    html_error = FakeResponse(None, status_code=502, content_type="text/html")
    monkeypatch.setattr(update_instagram.requests, "get", lambda url: html_error)
    assert update_instagram.fetch_instagram_media() == []
    assert "Error al conectar con Instagram" in capsys.readouterr().out


# ---------- Selección y transformación de posts ----------

@pytest.fixture
def fake_download(monkeypatch):
    downloaded = []

    def fake(url, post_id):
        downloaded.append((url, post_id))
        return f"IG_{post_id}.jpeg"

    monkeypatch.setattr(update_instagram, "download_image", fake)
    return downloaded


def test_only_posts_with_the_hashtag_are_published(fake_download):
    """[BOT-004] Solo se publican los posts que llevan #RopavejeroRetroWeb, sin distinguir mayúsculas."""
    result = update_instagram.process_posts([
        media("1", f"Con hashtag {HASHTAG}"),
        media("2", "Sin hashtag #OtroHashtag"),
        media("3", "En minúsculas #ropavejeroretroweb"),
        {"id": "4", "media_type": "IMAGE"},
    ])

    assert [p["id"] for p in result] == ["ig_auto_1", "ig_auto_3"]
    assert [post_id for _, post_id in fake_download] == ["1", "3"]


def test_post_fields_are_built_from_the_caption(fake_download):
    """[BOT-005] La primera línea del caption es el título, el resto la descripción, y el hashtag se quita."""
    [result] = update_instagram.process_posts([
        media("77", f"[PS1] Juegos nuevos\nLlegaron hoy\nSegunda línea\n{HASHTAG}"),
    ])

    assert result == {
        "id": "ig_auto_77",
        "image": "img/IG_77.jpeg",
        "title": "[PS1] Juegos nuevos",
        "description": "Llegaron hoy\nSegunda línea",
        "link": "https://www.instagram.com/p/77/",
        "media_type": "IMAGE",
        "date": "2026-10-12",
        "likes": 5,
    }

    [single_line] = update_instagram.process_posts([media("78", f"Solo título {HASHTAG}", like_count=None)])
    assert (single_line["title"], single_line["description"]) == ("Solo título", "")

    without_likes = media("79", f"Sin likes {HASHTAG}")
    del without_likes["like_count"]
    assert update_instagram.process_posts([without_likes])[0]["likes"] == 0


def test_videos_are_skipped_and_carousels_use_their_first_image(fake_download):
    """[BOT-006] Los videos se omiten; de un carrusel se usa la primera imagen, y se omite si no tiene."""
    carousel = media("10", f"Carrusel {HASHTAG}", "CAROUSEL_ALBUM", children={"data": [
        {"media_type": "VIDEO", "media_url": "https://cdn.example/video.mp4"},
        {"media_type": "IMAGE", "media_url": "https://cdn.example/primera.jpg"},
        {"media_type": "IMAGE", "media_url": "https://cdn.example/segunda.jpg"},
    ]})
    only_videos = media("11", f"Carrusel de videos {HASHTAG}", "CAROUSEL_ALBUM",
                        children={"data": [{"media_type": "VIDEO", "media_url": "https://cdn.example/v.mp4"}]})
    empty_carousel = media("12", f"Carrusel vacío {HASHTAG}", "CAROUSEL_ALBUM")
    video = media("13", f"Video {HASHTAG}", "VIDEO")

    result = update_instagram.process_posts([carousel, only_videos, empty_carousel, video])

    assert [(p["id"], p["media_type"]) for p in result] == [("ig_auto_10", "CAROUSEL_ALBUM")]
    assert fake_download == [("https://cdn.example/primera.jpg", "10")]


# ---------- Imágenes ----------

def test_download_creates_jpeg_and_responsive_webp_variants(site, monkeypatch):
    """[BOT-007] Cada imagen se guarda como JPEG y en variantes WebP de 400, 800 y 1200 px de ancho."""
    calls = []
    monkeypatch.setattr(update_instagram.requests, "get",
                        lambda url: calls.append(url) or FakeResponse(content=jpeg_bytes(1600, 1200)))

    assert update_instagram.download_image("https://cdn.example/a.jpg", "500") == "IG_500.jpeg"

    assert sorted(p.name for p in (site / "img").iterdir()) == [
        "IG_500-1200.webp", "IG_500-400.webp", "IG_500-800.webp", "IG_500.jpeg"]
    with Image.open(site / "img" / "IG_500.jpeg") as original:
        assert original.format == "JPEG" and original.size == (1600, 1200)
    for width in (400, 800, 1200):
        with Image.open(site / "img" / f"IG_500-{width}.webp") as variant:
            assert variant.format == "WEBP"
            assert variant.size == (width, width * 3 // 4), "conserva la proporción"

    # Si ya existen todas las variantes no se vuelve a descargar
    assert update_instagram.download_image("https://cdn.example/a.jpg", "500") == "IG_500.jpeg"
    assert len(calls) == 1


def test_small_images_are_not_upscaled(site, monkeypatch):
    """[BOT-007] Una imagen más angosta que la variante no se agranda."""
    monkeypatch.setattr(update_instagram.requests, "get", lambda url: FakeResponse(content=jpeg_bytes(600, 600)))

    update_instagram.download_image("https://cdn.example/b.jpg", "501")

    sizes = {}
    for width in (400, 800, 1200):
        with Image.open(site / "img" / f"IG_501-{width}.webp") as variant:
            sizes[width] = variant.size
    assert sizes == {400: (400, 400), 800: (600, 600), 1200: (600, 600)}


def test_failed_download_leaves_no_files(site, monkeypatch):
    """[BOT-007] Si la descarga falla no queda ningún archivo a medias."""
    monkeypatch.setattr(update_instagram.requests, "get", lambda url: FakeResponse(status_code=404))

    update_instagram.download_image("https://cdn.example/no.jpg", "502")

    assert list((site / "img").iterdir()) == []


def test_images_of_removed_posts_are_deleted(site):
    """[BOT-008] Al desaparecer un post se borran sus cuatro imágenes y no las de los demás."""
    for post_id in ("1", "2", "3"):
        create_images(site, post_id)
    (site / "img" / "RopavejeroLogo_256.png").write_bytes(b"x")

    removed = update_instagram.cleanup_removed_images([post("1"), post("2"), post("3")], [post("2")])

    assert removed == 8
    assert sorted(p.name for p in (site / "img").iterdir()) == [
        "IG_2-1200.webp", "IG_2-400.webp", "IG_2-800.webp", "IG_2.jpeg", "RopavejeroLogo_256.png"]
    assert update_instagram.cleanup_removed_images([post("2")], [post("2")]) == 0


# ---------- Detección de cambios ----------

def test_change_detection():
    """[BOT-009] Hay cambios si se agregan, quitan o modifican posts (incluidos los likes); el orden no importa."""
    base = [post("1"), post("2")]

    assert update_instagram.posts_have_changed(base, [post("1"), post("2")]) is False
    assert update_instagram.posts_have_changed(base, [post("2"), post("1")]) is False
    assert update_instagram.posts_have_changed(base, [post("1")]) is True
    assert update_instagram.posts_have_changed(base, [post("1"), post("3")]) is True
    assert update_instagram.posts_have_changed(base, [post("1"), post("2", likes=99)]) is True
    assert update_instagram.posts_have_changed(base, [post("1"), post("2", title="Otro")]) is True
    assert update_instagram.posts_have_changed(base, [post("1"), post("2", description="Otra")]) is True
    assert update_instagram.posts_have_changed([], []) is False


def test_change_statistics():
    """[BOT-009] Se cuentan por separado los posts agregados, modificados y eliminados."""
    old = [post("1"), post("2"), post("3")]
    new = [post("1"), post("2", likes=50), post("4"), post("5")]

    assert update_instagram.calculate_changes(old, new) == (2, 1, 1)
    assert update_instagram.calculate_changes(old, old) == (0, 0, 0)
    assert update_instagram.calculate_changes([], new) == (4, 0, 0)


# ---------- Publicación ----------

def test_nothing_is_written_without_posts(site):
    """[BOT-010] Si no llega ningún post con el hashtag no se toca ningún archivo."""
    before = (site / "service-worker.js").read_text(encoding="utf-8")

    update_instagram.update_files([])

    assert not (site / "js" / "instagram_posts.js").exists()
    assert not (site / "commit_message.txt").exists()
    assert (site / "service-worker.js").read_text(encoding="utf-8") == before


def test_publishing_writes_data_precache_version_and_commit_message(site):
    """[BOT-011] Con cambios se regeneran los datos, el precache de imágenes, la versión de caché y el mensaje de commit."""
    posts = [post("1", title='Con "comillas" y ñ'), post("2")]

    update_instagram.update_files(posts)

    # Datos legibles por el propio script y con la forma que consume el sitio
    assert update_instagram.load_existing_posts() == posts
    source = (site / "js" / "instagram_posts.js").read_text(encoding="utf-8")
    assert source.rstrip().endswith("function getInstagramPostsData() {\n    return INSTAGRAM_POSTS_DATA;\n}")
    assert "ñ" in source, "el texto se guarda sin escapar a \\uXXXX"

    minified = (site / "js" / "instagram_posts.min.js").read_text(encoding="utf-8")
    match = re.fullmatch(r"const INSTAGRAM_POSTS_DATA=(\[.*\]);function getInstagramPostsData\(\)\{return INSTAGRAM_POSTS_DATA\}", minified, re.DOTALL)
    assert match and json.loads(match.group(1)) == posts

    # Service worker: lista de imágenes regenerada, el resto intacto, versión nueva
    sw = (site / "service-worker.js").read_text(encoding="utf-8")
    assert ("const INSTAGRAM_IMAGES = [\n"
            "    '/img/IG_1.jpeg',\n    '/img/IG_1-400.webp',\n    '/img/IG_1-800.webp',\n    '/img/IG_1-1200.webp',\n"
            "    '/img/IG_2.jpeg',\n    '/img/IG_2-400.webp',\n    '/img/IG_2-800.webp',\n    '/img/IG_2-1200.webp'\n];") in sw
    assert "IG_viejo" not in sw
    assert "const STATIC_RESOURCES = [\n    '/',\n    '/index.html'\n];" in sw
    assert "const EXCLUDED_URLS = [\n    'docs.google.com'\n];" in sw

    version = update_instagram.bump_version.current_version(".")
    assert version == f"{update_instagram.bump_version.today_str()}_1"
    assert f"instagram_posts.min.js?v={version}" in (site / "index.html").read_text(encoding="utf-8")
    assert update_instagram.bump_version.check(".") == []

    assert (site / "commit_message.txt").read_text(encoding="utf-8") == "Se agregaron 2 posts desde Instagram"


def test_running_again_without_changes_touches_nothing(site):
    """[BOT-012] Si los posts no cambiaron no se reescribe nada ni se sube la versión."""
    posts = [post("1"), post("2")]
    update_instagram.update_files(posts)
    (site / "commit_message.txt").write_text("mensaje anterior", encoding="utf-8")
    snapshot = {path: path.read_bytes() for path in site.rglob("*") if path.is_file()}

    update_instagram.update_files([post("2"), post("1")])

    assert {path: path.read_bytes() for path in site.rglob("*") if path.is_file()} == snapshot


def test_commit_message_describes_each_kind_of_change(site):
    """[BOT-013] El mensaje de commit resume agregados, modificados y eliminados, y se limpian las imágenes huérfanas."""
    update_instagram.update_files([post("1"), post("2"), post("3")])
    for post_id in ("1", "2", "3"):
        create_images(site, post_id)
    first_version = update_instagram.bump_version.current_version(".")

    update_instagram.update_files([post("1"), post("2", likes=40), post("4")])

    assert (site / "commit_message.txt").read_text(encoding="utf-8") == (
        "Se agregaron 1 post, modificaron 1 post, eliminaron 1 post (imágenes limpiadas) desde Instagram")
    assert not (site / "img" / "IG_3.jpeg").exists()
    assert (site / "img" / "IG_2-800.webp").exists()
    assert "IG_3" not in (site / "service-worker.js").read_text(encoding="utf-8")
    assert update_instagram.bump_version.current_version(".") != first_version

    update_instagram.update_files([post("1"), post("2", likes=41), post("4", likes=2)])
    assert (site / "commit_message.txt").read_text(encoding="utf-8") == "Se modificaron 2 posts desde Instagram"


def test_existing_posts_are_read_from_the_published_file(site):
    """[BOT-014] Los posts ya publicados se leen desde js/instagram_posts.js; si falta o está dañado, se asume vacío."""
    assert update_instagram.load_existing_posts() == []

    (site / "js" / "instagram_posts.js").write_text("const INSTAGRAM_POSTS_DATA = [ esto no es json ];", encoding="utf-8")
    assert update_instagram.load_existing_posts() == []

    (site / "js" / "instagram_posts.js").write_text("// sin datos", encoding="utf-8")
    assert update_instagram.load_existing_posts() == []


def test_the_real_published_file_is_readable_by_the_bot(monkeypatch):
    """[BOT-014] El archivo real js/instagram_posts.js es legible por el bot."""
    monkeypatch.chdir(ROOT)

    posts = update_instagram.load_existing_posts()

    assert len(posts) > 0
    assert all(p["id"].startswith("ig_auto_") for p in posts)


def test_real_service_worker_has_the_lines_the_scripts_rewrite():
    """[BOT-015] service-worker.js conserva la forma exacta de las líneas que los scripts editan con regex."""
    sw = (ROOT / "service-worker.js").read_text(encoding="utf-8")

    assert len(re.findall(r"const CACHE_VERSION = 'ropavejero-v[^']+';", sw)) == 1
    assert len(re.findall(r"const INSTAGRAM_IMAGES = \[.*?\];", sw, flags=re.DOTALL)) == 1
    assert update_instagram.HASHTAG_FILTER == HASHTAG
    assert (update_instagram.JS_FILE_PATH, update_instagram.MIN_JS_FILE_PATH, update_instagram.SW_FILE_PATH) == (
        "js/instagram_posts.js", "js/instagram_posts.min.js", "service-worker.js")
