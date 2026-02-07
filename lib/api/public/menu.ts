import { apiRequest } from "../shared/client";
import type { Category } from "../types";

export type PublicCategory = Pick<Category, "id" | "name" | "slug" | "description" | "imageUrl" | "order">;

export type PublicMenuItem = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  basePrice: number;
  currentPrice: number;
  hasActiveTemporaryPrice: boolean;
  temporaryPrice?: {
    ruleName: string;
    price: number;
    startAt: string;
    endAt: string;
  } | null;
};

export type PublicSectionWithItems = {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string | null;
  order?: number | null;
  items: PublicMenuItem[];
};

export type PublicCategoryBySlugResponse = {
  category: PublicCategory;
  sections: PublicSectionWithItems[];
};

export function listCategories(signal?: AbortSignal) {
  return apiRequest<PublicCategory[]>("/public/menu/categories", { method: "GET", signal });
}

export function getCategoryBySlug(slug: string, signal?: AbortSignal) {
  return apiRequest<PublicCategoryBySlugResponse>(`/public/menu/categories/${slug}`, { method: "GET", signal });
}

export type PublicMenuOverviewItem = {
  category: PublicCategory;
  sections: Array<Pick<PublicSectionWithItems, "id" | "name" | "slug" | "imageUrl" | "order">>;
};

export function getMenuOverview(signal?: AbortSignal) {
  return apiRequest<PublicMenuOverviewItem[]>("/public/menu/overview", { method: "GET", signal });
}

