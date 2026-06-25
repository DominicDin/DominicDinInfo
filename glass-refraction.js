/**
 * Physical glass refraction — squircle dome + Snell's law (n = 1.5).
 * Generates an SVG feDisplacementMap from surface normals of a rounded-rect SDF.
 * Cross-browser: full refraction (Blink/Gecko), compositor fallback (WebKit).
 */

const IOR = 1.5;
const NEUTRAL = 128;

/** Safari / WebKit cannot reliably use feImage-driven displacement maps. */
export function needsGlassFallback() {
  if (typeof CSS === "undefined" || !CSS.supports) return false;
  const ua = navigator.userAgent;
  const isWebKit = /AppleWebKit/i.test(ua) && !/Chrome|Chromium|Edg|OPR|Firefox/i.test(ua);
  return isWebKit || !CSS.supports("backdrop-filter", "blur(1px)");
}

function roundedBoxSDF(px, py, w, h, r) {
  const cx = w * 0.5;
  const cy = h * 0.5;
  const qx = Math.abs(px - cx) - (w * 0.5 - r);
  const qy = Math.abs(py - cy) - (h * 0.5 - r);
  const ax = Math.max(qx, 0);
  const ay = Math.max(qy, 0);
  return Math.hypot(ax, ay) + Math.min(Math.max(qx, qy), 0) - r;
}

function sdfNormal(sdf, x, y) {
  const e = 0.75;
  const dx = sdf(x + e, y) - sdf(x - e, y);
  const dy = sdf(x, y + e) - sdf(x, y - e);
  const len = Math.hypot(dx, dy) || 1;
  return [dx / len, dy / len];
}

/** x: 0 at rim, 1 at flat centre — squircle dome slope. */
function squircleSlope(x) {
  if (x <= 0) return 8;
  if (x >= 1) return 0;
  const t = 1 - x;
  const denom = 1 - t ** 4;
  if (denom <= 1e-6) return 0;
  return t ** 3 / denom ** 0.75;
}

function snellBend(slope) {
  const thetaI = Math.atan(slope);
  const sinT = Math.sin(thetaI) / IOR;
  if (Math.abs(sinT) >= 1) return 0;
  const thetaT = Math.asin(sinT);
  return Math.sin(thetaI - thetaT);
}

/**
 * Build RGB displacement map.
 * R/G: 128 = no shift; B: specular rim height.
 */
export function buildDisplacementMap(width, height, { radius = 24, rimWidth = 36, gain = 32, maxDim = 420 } = {}) {
  const srcW = Math.max(4, Math.round(width));
  const srcH = Math.max(4, Math.round(height));
  const longest = Math.max(srcW, srcH);
  const scale = longest > maxDim ? maxDim / longest : 1;
  const w = Math.max(4, Math.round(srcW * scale));
  const h = Math.max(4, Math.round(srcH * scale));
  const r = Math.min(radius * scale, w * 0.5 - 1, h * 0.5 - 1);
  const rim = Math.max(8, rimWidth * scale);
  const data = new Uint8ClampedArray(w * h * 4);
  const sdf = (x, y) => roundedBoxSDF(x, y, w, h, r);

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      const dist = sdf(x + 0.5, y + 0.5);

      if (dist > 0.5) {
        data[i] = NEUTRAL;
        data[i + 1] = NEUTRAL;
        data[i + 2] = 0;
        data[i + 3] = 255;
        continue;
      }

      const depth = Math.min(-dist / rim, 1);
      const slope = squircleSlope(depth);
      const bend = snellBend(slope);
      const [nx, ny] = sdfNormal(sdf, x + 0.5, y + 0.5);

      data[i] = Math.round(Math.min(255, Math.max(0, NEUTRAL + nx * bend * gain)));
      data[i + 1] = Math.round(Math.min(255, Math.max(0, NEUTRAL + ny * bend * gain)));
      data[i + 2] = Math.round(Math.min(255, (1 - depth) ** 0.35 * slope * 22));
      data[i + 3] = 255;
    }
  }

  return { width: w, height: h, data };
}

function mapToDataUrl(map) {
  const canvas = document.createElement("canvas");
  canvas.width = map.width;
  canvas.height = map.height;
  const ctx = canvas.getContext("2d");
  ctx.putImageData(new ImageData(map.data, map.width, map.height), 0, 0);
  return canvas.toDataURL("image/png");
}

let svgRoot = null;

function ensureSvgRoot() {
  if (svgRoot) return svgRoot;
  svgRoot = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svgRoot.setAttribute("aria-hidden", "true");
  svgRoot.style.cssText = "position:absolute;width:0;height:0;overflow:hidden;pointer-events:none";
  document.body.appendChild(svgRoot);
  return svgRoot;
}

function buildFilterDef(id, mapUrl, scale, chroma) {
  const chromaSpread = chroma * 0.22;
  const scales = [scale, scale * (1 - chromaSpread), scale * (1 + chromaSpread)];

  return `
    <filter id="${id}" x="-12%" y="-12%" width="124%" height="124%" color-interpolation-filters="sRGB">
      <feImage href="${mapUrl}" result="disp" preserveAspectRatio="none" />
      <feDisplacementMap in="SourceGraphic" in2="disp" scale="${scales[0]}" xChannelSelector="R" yChannelSelector="G" result="rPass" />
      <feColorMatrix in="rPass" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="rChan" />
      <feDisplacementMap in="SourceGraphic" in2="disp" scale="${scales[1]}" xChannelSelector="R" yChannelSelector="G" result="gPass" />
      <feColorMatrix in="gPass" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="gChan" />
      <feDisplacementMap in="SourceGraphic" in2="disp" scale="${scales[2]}" xChannelSelector="R" yChannelSelector="G" result="bPass" />
      <feColorMatrix in="bPass" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="bChan" />
      <feBlend in="rChan" in2="gChan" mode="screen" result="rg" />
      <feBlend in="rg" in2="bChan" mode="screen" result="refracted" />
      <feComponentTransfer in="disp" result="specMask">
        <feFuncR type="discrete" tableValues="0" />
        <feFuncG type="discrete" tableValues="0" />
        <feFuncB type="linear" slope="0.55" intercept="0" />
      </feComponentTransfer>
      <feBlend in="refracted" in2="specMask" mode="screen" />
    </filter>
  `;
}

export const GLASS_PRESETS = {
  hero: { radius: 22, rimWidth: 42, gain: 34, scale: -44, chroma: 0.16, frost: 0.8 },
  dropdown: { radius: 18, rimWidth: 40, gain: 38, scale: -52, chroma: 0.2, frost: 0.55 },
  panel: { radius: 18, rimWidth: 34, gain: 28, scale: -34, chroma: 0.11, frost: 1 },
  bar: { radius: 14, rimWidth: 28, gain: 26, scale: -30, chroma: 0.1, frost: 1 },
  sidebar: { radius: 14, rimWidth: 26, gain: 22, scale: -26, chroma: 0.08, frost: 1.5 },
};

let manager = null;

export class GlassManager {
  constructor(bgSource) {
    this.bgSource = bgSource;
    this.panels = new Set();
    this.syncQueued = false;
  }

  register(panel) {
    panel.manager = this;
    this.panels.add(panel);
  }

  unregister(panel) {
    this.panels.delete(panel);
  }

  /** Sync all panels — call on scroll/resize/theme/bg change, not every frame. */
  syncAll() {
    this.panels.forEach((p) => {
      if (p.isActive()) p.syncBackground();
    });
  }

  queueSync() {
    if (this.syncQueued) return;
    this.syncQueued = true;
    requestAnimationFrame(() => {
      this.syncQueued = false;
      this.syncAll();
    });
  }

  bindEvents() {
    if (this._bound) return;
    this._bound = true;
    const onMove = () => this.queueSync();
    window.addEventListener("scroll", onMove, { passive: true });
    window.addEventListener("resize", onMove, { passive: true });
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) this.queueSync();
    });
  }

  stop() {
    this.panels.clear();
  }
}

export function initGlassManager(bgSource) {
  if (!manager) {
    manager = new GlassManager(bgSource);
    manager.bindEvents();
  }
  return manager;
}

export class PhysicalGlass {
  constructor(root, options = {}) {
    this.root = root;
    const preset = GLASS_PRESETS[root.dataset.glassPreset] || {};
    this.opts = {
      radius: 20,
      rimWidth: 34,
      gain: 30,
      scale: -38,
      chroma: 0.12,
      frost: 1.2,
      tint: 0.06,
      ...preset,
      ...options,
    };
    this.filterId = `pg-${Math.random().toString(36).slice(2, 9)}`;
    this.fallback = needsGlassFallback();
    this.backdrop = null;
    this.backdropInner = null;
    this.specular = null;
    this.bgSource = null;
    this.manager = null;
    this.ro = null;
    this.rebuildTimer = 0;
    this._enabled = root.getAttribute("data-physical-glass") !== "lazy";

    if (this._enabled) {
      this.ensureContentWrapper();
      this.mount();
    }
  }

  enable() {
    if (this._enabled) return;
    this._enabled = true;
    this.ensureContentWrapper();
    this.mount();
    if (this.bgSource) {
      this.syncBackground();
      this.scheduleRebuild();
    }
    if (this.manager) {
      this.manager.register(this);
      this.manager.queueSync();
    }
  }

  isEnabled() {
    return this._enabled;
  }

  isActive() {
    if (!this._enabled) return false;
    const rect = this.root.getBoundingClientRect();
    if (rect.width < 2 || rect.height < 2) return false;
    if (rect.bottom < 0 || rect.top > window.innerHeight) return false;
    return true;
  }

  ensureContentWrapper() {
    if (this.root.querySelector(".physical-glass__content")) return;
    const wrap = document.createElement("div");
    wrap.className = "physical-glass__content";
    while (this.root.firstChild) wrap.appendChild(this.root.firstChild);
    this.root.appendChild(wrap);
  }

  mount() {
    this.root.classList.add("physical-glass");
    if (this.fallback) {
      this.root.classList.add("physical-glass--fallback");
      this.mountFallback();
      return;
    }

    this.backdrop = document.createElement("div");
    this.backdrop.className = "physical-glass__backdrop";
    this.backdropInner = document.createElement("div");
    this.backdropInner.className = "physical-glass__backdrop-inner";
    this.backdrop.appendChild(this.backdropInner);

    this.specular = document.createElement("div");
    this.specular.className = "physical-glass__specular";
    this.specular.setAttribute("aria-hidden", "true");

    const content = this.root.querySelector(".physical-glass__content");
    this.root.insertBefore(this.backdrop, content || this.root.firstChild);
    this.root.insertBefore(this.specular, content || null);

    this.scheduleRebuild();
    this.ro = new ResizeObserver(() => this.scheduleRebuild());
    this.ro.observe(this.root);
  }

  scheduleRebuild() {
    if (!this._enabled) return;
    window.clearTimeout(this.rebuildTimer);
    this.rebuildTimer = window.setTimeout(() => this.rebuildFilter(), 80);
  }

  mountFallback() {
    this.specular = document.createElement("div");
    this.specular.className = "physical-glass__specular physical-glass__specular--fallback";
    this.specular.setAttribute("aria-hidden", "true");
    const content = this.root.querySelector(".physical-glass__content");
    this.root.insertBefore(this.specular, content || this.root.firstChild);
  }

  rebuildFilter() {
    if (this.fallback || !this._enabled) return;
    const rect = this.root.getBoundingClientRect();
    const w = Math.max(1, rect.width);
    const h = Math.max(1, rect.height);
    if (w < 2 || h < 2) return;

    let map;
    try {
      map = buildDisplacementMap(w, h, this.opts);
      const mapUrl = mapToDataUrl(map);

      const root = ensureSvgRoot();
      const existing = root.querySelector(`#${this.filterId}`);
      if (existing) existing.remove();

      const wrapper = document.createElementNS("http://www.w3.org/2000/svg", "g");
      wrapper.innerHTML = buildFilterDef(this.filterId, mapUrl, this.opts.scale, this.opts.chroma);
      const filterNode = wrapper.firstElementChild;
      if (!filterNode) return;
      root.appendChild(filterNode);

      if (!this.backdrop) return;
      this.backdrop.style.filter = `url(#${this.filterId})`;
      this.backdrop.style.webkitFilter = `url(#${this.filterId})`;
      if (this.opts.frost > 0) {
        this.backdrop.style.backdropFilter = `blur(${this.opts.frost}px) saturate(1.25)`;
        this.backdrop.style.webkitBackdropFilter = `blur(${this.opts.frost}px) saturate(1.25)`;
      }
    } catch (err) {
      console.warn("PhysicalGlass rebuild failed:", err);
      this.root.classList.add("physical-glass--fallback");
      if (!this.fallback) {
        this.fallback = true;
        if (this.backdrop) this.backdrop.remove();
        this.mountFallback();
      }
    }
  }

  bindBackground(sourceEl) {
    this.bgSource = sourceEl;
    if (this._enabled) this.syncBackground();
  }

  attachManager(glassManager) {
    this.manager = glassManager;
    if (this._enabled) {
      glassManager.register(this);
      glassManager.queueSync();
    }
  }

  syncBackground() {
    if (!this.bgSource || this.fallback || !this.backdropInner) return;
    const panel = this.root.getBoundingClientRect();
    if (panel.width < 1 || panel.height < 1) return;

    const src = this.bgSource;
    const slide = src.querySelector(".bg-slide.is-active") || src.querySelector(".bg-slide");
    const bgEl = src.querySelector(".bg-fixed") || src;
    const gradEl = src.querySelector(".bg-gradient");

    this.backdropInner.style.width = `${window.innerWidth}px`;
    this.backdropInner.style.height = `${window.innerHeight}px`;
    this.backdropInner.style.transform = `translate3d(${-panel.left}px, ${-panel.top}px, 0)`;

    if (slide) {
      const img = slide.dataset.src || slide.style.backgroundImage;
      if (img) {
        this.backdropInner.style.backgroundImage = img.startsWith("url") ? img : `url("${img}")`;
      }
      this.backdropInner.style.backgroundSize = "cover";
      this.backdropInner.style.backgroundPosition = "center";
      return;
    }

    const bgCs = getComputedStyle(bgEl);
    const layers = [];
    if (gradEl) {
      const gCs = getComputedStyle(gradEl);
      if (gCs.backgroundImage && gCs.backgroundImage !== "none") layers.push(gCs.backgroundImage);
    }
    if (bgCs.backgroundImage && bgCs.backgroundImage !== "none") layers.push(bgCs.backgroundImage);
    this.backdropInner.style.backgroundImage = layers.join(", ") || "none";
    this.backdropInner.style.backgroundSize = layers.length > 1 ? "cover, cover" : bgCs.backgroundSize;
    this.backdropInner.style.backgroundPosition = layers.length > 1 ? "center, center" : bgCs.backgroundPosition;
    this.backdropInner.style.filter = bgCs.filter !== "none" ? bgCs.filter : "";
    this.backdropInner.style.opacity = bgCs.opacity;
  }

  destroy() {
    window.clearTimeout(this.rebuildTimer);
    this.manager?.unregister(this);
    this.ro?.disconnect();
    svgRoot?.querySelector(`#${this.filterId}`)?.remove();
  }
}
