"use client";

import useSWR from "swr";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { apiGet } from "@/lib/api";
import type { Group, Expense } from "@/types";
import { formatCents } from "@/types";

export default function GroupDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;

  const { data: group, isLoading: loadingGroup } = useSWR(
    `/api/groups/${id}`,
    (url: string) => apiGet<Group>(url).then(r => r.data),
  );

  const { data: expenses, isLoading: loadingExpenses } = useSWR(
    `/api/expenses/group/${id}`,
    (url: string) => apiGet<Expense[]>(url).then(r => r.data ?? []),
  );

  const total = expenses?.reduce((sum, e) => sum + e.amount_cents, 0) ?? 0;

  return (
    <div className="min-h-screen max-w-lg mx-auto px-6 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/groups" className="min-h-[48px] min-w-[48px] flex items-center justify-center text-zinc-400 hover:text-white">
          <ArrowLeft size={20} />
        </Link>
        <div>
          {loadingGroup ? (
            <div className="h-6 w-40 rounded bg-zinc-800 animate-pulse" />
          ) : (
            <h1 className="text-2xl font-bold">{group?.name}</h1>
          )}
          {group?.description && <p className="text-sm text-zinc-500">{group.description}</p>}
        </div>
      </div>

      {/* Summary card */}
      <div className="mb-8 p-5 rounded-xl bg-zinc-900 border border-zinc-800">
        <p className="text-sm text-zinc-500 mb-1">Total expenses</p>
        <p className="text-3xl font-bold text-brand-teal">
          {group ? formatCents(total, group.currency) : "—"}
        </p>
        <div className="flex gap-3 mt-4">
          <Link href={`/expenses`} className="flex-1 min-h-[48px] flex items-center justify-center rounded-xl bg-zinc-800 text-sm font-medium hover:bg-zinc-700 transition">
            Add expense
          </Link>
          <Link href={`/settlements`} className="flex-1 min-h-[48px] flex items-center justify-center rounded-xl bg-brand-purple text-white text-sm font-medium hover:opacity-90 transition">
            Settle up
          </Link>
        </div>
      </div>

      <h2 className="text-lg font-semibold mb-4">Expenses</h2>

      {(loadingExpenses) && <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="h-16 rounded-xl bg-zinc-900 animate-pulse" />)}</div>}

      {expenses && expenses.length === 0 && (
        <p className="text-center text-zinc-500 py-8">No expenses yet.</p>
      )}

      {expenses && expenses.length > 0 && (
        <ul className="space-y-3">
          {expenses.map(exp => (
            <li key={exp.id} className="flex items-center justify-between min-h-[64px] px-4 rounded-xl bg-zinc-900 border border-zinc-800">
              <div>
                <p className="font-medium">{exp.title}</p>
                <p className="text-xs text-zinc-500">
                  {exp.category ?? "Uncategorized"} · {new Date(exp.created_at).toLocaleDateString()}
                </p>
              </div>
              <p className="font-semibold text-brand-teal">{formatCents(exp.amount_cents, exp.currency)}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
