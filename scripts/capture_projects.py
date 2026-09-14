"""Captures des réalisations pour public/projects (ordi défilant, couverture, mobile).

Les études de refonte sont anonymisées (logo, nom, téléphone, e-mail, adresse, villes).
Usage : python3 scripts/capture_projects.py [slug ...]
Relire les PNG du dossier REVIEW avant de publier.
"""
import asyncio, os, sys, tempfile
from playwright.async_api import async_playwright
from PIL import Image

PUB = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "public", "projects")
REVIEW = os.path.join(tempfile.gettempdir(), "portfolio-captures")
MAX_H = 3600  # desktop scroll image height (px at 1440 wide)

STUDIES = {
    "aqua-concept": {"label": "PISCINISTE", "names": ["Aqua Concept", "AQUA CONCEPT", "aquaconcept-piscine.fr", "AquaConcept"], "subs": []},
    "partner-menuiseries": {"label": "MENUISIER", "names": ["Partner Menuiseries", "PARTNER", "Partner", "partner-menuiseries.com"], "subs": [
        ["Fabriqué à Saint-Andiol et à Juvignac", "Fabriqué dans nos ateliers"],
        ["Alu à Saint-Andiol, PVC à Juvignac", "Alu et PVC fabriqués sur place"],
        ["Fabriqué à Saint-Andiol", "Fabriqué sur place"],
        ["depuis l'atelier de Plan d'Orgon", "depuis le premier atelier familial"],
        ["Saint-Andiol", "Provence"], ["Juvignac", "Hérault"], ["Plan d'Orgon", "Provence"]]},
    "sgabtp": {"label": "ARMATURES", "names": ["SGABTP", "SGA BTP", "SGA"], "subs": [
        ["la Société Générale d'Armatures pour le Bâtiment et les Travaux Publics", "l'entreprise"],
        ["Société Générale d'Armatures à Béton", "L'entreprise"],
        ["à Gignac-la-Nerthe", "près de l'étang de Berre"],
        ["Gignac-la-Nerthe", "Étang de Berre"]]},
    "marine-industrial-supplies": {"label": "MARINE SUPPLY", "names": ["Marine & Industrial Supplies", "M.I.S.", "MIS"], "subs": [
        ["96 Le Logis Neuf", "Head office"], ["Allauch", "Marseille area"]]},
    "sanitor": {"label": "NÉGOCE SANITAIRE", "names": ["Sanitor", "SANITOR", "Sanitech"], "subs": [
        ["Le point de vente Sanitor est au 44 rue Gustave Eiffel,", "Le point de vente est dans le 10e arrondissement,"],
        ["au 44 rue Gustave Eiffel", "dans le 10e arrondissement"],
        ["44 rue Gustave Eiffel", "10e arrondissement"],
        ["distribués par Sanitor", "distribués au comptoir"],
        ["Membre du réseau Algorel", "Membre d'un réseau national"],
        ["Algorel", "Réseau"]]},
    "optic-iris": {"label": "OPTICIEN", "names": ["Optic Iris", "OPTIC IRIS", "optic-iris.com"], "subs": [
        ["à Lambesc", "en Provence"], ["7 avenue du 8 Mai 1945", "Centre-ville"], ["Lambesc", "Provence"]]},
}
LIVE = {
    "parentez": "https://parentez.vercel.app/",
    "mistral-tp": "https://mistraltp.vercel.app/",
}

ANON_JS = r"""
({label, names, subs}) => {
  document.querySelectorAll('.proposal-banner').forEach(e => e.remove());
  // replace brand blocks (header + footer) by a neutral sector label
  document.querySelectorAll('.brand, .footer-brand').forEach(b => {
    if (b.closest('#marques, .brands, .brand-wall')) return;
    b.innerHTML = '<span style="font-weight:700;letter-spacing:.14em;font-size:15px;color:inherit;white-space:nowrap">' + label + '</span>';
  });
  document.querySelectorAll('img').forEach(i => {
    const s = (i.getAttribute('src') || '') + ' ' + (i.getAttribute('alt') || '') + ' ' + i.className;
    if (/logo/i.test(s) && !i.closest('#marques, .brands, .brand-wall, .refs, #references')) i.style.visibility = 'hidden';
  });
  const phone = /(\+33\s?\(?0?\)?\s?|0)[1-9](?:[\s. -]?\d{2}){4}/g;
  const mail = /[\w.+-]+@[\w-]+\.[\w.]+/g;
  const addr = /\b\d{1,4}\s?(bis|ter)?,?\s(rue|avenue|av\.|boulevard|bd|chemin|route|impasse|allée|place|quai|traverse|lotissement|zone|ZI|ZA|ZAC)\b[^,\n]{2,48}/gi;
  const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const nameRe = new RegExp(names.map(esc).sort((a, b) => b.length - a.length).map(n => /^\w/.test(n) ? '\\b' + n + '\\b' : n).join('|'), 'g');
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let n;
  while ((n = walker.nextNode())) {
    let t = n.nodeValue;
    const o = t;
    for (const [a, b] of subs) t = t.split(a).join(b).split(a.replace(/'/g, '’')).join(b);
    t = t.replace(nameRe, (m, off, str) => (off === 0 || /[.!?:]\s*$/.test(str.slice(0, off))) ? 'L’entreprise' : 'l’entreprise').replace(phone, '04 00 00 00 00').replace(mail, 'contact@entreprise.fr').replace(addr, 'Adresse de l’entreprise');
    if (t !== o) n.nodeValue = t;
  }
  document.querySelectorAll('[aria-label],[title],[alt]').forEach(e => {
    ['aria-label', 'title', 'alt'].forEach(a => { const v = e.getAttribute(a); if (v && nameRe.test(v)) e.setAttribute(a, ''); nameRe.lastIndex = 0; });
  });
  document.title = 'Étude de refonte';
}
"""


async def settle(page, h):
    total = await page.evaluate("document.documentElement.scrollHeight")
    y = 0
    while y < min(total, MAX_H + 1200):
        await page.evaluate(f"window.scrollTo(0,{y})")
        await page.wait_for_timeout(180)
        y += h // 2
    await page.evaluate("window.scrollTo(0,0)")
    await page.wait_for_timeout(900)


def save(png, slug, kind):
    im = Image.open(png).convert("RGB")
    if kind == "desktop":
        im = im.crop((0, 0, im.width, min(im.height, MAX_H)))
        im.save(f"{PUB}/{slug}-desktop.webp", "WEBP", quality=78, method=6)
        im.crop((0, 0, 1440, 900)).resize((960, 600), Image.LANCZOS).save(f"{PUB}/{slug}-cover.webp", "WEBP", quality=80, method=6)
        r = im.resize((720, im.height // 2), Image.LANCZOS)
        for i in range(0, r.height, 1800):
            r.crop((0, i, 720, min(r.height, i + 1800))).save(f"{REVIEW}/{slug}-d{i // 1800}.png")
    else:
        im.save(f"{PUB}/{slug}-mobile.webp", "WEBP", quality=80, method=6)
        im.resize((390, 844)).save(f"{REVIEW}/{slug}-m.png")
    os.remove(png)


async def main():
    only = sys.argv[1:]
    os.makedirs(PUB, exist_ok=True)
    os.makedirs(REVIEW, exist_ok=True)
    async with async_playwright() as p:
        b = await p.chromium.launch()
        jobs = [(s, f"file://{os.path.expanduser('~')}/refontes/{s}/site/index.html?capture=1", STUDIES[s]) for s in STUDIES] + [(s, u, None) for s, u in LIVE.items()]
        for slug, url, anon in jobs:
            if only and slug not in only:
                continue
            for kind, w, h, dpr, mob in [("desktop", 1440, 900, 1, False), ("mobile", 390, 844, 2, True)]:
                ctx = await b.new_context(viewport={"width": w, "height": h}, device_scale_factor=dpr, is_mobile=mob, has_touch=mob, reduced_motion="reduce")
                page = await ctx.new_page()
                await page.goto(url, wait_until="networkidle", timeout=60000)
                await page.wait_for_timeout(2500)
                if not anon:
                    for label in ["Refuser", "Tout refuser", "Accepter"]:
                        btn = page.get_by_role("button", name=label, exact=True)
                        if await btn.count():
                            await btn.first.click()
                            await page.wait_for_timeout(600)
                            break
                if kind == "desktop":
                    await settle(page, h)
                    await page.wait_for_timeout(1500)
                if anon:
                    await page.evaluate(ANON_JS, anon)
                    await page.wait_for_timeout(400)
                png = f"{REVIEW}/{slug}-{kind}.png"
                await page.screenshot(path=png, full_page=(kind == "desktop"))
                save(png, slug, kind)
                await ctx.close()
            print("ok", slug)
        await b.close()

asyncio.run(main())
