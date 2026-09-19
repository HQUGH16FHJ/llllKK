# Release Process

## Version Format

```text
YYYY.MM.DD
```

Content-focused releases may use a date. Application releases may use semantic versions.

## Checklist

1. Back up `assets/content.json` and `assets/content.js`.
2. Verify new media loads correctly.
3. Check desktop, tablet, and mobile.
4. Confirm administrator authentication.
5. Confirm upload limits and file types.
6. Check article reader and photo lightbox.
7. Verify music controls.
8. Update `CHANGELOG.md`.
9. Tag and publish the release.

## Rollback

Keep the previous content files and static release until the new version has been checked in production.
