---
name: animated-gradients
description: Generate animated CSS, SVG, and canvas gradient backgrounds and components. Use whenever the user asks for animated gradients, gradient backgrounds, mesh gradients, aurora effects, flowing color backgrounds, gradient hero sections, CSS keyframe gradient animations, SVG animated gradients, conic gradient spinners, or any moving/shifting color backdrop. Trigger on phrases like "animated background", "gradient animation", "moving gradient", "aurora effect", "liquid gradient", "mesh background", "shifting colors", "color flow", "gradient hero", or "ambient background".
---

# Animated Gradients

Build smooth, performant, distinctive animated gradient backgrounds. Default to taste and restraint — gradients should feel ambient, not seasick.

## Decision tree: pick the right technique

Before writing code, classify the request:

1. **Smooth mesh / flowing / organic gradient** (the default) → **Canvas 2D with simplex noise**, rendered to a tiny offscreen buffer and upscaled with bilinear interpolation. Produces seamless, flowing color fields with no visible blob edges. This is the preferred technique for most requests. See `references/canvas-noise.md`.

2. **Simple two-to-four-stop loop** (gradient that slides or hue-shifts) → **CSS linear/radial with animated `background-position` or `filter: hue-rotate`**. Cheapest, ships everywhere. See `references/css-basics.md`.

3. **Layered radial blob background** (explicit blob aesthetic wanted) → **Layered radial gradients on absolutely-positioned divs, animated with `transform: translate` + `filter: blur`**. See `references/mesh-aurora.md`.

4. **Conic / rotating / orb / halo** → **CSS conic-gradient with `transform: rotate` animation**, or a pseudo-element with `mask` for ring shapes. See `references/conic.md`.

5. **Shaped gradient** (gradient that fills text, an SVG path, a logo) → **SVG `<linearGradient>` / `<radialGradient>` with `<animate>` on stops, or CSS `background-clip: text`**. See `references/svg-gradients.md`.

**If the user is vague** ("nice animated background", "gradient for my hero"), **default to option 1 (canvas mesh gradient)** with the `aurora` palette — it's the smoothest, most distinctive, and highest hit rate.

## User-configurable options

When generating a canvas mesh gradient, always ask the user (or use defaults) for these options:

| Option | Range | Default | What it controls |
|---|---|---|---|
| **palette** | 9 built-in names or custom RGB object | `'aurora'` | Color scheme |
| **speed** | 0.03 – 0.15 | 0.06 | How fast colors flow. 0.03 = glacial, 0.06 = gentle, 0.15 = rapid |
| **zoom** | 0.3 – 2.5 | 0.6 | Pattern scale. 0.3 = huge soft washes, 1.0 = medium, 2.5 = tight swirls |
| **intensity** | 0.2 – 0.6 | 0.4 | Color strength. 0.2 = barely there, 0.4 = balanced, 0.6 = vivid |
| **octaves** | 1, 2, or 3 | 1 | Noise layers. 1 = smooth, 2 = some texture, 3 = turbulent detail |
| **seed** | any number | 42 | Random seed — same seed = same pattern across loads |

### Built-in palettes

| Name | Background | Vibe |
|---|---|---|
| `'brand'` | Dark navy | Green, blue, violet, cyan — generic brand |
| `'aurora'` | Dark navy | Sky, violet, pink, rose — cool dawn (default) |
| `'sunset'` | Deep indigo | Orange, pink, purple — warm dramatic |
| `'ocean'` | Slate | Blue, cyan, teal — corporate but alive |
| `'synthwave'` | Dark navy | Pink, indigo, cyan — retro-futurist |
| `'forest'` | Dark green | Greens, gold — earthy, unusual |
| `'mono-violet'` | Deep navy | Purple shades — single-hue, sophisticated |
| `'citrus'` | Warm white | Yellow, orange, pink — bright editorial (light mode) |
| `'brand-light'` | White | Brand colors on white — for light-mode sites |

### Custom palette format

```js
{
  bg: [255, 255, 255],        // RGB background
  colors: [                    // 3–5 RGB color arrays
    [14, 165, 233],
    [26, 122, 76],
    [167, 139, 250],
    [6, 182, 212],
  ],
  light: true,                 // true for light bg (tint blend), false for dark bg (additive blend)
}
```

If the user supplies brand colors (hex or named), convert them to RGB arrays and add one neutral anchor (deep navy or off-white) as the background.

### Preset combos for common vibes

When the user describes a vibe rather than specific numbers, map to these:

| Vibe | Settings |
|---|---|
| "gentle" / "ambient" / "subtle" | speed: 0.03, zoom: 0.4, intensity: 0.25, octaves: 1 |
| "default" / "nice" / "smooth" | speed: 0.06, zoom: 0.6, intensity: 0.4, octaves: 1 |
| "rich" / "vivid" / "bold" | speed: 0.06, zoom: 0.7, intensity: 0.55, octaves: 1 |
| "energetic" / "fast" / "dynamic" | speed: 0.14, zoom: 1.5, intensity: 0.4, octaves: 2 |
| "turbulent" / "plasma" / "chaotic" | speed: 0.12, zoom: 2.0, intensity: 0.5, octaves: 3 |
| "barely there" / "editorial" | speed: 0.04, zoom: 0.5, intensity: 0.3, octaves: 1 |

## Non-negotiable rules

- **Offscreen buffer upscale pattern.** Always render noise to a tiny canvas (64x36) and upscale via `ctx.drawImage()` with `imageSmoothingQuality: 'high'`. Never render noise at full resolution — it's slow and doesn't look better.
- **Use `prefers-reduced-motion`.** For canvas gradients, check `window.matchMedia('(prefers-reduced-motion: reduce)')` and either pause the animation or render a single static frame. This is non-optional.
- **Contain the gradient.** The gradient canvas must be `position: absolute; inset: 0` inside a `position: relative; overflow: hidden` container. Content inside the container gets `position: relative; z-index: 1`.
- **Performance budget.** The 64x36 buffer keeps each frame at ~2,300 noise samples — fine for 60fps. Never exceed 128x72 per panel.

### For CSS blob technique (option 3) only:
- **GPU-accelerate everything.** Animate `transform` and `opacity` only.
- **Default duration: 12–24s, `ease-in-out`, `infinite`, `alternate`.**
- **Blur generously.** `filter: blur(60px)` to `blur(120px)`.

## Reusable module

A standalone ES module implementation exists at `examples/mesh-gradient.js`. When generating for a project that uses ES modules, reference or copy this file:

```js
import { MeshGradient } from './mesh-gradient.js';

const mg = new MeshGradient('#container', {
  palette: 'aurora',
  speed: 0.06,
  zoom: 0.6,
  intensity: 0.4,
  octaves: 1,
  seed: 42,
});

// Later: mg.destroy();
```

When the project doesn't use modules, embed the SimplexNoise + MeshGradient classes inline in a `<script>` tag.

## Output format

When delivering a gradient component:

1. **Ask the user** which palette and vibe they want, or suggest based on their site's existing colors and theme (light vs dark).
2. Single self-contained file when possible (HTML with inline `<script>`, or a single framework component).
3. **Always include reduced-motion handling.**
4. Include a comment at the top noting the technique and settings used (e.g. `/* Canvas mesh gradient — aurora, speed:0.06, zoom:0.6, intensity:0.4, octaves:1 */`).
5. End the response listing the options used and what each one does, so the user knows how to tweak.

## When the user asks for something this skill shouldn't do

- **Static gradients only** → Don't trigger; just write the CSS plainly.
- **Gradient + complex 3D / particles / fluid sim** → This skill covers up to canvas noise; for true fluid sim or three.js scenes, say so and offer the gradient layer as a backdrop only.
- **Gradient image generation** (PNG/JPG output) → Out of scope — this skill is for live, rendered gradients.
