// Mock meetings API
const mockMeetings = [
  {
    id: "1",
    lead_id: "1",
    leads: { name: "Carlos Rodriguez", email: "carlos@empresa.com" },
    scheduled_at: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
    type: "discovery",
    status: "scheduled",
    notes: "Initial discovery call to understand needs",
    calendar_link: "https://meet.google.com/abc-defg-hij",
  },
  {
    id: "2",
    lead_id: "3",
    leads: { name: "Juan Martinez", email: "juan@negocio.com" },
    scheduled_at: new Date(Date.now() + 1000 * 60 * 60 * 48).toISOString(),
    type: "closing",
    status: "scheduled",
    notes: "Final proposal presentation",
    calendar_link: "https://meet.google.com/xyz-uvwx-rst",
  },
  {
    id: "3",
    lead_id: "5",
    leads: { name: "Pedro Sanchez", email: "pedro@agency.com" },
    scheduled_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    type: "onboarding",
    status: "completed",
    notes: "Onboarding session completed successfully",
  },
];

export async function GET() {
  return Response.json({ ok: true, meetings: mockMeetings });
}

export async function POST(request) {
  const body = await request.json();
  const newMeeting = {
    id: String(Date.now()),
    ...body,
    status: "scheduled",
    meet_url: "https://meet.google.com/new-meet-link",
  };
  return Response.json({ ok: true, meeting: newMeeting });
}
