const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname);
const port = Number(process.argv[2] || 4175);
const contentPath = path.join(root, "assets", "content.json");
const contentScriptPath = path.join(root, "assets", "content.js");
const maxBodySize = 18 * 1024 * 1024;
const maxFileBytes = 12 * 1024 * 1024;
const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".mp3": "audio/mpeg",
  ".mp4": "video/mp4",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

function sendJson(response, status, payload) {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  response.end(JSON.stringify(payload));
}

function readJsonBody(request) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;

    request.on("data", (chunk) => {
      size += chunk.length;
      if (size > maxBodySize) {
        reject(new Error("请求内容超过 18MB 限制"));
        request.destroy();
        return;
      }
      chunks.push(chunk);
    });

    request.on("end", () => {
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString("utf8")));
      } catch {
        reject(new Error("请求内容不是有效的 JSON"));
      }
    });

    request.on("error", reject);
  });
}

function isAuthorized(request) {
  const expected = process.env.ADMIN_TOKEN;
  if (!expected) {
    return true;
  }

  return request.headers.authorization === `Bearer ${expected}`;
}

function writeContentFiles(content) {
  const json = `${JSON.stringify(content, null, 2)}\n`;
  const script = `window.SITE_CONTENT = ${JSON.stringify(content, null, 2)};\n`;
  fs.writeFileSync(contentPath, json, "utf8");
  fs.writeFileSync(contentScriptPath, script, "utf8");
}

function decodeDataUrl(dataUrl) {
  const match = /^data:([^;,]+);base64,(.+)$/s.exec(dataUrl || "");
  if (!match) {
    throw new Error("上传内容格式不正确");
  }

  return {
    mimeType: match[1],
    buffer: Buffer.from(match[2], "base64"),
  };
}

function sanitizeFilename(filename) {
  const extension = path.extname(filename || "").toLowerCase();
  const base = path
    .basename(filename || "upload", extension)
    .replace(/[^a-zA-Z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);

  return `${base || "upload"}-${Date.now()}${extension || ".jpg"}`;
}

async function handleApi(request, response, requestUrl) {
  if (requestUrl.pathname === "/api/status" && request.method === "GET") {
    sendJson(response, 200, { mode: "local" });
    return true;
  }

  if (requestUrl.pathname === "/api/content" && request.method === "GET") {
    const content = JSON.parse(fs.readFileSync(contentPath, "utf8"));
    sendJson(response, 200, content);
    return true;
  }

  if (requestUrl.pathname === "/api/content" && request.method === "POST") {
    if (!isAuthorized(request)) {
      sendJson(response, 401, { error: "管理密钥不正确" });
      return true;
    }

    try {
      const content = await readJsonBody(request);
      if (!content || typeof content !== "object" || !Array.isArray(content.articles)) {
        sendJson(response, 400, { error: "内容格式不正确" });
        return true;
      }

      writeContentFiles(content);
      sendJson(response, 200, { ok: true });
    } catch (error) {
      sendJson(response, 400, { error: error.message });
    }
    return true;
  }

  if (requestUrl.pathname === "/api/upload" && request.method === "POST") {
    if (!isAuthorized(request)) {
      sendJson(response, 401, { error: "管理密钥不正确" });
      return true;
    }

    try {
      const body = await readJsonBody(request);
      const target = String(body.target || "");
      if (!target.startsWith("./assets/") || target.includes("..")) {
        sendJson(response, 400, { error: "上传路径不正确" });
        return true;
      }

      const { buffer } = decodeDataUrl(body.dataUrl);
      if (buffer.length > maxFileBytes) {
        sendJson(response, 400, { error: "文件超过 12MB 限制" });
        return true;
      }

      const relativeTarget = target.replace(/^\.\//, "");
      const absoluteTarget = path.resolve(root, relativeTarget);
      if (!absoluteTarget.startsWith(path.join(root, "assets"))) {
        sendJson(response, 400, { error: "上传路径不正确" });
        return true;
      }

      fs.mkdirSync(path.dirname(absoluteTarget), { recursive: true });
      fs.writeFileSync(absoluteTarget, buffer);
      sendJson(response, 200, { path: target });
    } catch (error) {
      sendJson(response, 400, { error: error.message });
    }
    return true;
  }

  return false;
}

const server = http.createServer(async (request, response) => {
  const requestUrl = new URL(request.url, `http://${request.headers.host}`);

  if (requestUrl.pathname.startsWith("/api/")) {
    const handled = await handleApi(request, response, requestUrl);
    if (handled) {
      return;
    }
  }

  const relativePath = decodeURIComponent(requestUrl.pathname).replace(/^\/+/, "");
  const requestedFile = path.resolve(root, relativePath || "index.html");

  if (!requestedFile.startsWith(root)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  fs.stat(requestedFile, (statError, stats) => {
    if (statError || !stats.isFile()) {
      response.writeHead(404);
      response.end("Not found");
      return;
    }

    const extension = path.extname(requestedFile).toLowerCase();
    response.writeHead(200, {
      "Content-Type": mimeTypes[extension] || "application/octet-stream",
      "Cache-Control": "no-store",
    });
    fs.createReadStream(requestedFile).pipe(response);
  });
});

server.listen(port, "127.0.0.1", () => {
  process.stdout.write(`Personal site manager: http://127.0.0.1:${port}/admin.html\n`);
});
