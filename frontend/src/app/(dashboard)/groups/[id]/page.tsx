"use client";

import useSWR from "swr";
import Link from "next/link";
import { Copy, Check, Users, UserPlus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { apiGet, apiPost } from "@/lib/api";
import type { Group, Expense } from "@/types";
import { formatCents } from "@/types";

const joinSchema = z.object({
  invite_code: z.string().min(8, "Enter 8-character code").max(8),
});
type JoinFormValues = z.infer<typeof joinSchema>;

interface GroupMemberWithUser {
  id: string;
  group_id: string;
  user_id: string;
  is_admin: boolean;
  nickname: string | null;
  user_display_name: string | null;
  user_email: string | null;
}

export default function GroupDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [copied, setCopied] = useState(false);
  const [showJoinForm, setShowJoinForm] = useState(false);

  const { data: group, isLoading: loadingGroup } = useSWR(
    `/api/groups/${id}`,
    (url: string) => apiGet<Group>(url).then(r => r.data),
  );

  const { data: members } = useSWR(
    `/api/groups/${id}/members`,
    (url: string) => apiGet<GroupMemberWithUser[]>(url).then(r => r.data ?? []),
  );

  const { data: expenses, isLoading: loadingExpenses } = useSWR(
    `/api/expenses/group/${id}`,
    (url: string) => apiGet<Expense[]>(url).then(r => r.data ?? []),
  );

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } =
    useForm<JoinFormValues>({ resolver: zodResolver(joinSchema) });

  const total = expenses?.reduce((sum, e) => sum + e.amount_cents, 0) ?? 0;

  function copyInviteCode() {
    if (!group?.invite_code) return;
    navigator.clipboard.writeText(group.invite_code);
    setCopied(true);
    toast.success("Invite code copied!");
    setTimeout(() => setCopied(false), 2000);
  }

  async function onSubmitJoin(values: JoinFormValues) {
    const res = await apiPost<Group>("/api/groups/join", values);
    if (res.error) { toast.error(res.error); return; }
    toast.success("Joined group!");
    reset();
    setShowJoinForm(false);
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <div className="flex-1">
          {loadingGroup ? (
            <div className="h-6 w-40 rounded bg-zinc-800 animate-pulse" />
          ) : (
            <h1 className="text-2xl font-bold">{group?.name}</h1>
          )}
          {group?.description && <p className="text-sm text-zinc-500">{group.description}</p>}
        </div>
        <button
          onClick={() => setShowJoinForm(!showJoinForm)}
          className="flex items-center gap-2 min-h-[48px] px-4 rounded-xl bg-zinc-800 text-white text-sm font-semibold hover:bg-zinc-700"
        >
          <UserPlus size={16} /> Join
        </button>
      </div>

      {/* Join Group Form */}
      {showJoinForm && (
        <form onSubmit={handleSubmit(onSubmitJoin)} className="mb-8 p-5 rounded-xl border border-zinc-700 bg-zinc-900 flex flex-col gap-4">
          <h2 className="font-semibold">Join another group</h2>
          <div>
            <input 
              {...register("invite_code")} 
              placeholder="Enter 8-character code" 
              maxLength={8}
              className="w-full min-h-[48px] rounded-xl border border-zinc-700 bg-zinc-800 px-4 text-sm font-mono uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-brand-yellow" 
            />
            {errors.invite_code && <p className="mt-1 text-xs text-red-400">{errors.invite_code.message}</p>}
          </div>
          <button type="submit" disabled={isSubmitting} className="min-h-[48px] rounded-xl bg-brand-yellow font-semibold text-black hover:opacity-90 disabled:opacity-50">
            {isSubmitting ? "Joining…" : "Join group"}
          </button>
        </form>
      )}

      {/* Members & Invite Code */}
      <div className="mb-6 p-5 rounded-xl bg-zinc-900 border border-zinc-800">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Users size={18} className="text-zinc-400" />
            <h3 className="font-semibold">Members ({members?.length ?? 0})</h3>
          </div>
        </div>
        
        {/* Member list */}
        <div className="space-y-2 mb-4">
          {members?.map(m => (
            <div key={m.id} className="flex items-center gap-3 py-2">
              <div className="h-8 w-8 rounded-full bg-brand-yellow flex items-center justify-center text-black font-semibold text-sm">
                {(m.user_display_name || m.user_email || 'U')[0].toUpperCase()}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">
                  {m.user_display_name || m.user_email || `User ${m.user_id.slice(0, 8)}`}
                </p>
              </div>
              {m.is_admin && (
                <span className="text-xs px-2 py-1 rounded bg-brand-purple text-white">Admin</span>
              )}
            </div>
          ))}
        </div>

        {/* Invite code */}
        <div className="pt-3 border-t border-zinc-800">
          <p className="text-xs text-zinc-500 mb-2">Invite friends with this code:</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 px-4 py-3 rounded-lg bg-zinc-800 font-mono text-lg tracking-wider text-center text-brand-yellow">
              {group?.invite_code || '--------'}
            </div>
            <button
              onClick={copyInviteCode}
              className="min-h-[48px] min-w-[48px] flex items-center justify-center rounded-lg bg-zinc-800 hover:bg-zinc-700 transition"
            >
              {copied ? <Check size={18} className="text-green-400" /> : <Copy size={18} />}
            </button>
          </div>
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
