# Wave Backgrounds (Layered SVG Waves)

The flagship technique. Multiple full-width SVG wave layers stacked vertically, each sliding horizontally at a different speed. The sine-curve edges are clearly visible but the fills are **soft and transparent** — think frosted watercolor, not solid paint.

All visual properties are exposed as CSS custom properties so the user can tune transparency, colors, and speed without editing internals.

## Working reference (drop-in HTML)

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Wave background</title>
<style>
  /*
   * Animated wave background — aurora palette
   *
   * Customise these CSS custom properties on .gradient-bg:
   *   --wave-opacity : 0–1, overall wave transparency (default 0.25)
   *   --wave-c1..c4  : the four wave colors
   *   --wave-speed   : animation speed multiplier (0.5 = faster, 2 = slower)
   *   --bg-anchor    : background color behind the waves
   */

  * { box-sizing: border-box; margin: 0; }
  body { min-height: 100vh; font-family: system-ui, sans-serif; color: #fff; }

  .gradient-bg {
    --wave-opacity: 0.25;
    --wave-c1: #7DD3FC;
    --wave-c2: #A78BFA;
    --wave-c3: #F0ABFC;
    --wave-c4: #FDA4AF;
    --wave-speed: 1;
    --bg-anchor: #0F172A;

    position: relative;
    min-height: 100vh;
    overflow: hidden;
    isolation: isolate;
    background: var(--bg-anchor);
  }

  .wave {
    position: absolute;
    width: 200%;
    left: 0;
    will-change: transform;
  }
  .wave svg {
    display: block;
    width: 100%;
    height: auto;
  }

  /* Opacity layers: back waves more transparent, front waves slightly more visible */
  .wave-1 { bottom: 0; opacity: calc(var(--wave-opacity) * 0.6); }
  .wave-2 { bottom: 0; opacity: calc(var(--wave-opacity) * 0.8); }
  .wave-3 { bottom: 0; opacity: calc(var(--wave-opacity) * 1.0); }
  .wave-4 { bottom: 0; opacity: calc(var(--wave-opacity) * 1.4); }

  @media (prefers-reduced-motion: no-preference) {
    .wave-1 { animation: slide1 calc(22s * var(--wave-speed)) linear infinite; }
    .wave-2 { animation: slide2 calc(18s * var(--wave-speed)) linear infinite; }
    .wave-3 { animation: slide3 calc(26s * var(--wave-speed)) linear infinite; }
    .wave-4 { animation: slide4 calc(14s * var(--wave-speed)) linear infinite; }
  }

  @keyframes slide1 { from { transform: translateX(0); }     to { transform: translateX(-50%); } }
  @keyframes slide2 { from { transform: translateX(-50%); }  to { transform: translateX(0); } }
  @keyframes slide3 { from { transform: translateX(-25%); }  to { transform: translateX(-50%); } }
  @keyframes slide4 { from { transform: translateX(-50%); }  to { transform: translateX(-25%); } }

  .content {
    position: relative; z-index: 1;
    display: grid; place-items: center;
    min-height: 100vh; padding: 2rem; text-align: center;
  }
  h1 { font-size: clamp(2.5rem, 8vw, 6rem); font-weight: 800; letter-spacing: -0.03em; }
</style>
</head>
<body>
  <div class="gradient-bg">

    <!-- Wave 1 — tallest, slowest, most transparent (background) -->
    <div class="wave wave-1">
      <svg viewBox="0 0 1440 320" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <path fill="var(--wave-c1)"
              d="M0,160 C180,80 360,240 540,160 C720,80 900,240 1080,160 C1260,80 1440,240 1440,240 L1440,320 L0,320 Z"/>
      </svg>
    </div>

    <!-- Wave 2 — opposite direction -->
    <div class="wave wave-2">
      <svg viewBox="0 0 1440 320" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <path fill="var(--wave-c2)"
              d="M0,200 C160,120 320,280 480,200 C640,120 800,280 960,200 C1120,120 1280,280 1440,200 L1440,320 L0,320 Z"/>
      </svg>
    </div>

    <!-- Wave 3 — tighter frequency -->
    <div class="wave wave-3">
      <svg viewBox="0 0 1440 320" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <path fill="var(--wave-c3)"
              d="M0,224 C120,160 240,288 360,224 C480,160 600,288 720,224 C840,160 960,288 1080,224 C1200,160 1320,288 1440,224 L1440,320 L0,320 Z"/>
      </svg>
    </div>

    <!-- Wave 4 — foreground, slightly more visible, gentle curve -->
    <div class="wave wave-4">
      <svg viewBox="0 0 1440 320" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <path fill="var(--wave-c4)"
              d="M0,256 C240,200 480,312 720,256 C960,200 1200,312 1440,256 L1440,320 L0,320 Z"/>
      </svg>
    </div>

    <div class="content"><h1>Hello.</h1></div>
  </div>
</body>
</html>
```

## User-configurable properties

| Property | Default | What it does |
|---|---|---|
| `--wave-opacity` | `0.25` | Master transparency for all wave layers (0 = invisible, 1 = solid). Each layer scales from this: back wave is 60% of this value, front wave is 140%. |
| `--wave-c1` | `#7DD3FC` | Color of wave 1 (back, tallest) |
| `--wave-c2` | `#A78BFA` | Color of wave 2 |
| `--wave-c3` | `#F0ABFC` | Color of wave 3 |
| `--wave-c4` | `#FDA4AF` | Color of wave 4 (front, most visible) |
| `--wave-speed` | `1` | Animation speed multiplier. `0.5` = twice as fast, `2` = twice as slow. |
| `--bg-anchor` | `#0F172A` | Background color behind the waves |

### Usage examples

```css
/* Pastel, barely-there wash */
.gradient-bg {
  --wave-opacity: 0.15;
  --wave-speed: 2;
}

/* Bold and punchy */
.gradient-bg {
  --wave-opacity: 0.6;
  --wave-speed: 0.7;
}

/* Custom brand colors */
.gradient-bg {
  --wave-c1: #FF6B35;
  --wave-c2: #F7931E;
  --wave-c3: #FFD700;
  --wave-c4: #FFF8DC;
  --bg-anchor: #1A1A2E;
}
```

Users can also set these via inline styles or JavaScript:
```html
<div class="gradient-bg" style="--wave-opacity: 0.4; --wave-speed: 1.5;">
```

## How it works

Each wave is an **inline SVG** with a hand-drawn cubic-bezier wave path. The SVG viewBox is `0 0 1440 320` — the path draws sine-like curves along the top, then fills down to the bottom edge.

The `.wave` wrapper is `200%` wide so the SVG repeats visually. The `translateX` animation slides the entire double-width layer left (or right), and because the path tiles at the 50% mark, the loop is seamless.

The `--wave-speed` multiplier works via `calc()` on the animation duration: `calc(22s * var(--wave-speed))`. A higher multiplier = longer duration = slower movement.

**Why SVG paths instead of clip-path?**
- `clip-path: path()` has inconsistent browser support for `%`-based coordinates.
- Inline SVG scales perfectly via `viewBox` and `preserveAspectRatio="none"`.
- SVG `fill` accepts CSS custom properties, making palette swaps trivial.

## Making waves tile seamlessly

The SVG path must **start and end at the same Y value** so that when two copies sit side-by-side (the 200% width trick), there's no visible seam. The reference paths above all satisfy this.

If you're drawing custom wave paths, ensure:
1. The path starts at `M0,Y` and the last curve ends at `...,1440,Y`
2. The curve peaks/troughs are evenly spaced across the 1440 width
3. The bottom of the path closes with `L1440,320 L0,320 Z`

## Tuning notes

- **Opacity is the main lever.** The default `0.25` gives a soft, pastel watercolor look. For something closer to the reference image (warm pastels bleeding into each other), try `0.15–0.20` with a light `--bg-anchor`. For more presence, `0.4–0.6`.
- **Wave amplitude** controls how "obvious" the wave shape is. In the SVG path, the Y difference between peaks and troughs is the amplitude. The reference uses 80px. For more dramatic waves, increase to 120–160px. For subtle, reduce to 40–60px.
- **Wave frequency** is how many complete sine curves fit in one viewport width. More cycles = choppier. Fewer = rolling swells.
- **Speed layering** (parallax): back waves should move slower than front waves. The reference uses base durations of 22s/18s/26s/14s, all scaled by `--wave-speed`.
- **Light mode:** change `--bg-anchor` to `#FFFFFF` or off-white. The low default opacity works naturally on both light and dark backgrounds.
- **Vertical placement:** waves default to the bottom. For top-waves, set `top: 0` instead of `bottom: 0` and flip the SVG via `style="transform: scaleY(-1)"`.
- **Height control:** change the SVG `viewBox` height and adjust path Y values proportionally.

## Common variations

- **Frosted pastel (like the reference image)** → `--wave-opacity: 0.2`, `--bg-anchor: #FFF5F0`, `--wave-speed: 1.5`, use soft warm colors like `#FFC857` `#FF6B8A` `#7FDBDA` `#FFE0E6`.
- **Full-bleed ocean** → All four waves cover the full viewport height. Use `viewBox="0 0 1440 600"`, start curves at Y=100, increase amplitude to 150px.
- **Subtle footer accent** → Two waves only, `--wave-opacity: 0.15`, `cream` palette, `--wave-speed: 2`.
- **Energetic / playful** → `citrus` palette, add a 5th wave, `--wave-speed: 0.6`, amplitude 120px+.
- **Gradient-filled waves** → Replace `fill="var(--wave-c1)"` with `fill="url(#grad1)"` and define a `<linearGradient>` in the SVG `<defs>`. Each wave can blend two palette colors.
- **Top-edge waves** → Flip the waves to the top of the section for a decorative header edge. Use `style="transform: scaleY(-1)"` on the SVG.
