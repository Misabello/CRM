"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";
import { Card, Badge, ScoreBar, Skeleton } from "@/components/ui";
import { cn, formatDate, sourceLabels, classificationColors } from "@/lib/utils";
import {
  Users,
  Flame,
  Sun,
  Snowflake,
  Trophy,
  TrendingUp,
} from "lucide-react";

const fetcher = (url) => fetch(url).then((res) => res.json());

export function DashboardContent() {
  const { data, error, isLoading } = useSWR("/api/leads/stats", fetcher, {
    refreshInterval: 30000,
  });

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-400">Failed to load dashboard data</p>
      </div>
    );
  }

  const stats = data?.stats;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">
          Overview of all channels and leads
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <KPICard
          label="Total Leads"
          value={stats?.total}
          subtext={`Avg score: ${stats?.avg_score || 0}`}
          icon={Users}
          isLoading={isLoading}
        />
        <KPICard
          label="Hot"
          value={stats?.by_classification?.hot}
          icon={Flame}
          variant="hot"
          isLoading={isLoading}
        />
        <KPICard
          label="Warm"
          value={stats?.by_classification?.warm}
          icon={Sun}
          variant="warm"
          isLoading={isLoading}
        />
        <KPICard
          label="Cold"
          value={stats?.by_classification?.cold}
          icon={Snowflake}
          variant="cold"
          isLoading={isLoading}
        />
        <KPICard
          label="Won"
          value={stats?.by_status?.won}
          icon={Trophy}
          variant="green"
          isLoading={isLoading}
        />
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Leads by Channel */}
        <Card>
          <h2 className="text-sm font-semibold text-white mb-4">
            Leads by Channel
          </h2>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-6" />
              ))}
            </div>
          ) : (
            <ChannelChart data={stats?.by_source} total={stats?.total} />
          )}
        </Card>

        {/* Pipeline */}
        <Card>
          <h2 className="text-sm font-semibold text-white mb-4">Pipeline</h2>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-6" />
              ))}
            </div>
          ) : (
            <PipelineChart data={stats?.by_status} total={stats?.total} />
          )}
        </Card>

        {/* Recent Leads */}
        <Card>
          <h2 className="text-sm font-semibold text-white mb-4">
            Recent Leads
          </h2>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12" />
              ))}
            </div>
          ) : (
            <RecentLeads leads={stats?.recent_leads} />
          )}
        </Card>
      </div>
    </div>
  );
}

function KPICard({ label, value, subtext, icon: Icon, variant, isLoading }) {
  const variants = {
    hot: "border-red-900/40",
    warm: "border-amber-900/40",
    cold: "border-blue-900/40",
    green: "border-green-900/40",
  };

  const textColors = {
    hot: "text-red-400",
    warm: "text-amber-400",
    cold: "text-blue-400",
    green: "text-green-400",
  };

  return (
    <Card className={cn(variants[variant])}>
      <div className="flex items-start justify-between">
        <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">
          {label}
        </p>
        {Icon && (
          <Icon
            className={cn("w-4 h-4", textColors[variant] || "text-gray-500")}
          />
        )}
      </div>
      {isLoading ? (
        <Skeleton className="h-9 w-16" />
      ) : (
        <p
          className={cn(
            "text-3xl font-bold",
            textColors[variant] || "text-white"
          )}
        >
          {value ?? 0}
        </p>
      )}
      {subtext && <p className="text-gray-500 text-xs mt-1">{subtext}</p>}
    </Card>
  );
}

function ChannelChart({ data, total }) {
  if (!data || Object.keys(data).length === 0) {
    return <p className="text-gray-500 text-sm">No data available</p>;
  }

  const sorted = Object.entries(data).sort((a, b) => b[1] - a[1]);

  return (
    <div className="space-y-3">
      {sorted.map(([source, count]) => {
        const pct = total ? Math.round((count / total) * 100) : 0;
        return (
          <div key={source} className="flex items-center gap-3">
            <span className="text-gray-400 text-sm w-24 shrink-0 truncate">
              {sourceLabels[source] || source}
            </span>
            <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="bg-violet-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-gray-300 text-sm font-mono w-8 text-right">
              {count}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function PipelineChart({ data, total }) {
  const stages = [
    { key: "new", label: "New", color: "bg-violet-500" },
    { key: "contacted", label: "Contacted", color: "bg-sky-500" },
    { key: "qualified", label: "Qualified", color: "bg-emerald-500" },
    { key: "won", label: "Won", color: "bg-green-500" },
    { key: "lost", label: "Lost", color: "bg-gray-600" },
  ];

  return (
    <div className="space-y-4">
      {stages.map((stage) => {
        const count = data?.[stage.key] || 0;
        const pct = total ? Math.round((count / total) * 100) : 0;
        return (
          <div key={stage.key}>
            <div className="flex justify-between text-xs text-gray-400 mb-1.5">
              <span>{stage.label}</span>
              <span>{count}</span>
            </div>
            <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
              <div
                className={cn(
                  stage.color,
                  "h-full rounded-full transition-all duration-500"
                )}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function RecentLeads({ leads }) {
  if (!leads || leads.length === 0) {
    return <p className="text-gray-500 text-sm">No recent leads</p>;
  }

  return (
    <div className="space-y-0">
      {leads.map((lead) => (
        <div
          key={lead.id}
          className="flex items-center justify-between py-2.5 border-b border-gray-800/50 last:border-0"
        >
          <div className="min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {lead.name || "Unnamed"}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {sourceLabels[lead.source] || lead.source} ·{" "}
              {formatDate(lead.created_at)}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0 ml-2">
            <ScoreBar score={lead.score} />
            {lead.classification && (
              <Badge variant={lead.classification}>
                {lead.classification}
              </Badge>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
