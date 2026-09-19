# Architecture

## Overview

刘骐硕的个人博客 is a static-first personal website with a local Node.js content-management server.

## Runtime Layers

| Layer | Files | Responsibility |
|---|---|---|
| Page shell | `index.html` | Semantic page structure and sections |
| Base styles | `styles.css` | Layout, typography, responsive behavior |
| Visual variants | `index-v2.css`, `index-v3.css` | Homepage visual experiments |
| Application runtime | `app.js` | Content rendering, article reader, gallery, music, motion |
| Components | `components/` | Depth carousel, text typing, star border |
| Local server | `server.cjs` | Static serving, content API, upload API |
| Admin | `admin.html`, `admin.css`, `admin.js` | Local content editor |
| Data | `assets/content.json`, `assets/content.js` | Site content |

## Content Flow

1. `app.js` loads site content.
2. When running through `server.cjs`, `GET /api/content` returns the local JSON.
3. The admin UI writes content through `POST /api/content`.
4. Media uploads are sent through `POST /api/upload`.
5. Content is rendered into article, photo, film, navigation, and profile sections.

## Security Boundary

The local server listens on `127.0.0.1` by default. If exposed publicly, it must sit behind HTTPS, authentication, request limits, file validation, and backups.

## Caching

Static assets may be cached by the browser or hosting provider. Replace content or stylesheet versions when deploying breaking visual changes.
