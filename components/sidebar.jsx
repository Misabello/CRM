"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Globe,
  MessageCircle,
  Camera,
  Smartphone,
  Briefcase,
  Mail,
  Bot,
  Target,
  Search,
  FileText,
  BarChart3,
  PieChart,
  Calendar,
  Settings,
  ChevronDown,
  ChevronRight,
  Sparkles,
} from "lucide-react";

const channelItems = [
  { href: "/leads", label: "All Leads", icon: Users },
  { href: "/leads?source=web_form", label: "Web Form", icon: Globe },
  { href: "/leads?source=manychat", label: "ManyChat", icon: MessageCircle },
  { href: "/leads?source=instagram", label: "Instagram", icon: Camera },
  { href: "/leads?source=whatsapp", label: "WhatsApp", icon: Smartphone },
  { href: "/leads?source=linkedin", label: "LinkedIn", icon: Briefcase },
  { href: "/leads?source=email", label: "Email", icon: Mail },
];

const agentItems = [
  { href: "/agents/sdr", label: "SDR", icon: Target },
  { href: "/agents/analyst", label: "Analyst", icon: Search },
  { href: "/agents/proposals", label: "Proposals", icon: FileText },
  { href: "/agents/performance", label: "Performance", icon: BarChart3 },
  { href: "/agents/reporting", label: "Reporting", icon: PieChart },
];

export function Sidebar() {
  const pathname = usePathname();
  const [leadsOpen, setLeadsOpen] = useState(true);
  const [agentsOpen, setAgentsOpen] = useState(true);

  const isActive = (href) => {
    if (href === "/leads") {
      return pathname === "/leads" && !window?.location?.search;
    }
    if (href.includes("?")) {
      const [path, query] = href.split("?");
      return pathname === path && window?.location?.search?.includes(query.split("=")[1]);
    }
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-gray-900 border-r border-gray-800 flex flex-col z-50">
      {/* Logo Header */}
      <div className="h-14 flex items-center px-5 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-white tracking-tight">CRM Dana</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        {/* Dashboard */}
        <Link
          href="/"
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors mb-1",
            pathname === "/"
              ? "bg-violet-600 text-white"
              : "text-gray-400 hover:text-white hover:bg-gray-800"
          )}
        >
          <LayoutDashboard className="w-4 h-4" />
          Dashboard
        </Link>

        {/* Leads by Channel */}
        <div className="mt-4">
          <button
            onClick={() => setLeadsOpen(!leadsOpen)}
            className="flex items-center justify-between w-full px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-400 transition-colors"
          >
            <span>Leads by Channel</span>
            {leadsOpen ? (
              <ChevronDown className="w-3 h-3" />
            ) : (
              <ChevronRight className="w-3 h-3" />
            )}
          </button>
          {leadsOpen && (
            <div className="mt-1 space-y-0.5">
              {channelItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                    isActive(item.href)
                      ? "bg-violet-600/10 text-violet-400 border border-violet-600/20"
                      : "text-gray-400 hover:text-white hover:bg-gray-800"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* AI Agents */}
        <div className="mt-4">
          <button
            onClick={() => setAgentsOpen(!agentsOpen)}
            className="flex items-center justify-between w-full px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-400 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Bot className="w-3 h-3" />
              AI Agents
            </span>
            {agentsOpen ? (
              <ChevronDown className="w-3 h-3" />
            ) : (
              <ChevronRight className="w-3 h-3" />
            )}
          </button>
          {agentsOpen && (
            <div className="mt-1 space-y-0.5">
              {agentItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                    isActive(item.href)
                      ? "bg-violet-600/10 text-violet-400 border border-violet-600/20"
                      : "text-gray-400 hover:text-white hover:bg-gray-800"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-gray-800 space-y-0.5">
        <Link
          href="/calendar"
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
            pathname === "/calendar"
              ? "bg-violet-600/10 text-violet-400"
              : "text-gray-400 hover:text-white hover:bg-gray-800"
          )}
        >
          <Calendar className="w-4 h-4" />
          Calendar
        </Link>
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
            pathname === "/settings"
              ? "bg-violet-600/10 text-violet-400"
              : "text-gray-400 hover:text-white hover:bg-gray-800"
          )}
        >
          <Settings className="w-4 h-4" />
          Settings
        </Link>
      </div>
    </aside>
  );
}
