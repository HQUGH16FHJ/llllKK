import { isAuthorized, unauthorized } from "../_lib/auth.js";

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
  const keys = [];
  let cursor;

  do {
    const page = await kv.list({ prefix: "media:", cursor });
    keys.push(...page.keys.map((item) => item.name.slice("media:".length)));
    cursor = page.list_complete ? undefined : page.cursor;
  } while (cursor);

  return keys;
}

async function listR2MediaKeys(bucket) {
  const keys = [];
  let cursor;

  do {
    const page = await bucket.list({ cursor });
    keys.push(...page.objects.map((item) => item.key));
    cursor = page.truncated ? page.cursor : undefined;
  } while (cursor);

  return keys;
}

export async function onRequestPost(context) {
  if (!isAuthorized(context.request, context.env)) {
    return unauthorized();
  }

  if (!context.env.MEDIA && !context.env.SITE_CONTENT) {
    return Response.json({ error: "尚未配置媒体存储" }, { status: 503 });
  }

  try {
    const content = await context.env.SITE_CONTENT?.get("site-content", "json");
    if (!content) {
      return Response.json({ error: "站点内容尚未保存" }, { status: 400 });
    }

    const referenced = new Set();
    collectReferencedMedia(content, referenced);

    const allKeys = context.env.MEDIA
      ? await listR2MediaKeys(context.env.MEDIA)
      : await listKvMediaKeys(context.env.SITE_CONTENT);
    const unusedKeys = allKeys.filter((objectKey) => !referenced.has(objectKey));

    if (context.env.MEDIA) {
      for (let index = 0; index < unusedKeys.length; index += 100) {
        await context.env.MEDIA.delete(unusedKeys.slice(index, index + 100));
      }
    } else {
      for (const objectKey of unusedKeys) {
        await context.env.SITE_CONTENT.delete(`media:${objectKey}`);
      }
    }

    return Response.json({
      ok: true,
      storage: context.env.MEDIA ? "r2" : "kv",
      deleted: unusedKeys.length,
      kept: allKeys.length - unusedKeys.length,
    });
  } catch (error) {
    return Response.json(
      { error: error.message || "清理失败" },
      { status: 400 },
    );
  }
}
