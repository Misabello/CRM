import { Sidebar } from "@/components/sidebar";
import { SettingsContent } from "@/components/settings-content";

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gray-950">
      <Sidebar />
      <main className="ml-64 p-6">
        <SettingsContent />
      </main>
    </div>
  );
}
