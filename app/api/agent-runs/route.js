// Mock agent runs API
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const agent = searchParams.get("agent") || "sdr";

  const mockRuns = [
    {
      id: "1",
      agent,
      lead_id: "1",
      lead_name: "Carlos Rodriguez",
      status: "completed",
      result: "Lead scored at 85/100. Classification: Hot. Recommended action: Schedule meeting.",
      created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    },
    {
      id: "2",
      agent,
      lead_id: "2",
      lead_name: "Maria Garcia",
      status: "completed",
      result: "Lead scored at 72/100. Classification: Warm. Recommended action: Send info.",
      created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    },
    {
      id: "3",
      agent,
      lead_id: "4",
      lead_name: "Ana Lopez",
      status: "completed",
      result: "Lead scored at 45/100. Classification: Cold. Recommended action: Nurture.",
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    },
    {
      id: "4",
      agent,
      lead_name: "Batch processing",
      status: "running",
      created_at: new Date().toISOString(),
    },
  ];

  return Response.json({ ok: true, runs: mockRuns });
}
