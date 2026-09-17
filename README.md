# 个人简历与日常博客

纯静态版本，不需要 KV、D1、R2 或 Cloudflare Functions。

- `index.html`：个人简历与作品集
- `daily.html`：日常博客
- `admin.html`：本地内容管理
- `data/site.json`：网站内容
- `uploads/`：照片和音乐
- `app.css`：统一样式

## 本地预览

可以通过任意静态服务器运行。例如：

```bash
python -m http.server 4178
```

也可以直接双击 `index.html`。

## Cloudflare

部署步骤见 `DEPLOY.md`。
