export async function PATCH(request, { params }) {
  const { id } = await params;
  const body = await request.json();
  
  return Response.json({
    ok: true,
    meeting: {
      id,
      ...body,
      updated_at: new Date().toISOString(),
    },
  });
}
