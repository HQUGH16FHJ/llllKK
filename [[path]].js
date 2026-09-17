export async function onRequestGet(context) {
  const objectKey = context.params.path.join("/");

  if (context.env.MEDIA) {
    const object = await context.env.MEDIA.get(objectKey);
    if (object) {
      const headers = new Headers();
      object.writeHttpMetadata(headers);
      headers.set("ETag", object.httpEtag);
      headers.set("Cache-Control", "public, max-age=31536000, immutable");
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
      });
      return new Response(bytes, { headers });
    }
  }

  return new Response("Not found", { status: 404 });
}
