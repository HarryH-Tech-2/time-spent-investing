# CSS Gradient Basics & Conic

For simple cases — a flowing two-to-four-stop gradient, or a rotating conic.

## Sliding linear gradient

The classic. Cheap, well-supported, a bit overdone — use only when the design calls for restraint.

```css
.flow-bg {
  background: linear-gradient(
    120deg,
    #7DD3FC, #A78BFA, #F0ABFC, #FDA4AF, #7DD3FC
  );
  background-size: 300% 300%;
  animation: flow 18s ease-in-out infinite;
}
@keyframes flow {
  0%, 100% { background-position: 0% 50%; }
  50%      { background-position: 100% 50%; }
}
@media (prefers-reduced-motion: reduce) {
  .flow-bg { animation: none; background-position: 50% 50%; }
}
```

Note the **repeated first color** at the end of the stop list — this prevents the visible "snap" at loop boundaries.

## Hue-rotate accent

For a single-color brand gradient where you want subtle life:

```css
.hue-bg {
  background: linear-gradient(135deg, #7C3AED, #C4B5FD);
  animation: hue 20s linear infinite;
}
@keyframes hue {
  to { filter: hue-rotate(360deg); }
}
```

`hue-rotate` is one of the few filter properties that's cheap to animate. Keep the rotation slow (`linear` is fine here because it's continuous, not a back-and-forth loop).

## Conic gradient — rotating orb / halo

```css
.orb {
  width: 400px; height: 400px;
  border-radius: 50%;
  background: conic-gradient(from 0deg, #7DD3FC, #A78BFA, #F0ABFC, #FDA4AF, #7DD3FC);
  filter: blur(20px);
  animation: spin 14s linear infinite;
  will-change: transform;
}
@keyframes spin { to { transform: rotate(360deg); } }
```

For a **ring** instead of a filled orb, mask the center:

```css
.ring {
  /* ...same as .orb... */
  mask: radial-gradient(circle, transparent 55%, #000 56%);
  -webkit-mask: radial-gradient(circle, transparent 55%, #000 56%);
}
```

## Animated gradient text

```css
.gradient-text {
  background: linear-gradient(90deg, #7DD3FC, #A78BFA, #F0ABFC, #7DD3FC);
  background-size: 200% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: flow 6s linear infinite;
}
@keyframes flow {
  to { background-position: 200% 0; }
}
```

Faster duration (6s) is acceptable here because it's a small element, not a full-screen loop.
