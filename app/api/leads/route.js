// Mock data for dashboard demo
const mockLeads = [
  {
    id: "1",
    name: "Carlos Rodriguez",
    email: "carlos@empresa.com",
    contact: "+54 11 4567-8901",
    source: "web_form",
    status: "new",
    score: 85,
    classification: "hot",
    next_action: "schedule_meeting",
    sdr_notes: "High-value prospect, actively looking for marketing services.",
    message: "We need help with our digital marketing strategy.",
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: "2",
    name: "Maria Garcia",
    email: "maria@startup.io",
    contact: "+54 11 2345-6789",
    source: "instagram",
    status: "contacted",
    score: 72,
    classification: "warm",
    next_action: "send_info",
    sdr_notes: "Interested in social media management.",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: "3",
    name: "Juan Martinez",
    email: "juan@negocio.com",
    contact: "+54 11 9876-5432",
    source: "linkedin",
    status: "qualified",
    score: 90,
    classification: "hot",
    next_action: "schedule_meeting",
    sdr_notes: "CEO of growing e-commerce business, urgent needs.",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: "4",
    name: "Ana Lopez",
    email: "ana@tienda.com",
    source: "manychat",
    status: "new",
    score: 45,
    classification: "cold",
    next_action: "nurture",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
  {
    id: "5",
    name: "Pedro Sanchez",
    email: "pedro@agency.com",
    contact: "+54 11 1234-5678",
    source: "whatsapp",
    status: "won",
    score: 95,
    classification: "hot",
    sdr_notes: "Closed deal for full-service marketing package.",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
  },
  {
    id: "6",
    name: "Laura Fernandez",
    email: "laura@retail.com",
    source: "email",
    status: "contacted",
    score: 55,
    classification: "warm",
    next_action: "send_info",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
  },
  {
    id: "7",
    name: "Diego Morales",
    email: "diego@tech.io",
    source: "web_form",
    status: "lost",
    score: 30,
    classification: "cold",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(),
  },
  {
    id: "8",
    name: "Sofia Torres",
    email: "sofia@brand.com",
    contact: "+54 11 8765-4321",
    source: "instagram",
    status: "qualified",
    score: 78,
    classification: "warm",
    next_action: "schedule_meeting",
    sdr_notes: "Brand manager looking for content strategy.",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 144).toISOString(),
  },
];

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const classification = searchParams.get("classification");
  const status = searchParams.get("status");
  const source = searchParams.get("source");

  let filteredLeads = [...mockLeads];

  if (classification) {
    filteredLeads = filteredLeads.filter((l) => l.classification === classification);
  }
  if (status) {
    filteredLeads = filteredLeads.filter((l) => l.status === status);
  }
  if (source) {
    filteredLeads = filteredLeads.filter((l) => l.source === source);
  }

  return Response.json({ ok: true, leads: filteredLeads });
}
