import type { Id } from "./common";

export type AdminRole = "admin";

export type AdminUser = {
  id: Id;
  email: string;
  name?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  role: AdminRole;
};

export type AuthLoginResponse = {
  user: AdminUser;
  accessToken: string;
  expiresIn: number;
};

