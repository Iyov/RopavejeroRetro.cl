"""Tests de api/bump_version.py. Spec: specs/base/15-version-cache.md"""
import re
import subprocess
import sys
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "api"))

import bump_version


def make_site(tmp_path, html_version="2026-10-12_1", sw_version="2026-10-12_1"):
    (tmp_path / "js" / "modules").mkdir(parents=True)
    (tmp_path / "index.html").write_text(
        f'<link href="css/index.min.css?v={html_version}">\n'
        f"<script>s.src = 'js/instagram_posts.min.js?v={html_version}';</script>\n"
        '<img src="https://example.com/a.png?v=5b2a2d37">\n',
        encoding="utf-8",
    )
    (tmp_path / "js" / "modules" / "siglas.js").write_text(
        f"fetch('js/siglas.json?v={html_version}');\n", encoding="utf-8"
    )
    (tmp_path / "service-worker.js").write_text(
        f"const CACHE_VERSION = 'ropavejero-v{sw_version}';\n", encoding="utf-8"
    )
    return str(tmp_path)


def run_cli(*args, cwd=ROOT):
    return subprocess.run(
        [sys.executable, str(ROOT / "api" / "bump_version.py"), *args],
        cwd=cwd, capture_output=True, text=True, encoding="utf-8",
    )


def test_same_day_increments_the_counter():
    """[VER-001] El mismo día, el correlativo sube en uno."""
    assert bump_version.next_version("2026-10-12_1", today="2026-10-12") == "2026-10-12_2"
    assert bump_version.next_version("2026-10-12_9", today="2026-10-12") == "2026-10-12_10"


def test_new_day_restarts_at_one():
    """[VER-002] Un día nuevo parte en _1."""
    assert bump_version.next_version("2026-10-12_7", today="2026-10-13") == "2026-10-13_1"


def test_old_timestamp_scheme_is_replaced():
    """[VER-003] Una versión del esquema antiguo o inválida se reemplaza por la de hoy."""
    assert bump_version.next_version("2026-10-04_1605", today="2026-10-12") == "2026-10-12_1"
    assert bump_version.next_version("v1.0.6", today="2026-10-12") == "2026-10-12_1"
    assert bump_version.next_version(None, today="2026-10-12") == "2026-10-12_1"
    assert bump_version.next_version("", today="2026-10-12") == "2026-10-12_1"


def test_version_never_goes_backwards():
    """[VER-004] La versión nunca retrocede aunque la fecha local sea anterior."""
    assert bump_version.next_version("2026-10-13_2", today="2026-10-12") == "2026-10-13_3"


def test_bump_updates_every_reference(tmp_path):
    """[VER-005] bump() escribe la versión nueva en todos los ?v= locales y en CACHE_VERSION."""
    root = make_site(tmp_path)

    new_version = bump_version.bump(root, today="2026-10-12")

    assert new_version == "2026-10-12_2"
    assert bump_version.current_version(root) == "2026-10-12_2"
    assert (tmp_path / "index.html").read_text(encoding="utf-8").count("?v=2026-10-12_2") == 2
    assert "?v=2026-10-12_2" in (tmp_path / "js" / "modules" / "siglas.js").read_text(encoding="utf-8")
    assert "?v=5b2a2d37" in (tmp_path / "index.html").read_text(encoding="utf-8")
    assert bump_version.check(root) == []


def test_bump_twice_keeps_everything_consistent(tmp_path):
    """[VER-005] Dos bumps seguidos dejan una sola versión en todo el sitio."""
    root = make_site(tmp_path)

    bump_version.bump(root, today="2026-10-12")
    assert bump_version.bump(root, today="2026-10-12") == "2026-10-12_3"
    assert bump_version.bump(root, today="2026-10-14") == "2026-10-14_1"

    assert "2026-10-12" not in (tmp_path / "index.html").read_text(encoding="utf-8")
    assert bump_version.check(root) == []


def test_bump_preserves_line_endings(tmp_path):
    """[VER-006] El bump no altera los saltos de línea ni el resto del contenido."""
    root = make_site(tmp_path)
    crlf = b'<link href="css/a.css?v=2026-10-12_1">\r\n<p>\xc3\xa1rbol</p>\r\n'
    (tmp_path / "productos.html").write_bytes(crlf)

    bump_version.bump(root, today="2026-10-12")

    assert (tmp_path / "productos.html").read_bytes() == crlf.replace(b"_1", b"_2")


def test_check_reports_mismatched_and_missing_versions(tmp_path):
    """[VER-007] check() detecta versiones distintas a la actual y assets locales sin ?v=."""
    root = make_site(tmp_path, html_version="2026-08-17_1")
    (tmp_path / "old.html").write_text('<link href="css/app.css">\n', encoding="utf-8")

    problems = bump_version.check(root)

    assert any("?v=2026-08-17_1" in problem for problem in problems)
    assert any("css/app.css sin ?v=" in problem for problem in problems)


def test_check_reports_each_kind_of_unversioned_reference(tmp_path):
    """[VER-007] check() revisa <script>/<link>, fetch() de JSON y el registro del service worker."""
    root = make_site(tmp_path)
    (tmp_path / "404.html").write_text(
        '<script src="js/index.min.js"></script>\n'
        '<link rel="manifest" href="manifest.json">\n'
        "<script>navigator.serviceWorker.register('/service-worker.js', { scope: '/' });</script>\n"
        '<script src="https://www.googletagmanager.com/gtm.js"></script>\n'
        '<a href="#seccion">ancla</a><img src="img/logo.png">\n',
        encoding="utf-8",
    )
    (tmp_path / "js" / "modules" / "efemerides.js").write_text("fetch('js/efemerides.json');\n", encoding="utf-8")

    problems = bump_version.check(root)

    prefix = root.replace("\\", "/").rstrip("/") + "/"
    assert sorted(problem.replace(prefix, "") for problem in problems) == [
        "404.html: /service-worker.js sin ?v=",
        "404.html: js/index.min.js sin ?v=",
        "404.html: manifest.json sin ?v=",
        "js/modules/efemerides.js: js/efemerides.json sin ?v=",
    ]


def test_check_reports_invalid_cache_version(tmp_path):
    """[VER-007] check() avisa si CACHE_VERSION no sigue el esquema AAAA-MM-DD_N."""
    root = make_site(tmp_path, sw_version="1.0.6")

    assert any("CACHE_VERSION no sigue el esquema" in problem for problem in bump_version.check(root))


def test_the_real_site_uses_a_single_version():
    """[VER-008] El sitio real usa una sola versión de caché y ningún asset local queda sin ?v=."""
    assert bump_version.check(str(ROOT)) == []
    assert re.fullmatch(r"\d{4}-\d{2}-\d{2}_\d+", bump_version.current_version(str(ROOT)))


def test_target_files_cover_every_versioned_file_of_the_site():
    """[VER-009] Todo archivo servido que contiene ?v= versionado está en la lista que recorre el script."""
    covered = {Path(p).resolve() for p in bump_version.target_files(str(ROOT))}
    expected = {ROOT / name for name in ("index.html", "productos.html", "404.html", "old.html", "ps3.html",
                                         "security-policy.html", "security-acknowledgments.html",
                                         "js/index.js", "js/index.min.js", "js/seo-analytics.js",
                                         "js/modules/siglas.js", "js/modules/instagram.js", "js/modules/efemerides.js")}
    assert expected <= covered

    missing = []
    for pattern in ("*.html", "*.js", "*.json", "js/**/*.js", "js/**/*.json", "css/**/*.css"):
        for path in ROOT.glob(pattern):
            if "node_modules" in path.parts or path.name == "service-worker.js":
                continue
            if bump_version.QUERY_RE.search(path.read_text(encoding="utf-8", errors="ignore")) and path.resolve() not in covered:
                missing.append(str(path.relative_to(ROOT)))
    assert missing == [], "agregar estos archivos a target_files()"


def test_today_uses_the_date_format_of_the_scheme():
    """[VER-010] La fecha del esquema es AAAA-MM-DD (hora de Chile)."""
    assert re.fullmatch(r"\d{4}-\d{2}-\d{2}", bump_version.today_str())


def test_cli_show_and_check():
    """[VER-011] La línea de comandos muestra la versión y --check termina en 0 si todo es consistente."""
    show = run_cli("--show")
    assert show.returncode == 0
    assert show.stdout.strip() == bump_version.current_version(str(ROOT))

    check = run_cli("--check")
    assert check.returncode == 0, check.stdout
    assert "todo consistente" in check.stdout


def test_cli_check_fails_on_inconsistent_site(tmp_path):
    """[VER-011] --check termina en 1 y lista los problemas si algo no calza."""
    make_site(tmp_path, html_version="2026-08-17_1")

    result = run_cli("--check", cwd=tmp_path)

    assert result.returncode == 1
    assert "?v=2026-08-17_1" in result.stdout
    assert "con problemas" in result.stdout


def test_cli_bump(tmp_path):
    """[VER-011] Sin argumentos, la línea de comandos sube la versión e informa el cambio."""
    make_site(tmp_path, html_version="2020-01-01_4", sw_version="2020-01-01_4")

    result = run_cli(cwd=tmp_path)

    new_version = bump_version.current_version(str(tmp_path))
    assert result.returncode == 0
    assert result.stdout.strip() == f"2020-01-01_4 -> {new_version}"
    assert new_version == f"{bump_version.today_str()}_1"
    assert bump_version.check(str(tmp_path)) == []


def test_site_files_are_only_what_the_site_serves():
    """[VER-013] Solo cuentan como archivos del sitio los que se sirven: HTML de la raíz, CSS, JS, JSON, manifest y service worker."""
    names = [
        "index.html", "css/index.css", "js/modules/ui.js", "js/siglas.json", "manifest.json", "service-worker.js",
        "README.md", "docs/README.md", "api/bump_version.py", "tests/js/utils.test.js", "package.json",
        "sitemap.xml", ".github/workflows/deploy-pages.yml", "img/hero-400.webp", "specs/base/07-catalogo.md",
    ]

    assert bump_version.site_files(names) == [
        "index.html", "css/index.css", "js/modules/ui.js", "js/siglas.json", "manifest.json", "service-worker.js",
    ]


def test_site_change_without_bump_is_reported():
    """[VER-014] Modificar un archivo del sitio sin subir la versión se reporta."""
    problems = bump_version.missing_bump(["js/modules/ui.js", "README.md"], "2026-10-12_3", "2026-10-12_3")

    assert len(problems) == 1
    assert "js/modules/ui.js" in problems[0]


def test_site_change_with_bump_is_accepted():
    """[VER-014] Un cambio al sitio que sí sube la versión se acepta."""
    assert bump_version.missing_bump(["js/modules/ui.js"], "2026-10-12_3", "2026-10-12_4") == []


def test_docs_only_change_needs_no_bump():
    """[VER-014] Un cambio que no toca archivos del sitio (documentación, tests) no exige subir la versión."""
    assert bump_version.missing_bump(["README.md", "tests/js/a.test.js"], "2026-10-12_3", "2026-10-12_3") == []


def git(repo, *args):
    result = subprocess.run(
        ["git", "-c", "user.name=Test", "-c", "user.email=test@example.com", "-c", "core.hooksPath=", "-c", "commit.gpgsign=false", *args],
        cwd=repo, capture_output=True, text=True, encoding="utf-8",
    )
    assert result.returncode == 0, result.stderr
    return result.stdout.strip()


@pytest.fixture
def repo(tmp_path, monkeypatch):
    """Repositorio git temporal con el sitio mínimo ya commiteado."""
    make_site(tmp_path)
    git(tmp_path, "init", "--quiet")
    git(tmp_path, "add", ".")
    git(tmp_path, "commit", "--quiet", "-m", "inicial")
    monkeypatch.chdir(tmp_path)
    return tmp_path


def test_verify_staged_blocks_site_changes_without_bump(repo):
    """[VER-015] Antes de commitear se detecta si lo preparado modifica el sitio sin subir la versión."""
    assert bump_version.verify_staged() == []

    (repo / "README.md").write_text("solo documentación\n", encoding="utf-8")
    git(repo, "add", "README.md")
    assert bump_version.verify_staged() == []

    (repo / "js" / "modules" / "siglas.js").write_text("fetch('js/siglas.json?v=2026-10-12_1'); // cambio\n", encoding="utf-8")
    git(repo, "add", "js/modules/siglas.js")
    problems = bump_version.verify_staged()
    assert len(problems) == 1 and "js/modules/siglas.js" in problems[0]
    assert run_cli("--verify-staged", cwd=repo).returncode == 1

    bump_version.bump(".", today="2026-10-12")
    git(repo, "add", ".")
    assert bump_version.verify_staged() == []
    assert run_cli("--verify-staged", cwd=repo).returncode == 0


def test_verify_range_compares_two_commits(repo):
    """[VER-016] Antes de desplegar se detecta si entre dos commits cambió el sitio sin subir la versión."""
    base = git(repo, "rev-parse", "HEAD")

    (repo / "index.html").write_text((repo / "index.html").read_text(encoding="utf-8") + "<p>nuevo</p>\n", encoding="utf-8")
    git(repo, "commit", "--quiet", "-am", "cambio sin bump")
    sin_bump = git(repo, "rev-parse", "HEAD")
    assert len(bump_version.verify_range(base, sin_bump)) == 1
    assert run_cli("--verify", base, sin_bump, cwd=repo).returncode == 1

    bump_version.bump(".", today="2026-10-12")
    git(repo, "commit", "--quiet", "-am", "bump")
    con_bump = git(repo, "rev-parse", "HEAD")
    assert bump_version.verify_range(base, con_bump) == []
    assert run_cli("--verify", base, con_bump, cwd=repo).returncode == 0

    # Si no se puede leer el commit base, la verificación se omite en vez de bloquear el despliegue
    assert bump_version.verify_range("0" * 40, con_bump) == []


def test_version_is_enforced_before_commit_and_before_deploy():
    """[VER-017] El hook pre-commit y el despliegue ejecutan la verificación de versión."""
    hook = (ROOT / ".githooks" / "pre-commit").read_text(encoding="utf-8")
    deploy = (ROOT / ".github" / "workflows" / "deploy-pages.yml").read_text(encoding="utf-8")

    assert "bump_version.py --verify-staged" in hook
    assert "bump_version.py --check" in hook
    assert "bump_version.py --check" in deploy
    assert 'bump_version.py --verify "$BEFORE" "$GITHUB_SHA"' in deploy
    assert deploy.index("bump_version.py --check") < deploy.index("actions/deploy-pages")


def test_npm_scripts_point_to_the_script():
    """[VER-012] npm run bump y npm run check:version invocan a bump_version.py."""
    import json
    scripts = json.loads((ROOT / "package.json").read_text(encoding="utf-8"))["scripts"]

    assert scripts["bump"] == "python api/bump_version.py"
    assert scripts["check:version"] == "python api/bump_version.py --check"
