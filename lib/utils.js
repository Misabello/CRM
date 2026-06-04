import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatDate(ts) {
  if (!ts) return "—";
  return new Date(ts).toLocaleString("es-AR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export const sourceLabels = {
  web_form: "Web Form",
  manychat: "ManyChat",
  instagram: "Instagram",
  whatsapp: "WhatsApp",
  linkedin: "LinkedIn",
  email: "Email",
  database_import: "Import",
};

export const statusLabels = {
  new: "New",
  contacted: "Contacted",
  qualified: "Qualified",
  won: "Won",
  lost: "Lost",
};

export const classificationColors = {
  hot: "bg-red-500/10 text-red-400 border-red-500/20",
  warm: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  cold: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  unqualified: "bg-gray-500/10 text-gray-400 border-gray-500/20",
};

export const statusColors = {
  new: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  contacted: "bg-sky-500/10 text-sky-400 border-sky-500/20",
  qualified: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  won: "bg-green-500/10 text-green-400 border-green-500/20",
  lost: "bg-gray-500/10 text-gray-400 border-gray-500/20",
};
