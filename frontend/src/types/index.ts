export interface User {
  id: string;
  email: string | null;
  display_name: string | null;
  avatar_url: string | null;
  is_guest: boolean;
  created_at: string;
}

export interface Group {
  id: string;
  name: string;
  description: string | null;
  currency: string;
  created_by_id: string;
  created_at: string;
}

export interface GroupMember {
  id: string;
  group_id: string;
  user_id: string;
  is_admin: boolean;
  nickname: string | null;
}

export interface Split {
  id: string;
  expense_id: string;
  user_id: string;
  share_cents: number; // always cents
  is_settled: boolean;
}

export interface Expense {
  id: string;
  group_id: string;
  paid_by_id: string;
  title: string;
  amount_cents: number; // always cents
  currency: string;
  category: string | null;
  notes: string | null;
  receipt_url: string | null;
  splits: Split[];
  created_at: string;
}

export interface Settlement {
  id: string;
  group_id: string;
  from_user_id: string;
  to_user_id: string;
  amount_cents: number; // always cents
  currency: string;
  notes: string | null;
  created_at: string;
}

export interface BalanceTransfer {
  from_user_id: string;
  to_user_id: string;
  amount_cents: number;
}

/** Format cents to display string. FX conversion at display time only. */
export function formatCents(cents: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(cents / 100);
}
