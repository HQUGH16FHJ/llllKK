# Deployment

## Local Development

```bash
node server.cjs
```

Default URLs:

```text
Homepage: http://127.0.0.1:4175/index.html
Admin: http://127.0.0.1:4175/admin.html
```

Custom port:

```bash
node server.cjs 8080
```

## GitHub Pages

Because `index.html`, `styles.css`, and `app.js` are static, the frontend can be deployed to GitHub Pages. Local content editing and file uploads require `server.cjs` or a suitably configured hosting platform.

## Cloudflare

The repository includes Cloudflare Functions under `functions/`. Ensure KV bindings, secrets, and upload limits are configured before public deployment.

## Administrator Token

```powershell
$env:ADMIN_TOKEN="your-secure-token"
node server.cjs
```

Never commit the real token.

## Production Checklist

- [ ] HTTPS enabled
- [ ] Administrator token configured
- [ ] Upload validation enabled
- [ ] Content and media backups configured
- [ ] Mobile layout verified
- [ ] Personal media permissions reviewed
- [ ] License and ownership preserved
