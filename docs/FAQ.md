# FAQ

## How do I edit the website?

Run `node server.cjs` and open `/admin.html` on the local server.

## Where is content stored?

Content is stored in `assets/content.json` and generated into `assets/content.js`.

## Where are uploads stored?

When using the local server, uploaded media is stored under `assets`.

## Why does the admin require a token?

Set `ADMIN_TOKEN` before running the server. This prevents unauthorized content changes when the service is exposed.

## Can I use the images or writing?

No. Personal writing, photographs, video, and brand content are protected by the Bantan Proprietary License. Do not redistribute them without permission.

## Can the website run on GitHub Pages?

The static frontend can run on GitHub Pages. Content editing and uploads require the local server or a configured Functions environment.
