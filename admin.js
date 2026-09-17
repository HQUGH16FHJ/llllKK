const fallback = window.SITE_FALLBACK;
const $ = (selector) => document.querySelector(selector);
const elements = {
  status: $("#admin-status"),
  toast: $("#admin-toast"),
  dialog: $("#editor-dialog"),
  form: $("#editor-form"),
  kicker: $("#editor-kicker"),
  title: $("#editor-title"),
  fields: $("#editor-fields"),
  mediaInput: $("#media-input"),
};
let state = structuredClone(fallback);
let activeSection = "overview";
let editType = "";
let editId = "";
let uploadTarget = "";

function esc(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
function id(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}
function toast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add("is-visible");
  setTimeout(() => elements.toast.classList.remove("is-visible"), 2200);
}
function saveLocal(quiet = false) {
  localStorage.setItem("portfolio-static-data", JSON.stringify(state));
  elements.status.textContent = "已保存到浏览器";
  if (!quiet) toast("已保存到浏览器");
}
function showSection(name) {
  activeSection = name;
  document.querySelectorAll("[data-section]").forEach((button) => button.classList.toggle("is-active", button.dataset.section === name));
  document.querySelectorAll("[data-panel]").forEach((panel) => panel.classList.toggle("is-active", panel.dataset.panel === name));
}
function renderProfile() {
  const p = state.profile;
  const map = {
    "p-name": "name",
    "p-role": "role",
    "p-email": "email",
    "p-location": "location",
    "p-github": "github",
    "p-website": "website",
    "p-music-title": "musicTitle",
    "p-music-artist": "musicArtist",
    "p-tagline": "tagline",
    "p-intro": "intro",
    "p-about": "about",
  };
  Object.entries(map).forEach(([elementId, key]) => {
    const element = document.getElementById(elementId);
    if (element) element.value = p[key] || "";
  });
  $("#overview-image").src = p.heroImage || state.media[0]?.url || "";
  $("#overview-name").textContent = p.name || "";
  $("#overview-role").textContent = p.role || "";
}
function renderMetrics() {
  $("#metric-experience").textContent = state.experience.length;
  $("#metric-projects").textContent = state.projects.length;
  $("#metric-posts").textContent = state.posts.filter((post) => post.status !== "draft").length;
  $("#metric-media").textContent = state.media.length;
}
function actionButtons(type, itemId) {
  return `<div><button data-edit="${type}" data-id="${esc(itemId)}">改</button><button data-delete="${type}" data-id="${esc(itemId)}">删</button></div>`;
}
function renderExperience() {
  $("#experience-list").innerHTML = state.experience.map((item) => `
    <article class="admin-list-item"><small>${esc(item.period)}</small><div><strong>${esc(item.organization)} · ${esc(item.role)}</strong><p>${esc(item.description)}</p></div>${actionButtons("experience", item.id)}</article>`).join("") || "<p>暂无经历</p>";
}
function renderSkills() {
  $("#skills-list").innerHTML = state.skills.map((item) => `
    <article class="admin-list-item"><small>能力</small><div><strong>${esc(item.category)}</strong><p>${esc(item.items.join(" / "))}</p></div>${actionButtons("skills", item.id)}</article>`).join("") || "<p>暂无能力分组</p>";
}
function renderProjects() {
  $("#projects-list").innerHTML = state.projects.map((item) => `
    <article><img src="${esc(item.cover)}" alt="" /><strong>${esc(item.title)}</strong><p>${esc(item.summary)}</p><div><button data-edit="projects" data-id="${esc(item.id)}">编辑</button><button data-delete="projects" data-id="${esc(item.id)}">删除</button></div></article>`).join("") || "<p>暂无项目</p>";
}
function renderPosts() {
  $("#posts-list").innerHTML = state.posts.map((item) => `
    <article class="admin-list-item"><small>${item.status === "draft" ? "草稿" : "已发布"}</small><div><strong>${esc(item.title)}</strong><p>${esc(item.category)} · ${esc(item.date)}</p></div>${actionButtons("posts", item.id)}</article>`).join("") || "<p>暂无文章</p>";
}
function renderMedia() {
  $("#media-list").innerHTML = state.media.map((item) => `
    <article><img src="${esc(item.url)}" alt="" /><strong>${esc(item.name)}</strong><div><button data-copy="${esc(item.url)}">复制地址</button><button data-delete="media" data-id="${esc(item.id)}">删除</button></div></article>`).join("") || "<p>暂无图片</p>";
}
function render() {
  renderProfile();
  renderMetrics();
  renderExperience();
  renderSkills();
  renderProjects();
  renderPosts();
  renderMedia();
}
function field(label, name, value = "", type = "text") {
  if (type === "textarea") return `<label><span>${label}</span><textarea name="${name}" rows="5">${esc(value)}</textarea></label>`;
  if (type === "select") return `<label><span>${label}</span><select name="${name}">${value}</select></label>`;
  if (type === "checkbox") return `<label><span>${label}</span><input name="${name}" type="checkbox" ${value ? "checked" : ""} /></label>`;
  return `<label><span>${label}</span><input name="${name}" type="${type}" value="${esc(value)}" /></label>`;
}
function mediaOptions(selected = "") {
  return `<option value="">不选择</option>${state.media.map((item) => `<option value="${esc(item.url)}" ${item.url === selected ? "selected" : ""}>${esc(item.name)}</option>`).join("")}`;
}
function openEditor(type, itemId = "") {
  editType = type;
  editId = itemId;
  const map = { experience: state.experience, skills: state.skills, projects: state.projects, posts: state.posts };
  const item = itemId ? map[type].find((entry) => entry.id === itemId) || {} : {};
  const titles = { experience: "经历", skills: "能力分组", projects: "项目", posts: "文章" };
  elements.kicker.textContent = type.toUpperCase();
  elements.title.textContent = `${itemId ? "编辑" : "添加"}${titles[type]}`;
  if (type === "experience") {
    elements.fields.innerHTML = field("机构", "organization", item.organization) + field("职位", "role", item.role) + field("时间", "period", item.period) + field("说明", "description", item.description, "textarea");
  } else if (type === "skills") {
    elements.fields.innerHTML = field("分组名称", "category", item.category) + field("能力项（用逗号分隔）", "items", (item.items || []).join(", "));
  } else if (type === "projects") {
    elements.fields.innerHTML = field("项目名称", "title", item.title) + field("说明", "summary", item.summary, "textarea") + field("封面", "cover", mediaOptions(item.cover), "select") + field("标签（用逗号分隔）", "tags", (item.tags || []).join(", ")) + field("链接", "link", item.link, "url");
  } else if (type === "posts") {
    elements.fields.innerHTML = field("标题", "title", item.title) + field("分类", "category", item.category) + field("日期", "date", item.date || new Date().toISOString().slice(0, 10), "date") + field("状态", "status", `<option value="published" ${item.status !== "draft" ? "selected" : ""}>已发布</option><option value="draft" ${item.status === "draft" ? "selected" : ""}>草稿</option>`, "select") + field("摘要", "excerpt", item.excerpt, "textarea") + field("封面", "cover", mediaOptions(item.cover), "select") + field("正文（空行分段）", "content", item.content, "textarea");
  }
  elements.dialog.showModal();
}
function handleSubmit(event) {
  event.preventDefault();
  const form = new FormData(elements.form);
  const map = { experience: state.experience, skills: state.skills, projects: state.projects, posts: state.posts };
  const collection = map[editType];
  const existing = editId ? collection.find((item) => item.id === editId) : null;
  const value = { id: existing?.id || id(editType) };
  for (const [key, entry] of form.entries()) value[key] = entry;
  if (editType === "skills") value.items = value.items.split(/[,，]/).map((item) => item.trim()).filter(Boolean);
  if (editType === "projects") value.tags = value.tags.split(/[,，]/).map((item) => item.trim()).filter(Boolean);
  if (existing) Object.assign(existing, value);
  else collection.unshift(value);
  elements.dialog.close();
  render();
  saveLocal(true);
}
function exportData() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "site.json";
  link.click();
  URL.revokeObjectURL(link.href);
  toast("已导出 site.json");
}
function bind() {
  document.querySelectorAll("[data-section]").forEach((button) => button.addEventListener("click", () => showSection(button.dataset.section)));
  document.querySelectorAll("[data-add]").forEach((button) => button.addEventListener("click", () => {
    if (button.dataset.add === "media") {
      uploadTarget = "media";
      elements.mediaInput.click();
    } else {
      openEditor(button.dataset.add);
    }
  }));
  document.querySelectorAll("[data-close]").forEach((button) => button.addEventListener("click", () => elements.dialog.close()));
  elements.form.addEventListener("submit", handleSubmit);
  $("#save-data").addEventListener("click", () => saveLocal());
  $("#export-data").addEventListener("click", exportData);
  document.addEventListener("click", (event) => {
    const edit = event.target.closest("[data-edit]");
    if (edit) return openEditor(edit.dataset.edit, edit.dataset.id);
    const remove = event.target.closest("[data-delete]");
    if (remove) {
      if (!confirm("确认删除？")) return;
      state[remove.dataset.delete] = state[remove.dataset.delete].filter((item) => item.id !== remove.dataset.id);
      render();
      saveLocal(true);
      return;
    }
    const copy = event.target.closest("[data-copy]");
    if (copy) {
      navigator.clipboard.writeText(copy.dataset.copy);
      toast("图片地址已复制");
    }
  });
  const profileMap = { "p-name":"name","p-role":"role","p-email":"email","p-location":"location","p-github":"github","p-website":"website","p-music-title":"musicTitle","p-music-artist":"musicArtist","p-tagline":"tagline","p-intro":"intro","p-about":"about" };
  document.querySelectorAll("#profile-form input, #profile-form textarea").forEach((input) => input.addEventListener("input", () => {
    const key = profileMap[input.id];
    if (key) state.profile[key] = input.value;
    saveLocal(true);
  }));
  elements.mediaInput.addEventListener("change", () => {
    const file = elements.mediaInput.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      state.media.unshift({ id: id("media"), url: reader.result, name: file.name.replace(/\.[^.]+$/, "") });
      render();
      saveLocal(true);
    };
    reader.readAsDataURL(file);
    elements.mediaInput.value = "";
  });
}
async function init() {
  try {
    const response = await fetch("data/site.json", { cache: "no-store" });
    state = response.ok ? normalize(await response.json()) : structuredClone(fallback);
  } catch {
    state = structuredClone(fallback);
  }
  render();
  bind();
  saveLocal(true);
  setTimeout(() => document.body.classList.remove("is-loading"), 100);
}
function normalize(value) {
  return {
    profile: { ...fallback.profile, ...(value.profile || {}) },
    experience: Array.isArray(value.experience) ? value.experience : [],
    skills: Array.isArray(value.skills) ? value.skills : [],
    projects: Array.isArray(value.projects) ? value.projects : [],
    posts: Array.isArray(value.posts) ? value.posts : [],
    media: Array.isArray(value.media) ? value.media : [],
  };
}
init();
