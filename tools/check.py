"""Verificare automată pentru aplicația MOODS (rulează local și pe GitHub la fiecare push).

    python tools/check.py                 # verificări
    python tools/check.py --build _site   # verificări + copiază DOAR fișierele publice în _site

Verifică: datele (data.js) sunt doar text, fără HTML/cod; paginile n-au script/stil inline
sau onclick=; toate fișierele din cache-ul service worker-ului există; CACHE_VERSION a crescut
dacă ultimul commit a schimbat fișiere publice.
"""
import re, sys, shutil, subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
# Ce ajunge pe site. Restul (README, CLAUDE.md, JURNAL.md, tools/, .github/) rămâne doar în repo.
PUBLIC = ["index.html", "offline.html", "app.css", "app.js", "data.js", "sw.js", "fonts.css",
          "manifest.webmanifest", "icon-192.png", "icon-512.png", "apple-touch-icon.png",
          ".nojekyll", "img", "fonts", "logo"]
errors = []


def fail(msg):
    errors.append(msg)


def check_data():
    src = (ROOT / "data.js").read_text(encoding="utf-8")
    code = re.sub(r"/\*.*?\*/", "", src, flags=re.S)
    string_re = re.compile(r'"((?:[^"\\]|\\.)*)"')
    for s in string_re.findall(code):
        if re.search(r"[<>]|javascript:|&#|&[a-z]+;", s, re.I):
            fail(f"data.js: text cu HTML/cod: {s[:60]!r}")
    rest = string_re.sub('""', code)
    if re.search(r"\bfunction\b|=>|\beval\b|`", rest):
        fail("data.js: conține cod (function / => / eval / template string)")


def check_pages():
    for page in ["index.html", "offline.html"]:
        html = (ROOT / page).read_text(encoding="utf-8")
        if re.search(r"<script(?![^>]*\bsrc=)[^>]*>", html, re.I):
            fail(f"{page}: script inline")
        if re.search(r"<style\b|\sstyle=", html, re.I):
            fail(f"{page}: stil inline")
        if re.search(r"\son[a-z]+\s*=", html, re.I):
            fail(f"{page}: atribut on...= (ex. onclick)")
        if "Content-Security-Policy" not in html:
            fail(f"{page}: lipsește Content-Security-Policy")
    js = (ROOT / "app.js").read_text(encoding="utf-8")
    if re.search(r"innerHTML|outerHTML|insertAdjacentHTML|document\.write", js):
        fail("app.js: folosește HTML ca text (innerHTML etc.)")
    if re.search(r"style=", js):
        fail("app.js: stil inline (style=) — blocat de CSP")


def sw_version(text):
    m = re.search(r'CACHE_VERSION\s*=\s*"([^"]+)"', text)
    return m.group(1) if m else None


def check_sw():
    sw = (ROOT / "sw.js").read_text(encoding="utf-8")
    files = re.findall(r'"([^"]+)"', sw.split("var FILES", 1)[1].split("];", 1)[0])
    for f in files:
        if f != "./" and not (ROOT / f).is_file():
            fail(f"sw.js: fișier din cache care nu există: {f}")
    if not sw_version(sw):
        fail("sw.js: lipsește CACHE_VERSION")
    # Dacă ultimul commit a schimbat fișiere publice, CACHE_VERSION trebuie să fie altul.
    try:
        changed = subprocess.run(["git", "diff", "--name-only", "HEAD~1", "HEAD"], cwd=ROOT,
                                 capture_output=True, text=True, check=True).stdout.split()
        old = subprocess.run(["git", "show", "HEAD~1:sw.js"], cwd=ROOT,
                             capture_output=True, text=True, check=True).stdout
    except (subprocess.CalledProcessError, FileNotFoundError):
        return
    public_changed = [c for c in changed if c.split("/")[0] in PUBLIC and c != ".nojekyll"]
    if public_changed and sw_version(old) == sw_version(sw):
        fail(f"sw.js: CACHE_VERSION ({sw_version(sw)}) n-a crescut, deși s-au schimbat: {', '.join(public_changed)}")


def build(out):
    out = ROOT / out
    shutil.rmtree(out, ignore_errors=True)
    out.mkdir()
    for p in PUBLIC:
        src = ROOT / p
        (shutil.copytree if src.is_dir() else shutil.copy2)(src, out / p)
    print(f"build: {len(PUBLIC)} intrări publice copiate în {out.name}/")


if __name__ == "__main__":
    check_data(); check_pages(); check_sw()
    if errors:
        print("EȘUAT:\n - " + "\n - ".join(errors)); sys.exit(1)
    print("OK: date doar text, pagini fără inline, cache complet, versiune cache în regulă")
    if "--build" in sys.argv:
        build(sys.argv[sys.argv.index("--build") + 1])
