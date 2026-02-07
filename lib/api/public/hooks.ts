"use client";

import { useQuery } from "@tanstack/react-query";
import * as menuApi from "./menu";

export const queryKeys = {
  categories: () => ["public", "menu", "categories"] as const,
  categoryBySlug: (slug: string) => ["public", "menu", "categories", slug] as const,
  overview: () => ["public", "menu", "overview"] as const,
};

export function usePublicCategories() {
  return useQuery({
    queryKey: queryKeys.categories(),
    queryFn: ({ signal }) => menuApi.listCategories(signal),
  });
}

export function usePublicCategoryBySlug(slug: string) {
  return useQuery({
    queryKey: queryKeys.categoryBySlug(slug),
    queryFn: ({ signal }) => menuApi.getCategoryBySlug(slug, signal),
    enabled: !!slug,
  });
}

export function usePublicMenuOverview() {
  return useQuery({
    queryKey: queryKeys.overview(),
    queryFn: ({ signal }) => menuApi.getMenuOverview(signal),
  });
}

