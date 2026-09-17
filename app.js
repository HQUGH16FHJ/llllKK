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
  photos: [
    { path: "./assets/photo-01.jpg", caption: "清晨之后" },
    { path: "./assets/photo-02.jpg", caption: "路上遇见的海" },
    { path: "./assets/photo-03.jpg", caption: "窗边的下午" },
    { path: "./assets/photo-04.jpg", caption: "风经过的街道" },
    { path: "./assets/photo-05.jpg", caption: "一起看过日落" },
    { path: "./assets/photo-06.jpg", caption: "春天没有失约" },
  ],
  works: [
    {
      name: "未命名作品",
      description:
        "一组围绕日常观察展开的视觉记录，关注光线、秩序和细微变化。",
    },
    {
      name: "城市手记",
      description:
        "以文字和照片记录城市生活的片段，保留那些容易被快速略过的瞬间。",
    },
    {
      name: "一次长期合作",
      description:
        "从提出想法到最终落地，完整参与内容策划、视觉整理与最终呈现。",
    },
  ],
  timeline: [
    {
      title: "新的阶段",
      description: "开始持续整理个人项目，并尝试用更完整的表达连接人与生活。",
    },
    {
      title: "一段重要经历",
      description: "在这段时间里建立了自己的节奏，也认识了许多影响至今的人。",
    },
    {
      title: "故事的起点",
      description: "第一次认真记录，第一次完成作品，以及第一次决定继续做下去。",
    },
  ],
  articles: [
    {
      date: "09.18",
      title: "重新整理房间的一天",
      excerpt: "把旧东西重新分类之后，才发现很多记忆并没有消失。",
      body: [
        "最近花了一个下午整理房间。旧书、票据、没有寄出的明信片，还有几件早就不穿却一直舍不得丢掉的衣服，被重新放回不同的盒子里。",
        "整理并不是告别。很多时候，它只是给过去一个更清晰的位置，也给现在腾出一点可以自由呼吸的空间。",
        "等所有东西都归位，窗外的光已经变了。我坐在新空出来的地方，第一次觉得，简单也可以是一种很具体的生活。",
      ],
    },
    {
      date: "08.26",
      title: "最近拍下的光",
      excerpt: "傍晚的颜色很短暂，所以更值得耐心等一会儿。",
      body: [
        "我最近开始习惯在傍晚出门走一会儿。太阳落下去以前，很多东西会短暂地变得不一样，墙面、树叶和路人的侧脸都像被轻轻擦亮。",
        "这样的光只停留十几分钟。有时候还没走到想拍照的位置，它就已经消失了。但等待本身，也慢慢变成一天里很安静的一段时间。",
        "照片留下的未必是最漂亮的一刻，更像是提醒我，生活里仍然有很多不需要追赶的时刻。",
      ],
    },
    {
      date: "07.03",
      title: "关于长期主义",
      excerpt: "真正能留下来的变化，通常都发生得很慢。",
      body: [
        "很多事情在刚开始时都看不出变化。读一本书、练习一种表达、认真完成一个小项目，它们不会立刻带来答案。",
        "可一段时间以后回头看，真正改变我的往往不是某一次突然的顿悟，而是那些看起来普通、却重复做了很久的选择。",
        "我现在更愿意把注意力放在今天能做好的那一点点上。慢并不等于停下来，只是让方向比速度更重要。",
      ],
    },
  ],
};

let siteConfig = window.SITE_CONTENT || defaultSiteConfig;

const welcome = document.querySelector("#welcome");
const identity = document.querySelector("#identity");
const site = document.querySelector("#site");
const enterSiteButton = document.querySelector("#enter-site");
const identityForm = document.querySelector("#identity-form");
const visitorNameInput = document.querySelector("#visitor-name");
const visitorGreeting = document.querySelector("#visitor-greeting");
const menuToggle = document.querySelector("#menu-toggle");
const primaryNav = document.querySelector("#primary-nav");
const topbar = document.querySelector(".topbar");
const video = document.querySelector("#intro-video");
const videoShell = document.querySelector("[data-video-shell]");
const videoPlaceholder = document.querySelector("#video-placeholder");
const copyEmailButton = document.querySelector("#copy-email");
const copyEmailStatus = document.querySelector(".copy-email__status");
const backgroundImage = document.querySelector(".site-background__image");
const musicDock = document.querySelector("#music-dock");
const musicToggle = document.querySelector("#music-toggle");
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
const photoGrid = document.querySelector("#photo-grid");
const journalGrid = document.querySelector("#journal-grid");

const currentYear = new Date().getFullYear();
document.querySelector("#welcome-year").textContent = currentYear;
document.querySelector("#footer-year").textContent = currentYear;

function setText(selector, value) {
  document.querySelectorAll(selector).forEach((node) => {
    node.textContent = value;
  });
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

  document.querySelectorAll("[data-site-mail]").forEach((link) => {
    link.href = `mailto:${siteConfig.email}`;
  });

  siteConfig.works.forEach((work, index) => {
    setText(`[data-work="${index}.name"]`, work.name);
    setText(`[data-work="${index}.description"]`, work.description);
  });

  siteConfig.timeline.forEach((item, index) => {
    setText(`[data-timeline="${index}.title"]`, item.title);
    setText(`[data-timeline="${index}.description"]`, item.description);
  });

  setText('[data-music="title"]', siteConfig.music.title);
  setText('[data-music="artist"]', siteConfig.music.artist);

  document.title = `${siteConfig.name}的个人主页`;
  renderArticles();
  renderPhotos();
}

function renderArticles() {
  journalGrid.replaceChildren();

  siteConfig.articles.forEach((article, index) => {
    const button = document.createElement("button");
    const date = document.createElement("time");
    const copy = document.createElement("div");
    const title = document.createElement("h3");
    const excerpt = document.createElement("p");
    const action = document.createElement("span");

    button.className = "journal-entry reveal";
    button.type = "button";
    button.setAttribute("aria-label", `阅读文章：${article.title}`);
    date.textContent = article.date;
    title.textContent = article.title;
    excerpt.textContent = article.excerpt;
    action.textContent = "阅读全文";
    copy.append(title, excerpt);
    button.append(date, copy, action);
    button.addEventListener("click", () => openArticle(index));
    journalGrid.append(button);
  });
}

function renderPhotos() {
  photoGrid.replaceChildren();

  siteConfig.photos.forEach((photo, index) => {
    const figure = document.createElement("figure");
    const frame = document.createElement("div");
    const image = document.createElement("img");
    const empty = document.createElement("span");
    const caption = document.createElement("figcaption");
    const date = document.createElement("span");
    const label = document.createElement("p");
    const layout = ["wide", "standard", "tall"].includes(photo.layout)
      ? photo.layout
      : "standard";

    figure.className = `photo photo--${layout} reveal`;
    frame.className = "photo__frame";
    image.alt = photo.alt || photo.caption || `照片 ${index + 1}`;
    image.loading = "lazy";
    image.dataset.photo = String(index);
    empty.className = "photo__empty";
    empty.setAttribute("aria-hidden", "true");
    empty.textContent = `PHOTO / ${String(index + 1).padStart(2, "0")}`;
    date.textContent = photo.date || "";
    label.textContent = photo.caption || "";
    caption.append(date, label);
    frame.append(image, empty);
    figure.append(frame, caption);
    photoGrid.append(figure);
  });
}

function loadMediaAssets() {
  backgroundImage.style.backgroundImage = `url("${siteConfig.assets.background}")`;

  document.querySelectorAll("[data-avatar]").forEach((image) => {
    image.src = siteConfig.assets.avatar;
    image.addEventListener("load", () => {
      image.closest(".avatar, .portrait-card__image")?.classList.add("has-image");
    });
    image.addEventListener("error", () => {
      image.closest(".avatar, .portrait-card__image")?.classList.remove("has-image");
    });
  });

  document.querySelectorAll("[data-photo]").forEach((image) => {
    const photo = siteConfig.photos[Number(image.dataset.photo)];

    if (!photo) {
      return;
    }

    const fallbackPath = photo.path.replace("/photos/", "/");
    image.onload = () => {
      image.closest(".photo")?.classList.add("has-image");
    };
    image.onerror = () => {
      if (fallbackPath !== photo.path && image.dataset.fallbackUsed !== "true") {
        image.dataset.fallbackUsed = "true";
        image.src = fallbackPath;
        return;
      }
      image.closest(".photo")?.classList.remove("has-image");
    };
    image.src = photo.path;
  });

  video.poster = siteConfig.assets.poster;
  const source = video.querySelector("source");
  source.src = siteConfig.assets.video;
  video.load();

  video.addEventListener("loadedmetadata", () => {
    video.classList.add("has-video");
    videoShell.classList.add("has-video");
  });
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
  photos: [
    { path: "./assets/photo-01.jpg", caption: "清晨之后" },
    { path: "./assets/photo-02.jpg", caption: "路上遇见的海" },
    { path: "./assets/photo-03.jpg", caption: "窗边的下午" },
    { path: "./assets/photo-04.jpg", caption: "风经过的街道" },
    { path: "./assets/photo-05.jpg", caption: "一起看过日落" },
    { path: "./assets/photo-06.jpg", caption: "春天没有失约" },
  ],
  works: [
    {
      name: "未命名作品",
      description:
        "一组围绕日常观察展开的视觉记录，关注光线、秩序和细微变化。",
    },
    {
      name: "城市手记",
      description:
        "以文字和照片记录城市生活的片段，保留那些容易被快速略过的瞬间。",
    },
    {
      name: "一次长期合作",
      description:
        "从提出想法到最终落地，完整参与内容策划、视觉整理与最终呈现。",
    },
  ],
  timeline: [
    {
      title: "新的阶段",
      description: "开始持续整理个人项目，并尝试用更完整的表达连接人与生活。",
    },
    {
      title: "一段重要经历",
      description: "在这段时间里建立了自己的节奏，也认识了许多影响至今的人。",
    },
    {
      title: "故事的起点",
      description: "第一次认真记录，第一次完成作品，以及第一次决定继续做下去。",
    },
  ],
  articles: [
    {
      date: "09.18",
      title: "重新整理房间的一天",
      excerpt: "把旧东西重新分类之后，才发现很多记忆并没有消失。",
      body: [
        "最近花了一个下午整理房间。旧书、票据、没有寄出的明信片，还有几件早就不穿却一直舍不得丢掉的衣服，被重新放回不同的盒子里。",
        "整理并不是告别。很多时候，它只是给过去一个更清晰的位置，也给现在腾出一点可以自由呼吸的空间。",
        "等所有东西都归位，窗外的光已经变了。我坐在新空出来的地方，第一次觉得，简单也可以是一种很具体的生活。",
      ],
    },
    {
      date: "08.26",
      title: "最近拍下的光",
      excerpt: "傍晚的颜色很短暂，所以更值得耐心等一会儿。",
      body: [
        "我最近开始习惯在傍晚出门走一会儿。太阳落下去以前，很多东西会短暂地变得不一样，墙面、树叶和路人的侧脸都像被轻轻擦亮。",
        "这样的光只停留十几分钟。有时候还没走到想拍照的位置，它就已经消失了。但等待本身，也慢慢变成一天里很安静的一段时间。",
        "照片留下的未必是最漂亮的一刻，更像是提醒我，生活里仍然有很多不需要追赶的时刻。",
      ],
    },
    {
      date: "07.03",
      title: "关于长期主义",
      excerpt: "真正能留下来的变化，通常都发生得很慢。",
      body: [
        "很多事情在刚开始时都看不出变化。读一本书、练习一种表达、认真完成一个小项目，它们不会立刻带来答案。",
        "可一段时间以后回头看，真正改变我的往往不是某一次突然的顿悟，而是那些看起来普通、却重复做了很久的选择。",
        "我现在更愿意把注意力放在今天能做好的那一点点上。慢并不等于停下来，只是让方向比速度更重要。",
      ],
    },
  ],
};

let siteConfig = window.SITE_CONTENT || defaultSiteConfig;

const welcome = document.querySelector("#welcome");
const identity = document.querySelector("#identity");
const site = document.querySelector("#site");
const enterSiteButton = document.querySelector("#enter-site");
const viewPhotosButton = document.querySelector("#view-photos");
const identityForm = document.querySelector("#identity-form");
const visitorNameInput = document.querySelector("#visitor-name");
const visitorGreeting = document.querySelector("#visitor-greeting");
const menuToggle = document.querySelector("#menu-toggle");
const primaryNav = document.querySelector("#primary-nav");
const topbar = document.querySelector(".topbar");
const video = document.querySelector("#intro-video");
const videoShell = document.querySelector("[data-video-shell]");
const videoPlaceholder = document.querySelector("#video-placeholder");
const copyEmailButton = document.querySelector("#copy-email");
const copyEmailStatus = document.querySelector(".copy-email__status");
const backgroundImage = document.querySelector(".site-background__image");
const musicDock = document.querySelector("#music-dock");
const musicToggle = document.querySelector("#music-toggle");
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
const photoGrid = document.querySelector("#photo-grid");
const journalGrid = document.querySelector("#journal-grid");

const currentYear = new Date().getFullYear();
document.querySelector("#welcome-year").textContent = currentYear;
document.querySelector("#footer-year").textContent = currentYear;

function setText(selector, value) {
  document.querySelectorAll(selector).forEach((node) => {
    node.textContent = value;
  });
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

  document.querySelectorAll("[data-site-mail]").forEach((link) => {
    link.href = `mailto:${siteConfig.email}`;
  });

  siteConfig.works.forEach((work, index) => {
    setText(`[data-work="${index}.name"]`, work.name);
    setText(`[data-work="${index}.description"]`, work.description);
  });

  siteConfig.timeline.forEach((item, index) => {
    setText(`[data-timeline="${index}.title"]`, item.title);
    setText(`[data-timeline="${index}.description"]`, item.description);
  });

  setText('[data-music="title"]', siteConfig.music.title);
  setText('[data-music="artist"]', siteConfig.music.artist);

  document.title = `${siteConfig.name}的个人主页`;
  renderArticles();
  renderPhotos();
}

function renderArticles() {
  journalGrid.replaceChildren();

  siteConfig.articles.forEach((article, index) => {
    const button = document.createElement("button");
    const date = document.createElement("time");
    const copy = document.createElement("div");
    const title = document.createElement("h3");
    const excerpt = document.createElement("p");
    const action = document.createElement("span");

    button.className = "journal-entry reveal";
    button.type = "button";
    button.setAttribute("aria-label", `阅读文章：${article.title}`);
    date.textContent = article.date;
    title.textContent = article.title;
    excerpt.textContent = article.excerpt;
    action.textContent = "阅读全文";
    copy.append(title, excerpt);
    button.append(date, copy, action);
    button.addEventListener("click", () => openArticle(index));
    journalGrid.append(button);
  });
}

function renderPhotos() {
  photoGrid.replaceChildren();

  siteConfig.photos.forEach((photo, index) => {
    const figure = document.createElement("figure");
    const frame = document.createElement("div");
    const image = document.createElement("img");
    const empty = document.createElement("span");
    const caption = document.createElement("figcaption");
    const date = document.createElement("span");
    const label = document.createElement("p");
    const layout = ["wide", "standard", "tall"].includes(photo.layout)
      ? photo.layout
      : "standard";

    figure.className = `photo photo--${layout} reveal`;
    frame.className = "photo__frame";
    image.alt = photo.alt || photo.caption || `照片 ${index + 1}`;
    image.loading = "lazy";
    image.dataset.photo = String(index);
    empty.className = "photo__empty";
    empty.setAttribute("aria-hidden", "true");
    empty.textContent = `PHOTO / ${String(index + 1).padStart(2, "0")}`;
    date.textContent = photo.date || "";
    label.textContent = photo.caption || "";
    caption.append(date, label);
    frame.append(image, empty);
    figure.append(frame, caption);
    photoGrid.append(figure);
  });
}

function loadMediaAssets() {
  backgroundImage.style.backgroundImage = `url("${siteConfig.assets.background}")`;

  document.querySelectorAll("[data-avatar]").forEach((image) => {
    image.src = siteConfig.assets.avatar;
    image.addEventListener("load", () => {
      image.closest(".avatar, .portrait-card__image")?.classList.add("has-image");
    });
    image.addEventListener("error", () => {
      image.closest(".avatar, .portrait-card__image")?.classList.remove("has-image");
    });
  });

  document.querySelectorAll("[data-photo]").forEach((image) => {
    const photo = siteConfig.photos[Number(image.dataset.photo)];

    if (!photo) {
      return;
    }

    const fallbackPath = photo.path.replace("/photos/", "/");
    image.onload = () => {
      image.closest(".photo")?.classList.add("has-image");
    };
    image.onerror = () => {
      if (fallbackPath !== photo.path && image.dataset.fallbackUsed !== "true") {
        image.dataset.fallbackUsed = "true";
        image.src = fallbackPath;
        return;
      }
      image.closest(".photo")?.classList.remove("has-image");
    };
    image.src = photo.path;
  });

  video.poster = siteConfig.assets.poster;
  const source = video.querySelector("source");
  source.src = siteConfig.assets.video;
  video.load();

  video.addEventListener("loadedmetadata", () => {
    video.classList.add("has-video");
    videoShell.classList.add("has-video");
  });

  video.addEventListener("error", () => {
    video.classList.remove("has-video");
    videoShell.classList.remove("has-video");const defaultSiteConfig = {
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
  photos: [
    { path: "./assets/photo-01.jpg", caption: "清晨之后" },
    { path: "./assets/photo-02.jpg", caption: "路上遇见的海" },
    { path: "./assets/photo-03.jpg", caption: "窗边的下午" },
    { path: "./assets/photo-04.jpg", caption: "风经过的街道" },
    { path: "./assets/photo-05.jpg", caption: "一起看过日落" },
    { path: "./assets/photo-06.jpg", caption: "春天没有失约" },
  ],
  works: [
    {
      name: "未命名作品",
      description:
        "一组围绕日常观察展开的视觉记录，关注光线、秩序和细微变化。",
    },
    {
      name: "城市手记",
      description:
        "以文字和照片记录城市生活的片段，保留那些容易被快速略过的瞬间。",
    },
    {
      name: "一次长期合作",
      description:
        "从提出想法到最终落地，完整参与内容策划、视觉整理与最终呈现。",
    },
  ],
  timeline: [
    {
      title: "新的阶段",
      description: "开始持续整理个人项目，并尝试用更完整的表达连接人与生活。",
    },
    {
      title: "一段重要经历",
      description: "在这段时间里建立了自己的节奏，也认识了许多影响至今的人。",
    },
    {
      title: "故事的起点",
      description: "第一次认真记录，第一次完成作品，以及第一次决定继续做下去。",
    },
  ],
  articles: [
    {
      date: "09.18",
      title: "重新整理房间的一天",
      excerpt: "把旧东西重新分类之后，才发现很多记忆并没有消失。",
      body: [
        "最近花了一个下午整理房间。旧书、票据、没有寄出的明信片，还有几件早就不穿却一直舍不得丢掉的衣服，被重新放回不同的盒子里。",
        "整理并不是告别。很多时候，它只是给过去一个更清晰的位置，也给现在腾出一点可以自由呼吸的空间。",
        "等所有东西都归位，窗外的光已经变了。我坐在新空出来的地方，第一次觉得，简单也可以是一种很具体的生活。",
      ],
    },
    {
      date: "08.26",
      title: "最近拍下的光",
      excerpt: "傍晚的颜色很短暂，所以更值得耐心等一会儿。",
      body: [
        "我最近开始习惯在傍晚出门走一会儿。太阳落下去以前，很多东西会短暂地变得不一样，墙面、树叶和路人的侧脸都像被轻轻擦亮。",
        "这样的光只停留十几分钟。有时候还没走到想拍照的位置，它就已经消失了。但等待本身，也慢慢变成一天里很安静的一段时间。",
        "照片留下的未必是最漂亮的一刻，更像是提醒我，生活里仍然有很多不需要追赶的时刻。",
      ],
    },
    {
      date: "07.03",
      title: "关于长期主义",
      excerpt: "真正能留下来的变化，通常都发生得很慢。",
      body: [
        "很多事情在刚开始时都看不出变化。读一本书、练习一种表达、认真完成一个小项目，它们不会立刻带来答案。",
        "可一段时间以后回头看，真正改变我的往往不是某一次突然的顿悟，而是那些看起来普通、却重复做了很久的选择。",
        "我现在更愿意把注意力放在今天能做好的那一点点上。慢并不等于停下来，只是让方向比速度更重要。",
      ],
    },
  ],
};

let siteConfig = window.SITE_CONTENT || defaultSiteConfig;

const welcome = document.querySelector("#welcome");
const identity = document.querySelector("#identity");
const site = document.querySelector("#site");
const enterSiteButton = document.querySelector("#enter-site");
const viewPhotosButton = document.querySelector("#view-photos");
const identityForm = document.querySelector("#identity-form");
const visitorNameInput = document.querySelector("#visitor-name");
const visitorGreeting = document.querySelector("#visitor-greeting");
const menuToggle = document.querySelector("#menu-toggle");
const primaryNav = document.querySelector("#primary-nav");
const topbar = document.querySelector(".topbar");
const video = document.querySelector("#intro-video");
const videoShell = document.querySelector("[data-video-shell]");
const videoPlaceholder = document.querySelector("#video-placeholder");
const copyEmailButton = document.querySelector("#copy-email");
const copyEmailStatus = document.querySelector(".copy-email__status");
const backgroundImage = document.querySelector(".site-background__image");
const musicDock = document.querySelector("#music-dock");
const musicToggle = document.querySelector("#music-toggle");
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
const photoGrid = document.querySelector("#photo-grid");
const journalGrid = document.querySelector("#journal-grid");

const currentYear = new Date().getFullYear();
document.querySelector("#welcome-year").textContent = currentYear;
document.querySelector("#footer-year").textContent = currentYear;

function setText(selector, value) {
  document.querySelectorAll(selector).forEach((node) => {
    node.textContent = value;
  });
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

  document.querySelectorAll("[data-site-mail]").forEach((link) => {
    link.href = `mailto:${siteConfig.email}`;
  });

  siteConfig.works.forEach((work, index) => {
    setText(`[data-work="${index}.name"]`, work.name);
    setText(`[data-work="${index}.description"]`, work.description);
  });

  siteConfig.timeline.forEach((item, index) => {
    setText(`[data-timeline="${index}.title"]`, item.title);
    setText(`[data-timeline="${index}.description"]`, item.description);
  });

  setText('[data-music="title"]', siteConfig.music.title);
  setText('[data-music="artist"]', siteConfig.music.artist);

  document.title = `${siteConfig.name}的个人主页`;
  renderArticles();
  renderPhotos();
}

function renderArticles() {
  journalGrid.replaceChildren();

  siteConfig.articles.forEach((article, index) => {
    const button = document.createElement("button");
    const date = document.createElement("time");
    const copy = document.createElement("div");
    const title = document.createElement("h3");
    const excerpt = document.createElement("p");
    const action = document.createElement("span");

    button.className = "journal-entry reveal";
    button.type = "button";
    button.setAttribute("aria-label", `阅读文章：${article.title}`);
    date.textContent = article.date;
    title.textContent = article.title;
    excerpt.textContent = article.excerpt;
    action.textContent = "阅读全文";
    copy.append(title, excerpt);
    button.append(date, copy, action);
    button.addEventListener("click", () => openArticle(index));
    journalGrid.append(button);
  });
}

function renderPhotos() {
  photoGrid.replaceChildren();

  siteConfig.photos.forEach((photo, index) => {
    const figure = document.createElement("figure");
    const frame = document.createElement("div");
    const image = document.createElement("img");
    const empty = document.createElement("span");
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
    image.dataset.photo = String(index);
    empty.className = "photo__empty";
    empty.setAttribute("aria-hidden", "true");
    empty.textContent = `PHOTO / ${String(index + 1).padStart(2, "0")}`;
    date.textContent = photo.date || "";
    label.textContent = photo.caption || "";
    caption.append(date, label);
    frame.append(image, empty);
    figure.append(frame, caption);
    photoGrid.append(figure);
  });
}

function loadMediaAssets() {
  backgroundImage.style.backgroundImage = `url("${siteConfig.assets.background}")`;

  document.querySelectorAll("[data-avatar]").forEach((image) => {
    image.src = siteConfig.assets.avatar;
    image.addEventListener("load", () => {
      image.closest(".avatar, .portrait-card__image")?.classList.add("has-image");
    });
    image.addEventListener("error", () => {
      image.closest(".avatar, .portrait-card__image")?.classList.remove("has-image");
    });
  });

  document.querySelectorAll("[data-photo]").forEach((image) => {
    const photo = siteConfig.photos[Number(image.dataset.photo)];

    if (!photo) {
      return;
    }

    const fallbackPath = photo.path.replace("/photos/", "/");
    image.onload = () => {
      image.closest(".photo")?.classList.add("has-image");
    };
    image.onerror = () => {
      if (fallbackPath !== photo.path && image.dataset.fallbackUsed !== "true") {
        image.dataset.fallbackUsed = "true";
        image.src = fallbackPath;
        return;
      }
      image.closest(".photo")?.classList.remove("has-image");
    };
    image.src = photo.path;
  });

  video.poster = siteConfig.assets.poster;
  const source = video.querySelector("source");
  source.src = siteConfig.assets.video;
  video.load();

  video.addEventListener("loadedmetadata", () => {
    video.classList.add("has-video");
    videoShell.classList.add("has-video");
  });

  video.addEventListener("error", () => {
    video.classList.remove("has-video");
    videoShell.classList.remove("has-video");
  });

  audio.src = siteConfig.assets.music;
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
    fillSiteContent();
    loadMediaAssets();
  } catch {
    // Static content remains available when the management API is not deployed.
  }
}

function openIdentity() {
  document.body.classList.add("is-entering");
  window.setTimeout(() => {
    welcome.setAttribute("aria-hidden", "true");
    identity.classList.add("is-open");
    identity.setAttribute("aria-hidden", "false");
    visitorNameInput.focus();
  }, 680);
}

function openSite(name) {
  visitorGreeting.textContent = name;
  welcome.classList.add("is-dismissed");
  identity.classList.remove("is-open");
  identity.setAttribute("aria-hidden", "true");
  site.classList.add("is-ready");
  site.setAttribute("aria-hidden", "false");
  document.body.classList.remove("is-entering");
  document.body.classList.remove("is-locked");
  window.requestAnimationFrame(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  });
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) {
    return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
}

function openArticle(index) {
  const article = siteConfig.articles[index];

  if (!article) {
    return;
  }

  articleReaderDate.textContent = article.date;
  articleReaderTitle.textContent = article.title;
  articleReaderLead.textContent = article.excerpt;
  articleReaderBody.replaceChildren(
    ...article.body.map((paragraph) => {
      const element = document.createElement("p");
      element.textContent = paragraph;
      return element;
    }),
  );

  articleReader.classList.add("is-open");
  articleReader.setAttribute("aria-hidden", "false");
  document.body.classList.add("is-locked");
  closeArticleButton.focus();
}

function closeArticle() {
  articleReader.classList.remove("is-open");
  articleReader.setAttribute("aria-hidden", "true");
  document.body.classList.remove("is-locked");
}

enterSiteButton.addEventListener("click", openIdentity);

viewPhotosButton.addEventListener("click", () => {
  openSite("访客");
  window.setTimeout(() => {
    document.querySelector("#stills")?.scrollIntoView({ behavior: "smooth" });
  }, 850);
});

identityForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = visitorNameInput.value.trim();

  if (!name) {
    visitorNameInput.focus();
    visitorNameInput.setAttribute("aria-invalid", "true");
    return;
  }

  visitorNameInput.removeAttribute("aria-invalid");
  localStorage.setItem("personalSiteVisitor", name);
  openSite(name);
});

visitorNameInput.addEventListener("input", () => {
  visitorNameInput.removeAttribute("aria-invalid");
});

menuToggle.addEventListener("click", () => {
  const isOpen = primaryNav.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

primaryNav.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    primaryNav.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
  }
});

copyEmailButton.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(siteConfig.email);
    copyEmailStatus.textContent = "已复制";
  } catch {
    copyEmailStatus.textContent = siteConfig.email;
  }

  window.setTimeout(() => {
    copyEmailStatus.textContent = "";
  }, 1600);
});

videoPlaceholder.addEventListener("click", () => {
  video.classList.add("has-video");
  videoShell.classList.add("has-video");
  video.play().catch(() => {
    video.classList.remove("has-video");
    videoShell.classList.remove("has-video");
  });
});

closeArticleButton.addEventListener("click", closeArticle);

articleReader.addEventListener("click", (event) => {
  if (event.target === articleReader) {
    closeArticle();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && articleReader.classList.contains("is-open")) {
    closeArticle();
  }
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
  musicToggle.setAttribute("aria-label", "暂停音乐");
});

audio.addEventListener("pause", () => {
  musicDock.classList.remove("is-playing");
  musicState.textContent = "已暂停";
  musicToggle.setAttribute("aria-label", "播放音乐");
});

audio.addEventListener("loadedmetadata", () => {
  musicProgress.max = String(audio.duration || 0);
  musicDuration.textContent = formatTime(audio.duration);
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

const sections = [...document.querySelectorAll("main section[id]")];
const navigationLinks = [...document.querySelectorAll(".primary-nav a")];

const sectionObserver = new IntersectionObserver(
  (entries) => {
    const visibleEntry = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visibleEntry) {
      return;
    }

    navigationLinks.forEach((link) => {
      link.classList.toggle(
        "is-active",
        link.getAttribute("href") === `#${visibleEntry.target.id}`,
      );
    });
  },
  { rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.2, 0.5] },
);

sections.forEach((section) => sectionObserver.observe(section));

window.addEventListener(
  "scroll",
  () => {
    topbar.classList.toggle("is-scrolled", window.scrollY > 32);
  },
  { passive: true },
);

const storedVisitor = localStorage.getItem("personalSiteVisitor");
if (storedVisitor) {
  visitorNameInput.value = storedVisitor;
}

fillSiteContent();
loadMediaAssets();

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.14 },
);

document.querySelectorAll(".reveal").forEach((element) => {
  revealObserver.observe(element);
});

syncCloudContent();
document.body.classList.add("is-locked");

  });

  audio.src = siteConfig.assets.music;
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
    fillSiteContent();
    loadMediaAssets();
  } catch {
    // Static content remains available when the management API is not deployed.
  }
}

function openIdentity() {
  document.body.classList.add("is-entering");
  window.setTimeout(() => {
    welcome.setAttribute("aria-hidden", "true");
    identity.classList.add("is-open");
    identity.setAttribute("aria-hidden", "false");
    visitorNameInput.focus();
  }, 680);
}

function openSite(name) {
  visitorGreeting.textContent = name;
  welcome.classList.add("is-dismissed");
  identity.classList.remove("is-open");
  identity.setAttribute("aria-hidden", "true");
  site.classList.add("is-ready");
  site.setAttribute("aria-hidden", "false");
  document.body.classList.remove("is-entering");
  document.body.classList.remove("is-locked");
  window.requestAnimationFrame(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  });
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) {
    return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
}

function openArticle(index) {
  const article = siteConfig.articles[index];

  if (!article) {
    return;
  }

  articleReaderDate.textContent = article.date;
  articleReaderTitle.textContent = article.title;
  articleReaderLead.textContent = article.excerpt;
  articleReaderBody.replaceChildren(
    ...article.body.map((paragraph) => {
      const element = document.createElement("p");
      element.textContent = paragraph;
      return element;
    }),
  );

  articleReader.classList.add("is-open");
  articleReader.setAttribute("aria-hidden", "false");
  document.body.classList.add("is-locked");
  closeArticleButton.focus();
}

function closeArticle() {
  articleReader.classList.remove("is-open");
  articleReader.setAttribute("aria-hidden", "true");
  document.body.classList.remove("is-locked");
}

enterSiteButton.addEventListener("click", openIdentity);

viewPhotosButton.addEventListener("click", () => {
  openSite("访客");
  window.setTimeout(() => {
    document.querySelector("#stills")?.scrollIntoView({ behavior: "smooth" });
  }, 850);
});

identityForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = visitorNameInput.value.trim();

  if (!name) {
    visitorNameInput.focus();
    visitorNameInput.setAttribute("aria-invalid", "true");
    return;
  }

  visitorNameInput.removeAttribute("aria-invalid");
  localStorage.setItem("personalSiteVisitor", name);
  openSite(name);
});

visitorNameInput.addEventListener("input", () => {
  visitorNameInput.removeAttribute("aria-invalid");
});

menuToggle.addEventListener("click", () => {
  const isOpen = primaryNav.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

primaryNav.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    primaryNav.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
  }
});

copyEmailButton.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(siteConfig.email);
    copyEmailStatus.textContent = "已复制";
  } catch {
    copyEmailStatus.textContent = siteConfig.email;
  }

  window.setTimeout(() => {
    copyEmailStatus.textContent = "";
  }, 1600);
});

videoPlaceholder.addEventListener("click", () => {
  video.classList.add("has-video");
  videoShell.classList.add("has-video");
  video.play().catch(() => {
    video.classList.remove("has-video");
    videoShell.classList.remove("has-video");
  });
});

closeArticleButton.addEventListener("click", closeArticle);

articleReader.addEventListener("click", (event) => {
  if (event.target === articleReader) {
    closeArticle();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && articleReader.classList.contains("is-open")) {
    closeArticle();
  }
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
  musicToggle.setAttribute("aria-label", "暂停音乐");
});

audio.addEventListener("pause", () => {
  musicDock.classList.remove("is-playing");
  musicState.textContent = "已暂停";
  musicToggle.setAttribute("aria-label", "播放音乐");
});

audio.addEventListener("loadedmetadata", () => {
  musicProgress.max = String(audio.duration || 0);
  musicDuration.textContent = formatTime(audio.duration);
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

const sections = [...document.querySelectorAll("main section[id]")];
const navigationLinks = [...document.querySelectorAll(".primary-nav a")];

const sectionObserver = new IntersectionObserver(
  (entries) => {
    const visibleEntry = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visibleEntry) {
      return;
    }

    navigationLinks.forEach((link) => {
      link.classList.toggle(
        "is-active",
        link.getAttribute("href") === `#${visibleEntry.target.id}`,
      );
    });
  },
  { rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.2, 0.5] },
);

sections.forEach((section) => sectionObserver.observe(section));

window.addEventListener(
  "scroll",
  () => {
    topbar.classList.toggle("is-scrolled", window.scrollY > 32);
  },
  { passive: true },
);

const storedVisitor = localStorage.getItem("personalSiteVisitor");
if (storedVisitor) {
  visitorNameInput.value = storedVisitor;
}

fillSiteContent();
loadMediaAssets();

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.14 },
);

document.querySelectorAll(".reveal").forEach((element) => {
  revealObserver.observe(element);
});

syncCloudContent();
document.body.classList.add("is-locked");

  video.addEventListener("error", () => {
    video.classList.remove("has-video");
    videoShell.classList.remove("has-video");
  });

  audio.src = siteConfig.assets.music;
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
    fillSiteContent();
    loadMediaAssets();
  } catch {
    // Static content remains available when the management API is not deployed.
  }
}

function openIdentity() {
  document.body.classList.add("is-entering");
  window.setTimeout(() => {
    welcome.setAttribute("aria-hidden", "true");
    identity.classList.add("is-open");
    identity.setAttribute("aria-hidden", "false");
    visitorNameInput.focus();
  }, 680);
}

function openSite(name) {
  visitorGreeting.textContent = name;
  welcome.classList.add("is-dismissed");
  identity.classList.remove("is-open");
  identity.setAttribute("aria-hidden", "true");
  site.classList.add("is-ready");
  site.setAttribute("aria-hidden", "false");
  document.body.classList.remove("is-entering");
  document.body.classList.remove("is-locked");
  window.requestAnimationFrame(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  });
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) {
    return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
}

function openArticle(index) {
  const article = siteConfig.articles[index];

  if (!article) {
    return;
  }

  articleReaderDate.textContent = article.date;
  articleReaderTitle.textContent = article.title;
  articleReaderLead.textContent = article.excerpt;
  articleReaderBody.replaceChildren(
    ...article.body.map((paragraph) => {
      const element = document.createElement("p");
      element.textContent = paragraph;
      return element;
    }),
  );

  articleReader.classList.add("is-open");
  articleReader.setAttribute("aria-hidden", "false");
  document.body.classList.add("is-locked");
  closeArticleButton.focus();
}

function closeArticle() {
  articleReader.classList.remove("is-open");
  articleReader.setAttribute("aria-hidden", "true");
  document.body.classList.remove("is-locked");
}

enterSiteButton.addEventListener("click", openIdentity);

identityForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = visitorNameInput.value.trim();

  if (!name) {
    visitorNameInput.focus();
    visitorNameInput.setAttribute("aria-invalid", "true");
    return;
  }

  visitorNameInput.removeAttribute("aria-invalid");
  localStorage.setItem("personalSiteVisitor", name);
  openSite(name);
});

visitorNameInput.addEventListener("input", () => {
  visitorNameInput.removeAttribute("aria-invalid");
});

menuToggle.addEventListener("click", () => {
  const isOpen = primaryNav.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

primaryNav.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    primaryNav.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
  }
});

copyEmailButton.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(siteConfig.email);
    copyEmailStatus.textContent = "已复制";
  } catch {
    copyEmailStatus.textContent = siteConfig.email;
  }

  window.setTimeout(() => {
    copyEmailStatus.textContent = "";
  }, 1600);
});

videoPlaceholder.addEventListener("click", () => {
  video.classList.add("has-video");
  videoShell.classList.add("has-video");
  video.play().catch(() => {
    video.classList.remove("has-video");
    videoShell.classList.remove("has-video");
  });
});

closeArticleButton.addEventListener("click", closeArticle);

articleReader.addEventListener("click", (event) => {
  if (event.target === articleReader) {
    closeArticle();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && articleReader.classList.contains("is-open")) {
    closeArticle();
  }
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
  musicToggle.setAttribute("aria-label", "暂停音乐");
});

audio.addEventListener("pause", () => {
  musicDock.classList.remove("is-playing");
  musicState.textContent = "已暂停";
  musicToggle.setAttribute("aria-label", "播放音乐");
});

audio.addEventListener("loadedmetadata", () => {
  musicProgress.max = String(audio.duration || 0);
  musicDuration.textContent = formatTime(audio.duration);
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

const sections = [...document.querySelectorAll("main section[id]")];
const navigationLinks = [...document.querySelectorAll(".primary-nav a")];

const sectionObserver = new IntersectionObserver(
  (entries) => {
    const visibleEntry = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visibleEntry) {
      return;
    }

    navigationLinks.forEach((link) => {
      link.classList.toggle(
        "is-active",
        link.getAttribute("href") === `#${visibleEntry.target.id}`,
      );
    });
  },
  { rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.2, 0.5] },
);

sections.forEach((section) => sectionObserver.observe(section));

window.addEventListener(
  "scroll",
  () => {
    topbar.classList.toggle("is-scrolled", window.scrollY > 32);
  },
  { passive: true },
);

const storedVisitor = localStorage.getItem("personalSiteVisitor");
if (storedVisitor) {
  visitorNameInput.value = storedVisitor;
}

fillSiteContent();
loadMediaAssets();

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.14 },
);

document.querySelectorAll(".reveal").forEach((element) => {
  revealObserver.observe(element);
});

syncCloudContent();
document.body.classList.add("is-locked");
