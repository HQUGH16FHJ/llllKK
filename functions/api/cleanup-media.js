import { isAuthorized, unauthorized } from "../_lib/auth.js";

const protectionWindowMs = 30 * 60 * 1000;

function normalizeMediaKey(value) {
  if (typeof value !== "string" || !value.includes("/media/")) {
    return null;
  }

  try {
    const url = new URL(value, "https://media.local");
    const match = /^\/media\/(.+)$/.exec(url.pathname);
    if (!match) {
      return null;
    }

    const objectKey = decodeURIComponent(match[1]).replace(/^\/+|\/+$/g, "");
    if (!objectKey || objectKey.split("/").includes("..")) {
      return null;
    }

    return objectKey;
  } catch {
    return null;
  }
}

function collectReferencedMedia(value, result) {
  if (typeof value === "string") {
    const objectKey = normalizeMediaKey(value);
    if (objectKey) {
      result.add(objectKey);
    }
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item) => collectReferencedMedia(item, result));
    return;
  }

  if (value && typeof value === "object") {
    Object.values(value).forEach((item) =>
      collectReferencedMedia(item, result),
    );
  }
}

async function listKvMediaKeys(kv) {
  const items = [];
  let cursor;

  do {
    const page = await kv.list({ prefix: "media:", cursor });
    items.push(
      ...page.keys.map((item) => ({
        key: item.name.slice("media:".length),
        uploadedAt: Number(item.metadata?.createdAt) || 0,
      })),
    );
    cursor = page.list_complete ? undefined : page.cursor;
  } while (cursor);

  return items;
}

async function listR2MediaKeys(bucket) {
  const items = [];
  let cursor;

  do {
    const page = await bucket.list({ cursor });
    items.push(
      ...page.objects.map((item) => ({
        key: item.key,
        uploadedAt:
          Number(item.customMetadata?.createdAt) ||
          item.uploaded?.getTime?.() ||
          0,
      })),
    );
    cursor = page.truncated ? page.cursor : undefined;
  } while (cursor);

  return items;
}

export async function onRequestPost(context) {
  if (!isAuthorized(context.request, context.env)) {
    return unauthorized();
  }

  if (!context.env.MEDIA && !context.env.SITE_CONTENT) {
    return Response.json({ error: "尚未配置媒体存储" }, { status: 503 });
  }

  try {
    const body = await context.request.json().catch(() => ({}));
    const content = await context.env.SITE_CONTENT?.get("site-content", "json");
    if (!content) {
      return Response.json({ error: "站点内容尚未保存" }, { status: 400 });
    }

    const referenced = new Set();
    collectReferencedMedia(content, referenced);

    const allItems = context.env.MEDIA
      ? await listR2MediaKeys(context.env.MEDIA)
      : await listKvMediaKeys(context.env.SITE_CONTENT);
    const now = Date.now();
    const unusedItems = allItems.filter(
      (item) => !referenced.has(item.key),
    );
    const deletableItems = unusedItems.filter(
      (item) =>
        !item.uploadedAt || now - item.uploadedAt >= protectionWindowMs,
    );
    const deferred = unusedItems.length - deletableItems.length;
    const unusedKeys = deletableItems.map((item) => item.key);

    if (!body.dryRun && context.env.MEDIA) {
      for (let index = 0; index < unusedKeys.length; index += 100) {
        await context.env.MEDIA.delete(unusedKeys.slice(index, index + 100));
      }
    } else if (!body.dryRun) {
      for (const objectKey of unusedKeys) {
        await context.env.SITE_CONTENT.delete(`media:${objectKey}`);
      }
    }

    return Response.json({
      ok: true,
      storage: context.env.MEDIA ? "r2" : "kv",
      dryRun: Boolean(body.dryRun),
      deleted: body.dryRun ? 0 : unusedKeys.length,
      unusedCount: unusedKeys.length,
      kept: allItems.length - unusedItems.length,
      deferred,
      preview: unusedKeys.slice(0, 20).map((key) => `/media/${key}`),
    });
  } catch (error) {
    return Response.json(
      { error: error.message || "清理失败" },
      { status: 400 },
    );
  }
}
