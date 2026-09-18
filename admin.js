const articleList = document.querySelector("#article-list");
const timelineList = document.querySelector("#timeline-list");
const photoList = document.querySelector("#photo-list");
const trackList = document.querySelector("#track-list");
const saveButton = document.querySelector("#save-content");
const downloadButton = document.querySelector("#download-content");
const addArticleButton = document.querySelector("#add-article");
const addTimelineButton = document.querySelector("#add-timeline");
const addPhotoButton = document.querySelector("#add-photo");
const newPhotoUploadInput = document.querySelector("#new-photo-upload");
const addTrackButton = document.querySelector("#add-track");
const musicUploadInput = document.querySelector("#music-upload-input");
const heroPhotoSelect = document.querySelector("#hero-photo-select");
const featuredArticleSelect = document.querySelector("#featured-article-select");
const backgroundModeSelect = document.querySelector("#background-mode-select");
const statusDot = document.querySelector("#status-dot");
const statusText = document.querySelector("#status-text");
const toast = document.querySelector("#admin-toast");
const tokenInput = document.querySelector("#admin-token");
const verifyTokenButton = document.querySelector("#verify-token");
const cleanupMediaButton = document.querySelector("#cleanup-media");
const storageCleanupStatus = document.querySelector("#storage-cleanup-status");

let content = null;
let serverMode = "unknown";
let dirty = false;
let toastTimer = null;

const defaultBackgroundVideo =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260723_145606_ab143199-b593-4941-bb1b-9afca215416b.mp4";

const assetTargets = {
  background: "./assets/background.jpg",
  backgroundVideo: "./assets/background-video.mp4",
  avatar: "./assets/avatar.jpg",
  poster: "./assets/video-poster.jpg",
  video: "./assets/intro.mp4",
  music: "./assets/music.mp3",
};

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function normalizeMediaPath(value) {
  if (typeof value !== "string" || !value.includes("/media/")) {
    return null;
  }

  try {
    const url = new URL(value, location.origin);
    return /^\/media\/.+/.test(url.pathname) ? url.pathname : null;
  } catch {
    return null;
  }
}

function collectMediaPaths(value, result = new Set()) {
  if (typeof value === "string") {
    const mediaPath = normalizeMediaPath(value);
    if (mediaPath) {
      result.add(mediaPath);
    }
    return result;
  }

  if (Array.isArray(value)) {
    value.forEach((item) => collectMediaPaths(item, result));
    return result;
  }

  if (value && typeof value === "object") {
    Object.values(value).forEach((item) => collectMediaPaths(item, result));
  }

  return result;
}

async function deleteUnusedMediaPaths(paths) {
  const referenced = collectMediaPaths(content);
  const mediaPaths = [
    ...new Set(paths.map(normalizeMediaPath).filter(Boolean)),
  ].filter((path) => !referenced.has(path));

  if (!mediaPaths.length) {
    return 0;
  }

  const result = await requestJson("/api/delete-media", {
    method: "POST",
    body: JSON.stringify({ paths: mediaPaths }),
  });
  return result.deleted || 0;
}

async function deleteUnusedMediaAfterSave(paths) {
  try {
    const deleted = await deleteUnusedMediaPaths(paths);
    if (deleted) {
      showToast(`已释放 ${deleted} 个云端文件`, "success");
    }
    return deleted;
  } catch (error) {
    showToast(`记录已删除，但文件清理失败：${error.message}`, "error");
    return 0;
  }
}

function resolveArticleImage(article) {
  if (!article || article.coverPhotoId === "none") {
    return null;
  }

  const photos = Array.isArray(content?.photos) ? content.photos : [];
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

function articleCoverOptions(article) {
  const options = [
    `<option value="__auto__" ${!article.coverPhotoId && !article.coverImage ? "selected" : ""}>自动关联照片记录</option>`,
    article.coverImage && !article.coverPhotoId
      ? '<option value="__uploaded__" selected>当前上传的文章照片</option>'
      : "",
    `<option value="none" ${article.coverPhotoId === "none" ? "selected" : ""}>不显示文章照片</option>`,
  ];

  content.photos.forEach((photo, index) => {
    options.push(
      `<option value="${escapeHtml(photo.id)}" ${
        article.coverPhotoId === photo.id ? "selected" : ""
      }>${escapeHtml(photo.caption || `照片 ${index + 1}`)}</option>`,
    );
  });

  return options.join("");
}

function showToast(message, type = "") {
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.className = `admin-toast is-visible${type ? ` is-${type}` : ""}`;
  toastTimer = window.setTimeout(() => {
    toast.className = "admin-toast";
  }, 3200);
}

function setStatus(message, state = "") {
  statusText.textContent = message;
  statusDot.className = `status-dot${state ? ` is-${state}` : ""}`;
}

function markDirty() {
  dirty = true;
  setStatus("有未保存的修改", "");
}

function authHeaders() {
  const token = tokenInput.value.trim();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function requestJson(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
      ...(options.headers || {}),
    },
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error || `请求失败：${response.status}`);
  }

  return payload;
}

function downloadContentScript() {
  const script = `window.SITE_CONTENT = ${JSON.stringify(content, null, 2)};\n`;
  const blob = new Blob([script], { type: "text/javascript;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "content.js";
  link.click();
  URL.revokeObjectURL(link.href);
  showToast("备份文件已下载", "success");
}

function ensureContentShape() {
  content.articles = Array.isArray(content.articles) ? content.articles : [];
  content.photos = Array.isArray(content.photos) ? content.photos : [];
  content.timeline = Array.isArray(content.timeline) ? content.timeline : [];
  content.photos.forEach((photo, index) => {
    photo.id = photo.id || `photo-${index + 1}`;
  });
  content.articles.forEach((article) => {
    article.body = Array.isArray(article.body) ? article.body : [];
    if (
      article.linkedPhotoId &&
      !Object.prototype.hasOwnProperty.call(article, "linkedByPhoto")
    ) {
      const linkedPhoto = content.photos.find(
        (photo) => photo.id === article.linkedPhotoId,
      );
      article.linkedByPhoto = Boolean(
        linkedPhoto &&
          article.title === linkedPhoto.caption &&
          String(article.excerpt || "").includes("照片"),
      );
    }
  });
  content.music = content.music || {};
  content.music.tracks = Array.isArray(content.music.tracks)
    ? content.music.tracks
    : content.assets?.music
      ? [
          {
            title: content.music.title || "未命名曲目",
            artist: content.music.artist || "",
            path: content.assets.music,
          },
        ]
      : [];
  content.heroPhotoIndex = Math.min(
    Math.max(Number(content.heroPhotoIndex) || 0, 0),
    Math.max(content.photos.length - 1, 0),
  );
  content.featuredArticleIndex = Math.min(
    Math.max(Number(content.featuredArticleIndex) || 0, 0),
    Math.max(content.articles.length - 1, 0),
  );
  content.backgroundMode =
    content.backgroundMode === "image" ? "image" : "video";
}

function renderIndexSelects() {
  heroPhotoSelect.innerHTML = content.photos
    .map(
      (photo, index) =>
        `<option value="${index}">${escapeHtml(
          photo.caption || `照片 ${index + 1}`,
        )}</option>`,
    )
    .join("");
  heroPhotoSelect.value = String(content.heroPhotoIndex || 0);

  featuredArticleSelect.innerHTML = content.articles
    .map(
      (article, index) =>
        `<option value="${index}">${escapeHtml(
          article.title || `文章 ${index + 1}`,
        )}</option>`,
    )
    .join("");
  featuredArticleSelect.value = String(content.featuredArticleIndex || 0);
}

function fillProfileFields() {
  document.querySelectorAll("[data-field]").forEach((field) => {
    field.value = content[field.dataset.field] || "";
  });

  document.querySelectorAll("[data-music-field]").forEach((field) => {
    field.value = content.music?.[field.dataset.musicField] || "";
  });

  document.querySelectorAll("[data-index-field]").forEach((field) => {
    field.value = String(content[field.dataset.indexField] || 0);
  });

  document.querySelectorAll("[data-asset-url]").forEach((field) => {
    field.value = content.assets?.[field.dataset.assetUrl] || "";
  });

  backgroundModeSelect.value = content.backgroundMode || "video";
}

function renderArticles() {
  articleList.innerHTML = content.articles
    .map(
      (article, index) => {
        const articleImage = resolveArticleImage(article);
        return `
        <article class="editor-card" data-article-card="${index}">
          <header class="editor-card__header">
            <strong>${escapeHtml(article.title || `未命名文章 ${index + 1}`)}</strong>
            <div class="editor-card__actions">
              <button class="icon-button" type="button" data-article-action="up" data-index="${index}" aria-label="上移文章" ${index === 0 ? "disabled" : ""}>
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="m18 15-6-6-6 6"/></svg>
              </button>
              <button class="icon-button" type="button" data-article-action="down" data-index="${index}" aria-label="下移文章" ${index === content.articles.length - 1 ? "disabled" : ""}>
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="m6 9 6 6 6-6"/></svg>
              </button>
              <button class="icon-button icon-button--danger" type="button" data-article-action="delete" data-index="${index}" aria-label="删除文章">
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="m19 6-1 15H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>
              </button>
            </div>
          </header>
          <div class="editor-card__body">
            <label>
              <span>日期</span>
              <input type="text" value="${escapeHtml(article.date)}" data-article-index="${index}" data-article-prop="date" />
            </label>
            <label>
              <span>标题</span>
              <input type="text" value="${escapeHtml(article.title)}" data-article-index="${index}" data-article-prop="title" />
            </label>
            <label class="editor-card__wide">
              <span>摘要</span>
              <input type="text" value="${escapeHtml(article.excerpt)}" data-article-index="${index}" data-article-prop="excerpt" />
            </label>
            <label class="editor-card__wide">
              <span>正文，段落之间空一行</span>
              <textarea rows="10" data-article-index="${index}" data-article-prop="body">${escapeHtml(article.body.join("\n\n"))}</textarea>
            </label>
            <div class="article-media editor-card__wide">
              <div class="article-media__preview${articleImage ? " has-image" : ""}">
                ${
                  articleImage
                    ? `<img src="${escapeHtml(articleImage.path)}" alt="" />`
                    : "<span>暂无文章照片</span>"
                }
              </div>
              <div class="article-media__controls">
                <label>
                  <span>文章照片</span>
                  <select data-article-cover="${index}">
                    ${articleCoverOptions(article)}
                  </select>
                </label>
                <div class="article-media__actions">
                  <button class="button button--ghost" type="button" data-article-action="upload-image" data-index="${index}">上传文章照片</button>
                  <button class="button button--ghost" type="button" data-article-action="clear-image" data-index="${index}">移除配图</button>
                  <input type="file" accept="image/*" hidden data-article-image-upload="${index}" />
                </div>
                <p>可以选择照片档案里的图片，也可以上传一张只用于这篇文章的图片。</p>
              </div>
            </div>
          </div>
        </article>
      `;
      },
    )
    .join("");
}

function renderTimeline() {
  timelineList.innerHTML = content.timeline
    .map(
      (item, index) => `
        <article class="editor-card" data-timeline-card="${index}">
          <header class="editor-card__header">
            <strong>${escapeHtml(item.title || `时间节点 ${index + 1}`)}</strong>
            <div class="editor-card__actions">
              <button class="icon-button" type="button" data-timeline-action="up" data-index="${index}" aria-label="上移节点" ${index === 0 ? "disabled" : ""}>
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="m18 15-6-6-6 6"/></svg>
              </button>
              <button class="icon-button" type="button" data-timeline-action="down" data-index="${index}" aria-label="下移节点" ${index === content.timeline.length - 1 ? "disabled" : ""}>
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="m6 9 6 6 6-6"/></svg>
              </button>
              <button class="icon-button icon-button--danger" type="button" data-timeline-action="delete" data-index="${index}" aria-label="删除节点">
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="m19 6-1 15H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>
              </button>
            </div>
          </header>
          <div class="editor-card__body">
            <label>
              <span>年份或时间</span>
              <input type="text" value="${escapeHtml(item.year || "")}" data-timeline-index="${index}" data-timeline-prop="year" />
            </label>
            <label>
              <span>节点标题</span>
              <input type="text" value="${escapeHtml(item.title || "")}" data-timeline-index="${index}" data-timeline-prop="title" />
            </label>
            <label class="editor-card__wide">
              <span>节点说明</span>
              <textarea rows="4" data-timeline-index="${index}" data-timeline-prop="description">${escapeHtml(item.description || "")}</textarea>
            </label>
          </div>
        </article>
      `,
    )
    .join("");
}

function renderPhotos() {
  photoList.innerHTML = content.photos
    .map(
      (photo, index) => `
        <article class="photo-editor__item" data-photo-card="${index}">
          <div class="photo-editor__thumb${photo.path ? " has-image" : ""}">
            <img src="${escapeHtml(photo.path)}" alt="" data-photo-preview="${index}" />
            <span>PHOTO / ${String(index + 1).padStart(2, "0")}</span>
          </div>
          <div class="photo-editor__fields">
            <label>
              <span>照片说明</span>
              <input type="text" value="${escapeHtml(photo.caption)}" data-photo-index="${index}" data-photo-prop="caption" />
            </label>
            <label>
              <span>日期或季节</span>
              <input type="text" value="${escapeHtml(photo.date)}" data-photo-index="${index}" data-photo-prop="date" />
            </label>
            <label>
              <span>排版</span>
              <select data-photo-index="${index}" data-photo-prop="layout">
                <option value="wide" ${photo.layout === "wide" ? "selected" : ""}>横向大图</option>
                <option value="standard" ${photo.layout === "standard" ? "selected" : ""}>标准比例</option>
                <option value="tall" ${photo.layout === "tall" ? "selected" : ""}>竖向照片</option>
              </select>
            </label>
            <div class="photo-editor__upload">
              <span>${escapeHtml(photo.path.split("/").pop())}</span>
              <button class="button button--ghost" type="button" data-photo-action="upload" data-index="${index}">更换照片</button>
              <input type="file" accept="image/*" hidden data-photo-upload="${index}" />
            </div>
            <div class="photo-editor__actions">
              <button class="icon-button" type="button" data-photo-action="up" data-index="${index}" aria-label="上移照片" ${index === 0 ? "disabled" : ""}>
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="m18 15-6-6-6 6"/></svg>
              </button>
              <button class="icon-button" type="button" data-photo-action="down" data-index="${index}" aria-label="下移照片" ${index === content.photos.length - 1 ? "disabled" : ""}>
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="m6 9 6 6 6-6"/></svg>
              </button>
              <button class="icon-button icon-button--danger" type="button" data-photo-action="delete" data-index="${index}" aria-label="删除照片">
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="m19 6-1 15H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>
              </button>
            </div>
          </div>
        </article>
      `,
    )
    .join("");

  document.querySelectorAll("[data-photo-preview]").forEach((image) => {
    image.addEventListener("load", () => image.closest(".photo-editor__thumb")?.classList.add("has-image"));
    image.addEventListener("error", () => {
      const fallbackPath = image.src.replace("/photos/", "/");
      if (fallbackPath !== image.src && image.dataset.fallbackUsed !== "true") {
        image.dataset.fallbackUsed = "true";
        image.src = fallbackPath;
        return;
      }
      image.closest(".photo-editor__thumb")?.classList.remove("has-image");
    });
  });
}

function renderTracks() {
  trackList.innerHTML = content.music.tracks
    .map(
      (track, index) => `
        <article class="editor-card" data-track-card="${index}">
          <header class="editor-card__header">
            <strong>${escapeHtml(track.title || `曲目 ${index + 1}`)}</strong>
            <div class="editor-card__actions">
              <button class="icon-button" type="button" data-track-action="up" data-index="${index}" aria-label="上移曲目" ${index === 0 ? "disabled" : ""}>
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="m18 15-6-6-6 6"/></svg>
              </button>
              <button class="icon-button" type="button" data-track-action="down" data-index="${index}" aria-label="下移曲目" ${index === content.music.tracks.length - 1 ? "disabled" : ""}>
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="m6 9 6 6 6-6"/></svg>
              </button>
              <button class="icon-button icon-button--danger" type="button" data-track-action="delete" data-index="${index}" aria-label="删除曲目">
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="m19 6-1 15H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>
              </button>
            </div>
          </header>
          <div class="editor-card__body">
            <label>
              <span>曲名</span>
              <input type="text" value="${escapeHtml(track.title || "")}" data-track-index="${index}" data-track-prop="title" />
            </label>
            <label>
              <span>歌手</span>
              <input type="text" value="${escapeHtml(track.artist || "")}" data-track-index="${index}" data-track-prop="artist" />
            </label>
            <div class="editor-card__wide">
              <span class="track-path">${escapeHtml(track.path || "尚未上传音乐文件")}</span>
            </div>
          </div>
        </article>
      `,
    )
    .join("");
}

function renderAssetPreviews() {
  Object.entries(assetTargets).forEach(([name, target]) => {
    const preview = document.querySelector(`[data-preview="${name}"]`);
    if (!preview || preview.classList.contains("asset-row__preview--file")) {
      return;
    }

    preview.innerHTML = `<img src="${escapeHtml(content.assets[name] || target)}" alt="" />`;
    const image = preview.querySelector("img");
    image.addEventListener("error", () => {
      preview.classList.remove("has-image");
      image.remove();
    });
    image.addEventListener("load", () => preview.classList.add("has-image"));
  });
}

function renderAll() {
  ensureContentShape();
  renderIndexSelects();
  fillProfileFields();
  renderArticles();
  renderTimeline();
  renderPhotos();
  renderTracks();
  renderAssetPreviews();
}

async function loadContent() {
  setStatus("正在连接站点数据");

  try {
    const status = await requestJson("/api/status", { method: "GET" });
    serverMode = status.mode;
    content = await requestJson("/api/content", { method: "GET" });
    content.assets = {
      backgroundVideo: defaultBackgroundVideo,
      ...(content.assets || {}),
    };
    renderAll();
    if (serverMode === "cloudflare") {
      const storageLabel = status.storageMode === "r2" ? "R2" : status.storageMode === "kv" ? "KV" : "";
      if (tokenInput.value.trim()) {
        await verifyToken(true);
      } else {
        setStatus(`Cloudflare ${storageLabel} 已连接，请填写管理密码`, "");
      }
    } else {
      setStatus("本地管理已连接", "ready");
    }
  } catch (error) {
    setStatus("管理接口未连接", "error");
    showToast(
      location.protocol === "file:"
        ? "请双击“启动管理后台.bat”后再使用"
        : error.message,
      "error",
    );
  }
}

async function verifyToken(silent = false) {
  const token = tokenInput.value.trim();
  if (!token && serverMode === "cloudflare") {
    setStatus("请先填写管理密码", "error");
    if (!silent) {
      showToast("请先填写管理密码", "error");
    }
    return false;
  }

  try {
    await requestJson("/api/auth", {
      method: "POST",
      body: "{}",
    });
    setStatus("管理密码验证通过", "ready");
    if (!silent) {
      showToast("管理密码验证通过", "success");
    }
    return true;
  } catch (error) {
    setStatus("管理密码不正确", "error");
    if (!silent) {
      showToast(error.message, "error");
    }
    return false;
  }
}

async function saveContent() {
  if (!content) {
    return;
  }

  ensureContentShape();
  saveButton.disabled = true;
  setStatus("正在保存");

  try {
    await requestJson("/api/content", {
      method: "POST",
      body: JSON.stringify(content),
    });
    dirty = false;
    setStatus(serverMode === "cloudflare" ? "已保存到 Cloudflare" : "已保存到本地项目", "ready");
    showToast("内容已保存，刷新网站即可看到", "success");
    return true;
  } catch (error) {
    setStatus("保存失败", "error");
    showToast(error.message, "error");
    return false;
  } finally {
    saveButton.disabled = false;
  }
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("无法读取文件"));
    reader.readAsDataURL(file);
  });
}

async function compressImage(file) {
  if (!file.type.startsWith("image/") || file.size < 1.5 * 1024 * 1024) {
    return readFileAsDataUrl(file);
  }

  const bitmap = await createImageBitmap(file);
  const maxEdge = 2400;
  const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const context = canvas.getContext("2d");
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return canvas.toDataURL("image/jpeg", 0.86);
}

async function uploadFile(file, options = {}) {
  const dataUrl = await compressImage(file);
  const payload = {
    target: options.target || assetTargets[options.assetName],
    kind: options.kind || "media",
    filename: file.name,
    dataUrl,
  };

  return requestJson("/api/upload", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

function moveItem(list, index, direction) {
  const nextIndex = index + direction;
  if (nextIndex < 0 || nextIndex >= list.length) {
    return;
  }
  [list[index], list[nextIndex]] = [list[nextIndex], list[index]];

  if (list === content.photos) {
    if (content.heroPhotoIndex === index) {
      content.heroPhotoIndex = nextIndex;
    } else if (content.heroPhotoIndex === nextIndex) {
      content.heroPhotoIndex = index;
    }
  } else if (list === content.articles) {
    if (content.featuredArticleIndex === index) {
      content.featuredArticleIndex = nextIndex;
    } else if (content.featuredArticleIndex === nextIndex) {
      content.featuredArticleIndex = index;
    }
  }

  markDirty();
  renderAll();
}

document.querySelectorAll("[data-tab]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-tab]").forEach((item) => item.classList.toggle("is-active", item === button));
    document.querySelectorAll("[data-panel]").forEach((panel) => {
      panel.classList.toggle("is-active", panel.dataset.panel === button.dataset.tab);
    });
  });
});

document.addEventListener("input", (event) => {
  const field = event.target.closest("[data-field]");
  const indexField = event.target.closest("[data-index-field]");
  const musicField = event.target.closest("[data-music-field]");
  const articleField = event.target.closest("[data-article-prop]");
  const timelineField = event.target.closest("[data-timeline-prop]");
  const photoField = event.target.closest("[data-photo-prop]");
  const trackField = event.target.closest("[data-track-prop]");
  const assetUrlField = event.target.closest("[data-asset-url]");
  const backgroundModeField = event.target.closest("#background-mode-select");

  if (field && content) {
    content[field.dataset.field] = field.value;
    markDirty();
  } else if (indexField && content) {
    content[indexField.dataset.indexField] = Number(indexField.value) || 0;
    markDirty();
  } else if (musicField && content) {
    content.music[musicField.dataset.musicField] = musicField.value;
    markDirty();
  } else if (articleField && content) {
    const article = content.articles[Number(articleField.dataset.articleIndex)];
    const property = articleField.dataset.articleProp;
    article[property] =
      property === "body"
        ? articleField.value.split(/\n\s*\n/).map((item) => item.trim()).filter(Boolean)
        : articleField.value;
    markDirty();
  } else if (timelineField && content) {
    const item = content.timeline[Number(timelineField.dataset.timelineIndex)];
    item[timelineField.dataset.timelineProp] = timelineField.value;
    markDirty();
  } else if (photoField && content) {
    const photoIndex = Number(photoField.dataset.photoIndex);
    const photo = content.photos[photoIndex];
    const property = photoField.dataset.photoProp;
    photo[property] = photoField.value;
    const linkedArticle = content.articles.find(
      (article) => article.linkedPhotoId === photo.id,
    );
    if (linkedArticle) {
      if (property === "caption" && linkedArticle.linkedByPhoto) {
        linkedArticle.title = photoField.value || "新的照片记录";
      } else if (property === "date" && linkedArticle.linkedByPhoto) {
        linkedArticle.date = photoField.value || linkedArticle.date;
      }
    }
    markDirty();
  } else if (trackField && content) {
    content.music.tracks[Number(trackField.dataset.trackIndex)][trackField.dataset.trackProp] = trackField.value;
    markDirty();
  } else if (assetUrlField && content) {
    content.assets[assetUrlField.dataset.assetUrl] = assetUrlField.value.trim();
    markDirty();
  } else if (backgroundModeField && content) {
    content.backgroundMode = backgroundModeField.value;
    markDirty();
  }
});

trackList.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-track-action]");
  if (!button || !content) {
    return;
  }
  const index = Number(button.dataset.index);
  if (button.dataset.trackAction === "up") {
    moveItem(content.music.tracks, index, -1);
  } else if (button.dataset.trackAction === "down") {
    moveItem(content.music.tracks, index, 1);
  } else if (button.dataset.trackAction === "delete" && window.confirm("确定删除这首音乐吗？")) {
    const removedTrack = content.music.tracks[index];
    content.music.tracks.splice(index, 1);
    markDirty();
    renderAll();
    if (await saveContent()) {
      await deleteUnusedMediaAfterSave([removedTrack?.path]);
    }
  }
});

timelineList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-timeline-action]");
  if (!button || !content) {
    return;
  }

  const index = Number(button.dataset.index);
  if (button.dataset.timelineAction === "up") {
    moveItem(content.timeline, index, -1);
  } else if (button.dataset.timelineAction === "down") {
    moveItem(content.timeline, index, 1);
  } else if (button.dataset.timelineAction === "delete" && window.confirm("确定删除这个时间节点吗？")) {
    content.timeline.splice(index, 1);
    markDirty();
    renderAll();
  }
});

articleList.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-article-action]");
  if (!button || !content) {
    return;
  }

  const index = Number(button.dataset.index);
  if (button.dataset.articleAction === "up") {
    moveItem(content.articles, index, -1);
  } else if (button.dataset.articleAction === "down") {
    moveItem(content.articles, index, 1);
  } else if (button.dataset.articleAction === "delete" && window.confirm("确定删除这篇文章吗？")) {
    const removedArticle = content.articles[index];
    content.articles.splice(index, 1);
    content.featuredArticleIndex = Math.min(
      Math.max(content.featuredArticleIndex, 0),
      Math.max(content.articles.length - 1, 0),
    );
    markDirty();
    renderAll();
    if (await saveContent()) {
      await deleteUnusedMediaAfterSave([removedArticle?.coverImage]);
    }
  } else if (button.dataset.articleAction === "upload-image") {
    document.querySelector(`[data-article-image-upload="${index}"]`)?.click();
  } else if (button.dataset.articleAction === "clear-image") {
    const article = content.articles[index];
    const previousImage = article.coverImage;
    article.coverPhotoId = "none";
    article.coverImage = "";
    markDirty();
    renderAll();
    if (await saveContent()) {
      await deleteUnusedMediaAfterSave([previousImage]);
    }
  }
});

articleList.addEventListener("change", async (event) => {
  const coverSelect = event.target.closest("[data-article-cover]");
  const uploadInput = event.target.closest("[data-article-image-upload]");

  if (coverSelect && content) {
    const article = content.articles[Number(coverSelect.dataset.articleCover)];
    if (coverSelect.value === "__uploaded__") {
      return;
    }
    const previousImage = article.coverImage;
    article.coverPhotoId =
      coverSelect.value === "__auto__" ? "" : coverSelect.value;
    article.coverImage = "";
    markDirty();
    renderAll();
    if (await saveContent()) {
      await deleteUnusedMediaAfterSave([previousImage]);
    }
    return;
  }

  if (!uploadInput?.files?.[0] || !content) {
    return;
  }

  const index = Number(uploadInput.dataset.articleImageUpload);
  const article = content.articles[index];
  uploadInput.disabled = true;
  setStatus("正在上传文章照片");

  try {
    const file = uploadInput.files[0];
    const previousImage = article.coverImage;
    const result = await uploadFile(file, {
      kind: "image",
      target: `./assets/articles/article-${Date.now()}.jpg`,
    });
    article.coverPhotoId = "";
    article.coverImage = result.path;
    article.coverImageAlt = article.title || file.name;
    dirty = true;
    renderAll();
    if (await saveContent()) {
      await deleteUnusedMediaAfterSave([previousImage]);
    }
  } catch (error) {
    setStatus("文章照片上传失败", "error");
    showToast(error.message, "error");
  } finally {
    uploadInput.disabled = false;
  }
});

photoList.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-photo-action]");
  if (!button || !content) {
    return;
  }

  const index = Number(button.dataset.index);
  if (button.dataset.photoAction === "up") {
    moveItem(content.photos, index, -1);
  } else if (button.dataset.photoAction === "down") {
    moveItem(content.photos, index, 1);
  } else if (button.dataset.photoAction === "delete" && window.confirm("确定从网站移除这张照片吗？")) {
    const removedPhoto = content.photos[index];
    content.photos.splice(index, 1);
    content.articles = content.articles.filter(
      (article) =>
        !(article.linkedByPhoto && article.linkedPhotoId === removedPhoto.id),
    );
    content.articles.forEach((article) => {
      if (article.coverPhotoId === removedPhoto.id) {
        article.coverPhotoId = "";
      }
    });
    content.featuredArticleIndex = Math.min(
      Math.max(content.featuredArticleIndex, 0),
      Math.max(content.articles.length - 1, 0),
    );
    content.heroPhotoIndex = Math.min(
      Math.max(content.heroPhotoIndex, 0),
      Math.max(content.photos.length - 1, 0),
    );
    markDirty();
    renderAll();
    if (await saveContent()) {
      await deleteUnusedMediaAfterSave([removedPhoto?.path]);
    }
  } else if (button.dataset.photoAction === "upload") {
    document.querySelector(`[data-photo-upload="${index}"]`)?.click();
  }
});

photoList.addEventListener("change", async (event) => {
  const input = event.target.closest("[data-photo-upload]");
  if (!input || !input.files?.[0] || !content) {
    return;
  }

  const index = Number(input.dataset.photoUpload);
  const photo = content.photos[index];
  input.disabled = true;
  setStatus("正在上传照片");

  try {
    const previousPath = photo.path;
    const result = await uploadFile(input.files[0], {
      kind: "photo",
      target: `./assets/photos/photo-${String(index + 1).padStart(2, "0")}.jpg`,
    });
    photo.path = result.path;
    photo.alt = photo.caption || input.files[0].name;
    dirty = true;
    renderAll();
    if (await saveContent()) {
      await deleteUnusedMediaAfterSave([previousPath]);
    }
  } catch (error) {
    setStatus("照片上传失败", "error");
    showToast(error.message, "error");
  } finally {
    input.disabled = false;
  }
});

document.querySelectorAll("[data-asset-upload]").forEach((input) => {
  input.addEventListener("change", async () => {
    const file = input.files?.[0];
    const assetName = input.dataset.assetUpload;
    if (!file || !content) {
      return;
    }

    input.disabled = true;
    setStatus("正在上传素材");

    try {
      const previousPath = content.assets[assetName];
      const result = await uploadFile(file, {
        assetName,
        kind: assetName === "video" || assetName === "music" ? "media" : "image",
      });
      content.assets[assetName] = result.path;
      if (assetName === "background") {
        content.backgroundMode = "image";
      } else if (assetName === "backgroundVideo") {
        content.backgroundMode = "video";
      }
      dirty = true;
      renderAssetPreviews();
      if (await saveContent()) {
        await deleteUnusedMediaAfterSave([previousPath]);
      }
    } catch (error) {
      setStatus("素材上传失败", "error");
      showToast(error.message, "error");
    } finally {
      input.disabled = false;
    }
  });
});

musicUploadInput.addEventListener("change", async () => {
  if (!content || !musicUploadInput.files?.length) {
    return;
  }

  const files = [...musicUploadInput.files];
  musicUploadInput.disabled = true;
  setStatus(`正在上传 ${files.length} 首音乐`);

  try {
    for (const [index, file] of files.entries()) {
      setStatus(`正在上传第 ${index + 1} / ${files.length} 首音乐`);
      const result = await uploadFile(file, {
        kind: "media",
        target: `./assets/music-${Date.now()}-${index}.mp3`,
      });
      content.music.tracks.push({
        title: file.name.replace(/\.[^.]+$/, ""),
        artist: siteConfigFallbackArtist(),
        path: result.path,
      });
    }
    musicUploadInput.value = "";
    dirty = true;
    renderAll();
    await saveContent();
  } catch (error) {
    setStatus("音乐上传失败", "error");
    showToast(error.message, "error");
  } finally {
    musicUploadInput.disabled = false;
  }
});

function siteConfigFallbackArtist() {
  return content?.music?.artist || content?.name || "";
}

addArticleButton.addEventListener("click", () => {
  if (!content) {
    return;
  }
  content.articles.unshift({
    date: new Date().toLocaleDateString("zh-CN", { month: "2-digit", day: "2-digit" }).replace("/", "."),
    title: "新的文章",
    excerpt: "在这里填写文章摘要。",
    body: ["在这里开始写正文。段落之间空一行。"],
  });
  markDirty();
  renderAll();
  document.querySelector('[data-panel="articles"]')?.scrollIntoView({ behavior: "smooth" });
});

addTrackButton.addEventListener("click", () => {
  if (!content) {
    return;
  }
  content.music.tracks.unshift({
    title: "新的曲目",
    artist: content.name || "",
    path: "",
  });
  markDirty();
  renderAll();
});

addTimelineButton.addEventListener("click", () => {
  if (!content) {
    return;
  }
  content.timeline.unshift({
    year: new Date().getFullYear().toString(),
    title: "新的时间节点",
    description: "在这里补充这一阶段发生的事情。",
  });
  markDirty();
  renderAll();
});

addPhotoButton.addEventListener("click", () => {
  if (content) {
    newPhotoUploadInput.click();
  }
});

newPhotoUploadInput.addEventListener("change", async () => {
  const file = newPhotoUploadInput.files?.[0];
  if (!file || !content) {
    return;
  }

  const timestamp = Date.now();
  const photoId = `photo-${timestamp}`;
  const date = new Date();
  const dateLabel = `${String(date.getMonth() + 1).padStart(2, "0")}.${String(
    date.getDate(),
  ).padStart(2, "0")}`;

  newPhotoUploadInput.disabled = true;
  addPhotoButton.disabled = true;
  setStatus("正在上传新照片");

  try {
    const result = await uploadFile(file, {
      kind: "photo",
      target: `./assets/photos/photo-${String(content.photos.length + 1).padStart(2, "0")}.jpg`,
    });
    const photo = {
      id: photoId,
      path: result.path,
      caption: "新的照片",
      date: dateLabel,
      layout: "standard",
      alt: "新的照片",
    };
    content.photos.unshift(photo);
    content.heroPhotoIndex = 0;
    content.articles.unshift({
      date: dateLabel,
      title: photo.caption,
      excerpt: "一张新的照片已经加入档案。",
      body: ["这张照片记录下了最近的一个片段。"],
      linkedPhotoId: photoId,
      linkedByPhoto: true,
    });
    content.featuredArticleIndex = 0;
    dirty = true;
    renderAll();
    await saveContent();
    showToast("新照片和记录已同步", "success");
  } catch (error) {
    setStatus("新照片上传失败", "error");
    showToast(error.message, "error");
  } finally {
    newPhotoUploadInput.value = "";
    newPhotoUploadInput.disabled = false;
    addPhotoButton.disabled = false;
  }
});

saveButton.addEventListener("click", saveContent);
downloadButton.addEventListener("click", downloadContentScript);

cleanupMediaButton.addEventListener("click", async () => {
  if (serverMode !== "cloudflare") {
    showToast("存储清理仅在 Cloudflare 部署中可用", "error");
    return;
  }

  if (
    !window.confirm(
      "只会删除没有被照片、文章、音乐和站点素材引用的云端文件。确定开始清理吗？",
    )
  ) {
    return;
  }

  cleanupMediaButton.disabled = true;
  storageCleanupStatus.textContent = "正在检查并清理未使用文件...";
  setStatus("正在清理云端存储");

  try {
    const result = await requestJson("/api/cleanup-media", {
      method: "POST",
      body: "{}",
    });
    storageCleanupStatus.textContent = `清理完成：删除 ${result.deleted} 个文件，保留 ${result.kept} 个正在使用的文件。`;
    setStatus("云端存储清理完成", "ready");
    showToast(`已释放 ${result.deleted} 个未使用文件`, "success");
  } catch (error) {
    storageCleanupStatus.textContent = `清理失败：${error.message}`;
    setStatus("云端存储清理失败", "error");
    showToast(error.message, "error");
  } finally {
    cleanupMediaButton.disabled = false;
  }
});

tokenInput.value = sessionStorage.getItem("siteAdminToken") || "";
tokenInput.addEventListener("input", () => {
  sessionStorage.setItem("siteAdminToken", tokenInput.value.trim());
  setStatus("密码已修改，请点击验证", "");
});
verifyTokenButton.addEventListener("click", () => verifyToken());

window.addEventListener("beforeunload", (event) => {
  if (!dirty) {
    return;
  }
  event.preventDefault();
  event.returnValue = "";
});

loadContent();
