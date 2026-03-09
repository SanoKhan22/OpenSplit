"use client";

import Link from "next/link";
import useSWR from "swr";
import { apiGet } from "@/lib/api";
import type { Group } from "@/types";
import { formatCents } from "@/types";
import { logout } from "@/lib/auth";
import { Users, PlusCircle, ArrowRightLeft, LogOut } from "lucide-react";

export default function DashboardPage() {
  const { data, isLoading } = useSWR("/api/groups", (url: string) =>
    apiGet<Group[]>(url).then((r) => r.data ?? []),
  );

  return (
    <div className="min-h-screen">
      {/* Nav */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-brand-teal to-brand-purple" />
          <span className="font-bold text-lg">OpenSplit</span>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 min-h-[48px] min-w-[48px] justify-center text-zinc-400 hover:text-zinc-100 transition"
        >
          <LogOut size={18} />
        </button>
      </header>

      <main className="max-w-lg mx-auto px-6 py-8">
        {/* Quick actions */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <Link
            href="/groups"
            className="flex flex-col items-center gap-2 min-h-[80px] justify-center rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-600 transition"
          >
            <Users size={22} className="text-brand-teal" />
            <span className="text-xs text-zinc-400">Groups</span>
          </Link>
          <Link
            href="/expenses"
            className="flex flex-col items-center gap-2 min-h-[80px] justify-center rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-600 transition"
          >
            <PlusCircle size={22} className="text-brand-purple" />
            <span className="text-xs text-zinc-400">Add expense</span>
          </Link>
          <Link
            href="/settlements"
            className="flex flex-col items-center gap-2 min-h-[80px] justify-center rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-600 transition"
          >
            <ArrowRightLeft size={22} className="text-brand-teal" />
            <span className="text-xs text-zinc-400">Settle up</span>
          </Link>
        </div>

        {/* Groups list */}
        <h2 className="text-lg font-semibold mb-4">Your groups</h2>
        {isLoading && (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 rounded-xl bg-zinc-900 animate-pulse" />
            ))}
          </div>
        )}
        {!isLoading && (!data || data.length === 0) && (
          <div className="text-center py-12 text-zinc-500">
            <p className="mb-4">No groups yet.</p>
            <Link
              href="/groups"
              className="inline-flex min-h-[48px] items-center gap-2 px-5 rounded-xl bg-brand-purple text-white text-sm font-semibold hover:opacity-90"
            >
              <PlusCircle size={16} /> Create a group
            </Link>
          </div>
        )}
        {data && data.length > 0 && (
          <ul className="space-y-3">
            {data.map((group) => (
              <li key={group.id}>
                <Link
                  href={`/groups/${group.id}`}
                  className="flex items-center justify-between min-h-[64px] px-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-600 transition"
                >
                  <div>
                    <p className="font-medium">{group.name}</p>
                    <p className="text-xs text-zinc-500">{group.currency}</p>
                  </div>
                  <span className="text-zinc-500 text-sm">→</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
