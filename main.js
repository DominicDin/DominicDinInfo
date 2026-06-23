/**
 * Personal homepage interactions
 * GitHub username: DominicDin
 */

const GITHUB_USER = "DominicDin";

function storageGet(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function storageSet(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* ignore restricted storage */
  }
}

const PROFILE_FALLBACK = {
  login: "DominicDin",
  name: "DominicDin",
  bio: "Ocean University of China · Computer Science & Artificial Intelligence",
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

/* ── i18n ── */

const I18N = {
  zh: {
    page_title: "DominicDin — 个人主页",
    meta_description: "DominicDin — 中国海洋大学 计算机科学&人工智能 · Python 开发者",
    contacts_toggle: "联系方式",
    label_location: "位置",
    label_joined: "加入 GitHub",
    label_repos: "公开仓库",
    nav_about: "关于",
    nav_skills: "技能",
    nav_projects: "项目",
    nav_contact: "联系",
    theme_toggle: "切换主题",
    menu_open: "打开菜单",
    section_about: "关于我",
    about_greeting: "你好，我是",
    tagline_suffix: "计算机科学&人工智能 · Python 开发者",
    chip_ai: "计算机科学&人工智能",
    chip_quant: "量化投资",
    chip_opensource: "开源",
    bio_text: "中国海洋大学 · 计算机科学&人工智能",
    school_name: "中国海洋大学",
    stat_repos: "公开仓库",
    stat_years: "年开源经验",
    stat_lang: "主要语言",
    focus_title: "专注领域",
    focus_ai_title: "计算机科学&人工智能",
    focus_ai_tech: "AI Agent · 机器学习",
    focus_ai_desc: "探索 AI Agent 与智能决策系统，将机器学习应用于实际场景。",
    focus_py_title: "Python 开发",
    focus_py_tech: "数据分析 · 自动化",
    focus_py_desc: "以 Python 为核心工具链，进行数据分析、自动化与后端开发。",
    focus_quant_title: "量化投资 Agent",
    focus_quant_tech: "A 股 · 智能投顾",
    focus_quant_desc: "结合 A 股市场与 AI Agent，构建智能投资辅助工具。",
    section_skills: "技能栈",
    skill_py_desc: "AI Agent、量化投资与数据分析",
    skill_ai_title: "计算机科学&人工智能",
    skill_ai_desc: "计算机科学&人工智能方向学习与实践",
    skill_java_desc: "基础语法与面向对象编程",
    skill_jupyter_desc: "交互式数据分析与实验笔记",
    section_projects: "精选项目",
    section_contact: "联系我",
    contact_title: "联系我",
    contact_desc: "欢迎通过 GitHub 与我交流开源项目与合作。",
    visit_github: "访问 GitHub 主页",
    view_github: "查看 GitHub →",
    proj_agent_desc: "A 股 AI Agent 实验项目，探索智能决策与自动化分析。",
    proj_invest_desc: "结合 A 股市场的智能投资辅助 Agent。",
    proj_teest_desc: "这是一个测试项目。",
    repo_no_desc: "暂无描述",
    repo_open_source: "开源项目",
    lang_label: "中文",
  },
  en: {
    page_title: "DominicDin — Personal Portfolio",
    meta_description: "DominicDin — Ocean University of China · Computer Science & Artificial Intelligence · Python Developer",
    contacts_toggle: "Contact",
    label_location: "Location",
    label_joined: "Joined GitHub",
    label_repos: "Public Repos",
    nav_about: "About",
    nav_skills: "Skills",
    nav_projects: "Projects",
    nav_contact: "Contact",
    theme_toggle: "Toggle theme",
    menu_open: "Open menu",
    section_about: "About Me",
    about_greeting: "Hi, I'm",
    tagline_suffix: "Computer Science & Artificial Intelligence · Python Developer",
    chip_ai: "Computer Science & AI",
    chip_quant: "Quantitative Finance",
    chip_opensource: "Open Source",
    bio_text: "Ocean University of China · Computer Science & Artificial Intelligence",
    school_name: "Ocean University of China",
    stat_repos: "Public Repos",
    stat_years: "Years on GitHub",
    stat_lang: "Primary Language",
    focus_title: "Focus Areas",
    focus_ai_title: "Computer Science & AI",
    focus_ai_tech: "AI Agent · Machine Learning",
    focus_ai_desc: "Exploring AI agents and intelligent decision systems, applying ML to real-world scenarios.",
    focus_py_title: "Python Development",
    focus_py_tech: "Data Analysis · Automation",
    focus_py_desc: "Using Python as the core toolchain for data analysis, automation, and backend development.",
    focus_quant_title: "Quant Investment Agent",
    focus_quant_tech: "A-Shares · Smart Advisory",
    focus_quant_desc: "Building AI-powered investment assistants for the A-share market.",
    section_skills: "Tech Stack",
    skill_py_desc: "AI agents, quantitative finance, and data analysis",
    skill_ai_title: "Computer Science & AI",
    skill_ai_desc: "Learning and practicing computer science and artificial intelligence",
    skill_java_desc: "Fundamentals and object-oriented programming",
    skill_jupyter_desc: "Interactive data analysis and experiment notes",
    section_projects: "Featured Projects",
    section_contact: "Contact",
    contact_title: "Get in Touch",
    contact_desc: "Feel free to reach out on GitHub for open-source collaboration.",
    visit_github: "Visit GitHub Profile",
    view_github: "View on GitHub →",
    proj_agent_desc: "A-share AI agent experiment exploring intelligent decisions and automated analysis.",
    proj_invest_desc: "Smart investment assistant agent for the A-share market.",
    proj_teest_desc: "A test project for experiments and notes.",
    repo_no_desc: "No description available",
    repo_open_source: "Open Source",
    lang_label: "EN",
  },
};

const REPO_DESC_I18N = {
  AiAgent_AShare: {
    zh: "A 股 AI Agent 实验项目，探索智能决策与自动化分析。",
    en: "A-share AI agent experiment exploring intelligent decisions and automated analysis.",
  },
  A_Share_investment_Agent: {
    zh: "结合 A 股市场的智能投资辅助 Agent。",
    en: "Smart investment assistant agent for the A-share market.",
  },
  teest: {
    zh: "这是一个测试项目。",
    en: "A test project for experiments and notes.",
  },
  D3MEP: {
    zh: "个人实验项目仓库。",
    en: "Personal experimental project repository.",
  },
  Java: {
    zh: "Java 学习笔记与练习代码。",
    en: "Java learning notes and practice code.",
  },
};

let currentLang = storageGet("lang") || (navigator.language.toLowerCase().startsWith("zh") ? "zh" : "en");
let lastProfile = PROFILE_FALLBACK;
let lastRepos = REPOS_FALLBACK;

function t(key) {
  return I18N[currentLang]?.[key] ?? I18N.en[key] ?? key;
}

function setLang(lang) {
  if (!I18N[lang]) return;
  currentLang = lang;
  storageSet("lang", lang);
  document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    if (I18N[lang][key]) el.textContent = I18N[lang][key];
  });

  document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
    const key = el.dataset.i18nAria;
    if (I18N[lang][key]) el.setAttribute("aria-label", I18N[lang][key]);
  });

  const meta = document.getElementById("meta-description");
  if (meta) meta.setAttribute("content", t("meta_description"));

  const langLabel = document.getElementById("lang-label");
  if (langLabel) langLabel.textContent = t("lang_label");

  document.querySelectorAll(".lang-btn[data-lang]").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.lang === lang);
    btn.setAttribute("aria-pressed", String(btn.dataset.lang === lang));
  });

  applyProfile(lastProfile);
  if (lastRepos.length) renderProjects(lastRepos);
}

function initLang() {
  setLang(currentLang);
}

document.querySelectorAll(".lang-btn[data-lang]").forEach((btn) => {
  btn.addEventListener("click", () => setLang(btn.dataset.lang));
});

try {
  initLang();
} catch (error) {
  console.error("initLang failed:", error);
}

/* ── Theme ── */

const html = document.documentElement;
const themeToggle = document.getElementById("theme-toggle");
const storedTheme = storageGet("theme");

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
  storageSet("theme", next);
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
  if (!storageGet("theme") || html.getAttribute("data-theme") === "system") {
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
let navPickLock = false;
let navPickLockTimer = 0;

function setActiveSection(sectionId) {
  navLinks.forEach((link) => {
    link.classList.toggle("active", link.dataset.section === sectionId);
  });
}

function lockNavPick(ms = 900) {
  navPickLock = true;
  window.clearTimeout(navPickLockTimer);
  navPickLockTimer = window.setTimeout(() => {
    navPickLock = false;
    updateActiveNav();
  }, ms);
}

function updateActiveNav() {
  if (!sections.length || navPickLock) return;

  const triggerLine = 112;
  let activeId = sections[0].id;

  sections.forEach((section) => {
    if (section.getBoundingClientRect().top <= triggerLine) {
      activeId = section.id;
    }
  });

  const lastSection = sections[sections.length - 1];
  const lastRect = lastSection.getBoundingClientRect();
  if (lastRect.top <= window.innerHeight * 0.55 && lastRect.bottom > triggerLine) {
    activeId = lastSection.id;
  }

  setActiveSection(activeId);
}

window.addEventListener("scroll", updateActiveNav, { passive: true });
window.addEventListener("resize", updateActiveNav);
updateActiveNav();

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    const id = link.dataset.section;
    if (id) {
      setActiveSection(id);
      lockNavPick();
    }
    if (isMobileSidebar()) closeSidebar();
  });
});

if (location.hash) {
  const id = location.hash.replace("#", "");
  if (document.getElementById(id)) {
    setActiveSection(id);
    lockNavPick();
  }
}

window.addEventListener("hashchange", () => {
  const id = location.hash.replace("#", "");
  if (id && document.getElementById(id)) {
    setActiveSection(id);
    lockNavPick();
  }
});

/* ── Reveal on scroll ── */

function initReveal() {
  document.querySelectorAll(".reveal").forEach((el) => {
    el.classList.add("visible");
  });
}

initReveal();

/* ── Footer year ── */

const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ── Profile helpers ── */

function formatJoined(dateStr) {
  const date = new Date(dateStr);
  if (currentLang === "zh") {
    return `${date.getFullYear()} 年 ${date.getMonth() + 1} 月`;
  }
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long" });
}

function yearsSince(dateStr) {
  const start = new Date(dateStr);
  const now = new Date();
  return Math.max(1, now.getFullYear() - start.getFullYear()) + "+";
}

function applyProfile(profile) {
  lastProfile = profile;
  const displayName = profile.name || profile.login;
  const displayNameEl = document.getElementById("display-name");
  if (displayNameEl) displayNameEl.textContent = displayName;
  const footerName = document.getElementById("footer-name");
  if (footerName) footerName.textContent = displayName;
  document.title = t("page_title").replace("DominicDin", displayName);

  const aboutName = document.getElementById("about-name");
  if (aboutName) aboutName.textContent = displayName;

  const bioEl = document.getElementById("bio");
  if (bioEl) {
    bioEl.textContent =
      currentLang === "zh"
        ? t("bio_text")
        : profile.bio || t("bio_text");
  }

  const avatarUrl = profile.avatar_url;
  if (avatarUrl) {
    const avatar = document.getElementById("avatar");
    if (avatar) avatar.src = avatarUrl;
    const aboutAvatar = document.getElementById("about-avatar");
    if (aboutAvatar) aboutAvatar.src = avatarUrl;
  }

  if (profile.location) {
    const locationEl = document.getElementById("location");
    if (locationEl) locationEl.textContent = profile.location;
    const aboutLocation = document.getElementById("about-location");
    if (aboutLocation) aboutLocation.textContent = profile.location;
  }

  if (profile.public_repos != null) {
    const repoCount = document.getElementById("repo-count");
    if (repoCount) repoCount.textContent = profile.public_repos;
    const statRepos = document.getElementById("stat-repos");
    if (statRepos) statRepos.textContent = profile.public_repos;
  }

  if (profile.created_at) {
    const joined = document.getElementById("joined");
    if (joined) joined.textContent = formatJoined(profile.created_at);
    document.getElementById("stat-years").textContent = yearsSince(profile.created_at);
  }

  const statLang = document.getElementById("stat-lang");
  if (statLang) statLang.textContent = PRIMARY_LANGUAGE;

  const tagline = document.getElementById("about-tagline");
  if (tagline) {
    const school =
      currentLang === "zh"
        ? t("school_name")
        : profile.company || t("school_name");
    tagline.textContent = `${school} · ${t("tagline_suffix")}`;
  }

  const role = document.getElementById("role");
  if (role) {
    role.textContent =
      currentLang === "zh"
        ? t("bio_text")
        : profile.bio || t("bio_text");
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

  lastRepos = repos;

  list.innerHTML = repos
    .slice(0, 6)
    .map((repo) => {
      const tech = [repo.language].filter(Boolean).join(" · ") || t("repo_open_source");
      const localized = REPO_DESC_I18N[repo.name];
      const desc = localized
        ? localized[currentLang]
        : repo.description || t("repo_no_desc");

      return `
        <article class="card content-card">
          <div class="card-icon" aria-hidden="true">${projectIcon(repo)}</div>
          <h3 class="content-card-title">
            <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">${repo.name}</a>
          </h3>
          <p class="card-tech">${tech}</p>
          <p class="card-desc">${desc}</p>
          <a class="card-link" href="${repo.html_url}" target="_blank" rel="noopener noreferrer">${t("view_github")}</a>
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
renderProjects(REPOS_FALLBACK);
fetchGitHubData();
