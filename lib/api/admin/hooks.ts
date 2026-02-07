"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as menuApi from "./menu";
export { authQueryKeys, useLogin, useLogout, useMe } from "../shared/auth-hooks";

export const queryKeys = {
  categories: (params: menuApi.ListCategoriesParams) => ["admin", "categories", params] as const,
  category: (id: string) => ["admin", "category", id] as const,
  sections: (params?: { categoryId?: string; includeDisabled?: boolean }) =>
    ["admin", "sections", params?.categoryId ?? null, params?.includeDisabled ?? true] as const,
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

export function useSections(params?: { categoryId?: string; includeDisabled?: boolean }) {
  return useQuery({
    queryKey: queryKeys.sections(params),
    queryFn: ({ signal }) => menuApi.listSections(params, signal),
  });
}

export function useMenuItems(params: menuApi.ListMenuItemsParams) {
  return useQuery({
    queryKey: queryKeys.menuItems(params),
    queryFn: ({ signal }) => menuApi.listMenuItems(params, signal),
  });
}

