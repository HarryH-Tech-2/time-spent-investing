/**
 * MeshGradient — smooth animated canvas gradient driven by simplex noise.
 *
 * Usage:
 *   import { MeshGradient } from './mesh-gradient.js';
 *
 *   const mg = new MeshGradient('#my-container', {
 *     palette: 'aurora',      // or a custom colors object (see below)
 *     speed: 0.06,            // time multiplier — 0.03 (barely moving) to 0.15 (rapid)
 *     zoom: 0.6,              // noise scale — 0.3 (broad washes) to 2.5 (tight swirls)
 *     intensity: 0.4,         // color strength — 0.2 (subtle tint) to 0.6 (vivid)
 *     octaves: 1,             // noise layers — 1 (smooth), 2 (some detail), 3 (turbulent)
 *     seed: 42,               // noise seed — change for a different pattern
 *   });
 *
 *   mg.destroy();             // stop animation and clean up
 *
 * Built-in palettes:
 *   'brand'      — green, blue, violet, cyan on dark
 *   'aurora'     — sky, violet, pink, rose on dark
 *   'sunset'     — orange, pink, purple on deep navy
 *   'ocean'      — blue, cyan, teal on slate
 *   'synthwave'  — pink, indigo, cyan on dark
 *   'forest'     — greens, gold on dark
 *   'mono-violet'— single-hue purples on navy
 *   'citrus'     — yellow, orange, pink on white (light mode)
 *   'brand-light'— brand colors on white (light mode)
 *
 * Custom palette:
 *   new MeshGradient('#el', {
 *     palette: {
 *       bg: [255, 255, 255],                       // RGB background
 *       colors: [[14,165,233],[26,122,76],[167,139,250],[6,182,212]],
 *       light: true,                               // true = tint blend, false = additive
 *     }
 *   });
 */

// ── Simplex noise ──
class SimplexNoise {
  constructor(seed = Math.random()) {
    this.grad3 = [
      [1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],
      [1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],
      [0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]
    ];
    this.perm = new Uint8Array(512);
    const p = new Uint8Array(256);
    for (let i = 0; i < 256; i++) p[i] = i;
    let s = seed * 2147483647;
    for (let i = 255; i > 0; i--) {
      s = (s * 16807) % 2147483647;
      const j = s % (i + 1);
      [p[i], p[j]] = [p[j], p[i]];
    }
    for (let i = 0; i < 512; i++) this.perm[i] = p[i & 255];
  }
  noise3D(x, y, z) {
    const F3 = 1/3, G3 = 1/6;
    const s = (x + y + z) * F3;
    const i = Math.floor(x + s), j = Math.floor(y + s), k = Math.floor(z + s);
    const t = (i + j + k) * G3;
    const x0 = x - (i - t), y0 = y - (j - t), z0 = z - (k - t);
    let i1,j1,k1,i2,j2,k2;
    if (x0 >= y0) {
      if (y0 >= z0) { i1=1;j1=0;k1=0;i2=1;j2=1;k2=0; }
      else if (x0 >= z0) { i1=1;j1=0;k1=0;i2=1;j2=0;k2=1; }
      else { i1=0;j1=0;k1=1;i2=1;j2=0;k2=1; }
    } else {
      if (y0 < z0) { i1=0;j1=0;k1=1;i2=0;j2=1;k2=1; }
      else if (x0 < z0) { i1=0;j1=1;k1=0;i2=0;j2=1;k2=1; }
      else { i1=0;j1=1;k1=0;i2=1;j2=1;k2=0; }
    }
    const x1=x0-i1+G3, y1=y0-j1+G3, z1=z0-k1+G3;
    const x2=x0-i2+2*G3, y2=y0-j2+2*G3, z2=z0-k2+2*G3;
    const x3=x0-1+3*G3, y3=y0-1+3*G3, z3=z0-1+3*G3;
    const ii=i&255, jj=j&255, kk=k&255;
    const dot = (g,x,y,z) => g[0]*x+g[1]*y+g[2]*z;
    let n0=0,n1=0,n2=0,n3=0;
    let t0 = 0.6-x0*x0-y0*y0-z0*z0;
    if (t0>0){t0*=t0;n0=t0*t0*dot(this.grad3[this.perm[ii+this.perm[jj+this.perm[kk]]]%12],x0,y0,z0)}
    let t1 = 0.6-x1*x1-y1*y1-z1*z1;
    if (t1>0){t1*=t1;n1=t1*t1*dot(this.grad3[this.perm[ii+i1+this.perm[jj+j1+this.perm[kk+k1]]]%12],x1,y1,z1)}
    let t2 = 0.6-x2*x2-y2*y2-z2*z2;
    if (t2>0){t2*=t2;n2=t2*t2*dot(this.grad3[this.perm[ii+i2+this.perm[jj+j2+this.perm[kk+k2]]]%12],x2,y2,z2)}
    let t3 = 0.6-x3*x3-y3*y3-z3*z3;
    if (t3>0){t3*=t3;n3=t3*t3*dot(this.grad3[this.perm[ii+1+this.perm[jj+1+this.perm[kk+1]]]%12],x3,y3,z3)}
    return 32*(n0+n1+n2+n3);
  }
}

// ── Built-in palettes ──
const PALETTES = {
  'brand':       { bg:[10,17,32],    colors:[[14,165,233],[26,122,76],[167,139,250],[6,182,212]] },
  'aurora':      { bg:[15,23,42],    colors:[[125,211,252],[167,139,250],[240,171,252],[253,164,175]] },
  'sunset':      { bg:[30,27,75],    colors:[[251,146,60],[244,114,182],[168,85,247],[251,146,60]] },
  'ocean':       { bg:[30,41,59],    colors:[[14,165,233],[6,182,212],[20,184,166],[14,165,233]] },
  'synthwave':   { bg:[15,23,42],    colors:[[240,171,252],[129,140,248],[34,211,238],[240,171,252]] },
  'forest':      { bg:[12,20,14],    colors:[[22,163,74],[101,163,13],[250,204,21],[20,83,45]] },
  'mono-violet': { bg:[30,27,75],    colors:[[76,29,149],[124,58,237],[196,181,253],[76,29,149]] },
  'citrus':      { bg:[255,253,245], colors:[[253,224,71],[251,146,60],[244,114,182],[255,255,255]], light:true },
  'brand-light': { bg:[255,255,255], colors:[[14,165,233],[26,122,76],[167,139,250],[6,182,212]], light:true },
};

// ── Defaults ──
const DEFAULTS = {
  palette: 'brand',
  speed: 0.06,
  zoom: 0.6,
  intensity: 0.4,
  octaves: 1,
  seed: 42,
};

const BW = 64, BH = 36;

class MeshGradient {
  constructor(selector, options = {}) {
    const opts = { ...DEFAULTS, ...options };

    // Resolve palette
    if (typeof opts.palette === 'string') {
      const p = PALETTES[opts.palette];
      if (!p) throw new Error(`Unknown palette "${opts.palette}". Available: ${Object.keys(PALETTES).join(', ')}`);
      this._palette = p;
    } else {
      this._palette = opts.palette;
    }

    this._speed = opts.speed;
    this._zoom = opts.zoom;
    this._intensity = opts.intensity;
    this._octaves = opts.octaves;
    this._simplex = new SimplexNoise(opts.seed);
    this._raf = null;

    // DOM setup
    const container = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!container) throw new Error(`Container not found: ${selector}`);

    const style = getComputedStyle(container);
    if (style.position === 'static') container.style.position = 'relative';
    container.style.overflow = 'hidden';

    this._canvas = document.createElement('canvas');
    Object.assign(this._canvas.style, {
      position: 'absolute', inset: '0',
      width: '100%', height: '100%',
      pointerEvents: 'none', zIndex: '0',
    });
    container.insertBefore(this._canvas, container.firstChild);

    // Ensure content sits above
    for (const child of container.children) {
      if (child !== this._canvas && getComputedStyle(child).position === 'static') {
        child.style.position = 'relative';
        child.style.zIndex = '1';
      }
    }

    this._ctx = this._canvas.getContext('2d');
    this._ctx.imageSmoothingEnabled = true;
    this._ctx.imageSmoothingQuality = 'high';

    this._offscreen = document.createElement('canvas');
    this._offscreen.width = BW;
    this._offscreen.height = BH;
    this._offCtx = this._offscreen.getContext('2d');
    this._imageData = this._offCtx.createImageData(BW, BH);

    this._onResize = () => this._resize();
    window.addEventListener('resize', this._onResize);
    this._resize();
    this._render = this._render.bind(this);
    this._raf = requestAnimationFrame(this._render);
  }

  _resize() {
    const rect = this._canvas.parentElement.getBoundingClientRect();
    this._canvas.width = Math.floor(rect.width);
    this._canvas.height = Math.floor(rect.height);
  }

  _fbm(x, y, z) {
    let val = 0, amp = 1, freq = 1, total = 0;
    for (let o = 0; o < this._octaves; o++) {
      val += this._simplex.noise3D(x * freq, y * freq, z * freq) * amp;
      total += amp;
      amp *= 0.5;
      freq *= 2.0;
    }
    return val / total;
  }

  _render(time) {
    const { _canvas: canvas, _ctx: ctx, _offscreen: off, _offCtx: offCtx,
            _imageData: imageData, _palette: pal, _speed: speed,
            _zoom: zoom, _intensity: intensity } = this;
    if (canvas.width === 0 || canvas.height === 0) {
      this._raf = requestAnimationFrame(this._render);
      return;
    }

    const data = imageData.data;
    const [bgR, bgG, bgB] = pal.bg;
    const colors = pal.colors;
    const isLight = pal.light || false;
    const t = time * 0.001 * speed;

    for (let y = 0; y < BH; y++) {
      const ny = y / BH * zoom;
      for (let x = 0; x < BW; x++) {
        const nx = x / BW * zoom;
        let r = bgR, g = bgG, b = bgB;

        for (let c = 0; c < colors.length; c++) {
          const n = this._fbm(
            nx * 2.2 + c * 1.7,
            ny * 2.2 + c * 2.3,
            t + c * 0.5
          );
          const raw = (n + 1) * 0.5;
          const influence = raw * raw * (3 - 2 * raw) * intensity;

          if (isLight) {
            r += (colors[c][0] - r) * influence;
            g += (colors[c][1] - g) * influence;
            b += (colors[c][2] - b) * influence;
          } else {
            r += colors[c][0] * influence;
            g += colors[c][1] * influence;
            b += colors[c][2] * influence;
          }
        }

        const idx = (y * BW + x) * 4;
        data[idx]     = Math.min(255, r) | 0;
        data[idx + 1] = Math.min(255, g) | 0;
        data[idx + 2] = Math.min(255, b) | 0;
        data[idx + 3] = 255;
      }
    }

    offCtx.putImageData(imageData, 0, 0);
    ctx.drawImage(off, 0, 0, canvas.width, canvas.height);
    this._raf = requestAnimationFrame(this._render);
  }

  destroy() {
    if (this._raf) cancelAnimationFrame(this._raf);
    window.removeEventListener('resize', this._onResize);
    this._canvas.remove();
  }
}

export { MeshGradient, PALETTES };
