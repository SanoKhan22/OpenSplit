"use client";

import { DollarSign, Users, Receipt } from "lucide-react";
import { DashboardLayout } from "@/components/layout";
import {
  StatCard,
  FloatingActionButton,
  Card,
  DashboardSkeleton,
  EmptyState,
} from "@/components/ui";
import useSWR from "swr";
import { apiGet } from "@/lib/api";
import type { Group } from "@/types";
import { formatCents } from "@/types";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const { data: groups, isLoading } = useSWR("/api/groups", (url: string) =>
    apiGet<Group[]>(url).then((r) => r.data ?? []),
  );

  const [totalBalance, setTotalBalance] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);

  // Fetch balances and expenses for all groups
  useEffect(() => {
    if (!groups || groups.length === 0) return;

    Promise.all(
      groups.map(async (group) => {
        const [balances, expenses] = await Promise.all([
          apiGet<any[]>(`/api/settlements/group/${group.id}/balances`).then((r) => r.data ?? []),
          apiGet<any[]>(`/api/expenses/group/${group.id}`).then((r) => r.data ?? []),
        ]);
        return { balances, expenses };
      }),
    ).then((results) => {
      // Calculate total balance (sum of what you're owed)
      const balance = results.reduce((sum, { balances }) => {
        const userBalance = balances.reduce((acc: number, b: any) => {
          // If amount_cents is negative, you owe; if positive, you're owed
          return acc + (b.amount_cents || 0);
        }, 0);
        return sum + userBalance;
      }, 0);

      // Count total expenses
      const expenseCount = results.reduce((sum, { expenses }) => sum + expenses.length, 0);

      setTotalBalance(balance);
      setTotalExpenses(expenseCount);
    });
  }, [groups]);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">Dashboard</h1>
          <p className="text-text-secondary">Welcome back! Here's your financial overview.</p>
        </div>

        {isLoading && <DashboardSkeleton />}

        {!isLoading && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard
                title="Total Balance"
                value={formatCents(Math.abs(totalBalance), groups?.[0]?.currency || "USD")}
                icon={<DollarSign />}
                color="yellow"
                trend={
                  totalBalance !== 0
                    ? { value: Math.abs(totalBalance), isPositive: totalBalance > 0 }
                    : undefined
                }
              />
              <StatCard
                title="Active Groups"
                value={groups?.length || 0}
                icon={<Users />}
                color="purple"
              />
              <StatCard title="Recent Expenses" value={totalExpenses} icon={<Receipt />} color="neutral" />
            </div>

            {/* Recent Activity */}
            <div>
              <h2 className="text-xl font-bold text-text-primary mb-4">Recent Activity</h2>
              {!groups || groups.length === 0 ? (
                <Card>
                  <EmptyState
                    icon="📊"
                    title="No activity yet"
                    description="Create your first group to start tracking expenses with friends"
                    action={{
                      label: "Create Group",
                      onClick: () => (window.location.href = "/groups"),
                    }}
                  />
                </Card>
              ) : (
                <div className="space-y-3">
                  {groups.map((group) => (
                    <Card
                      key={group.id}
                      hover
                      className="cursor-pointer"
                      onClick={() => (window.location.href = `/groups/${group.id}`)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-text-primary">{group.name}</h3>
                          <p className="text-sm text-text-secondary">{group.currency}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-text-primary">→</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* Floating Action Button */}
        <FloatingActionButton
          onClick={() => {
            window.location.href = "/expenses";
          }}
        />
      </div>
    </DashboardLayout>
  );
}
