const fallback = window.SITE_FALLBACK;
const icons = {
  menu: '<svg viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
  "arrow-down": '<svg viewBox="0 0 24 24"><path d="M12 5v14m-6-6 6 6 6-6"/></svg>',
  download: '<svg viewBox="0 0 24 24"><path d="M12 3v12m-5-5 5 5 5-5M5 21h14"/></svg>',
  mail: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
  external: '<svg viewBox="0 0 24 24"><path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>',
  "arrow-left": '<svg viewBox="0 0 24 24"><path d="M19 12H5m6 6-6-6 6-6"/></svg>',
  "arrow-right": '<svg viewBox="0 0 24 24"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>',
  music: '<svg viewBox="0 0 24 24"><circle cx="8" cy="18" r="4"/><path d="M12 18V2l7 4"/></svg>',
  pause: '<svg viewBox="0 0 24 24"><path d="M7 4v16M17 4v16"/></svg>',
};

const $ = (selector) => document.querySelector(selector);
const elements = {
  body: document.body,
  nav: $("#site-nav"),
  navMenu: $("#nav-menu-button"),
  brandMark: $("#brand-mark"),
  brandName: $("#brand-name"),
  profileRole: $("#profile-role"),
  profileName: $("#profile-name"),
  profileTagline: $("#profile-tagline"),
  profileIntro: $("#profile-intro"),
  profileImage: $("#profile-image"),
  profileBackdrop: $("#profile-backdrop"),
  profileLocation: $("#profile-location"),
  profileEmail: $("#profile-email"),
  profileEmailLink: $("#profile-email-link"),
  profileGithub: $("#profile-github-link"),
  profileAvailability: $("#profile-availability"),
  about: $("#about-text"),
  quote: $("#profile-quote"),
  focus: $("#fact-focus"),
  factLocation: $("#fact-location"),
  status: $("#fact-status"),
  resume: $("#resume-list"),
  skills: $("#skills-grid"),
  projects: $("#project-grid"),
  posts: $("#post-list"),
  contactCopy: $("#contact-copy"),
  contactEmail: $("#contact-email"),
  contactWebsite: $("#contact-website"),
  footerName: $("#footer-name"),
  footerYear: $("#footer-year"),
  reader: $("#article-reader"),
  readerClose: $("#article-close"),
  readerCategory: $("#article-category"),
  readerMeta: $("#article-meta"),
  readerTitle: $("#article-title"),
  readerExcerpt: $("#article-excerpt"),
  readerCover: $("#article-cover"),
  readerContent: $("#article-content"),
  cursor: $("#cursor-glow"),
  musicDock: $("#music-dock"),
  musicToggle: $("#music-toggle"),
  musicTitle: $("#music-title"),
  musicArtist: $("#music-artist"),
  musicProgress: $("#music-progress"),
  musicTime: $("#music-time"),
  audio: $("#music-audio"),
};

let data = fallback;
let playable = false;

function hydrate(root = document) {
  root.querySelectorAll("[data-icon]").forEach((node) => {
    if (!node.innerHTML.trim()) node.innerHTML = icons[node.dataset.icon] || "";
  });
}

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
  if (!value) return "";
  return String(value).replaceAll("-", ".");
}

function normalize(value = {}) {
  return {
    profile: { ...fallback.profile, ...(value.profile || {}) },
    experience: Array.isArray(value.experience) ? value.experience : [],
    skills: Array.isArray(value.skills) ? value.skills : [],
    projects: Array.isArray(value.projects) ? value.projects : [],
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

function render() {
  const p = data.profile;
  document.title = `${p.name} | 简历与博客`;
  elements.brandMark.textContent = (p.name || "L").slice(0, 1);
  elements.brandName.textContent = p.name || "个人主页";
  elements.profileRole.textContent = p.role || "";
  elements.profileName.textContent = p.name || "";
  elements.profileTagline.textContent = p.tagline || "";
  elements.profileIntro.textContent = p.intro || "";
  elements.profileImage.src = p.heroImage || data.media[0]?.url || "";
  elements.profileImage.alt = p.name || "个人照片";
  elements.profileBackdrop.src = p.heroImage || data.media[0]?.url || "";
  elements.profileLocation.textContent = p.location || "";
  elements.profileEmail.textContent = p.email || "";
  elements.profileEmailLink.href = `mailto:${p.email || ""}`;
  elements.profileGithub.href = p.github || "#";
  elements.profileGithub.hidden = !p.github;
  elements.profileAvailability.textContent = p.availability || "";
  elements.about.textContent = p.about || "";
  elements.quote.textContent = p.quote || "";
  elements.focus.textContent = p.focus || "";
  elements.factLocation.textContent = p.location || "";
  elements.status.textContent = p.status || "";
  elements.contactCopy.textContent = p.email ? `可以通过 ${p.email} 联系我。` : "";
  elements.contactEmail.href = `mailto:${p.email || ""}`;
  elements.contactWebsite.href = p.website || "#";
  elements.contactWebsite.hidden = !p.website;
  elements.footerName.textContent = p.name || "";
  elements.footerYear.textContent = String(new Date().getFullYear());
  elements.musicDock.hidden = !p.musicUrl;
  elements.musicTitle.textContent = p.musicTitle || "背景音乐";
  elements.musicArtist.textContent = p.musicArtist || "";
  if (p.musicUrl && !playable) {
    elements.audio.src = p.musicUrl;
    playable = true;
  }

  renderResume();
  renderSkills();
  renderProjects();
  renderPosts();
  const images = [p.heroImage, ...data.media.map((item) => item.url), ...data.projects.map((item) => item.cover)].filter(Boolean);
  document.documentElement.style.setProperty("--about-image", cssUrl(images[1] || images[0] || ""));
  document.documentElement.style.setProperty("--skills-image", cssUrl(images[2] || ""));
  document.documentElement.style.setProperty("--projects-image", cssUrl(images[3] || ""));
  document.documentElement.style.setProperty("--contact-image", cssUrl(images[4] || ""));
}

function renderResume() {
  elements.resume.innerHTML = data.experience.map((item) => `
    <article class="resume-item reveal">
      <time class="resume-date">${esc(item.period)}</time>
      <div class="resume-org"><span>${esc(item.type)}</span><strong>${esc(item.organization)}</strong><p>${esc(item.role)}</p></div>
      <div class="resume-copy"><p>${esc(item.description)}</p></div>
    </article>`).join("");
}

function renderSkills() {
  elements.skills.innerHTML = data.skills.map((item, index) => `
    <article class="skill-group reveal">
      <span>${String(index + 1).padStart(2, "0")}</span><h3>${esc(item.category)}</h3>
      <div class="skill-tags">${item.items.map((skill) => `<span>${esc(skill)}</span>`).join("")}</div>
    </article>`).join("");
}

function renderProjects() {
  elements.projects.innerHTML = data.projects.map((item, index) => `
    <article class="project-card reveal">
      <div class="project-image"><img src="${esc(item.cover)}" alt="${esc(item.title)}" loading="lazy" /><span class="project-number">${String(index + 1).padStart(2, "0")}</span></div>
      <div class="project-copy"><h3>${esc(item.title)}</h3><p>${esc(item.summary)}</p>${item.link ? `<a href="${esc(item.link)}" target="_blank" rel="noreferrer">查看项目</a>` : ""}</div>
    </article>`).join("");
}

function renderPosts() {
  const posts = data.posts.filter((post) => post.status !== "draft");
  elements.posts.innerHTML = posts.map((post) => `
    <a class="post-row reveal" href="#article-${esc(post.id)}" data-post="${esc(post.id)}">
      <time>${esc(date(post.date))}</time><strong>${esc(post.title)}</strong><span>${esc(post.category)}</span><small>阅读 →</small>
    </a>`).join("");
}

function setThemeImage(name, value) {
  if (value) document.documentElement.style.setProperty(name, cssUrl(value));
}

function paragraphs(value = "") {
  return String(value).split(/\n{2,}/).map((item) => `<p>${esc(item).replaceAll("\n", "<br>")}</p>`).join("");
}

function openArticle(id) {
  const post = data.posts.find((item) => item.id === id);
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

function closeArticle() {
  elements.reader.hidden = true;
  document.body.style.overflow = "";
}

function setupReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    items.forEach((item) => item.classList.add("is-visible"));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  items.forEach((item) => observer.observe(item));
}

function bind() {
  $("#print-button").addEventListener("click", () => window.print());
  elements.navMenu.addEventListener("click", () => {
    const open = elements.nav.classList.toggle("is-open");
    elements.navMenu.setAttribute("aria-expanded", String(open));
  });
  document.addEventListener("click", (event) => {
    const link = event.target.closest("[data-post]");
    if (link) {
      event.preventDefault();
      openArticle(link.dataset.post);
    }
  });
  elements.readerClose.addEventListener("click", closeArticle);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeArticle();
  });
  elements.musicToggle.addEventListener("click", async () => {
    if (elements.audio.paused) await elements.audio.play();
    else elements.audio.pause();
  });
  const musicState = () => {
    const playing = !elements.audio.paused;
    elements.musicToggle.innerHTML = playing ? icons.pause : icons.music;
  };
  const progress = () => {
    const duration = Number.isFinite(elements.audio.duration) ? elements.audio.duration : 0;
    const current = Number.isFinite(elements.audio.currentTime) ? elements.audio.currentTime : 0;
    elements.musicProgress.style.width = duration ? `${(current / duration) * 100}%` : "0%";
    elements.musicTime.textContent = `${Math.floor(current / 60)}:${String(Math.floor(current % 60)).padStart(2, "0")}`;
  };
  elements.audio.addEventListener("play", musicState);
  elements.audio.addEventListener("pause", musicState);
  elements.audio.addEventListener("timeupdate", progress);
  elements.audio.addEventListener("loadedmetadata", progress);

  let raf = null;
  document.addEventListener("pointermove", (event) => {
    if (pointerFine()) {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = null;
        const x = event.clientX / innerWidth;
        const y = event.clientY / innerHeight;
        document.documentElement.style.setProperty("--pointer-x", `${x * 100}%`);
        document.documentElement.style.setProperty("--pointer-y", `${y * 100}%`);
        document.documentElement.style.setProperty("--hero-x", `${(x - 0.5) * 18}px`);
        document.documentElement.style.setProperty("--hero-y", `${(y - 0.5) * 14}px`);
        elements.cursor.style.transform = `translate3d(${event.clientX - 170}px,${event.clientY - 170}px,0)`;
        document.querySelectorAll(".project-card").forEach((card) => {
          const r = card.getBoundingClientRect();
          if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) return;
          const cx = (event.clientX - r.left) / r.width;
          const cy = (event.clientY - r.top) / r.height;
          card.style.setProperty("--rx", `${(0.5 - cy) * 3}deg`);
          card.style.setProperty("--ry", `${(cx - 0.5) * 3}deg`);
          card.style.setProperty("--gx", `${cx * 100}%`);
          card.style.setProperty("--gy", `${cy * 100}%`);
        });
      });
    }
  }, { passive: true });

  const hero = $(".profile-hero");
  if (hero && "IntersectionObserver" in window) {
    new IntersectionObserver(([entry]) => elements.nav.classList.toggle("is-scrolled", !entry.isIntersecting), { threshold: 0 }).observe(hero);
  }
}

function pointerFine() {
  return matchMedia("(pointer:fine)").matches && !matchMedia("(prefers-reduced-motion: reduce)").matches;
}

async function init() {
  data = await loadData();
  render();
  setupReveal();
  bind();
  hydrate();
  setTimeout(() => elements.body.classList.remove("is-loading"), 180);
}

init();
