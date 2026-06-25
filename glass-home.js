import { PhysicalGlass, initGlassManager, needsGlassFallback } from "./glass-refraction.js?v=21";

function debounce(fn, wait = 120) {
  let timer = 0;
  return (...args) => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => fn(...args), wait);
  };
}

function initHomeGlass() {
  const pageBg = document.getElementById("page-bg");
  if (!pageBg) return [];

  const manager = initGlassManager(pageBg);
  const panels = [];

  document.querySelectorAll('[data-physical-glass]:not([data-physical-glass="lazy"])').forEach((el) => {
    try {
      const glass = new PhysicalGlass(el);
      glass.bindBackground(pageBg);
      glass.attachManager(manager);
      panels.push(glass);
    } catch (err) {
      console.warn("PhysicalGlass panel skipped:", el, err);
      el.classList.add("physical-glass--fallback");
    }
  });

  if (needsGlassFallback()) {
    document.documentElement.classList.add("glass-fallback");
  } else {
    document.documentElement.classList.add("glass-refraction");
  }

  initLazyDropdownGlass(panels, manager);

  const debouncedRebuild = debounce(() => {
    panels.forEach((p) => p.scheduleRebuild());
    manager.queueSync();
  }, 150);

  window.addEventListener("resize", debouncedRebuild);
  document.getElementById("theme-toggle")?.addEventListener("click", () => {
    window.setTimeout(debouncedRebuild, 360);
  });

  manager.queueSync();
  return panels;
}

function initLazyDropdownGlass(panels, manager) {
  const lazyRoots = document.querySelectorAll('[data-physical-glass="lazy"]');
  if (!lazyRoots.length) return;

  const lazyGlass = [];

  lazyRoots.forEach((el) => {
    const glass = new PhysicalGlass(el);
    glass.bindBackground(document.getElementById("page-bg"));
    glass.manager = manager;
    panels.push(glass);
    lazyGlass.push(glass);

    const item = el.closest(".hover-dropdown");
    if (!item) return;

    const wake = () => {
      glass.enable();
      manager.queueSync();
    };

    item.addEventListener("mouseenter", wake, { once: true, passive: true });
    item.addEventListener("focusin", wake, { once: true });
  });

  document.querySelector(".header-cluster")?.addEventListener(
    "mouseenter",
    () => {
      lazyGlass.forEach((glass) => {
        if (!glass.isEnabled()) glass.enable();
      });
      manager.queueSync();
    },
    { once: true, passive: true },
  );
}

function boot() {
  try {
    initHomeGlass();
  } catch (err) {
    console.error("glass-home boot failed:", err);
    document.documentElement.classList.add("glass-fallback");
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}
