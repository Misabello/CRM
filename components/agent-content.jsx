"use client";

import { useState } from "react";
import useSWR from "swr";
import { Card, Badge, Button, Skeleton } from "@/components/ui";
import { cn, formatDate } from "@/lib/utils";
import { Target, Search, FileText, BarChart3, PieChart, Play, Clock, CheckCircle, XCircle, Loader2 } from "lucide-react";

const fetcher = (url) => fetch(url).then((res) => res.json());

const agentConfig = {
  sdr: {
    name: "SDR Agent",
    icon: Target,
    description: "Automatically qualifies leads with AI-powered scoring and analysis.",
    color: "violet",
  },
  analyst: {
    name: "Analyst Agent",
    icon: Search,
    description: "Generates marketing diagnostics for qualified leads.",
    color: "sky",
  },
  proposals: {
    name: "Proposals Agent",
    icon: FileText,
    description: "Creates personalized commercial proposals.",
    color: "emerald",
  },
  performance: {
    name: "Performance Agent",
    icon: BarChart3,
    description: "Analyzes Meta Ads and Google Ads metrics.",
    color: "amber",
  },
  reporting: {
    name: "Reporting Agent",
    icon: PieChart,
    description: "Generates monthly client reports.",
    color: "rose",
  },
};

export function AgentContent({ agentType }) {
  const agent = agentConfig[agentType] || agentConfig.sdr;
  const { data, error, isLoading, mutate } = useSWR(
    `/api/agent-runs?agent=${agentType}`,
    fetcher,
    { refreshInterval: 10000 }
  );

  const [running, setRunning] = useState(false);

  const handleRunAgent = async () => {
    setRunning(true);
    try {
      await fetch(`/api/agents/${agentType}/run`, { method: "POST" });
      mutate();
    } catch (err) {
      console.error("Failed to run agent:", err);
    } finally {
      setRunning(false);
    }
  };

  const runs = data?.runs || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div
            className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center",
              `bg-${agent.color}-600/20`
            )}
            style={{ backgroundColor: `rgba(var(--${agent.color}-600), 0.2)` }}
          >
            <agent.icon
              className={cn("w-6 h-6", `text-${agent.color}-400`)}
              style={{ color: `var(--${agent.color}-400, #a78bfa)` }}
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{agent.name}</h1>
            <p className="text-gray-500 text-sm mt-1">{agent.description}</p>
          </div>
        </div>
        <Button onClick={handleRunAgent} disabled={running}>
          {running ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Running...
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              Run Agent
            </>
          )}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          label="Total Runs"
          value={runs.length}
          icon={Clock}
          isLoading={isLoading}
        />
        <StatCard
          label="Successful"
          value={runs.filter((r) => r.status === "completed").length}
          icon={CheckCircle}
          variant="green"
          isLoading={isLoading}
        />
        <StatCard
          label="Failed"
          value={runs.filter((r) => r.status === "error").length}
          icon={XCircle}
          variant="red"
          isLoading={isLoading}
        />
        <StatCard
          label="Processing"
          value={runs.filter((r) => r.status === "running").length}
          icon={Loader2}
          variant="amber"
          isLoading={isLoading}
        />
      </div>

      {/* Recent Runs */}
      <Card>
        <h2 className="text-sm font-semibold text-white mb-4">Recent Runs</h2>
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12" />
            ))}
          </div>
        ) : runs.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No runs yet. Click &quot;Run Agent&quot; to start.
          </div>
        ) : (
          <div className="space-y-2">
            {runs.slice(0, 10).map((run) => (
              <RunItem key={run.id} run={run} />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, variant, isLoading }) {
  const variants = {
    green: "text-green-400",
    red: "text-red-400",
    amber: "text-amber-400",
  };

  return (
    <Card className="py-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-gray-500 text-xs uppercase tracking-wider">{label}</p>
        <Icon
          className={cn("w-4 h-4", variants[variant] || "text-gray-500")}
        />
      </div>
      {isLoading ? (
        <Skeleton className="h-8 w-12" />
      ) : (
        <p
          className={cn(
            "text-2xl font-bold",
            variants[variant] || "text-white"
          )}
        >
          {value}
        </p>
      )}
    </Card>
  );
}

function RunItem({ run }) {
  const statusConfig = {
    completed: { color: "green", icon: CheckCircle, label: "Completed" },
    error: { color: "hot", icon: XCircle, label: "Error" },
    running: { color: "amber", icon: Loader2, label: "Running" },
  };

  const status = statusConfig[run.status] || statusConfig.running;

  return (
    <div className="flex items-center justify-between py-3 px-4 bg-gray-800/30 rounded-lg border border-gray-800/50">
      <div className="flex items-center gap-3">
        <status.icon
          className={cn(
            "w-4 h-4",
            run.status === "running" && "animate-spin",
            status.color === "green"
              ? "text-green-400"
              : status.color === "hot"
              ? "text-red-400"
              : "text-amber-400"
          )}
        />
        <div>
          <p className="text-sm text-white font-medium">
            {run.lead_name || run.lead_id || "Batch run"}
          </p>
          <p className="text-xs text-gray-500">{formatDate(run.created_at)}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {run.result && (
          <span className="text-xs text-gray-400 max-w-xs truncate">
            {typeof run.result === "string"
              ? run.result.substring(0, 100)
              : "Result available"}
          </span>
        )}
        <Badge variant={status.color}>{status.label}</Badge>
      </div>
    </div>
  );
}
