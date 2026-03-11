"use client";

import useSWR from "swr";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { apiGet, apiPost } from "@/lib/api";
import type { Group } from "@/types";
import Link from "next/link";
import { PlusCircle, UserPlus } from "lucide-react";

const createSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  currency: z.string().length(3, "3-letter currency code"),
});
type CreateFormValues = z.infer<typeof createSchema>;

const joinSchema = z.object({
  invite_code: z.string().min(8, "Enter 8-character code").max(8),
});
type JoinFormValues = z.infer<typeof joinSchema>;

export default function GroupsPage() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showJoinForm, setShowJoinForm] = useState(false);
  const { data, isLoading, mutate } = useSWR("/api/groups", (url: string) =>
    apiGet<Group[]>(url).then((r) => r.data ?? []),
  );

  const { register: registerCreate, handleSubmit: handleSubmitCreate, reset: resetCreate, formState: { errors: errorsCreate, isSubmitting: isSubmittingCreate } } =
    useForm<CreateFormValues>({ resolver: zodResolver(createSchema), defaultValues: { currency: "USD" } });

  const { register: registerJoin, handleSubmit: handleSubmitJoin, reset: resetJoin, formState: { errors: errorsJoin, isSubmitting: isSubmittingJoin } } =
    useForm<JoinFormValues>({ resolver: zodResolver(joinSchema) });

  async function onSubmitCreate(values: CreateFormValues) {
    const res = await apiPost<Group>("/api/groups", values);
    if (res.error) { toast.error(res.error); return; }
    toast.success("Group created!");
    resetCreate();
    setShowCreateForm(false);
    mutate();
  }

  async function onSubmitJoin(values: JoinFormValues) {
    const res = await apiPost<Group>("/api/groups/join", values);
    if (res.error) { toast.error(res.error); return; }
    toast.success("Joined group!");
    resetJoin();
    setShowJoinForm(false);
    mutate();
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <h1 className="text-2xl font-bold">Groups</h1>
        <div className="ml-auto flex gap-2">
          <button
            onClick={() => { setShowJoinForm(!showJoinForm); setShowCreateForm(false); }}
            className="flex items-center gap-2 min-h-[48px] px-4 rounded-xl bg-zinc-800 text-white text-sm font-semibold hover:bg-zinc-700"
          >
            <UserPlus size={16} /> Join
          </button>
          <button
            onClick={() => { setShowCreateForm(!showCreateForm); setShowJoinForm(false); }}
            className="flex items-center gap-2 min-h-[48px] px-4 rounded-xl bg-brand-purple text-white text-sm font-semibold hover:opacity-90"
          >
            <PlusCircle size={16} /> Create
          </button>
        </div>
      </div>

      {showJoinForm && (
        <form onSubmit={handleSubmitJoin(onSubmitJoin)} className="mb-8 p-5 rounded-xl border border-zinc-700 bg-zinc-900 flex flex-col gap-4">
          <h2 className="font-semibold">Join group with code</h2>
          <div>
            <input 
              {...registerJoin("invite_code")} 
              placeholder="Enter 8-character code" 
              maxLength={8}
              className="w-full min-h-[48px] rounded-xl border border-zinc-700 bg-zinc-800 px-4 text-sm font-mono uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-brand-yellow" 
            />
            {errorsJoin.invite_code && <p className="mt-1 text-xs text-red-400">{errorsJoin.invite_code.message}</p>}
          </div>
          <button type="submit" disabled={isSubmittingJoin} className="min-h-[48px] rounded-xl bg-brand-yellow font-semibold text-black hover:opacity-90 disabled:opacity-50">
            {isSubmittingJoin ? "Joining…" : "Join group"}
          </button>
        </form>
      )}

      {showCreateForm && (
        <form onSubmit={handleSubmitCreate(onSubmitCreate)} className="mb-8 p-5 rounded-xl border border-zinc-700 bg-zinc-900 flex flex-col gap-4">
          <h2 className="font-semibold">Create group</h2>
          <div>
            <input {...registerCreate("name")} placeholder="Group name" className="w-full min-h-[48px] rounded-xl border border-zinc-700 bg-zinc-800 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal" />
            {errorsCreate.name && <p className="mt-1 text-xs text-red-400">{errorsCreate.name.message}</p>}
          </div>
          <input {...registerCreate("description")} placeholder="Description (optional)" className="w-full min-h-[48px] rounded-xl border border-zinc-700 bg-zinc-800 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal" />
          <div>
            <input {...registerCreate("currency")} placeholder="Currency (USD)" className="w-full min-h-[48px] rounded-xl border border-zinc-700 bg-zinc-800 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal" />
            {errorsCreate.currency && <p className="mt-1 text-xs text-red-400">{errorsCreate.currency.message}</p>}
          </div>
          <button type="submit" disabled={isSubmittingCreate} className="min-h-[48px] rounded-xl bg-brand-purple font-semibold text-white hover:opacity-90 disabled:opacity-50">
            {isSubmittingCreate ? "Creating…" : "Create group"}
          </button>
        </form>
      )}

      {isLoading && <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="h-16 rounded-xl bg-zinc-900 animate-pulse" />)}</div>}
      {!isLoading && data && (
        <ul className="space-y-3">
          {data.map((group) => (
            <li key={group.id}>
              <Link href={`/groups/${group.id}`} className="flex items-center justify-between min-h-[64px] px-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-600 transition">
                <div>
                  <p className="font-medium">{group.name}</p>
                  <p className="text-xs text-zinc-500">{group.currency}{group.description ? ` · ${group.description}` : ""}</p>
                </div>
                <span className="text-zinc-500">→</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
