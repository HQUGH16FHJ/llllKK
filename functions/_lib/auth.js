export function isAuthorized(request, env) {
  const expected = env.ADMIN_TOKEN;
  if (!expected) {
    return false;
  }

  return request.headers.get("Authorization") === `Bearer ${expected}`;
}

export function unauthorized() {
  return Response.json({ error: "管理密钥不正确或尚未配置 ADMIN_TOKEN" }, { status: 401 });
}
