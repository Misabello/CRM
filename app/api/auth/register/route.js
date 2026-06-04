export async function POST(request) {
  const body = await request.json();
  
  if (!body.email || !body.password) {
    return Response.json(
      { ok: false, error: "Email and password are required" },
      { status: 400 }
    );
  }
  
  return Response.json({
    ok: true,
    user: {
      id: String(Date.now()),
      name: body.name,
      email: body.email,
      role: "admin",
      created_at: new Date().toISOString(),
    },
  });
}
