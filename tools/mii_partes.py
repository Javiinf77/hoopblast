#!/usr/bin/env python3
"""Recorta la hoja de iconos del Mii Channel (assets/mii/hoja_iconos_mii.png) pieza a pieza y la mete en el juego.

Uso:  python3 tools/mii_partes.py            (desde la raíz del repo)
  1. Guarda cada pieza suelta en assets/mii/<categoría>/NN.png (ojos, cejas, boca, pelo, nariz, cara, gafas…).
  2. Prepara las texturas que se pintan en la cara (ojos, cejas y bocas ×2; gafas, bigotes y rasgos ×6 con bordes limpios).
  3. Escribe la función miiPartsData() al final de index.html (sección §32b), sustituyendo la anterior si existe.
Colores de las plantillas: negro = trazo, verde = blanco del ojo / labio de arriba, azul = iris / dientes, rojo = pestaña / labio.
"""
import base64, io, json, os, re, sys
import numpy as np
from PIL import Image, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SHEET = os.path.join(ROOT, 'assets/mii/hoja_iconos_mii.png')
OUTDIR = os.path.join(ROOT, 'assets/mii')
HTML = os.path.join(ROOT, 'index.html')

img = Image.open(SHEET).convert('RGBA'); im = np.array(img); A = im[..., 3] > 8

def bands(mask, axis, gap):
    p = mask.any(axis); out = []; s = None; last = -99
    for i, v in enumerate(p):
        if v:
            if s is None: s = i
            elif i - last > gap: out.append((s, last + 1)); s = i
            last = i
    if s is not None: out.append((s, last + 1))
    return out

def items(y0, y1, x1):
    m = A[y0:y1, :x1]; res = []
    for a0, a1 in bands(m, 0, 10):
        r = bands(m[:, a0:a1], 1, 500)[0]
        res.append((a0, y0 + r[0], a1, y0 + r[1]))
    return res

# filas de la hoja (y0, y1). El icono de categoría (x < 70) se descarta; en las filas con submenú también el icono pequeño.
ROWS = {
    'cara': [(316, 377)], 'rasgos': [(397, 455)],
    'pelo': [(534, 593), (606, 668), (684, 745), (758, 826), (842, 905), (924, 991)],
    'cejas': [(1054, 1082), (1111, 1141)],
    'ojos': [(1206, 1242), (1265, 1303), (1312, 1362), (1371, 1420)],
    'nariz': [(1485, 1538)], 'boca': [(1617, 1655), (1658, 1692)],
    'gafas': [(1761, 1819)], 'bigote': [(1833, 1888)], 'lunar': [(1906, 1960)], 'barba': [(1960, 2050)],
}
SUBMENU = {'cara', 'rasgos', 'gafas', 'bigote', 'lunar', 'barba'}

pieces = {}
for name, rows in ROWS.items():
    pieces[name] = []
    os.makedirs(os.path.join(OUTDIR, name), exist_ok=True)
    for (y0, y1) in rows:
        its = [b for b in items(y0, y1, 900 if name in ('lunar', 'barba') else 1000) if b[0] >= 70]
        if name in SUBMENU: its = its[1:]
        rc = (y0 + y1) / 2
        for b in its: pieces[name].append((b, rc))
    for k, (b, rc) in enumerate(pieces[name]):
        img.crop(b).save(os.path.join(OUTDIR, name, f'{k:02d}.png'))
    print(f'{name:7s} {len(pieces[name])} piezas')

def png64(pil):
    buf = io.BytesIO(); pil.save(buf, 'PNG', optimize=True); return base64.b64encode(buf.getvalue()).decode()

def upscale(pil, f):
    """Escala con Lanczos sobre color premultiplicado (los bordes no se ensucian de negro)."""
    a = np.array(pil).astype(np.float32) / 255; rgb = a[..., :3] * a[..., 3:]
    w, h = pil.size
    ch = [np.array(Image.fromarray((c * 255).astype(np.uint8)).resize((w * f, h * f), Image.LANCZOS)).astype(np.float32) / 255
          for c in (rgb[..., 0], rgb[..., 1], rgb[..., 2], a[..., 3])]
    al = np.clip(ch[3], 0, 1); out = np.zeros((h * f, w * f, 4), np.float32)
    for i in range(3): out[..., i] = np.where(al > 1e-3, np.clip(ch[i] / np.maximum(al, 1e-3), 0, 1), 0)
    out[..., 3] = al
    return out

def to_pil(a): return Image.fromarray((np.clip(a, 0, 1) * 255).astype(np.uint8))

def sharpen_alpha(a, lo=0.3, hi=0.62):
    t = np.clip((a - lo) / (hi - lo), 0, 1); return t * t * (3 - 2 * t)

data = {}
# ---- ojos, cejas, bocas: plantillas de color a su tamaño (el juego las escala con suavizado) y su desplazamiento vertical en la fila ----
for name in ('ojos', 'cejas', 'boca'):
    lst = []
    for (b, rc) in pieces[name]:
        x0, y0, x1, y1 = b; crop = img.crop((x0 - 1, y0 - 1, x1 + 1, y1 + 1))
        lst.append([png64(crop), round((y0 + y1) / 2 - rc, 1)])
    data[name] = lst

# ---- iconos para el vestuario (tal cual) ----
for name in ('pelo', 'nariz', 'cara', 'gafas', 'bigote', 'barba', 'rasgos', 'lunar'):
    data['ico_' + name] = [png64(img.crop(b)) for (b, rc) in pieces[name]]

# ---- piezas sacadas de los iconos redondos (gafas, bigotes, rasgos): se quita el disco de la cara ----
def disc_parts(b):
    t = np.array(img.crop(b)).astype(np.float32) / 255
    al = t[..., 3]; ys, xs = np.where(al > 0.5)
    cx, cy = (xs.min() + xs.max() + 1) / 2, (ys.min() + ys.max() + 1) / 2; R = (xs.max() - xs.min() + 1) / 2
    yy, xx = np.mgrid[0:t.shape[0], 0:t.shape[1]]; inner = np.hypot(xx + 0.5 - cx, yy + 0.5 - cy) < R - 4.5
    return t, inner, (cx, cy, R)

# calibración: los coloretes del icono de rasgos 1 caen en las mejillas de la cara del juego
t, inner, (cx, cy, R) = disc_parts(pieces['rasgos'][1][0])
pink = inner & (t[..., 0] - t[..., 1] > 0.15)
ys, xs = np.where(pink); left = xs < cx
cheek_dx = (xs[~left].mean() - xs[left].mean()) / 2; cheek_dy = ys.mean() - cy
F = 6                                        # escala de las capas
S = 0.17 * 512 / cheek_dx                    # píxeles de la cara (lienzo de 512) por píxel del icono
data['disco'] = {'s': round(S, 3), 'cy': round(0.37 - (-cheek_dy * S) / 512, 4), 'f': F}   # v del centro del disco en la cara

def smooth_mask(m, lo=0.42, hi=0.58):
    """Pixel art → contorno suave: se agranda sin suavizar, se difumina (≈ campo de distancias) y se vuelve a cortar con un borde fino."""
    h, w = m.shape
    big = Image.fromarray((m * 255).astype(np.uint8)).resize((w * F, h * F), Image.NEAREST).filter(ImageFilter.GaussianBlur(F * 0.55))
    return sharpen_alpha(np.array(big).astype(np.float32) / 255, lo, hi)

def layer(t, mask_frame, mask_lens=None):
    h, w = mask_frame.shape
    out = np.zeros((h * F, w * F, 4), np.float32); out[..., 0] = smooth_mask(mask_frame)
    if mask_lens is not None:
        out[..., 1] = smooth_mask(mask_lens, 0.35, 0.6) * (1 - out[..., 0])
    out[..., 3] = np.maximum(out[..., 0], out[..., 1])
    return out

def crop_layer(out, cxs, cys):
    ys, xs = np.where(out[..., 3] > 0.02)
    if not len(xs): return None
    x0, x1, y0, y1 = xs.min(), xs.max() + 1, ys.min(), ys.max() + 1
    # centro de la pieza respecto al centro del disco, en píxeles del icono
    return out[y0:y1, x0:x1], ((x0 + x1) / 2 / F - cxs, (y0 + y1) / 2 / F - cys)

# gafas: R = montura (oscuro), G = cristal (gris)
data['gafas'] = [None]
for (b, rc) in pieces['gafas'][1:]:
    t, inner, (cx, cy, R) = disc_parts(b)
    lum = t[..., :3].mean(-1)
    frame = inner & (lum < 0.35) & (t[..., 3] > 0.5); lens = inner & (lum >= 0.35) & (lum < 0.8) & (t[..., 3] > 0.5)
    out, off = crop_layer(layer(t, frame.astype(np.float32), lens.astype(np.float32)), cx, cy)
    data['gafas'].append([png64(to_pil(out)), round(off[0], 2), round(off[1], 2), F])
# bigotes: R = bigote
data['bigote'] = [None]
for (b, rc) in pieces['bigote'][1:]:
    t, inner, (cx, cy, R) = disc_parts(b)
    m = inner & (t[..., :3].mean(-1) < 0.4) & (t[..., 3] > 0.5)
    out, off = crop_layer(layer(t, m.astype(np.float32)), cx, cy)
    data['bigote'].append([png64(to_pil(out)), round(off[0], 2), round(off[1], 2), F])
# rasgos (coloretes, pecas, arrugas, sombra de barba…): color tal cual, opacidad según lo que se aparta del blanco
data['rasgos'] = [None]
for (b, rc) in pieces['rasgos'][1:]:
    t, inner, (cx, cy, R) = disc_parts(b)
    d = np.clip((1 - t[..., :3].min(-1)) / 0.45, 0, 1) * inner * (t[..., 3] > 0.5)
    h, w = d.shape
    up = upscale(Image.fromarray((np.dstack([t[..., :3], d]) * 255).astype(np.uint8)), 2)   # suave: basta ×2
    up[..., 3] = np.clip(up[..., 3], 0, 1)
    up[..., 3] = np.array(to_pil(up[..., 3]).filter(ImageFilter.GaussianBlur(1.3))).astype(np.float32) / 255   # bordes suaves (maquillaje)
    up = (np.round(up * 15) / 15).astype(np.float32)   # menos tonos → PNG mucho más pequeño
    ys, xs = np.where(up[..., 3] > 0.02); x0, x1, y0, y1 = xs.min(), xs.max() + 1, ys.min(), ys.max() + 1
    res = (up[y0:y1, x0:x1], ((x0 + x1) / 4 - cx, (y0 + y1) / 4 - cy))
    data['rasgos'].append([png64(to_pil(res[0])), round(res[1][0], 2), round(res[1][1], 2), 2])

# peinados: icono → malla (emparejados por silueta; el calvo no tiene malla)
data['pelo_malla'] = json.load(open(os.path.join(OUTDIR, 'pelo_icono_a_malla.json')))

js = json.dumps(data, separators=(',', ':'))
fn = ('/* ==============================================================================\n'
      '   §32b PIEZAS DE LA CARA (recortadas de la hoja de iconos del Mii Channel con tools/mii_partes.py) — no editar\n'
      '   ============================================================================== */\n'
      'function miiPartsData() { return ' + js + '; }\n')
html = open(HTML, encoding='utf-8').read()
pat = re.compile(r'/\* =+\n   §32b PIEZAS DE LA CARA.*?\nfunction miiPartsData\(\) \{ return .*?; \}\n', re.S)
if pat.search(html): html = pat.sub(lambda m: fn, html)
else:
    i = html.index('/* ==============================================================================\n   §32 DATOS DE MODELOS')
    html = html[:i] + fn + html[i:]
open(HTML, 'w', encoding='utf-8').write(html)
print('miiPartsData:', round(len(js) / 1024), 'KB')
