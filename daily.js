const fallback = window.SITE_FALLBACK;
const icons = {
  "arrow-right": '<svg viewBox="0 0 24 24"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>',
  "arrow-left": '<svg viewBox="0 0 24 24"><path d="M19 12H5m6 6-6-6 6-6"/></svg>',
  search: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
  music: '<svg viewBox="0 0 24 24"><circle cx="8" cy="18" r="4"/><path d="M12 18V2l7 4"/></svg>',
  pause: '<svg viewBox="0 0 24 24"><path d="M7 4v16M17 4v16"/></svg>',
};
const $ = (selector) => document.querySelector(selector);
const elements = {
  body: document.body,
  nav: $("#daily-nav"),
  cursor: $("#cursor-glow"),
  featureImage: $("#feature-image"),
  featureCategory: $("#feature-category"),
  featureDate: $("#feature-date"),
  total: $("#total-count"),
  featureCard: $("#feature-card"),
  featureTitle: $("#feature-title"),
  featureExcerpt: $("#feature-excerpt"),
  search: $("#daily-search"),
  filters: $("#daily-filters"),
  grid: $("#daily-grid"),
  empty: $("#daily-empty"),
  reader: $("#article-reader"),
  readerClose: $("#article-close"),
  readerCategory: $("#article-category"),
  readerMeta: $("#article-meta"),
  readerTitle: $("#article-title"),
  readerExcerpt: $("#article-excerpt"),
  readerCover: $("#article-cover"),
  readerContent: $("#article-content"),
  footerName: $("#footer-name"),
  footerYear: $("#footer-year"),
  musicDock: $("#music-dock"),
  musicToggle: $("#music-toggle"),
  musicTitle: $("#music-title"),
  musicArtist: $("#music-artist"),
  musicProgress: $("#music-progress"),
  musicTime: $("#music-time"),
  audio: $("#music-audio"),
};
let data = fallback;
let posts = [];
let category = "全部";
let query = "";
let audioReady = false;

function esc(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
function cssUrl(value = "") {
  return `url("${String(value).replaceAll('"', "%22")}")`;
}
function date(value) {
  return value ? String(value).replaceAll("-", ".") : "";
}
function hydrate(root = document) {
  root.querySelectorAll("[data-icon]").forEach((node) => {
    if (!node.innerHTML.trim()) node.innerHTML = icons[node.dataset.icon] || "";
  });
}
function normalize(value = {}) {
  return {
    profile: { ...fallback.profile, ...(value.profile || {}) },
    posts: Array.isArray(value.posts) ? value.posts : [],
    media: Array.isArray(value.media) ? value.media : [],
  };
}
async function loadData() {
  try {
    const response = await fetch("data/site.json", { cache: "no-store" });
    if (!response.ok) throw new Error();
    return normalize(await response.json());
  } catch {
    return normalize(fallback);
  }
}
function paragraphs(value = "") {
  return String(value).split(/\n{2,}/).map((item) => `<p>${esc(item).replaceAll("\n", "<br>")}</p>`).join("");
}
function renderFeature() {
  const post = posts[0];
  if (!post) return;
  elements.featureImage.src = post.cover || "";
  elements.featureImage.alt = post.title || "";
  elements.featureCategory.textContent = post.category || "日常";
  elements.featureDate.textContent = date(post.date);
  elements.featureTitle.textContent = post.title || "";
  elements.featureExcerpt.textContent = post.excerpt || "";
  elements.featureCard.dataset.post = post.id;
}
function renderFilters() {
  const values = ["全部", ...new Set(posts.map((item) => item.category).filter(Boolean))];
  elements.filters.innerHTML = values.map((item) => `<button class="${item === category ? "is-active" : ""}" data-category="${esc(item)}">${esc(item)}</button>`).join("");
}
function renderGrid() {
  const filtered = posts.filter((post) => {
    const c = category === "全部" || post.category === category;
    const q = !query || `${post.title} ${post.excerpt}`.toLowerCase().includes(query.toLowerCase());
    return c && q;
  });
  elements.empty.hidden = filtered.length > 0;
  elements.grid.innerHTML = filtered.map((post, index) => `
    <article class="daily-card">
      <button class="daily-card__image" type="button" data-post="${esc(post.id)}">
        <img src="${esc(post.cover)}" alt="${esc(post.title)}" loading="lazy" />
      </button>
      <div class="daily-card__copy">
        <small>${esc(post.category)} · ${esc(date(post.date))}</small>
        <h3>${esc(post.title)}</h3><p>${esc(post.excerpt)}</p>
        <button class="blog-all-link" type="button" data-post="${esc(post.id)}">阅读全文 <span data-icon="arrow-right"></span></button>
      </div>
    </article>`).join("");
  hydrate(elements.grid);
}
function openReader(id) {
  const post = posts.find((item) => item.id === id);
  if (!post) return;
  elements.readerCategory.textContent = post.category || "";
  elements.readerMeta.textContent = `${date(post.date)} · ${post.category || ""}`;
  elements.readerTitle.textContent = post.title || "";
  elements.readerExcerpt.textContent = post.excerpt || "";
  elements.readerCover.src = post.cover || "";
  elements.readerCover.hidden = !post.cover;
  elements.readerContent.innerHTML = paragraphs(post.content || post.excerpt || "");
  elements.reader.hidden = false;
  elements.reader.scrollTop = 0;
  document.body.style.overflow = "hidden";
}
function closeReader() {
  elements.reader.hidden = true;
  document.body.style.overflow = "";
}
function bind() {
  elements.search.addEventListener("input", () => {
    query = elements.search.value.trim();
    renderGrid();
  });
  elements.filters.addEventListener("click", (event) => {
    const button = event.target.closest("[data-category]");
    if (!button) return;
    category = button.dataset.category;
    renderFilters();
    renderGrid();
  });
  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-post]");
    if (button) openReader(button.dataset.post);
  });
  elements.featureCard.addEventListener("click", () => openReader(elements.featureCard.dataset.post));
  elements.readerClose.addEventListener("click", closeReader);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeReader();
  });
  elements.musicToggle.addEventListener("click", async () => {
    if (elements.audio.paused) await elements.audio.play();
    else elements.audio.pause();
  });
  const state = () => {
    elements.musicToggle.innerHTML = elements.audio.paused ? icons.music : icons.pause;
  };
  const progress = () => {
    const duration = Number.isFinite(elements.audio.duration) ? elements.audio.duration : 0;
    const current = Number.isFinite(elements.audio.currentTime) ? elements.audio.currentTime : 0;
    elements.musicProgress.style.width = duration ? `${(current / duration) * 100}%` : "0%";
    elements.musicTime.textContent = `${Math.floor(current / 60)}:${String(Math.floor(current % 60)).padStart(2, "0")}`;
  };
  elements.audio.addEventListener("play", state);
  elements.audio.addEventListener("pause", state);
  elements.audio.addEventListener("timeupdate", progress);
  elements.audio.addEventListener("loadedmetadata", progress);
  const hero = $(".daily-hero");
  if (hero && "IntersectionObserver" in window) {
    new IntersectionObserver(([entry]) => elements.nav.classList.toggle("is-scrolled", !entry.isIntersecting), { threshold: 0 }).observe(hero);
  }
  document.addEventListener("pointermove", (event) => {
    if (!matchMedia("(pointer:fine)").matches || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    elements.cursor.style.transform = `translate3d(${event.clientX - 170}px,${event.clientY - 170}px,0)`;
  }, { passive: true });
}
function renderPage() {
  const p = data.profile;
  document.title = `日常博客 | ${p.name || "个人网站"}`;
  elements.footerName.textContent = p.name || "";
  elements.footerYear.textContent = String(new Date().getFullYear());
  elements.musicDock.hidden = !p.musicUrl;
  elements.musicTitle.textContent = p.musicTitle || "背景音乐";
  elements.musicArtist.textContent = p.musicArtist || "";
  if (p.musicUrl && !audioReady) {
    elements.audio.src = p.musicUrl;
    audioReady = true;
  }
  posts = data.posts.filter((post) => post.status !== "draft").sort((a, b) => new Date(b.date) - new Date(a.date));
  elements.total.textContent = `${posts.length} 篇文章`;
  renderFeature();
  renderFilters();
  renderGrid();
  const images = [p.heroImage, ...data.media.map((item) => item.url), ...posts.map((item) => item.cover)].filter(Boolean);
  document.documentElement.style.setProperty("--about-image", cssUrl(images[1] || ""));
  document.documentElement.style.setProperty("--contact-image", cssUrl(images[2] || ""));
}
async function init() {
  data = await loadData();
  renderPage();
  bind();
  hydrate();
  setTimeout(() => elements.body.classList.remove("is-loading"), 180);
}
init();
