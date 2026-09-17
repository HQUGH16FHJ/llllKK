# Cloudflare Pages 静态部署

这个版本不需要 KV、D1、R2 或 Functions。

## 上传 GitHub

把压缩包解压后，将全部文件上传到新仓库根目录。

## 创建 Pages

1. Cloudflare Dashboard
2. `Workers & Pages`
3. `Create application`
4. `Pages`
5. 连接 GitHub 仓库

配置：

```text
Framework preset: None
Root directory: /
Build command: 留空
Build output directory: /
```

点击部署。

## 更新内容

管理后台是静态模式：

```text
https://你的域名/admin.html
```

编辑完成后点击“导出 site.json”，然后：

1. 打开 GitHub 仓库
2. 进入 `data` 文件夹
3. 用导出的 `site.json` 替换原文件
4. 提交

Cloudflare 会自动重新部署。

## 页面地址

```text
https://你的域名/
https://你的域名/daily.html
https://你的域名/admin.html
```
