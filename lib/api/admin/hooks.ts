"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as menuApi from "./menu";
export { authQueryKeys, useLogin, useLogout, useMe } from "../shared/auth-hooks";

export const queryKeys = {
  categories: (params: menuApi.ListCategoriesParams) => ["admin", "categories", params] as const,
  category: (id: string) => ["admin", "category", id] as const,
  sections: (params?: menuApi.ListSectionsParams) =>
    ["admin", "sections", params ?? null] as const,
  menuItems: (params: menuApi.ListMenuItemsParams) => ["admin", "menu-items", params] as const,
  menuItem: (id: string) => ["admin", "menu-item", id] as const,
  temporaryPrices: (menuItemId: string) => ["admin", "menu-item", menuItemId, "temporary-prices"] as const,
};

export function useCategories(params: menuApi.ListCategoriesParams) {
  return useQuery({
    queryKey: queryKeys.categories(params),
    queryFn: ({ signal }) => menuApi.listCategories(params, signal),
  });
}

export function useCategory(id: string | null, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: id ? queryKeys.category(id) : ["admin", "category", null],
    queryFn: ({ signal }) => {
      if (!id) throw new Error("Category id is required");
      return menuApi.getCategory(id, signal);
    },
    enabled: options?.enabled ?? !!id,
  });
}

export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: Parameters<typeof menuApi.createCategory>[0]) => menuApi.createCategory(body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "categories"] }),
  });
}

export function useUpdateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: { id: string; body: Parameters<typeof menuApi.updateCategory>[1] }) =>
      menuApi.updateCategory(vars.id, vars.body),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["admin", "categories"] });
      qc.invalidateQueries({ queryKey: queryKeys.category(vars.id) });
    },
  });
}

export function useSetCategoryEnabled() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: { id: string; enabled: boolean }) => menuApi.setCategoryEnabled(vars.id, vars.enabled),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["admin", "categories"] });
      qc.invalidateQueries({ queryKey: queryKeys.category(vars.id) });
    },
  });
}

export function useReorderCategories() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (categoryIds: string[]) => menuApi.reorderCategories(categoryIds),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "categories"] }),
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => menuApi.deleteCategory(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "categories"] }),
  });
}

export function useSections(params?: menuApi.ListSectionsParams) {
  return useQuery({
    queryKey: queryKeys.sections(params),
    queryFn: ({ signal }) => menuApi.listSections(params, signal),
  });
}

export function useCreateSection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: menuApi.CreateSectionInput) => menuApi.createSection(body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "sections"] }),
  });
}

export function useUpdateSection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: { id: string; body: menuApi.UpdateSectionInput }) =>
      menuApi.updateSection(vars.id, vars.body),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["admin", "sections"] });
      qc.invalidateQueries({ queryKey: ["admin", "section", vars.id] });
    },
  });
}

export function useSetSectionEnabled() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: { id: string; enabled: boolean }) =>
      menuApi.setSectionEnabled(vars.id, vars.enabled),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "sections"] }),
  });
}

export function useReorderSections() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: { categoryId: string; sectionIds: string[] }) =>
      menuApi.reorderSections(vars.categoryId, vars.sectionIds),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "sections"] }),
  });
}

export function useDeleteSection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => menuApi.deleteSection(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "sections"] }),
  });
}

export function useMenuItems(params: menuApi.ListMenuItemsParams) {
  return useQuery({
    queryKey: queryKeys.menuItems(params),
    queryFn: ({ signal }) => menuApi.listMenuItems(params, signal),
  });
}

export function useMenuItem(id: string | null, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: id ? queryKeys.menuItem(id) : ["admin", "menu-item", null],
    queryFn: ({ signal }) => {
      if (!id) throw new Error("Menu item id is required");
      return menuApi.getMenuItem(id, signal);
    },
    enabled: (options?.enabled ?? !!id) && !!id,
  });
}

export function useCreateMenuItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: menuApi.CreateMenuItemInput) => menuApi.createMenuItem(body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "menu-items"] }),
  });
}

export function useUpdateMenuItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: { id: string; body: menuApi.UpdateMenuItemInput }) =>
      menuApi.updateMenuItem(vars.id, vars.body),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["admin", "menu-items"] });
      qc.invalidateQueries({ queryKey: queryKeys.menuItem(vars.id) });
    },
  });
}

export function useSetMenuItemAvailability() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: { id: string; available: boolean }) =>
      menuApi.setMenuItemAvailability(vars.id, vars.available),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "menu-items"] }),
  });
}

export function useDeleteMenuItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => menuApi.deleteMenuItem(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "menu-items"] }),
  });
}

