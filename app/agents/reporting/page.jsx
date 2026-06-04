import { Sidebar } from "@/components/sidebar";
import { AgentContent } from "@/components/agent-content";

export default function ReportingAgentPage() {
  return (
    <div className="min-h-screen bg-gray-950">
      <Sidebar />
      <main className="ml-64 p-6">
        <AgentContent agentType="reporting" />
      </main>
    </div>
  );
}
