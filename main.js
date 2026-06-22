/**
 * Personal homepage interactions
 * GitHub username: DominicDin
 */

const GITHUB_USER = "DominicDin";

const PROFILE_FALLBACK = {
  login: "DominicDin",
  name: "DominicDin",
  bio: "Ocean University of China / Major in CS and AI",
  avatar_url: "https://avatars.githubusercontent.com/u/96225447?v=4",
  html_url: "https://github.com/DominicDin",
  location: "Shanghai",
  blog: "",
  public_repos: 5,
  created_at: "2021-12-16T06:33:17Z",
  company: "Ocean University of China",
};

const PRIMARY_LANGUAGE = "Python";

const REPOS_FALLBACK = [
  { name: "AiAgent_AShare", description: "", language: "Python", html_url: "https://github.com/DominicDin/AiAgent_AShare", stargazers_count: 0 },
  { name: "A_Share_investment_Agent", description: "", language: "Python", html_url: "https://github.com/DominicDin/A_Share_investment_Agent", stargazers_count: 0 },
  { name: "D3MEP", description: "", language: null, html_url: "https://github.com/DominicDin/D3MEP", stargazers_count: 0 },
  { name: "teest", description: "这是一个测试项目", language: "Jupyter Notebook", html_url: "https://github.com/DominicDin/teest", stargazers_count: 0 },
  { name: "Java", description: "27天成为Java大神", language: null, html_url: "https://github.com/DominicDin/Java", stargazers_count: 0 },
];

/* ── Theme ── */

const html = document.documentElement;
const themeToggle = document.getElementById("theme-toggle");
const storedTheme = localStorage.getItem("theme");

if (storedTheme) {
  html.setAttribute("data-theme", storedTheme);
}

themeToggle?.addEventListener("click", () => {
  const current = html.getAttribute("data-theme");
  let next;

  if (current === "light") {
    next = "dark";
  } else if (current === "dark") {
    next = "light";
  } else {
    next = window.matchMedia("(prefers-color-scheme: dark)").matches ? "light" : "dark";
  }

  html.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
  syncThemeIcons();
});

function syncThemeIcons() {
  const theme = html.getAttribute("data-theme");
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const isDark =
    theme === "dark" || (theme !== "light" && systemDark);

  document.body.classList.toggle("theme-dark", isDark);
  document.body.classList.toggle("theme-light", !isDark);

  document.querySelectorAll(".icon-sun, .icon-moon").forEach((icon) => {
    icon.classList.remove("is-active");
  });

  const active = document.querySelector(isDark ? ".icon-moon" : ".icon-sun");
  active?.classList.add("is-active");
}

/* ── Mobile sidebar ── */

const DESKTOP_BREAKPOINT = 1024;

const sidebar = document.getElementById("sidebar");
const menuBtn = document.getElementById("menu-btn");
const overlay = document.getElementById("sidebar-overlay");

function isMobileSidebar() {
  return window.innerWidth < DESKTOP_BREAKPOINT;
}

function closeSidebar() {
  sidebar?.classList.remove("open");
  overlay?.classList.remove("visible");
  overlay?.setAttribute("hidden", "");
  menuBtn?.setAttribute("aria-expanded", "false");
  document.body.classList.remove("sidebar-open");
}

function openSidebar() {
  if (!isMobileSidebar()) return;
  sidebar?.classList.add("open");
  overlay?.removeAttribute("hidden");
  overlay?.classList.add("visible");
  menuBtn?.setAttribute("aria-expanded", "true");
  document.body.classList.add("sidebar-open");
}

function syncSidebarForViewport() {
  if (!isMobileSidebar()) {
    closeSidebar();
  }
}

menuBtn?.addEventListener("click", () => {
  if (sidebar?.classList.contains("open")) {
    closeSidebar();
  } else {
    openSidebar();
  }
});

overlay?.addEventListener("click", closeSidebar);
window.addEventListener("resize", syncSidebarForViewport);
syncSidebarForViewport();

window.addEventListener("load", () => {
  syncThemeIcons();
});

window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
  if (!localStorage.getItem("theme") || html.getAttribute("data-theme") === "system") {
    syncThemeIcons();
  }
});

/* ── Contacts toggle (mobile) ── */

const contactsToggle = document.getElementById("contacts-toggle");
const contactList = document.getElementById("contact-list");

contactsToggle?.addEventListener("click", () => {
  const expanded = contactsToggle.getAttribute("aria-expanded") === "true";
  contactsToggle.setAttribute("aria-expanded", String(!expanded));
  contactList?.classList.toggle("open");
});

/* ── Nav active state ── */

const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll(".section");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach((link) => {
          link.classList.toggle("active", link.dataset.section === id);
        });
      }
    });
  },
  { rootMargin: "-20% 0px -60% 0px", threshold: 0 }
);

sections.forEach((section) => observer.observe(section));

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (isMobileSidebar()) closeSidebar();
  });
});

/* ── Reveal on scroll ── */

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);

document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

/* ── Footer year ── */

document.getElementById("year").textContent = new Date().getFullYear();

/* ── Profile helpers ── */

function formatJoined(dateStr) {
  const date = new Date(dateStr);
  return `${date.getFullYear()} 年 ${date.getMonth() + 1} 月`;
}

function yearsSince(dateStr) {
  const start = new Date(dateStr);
  const now = new Date();
  return Math.max(1, now.getFullYear() - start.getFullYear()) + "+";
}

function applyProfile(profile) {
  const displayName = profile.name || profile.login;
  document.getElementById("display-name").textContent = displayName;
  document.getElementById("footer-name").textContent = displayName;
  document.title = `${displayName} — Personal Portfolio`;

  const aboutName = document.getElementById("about-name");
  if (aboutName) aboutName.textContent = displayName;

  if (profile.bio) {
    const bioEl = document.getElementById("bio");
    if (bioEl) bioEl.textContent = profile.bio;
  }

  const avatarUrl = profile.avatar_url;
  if (avatarUrl) {
    document.getElementById("avatar").src = avatarUrl;
    const aboutAvatar = document.getElementById("about-avatar");
    if (aboutAvatar) aboutAvatar.src = avatarUrl;
  }

  if (profile.location) {
    document.getElementById("location").textContent = profile.location;
    const aboutLocation = document.getElementById("about-location");
    if (aboutLocation) aboutLocation.textContent = profile.location;
  }

  if (profile.public_repos != null) {
    document.getElementById("repo-count").textContent = profile.public_repos;
    document.getElementById("stat-repos").textContent = profile.public_repos;
  }

  if (profile.created_at) {
    document.getElementById("joined").textContent = formatJoined(profile.created_at);
    document.getElementById("stat-years").textContent = yearsSince(profile.created_at);
  }

  const statLang = document.getElementById("stat-lang");
  if (statLang) statLang.textContent = PRIMARY_LANGUAGE;

  const tagline = document.getElementById("about-tagline");
  if (tagline) {
    const school = profile.company || "中国海洋大学";
    tagline.textContent = `${school} · CS & AI · Python 开发者`;
  }

  const role = document.getElementById("role");
  if (role && profile.bio) {
    role.textContent = profile.bio;
  }
}

const PROJECT_ICONS = {
  ai: "🤖",
  python: "🐍",
  java: "☕",
  jupyter: "📓",
  default: "📦",
};

function projectIcon(repo) {
  const name = (repo.name || "").toLowerCase();
  const lang = (repo.language || "").toLowerCase();
  if (name.includes("agent") || name.includes("ai")) return PROJECT_ICONS.ai;
  if (lang.includes("python")) return PROJECT_ICONS.python;
  if (lang.includes("java")) return PROJECT_ICONS.java;
  if (lang.includes("jupyter")) return PROJECT_ICONS.jupyter;
  return PROJECT_ICONS.default;
}

function renderProjects(repos) {
  const list = document.getElementById("projects-list");
  if (!list || !repos.length) return;

  list.innerHTML = repos
    .slice(0, 6)
    .map((repo) => {
      const tech = [repo.language].filter(Boolean).join(" · ") || "Open Source";
      const desc = repo.description || "暂无描述";

      return `
        <article class="card content-card">
          <div class="card-icon" aria-hidden="true">${projectIcon(repo)}</div>
          <h3 class="content-card-title">
            <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">${repo.name}</a>
          </h3>
          <p class="card-tech">${tech}</p>
          <p class="card-desc">${desc}</p>
          <a class="card-link" href="${repo.html_url}" target="_blank" rel="noopener noreferrer">查看 GitHub →</a>
        </article>
      `;
    })
    .join("");
}

async function fetchGitHubData() {
  try {
    const [profileRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${GITHUB_USER}`),
      fetch(`https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=6`),
    ]);

    if (profileRes.ok) {
      const profile = await profileRes.json();
      applyProfile(profile);
    } else {
      applyProfile(PROFILE_FALLBACK);
    }

    if (reposRes.ok) {
      const repos = await reposRes.json();
      if (Array.isArray(repos) && repos.length) {
        renderProjects(repos);
      }
    }
  } catch {
    applyProfile(PROFILE_FALLBACK);
  }
}

applyProfile(PROFILE_FALLBACK);
fetchGitHubData();
