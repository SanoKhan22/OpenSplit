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

export default function DashboardPage() {
  const { data: groups, isLoading } = useSWR("/api/groups", (url: string) =>
    apiGet<Group[]>(url).then((r) => r.data ?? []),
  );

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
                value={formatCents(0, "USD")}
                icon={<DollarSign />}
                color="yellow"
                trend={{ value: 0, isPositive: true }}
              />
              <StatCard
                title="Active Groups"
                value={groups?.length || 0}
                icon={<Users />}
                color="purple"
              />
              <StatCard title="Recent Expenses" value={0} icon={<Receipt />} color="neutral" />
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
