# 纯净静态个人网站

不依赖 React、Vite、Cloudflare Functions 或 KV，直接打开 `index.html` 即可。

## 文件

```text
index.html          公开首页
admin.html          本地后台
styles.css          前台样式
app.js              前台数据渲染与交互
admin.css           后台样式
admin.js            后台管理逻辑
data/site.json      网站内容
assets/images       照片和头像
assets/music        音乐
```

## 后台密码

```text
lqs1030
```

## 后台保存方式

后台数据保存在当前浏览器的 `localStorage`。

如果要把修改同步到线上网站：

1. 在后台修改内容
2. 点击“导出 site.json”
3. 用导出的文件替换 GitHub 中的 `data/site.json`
4. 提交后 Cloudflare Pages 自动重新部署

## 本地打开

可以直接双击 `index.html`。

也可以启动任意静态服务器：

```bash
python -m http.server 8080
```

然后访问：

```text
http://localhost:8080
```
