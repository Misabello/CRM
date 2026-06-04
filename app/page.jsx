import { Sidebar } from "@/components/sidebar";
import { DashboardContent } from "@/components/dashboard-content";

export default function HomePage() {
  console.log("[v0] New CRM Dashboard rendering");
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Sidebar />
      <main className="ml-64 p-6">
        <DashboardContent />
      </main>
    </div>
  );
}
