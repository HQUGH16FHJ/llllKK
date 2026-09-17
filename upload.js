import { isAuthorized, unauthorized } from "../_lib/auth.js";

const maxBytes = 12 * 1024 * 1024;
const allowedTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "audio/mpeg",
  "audio/mp4",
  "video/mp4",
  "video/webm",
]);

function decodeDataUrl(dataUrl) {
  const match = /^data:([^;,]+);base64,(.+)$/s.exec(dataUrl || "");
  if (!match) {
    throw new Error("上传内容格式不正确");
  }

  const binary = atob(match[2]);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return { mimeType: match[1], bytes };
}

function sanitizeFilename(filename) {
  return String(filename || "upload")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(-80);
}

function bytesToBase64(bytes) {
  const chunkSize = 0x8000;
  let binary = "";

  for (let index = 0; index < bytes.length; index += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(index, index + chunkSize));
  }

  return btoa(binary);
}

export async function onRequestPost(context) {
  if (!isAuthorized(context.request, context.env)) {
    return unauthorized();
  }

  if (!context.env.MEDIA && !context.env.SITE_CONTENT) {
    return Response.json({ error: "请至少绑定 SITE_CONTENT KV" }, { status: 503 });
  }

  try {
    const body = await context.request.json();
    const { mimeType, bytes } = decodeDataUrl(body.dataUrl);

    if (!allowedTypes.has(mimeType)) {
      return Response.json({ error: "不支持这种文件格式" }, { status: 400 });
    }

    if (bytes.byteLength > maxBytes) {
      return Response.json({ error: "文件超过 12MB 限制" }, { status: 400 });
    }

    const folder = body.kind === "photo" ? "photos" : "media";
    const objectKey = `${folder}/${Date.now()}-${sanitizeFilename(body.filename)}`;

    if (context.env.MEDIA) {
      await context.env.MEDIA.put(objectKey, bytes, {
        httpMetadata: {
          contentType: mimeType,
          cacheControl: "public, max-age=31536000, immutable",
        },
      });
    } else {
      await context.env.SITE_CONTENT.put(`media:${objectKey}`, bytesToBase64(bytes), {
        metadata: {
          contentType: mimeType,
        },
      });
    }

    return Response.json({ path: `/media/${objectKey}` });
  } catch (error) {
    return Response.json({ error: error.message || "上传失败" }, { status: 400 });
  }
}
