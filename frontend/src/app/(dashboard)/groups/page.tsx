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
import { PlusCircle, ArrowLeft } from "lucide-react";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  currency: z.string().length(3, "3-letter currency code"),
});
type FormValues = z.infer<typeof schema>;

export default function GroupsPage() {
  const [showForm, setShowForm] = useState(false);
  const { data, isLoading, mutate } = useSWR("/api/groups", (url: string) =>
    apiGet<Group[]>(url).then((r) => r.data ?? []),
  );

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } =
    useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { currency: "USD" } });

  async function onSubmit(values: FormValues) {
    const res = await apiPost<Group>("/api/groups", values);
    if (res.error) { toast.error(res.error); return; }
    toast.success("Group created!");
    reset();
    setShowForm(false);
    mutate();
  }

  return (
    <div className="min-h-screen max-w-lg mx-auto px-6 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard" className="min-h-[48px] min-w-[48px] flex items-center justify-center text-zinc-400 hover:text-white">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold">Groups</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="ml-auto flex items-center gap-2 min-h-[48px] px-4 rounded-xl bg-brand-purple text-white text-sm font-semibold hover:opacity-90"
        >
          <PlusCircle size={16} /> New group
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit(onSubmit)} className="mb-8 p-5 rounded-xl border border-zinc-700 bg-zinc-900 flex flex-col gap-4">
          <h2 className="font-semibold">Create group</h2>
          <div>
            <input {...register("name")} placeholder="Group name" className="w-full min-h-[48px] rounded-xl border border-zinc-700 bg-zinc-800 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal" />
            {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
          </div>
          <input {...register("description")} placeholder="Description (optional)" className="w-full min-h-[48px] rounded-xl border border-zinc-700 bg-zinc-800 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal" />
          <div>
            <input {...register("currency")} placeholder="Currency (USD)" className="w-full min-h-[48px] rounded-xl border border-zinc-700 bg-zinc-800 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal" />
            {errors.currency && <p className="mt-1 text-xs text-red-400">{errors.currency.message}</p>}
          </div>
          <button type="submit" disabled={isSubmitting} className="min-h-[48px] rounded-xl bg-brand-purple font-semibold text-white hover:opacity-90 disabled:opacity-50">
            {isSubmitting ? "Creating…" : "Create group"}
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
