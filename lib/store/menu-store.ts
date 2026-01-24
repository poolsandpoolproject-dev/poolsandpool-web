/**
 * Menu Store - Zustand state management for menu data
 */

import { create } from "zustand";
import type { Category, Section, MenuItem } from "@/lib/data";

interface MenuState {
  categories: Category[];
  sections: Section[];
  menuItems: MenuItem[];
  selectedCategory: Category | null;
  selectedSection: Section | null;
  
  // Actions
  setCategories: (categories: Category[]) => void;
  setSections: (sections: Section[]) => void;
  setMenuItems: (items: MenuItem[]) => void;
  setSelectedCategory: (category: Category | null) => void;
  setSelectedSection: (section: Section | null) => void;
  
  // Getters
  getSectionsByCategory: (categoryId: string) => Section[];
  getMenuItemsByCategory: (categoryId: string) => MenuItem[];
  getMenuItemsBySection: (sectionId: string) => MenuItem[];
}

export const useMenuStore = create<MenuState>((set, get) => ({
  categories: [],
  sections: [],
  menuItems: [],
  selectedCategory: null,
  selectedSection: null,

  setCategories: (categories) => set({ categories }),
  setSections: (sections) => set({ sections }),
  setMenuItems: (menuItems) => set({ menuItems }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setSelectedSection: (section) => set({ selectedSection: section }),

  getSectionsByCategory: (categoryId) => {
    return get().sections.filter((s) => s.categoryId === categoryId && s.enabled);
  },

  getMenuItemsByCategory: (categoryId) => {
    return get().menuItems.filter((item) => item.category === categoryId && item.available);
  },

  getMenuItemsBySection: (sectionId) => {
    return get().menuItems.filter((item) => item.section === sectionId && item.available);
  },
}));
