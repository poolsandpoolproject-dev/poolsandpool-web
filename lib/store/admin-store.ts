/**
 * Admin Store - Zustand state management for admin dashboard
 */

import { create } from "zustand";

interface AdminState {
  isAuthenticated: boolean;
  user: {
    id: string;
    email: string;
    name: string;
    role: "staff" | "manager" | "owner";
  } | null;
  
  // UI State
  sidebarOpen: boolean;
  currentView: string;
  
  // Actions
  login: (user: AdminState["user"]) => void;
  logout: () => void;
  setSidebarOpen: (open: boolean) => void;
  setCurrentView: (view: string) => void;
}

export const useAdminStore = create<AdminState>((set) => ({
  isAuthenticated: false,
  user: null,
  sidebarOpen: true,
  currentView: "dashboard",

  login: (user) => set({ isAuthenticated: true, user }),
  logout: () => set({ isAuthenticated: false, user: null }),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setCurrentView: (view) => set({ currentView: view }),
}));
