import { Sidebar } from "@/components/sidebar";
import { DashboardContent } from "@/components/dashboard-content";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-950">
      <Sidebar />
      <main className="ml-64 p-6">
        <DashboardContent />
      </main>
    </div>
  );
}
