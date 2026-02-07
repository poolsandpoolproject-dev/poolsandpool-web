/**
 * Authentication Utilities
 * Dummy authentication logic (will be replaced with API integration)
 */

import { auth } from "@/lib/api";

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;

  return document.cookie.includes("admin_token=");
}

export function getCurrentUser() {
  if (typeof window === "undefined") return null;

  const match = document.cookie.match(/(?:^|;\s*)admin_token=([^;]+)/);
  const token = match ? decodeURIComponent(match[1]) : null;

  if (!token) return null;

  return {
    token,
  };
}

export async function login(email: string, password: string): Promise<boolean> {
  if (typeof window === "undefined") return false;

  try {
    const res = await auth.login(email, password);
    const token = res.accessToken;
    const maxAge = typeof res.expiresIn === "number" ? res.expiresIn : 60 * 60 * 12;

    const secure = window.location.protocol === "https:" ? "; secure" : "";
    document.cookie = `admin_token=${encodeURIComponent(token)}; path=/; max-age=${maxAge}; samesite=lax${secure}`;

    return true;
  } catch {
    return false;
  }
}

export async function logout(): Promise<void> {
  if (typeof window === "undefined") return;

  try {
    await auth.logout();
  } catch {
  } finally {
    document.cookie = "admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.href = "/admin/login";
  }
}
