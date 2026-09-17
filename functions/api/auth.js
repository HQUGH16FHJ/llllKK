import { isAuthorized, unauthorized } from "../_lib/auth.js";

export async function onRequestPost(context) {
  if (!isAuthorized(context.request, context.env)) {
    return unauthorized();
  }

  return Response.json({ ok: true });
}
