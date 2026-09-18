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
  heroPhotoIndex: 0,
  featuredArticleIndex: 0,
  backgroundMode: "image",
  assets: {
    background: "./assets/background.jpg",
    backgroundVideo:
      "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260723_145606_ab143199-b593-4941-bb1b-9afca215416b.mp4",
    avatar: "./assets/avatar.jpg",
    video: "./assets/intro.mp4",
    poster: "./assets/video-poster.jpg",
    music: "./assets/music.mp3",
  },
  music: {
    title: "待添加曲目",
    artist: "刘骐硕",
    tracks: [],
  },
  photos: [],
  works: [],
  timeline: [],
  articles: [],
};

let siteConfig = window.SITE_CONTENT || defaultSiteConfig;

const pageLoader = document.querySelector("#page-loader");
const ambient = document.querySelector(".ambient");
const ambientVideo = document.querySelector("#ambient-video");
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
const articleHoverPreview = document.querySelector("#article-hover-preview");
const articleHoverImage = articleHoverPreview?.querySelector("img");
const articleHoverLabel = articleHoverPreview?.querySelector("span");
const timeline = document.querySelector("#timeline");
const depthCarouselHost = document.querySelector("#depth-carousel");
const heroRoleType = document.querySelector("#hero-role-type");
const video = document.querySelector("#intro-video");
const videoShell = document.querySelector("[data-video-shell]");
const videoPlaceholder = document.querySelector("#video-placeholder");
const musicDock = document.querySelector("#music-dock");
const musicToggle = document.querySelector("#music-toggle");
const musicPrev = document.querySelector("#music-prev");
const musicNext = document.querySelector("#music-next");
const musicVolume = document.querySelector("#music-volume");
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
let depthCarouselInstance = null;
let roleTyper = null;
let musicTracks = [];
let currentMusicIndex = -1;
let musicHistory = [];
let musicPlaybackFailures = 0;

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

  const featuredIndex = Math.min(
    Math.max(Number(siteConfig.featuredArticleIndex) || 0, 0),
    articles.length - 1,
  );
  const featured = articles[featuredIndex];
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
    time.textContent = item.year || (index === 0 ? "现在" : `${2026 - index}`);
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

function resolveArticleImage(article) {
  if (!article || article.coverPhotoId === "none") {
    return null;
  }

  const photos = Array.isArray(siteConfig.photos) ? siteConfig.photos : [];
  if (article.coverPhotoId) {
    const coverPhoto = photos.find((photo) => photo.id === article.coverPhotoId);
    if (coverPhoto) {
      return coverPhoto;
    }
  }

  if (article.coverImage) {
    return {
      path: article.coverImage,
      alt: article.coverImageAlt || article.title || "",
      caption: article.title || "",
    };
  }

  return article.linkedPhotoId
    ? photos.find((photo) => photo.id === article.linkedPhotoId) || null
    : null;
}

function renderMedia() {
  const background = absoluteAsset(
    siteConfig.assets?.background,
    "./assets/background.jpg",
  );
  const avatar = absoluteAsset(siteConfig.assets?.avatar, "./assets/avatar.jpg");
  const photos = Array.isArray(siteConfig.photos) ? siteConfig.photos : [];
  const heroPhotoIndex = Math.min(
    Math.max(Number(siteConfig.heroPhotoIndex) || 0, 0),
    Math.max(photos.length - 1, 0),
  );
  const heroPhoto = photos[heroPhotoIndex];
  const heroPath = heroPhoto?.path || background;
  const heroFallback = heroPath.replace("/photos/", "/");
  const articles = Array.isArray(siteConfig.articles) ? siteConfig.articles : [];
  const featuredArticleIndex = Math.min(
    Math.max(Number(siteConfig.featuredArticleIndex) || 0, 0),
    Math.max(articles.length - 1, 0),
  );
  const featuredArticle = articles[featuredArticleIndex];
  const featuredArticleImage = resolveArticleImage(featuredArticle);
  const featuredPath = featuredArticleImage?.path || heroPath;
  const featuredFallback = featuredPath.replace("/photos/", "/");

  document.documentElement.style.setProperty(
    "--ambient-image",
    `url("${background}")`,
  );
  document.querySelector(".ambient__image").style.backgroundImage =
    `url("${background}")`;
  ambientVideo.poster = background;
  const backgroundMode = siteConfig.backgroundMode || "video";

  if (
    backgroundMode === "video" &&
    siteConfig.assets?.backgroundVideo
  ) {
    ambientVideo.src = siteConfig.assets.backgroundVideo;
    ambientVideo.load();
  } else {
    ambientVideo.pause();
    ambientVideo.removeAttribute("src");
    ambientVideo.load();
    ambient.classList.remove("has-video");
  }

  imageFallback(heroImage, heroPath, heroFallback || background);
  heroPhotoCaption.textContent =
    heroPhoto?.caption || siteConfig.status || "生活切片";
  imageFallback(
    featuredImage,
    featuredPath,
    featuredFallback || background,
  );

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

  prepareMusicLibrary();
}

ambientVideo.addEventListener("canplay", () => {
  if (
    siteConfig.backgroundMode !== "video" ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    return;
  }
  ambientVideo
    .play()
    .then(() => ambient.classList.add("has-video"))
    .catch(() => ambient.classList.remove("has-video"));
});

ambientVideo.addEventListener("error", () => {
  ambient.classList.remove("has-video");
});

function renderAll() {
  fillSiteContent();
  renderMedia();
  renderArticles();
  renderTimeline();
  renderRoleType();
  renderDepthCarousel();
  splitText(heroTitle);
  splitText(featuredTitle);
  setupTextReveals();
  observeReveals();
}

function renderRoleType() {
  if (!heroRoleType) {
    return;
  }

  const texts = [
    siteConfig.role,
    siteConfig.status,
    siteConfig.focus,
  ].filter(Boolean);

  if (roleTyper) {
    roleTyper.texts = texts;
    return;
  }

  if (typeof window.TextType !== "function") {
    heroRoleType.textContent = siteConfig.role || "";
    return;
  }

  roleTyper = new window.TextType(heroRoleType, {
    texts,
    typingSpeed: 68,
    deletingSpeed: 34,
    pauseDuration: 1600,
    cursorCharacter: "|",
  });
}

function renderDepthCarousel() {
  if (!depthCarouselHost || typeof window.DepthCarousel !== "function") {
    return;
  }

  const photos = Array.isArray(siteConfig.photos) ? siteConfig.photos : [];
  depthCarouselInstance?.destroy();

  if (!photos.length) {
    depthCarouselHost.innerHTML =
      '<p class="empty-copy">照片正在整理中。</p>';
    return;
  }

  const viewportWidth = window.innerWidth;
  const cardWidth =
    viewportWidth <= 480
      ? Math.min(300, viewportWidth - 36)
      : viewportWidth <= 1024
        ? 360
        : viewportWidth <= 1440
          ? 420
          : 480;
  const cardHeight = Math.round(cardWidth * 1.25);
  const spread = viewportWidth <= 480 ? 54 : viewportWidth <= 1024 ? 74 : 96;
  const depth = viewportWidth <= 480 ? 145 : viewportWidth <= 1024 ? 190 : 230;

  depthCarouselHost.style.minHeight = `${
    cardHeight + (viewportWidth <= 480 ? 110 : 180)
  }px`;

  depthCarouselInstance = new window.DepthCarousel(depthCarouselHost, {
    items: photos.map((photo, index) => ({
      image: photo.path,
      fallback: photo.path.replace("/photos/", "/"),
      alt: photo.alt || photo.caption || `照片 ${index + 1}`,
      caption: photo.caption || "",
      date: photo.date || "",
    })),
    cardWidth,
    cardHeight,
    radius: viewportWidth <= 480 ? 12 : 16,
    depth,
    spread,
    tilt: viewportWidth <= 1024 ? 18 : 22,
    tiltDirection: "right",
    visibleCards:
      viewportWidth <= 600 ? 2.5 : viewportWidth <= 1024 ? 3.2 : 4.4,
    falloff: 0.2,
    blur: 6,
    autoplay: true,
    loop: true,
    onSelect: (index) => openLightbox(index),
  });
}

let carouselResizeTimer;

window.addEventListener("resize", () => {
  window.clearTimeout(carouselResizeTimer);
  carouselResizeTimer = window.setTimeout(() => {
    renderDepthCarousel();
  }, 180);
});

function setupTextReveals() {
  document
    .querySelectorAll(
      ".journal__heading h2, .stills__heading h2, .film__copy h2, .about__statement blockquote, .about__statement > p, .hero__intro",
    )
    .forEach((element) => element.classList.add("reveal-text"));
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
  const articleImage = resolveArticleImage(article);
  const articleMedia = articleImage
    ? document.createElement("figure")
    : null;
  if (articleMedia) {
    const image = document.createElement("img");
    articleMedia.className = "article-reader__media";
    image.src = articleImage.path;
    image.alt = articleImage.alt || articleImage.caption || "";
    articleMedia.append(image);
  }
  articleReaderBody.replaceChildren(
    ...(articleMedia ? [articleMedia] : []),
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

  const cardImage = depthCarouselHost?.querySelectorAll(
    ".depth-carousel__card img",
  )[index];
  const fallbackPath = photo.path.replace("/photos/", "/");
  const cardLoaded = (cardImage?.naturalWidth || 0) > 0;
  const primarySource = cardLoaded
    ? cardImage.currentSrc || cardImage.src
    : fallbackPath;
  const secondarySource = cardLoaded ? fallbackPath : photo.path;

  currentPhotoIndex = index;
  lightboxImage.onerror = () => {
    if (secondarySource !== primarySource && lightboxImage.dataset.fallbackUsed !== "true") {
      lightboxImage.dataset.fallbackUsed = "true";
      lightboxImage.src = secondarySource;
    }
  };
  lightboxImage.dataset.fallbackUsed = "";
  lightboxImage.src = primarySource;
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
    siteConfig = {
      ...defaultSiteConfig,
      ...cloudContent,
      assets: {
        ...defaultSiteConfig.assets,
        ...(cloudContent.assets || {}),
      },
      music: {
        ...defaultSiteConfig.music,
        ...(cloudContent.music || {}),
      },
    };
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
  document.querySelectorAll(".reveal-text:not(.is-visible)").forEach((element) => {
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

    if (articleHoverPreview && articleHoverImage) {
      const index = Number(row.dataset.index);
      const article = siteConfig.articles?.[index];
      const photos = siteConfig.photos || [];
      const articleImage = resolveArticleImage(article);
      const photo = articleImage || (photos.length ? photos[index % photos.length] : null);
      const nextSource = photo?.path || siteConfig.assets?.background;
      const fallbackSource = nextSource?.replace("/photos/", "/");
      if (
        nextSource &&
        articleHoverImage.dataset.source !== nextSource
      ) {
        articleHoverImage.dataset.source = nextSource;
        articleHoverImage.onerror = () => {
          if (
            fallbackSource &&
            fallbackSource !== nextSource &&
            articleHoverImage.dataset.fallbackUsed !== "true"
          ) {
            articleHoverImage.dataset.fallbackUsed = "true";
            articleHoverImage.src = fallbackSource;
          }
        };
        articleHoverImage.dataset.fallbackUsed = "";
        articleHoverImage.src = nextSource;
      }
      articleHoverLabel.textContent = article?.title || "阅读文章";
      articleHoverPreview.style.left = `${Math.min(
        event.clientX + 34,
        innerWidth - 120,
      )}px`;
      articleHoverPreview.style.top = `${Math.max(
        140,
        Math.min(event.clientY, innerHeight - 140),
      )}px`;
      articleHoverPreview.classList.add("is-visible");
    }
  });

  articleIndex.addEventListener("pointerleave", () => {
    articleHoverPreview?.classList.remove("is-visible");
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

featuredRead.addEventListener("click", () =>
  openArticle(Number(siteConfig.featuredArticleIndex) || 0),
);
featuredPreview.addEventListener("click", () =>
  openLightbox(Number(siteConfig.heroPhotoIndex) || 0),
);

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

function prepareMusicLibrary() {
  const configuredTracks = Array.isArray(siteConfig.music?.tracks)
    ? siteConfig.music.tracks.filter((track) => track?.path)
    : [];
  const fallbackTrack = siteConfig.assets?.music
    ? [
        {
          title: siteConfig.music?.title || "未命名曲目",
          artist: siteConfig.music?.artist || "",
          path: siteConfig.assets.music,
        },
      ]
    : [];

  musicTracks = configuredTracks.length ? configuredTracks : fallbackTrack;
  musicHistory = [];
  musicPlaybackFailures = 0;

  if (!musicTracks.length) {
    currentMusicIndex = -1;
    musicState.textContent = "音乐位待添加";
    musicToggle.disabled = true;
    musicPrev.disabled = true;
    musicNext.disabled = true;
    setText('[data-music="title"]', "待添加曲目");
    setText('[data-music="artist"]', "");
    return;
  }

  musicToggle.disabled = false;
  musicPrev.disabled = false;
  musicNext.disabled = false;
  loadMusicTrack(Math.floor(Math.random() * musicTracks.length), false);
}

function loadMusicTrack(index, autoplay) {
  if (!musicTracks.length) {
    return;
  }

  currentMusicIndex = (index + musicTracks.length) % musicTracks.length;
  const track = musicTracks[currentMusicIndex];
  audio.src = absoluteAsset(track.path, "./assets/music.mp3");
  audio.load();
  setText('[data-music="title"]', track.title || "未命名曲目");
  setText('[data-music="artist"]', track.artist || "");
  musicState.textContent = autoplay ? "随机播放" : "准备播放";
  musicProgress.value = "0";
  musicCurrent.textContent = "00:00";

  if (autoplay) {
    audio.play().catch(() => {
      musicState.textContent = "点击播放";
    });
  }
}

function randomMusicIndex() {
  if (musicTracks.length <= 1) {
    return 0;
  }
  let next = currentMusicIndex;
  while (next === currentMusicIndex) {
    next = Math.floor(Math.random() * musicTracks.length);
  }
  return next;
}

function playNextRandomTrack() {
  if (!musicTracks.length) {
    return;
  }
  if (currentMusicIndex >= 0) {
    musicHistory.push(currentMusicIndex);
  }
  loadMusicTrack(randomMusicIndex(), true);
}

function playPreviousTrack() {
  if (!musicTracks.length) {
    return;
  }
  const previous = musicHistory.pop();
  loadMusicTrack(
    previous ?? (currentMusicIndex - 1 + musicTracks.length) % musicTracks.length,
    true,
  );
}

musicToggle.addEventListener("click", () => {
  if (audio.paused) {
    if (currentMusicIndex < 0) {
      loadMusicTrack(randomMusicIndex(), false);
    }
    audio.play().catch(() => {
      musicState.textContent = "点击播放";
    });
  } else {
    audio.pause();
  }
});

musicNext.addEventListener("click", playNextRandomTrack);
musicPrev.addEventListener("click", playPreviousTrack);

const savedVolume = Number(localStorage.getItem("siteMusicVolume"));
audio.volume = Number.isFinite(savedVolume)
  ? Math.min(Math.max(savedVolume, 0), 1)
  : 0.82;
musicVolume.value = String(audio.volume);

musicVolume.addEventListener("input", () => {
  audio.volume = Number(musicVolume.value);
  localStorage.setItem("siteMusicVolume", String(audio.volume));
});

audio.addEventListener("play", () => {
  musicPlaybackFailures = 0;
  musicDock.classList.add("is-playing");
  musicState.textContent = "随机播放";
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
  playNextRandomTrack();
});

audio.addEventListener("error", () => {
  musicPlaybackFailures += 1;
  musicState.textContent = "曲目加载失败";
  if (musicPlaybackFailures < musicTracks.length) {
    window.setTimeout(playNextRandomTrack, 800);
  } else {
    musicToggle.disabled = true;
  }
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
