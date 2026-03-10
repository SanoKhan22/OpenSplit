"use client";

import useSWR from "swr";
import { apiGet, apiPost } from "@/lib/api";
import type { Group } from "@/types";
import { toast } from "sonner";

interface CreateGroupPayload {
  name: string;
  description?: string;
  currency?: string;
}

interface UseGroupsReturn {
  groups: Group[];
  isLoading: boolean;
  createGroup: (payload: CreateGroupPayload) => Promise<Group | null>;
  mutate: () => void;
}

export function useGroups(): UseGroupsReturn {
  const { data, isLoading, mutate } = useSWR("/api/groups", (url: string) =>
    apiGet<Group[]>(url).then((r) => r.data ?? []),
  );

  async function createGroup(payload: CreateGroupPayload): Promise<Group | null> {
    const res = await apiPost<Group>("/api/groups", payload);
    if (res.error) {
      toast.error(res.error);
      return null;
    }
    mutate();
    return res.data;
  }

  return {
    groups: data ?? [],
    isLoading,
    createGroup,
    mutate,
  };
}
