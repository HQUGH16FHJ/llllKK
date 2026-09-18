export async function onRequestGet(context) {
  const objectKey = context.params.path.join("/");
  const rangeHeader = context.request.headers.get("Range");

  if (context.env.MEDIA) {
    const object = rangeHeader
      ? await context.env.MEDIA.get(objectKey, {
          range: context.request.headers,
        })
      : await context.env.MEDIA.get(objectKey);
    if (object) {
      const headers = new Headers();
      object.writeHttpMetadata(headers);
      headers.set("ETag", object.httpEtag);
      headers.set("Cache-Control", "public, max-age=31536000, immutable");
      headers.set("Accept-Ranges", "bytes");

      if (rangeHeader && object.range) {
        const { offset = 0, length = 0 } = object.range;
        headers.set("Content-Range", `bytes ${offset}-${offset + length - 1}/${object.size}`);
        headers.set("Content-Length", String(length));
        return new Response(object.body, { status: 206, headers });
      }

      headers.set("Content-Length", String(object.size));
      return new Response(object.body, { headers });
    }
  }

  if (context.env.SITE_CONTENT) {
    const stored = await context.env.SITE_CONTENT.getWithMetadata(`media:${objectKey}`, "text");
    if (stored.value) {
      const binary = atob(stored.value);
      const bytes = new Uint8Array(binary.length);
      for (let index = 0; index < binary.length; index += 1) {
        bytes[index] = binary.charCodeAt(index);
      }

      const headers = new Headers({
        "Content-Type": stored.metadata?.contentType || "application/octet-stream",
        "Cache-Control": "public, max-age=31536000, immutable",
        "Accept-Ranges": "bytes",
      });

      if (rangeHeader) {
        const match = /^bytes=(\d*)-(\d*)$/.exec(rangeHeader);
        if (match) {
          const start = match[1] ? Number(match[1]) : 0;
          const end = match[2]
            ? Math.min(Number(match[2]), bytes.length - 1)
            : bytes.length - 1;

          if (start <= end && start < bytes.length) {
            const chunk = bytes.slice(start, end + 1);
            headers.set("Content-Range", `bytes ${start}-${end}/${bytes.length}`);
            headers.set("Content-Length", String(chunk.length));
            return new Response(chunk, { status: 206, headers });
          }
        }
      }

      headers.set("Content-Length", String(bytes.length));
      return new Response(bytes, { headers });
    }
  }

  return new Response("Not found", { status: 404 });
}
