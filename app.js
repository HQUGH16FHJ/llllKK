const defaultSiteConfig = {
  name: "刘骐硕",
  role: "健身爱好者 大学生",
  location: "中国 · 河南",
  status: "整理新的作品",
  email: "3401049114@qq.com",
  statement: "保持敏感，保持诚实，也保持把事情做完的耐心。",
  about:
    "你好，我是刘骐硕。我在河南读书，也是一名健身爱好者。我关注普通生活里的细节，也喜欢把想法变成能够被看见、被使用、被记住的东西。",
  current: "一件需要慢慢完成的作品",
  focus: "记录、设计与日常观察",
  reading: "一本关于城市与人的书",
  assets: {
    background: "./assets/background.jpg",
    avatar: "./assets/avatar.jpg",
    video: "./assets/intro.mp4",
    poster: "./assets/video-poster.jpg",
    music: "./assets/music.mp3",
  },
  music: {
    title: "待添加曲目",
    artist: "刘骐硕",
  },
  photos: [],
  works: [],
  timeline: [],
  articles: [],
};

let siteConfig = window.SITE_CONTENT || defaultSiteConfig;

const pageLoader = document.querySelector("#page-loader");
const scrollProgress = document.querySelector("#scroll-progress");
const siteHeader = document.querySelector(".site-header");
const menuToggle = document.querySelector("#menu-toggle");
const primaryNav = document.querySelector("#primary-nav");
const heroTitle = document.querySelector(".hero-title");
const heroImage = document.querySelector("#hero-image");
const heroPhotoCaption = document.querySelector("#hero-photo-caption");
const heroVisual = document.querySelector(".hero__visual");
const featuredDate = document.querySelector("#featured-date");
const featuredTitle = document.querySelector("#featured-title");
const featuredExcerpt = document.querySelector("#featured-excerpt");
const featuredRead = document.querySelector("#featured-read");
const featuredPreview = document.querySelector("#featured-preview");
const featuredImage = document.querySelector("#featured-image");
const featuredCount = document.querySelector("#featured-count");
const articleIndex = document.querySelector("#article-index");
const photoGrid = document.querySelector("#photo-grid");
const timeline = document.querySelector("#timeline");
const video = document.querySelector("#intro-video");
const videoShell = document.querySelector("[data-video-shell]");
const videoPlaceholder = document.querySelector("#video-placeholder");
const musicDock = document.querySelector("#music-dock");
const musicToggle = document.querySelector("#music-toggle");
const musicCollapse = document.querySelector("#music-collapse");
const musicState = document.querySelector("#music-state");
const musicCurrent = document.querySelector("#music-current");
const musicDuration = document.querySelector("#music-duration");
const musicProgress = document.querySelector("#music-progress");
const audio = document.querySelector("#site-audio");
const articleReader = document.querySelector("#article-reader");
const articleReaderDate = document.querySelector("#article-reader-date");
const articleReaderTitle = document.querySelector("#article-reader-title");
const articleReaderLead = document.querySelector("#article-reader-lead");
const articleReaderBody = document.querySelector("#article-reader-body");
const closeArticleButton = document.querySelector("#close-article");
const lightbox = document.querySelector("#photo-lightbox");
const lightboxImage = document.querySelector("#lightbox-image");
const lightboxDate = document.querySelector("#lightbox-date");
const lightboxTitle = document.querySelector("#lightbox-title");
const lightboxCount = document.querySelector("#lightbox-count");
const lightboxClose = document.querySelector("#lightbox-close");
const lightboxPrev = document.querySelector("#lightbox-prev");
const lightboxNext = document.querySelector("#lightbox-next");

let currentArticleIndex = -1;
let currentPhotoIndex = -1;
let pointerStartX = null;

const currentYear = new Date().getFullYear();
document.querySelector("#footer-year").textContent = currentYear;

function setText(selector, value) {
  document.querySelectorAll(selector).forEach((node) => {
    node.textContent = value || "";
  });
}

function absoluteAsset(path, fallback) {
  return path || fallback;
}

function splitText(element) {
  if (!element || element.dataset.splitReady === "true") {
    return;
  }

  const text = element.textContent.trim();
  element.replaceChildren();
  [...text].forEach((character, index) => {
    const span = document.createElement("span");
    span.className = "char";
    span.textContent = character === " " ? "\u00a0" : character;
    span.style.animationDelay = `${80 + index * 55}ms`;
    element.append(span);
  });
  element.dataset.splitReady = "true";
}

function fillSiteContent() {
  setText('[data-site="name"]', siteConfig.name);
  setText('[data-site="role"]', siteConfig.role);
  setText('[data-site="location"]', siteConfig.location);
  setText('[data-site="status"]', siteConfig.status);
  setText('[data-site="email"]', siteConfig.email);
  setText('[data-site="statement"]', siteConfig.statement);
  setText('[data-site="about"]', siteConfig.about);
  setText('[data-site="current"]', siteConfig.current);
  setText('[data-site="focus"]', siteConfig.focus);
  setText('[data-site="reading"]', siteConfig.reading);
  setText('[data-music="title"]', siteConfig.music?.title);
  setText('[data-music="artist"]', siteConfig.music?.artist);

  document.querySelectorAll("[data-site-mail]").forEach((link) => {
    link.href = `mailto:${siteConfig.email}`;
  });

  document.title = `${siteConfig.name}的个人博客`;
}

function renderArticles() {
  articleIndex.replaceChildren();
  const articles = Array.isArray(siteConfig.articles) ? siteConfig.articles : [];

  if (!articles.length) {
    articleIndex.innerHTML = '<p class="empty-copy">还没有公开的文章。</p>';
    featuredCount.textContent = "00 / 00";
    featuredRead.disabled = true;
    return;
  }

  articles.forEach((article, index) => {
    const row = document.createElement("button");
    const date = document.createElement("time");
    const titleWrap = document.createElement("div");
    const title = document.createElement("h3");
    const excerpt = document.createElement("p");
    const tag = document.createElement("span");
    const arrow = document.createElement("span");

    row.className = "article-row";
    row.type = "button";
    row.setAttribute("aria-label", `阅读文章：${article.title}`);
    row.dataset.index = String(index);
    date.textContent = article.date || "";
    title.textContent = article.title || "未命名文章";
    excerpt.textContent = article.excerpt || "";
    tag.className = "article-row__tag";
    tag.textContent = index === 0 ? "最新" : "记录";
    arrow.className = "article-row__arrow";
    arrow.innerHTML =
      '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>';

    titleWrap.className = "article-row__title";
    titleWrap.append(title, excerpt);
    row.append(date, titleWrap, tag, arrow);
    articleIndex.append(row);
  });

  const featured = articles[0];
  featuredDate.textContent = featured.date || "";
  featuredTitle.textContent = featured.title || "未命名文章";
  featuredExcerpt.textContent = featured.excerpt || "";
  featuredImage.alt = featured.title || "";
  featuredCount.textContent = `01 / ${String(articles.length).padStart(2, "0")}`;
  featuredRead.disabled = false;
}

function renderTimeline() {
  timeline.replaceChildren();
  const items = Array.isArray(siteConfig.timeline) ? siteConfig.timeline : [];

  items.forEach((item, index) => {
    const article = document.createElement("article");
    const time = document.createElement("time");
    const copy = document.createElement("div");
    const heading = document.createElement("h3");
    const text = document.createElement("p");

    article.className = "timeline__item";
    time.textContent = index === 0 ? "现在" : `${2026 - index}`;
    heading.textContent = item.title || "";
    text.textContent = item.description || "";
    copy.append(heading, text);
    article.append(time, copy);
    timeline.append(article);
  });
}

function imageFallback(image, primary, fallback) {
  if (!image) {
    return;
  }

  image.onerror = () => {
    if (fallback && image.src !== new URL(fallback, location.href).href) {
      image.src = fallback;
    }
  };
  image.src = primary || fallback;
}

function renderMedia() {
  const background = absoluteAsset(
    siteConfig.assets?.background,
    "./assets/background.jpg",
  );
  const avatar = absoluteAsset(siteConfig.assets?.avatar, "./assets/avatar.jpg");
  const photos = Array.isArray(siteConfig.photos) ? siteConfig.photos : [];
  const heroPhoto = photos[0];

  document.documentElement.style.setProperty(
    "--ambient-image",
    `url("${background}")`,
  );
  document.querySelector(".ambient__image").style.backgroundImage =
    `url("${background}")`;

  imageFallback(heroImage, heroPhoto?.path || background, background);
  heroPhotoCaption.textContent =
    heroPhoto?.caption || siteConfig.status || "生活切片";
  imageFallback(featuredImage, heroPhoto?.path || background, background);

  document.querySelectorAll("[data-avatar]").forEach((image) => {
    imageFallback(image, avatar, "./assets/avatar.jpg");
  });

  video.poster = absoluteAsset(
    siteConfig.assets?.poster,
    "./assets/video-poster.jpg",
  );
  video.querySelector("source").src = absoluteAsset(
    siteConfig.assets?.video,
    "./assets/intro.mp4",
  );
  video.load();

  video.addEventListener("loadedmetadata", () => {
    video.classList.add("has-video");
    videoShell.classList.add("has-video");
  });

  video.addEventListener("error", () => {
    video.classList.remove("has-video");
    videoShell.classList.remove("has-video");
  });

  audio.src = absoluteAsset(siteConfig.assets?.music, "./assets/music.mp3");
}

function renderPhotos() {
  photoGrid.replaceChildren();
  const photos = Array.isArray(siteConfig.photos) ? siteConfig.photos : [];

  photos.forEach((photo, index) => {
    const figure = document.createElement("figure");
    const frame = document.createElement("div");
    const image = document.createElement("img");
    const empty = document.createElement("span");
    const trigger = document.createElement("button");
    const caption = document.createElement("figcaption");
    const date = document.createElement("span");
    const label = document.createElement("p");
    const layout = ["wide", "standard", "tall"].includes(photo.layout)
      ? photo.layout
      : "standard";

    figure.className = `photo photo--${layout}`;
    frame.className = "photo__frame";
    image.alt = photo.alt || photo.caption || `照片 ${index + 1}`;
    image.loading = "lazy";
    image.onload = () => figure.classList.add("has-image");
    image.onerror = () => figure.classList.remove("has-image");
    image.src = photo.path;
    empty.className = "photo__empty";
    empty.textContent = `PHOTO / ${String(index + 1).padStart(2, "0")}`;
    trigger.type = "button";
    trigger.dataset.photoIndex = String(index);
    trigger.setAttribute("aria-label", `查看照片：${photo.caption || index + 1}`);
    date.textContent = photo.date || "";
    label.textContent = photo.caption || "";
    frame.append(image, empty, trigger);
    caption.append(date, label);
    figure.append(frame, caption);
    photoGrid.append(figure);
  });
}

function renderAll() {
  fillSiteContent();
  renderMedia();
  renderArticles();
  renderPhotos();
  renderTimeline();
  splitText(heroTitle);
  splitText(featuredTitle);
  observeReveals();
}

function openArticle(index) {
  const article = siteConfig.articles?.[index];
  if (!article) {
    return;
  }

  currentArticleIndex = index;
  articleReaderDate.textContent = article.date || "";
  articleReaderTitle.textContent = article.title || "";
  articleReaderLead.textContent = article.excerpt || "";
  articleReaderBody.replaceChildren(
    ...(article.body || []).map((paragraph) => {
      const p = document.createElement("p");
      p.textContent = paragraph;
      return p;
    }),
  );
  articleReader.classList.add("is-open");
  articleReader.setAttribute("aria-hidden", "false");
  document.body.classList.add("is-reader-open");
  closeArticleButton.focus();
}

function closeArticle() {
  articleReader.classList.remove("is-open");
  articleReader.setAttribute("aria-hidden", "true");
  document.body.classList.remove("is-reader-open");
}

function openLightbox(index) {
  const photos = siteConfig.photos || [];
  const photo = photos[index];
  if (!photo) {
    return;
  }

  currentPhotoIndex = index;
  lightboxImage.src = photo.path;
  lightboxImage.alt = photo.alt || photo.caption || `照片 ${index + 1}`;
  lightboxDate.textContent = photo.date || "";
  lightboxTitle.textContent = photo.caption || "未命名照片";
  lightboxCount.textContent = `${String(index + 1).padStart(2, "0")} / ${String(
    photos.length,
  ).padStart(2, "0")}`;
  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.classList.add("is-lightbox-open");
  lightboxClose.focus();
}

function closeLightbox() {
  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.classList.remove("is-lightbox-open");
}

function navigateLightbox(direction) {
  const total = siteConfig.photos?.length || 0;
  if (!total) {
    return;
  }
  openLightbox((currentPhotoIndex + direction + total) % total);
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) {
    return "00:00";
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
}

async function syncCloudContent() {
  if (location.protocol === "file:") {
    return;
  }

  try {
    const response = await fetch("/api/content", { cache: "no-store" });
    if (!response.ok) {
      return;
    }
    const cloudContent = await response.json();
    if (!cloudContent?.name || !Array.isArray(cloudContent.articles)) {
      return;
    }
    siteConfig = cloudContent;
    renderAll();
  } catch {
    // The static content remains usable if the management API is unavailable.
  }
}

let revealObserver;

function observeReveals() {
  if (!revealObserver) {
    revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12 },
    );
  }

  document.querySelectorAll(".reveal-up:not(.is-visible)").forEach((element) => {
    revealObserver.observe(element);
  });
}

function setupNavigation() {
  const sections = [...document.querySelectorAll("main section[id]")];
  const navLinks = [...document.querySelectorAll(".primary-nav a")];

  const observer = new IntersectionObserver(
    (entries) => {
      const active = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!active) {
        return;
      }
      navLinks.forEach((link) => {
        link.classList.toggle(
          "is-active",
          link.getAttribute("href") === `#${active.target.id}`,
        );
      });
    },
    { rootMargin: "-25% 0px -55% 0px", threshold: [0, 0.2, 0.45] },
  );

  sections.forEach((section) => observer.observe(section));

  menuToggle.addEventListener("click", () => {
    const open = primaryNav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(open));
  });

  primaryNav.addEventListener("click", (event) => {
    if (event.target.matches("a")) {
      primaryNav.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
    }
  });
}

function setupPointerEffects() {
  if (!window.matchMedia("(pointer: fine)").matches) {
    return;
  }

  articleIndex.addEventListener("pointermove", (event) => {
    const row = event.target.closest(".article-row");
    if (!row) {
      return;
    }
    const rect = row.getBoundingClientRect();
    row.style.setProperty("--pointer-x", `${event.clientX - rect.left}px`);
    row.style.setProperty("--pointer-y", `${event.clientY - rect.top}px`);
  });

  document.querySelectorAll(".action-link").forEach((button) => {
    button.addEventListener("pointermove", (event) => {
      const rect = button.getBoundingClientRect();
      const x = (event.clientX - rect.left - rect.width / 2) * 0.08;
      const y = (event.clientY - rect.top - rect.height / 2) * 0.08;
      button.style.transform = `translate(${x}px, ${y}px)`;
    });
    button.addEventListener("pointerleave", () => {
      button.style.transform = "";
    });
  });
}

articleIndex.addEventListener("click", (event) => {
  const row = event.target.closest(".article-row");
  if (row) {
    openArticle(Number(row.dataset.index));
  }
});

featuredRead.addEventListener("click", () => openArticle(0));
featuredPreview.addEventListener("click", () => openLightbox(0));

photoGrid.addEventListener("click", (event) => {
  const trigger = event.target.closest("[data-photo-index]");
  if (trigger) {
    openLightbox(Number(trigger.dataset.photoIndex));
  }
});

lightboxClose.addEventListener("click", closeLightbox);
lightboxPrev.addEventListener("click", () => navigateLightbox(-1));
lightboxNext.addEventListener("click", () => navigateLightbox(1));

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

lightbox.addEventListener("pointerdown", (event) => {
  pointerStartX = event.clientX;
});

lightbox.addEventListener("pointerup", (event) => {
  if (pointerStartX === null) {
    return;
  }
  const distance = event.clientX - pointerStartX;
  pointerStartX = null;
  if (Math.abs(distance) > 55) {
    navigateLightbox(distance > 0 ? -1 : 1);
  }
});

closeArticleButton.addEventListener("click", closeArticle);

articleReader.addEventListener("click", (event) => {
  if (event.target === articleReader) {
    closeArticle();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (lightbox.classList.contains("is-open")) {
      closeLightbox();
    } else if (articleReader.classList.contains("is-open")) {
      closeArticle();
    }
  }

  if (lightbox.classList.contains("is-open")) {
    if (event.key === "ArrowLeft") {
      navigateLightbox(-1);
    } else if (event.key === "ArrowRight") {
      navigateLightbox(1);
    }
  }
});

videoPlaceholder.addEventListener("click", () => {
  video.classList.add("has-video");
  videoShell.classList.add("has-video");
  video.play().catch(() => {
    video.classList.remove("has-video");
    videoShell.classList.remove("has-video");
  });
});

musicToggle.addEventListener("click", () => {
  if (audio.paused) {
    audio.play().catch(() => {
      musicState.textContent = "音乐位待添加";
      musicToggle.disabled = true;
    });
  } else {
    audio.pause();
  }
});

audio.addEventListener("play", () => {
  musicDock.classList.add("is-playing");
  musicState.textContent = "正在播放";
});

audio.addEventListener("pause", () => {
  musicDock.classList.remove("is-playing");
  musicState.textContent = "已暂停";
});

audio.addEventListener("loadedmetadata", () => {
  musicDuration.textContent = formatTime(audio.duration);
  musicProgress.max = String(audio.duration || 0);
});

audio.addEventListener("timeupdate", () => {
  musicProgress.value = String(audio.currentTime || 0);
  musicCurrent.textContent = formatTime(audio.currentTime);
});

audio.addEventListener("ended", () => {
  musicProgress.value = "0";
  musicCurrent.textContent = "00:00";
});

audio.addEventListener("error", () => {
  musicState.textContent = "音乐位待添加";
  musicToggle.disabled = true;
  musicProgress.disabled = true;
});

musicProgress.addEventListener("input", () => {
  audio.currentTime = Number(musicProgress.value);
});

let musicCollapsed = window.matchMedia("(max-width: 1024px)").matches;
musicDock.classList.toggle("is-collapsed", musicCollapsed);
musicCollapse.setAttribute(
  "aria-label",
  musicCollapsed ? "展开音乐播放器" : "折叠音乐播放器",
);

musicCollapse.addEventListener("click", () => {
  musicCollapsed = !musicCollapsed;
  musicDock.classList.toggle("is-collapsed", musicCollapsed);
  musicCollapse.setAttribute(
    "aria-label",
    musicCollapsed ? "展开音乐播放器" : "折叠音乐播放器",
  );
});

let ticking = false;

window.addEventListener(
  "scroll",
  () => {
    if (ticking) {
      return;
    }
    ticking = true;
    window.requestAnimationFrame(() => {
      const maxScroll = document.documentElement.scrollHeight - innerHeight;
      const progress = maxScroll > 0 ? scrollY / maxScroll : 0;
      scrollProgress.style.transform = `scaleX(${progress})`;
      siteHeader.classList.toggle("is-scrolled", scrollY > 28);

      if (heroVisual && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        heroVisual.style.transform = `translateY(${Math.min(scrollY * 0.06, 70)}px)`;
      }
      ticking = false;
    });
  },
  { passive: true },
);

window.addEventListener("load", () => {
  window.setTimeout(() => {
    document.body.classList.add("is-loaded");
    pageLoader.classList.add("is-hidden");
  }, 620);
});

setupNavigation();
setupPointerEffects();
renderAll();
syncCloudContent();

window.setTimeout(() => {
  document.body.classList.add("is-loaded");
  pageLoader.classList.add("is-hidden");
}, 1800);
