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
    "discover": "public/icons/discover-icon-samuh.png",
    "align": "public/icons/align-icon-samuh.png",
    "cocreate": "public/icons/co-create-icon-samuh.png",
    "ritualize": "public/icons/ritualize-icon-samuh.png",
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
    # each curve with its outline as a polygon and its signed area: potrace
    # winds a hole the other way from the shape it is cut out of
    curves = []
    for curve in potrace.Bitmap(c).trace(turdsize=60, opttolerance=0.4):
        k = 0.5
        p = curve.start_point
        d = f"M{p.x*k:.1f},{p.y*k:.1f}"
        poly = [(p.x, p.y)]
        last = poly[-1]
        for g in curve.segments:
            if g.is_corner:
                d += f"L{g.c.x*k:.1f},{g.c.y*k:.1f}L{g.end_point.x*k:.1f},{g.end_point.y*k:.1f}"
                poly += [(g.c.x, g.c.y), (g.end_point.x, g.end_point.y)]
            else:
                d += f"C{g.c1.x*k:.1f},{g.c1.y*k:.1f} {g.c2.x*k:.1f},{g.c2.y*k:.1f} {g.end_point.x*k:.1f},{g.end_point.y*k:.1f}"
                for t in (0.25, 0.5, 0.75, 1):
                    u = 1 - t
                    x0, y0 = last
                    poly.append((u**3*x0 + 3*u*u*t*g.c1.x + 3*u*t*t*g.c2.x + t**3*g.end_point.x, u**3*y0 + 3*u*u*t*g.c1.y + 3*u*t*t*g.c2.y + t**3*g.end_point.y))
            last = poly[-1]
        area = sum(x0*y1 - x1*y0 for (x0, y0), (x1, y1) in zip(poly, poly[1:] + poly[:1])) / 2
        curves.append({"d": d + "Z", "poly": poly, "area": area})
    def inside(pt, poly):
        x, y = pt; n = False
        for (x0, y0), (x1, y1) in zip(poly, poly[1:] + poly[:1]):
            if (y0 > y) != (y1 > y) and x < (x1 - x0) * (y - y0) / (y1 - y0) + x0: n = not n
        return n
    # potrace traces the ground as one curve round the whole frame: not a shape
    curves = [q for q in curves if abs(q["area"]) < 0.98 * 1024 * 1024]
    sign = 1 if max(curves, key=lambda q: abs(q["area"]))["area"] > 0 else -1
    outers = [q for q in curves if q["area"] * sign > 0]
    # a hole goes into the path of the shape it is cut out of (the gaps
    # between the legs over the ground line), so it is not painted as a shape
    for q in curves:
        if q["area"] * sign > 0: continue
        host = [o for o in outers if inside(q["poly"][0], o["poly"])]
        if host: min(host, key=lambda o: abs(o["area"]))["d"] += q["d"]
    shapes = [o["d"] for o in outers]
    out[pose] = shapes
    print(pose, len(shapes), "shapes")

json.dump(out, open("scripts/figures/traced.json", "w"))
