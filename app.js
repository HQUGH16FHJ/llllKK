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
  featured: {
    date: "",
    title: "",
    excerpt: "",
    photoId: "",
    image: "",
    imageAlt: "",
  },
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
const ambientImage = document.querySelector(".ambient__image");
const ambientVideo = document.querySelector("#ambient-video");
const scrollProgress = document.querySelector("#scroll-progress");
const sectionRailLinks = [...document.querySelectorAll("#section-rail a")];
const pointerGlow = document.querySelector("#pointer-glow");
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
const photoFilters = document.querySelector("#photo-filters");
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
const musicBars = document.querySelector("#music-bars");
const articleReader = document.querySelector("#article-reader");
const articleReaderPanel = document.querySelector(".article-reader__panel");
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
let currentFeaturedPhoto = null;
let activePhotoFilter = "all";
let pointerStartX = null;
let depthCarouselInstance = null;
let roleTyper = null;
let textMotionObserver = null;
let musicTracks = [];
let currentMusicIndex = -1;
let musicHistory = [];
let musicPlaybackFailures = 0;
let musicTracksSignature = "";
let musicAutoplayArmed = false;
let audioContext = null;
let analyser = null;
let analyserData = null;
let visualizerFrame = null;
let visualizerSource = null;
let videoLoadObserver = null;

const currentYear = new Date().getFullYear();
document.querySelector("#footer-year").textContent = currentYear;

function setText(selector, value) {
  document.querySelectorAll(selector).forEach((node) => {
    node.textContent = value || "";
  });
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
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
    tag.textContent = `${String(index + 1).padStart(2, "0")} · ${
      index === 0 ? "最新" : "记录"
    }`;
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
  const featuredConfig = siteConfig.featured || {};
  featuredDate.textContent = featuredConfig.date || featured.date || "";
  featuredTitle.textContent =
    featuredConfig.title || featured.title || "未命名文章";
  featuredExcerpt.textContent =
    featuredConfig.excerpt || featured.excerpt || "";
  featuredImage.alt = featuredConfig.title || featured.title || "";
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

function setAmbientImage(primary, fallback) {
  if (!ambientImage) {
    return;
  }

  const applyImage = (source) => {
    ambientImage.style.backgroundImage = `url("${source}")`;
    ambientImage.classList.add("has-background");
  };
  const preload = new Image();

  preload.onload = () => applyImage(primary);
  preload.onerror = () => {
    if (fallback && fallback !== primary) {
      const fallbackImage = new Image();
      fallbackImage.onload = () => applyImage(fallback);
      fallbackImage.onerror = () => {
        ambientImage.classList.remove("has-background");
      };
      fallbackImage.src = fallback;
      return;
    }
    ambientImage.classList.remove("has-background");
  };
  preload.src = primary;
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

function resolveFeaturedImage(featuredArticle) {
  const featured = siteConfig.featured || {};
  const photos = Array.isArray(siteConfig.photos) ? siteConfig.photos : [];

  if (featured.photoId) {
    const selectedPhoto = photos.find((photo) => photo.id === featured.photoId);
    if (selectedPhoto) {
      return selectedPhoto;
    }
  }

  if (featured.image) {
    return {
      path: featured.image,
      alt: featured.imageAlt || featured.title || featuredArticle?.title || "",
      caption: featured.title || featuredArticle?.title || "",
    };
  }

  return resolveArticleImage(featuredArticle);
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
  const featuredArticleImage = resolveFeaturedImage(featuredArticle);
  const featuredPath = featuredArticleImage?.path || heroPath;
  const featuredFallback = featuredPath.replace("/photos/", "/");
  currentFeaturedPhoto = featuredArticleImage || heroPhoto || null;

  document.documentElement.style.setProperty(
    "--ambient-image",
    `url("${background}")`,
  );
  setAmbientImage(background, "./assets/background.jpg");
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
  video.preload = "none";
  if (!videoLoadObserver) {
    videoLoadObserver = new IntersectionObserver(
      (entries, observer) => {
        if (!entries.some((entry) => entry.isIntersecting)) {
          return;
        }
        video.preload = "metadata";
        video.load();
        observer.disconnect();
      },
      { rootMargin: "360px 0px" },
    );
    videoLoadObserver.observe(videoShell);
  }

  video.addEventListener("loadedmetadata", () => {
    video.classList.add("has-video");
    videoShell.classList.add("has-video");
  });

  video.addEventListener("error", () => {
    video.classList.remove("has-video");
    videoShell.classList.remove("has-video");
    window.requestAnimationFrame(revealVisibleText);
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
  renderPhotoFilters();
  renderDepthCarousel();
  setupMediaDevelopment();
  setupScrollTextHighlight();
  splitText(heroTitle);
  splitText(featuredTitle);
  setupTextReveals();
  observeReveals();
  updateScrollTextHighlight();
  updateKineticHeadings();
}

function renderRoleType() {
  if (!heroRoleType) {
    return;
  }

  const texts = [
    "健身爱好者",
    "大学生",
    "记录者",
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

function getPhotoGroup(photo) {
  return photo.group?.trim() || photo.date?.trim() || "未分组";
}

function getVisiblePhotos() {
  const photos = Array.isArray(siteConfig.photos) ? siteConfig.photos : [];
  if (activePhotoFilter === "all") {
    return photos;
  }
  return photos.filter((photo) => getPhotoGroup(photo) === activePhotoFilter);
}

function renderPhotoFilters() {
  if (!photoFilters) {
    return;
  }

  const photos = Array.isArray(siteConfig.photos) ? siteConfig.photos : [];
  const groups = [...new Set(photos.map(getPhotoGroup))].filter(Boolean);
  if (!groups.includes(activePhotoFilter) && activePhotoFilter !== "all") {
    activePhotoFilter = "all";
  }

  const filters = [
    { value: "all", label: "全部" },
    ...groups.map((group) => ({ value: group, label: group })),
  ];
  photoFilters.innerHTML = filters
    .map(
      (filter) => `
        <button class="photo-filter${activePhotoFilter === filter.value ? " is-active" : ""}" type="button" data-photo-filter="${escapeHtml(filter.value)}">
          ${escapeHtml(filter.label)}
        </button>
      `,
    )
    .join("");
}

function renderDepthCarousel() {
  if (!depthCarouselHost || typeof window.DepthCarousel !== "function") {
    return;
  }

  const photos = getVisiblePhotos();
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
      photo,
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
    onSelect: (_index, item) => openLightboxPhoto(item.photo),
  });
}

let carouselResizeTimer;

window.addEventListener("resize", () => {
  window.clearTimeout(carouselResizeTimer);
  carouselResizeTimer = window.setTimeout(() => {
    renderDepthCarousel();
    setupMediaDevelopment();
  }, 180);
});

photoFilters?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-photo-filter]");
  if (!button) {
    return;
  }
  activePhotoFilter = button.dataset.photoFilter;
  renderPhotoFilters();
  renderDepthCarousel();
  setupMediaDevelopment();
});

function setupTextReveals() {
  document
    .querySelectorAll(
      ".journal__heading h2, .stills__heading h2, .film__copy h2, .about__statement blockquote, .about__statement > p, .hero__intro",
    )
    .forEach((element) => element.classList.add("reveal-text"));

  const motionTargets = [
    ".hero__copy",
    ".hero__visual",
    ".featured__article",
    ".article-row",
    ".depth-carousel-host",
    ".video-stage",
    ".about__details",
    ".timeline__item",
  ];

  motionTargets.forEach((selector) => {
    document.querySelectorAll(selector).forEach((element, index) => {
      element.classList.add("reveal-up");
      element.style.setProperty(
        "--reveal-delay",
        `${Math.min(index * 55, 220)}ms`,
      );
    });
  });

  const textSelectors = [
    ".site-brand strong",
    ".site-brand small",
    ".primary-nav a",
    ".header-email span",
    ".hero__hello",
    ".hero__role",
    ".hero__intro",
    ".hero__facts dt",
    ".hero__facts dd",
    ".hero__visual-note span",
    ".hero__visual-note strong",
    ".hero__profile strong",
    ".hero__profile small",
    ".section-line span",
    ".featured__meta time",
    ".featured__meta span",
    ".featured__copy > p",
    ".featured__read",
    ".velocity-strip__track span",
    ".journal__heading h2",
    ".journal__heading > p",
    ".article-row time",
    ".article-row h3",
    ".article-row__title p",
    ".article-row__tag",
    ".stills__heading h2",
    ".stills__heading > p",
    ".film__copy h2",
    ".film__copy > p",
    ".video-stage__fallback p",
    ".about__statement blockquote",
    ".about__statement > p",
    ".about__facts dt",
    ".about__facts dd",
    ".timeline__item time",
    ".timeline__item h3",
    ".timeline__item p",
    ".footer__brand strong",
    ".footer__top > p",
    ".footer__bottom p",
    ".footer__bottom a",
    ".music-dock__title span",
    ".music-dock__title strong",
    ".music-dock__title small",
    ".depth-carousel__caption small",
    ".depth-carousel__caption strong",
    ".article-reader__header > span",
    ".article-reader__header time",
    ".article-reader__content h2",
    ".article-reader__lead",
    ".article-reader__body p",
    ".lightbox__caption span",
    ".lightbox__caption h3",
    ".lightbox__caption p",
  ];

  textSelectors.forEach((selector) => {
    document.querySelectorAll(selector).forEach((element, index) => {
      if (
        element.matches("[data-split-text]") ||
        element.closest("[data-split-text]")
      ) {
        return;
      }
      element.classList.add("text-motion");
      element.style.setProperty(
        "--text-delay",
        `${Math.min((index % 7) * 45, 190)}ms`,
      );
    });
  });
}

function setupMediaDevelopment() {
  const images = document.querySelectorAll(
    ".hero__visual-frame img, .featured__preview img, .depth-carousel__img, .article-reader__media img, .video-stage video",
  );

  images.forEach((media) => {
    if (media.dataset.developReady === "true") {
      return;
    }
    media.dataset.developReady = "true";
    media.classList.add("media-develop");
    const revealMedia = () => {
      window.requestAnimationFrame(() => media.classList.add("is-developed"));
    };
    if (media.tagName === "IMG" && !media.complete) {
      media.addEventListener("load", revealMedia, { once: true });
      media.addEventListener("error", revealMedia, { once: true });
    } else {
      revealMedia();
    }
  });

  document.querySelectorAll("img").forEach((image) => {
    image.decoding = "async";
    if (!image.closest(".hero__visual")) {
      image.loading = "lazy";
    }
  });
}

function setupScrollTextHighlight() {
  document
    .querySelectorAll(".about__statement blockquote, .film__copy h2")
    .forEach((element) => {
      if (element.dataset.inkReady === "true") {
        return;
      }
      const text = element.textContent;
      element.replaceChildren(
        ...[...text].map((character) => {
          const span = document.createElement("span");
          span.className = "scroll-ink-char";
          span.textContent = character === " " ? "\u00a0" : character;
          return span;
        }),
      );
      element.dataset.inkReady = "true";
      element.classList.add("scroll-ink");
    });
}

function updateScrollTextHighlight() {
  document.querySelectorAll(".scroll-ink").forEach((element) => {
    const rect = element.getBoundingClientRect();
    const start = window.innerHeight * 0.82;
    const end = window.innerHeight * 0.28;
    const progress = Math.min(
      1,
      Math.max(0, (start - rect.top) / Math.max(rect.height + start - end, 1)),
    );
    const characters = element.querySelectorAll(".scroll-ink-char");
    const litCount = Math.round(characters.length * progress);
    characters.forEach((character, index) => {
      character.classList.toggle("is-lit", index < litCount);
    });
  });
}

function updateKineticHeadings() {
  document
    .querySelectorAll(
      ".journal__heading h2, .stills__heading h2, .film__copy h2, .about__statement blockquote",
    )
    .forEach((heading) => {
      const rect = heading.getBoundingClientRect();
      const progress = Math.min(
        1,
        Math.max(
          0,
          (window.innerHeight - rect.top) /
            Math.max(window.innerHeight + rect.height, 1),
        ),
      );
      heading.style.setProperty("--heading-scale", `${0.95 + progress * 0.05}`);
      heading.style.setProperty(
        "--heading-shift",
        `${(1 - progress) * 26}px`,
      );
    });
}

function observeTextMotion(root = document) {
  if (!textMotionObserver) {
    textMotionObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -7% 0px",
      },
    );
  }

  root.querySelectorAll(".text-motion:not(.is-visible)").forEach((element) => {
    textMotionObserver.observe(element);
  });
}

function revealVisibleText() {
  document.querySelectorAll(".text-motion:not(.is-visible)").forEach((element) => {
    const rect = element.getBoundingClientRect();
    const isVisible =
      rect.top < window.innerHeight * 0.96 && rect.bottom > window.innerHeight * 0.04;
    if (!isVisible) {
      return;
    }
    element.classList.add("is-visible");
    textMotionObserver?.unobserve(element);
  });
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
    image.alt = articleImage.alt || articleImage.caption || "";
    image.tabIndex = 0;
    image.setAttribute("role", "button");
    image.setAttribute("aria-label", `放大查看：${image.alt || "文章照片"}`);
    image.addEventListener("click", () => openLightboxPhoto(articleImage));
    image.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openLightboxPhoto(articleImage);
      }
    });
    image.onerror = () => {
      const fallbackPath = articleImage.path.replace("/photos/", "/");
      if (
        fallbackPath !== articleImage.path &&
        image.dataset.fallbackUsed !== "true"
      ) {
        image.dataset.fallbackUsed = "true";
        image.src = fallbackPath;
      }
    };
    image.src = articleImage.path;
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
  articleReaderBody.querySelectorAll("p").forEach((element, index) => {
    element.classList.add("text-motion");
    element.style.setProperty(
      "--text-delay",
      `${Math.min(index * 70, 210)}ms`,
    );
  });
  articleReader.classList.add("is-open");
  articleReader.setAttribute("aria-hidden", "false");
  document.body.classList.add("is-reader-open");
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      articleReaderBody
        .querySelectorAll(".text-motion")
        .forEach((element) => element.classList.add("is-visible"));
    });
  });
  window.requestAnimationFrame(updateArticleReaderProgress);
  closeArticleButton.focus();
}

function updateArticleReaderProgress() {
  if (!articleReaderPanel) {
    return;
  }
  const maxScroll =
    articleReaderPanel.scrollHeight - articleReaderPanel.clientHeight;
  const progress =
    maxScroll > 0 ? articleReaderPanel.scrollTop / maxScroll : 0;
  articleReaderPanel.style.setProperty(
    "--reader-progress",
    `${Math.min(Math.max(progress, 0), 1) * 100}%`,
  );
}

function closeArticle() {
  articleReader.classList.remove("is-open");
  articleReader.setAttribute("aria-hidden", "true");
  document.body.classList.remove("is-reader-open");
}

function showLightboxPhoto(photo, index = -1) {
  if (!photo?.path) {
    return;
  }

  const fallbackPath = photo.path.replace("/photos/", "/");
  const total = siteConfig.photos?.length || 0;

  currentPhotoIndex = index;
  lightbox.classList.toggle("is-wide", photo.layout === "wide");
  lightbox.classList.toggle("is-tall", photo.layout === "tall");
  lightbox.classList.toggle("is-full", photo.layout === "full");
  lightboxImage.onerror = () => {
    if (
      fallbackPath !== photo.path &&
      lightboxImage.dataset.fallbackUsed !== "true"
    ) {
      lightboxImage.dataset.fallbackUsed = "true";
      lightboxImage.src = fallbackPath;
    }
  };
  lightboxImage.dataset.fallbackUsed = "";
  lightboxImage.src = photo.path;
  lightboxImage.alt = photo.alt || photo.caption || "照片";
  lightboxDate.textContent = photo.date || "";
  lightboxTitle.textContent = photo.caption || "未命名照片";
  lightboxCount.textContent =
    index >= 0
      ? `${String(index + 1).padStart(2, "0")} / ${String(total).padStart(
          2,
          "0",
        )}`
      : "01 / 01";
  lightboxPrev.disabled = index < 0 || total <= 1;
  lightboxNext.disabled = index < 0 || total <= 1;
  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.classList.add("is-lightbox-open");
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      lightbox
        .querySelectorAll(".text-motion")
        .forEach((element) => element.classList.add("is-visible"));
    });
  });
  lightboxClose.focus();
}

function openLightbox(index) {
  const photos = siteConfig.photos || [];
  const photo = photos[index];
  if (!photo) {
    return;
  }

  showLightboxPhoto(photo, index);
}

function openLightboxPhoto(photo) {
  const index = (siteConfig.photos || []).findIndex(
    (item) => item.path === photo?.path,
  );
  showLightboxPhoto(photo, index);
}

function closeLightbox() {
  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.classList.remove("is-lightbox-open");
}

function navigateLightbox(direction) {
  const total = siteConfig.photos?.length || 0;
  if (!total || currentPhotoIndex < 0) {
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
  observeTextMotion();
}

function setupNavigation() {
  const sections = [...document.querySelectorAll("main section[id]")];
  const navLinks = [...document.querySelectorAll(".primary-nav a")];
  let scrollAnimationFrame = null;
  let lastActiveSection = "";

  const scrollToSection = (target) => {
    if (!target) {
      return;
    }

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const offset = siteHeader.getBoundingClientRect().height + 14;
    const targetY = Math.max(
      0,
      target.getBoundingClientRect().top + window.scrollY - offset,
    );

    if (scrollAnimationFrame) {
      window.cancelAnimationFrame(scrollAnimationFrame);
    }

    if (reducedMotion || Math.abs(targetY - window.scrollY) < 4) {
      window.scrollTo(0, targetY);
      return;
    }

    const startY = window.scrollY;
    const distance = targetY - startY;
    const duration = Math.min(
      900,
      Math.max(480, Math.abs(distance) * 0.32),
    );
    const startTime = performance.now();

    const step = (time) => {
      const progress = Math.min((time - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      window.scrollTo(0, startY + distance * eased);
      if (progress < 1) {
        scrollAnimationFrame = window.requestAnimationFrame(step);
      } else {
        scrollAnimationFrame = null;
      }
    };

    scrollAnimationFrame = window.requestAnimationFrame(step);
  };

  let navTicking = false;
  const updateActiveNav = () => {
    const offset = siteHeader.getBoundingClientRect().height + 32;
    let activeSection = sections[0];

    sections.forEach((section) => {
      if (section.getBoundingClientRect().top <= offset) {
        activeSection = section;
      }
    });

    const atPageEnd =
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 4;
    if (atPageEnd) {
      activeSection = sections[sections.length - 1];
    }

    const nextSection = activeSection?.id || "home";
    if (lastActiveSection && lastActiveSection !== nextSection) {
      document.body.classList.remove("is-section-switching");
      void document.body.offsetWidth;
      document.body.classList.add("is-section-switching");
      window.setTimeout(
        () => document.body.classList.remove("is-section-switching"),
        620,
      );
    }
    lastActiveSection = nextSection;
    document.documentElement.dataset.activeSection = nextSection;

    navLinks.forEach((link) => {
      link.classList.toggle(
        "is-active",
        link.getAttribute("href") === `#${activeSection?.id}`,
      );
    });
    sectionRailLinks.forEach((link) => {
      link.classList.toggle(
        "is-active",
        link.getAttribute("href") === `#${activeSection?.id}`,
      );
    });
  };

  const scheduleActiveNav = () => {
    if (navTicking) {
      return;
    }
    navTicking = true;
    window.requestAnimationFrame(() => {
      updateActiveNav();
      navTicking = false;
    });
  };

  menuToggle.addEventListener("click", () => {
    const open = primaryNav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("is-nav-open", open);
  });

  primaryNav.addEventListener("click", (event) => {
    if (event.target.matches("a")) {
      primaryNav.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("is-nav-open");
    }
  });

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const hash = link.getAttribute("href");
      const target = hash && hash !== "#" ? document.querySelector(hash) : null;
      if (!target) {
        return;
      }
      event.preventDefault();
      scrollToSection(target);
      if (window.location.hash !== hash) {
        window.history.pushState(null, "", hash);
      }
    });
  });

  document.addEventListener("pointerdown", (event) => {
    if (
      !primaryNav.classList.contains("is-open") ||
      primaryNav.contains(event.target) ||
      menuToggle.contains(event.target)
    ) {
      return;
    }
    primaryNav.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("is-nav-open");
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || !primaryNav.classList.contains("is-open")) {
      return;
    }
    primaryNav.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("is-nav-open");
    menuToggle.focus();
  });

  window.addEventListener("scroll", scheduleActiveNav, { passive: true });
  window.addEventListener("resize", scheduleActiveNav);
  updateActiveNav();
}

function setupPointerEffects() {
  const finePointer = window.matchMedia("(pointer: fine)").matches;

  if (pointerGlow && finePointer) {
    document.addEventListener("pointermove", (event) => {
      pointerGlow.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
    });
  }

  document.addEventListener("click", (event) => {
    const button = event.target.closest(
      ".action-link, .featured__read, .music-dock button, .footer__bottom a",
    );
    if (!button || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    const rect = button.getBoundingClientRect();
    const ripple = document.createElement("span");
    ripple.className = "interaction-ripple";
    ripple.style.left = `${event.clientX - rect.left}px`;
    ripple.style.top = `${event.clientY - rect.top}px`;
    button.append(ripple);
    window.setTimeout(() => ripple.remove(), 650);
  });

  if (!finePointer) {
    document.addEventListener("pointerdown", (event) => {
      const element = event.target.closest(
        ".hero__visual-frame, .featured__preview, .video-stage, .about__facts",
      );
      if (!element) {
        return;
      }
      const rect = element.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      element.style.setProperty("--tilt-y", `${x * 4}deg`);
      element.style.setProperty("--tilt-x", `${y * -4}deg`);
      element.style.setProperty("--tilt-scale", "1.008");
      window.setTimeout(() => {
        element.style.setProperty("--tilt-y", "0deg");
        element.style.setProperty("--tilt-x", "0deg");
        element.style.setProperty("--tilt-scale", "1");
      }, 360);
    });
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

  const magneticElements = document.querySelectorAll(
    ".action-link, .primary-nav a, .featured__read, .footer__bottom a, .music-dock button",
  );
  magneticElements.forEach((button) => {
    button.addEventListener("pointermove", (event) => {
      const rect = button.getBoundingClientRect();
      const x = (event.clientX - rect.left - rect.width / 2) * 0.14;
      const y = (event.clientY - rect.top - rect.height / 2) * 0.14;
      button.style.setProperty("--magnetic-x", `${x}px`);
      button.style.setProperty("--magnetic-y", `${y}px`);
    });
    button.addEventListener("pointerleave", () => {
      button.style.setProperty("--magnetic-x", "0px");
      button.style.setProperty("--magnetic-y", "0px");
    });
  });

  const tiltElements = document.querySelectorAll(
    ".hero__visual-frame, .featured__preview, .video-stage, .about__facts",
  );
  tiltElements.forEach((element) => {
    element.addEventListener("pointermove", (event) => {
      const rect = element.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      element.style.setProperty("--tilt-y", `${x * 6}deg`);
      element.style.setProperty("--tilt-x", `${y * -6}deg`);
      element.style.setProperty("--tilt-scale", "1.012");
    });
    element.addEventListener("pointerleave", () => {
      element.style.setProperty("--tilt-y", "0deg");
      element.style.setProperty("--tilt-x", "0deg");
      element.style.setProperty("--tilt-scale", "1");
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
  openLightboxPhoto(currentFeaturedPhoto),
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

articleReaderPanel?.addEventListener(
  "scroll",
  () => window.requestAnimationFrame(updateArticleReaderProgress),
  { passive: true },
);

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

  const nextTracks = configuredTracks.length ? configuredTracks : fallbackTrack;
  const nextSignature = JSON.stringify(
    nextTracks.map((track) => [track.path, track.title, track.artist]),
  );
  if (musicTracksSignature === nextSignature) {
    return;
  }

  musicTracks = nextTracks;
  musicTracksSignature = nextSignature;
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
  loadMusicTrack(Math.floor(Math.random() * musicTracks.length), true);
  armMusicAutoplayFallback();
}

function armMusicAutoplayFallback() {
  if (musicAutoplayArmed) {
    return;
  }
  musicAutoplayArmed = true;

  const attemptPlayback = () => {
    if (!audio.paused) {
      removeListeners();
      return;
    }
    audio
      .play()
      .then(removeListeners)
      .catch(() => {});
  };
  const removeListeners = () => {
    document.removeEventListener("pointerdown", attemptPlayback);
    document.removeEventListener("keydown", attemptPlayback);
    document.removeEventListener("touchstart", attemptPlayback);
  };

  document.addEventListener("pointerdown", attemptPlayback, { passive: true });
  document.addEventListener("keydown", attemptPlayback);
  document.addEventListener("touchstart", attemptPlayback, { passive: true });
}

function loadMusicTrack(index, autoplay) {
  if (!musicTracks.length) {
    return;
  }

  currentMusicIndex = (index + musicTracks.length) % musicTracks.length;
  const track = musicTracks[currentMusicIndex];
  audio.src = absoluteAsset(track.path, "./assets/music.mp3");
  audio.autoplay = autoplay;
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

function startMusicVisualizer() {
  if (!musicBars) {
    return;
  }

  if (!audioContext) {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      audioContext = new AudioContextClass();
      analyser = audioContext.createAnalyser();
      analyser.fftSize = 64;
      analyser.smoothingTimeConstant = 0.82;
      analyserData = new Uint8Array(analyser.frequencyBinCount);
      visualizerSource = audioContext.createMediaElementSource(audio);
      visualizerSource.connect(analyser);
      analyser.connect(audioContext.destination);
    } catch {
      musicBars.classList.add("is-fallback");
    }
  }

  musicBars.classList.add("is-active");
  audioContext?.resume?.();
  if (!analyser || visualizerFrame) {
    return;
  }

  const draw = () => {
    if (audio.paused) {
      return;
    }
    analyser.getByteFrequencyData(analyserData);
    [...musicBars.children].forEach((bar, index) => {
      const value = analyserData[index * 2] || analyserData[index] || 0;
      bar.style.transform = `scaleY(${0.22 + (value / 255) * 1.55})`;
    });
    visualizerFrame = window.requestAnimationFrame(draw);
  };

  draw();
}

function stopMusicVisualizer() {
  if (visualizerFrame) {
    window.cancelAnimationFrame(visualizerFrame);
    visualizerFrame = null;
  }
  musicBars?.classList.remove("is-active");
  musicBars?.querySelectorAll("i").forEach((bar) => {
    bar.style.transform = "";
  });
}

audio.addEventListener("play", () => {
  musicPlaybackFailures = 0;
  musicDock.classList.add("is-playing");
  musicState.textContent = "随机播放";
  startMusicVisualizer();
});

audio.addEventListener("pause", () => {
  musicDock.classList.remove("is-playing");
  musicState.textContent = "已暂停";
  stopMusicVisualizer();
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
      document.documentElement.style.setProperty(
        "--ambient-shift",
        `${Math.min(scrollY * 0.035, 30)}px`,
      );
      document.documentElement.style.setProperty(
        "--page-progress",
        `${progress * 360}deg`,
      );

      if (heroVisual && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        heroVisual.style.transform = `translate3d(0, ${Math.min(
          scrollY * 0.045,
          52,
        )}px, 0)`;
      }
      revealVisibleText();
      updateScrollTextHighlight();
      updateKineticHeadings();
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
  revealVisibleText();
}, 1800);
