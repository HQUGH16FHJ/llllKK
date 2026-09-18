import { isAuthorized, unauthorized } from "../_lib/auth.js";

function normalizeMediaKey(value) {
  if (typeof value !== "string" || !value.trim()) {
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

export async function onRequestPost(context) {
  if (!isAuthorized(context.request, context.env)) {
    return unauthorized();
  }

  if (!context.env.MEDIA && !context.env.SITE_CONTENT) {
    return Response.json({ error: "尚未配置媒体存储" }, { status: 503 });
  }

  try {
    const body = await context.request.json();
    const rawPaths = Array.isArray(body.paths) ? body.paths : [body.path];
    const objectKeys = [
      ...new Set(rawPaths.map(normalizeMediaKey).filter(Boolean)),
    ];

    if (!objectKeys.length) {
      return Response.json({ error: "没有可删除的媒体文件" }, { status: 400 });
    }

    if (context.env.MEDIA) {
      await context.env.MEDIA.delete(objectKeys);
    } else {
      await Promise.all(
        objectKeys.map((objectKey) =>
          context.env.SITE_CONTENT.delete(`media:${objectKey}`),
        ),
      );
    }

    return Response.json({ ok: true, deleted: objectKeys.length });
  } catch (error) {
    return Response.json(
      { error: error.message || "媒体删除失败" },
      { status: 400 },
    );
  }
}
