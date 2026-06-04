"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";
import {
  Card,
  Badge,
  ScoreBar,
  Button,
  Select,
  Skeleton,
} from "@/components/ui";
import {
  cn,
  formatDate,
  sourceLabels,
  statusLabels,
  classificationColors,
  statusColors,
} from "@/lib/utils";
import { X, Download, RefreshCw, ExternalLink } from "lucide-react";

const fetcher = (url) => fetch(url).then((res) => res.json());

export function LeadsContent({ sourceFilter }) {
  const [filters, setFilters] = useState({
    classification: "",
    status: "",
    source: sourceFilter || "",
  });
  const [selectedLead, setSelectedLead] = useState(null);

  const queryParams = new URLSearchParams({ limit: "100" });
  if (filters.classification) queryParams.set("classification", filters.classification);
  if (filters.status) queryParams.set("status", filters.status);
  if (filters.source) queryParams.set("source", filters.source);

  const { data, error, isLoading, mutate } = useSWR(
    `/api/leads?${queryParams}`,
    fetcher,
    { refreshInterval: 30000 }
  );

  useEffect(() => {
    if (sourceFilter !== filters.source) {
      setFilters((prev) => ({ ...prev, source: sourceFilter || "" }));
    }
  }, [sourceFilter]);

  const title = sourceFilter
    ? sourceLabels[sourceFilter] || sourceFilter
    : "All Leads";

  const leads = data?.leads || [];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">{title}</h1>
          <p className="text-gray-500 text-sm mt-1">
            {isLoading ? "Loading..." : `${leads.length} leads`}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm">
            <Download className="w-4 h-4" />
            Export to Sheets
          </Button>
          <Button variant="secondary" size="sm" onClick={() => mutate()}>
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <Select
          className="w-48"
          value={filters.classification}
          onChange={(e) =>
            setFilters({ ...filters, classification: e.target.value })
          }
        >
          <option value="">All classifications</option>
          <option value="hot">Hot</option>
          <option value="warm">Warm</option>
          <option value="cold">Cold</option>
          <option value="unqualified">Unqualified</option>
        </Select>
        <Select
          className="w-48"
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="">All statuses</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="qualified">Qualified</option>
          <option value="won">Won</option>
          <option value="lost">Lost</option>
        </Select>
        {!sourceFilter && (
          <Select
            className="w-48"
            value={filters.source}
            onChange={(e) => setFilters({ ...filters, source: e.target.value })}
          >
            <option value="">All sources</option>
            <option value="web_form">Web Form</option>
            <option value="manychat">ManyChat</option>
            <option value="instagram">Instagram</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="linkedin">LinkedIn</option>
            <option value="email">Email</option>
          </Select>
        )}
      </div>

      {/* Table */}
      <Card className="overflow-hidden p-0">
        {isLoading ? (
          <div className="p-6 space-y-3">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-12" />
            ))}
          </div>
        ) : leads.length === 0 ? (
          <div className="flex items-center justify-center h-48 text-gray-500">
            No leads found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800 text-gray-400 text-xs uppercase tracking-wider">
                  <th className="text-left px-4 py-3 font-medium">Lead</th>
                  <th className="text-left px-4 py-3 font-medium">Source</th>
                  <th className="text-left px-4 py-3 font-medium">Score</th>
                  <th className="text-left px-4 py-3 font-medium">
                    Classification
                  </th>
                  <th className="text-left px-4 py-3 font-medium">Status</th>
                  <th className="text-left px-4 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr
                    key={lead.id}
                    onClick={() => setSelectedLead(lead)}
                    className="border-t border-gray-800/60 hover:bg-gray-800/40 transition cursor-pointer"
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium text-white">
                        {lead.name || (
                          <span className="text-gray-500">Unnamed</span>
                        )}
                      </p>
                      <p className="text-gray-500 text-xs">
                        {lead.email || lead.contact || ""}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs">
                      {sourceLabels[lead.source] || lead.source}
                    </td>
                    <td className="px-4 py-3">
                      <ScoreBar score={lead.score} />
                    </td>
                    <td className="px-4 py-3">
                      {lead.classification ? (
                        <Badge variant={lead.classification}>
                          {lead.classification}
                        </Badge>
                      ) : (
                        <span className="text-gray-600 text-xs">Pending</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={
                          lead.status === "won"
                            ? "green"
                            : lead.status === "qualified"
                            ? "emerald"
                            : lead.status === "contacted"
                            ? "sky"
                            : lead.status === "new"
                            ? "violet"
                            : "default"
                        }
                      >
                        {statusLabels[lead.status] || lead.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {formatDate(lead.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Lead Detail Modal */}
      {selectedLead && (
        <LeadDetailModal
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onUpdate={mutate}
        />
      )}
    </div>
  );
}

function LeadDetailModal({ lead, onClose, onUpdate }) {
  const [status, setStatus] = useState(lead.status);
  const [updating, setUpdating] = useState(false);

  const handleStatusChange = async (newStatus) => {
    setUpdating(true);
    try {
      await fetch(`/api/leads/${lead.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      setStatus(newStatus);
      onUpdate();
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setUpdating(false);
    }
  };

  const actionLabels = {
    schedule_meeting: "Schedule meeting",
    send_info: "Send info",
    nurture: "Nurture",
    discard: "Discard",
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div
        className="bg-gray-900 border border-gray-800 rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-800">
          <div>
            <h2 className="text-lg font-semibold text-white">
              {lead.name || "Unnamed Lead"}
            </h2>
            <p className="text-sm text-gray-500">
              {sourceLabels[lead.source] || lead.source}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500 text-xs mb-1">Email</p>
              <p className="text-white">{lead.email || "—"}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs mb-1">Contact</p>
              <p className="text-white">{lead.contact || "—"}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs mb-1">Score</p>
              <ScoreBar score={lead.score} />
            </div>
            <div>
              <p className="text-gray-500 text-xs mb-1">Classification</p>
              {lead.classification ? (
                <Badge variant={lead.classification}>
                  {lead.classification}
                </Badge>
              ) : (
                <span className="text-gray-500 text-xs">Pending</span>
              )}
            </div>
            <div>
              <p className="text-gray-500 text-xs mb-1">Next Action</p>
              <p className="text-white text-xs">
                {actionLabels[lead.next_action] || "—"}
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-xs mb-1">Created</p>
              <p className="text-white text-xs">{formatDate(lead.created_at)}</p>
            </div>
          </div>

          {/* Message */}
          {lead.message && (
            <div className="bg-gray-800/40 rounded-lg p-4 border border-gray-700/50">
              <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">
                Conversation
              </p>
              <p className="text-gray-200 text-sm whitespace-pre-wrap">
                {lead.message}
              </p>
            </div>
          )}

          {/* SDR Notes */}
          {lead.sdr_notes && (
            <div className="bg-gray-800/60 rounded-lg p-4">
              <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">
                SDR Agent Analysis
              </p>
              <p className="text-gray-300 text-sm whitespace-pre-wrap">
                {lead.sdr_notes}
              </p>
            </div>
          )}

          {/* Status Change */}
          <div className="pt-2">
            <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">
              Update Status
            </p>
            <div className="flex gap-2 flex-wrap">
              {["new", "contacted", "qualified", "won", "lost"].map((s) => (
                <button
                  key={s}
                  onClick={() => handleStatusChange(s)}
                  disabled={updating || status === s}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border",
                    status === s
                      ? "bg-violet-600 text-white border-violet-500"
                      : "bg-gray-800 text-gray-400 border-gray-700 hover:bg-gray-700 hover:text-white"
                  )}
                >
                  {statusLabels[s]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
