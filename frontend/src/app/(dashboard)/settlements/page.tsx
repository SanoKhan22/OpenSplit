"use client";

import useSWR from "swr";
import { useState } from "react";
import { ArrowRightLeft } from "lucide-react";
import { apiGet, apiPost } from "@/lib/api";
import type { Group, BalanceTransfer } from "@/types";
import { formatCents } from "@/types";
import { toast } from "sonner";

export default function SettlementsPage() {
  const { data: groups } = useSWR("/api/groups", (url: string) => apiGet<Group[]>(url).then(r => r.data ?? []));
  const [selectedGroup, setSelectedGroup] = useState<string>("");

  const { data: balances, isLoading, mutate } = useSWR(
    selectedGroup ? `/api/settlements/group/${selectedGroup}/balances` : null,
    (url: string) => apiGet<BalanceTransfer[]>(url).then(r => r.data ?? []),
  );

  const selectedGroupObj = groups?.find(g => g.id === selectedGroup);

  async function handleSettle(transfer: BalanceTransfer) {
    if (!selectedGroup) return;
    const res = await apiPost("/api/settlements", {
      group_id: selectedGroup,
      to_user_id: transfer.to_user_id,
      amount_cents: transfer.amount_cents,
      currency: selectedGroupObj?.currency ?? "USD",
    });
    if (res.error) { toast.error(res.error); return; }
    toast.success("Settlement recorded!");
    mutate();
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <h1 className="text-2xl font-bold">Settle up</h1>
      </div>

      <select
        value={selectedGroup}
        onChange={(e) => setSelectedGroup(e.target.value)}
        className="w-full min-h-[48px] mb-8 rounded-xl border border-zinc-700 bg-zinc-900 px-4 text-sm focus:outline-none"
      >
        <option value="">Select a group…</option>
        {groups?.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
      </select>

      {isLoading && <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-20 rounded-xl bg-zinc-900 animate-pulse" />)}</div>}

      {balances && balances.length === 0 && (
        <div className="text-center py-12">
          <ArrowRightLeft size={40} className="mx-auto mb-4 text-brand-teal opacity-60" />
          <p className="text-zinc-400">All settled up! 🎉</p>
        </div>
      )}

      {balances && balances.length > 0 && (
        <div className="space-y-4">
          <p className="text-sm text-zinc-500">{balances.length} transfer{balances.length !== 1 ? "s" : ""} needed</p>
          {balances.map((t, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-zinc-900 border border-zinc-800">
              <div className="flex-1 min-w-0">
                <p className="text-xs text-zinc-500 truncate">From: {t.from_user_id.slice(0, 8)}…</p>
                <p className="text-xs text-zinc-500 truncate">To: {t.to_user_id.slice(0, 8)}…</p>
                <p className="font-semibold text-brand-teal mt-1">
                  {formatCents(t.amount_cents, selectedGroupObj?.currency ?? "USD")}
                </p>
              </div>
              <button
                onClick={() => handleSettle(t)}
                className="ml-4 min-h-[48px] px-4 rounded-xl bg-brand-teal text-zinc-900 font-semibold text-sm hover:opacity-90"
              >
                Mark paid
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
