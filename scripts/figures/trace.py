"""Trace the process-stage icons into SVG paths.

Reads the PNGs in public/icons, crops each to its figure, pads it square, and
traces it with potrace into a 512 x 512 frame. Writes scripts/figures/traced.json.
Run from the repo root, then run build-morphs.mjs:

    pip install potracer pillow numpy
    python3 scripts/figures/trace.py

To swap an icon, change STAGES below. The key is the pose id the site uses.
"""
import json
import numpy as np
import potrace
from PIL import Image

STAGES = {
    "discover": "public/icons/Discover 2.png",
    "align": "public/icons/Align 2.png",
    "cocreate": "public/icons/Belonging 2.png",
}

out = {}
for pose, src in STAGES.items():
    a = np.array(Image.open(src).convert("RGBA").split()[3]) > 128
    ys, xs = np.where(a)
    a = a[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
    h, w = a.shape
    s = int(max(h, w) * 1.12)
    c = np.zeros((s, s), bool)
    c[(s - h) // 2:(s - h) // 2 + h, (s - w) // 2:(s - w) // 2 + w] = a
    c = np.array(Image.fromarray(c.astype(np.uint8) * 255).resize((1024, 1024), Image.LANCZOS)) > 128
    shapes = []
    for curve in potrace.Bitmap(c).trace(turdsize=60, opttolerance=0.4):
        k = 0.5
        p = curve.start_point
        d = f"M{p.x*k:.1f},{p.y*k:.1f}"
        for g in curve.segments:
            if g.is_corner:
                d += f"L{g.c.x*k:.1f},{g.c.y*k:.1f}L{g.end_point.x*k:.1f},{g.end_point.y*k:.1f}"
            else:
                d += f"C{g.c1.x*k:.1f},{g.c1.y*k:.1f} {g.c2.x*k:.1f},{g.c2.y*k:.1f} {g.end_point.x*k:.1f},{g.end_point.y*k:.1f}"
        shapes.append(d + "Z")
    out[pose] = shapes
    print(pose, len(shapes), "shapes")

json.dump(out, open("scripts/figures/traced.json", "w"))
