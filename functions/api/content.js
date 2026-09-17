import { isAuthorized, unauthorized } from "../_lib/auth.js";

const key = "site-content";

async function getDefaultContent(context) {
  const assetUrl = new URL("/assets/content.json", context.request.url);
  const response = context.env.ASSETS
    ? await context.env.ASSETS.fetch(assetUrl)
    : await fetch(assetUrl);

  if (!response.ok) {
    throw new Error("默认内容不可用");
  }

  return response.json();
}

export async function onRequestGet(context) {
  const stored = context.env.SITE_CONTENT
    ? await context.env.SITE_CONTENT.get(key, "json")
    : null;
  const content = stored || (await getDefaultContent(context));

  return Response.json(content, {
    headers: {
      "Cache-Control": "no-store",
    },
  });
}

export async function onRequestPost(context) {
  if (!isAuthorized(context.request, context.env)) {
    return unauthorized();
  }

  if (!context.env.SITE_CONTENT) {
    return Response.json({ error: "尚未绑定 SITE_CONTENT KV" }, { status: 503 });
  }

  const content = await context.request.json();
  if (!content || typeof content !== "object" || !Array.isArray(content.articles)) {
    return Response.json({ error: "内容格式不正确" }, { status: 400 });
  }

  await context.env.SITE_CONTENT.put(key, JSON.stringify(content));
  return Response.json({ ok: true });
}
