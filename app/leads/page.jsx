"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Sidebar } from "@/components/sidebar";
import { LeadsContent } from "@/components/leads-content";
import { Skeleton } from "@/components/ui";

function LeadsPageContent() {
  const searchParams = useSearchParams();
  const sourceFilter = searchParams.get("source");

  return <LeadsContent sourceFilter={sourceFilter} />;
}

export default function LeadsPage() {
  return (
    <div className="min-h-screen bg-gray-950">
      <Sidebar />
      <main className="ml-64 p-6">
        <Suspense fallback={<div className="space-y-4">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12" />)}</div>}>
          <LeadsPageContent />
        </Suspense>
      </main>
    </div>
  );
}
