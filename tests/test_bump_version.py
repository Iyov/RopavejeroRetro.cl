import sys
from pathlib import Path

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


def test_same_day_increments_the_counter():
    assert bump_version.next_version("2026-10-12_1", today="2026-10-12") == "2026-10-12_2"
    assert bump_version.next_version("2026-10-12_9", today="2026-10-12") == "2026-10-12_10"


def test_new_day_restarts_at_one():
    assert bump_version.next_version("2026-10-12_7", today="2026-10-13") == "2026-10-13_1"


def test_old_timestamp_scheme_is_replaced():
    assert bump_version.next_version("2026-10-04_1605", today="2026-10-12") == "2026-10-12_1"


def test_version_never_goes_backwards():
    assert bump_version.next_version("2026-10-13_2", today="2026-10-12") == "2026-10-13_3"


def test_bump_updates_every_reference(tmp_path):
    root = make_site(tmp_path)

    new_version = bump_version.bump(root, today="2026-10-12")

    assert new_version == "2026-10-12_2"
    assert bump_version.current_version(root) == "2026-10-12_2"
    assert (tmp_path / "index.html").read_text(encoding="utf-8").count("?v=2026-10-12_2") == 2
    assert "?v=2026-10-12_2" in (tmp_path / "js" / "modules" / "siglas.js").read_text(encoding="utf-8")
    assert "?v=5b2a2d37" in (tmp_path / "index.html").read_text(encoding="utf-8")
    assert bump_version.check(root) == []


def test_check_reports_mismatched_and_missing_versions(tmp_path):
    root = make_site(tmp_path, html_version="2026-08-17_1")
    (tmp_path / "old.html").write_text('<link href="css/app.css">\n', encoding="utf-8")

    problems = bump_version.check(root)

    assert any("?v=2026-08-17_1" in problem for problem in problems)
    assert any("css/app.css sin ?v=" in problem for problem in problems)


def test_site_files_are_only_what_the_site_serves():
    names = [
        "index.html", "css/index.css", "js/modules/ui.js", "js/siglas.json", "manifest.json", "service-worker.js",
        "README.md", "docs/README.md", "api/bump_version.py", "tests/js/utils.test.js", "package.json",
        "sitemap.xml", ".github/workflows/deploy-pages.yml", "img/hero-400.webp",
    ]

    assert bump_version.site_files(names) == [
        "index.html", "css/index.css", "js/modules/ui.js", "js/siglas.json", "manifest.json", "service-worker.js",
    ]


def test_site_change_without_bump_is_reported():
    problems = bump_version.missing_bump(["js/modules/ui.js", "README.md"], "2026-10-12_3", "2026-10-12_3")

    assert len(problems) == 1
    assert "js/modules/ui.js" in problems[0]


def test_site_change_with_bump_is_accepted():
    assert bump_version.missing_bump(["js/modules/ui.js"], "2026-10-12_3", "2026-10-12_4") == []


def test_docs_only_change_needs_no_bump():
    assert bump_version.missing_bump(["README.md", "tests/js/a.test.js"], "2026-10-12_3", "2026-10-12_3") == []
