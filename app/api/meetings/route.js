export async function POST(request) {
  const body = await request.json();
  
  const newMeeting = {
    id: String(Date.now()),
    ...body,
    status: "scheduled",
    meet_url: "https://meet.google.com/demo-" + Math.random().toString(36).substring(7),
    calendar_link: "https://meet.google.com/demo-" + Math.random().toString(36).substring(7),
  };
  
  return Response.json({ ok: true, meeting: newMeeting });
}
