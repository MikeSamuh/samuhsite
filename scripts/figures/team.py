"""Cut the home page's team icon into the two pictures the fourth beat uses.

Reads the client's drawings in public/icons (17 Nov 2026): the three people
(home-team-icon-samuh.png) and the one person (individual-icon-samuh.png).
Writes masks beside them, cropped to the figures, white on clear:

    home-team-lines.png    the three's own lines, untouched
    home-team-fill.png     the inside of each of the three, for the water
    individual-lines.png   the one person's lines, untouched

FocusMorph places the three and ./people the one; the colours come from the
tokens, the masks only say where. Run from the repo root and paste the
printed sizes into FocusMorph's TEAM and people's ART if a source changes:

    pip install pillow numpy scipy
    python3 scripts/figures/team.py
"""
import numpy as np
from PIL import Image
from scipy import ndimage as ndi

PAD = 8
# source, width out, and whether the water's fill is wanted too
ICONS = [
    ("home-team", 1280, True),    # the three who fill up (FocusMorph)
    ("individual", 480, False),   # the one person (./people: Who we work with)
]

for name, width, wants_fill in ICONS:
    a = np.array(Image.open(f"public/icons/{name}-icon-samuh.png").convert("RGBA").split()[3])
    line = a > 100
    ys, xs = np.where(line)
    box = (xs.min() - PAD, ys.min() - PAD, xs.max() + 1 + PAD, ys.max() + 1 + PAD)
    size = (width, round(width * (box[3] - box[1]) / (box[2] - box[0])))

    def save(alpha, out):
        al = Image.fromarray(alpha).crop(box).resize(size, Image.LANCZOS)
        Image.merge("LA", (Image.new("L", size, 255), al)).save(f"public/icons/{out}", optimize=True)

    save(a, f"{name}-lines.png")
    if wants_fill:
        # inside: whatever the page's corner cannot reach without crossing a line
        lab, _ = ndi.label(~line)
        inside = ~line & (lab != lab[0, 0])
        # and a little under the lines, so no seam shows between water and line
        fill = ndi.binary_dilation(inside, iterations=4) & (inside | line)
        save(fill.astype(np.uint8) * 255, f"{name}-fill.png")
    print(name, "size", size)
