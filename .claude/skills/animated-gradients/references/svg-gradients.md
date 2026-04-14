# SVG Animated Gradients

Use when the gradient must follow a non-rectangular shape — text outlines, logo paths, icons, charts. CSS `background-clip: text` handles the text case in many situations; SVG handles everything else.

## Animated linear gradient inside an SVG shape

```html
<svg viewBox="0 0 400 200" width="400" height="200">
  <defs>
    <linearGradient id="aurora" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%"   stop-color="#7DD3FC">
        <animate attributeName="stop-color"
                 values="#7DD3FC; #A78BFA; #F0ABFC; #7DD3FC"
                 dur="14s" repeatCount="indefinite" />
      </stop>
      <stop offset="50%"  stop-color="#A78BFA">
        <animate attributeName="stop-color"
                 values="#A78BFA; #F0ABFC; #FDA4AF; #A78BFA"
                 dur="14s" repeatCount="indefinite" />
      </stop>
      <stop offset="100%" stop-color="#F0ABFC">
        <animate attributeName="stop-color"
                 values="#F0ABFC; #FDA4AF; #7DD3FC; #F0ABFC"
                 dur="14s" repeatCount="indefinite" />
      </stop>
    </linearGradient>
  </defs>
  <rect width="400" height="200" rx="24" fill="url(#aurora)" />
</svg>
```

`<animate>` on `stop-color` is the SVG-native way. It's well-supported but **not GPU-accelerated** — keep the SVG modest in size (under ~800px on the longest side) or framerate will drop.

## Sliding gradient via animated `x1`/`x2`

Cheaper than animating colors, gives a "sweep" effect:

```html
<linearGradient id="sweep" x1="0" y1="0" x2="0.5" y2="0">
  <animate attributeName="x1" values="-1; 1" dur="6s" repeatCount="indefinite" />
  <animate attributeName="x2" values="0; 2"  dur="6s" repeatCount="indefinite" />
  <stop offset="0%"  stop-color="#7DD3FC" />
  <stop offset="50%" stop-color="#FFFFFF" />
  <stop offset="100%" stop-color="#7DD3FC" />
</linearGradient>
```

This is the technique behind shimmer / skeleton-loader effects.

## Gradient text via SVG (when CSS `background-clip` isn't enough)

```html
<svg viewBox="0 0 600 120" width="100%" height="auto">
  <defs>
    <linearGradient id="textGrad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%"  stop-color="#7DD3FC">
        <animate attributeName="offset" values="-0.5; 0.5" dur="4s" repeatCount="indefinite" />
      </stop>
      <stop offset="100%" stop-color="#F0ABFC">
        <animate attributeName="offset" values="0.5; 1.5" dur="4s" repeatCount="indefinite" />
      </stop>
    </linearGradient>
  </defs>
  <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle"
        font-family="system-ui" font-weight="800" font-size="80"
        fill="url(#textGrad)">Hello.</text>
</svg>
```

## Reduced-motion handling

SVG `<animate>` doesn't respect `prefers-reduced-motion` automatically. Wrap the SVG in CSS:

```css
@media (prefers-reduced-motion: reduce) {
  svg animate { display: none; }
}
```

Or use JS to set `animate.beginElement()` / pause based on the media query.
