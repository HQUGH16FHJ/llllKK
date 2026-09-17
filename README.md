# 个人博客作品集网站

一个基于 React + Vite 构建的个人博客+作品集网站，支持照片画廊、音乐播放、博客文章、作品集和后台管理。

## ✨ 功能特性

- 🎨 **暗色科技风格** - 高级克制的深色主题，渐变点缀，玻璃拟态
- 📷 **照片画廊** - 瀑布流布局，灯箱预览，支持地点坐标
- 🎵 **音乐播放器** - 悬浮播放控件，音量调节，播放列表
- 📝 **博客系统** - 文章列表、分类筛选、详情页
- 💼 **作品集展示** - 大卡片展示，分类展示
- ⚙️ **后台管理** - 可视化管理照片/文章/音乐/作品/社交链接
- 📱 **响应式设计** - 完美适配 PC / Pad / 手机
- 🚀 **Cloudflare Pages 部署** - 一键部署，全球加速

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

访问 http://localhost:5173

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## ⚙️ 后台管理

访问路径：点击导航栏右上角的 ⚙ 图标，或直接在 URL 后加 `#admin`

- **默认密码**：`admin123`
- **功能**：管理个人信息、照片、文章、音乐、作品集、社交链接
- **数据存储**：浏览器 localStorage（前端管理，无需后端）

## 📦 部署到 Cloudflare Pages

### 方法一：通过 Git 仓库自动部署

1. 将代码推送到 GitHub 仓库
2. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
3. 进入 **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
4. 选择你的 GitHub 仓库
5. 构建设置：
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
6. 点击 **Save and Deploy**

### 方法二：使用 Wrangler CLI

```bash
# 安装 Wrangler
npm install -g wrangler

# 登录
wrangler login

# 部署
wrangler pages deploy dist
```

## 📁 项目结构

```
portfolio/
├── src/
│   ├── components/
│   │   ├── Navbar/          # 导航栏
│   │   ├── Hero/            # 首页 Hero
│   │   ├── Gallery/         # 照片画廊
│   │   ├── Blog/            # 博客文章
│   │   ├── Projects/        # 作品集
│   │   ├── About/           # 关于我
│   │   ├── MusicPlayer/     # 音乐播放器
│   │   └── Admin/           # 后台管理
│   ├── data/
│   │   └── store.js         # 数据存储层
│   ├── App.jsx
│   ├── App.css
│   ├── index.css            # 全局样式变量
│   └── main.jsx
├── public/
├── index.html
├── package.json
├── vite.config.js
├── wrangler.json            # Cloudflare Pages 配置
└── netlify.toml             # Netlify 配置（备用）
```

## 🎨 自定义内容

### 方式一：通过后台管理（推荐）

1. 进入后台管理页面
2. 修改个人信息、添加照片、文章、音乐等
3. 点击"保存更改"

> ⚠️ 注意：数据保存在浏览器 localStorage 中，清除浏览器数据会丢失。
> 建议修改完成后，将默认数据直接写入 `src/data/store.js` 中的 `defaultData` 对象，这样数据就会永久保存在代码中。

### 方式二：直接修改代码

编辑 `src/data/store.js` 中的 `defaultData` 对象，修改默认数据。

## 📝 照片信息字段

每张照片支持以下字段：

| 字段 | 说明 | 示例 |
|------|------|------|
| title | 照片标题 | 城市黄昏 |
| location | 拍摄地点 | 河南省登封市 |
| coordinates | 地理坐标 | 34.458°N, 113.038°E |
| category | 分类 | 城市/自然/星空/人文 |
| date | 拍摄日期 | 2024-08-15 |
| description | 描述 | 夕阳下的城市剪影 |
| image | 图片URL | https://... |

## 📄 License

MIT
