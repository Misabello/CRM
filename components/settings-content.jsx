"use client";

import { useState } from "react";
import { Card, Badge, Button, Input } from "@/components/ui";
import { cn } from "@/lib/utils";
import {
  User,
  Settings as SettingsIcon,
  Database,
  Bot,
  MessageCircle,
  Calendar,
  FileSpreadsheet,
  BarChart3,
  CheckCircle,
  XCircle,
} from "lucide-react";

export function SettingsContent() {
  const [user] = useState({
    name: "Admin User",
    email: "admin@dana.marketing",
    role: "admin",
  });

  const integrations = [
    {
      name: "Google Calendar",
      icon: Calendar,
      active: true,
      note: "Calendar sync enabled",
    },
    {
      name: "Google Sheets",
      icon: FileSpreadsheet,
      active: false,
      note: "Configure GOOGLE_SHEETS_SA_KEY",
    },
    {
      name: "Anthropic Claude",
      icon: Bot,
      active: true,
      note: "AI agents active",
    },
    {
      name: "ManyChat",
      icon: MessageCircle,
      active: true,
      note: "WhatsApp / Instagram channel",
    },
    {
      name: "Meta Ads",
      icon: BarChart3,
      active: false,
      note: "Configure META_ADS_ACCESS_TOKEN",
    },
    {
      name: "Supabase",
      icon: Database,
      active: true,
      note: "Database connected",
    },
  ];

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <SettingsIcon className="w-6 h-6 text-violet-400" />
          Settings
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          User management and system configuration
        </p>
      </div>

      {/* User Card */}
      <Card>
        <h2 className="text-sm font-semibold text-white mb-4">Current User</h2>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-violet-600 flex items-center justify-center text-xl font-bold text-white">
            {(user.name || user.email || "A")[0].toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-white text-lg">{user.name || "—"}</p>
            <p className="text-gray-400 text-sm">{user.email || "—"}</p>
            <Badge variant="violet" className="mt-1">
              {user.role || "admin"}
            </Badge>
          </div>
        </div>
      </Card>

      {/* Create User */}
      <CreateUserCard />

      {/* Integrations */}
      <Card>
        <h2 className="text-sm font-semibold text-white mb-4">
          Integration Status
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {integrations.map((integration) => (
            <IntegrationItem key={integration.name} {...integration} />
          ))}
        </div>
      </Card>
    </div>
  );
}

function IntegrationItem({ name, icon: Icon, active, note }) {
  return (
    <div
      className={cn(
        "flex items-center justify-between p-3 rounded-lg border transition-colors",
        active
          ? "bg-gray-800/40 border-gray-700"
          : "bg-gray-900 border-gray-800"
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "w-9 h-9 rounded-lg flex items-center justify-center",
            active ? "bg-violet-600/20" : "bg-gray-800"
          )}
        >
          <Icon
            className={cn(
              "w-4 h-4",
              active ? "text-violet-400" : "text-gray-500"
            )}
          />
        </div>
        <div>
          <p
            className={cn(
              "text-sm font-medium",
              active ? "text-white" : "text-gray-400"
            )}
          >
            {name}
          </p>
          <p className="text-xs text-gray-500">{note}</p>
        </div>
      </div>
      {active ? (
        <CheckCircle className="w-4 h-4 text-green-400" />
      ) : (
        <XCircle className="w-4 h-4 text-gray-600" />
      )}
    </div>
  );
}

function CreateUserCard() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setMessage({ type: "error", text: "Email and password are required" });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (data.ok) {
        setMessage({ type: "success", text: "User created successfully" });
        setForm({ name: "", email: "", password: "" });
      } else {
        setMessage({ type: "error", text: data.error || "Failed to create user" });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Failed to create user" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <h2 className="text-sm font-semibold text-white mb-4">
        Create New Admin User
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs text-gray-400 mb-1.5 block">Name</label>
          <Input
            placeholder="Full name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div>
          <label className="text-xs text-gray-400 mb-1.5 block">Email</label>
          <Input
            type="email"
            placeholder="email@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
        <div>
          <label className="text-xs text-gray-400 mb-1.5 block">Password</label>
          <Input
            type="password"
            placeholder="Minimum 8 characters"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>

        {message.text && (
          <p
            className={cn(
              "text-sm",
              message.type === "error" ? "text-red-400" : "text-green-400"
            )}
          >
            {message.text}
          </p>
        )}

        <Button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create User"}
        </Button>
      </form>
    </Card>
  );
}
