"""Versión de caché del sitio: un solo valor `AAAA-MM-DD_N` en todas partes.

Uso (desde la raíz del repo):
    python api/bump_version.py           # pasa a la siguiente versión en todos los archivos
    python api/bump_version.py --check   # verifica que todo use la misma versión
    python api/bump_version.py --show    # muestra la versión actual
    python api/bump_version.py --verify-staged        # hook pre-commit: ¿cambió el sitio sin subir la versión?
    python api/bump_version.py --verify <base> <head> # lo mismo entre dos commits (despliegue)
"""
import glob
import os
import re
import subprocess
import sys
from datetime import datetime

SW_FILE = 'service-worker.js'
VERSION_RE = r'\d{4}-\d{2}-\d{2}_\d+'
QUERY_RE = re.compile(r'\?v=' + VERSION_RE)
SW_VERSION_RE = re.compile(r"(const CACHE_VERSION = 'ropavejero-v)([^']+)(';)")

# Archivos que sirve el sitio: cambiarlos exige subir la versión
SITE_FILE_RE = re.compile(r'^(?:[^/]+\.html|css/.+\.css|js/.+\.(?:js|json)|manifest\.json|service-worker\.js)$')

# Referencias a assets locales que deberían llevar ?v= y no lo llevan
UNVERSIONED_PATTERNS = [
    re.compile(r'(?:href|src)="(?!https?:|//|data:|#)([^"?]+\.(?:css|js|json))"'),
    re.compile(r'fetch\(\s*[\'"`]((?!https?:)[^\'"`?]+\.json)[\'"`]'),
    re.compile(r'register\(\s*[\'"`]([^\'"`?]+)[\'"`]'),
]


def target_files(root='.'):
    """Archivos que contienen referencias versionadas."""
    patterns = ['*.html', 'js/index.js', 'js/index.min.js', 'js/seo-analytics.js', 'js/modules/*.js']
    files = []
    for pattern in patterns:
        files.extend(sorted(glob.glob(os.path.join(root, pattern))))
    return files


def read_text(path):
    with open(path, 'r', encoding='utf-8', newline='') as f:
        return f.read()


def write_text(path, content):
    with open(path, 'w', encoding='utf-8', newline='') as f:
        f.write(content)


def today_str():
    """Fecha de hoy en Chile (el workflow de GitHub corre en UTC)."""
    try:
        from zoneinfo import ZoneInfo
        return datetime.now(ZoneInfo('America/Santiago')).strftime('%Y-%m-%d')
    except Exception:
        return datetime.now().strftime('%Y-%m-%d')


def current_version(root='.'):
    """Versión actual, leída de CACHE_VERSION en el service worker."""
    match = SW_VERSION_RE.search(read_text(os.path.join(root, SW_FILE)))
    return match.group(2) if match else None


def next_version(current, today=None):
    """Siguiente versión: mismo día -> correlativo + 1; día nuevo -> _1."""
    today = today or today_str()
    match = re.fullmatch(r'(\d{4}-\d{2}-\d{2})_(\d+)', current or '')
    if match and match.group(1) >= today:
        return f"{match.group(1)}_{int(match.group(2)) + 1}"
    return f"{today}_1"


def apply_version(new_version, root='.'):
    """Escribe la versión en todos los ?v= y en CACHE_VERSION. Devuelve los archivos modificados."""
    changed = []
    for path in target_files(root):
        content = read_text(path)
        updated = QUERY_RE.sub(f'?v={new_version}', content)
        if updated != content:
            write_text(path, updated)
            changed.append(path)

    sw_path = os.path.join(root, SW_FILE)
    content = read_text(sw_path)
    updated = SW_VERSION_RE.sub(lambda m: m.group(1) + new_version + m.group(3), content)
    if updated != content:
        write_text(sw_path, updated)
        changed.append(sw_path)
    return changed


def bump(root='.', today=None):
    """Pasa todo el sitio a la siguiente versión y la devuelve."""
    new_version = next_version(current_version(root), today)
    apply_version(new_version, root)
    return new_version


def check(root='.'):
    """Lista de problemas: versiones distintas a la actual o assets locales sin ?v=."""
    problems = []
    current = current_version(root)
    if not current or not re.fullmatch(VERSION_RE, current):
        problems.append(f"{SW_FILE}: CACHE_VERSION no sigue el esquema AAAA-MM-DD_N ({current})")

    for path in target_files(root):
        content = read_text(path)
        for found in sorted(set(QUERY_RE.findall(content))):
            if found != f'?v={current}':
                problems.append(f"{path.replace(os.sep, '/')}: {found} (se esperaba ?v={current})")
        for pattern in UNVERSIONED_PATTERNS:
            for asset in sorted(set(pattern.findall(content))):
                problems.append(f"{path.replace(os.sep, '/')}: {asset} sin ?v=")
    return problems


def site_files(names):
    """De una lista de rutas, las que son archivos servidos por el sitio."""
    return [name for name in names if SITE_FILE_RE.match(name.replace(os.sep, '/'))]


def version_in(text):
    """Versión declarada en el contenido de service-worker.js."""
    match = SW_VERSION_RE.search(text or '')
    return match.group(2) if match else None


def missing_bump(changed_names, version_before, version_after):
    """Problemas si se modificaron archivos del sitio y la versión no cambió."""
    changed = site_files(changed_names)
    if changed and version_before == version_after:
        listed = ', '.join(changed[:5]) + (' ...' if len(changed) > 5 else '')
        return [f"Se modificaron archivos del sitio ({listed}) sin subir la versión ({version_after}). "
                f"Ejecuta: python api/bump_version.py"]
    return []


def _git(*args):
    result = subprocess.run(['git', *args], capture_output=True, text=True, encoding='utf-8')
    return result.stdout if result.returncode == 0 else None


def verify_staged():
    """Para el hook pre-commit: compara lo preparado para commit con HEAD."""
    names = _git('diff', '--cached', '--name-only')
    if names is None:
        return []
    return missing_bump(names.split(), version_in(_git('show', f'HEAD:{SW_FILE}')), version_in(_git('show', f':{SW_FILE}')))


def verify_range(base, head):
    """Para el despliegue: compara dos commits. Si no se puede leer el base, no reporta nada."""
    names = _git('diff', '--name-only', base, head)
    before = _git('show', f'{base}:{SW_FILE}')
    if names is None or before is None:
        print(f"No se pudo comparar con {base}; se omite la verificación de bump.")
        return []
    return missing_bump(names.split(), version_in(before), version_in(_git('show', f'{head}:{SW_FILE}')))


def _report(found_problems):
    for problem in found_problems:
        print(problem)
    sys.exit(1 if found_problems else 0)


if __name__ == '__main__':
    if hasattr(sys.stdout, 'reconfigure'):
        sys.stdout.reconfigure(encoding='utf-8')
    if '--show' in sys.argv:
        print(current_version())
    elif '--verify-staged' in sys.argv:
        _report(verify_staged())
    elif '--verify' in sys.argv:
        position = sys.argv.index('--verify')
        _report(verify_range(sys.argv[position + 1], sys.argv[position + 2]))
    elif '--check' in sys.argv:
        found_problems = check()
        for problem in found_problems:
            print(problem)
        print(f"Versión actual: {current_version()} - {'con problemas' if found_problems else 'todo consistente'}")
        sys.exit(1 if found_problems else 0)
    else:
        previous = current_version()
        print(f"{previous} -> {bump()}")
