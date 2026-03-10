"use client";

import useSWR from "swr";
import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Upload, ArrowLeft, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { apiGet, apiPost } from "@/lib/api";
import type { Group, Expense, User } from "@/types";
import { formatCents } from "@/types";

interface GroupMember {
  id: string;
  user_id: string;
  user_display_name: string | null;
  user_email: string | null;
}

const schema = z.object({
  group_id: z.string().uuid("Select a group"),
  title: z.string().min(1, "Title required"),
  amount_cents: z.coerce.number().int().positive("Amount must be positive"),
  currency: z.string().length(3),
  category: z.string().optional(),
  notes: z.string().optional(),
  splits: z.array(z.object({
    user_id: z.string().uuid("Select a user"),
    share_cents: z.coerce.number().int().positive("Share must be positive"),
  })).min(1, "At least one split required"),
});
type FormValues = z.infer<typeof schema>;

export default function ExpensesPage() {
  const [showForm, setShowForm] = useState(false);
  const { data: groups } = useSWR("/api/groups", (url: string) => apiGet<Group[]>(url).then(r => r.data ?? []));
  const { data: currentUser } = useSWR("/api/auth/me", (url: string) => apiGet<User>(url).then(r => r.data));
  const [selectedGroup, setSelectedGroup] = useState<string>("");
  const [formGroup, setFormGroup] = useState<string>("");

  const { data: members } = useSWR(
    formGroup ? `/api/groups/${formGroup}/members` : null,
    (url: string) => apiGet<GroupMember[]>(url).then(r => r.data ?? []),
  );

  const { data: expenses, isLoading, mutate } = useSWR(
    selectedGroup ? `/api/expenses/group/${selectedGroup}` : null,
    (url: string) => apiGet<Expense[]>(url).then(r => r.data ?? []),
  );

  const { register, handleSubmit, control, reset, watch, setValue, formState: { errors, isSubmitting } } =
    useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { currency: "USD", splits: [{ user_id: "", share_cents: 0 }] } });

  const { fields, append, remove } = useFieldArray({ control, name: "splits" });
  const watchedAmount = watch("amount_cents");
  const watchedGroupId = watch("group_id");

  // Auto-populate splits when group or amount changes
  useEffect(() => {
    if (formGroup && members && members.length > 0 && watchedAmount > 0) {
      const equalShare = Math.floor(watchedAmount / members.length);
      const newSplits = members.map(m => ({ user_id: m.user_id, share_cents: equalShare }));
      setValue("splits", newSplits);
    }
  }, [formGroup, members, watchedAmount, setValue]);

  async function onSubmit(values: FormValues) {
    const res = await apiPost<Expense>("/api/expenses", values);
    if (res.error) { toast.error(res.error); return; }
    toast.success("Expense added!");
    reset();
    setShowForm(false);
    mutate();
  }

  async function handleReceiptUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/expenses/scan-receipt", {
      method: "POST",
      headers: { Authorization: `Bearer ${localStorage.getItem("os_access_token")}` },
      body: form,
    });
    const json = await res.json();
    if (!res.ok) { toast.error(json.detail ?? "Upload failed"); return; }
    toast.success(`Receipt queued (job: ${json.data.job_id}) — check back shortly`);
  }

  return (
    <div className="min-h-screen max-w-lg mx-auto px-6 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard" className="min-h-[48px] min-w-[48px] flex items-center justify-center text-zinc-400 hover:text-white">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold">Expenses</h1>
        <div className="ml-auto flex gap-2">
          <label className="flex items-center gap-2 min-h-[48px] px-3 rounded-xl border border-zinc-700 text-zinc-300 text-sm cursor-pointer hover:bg-zinc-800">
            <Upload size={16} /> Scan receipt
            <input type="file" accept="image/*" className="hidden" onChange={handleReceiptUpload} />
          </label>
          <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 min-h-[48px] px-4 rounded-xl bg-brand-purple text-white text-sm font-semibold hover:opacity-90">
            <Plus size={16} /> Add
          </button>
        </div>
      </div>

      {/* Group filter */}
      <select
        value={selectedGroup}
        onChange={(e) => setSelectedGroup(e.target.value)}
        className="w-full min-h-[48px] mb-6 rounded-xl border border-zinc-700 bg-zinc-900 px-4 text-sm focus:outline-none"
      >
        <option value="">Select a group…</option>
        {groups?.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
      </select>

      {showForm && (
        <form onSubmit={handleSubmit(onSubmit)} className="mb-8 p-5 rounded-xl border border-zinc-700 bg-zinc-900 flex flex-col gap-4">
          <h2 className="font-semibold">Add expense</h2>
          <div>
            <select
              {...register("group_id")}
              onChange={(e) => { register("group_id").onChange(e); setFormGroup(e.target.value); }}
              className="w-full min-h-[48px] rounded-xl border border-zinc-700 bg-zinc-800 px-4 text-sm focus:outline-none"
            >
              <option value="">Select group…</option>
              {groups?.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
            </select>
            {errors.group_id && <p className="text-xs text-red-400 mt-1">{errors.group_id.message}</p>}
          </div>
          <div>
            <input {...register("title")} placeholder="Title (e.g. Dinner)" className="w-full min-h-[48px] rounded-xl border border-zinc-700 bg-zinc-800 px-4 text-sm focus:outline-none" />
            {errors.title && <p className="text-xs text-red-400 mt-1">{errors.title.message}</p>}
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <input {...register("amount_cents")} type="number" placeholder="Amount (cents)" className="w-full min-h-[48px] rounded-xl border border-zinc-700 bg-zinc-800 px-4 text-sm focus:outline-none" />
              {errors.amount_cents && <p className="text-xs text-red-400 mt-1">{errors.amount_cents.message}</p>}
            </div>
            <input {...register("currency")} placeholder="USD" className="w-20 min-h-[48px] rounded-xl border border-zinc-700 bg-zinc-800 px-4 text-sm focus:outline-none" />
          </div>
          <input {...register("category")} placeholder="Category (optional)" className="w-full min-h-[48px] rounded-xl border border-zinc-700 bg-zinc-800 px-4 text-sm focus:outline-none" />
          <div>
            <p className="text-sm text-zinc-400 mb-2">Splits (auto-calculated equally)</p>
            {!formGroup && <p className="text-xs text-zinc-500 mb-2">Select a group first</p>}
            {formGroup && !members && <p className="text-xs text-zinc-500 mb-2">Loading members...</p>}
            {formGroup && members && members.length === 0 && <p className="text-xs text-zinc-500 mb-2">No members in this group</p>}
            {formGroup && members && members.length > 0 && fields.map((field, i) => (
              <div key={field.id} className="flex gap-2 mb-2 items-start">
                <div className="flex-1">
                  <select {...register(`splits.${i}.user_id`)} className="w-full min-h-[48px] rounded-xl border border-zinc-700 bg-zinc-800 px-3 text-sm focus:outline-none">
                    <option value="">Select user…</option>
                    {members.map(m => (
                      <option key={m.user_id} value={m.user_id}>
                        {m.user_display_name || m.user_email || `User ${m.user_id.slice(0, 8)}`}
                      </option>
                    ))}
                  </select>
                  {errors.splits?.[i]?.user_id && <p className="text-xs text-red-400 mt-1">{errors.splits[i].user_id?.message}</p>}
                </div>
                <div className="w-28">
                  <input {...register(`splits.${i}.share_cents`)} type="number" placeholder="Cents" className="w-full min-h-[48px] rounded-xl border border-zinc-700 bg-zinc-800 px-3 text-sm focus:outline-none" />
                  {errors.splits?.[i]?.share_cents && <p className="text-xs text-red-400 mt-1">{errors.splits[i].share_cents?.message}</p>}
                </div>
                {fields.length > 1 && (
                  <button type="button" onClick={() => remove(i)} className="min-h-[48px] min-w-[48px] flex items-center justify-center text-red-400"><Trash2 size={16} /></button>
                )}
              </div>
            ))}
            {formGroup && members && members.length > 0 && (
              <button type="button" onClick={() => append({ user_id: "", share_cents: 0 })} className="text-xs text-brand-teal hover:underline">+ Add split</button>
            )}
          </div>
          <button type="submit" disabled={isSubmitting || !formGroup} className="min-h-[48px] rounded-xl bg-brand-purple font-semibold text-white hover:opacity-90 disabled:opacity-50">
            {isSubmitting ? "Saving…" : "Add expense"}
          </button>
        </form>
      )}

      {isLoading && <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-16 rounded-xl bg-zinc-900 animate-pulse" />)}</div>}
      {expenses && expenses.length > 0 && (
        <ul className="space-y-3">
          {expenses.map(exp => (
            <li key={exp.id} className="flex items-center justify-between min-h-[64px] px-4 rounded-xl bg-zinc-900 border border-zinc-800">
              <div>
                <p className="font-medium">{exp.title}</p>
                <p className="text-xs text-zinc-500">{exp.category ?? "Uncategorized"}</p>
              </div>
              <p className="font-semibold text-brand-teal">{formatCents(exp.amount_cents, exp.currency)}</p>
            </li>
          ))}
        </ul>
      )}
      {expenses && expenses.length === 0 && selectedGroup && (
        <p className="text-center text-zinc-500 py-12">No expenses yet.</p>
      )}
    </div>
  );
}
