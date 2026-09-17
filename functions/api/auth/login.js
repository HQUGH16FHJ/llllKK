// POST /api/auth/login - 验证管理员密码
export async function onRequestPost(context) {
  try {
    const { ADMIN_PASSWORD } = context.env;
    const { password } = await context.request.json();

    if (password === ADMIN_PASSWORD) {
      return new Response(
        JSON.stringify({ success: true, message: '验证通过' }),
        { headers: { 'Content-Type': 'application/json' } }
      );
    } else {
      return new Response(
        JSON.stringify({ success: false, error: '密码错误' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
