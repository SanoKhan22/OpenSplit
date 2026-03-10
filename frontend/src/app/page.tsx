"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { loginAsGuest } from "@/lib/auth";

export default function HomePage() {
  const router = useRouter();
  const [loadingGuest, setLoadingGuest] = useState(false);

  async function handleGuest() {
    setLoadingGuest(true);
    const { error } = await loginAsGuest();
    if (error) {
      toast.error(error);
      setLoadingGuest(false);
      return;
    }
    router.push("/dashboard");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <div className="mb-8 flex items-center gap-3">
        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-brand-teal to-brand-purple" />
        <h1 className="text-4xl font-bold tracking-tight">OpenSplit</h1>
      </div>
      <p className="mb-10 max-w-sm text-zinc-400">
        Split bills effortlessly with friends, roommates, and travel groups.
      </p>
      <div className="flex flex-col gap-4 w-full max-w-xs">
        <Link
          href="/login"
          className="flex min-h-[48px] items-center justify-center rounded-xl bg-brand-purple px-6 font-semibold text-white transition hover:opacity-90"
        >
          Sign in
        </Link>
        <Link
          href="/signup"
          className="flex min-h-[48px] items-center justify-center rounded-xl border border-zinc-700 px-6 font-semibold text-zinc-200 transition hover:bg-zinc-800"
        >
          Create account
        </Link>
        <button
          onClick={handleGuest}
          disabled={loadingGuest}
          className="text-sm text-zinc-500 hover:text-zinc-300 transition disabled:opacity-50"
        >
          {loadingGuest ? "Setting up guest…" : "Continue as guest →"}
        </button>
      </div>
    </main>
  );
}
