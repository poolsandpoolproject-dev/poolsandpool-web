import { apiRequest } from "./client";
import type { AdminUser, AuthLoginResponse } from "../types";

export function login(email: string, password: string, signal?: AbortSignal) {
  return apiRequest<AuthLoginResponse>("/auth/login", {
    method: "POST",
    body: { email, password },
    signal,
  });
}

export function me(signal?: AbortSignal) {
  return apiRequest<AdminUser>("/auth/me", { method: "GET", auth: true, signal });
}

export function logout(signal?: AbortSignal) {
  return apiRequest<{ success: boolean }>("/auth/logout", { method: "POST", auth: true, signal });
}

