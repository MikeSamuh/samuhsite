"use client";

import { useEffect, useRef, useState } from "react";
import { type Accent, type Background, contrastRatio, customAccent } from "@/lib/tokens";

// A hue and saturation wheel with a lightness slider. Pick a slot, then
// drag: the page updates live. The wheel is drawn on a canvas so the color
// under the pointer is exactly the color you get.

type Slot = "accent" | "accent2" | "accent3" | "accent4";

const SLOTS: { slot: Slot; label: string }[] = [
  { slot: "accent", label: "1 loud" },
  { slot: "accent2", label: "2 quiet" },
  { slot: "accent3", label: "3 data" },
  { slot: "accent4", label: "4 wash" },
];

const SIZE = 200;

function hslToHex(h: number, s: number, l: number): string {
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const c = l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    return Math.round(255 * c).toString(16).padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function hexToHsl(hex: string): [number, number, number] {
  const n = parseInt(hex.replace("#", ""), 16);
  const r = ((n >> 16) & 255) / 255;
  const g = ((n >> 8) & 255) / 255;
  const b = (n & 255) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;
  if (d === 0) return [0, 0, l];
  const s = d / (1 - Math.abs(2 * l - 1));
  let h = 0;
  if (max === r) h = ((g - b) / d) % 6;
  else if (max === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  return [(h * 60 + 360) % 360, s, l];
}

export default function ColorWheel({
  bg,
  current,
  apply,
}: {
  bg: Background;
  current: Record<Slot, Accent | null>;
  apply: (slot: Slot, accent: Accent) => void;
}) {
  const [hue, setHue] = useState(325);
  const [sat, setSat] = useState(1);
  const [light, setLight] = useState(0.5);
  const [slot, setSlot] = useState<Slot | null>(null);
  const [hexInput, setHexInput] = useState("");
  const canvas = useRef<HTMLCanvasElement>(null);
  const dragging = useRef(false);

  const hex = hslToHex(hue, sat, light);
  const preview = customAccent(hex);
  const onStage = contrastRatio(hex, bg.base);

  // the wheel: hue around, saturation outward, at the chosen lightness
  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    const ctx = el.getContext("2d");
    if (!ctx) return;
    const img = ctx.createImageData(SIZE, SIZE);
    const r = SIZE / 2;
    for (let y = 0; y < SIZE; y++) {
      for (let x = 0; x < SIZE; x++) {
        const dx = x - r + 0.5;
        const dy = y - r + 0.5;
        const d = Math.sqrt(dx * dx + dy * dy) / r;
        const i = (y * SIZE + x) * 4;
        if (d > 1) continue;
        const h = ((Math.atan2(dy, dx) * 180) / Math.PI + 360) % 360;
        const c = hslToHex(h, Math.min(d, 1), light);
        const n = parseInt(c.slice(1), 16);
        img.data[i] = (n >> 16) & 255;
        img.data[i + 1] = (n >> 8) & 255;
        img.data[i + 2] = n & 255;
        img.data[i + 3] = d > 0.985 ? Math.round(255 * (1 - (d - 0.985) / 0.015)) : 255;
      }
    }
    ctx.putImageData(img, 0, 0);
  }, [light]);

  // live update the targeted slot as the color changes
  useEffect(() => {
    if (slot) apply(slot, customAccent(hex));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hex, slot]);

  const readPointer = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const r = rect.width / 2;
    const dx = e.clientX - rect.left - r;
    const dy = e.clientY - rect.top - r;
    setHue(((Math.atan2(dy, dx) * 180) / Math.PI + 360) % 360);
    setSat(Math.min(Math.sqrt(dx * dx + dy * dy) / r, 1));
  };

  const loadHex = (v: string) => {
    setHexInput(v);
    const m = /^#?([0-9a-f]{6})$/i.exec(v.trim());
    if (!m) return;
    const [h, s, l] = hexToHsl(m[1]);
    setHue(h);
    setSat(s);
    setLight(l);
  };

  // marker position on the wheel
  const rad = (hue * Math.PI) / 180;
  const mx = 50 + Math.cos(rad) * sat * 50;
  const my = 50 + Math.sin(rad) * sat * 50;

  return (
    <details className="wheel">
      <summary>
        Color wheel · pick your own
        <span className="wheel-chip" style={{ background: hex }} />
      </summary>

      <div className="wheel-body">
        <div className="wheel-pad">
          <canvas
            ref={canvas}
            width={SIZE}
            height={SIZE}
            className="wheel-canvas"
            aria-label="Hue and saturation wheel"
            onPointerDown={(e) => {
              dragging.current = true;
              e.currentTarget.setPointerCapture(e.pointerId);
              readPointer(e);
            }}
            onPointerMove={(e) => {
              if (dragging.current) readPointer(e);
            }}
            onPointerUp={(e) => {
              dragging.current = false;
              e.currentTarget.releasePointerCapture(e.pointerId);
            }}
          />
          <span className="wheel-mark" style={{ left: `${mx}%`, top: `${my}%`, background: hex }} />
        </div>

        <label className="wheel-row">
          <span className="ctrl-sub">Lightness</span>
          <input
            type="range"
            min={15}
            max={90}
            value={Math.round(light * 100)}
            onChange={(e) => setLight(Number(e.target.value) / 100)}
            className="wheel-range"
            style={{ "--wheel-hue": hue, "--wheel-sat": `${sat * 100}%` } as React.CSSProperties}
          />
        </label>

        <div className="wheel-row">
          <span className="ctrl-sub">Hex</span>
          <input
            type="text"
            className="wheel-hex"
            value={hexInput || hex.toUpperCase()}
            onChange={(e) => loadHex(e.target.value)}
            onBlur={() => setHexInput("")}
            spellCheck={false}
            aria-label="Hex value"
          />
          <span className="wheel-read" title="Contrast against the current stage. 4.5 clears AA for text.">
            <span className="ctrl-dot" style={{ background: bg.base }} />
            {onStage.toFixed(1)}:1 {onStage >= 4.5 ? "text safe" : onStage >= 3 ? "large text only" : "decoration only"}
          </span>
        </div>

        <div className="wheel-row">
          <span className="ctrl-sub">Send to</span>
          <div className="ctrl-opts">
            {SLOTS.map(({ slot: s, label }) => (
              <button
                key={s}
                className="opt opt-tight"
                aria-pressed={slot === s}
                onClick={() => {
                  if (slot === s) { setSlot(null); return; }
                  setSlot(s);
                  apply(s, preview);
                }}
                title={current[s] ? `${current[s]!.family} ${current[s]!.name} · ${current[s]!.hex}` : "none"}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <p className="rail-note">Pick a slot and it follows the wheel live. Pick it again to let go. The result lands in the share link as custom-{hex.slice(1)}.</p>
      </div>
    </details>
  );
}
