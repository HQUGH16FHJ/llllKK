export async function onRequestGet(context) {
  const kvBound = Boolean(context.env.SITE_CONTENT);
  const r2Bound = Boolean(context.env.MEDIA);
  return Response.json({
    mode: "cloudflare",
    kvBound,
    r2Bound,
    storageMode: r2Bound ? "r2" : kvBound ? "kv" : "none",
  });
}
