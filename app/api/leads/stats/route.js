// Mock stats for dashboard
export async function GET() {
  const stats = {
    total: 87,
    avg_score: 62,
    by_classification: {
      hot: 18,
      warm: 32,
      cold: 25,
      unqualified: 12,
    },
    by_status: {
      new: 24,
      contacted: 28,
      qualified: 15,
      won: 12,
      lost: 8,
    },
    by_source: {
      web_form: 25,
      manychat: 18,
      instagram: 16,
      whatsapp: 12,
      linkedin: 9,
      email: 7,
    },
    recent_leads: [
      {
        id: "1",
        name: "Carlos Rodriguez",
        email: "carlos@empresa.com",
        source: "web_form",
        status: "new",
        score: 85,
        classification: "hot",
        created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      },
      {
        id: "2",
        name: "Maria Garcia",
        email: "maria@startup.io",
        source: "instagram",
        status: "contacted",
        score: 72,
        classification: "warm",
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      },
      {
        id: "3",
        name: "Juan Martinez",
        email: "juan@negocio.com",
        source: "linkedin",
        status: "qualified",
        score: 90,
        classification: "hot",
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
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
      },
      {
        id: "5",
        name: "Pedro Sanchez",
        email: "pedro@agency.com",
        source: "whatsapp",
        status: "won",
        score: 95,
        classification: "hot",
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
      },
    ],
  };

  return Response.json({ ok: true, stats });
}
