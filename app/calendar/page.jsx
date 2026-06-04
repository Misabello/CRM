import { Sidebar } from "@/components/sidebar";
import { CalendarContent } from "@/components/calendar-content";

export default function CalendarPage() {
  return (
    <div className="min-h-screen bg-gray-950">
      <Sidebar />
      <main className="ml-64 p-6">
        <CalendarContent />
      </main>
    </div>
  );
}
