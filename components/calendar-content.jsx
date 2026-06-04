"use client";

import { useState } from "react";
import useSWR from "swr";
import {
  Card,
  Badge,
  Button,
  Input,
  Select,
  Textarea,
  Skeleton,
} from "@/components/ui";
import { cn, formatDate } from "@/lib/utils";
import { Plus, Video, X, Calendar as CalendarIcon } from "lucide-react";

const fetcher = (url) => fetch(url).then((res) => res.json());

export function CalendarContent() {
  const [showForm, setShowForm] = useState(false);
  const { data, error, isLoading, mutate } = useSWR("/api/meetings/all", fetcher, {
    refreshInterval: 30000,
  });

  const meetings = data?.meetings || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-violet-400" />
            Calendar
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Meetings and follow-ups
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4" />
          New Meeting
        </Button>
      </div>

      {/* New Meeting Form */}
      {showForm && (
        <NewMeetingForm
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false);
            mutate();
          }}
        />
      )}

      {/* Meetings Table */}
      <Card className="overflow-hidden p-0">
        {isLoading ? (
          <div className="p-6 space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12" />
            ))}
          </div>
        ) : meetings.length === 0 ? (
          <div className="flex items-center justify-center h-48 text-gray-500">
            No meetings scheduled
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800 text-gray-400 text-xs uppercase tracking-wider">
                  <th className="text-left px-4 py-3 font-medium">Lead</th>
                  <th className="text-left px-4 py-3 font-medium">Date</th>
                  <th className="text-left px-4 py-3 font-medium">Type</th>
                  <th className="text-left px-4 py-3 font-medium">Status</th>
                  <th className="text-left px-4 py-3 font-medium">Notes</th>
                  <th className="text-left px-4 py-3 font-medium">Meet</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {meetings.map((meeting) => (
                  <MeetingRow
                    key={meeting.id}
                    meeting={meeting}
                    onStatusChange={mutate}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

function NewMeetingForm({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    lead_id: "",
    scheduled_at: "",
    type: "discovery",
    duration_minutes: 30,
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.lead_id || !form.scheduled_at) {
      setError("Lead ID and date are required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/meetings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (data.ok) {
        onSuccess();
        if (data.meeting?.meet_url) {
          window.open(data.meeting.meet_url, "_blank");
        }
      } else {
        setError(data.error || "Failed to create meeting");
      }
    } catch (err) {
      setError("Failed to create meeting");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-white">New Meeting</h2>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-800 rounded transition-colors text-gray-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs text-gray-400 mb-1.5 block">Lead ID</label>
          <Input
            placeholder="UUID of the lead"
            value={form.lead_id}
            onChange={(e) => setForm({ ...form, lead_id: e.target.value })}
          />
        </div>

        <div>
          <label className="text-xs text-gray-400 mb-1.5 block">
            Date and Time
          </label>
          <Input
            type="datetime-local"
            value={form.scheduled_at}
            onChange={(e) => setForm({ ...form, scheduled_at: e.target.value })}
          />
        </div>

        <div className="flex gap-3">
          <div className="flex-1">
            <label className="text-xs text-gray-400 mb-1.5 block">Type</label>
            <Select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              <option value="discovery">Discovery</option>
              <option value="follow_up">Follow-up</option>
              <option value="closing">Closing</option>
              <option value="onboarding">Onboarding</option>
            </Select>
          </div>
          <div className="w-28">
            <label className="text-xs text-gray-400 mb-1.5 block">
              Duration (min)
            </label>
            <Input
              type="number"
              min="15"
              max="180"
              step="15"
              value={form.duration_minutes}
              onChange={(e) =>
                setForm({ ...form, duration_minutes: parseInt(e.target.value) })
              }
            />
          </div>
        </div>

        <div>
          <label className="text-xs text-gray-400 mb-1.5 block">Notes</label>
          <Textarea
            rows={2}
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            placeholder="Meeting notes..."
          />
        </div>

        <p className="text-xs text-violet-400">
          A Google Calendar event with Meet will be created automatically.
        </p>

        {error && <p className="text-xs text-red-400">{error}</p>}

        <div className="flex gap-2">
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? "Creating..." : "Create Meeting"}
          </Button>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
}

function MeetingRow({ meeting, onStatusChange }) {
  const typeLabels = {
    discovery: "Discovery",
    follow_up: "Follow-up",
    closing: "Closing",
    onboarding: "Onboarding",
  };

  const statusColors = {
    scheduled: "violet",
    completed: "green",
    no_show: "hot",
    cancelled: "default",
  };

  const handleStatusChange = async (status) => {
    if (!status) return;

    try {
      await fetch(`/api/meetings/${meeting.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      onStatusChange();
    } catch (err) {
      console.error("Failed to update meeting status:", err);
    }
  };

  return (
    <tr className="border-t border-gray-800/60 hover:bg-gray-800/40 transition">
      <td className="px-4 py-3">
        <p className="font-medium text-white">
          {meeting.leads?.name || "Unknown"}
        </p>
        <p className="text-gray-500 text-xs">
          {meeting.leads?.email || meeting.leads?.contact || ""}
        </p>
      </td>
      <td className="px-4 py-3 text-gray-300 text-sm">
        {formatDate(meeting.scheduled_at)}
      </td>
      <td className="px-4 py-3 text-gray-400 text-xs">
        {typeLabels[meeting.type] || meeting.type}
      </td>
      <td className="px-4 py-3">
        <Badge variant={statusColors[meeting.status] || "default"}>
          {meeting.status}
        </Badge>
      </td>
      <td className="px-4 py-3 text-gray-500 text-xs max-w-xs truncate">
        {meeting.notes || "—"}
      </td>
      <td className="px-4 py-3">
        {meeting.calendar_link ? (
          <a
            href={meeting.calendar_link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300 transition"
          >
            <Video className="w-3 h-3" />
            Meet
          </a>
        ) : (
          <span className="text-gray-700 text-xs">—</span>
        )}
      </td>
      <td className="px-4 py-3">
        <Select
          className="w-28 text-xs"
          value=""
          onChange={(e) => handleStatusChange(e.target.value)}
        >
          <option value="">Update...</option>
          <option value="completed">Completed</option>
          <option value="no_show">No show</option>
          <option value="cancelled">Cancelled</option>
        </Select>
      </td>
    </tr>
  );
}
