"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { register as registerUser } from "@/lib/auth";

const schema = z.object({
  email: z.string().email("Invalid email"),
  display_name: z.string().min(1, "Name is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormValues = z.infer<typeof schema>;

export default function SignupPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    const result = await registerUser(values.email, values.password, values.display_name);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Account created!");
      router.push("/dashboard");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="mb-8 text-3xl font-bold">Create account</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div>
            <input
              {...register("display_name")}
              placeholder="Your name"
              className="w-full min-h-[48px] rounded-xl border border-zinc-700 bg-zinc-900 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal"
            />
            {errors.display_name && (
              <p className="mt-1 text-xs text-red-400">{errors.display_name.message}</p>
            )}
          </div>
          <div>
            <input
              {...register("email")}
              type="email"
              placeholder="Email"
              className="w-full min-h-[48px] rounded-xl border border-zinc-700 bg-zinc-900 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal"
            />
            {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
          </div>
          <div>
            <input
              {...register("password")}
              type="password"
              placeholder="Password"
              className="w-full min-h-[48px] rounded-xl border border-zinc-700 bg-zinc-900 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal"
            />
            {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="min-h-[48px] rounded-xl bg-brand-purple font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
          >
            {isSubmitting ? "Creating account…" : "Create account"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-zinc-500">
          Already have an account?{" "}
          <Link href="/login" className="text-brand-teal hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
