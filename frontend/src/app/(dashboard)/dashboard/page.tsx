"use client";

import { DollarSign, Users, Receipt } from "lucide-react";
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

  const [totalExpenses, setTotalExpenses] = useState(0);

  // Fetch expenses count for all groups
  useEffect(() => {
    if (!groups || groups.length === 0) {
      setTotalExpenses(0);
      return;
    }

    // Fetch expenses count only - simpler and more reliable
    Promise.all(
      groups.map(async (group) => {
        try {
          const expenses = await apiGet<any[]>(`/api/expenses/group/${group.id}`).then((r) => r.data ?? []);
          return expenses.length;
        } catch (error) {
          console.error(`Failed to fetch expenses for group ${group.id}:`, error);
          return 0;
        }
      }),
    ).then((counts) => {
      const total = counts.reduce((sum, count) => sum + count, 0);
      setTotalExpenses(total);
    }).catch((err) => {
      console.error("Error fetching expenses:", err);
      setTotalExpenses(0);
    });
  }, [groups]);

  return (
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
                value={formatCents(0, "USD")}
                icon={<DollarSign />}
                color="yellow"
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
  );
}
