"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as authApi from "./auth";

export const authQueryKeys = {
  me: () => ["auth", "me"] as const,
};

function hasAdminTokenCookie() {
  if (typeof document === "undefined") return false;
  return /(?:^|;\s*)admin_token=/.test(document.cookie);
}

export function useMe(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: authQueryKeys.me(),
    queryFn: ({ signal }) => authApi.me(signal),
    enabled: options?.enabled ?? hasAdminTokenCookie(),
    retry: false,
  });
}

export function useLogin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: { email: string; password: string }) => authApi.login(vars.email, vars.password),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: authQueryKeys.me() });
    },
  });
}

export function useLogout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      qc.removeQueries({ queryKey: authQueryKeys.me() });
    },
  });
}

